from typing import Any, Dict, List

from flask import Blueprint, request

from .supabase_client import get_admin_client
from .utils import ok, fail, build_worker_profile


profissionais_bp = Blueprint("profissionais", __name__, url_prefix="/api/profissionais")


@profissionais_bp.get("/estatisticas/<usuario_id>")
def estatisticas_profissional(usuario_id: str):
    """Retorna estatísticas de um profissional (projetos concluídos, etc.)
    ---
    tags:
      - Profissionais
    parameters:
      - name: usuario_id
        in: path
        type: string
        required: true
        description: ID do usuário profissional
    responses:
      200:
        description: Estatísticas do profissional
        schema:
          type: object
          properties:
            projetos_concluidos:
              type: integer
            total_contratacoes:
              type: integer
      500:
        description: Erro ao buscar estatísticas
    """
    try:
        admin = get_admin_client()
        if not admin:
            return fail("Erro de conexão com o banco de dados", 500)
        
        # Contar contratações concluídas onde o usuário foi contratado
        projetos_concluidos = 0
        total_contratacoes = 0
        try:
            # Tentar buscar com retry para lidar com WinError 10035
            max_tentativas = 2
            for tentativa in range(max_tentativas):
                try:
                    contratacoes = (
                        admin.table("contratacoes")
                        .select("id, status")
                        .eq("usuario_id_contratado", usuario_id)
                        .execute()
                        .data
                        or []
                    )
                    projetos_concluidos = len([c for c in contratacoes if c.get("status") == "concluido"])
                    total_contratacoes = len(contratacoes)
                    break  # Sucesso, sair do loop
                except Exception as e:
                    error_str = str(e)
                    is_network_error = (
                        "WinError 10035" in error_str or
                        "10035" in error_str or
                        "socket" in error_str.lower() or
                        "network" in error_str.lower()
                    )
                    if is_network_error and tentativa < max_tentativas - 1:
                        # Aguardar um pouco antes de tentar novamente
                        import time
                        time.sleep(0.3)
                        continue
                    # Se não for erro de rede ou última tentativa, logar e retornar zeros
                    if not is_network_error:
                        import traceback
                        print(f"[AVISO] Erro ao buscar contratações para {usuario_id}: {e}")
                    break
        except Exception:
            # Se houver erro geral, retorna zeros silenciosamente
            pass
        
        return ok({
            "projetos_concluidos": projetos_concluidos,
            "total_contratacoes": total_contratacoes
        })
    except Exception as e:
        import traceback
        print(f"[ERRO] Falha ao buscar estatísticas: {e}")
        print(traceback.format_exc())
        return fail(f"Falha ao buscar estatísticas: {str(e)}", 500)


@profissionais_bp.get("")
def listar_profissionais():
    """Listar profissionais
    Lista profissionais cadastrados na plataforma com filtros opcionais
    ---
    tags:
      - Profissionais
    parameters:
      - name: busca
        in: query
        type: string
        description: Busca por nome, descrição ou categorias
        example: "eletricista"
      - name: categoria
        in: query
        type: string
        description: Filtrar por categoria específica
        example: "eletrica"
      - name: localizacao
        in: query
        type: string
        description: Filtrar por cidade/localização
        example: "São Paulo"
      - name: page
        in: query
        type: integer
        description: Número da página (padrão: 1)
      - name: page_size
        in: query
        type: integer
        description: Itens por página (padrão: 20, máximo: 100)
    responses:
      200:
        description: Lista de profissionais
        schema:
          type: object
          properties:
            items:
              type: array
              items:
                $ref: '#/definitions/Usuario'
      500:
        description: Erro ao listar profissionais
        schema:
          type: object
          properties:
            error:
              type: string
    """
    from .utils import execute_with_retry, paginate_params, build_worker_profile_batch
    
    busca = (request.args.get("busca") or "").strip().lower()
    categoria = (request.args.get("categoria") or "").strip()
    localizacao = (request.args.get("localizacao") or "").strip().lower()
    
    try:
        admin = get_admin_client()
        if not admin:
            return fail("Erro de conexão com o banco de dados", 500)
        
        # Paginação
        page_params = paginate_params(request.args)
        
        # Se houver filtro por categoria, obter user_ids de worker_categorias
        user_ids_filter: List[str] = []
        if categoria:
            cat_ids: List[int] = []
            try:
                res = execute_with_retry(
                    lambda: admin.table("categorias")
                        .select("id, slug, nome")
                        .or_(f"slug.eq.{categoria},nome.eq.{categoria}")
                        .execute()
                        .data or [],
                    max_attempts=2,
                    delay=0.2
                )
                cat_ids = [c.get("id") for c in res if c.get("id") is not None]
            except Exception:
                cat_ids = []
            if cat_ids:
                try:
                    rel = execute_with_retry(
                        lambda: admin.table("worker_categorias")
                            .select("user_id")
                            .in_("categoria_id", cat_ids)
                            .execute()
                            .data or [],
                        max_attempts=2,
                        delay=0.2
                    )
                    user_ids_filter = list({r.get("user_id") for r in rel if r.get("user_id")})
                except Exception:
                    user_ids_filter = []

        q = admin.table("usuarios").select("*").eq("is_worker", True)
        if user_ids_filter:
            q = q.in_("id", user_ids_filter)
        
        # Executa query com retry
        rows: List[Dict[str, Any]] = execute_with_retry(
            lambda: q.execute().data or [],
            max_attempts=3,
            delay=0.3
        )

        # Filtros locais (busca e localização)
        def match(p: Dict[str, Any]) -> bool:
            if busca:
                nome = (p.get("nome") or "").lower()
                if busca not in nome:
                    return False
            if localizacao:
                cidade = ((p.get("endereco_cidade") or "").lower())
                if localizacao not in cidade:
                    return False
            return True

        filtered = [p for p in rows if match(p)] if (busca or localizacao) else rows
        
        # Buscar todos os perfis de uma vez (otimização)
        user_ids = [p.get("id") for p in filtered if p.get("id")]
        worker_profiles_map = {}
        if user_ids:
            try:
                worker_profiles_map = build_worker_profile_batch(admin, user_ids)
            except Exception as e:
                import traceback
                print(f"[AVISO] Erro ao buscar perfis em lote: {e}")
                traceback.print_exc()
        
        # Buscar avaliações e estatísticas em lote
        avaliacoes_map = {}
        estatisticas_map = {}
        if user_ids:
            try:
                # Buscar todas as contratações de uma vez
                contratacoes = execute_with_retry(
                    lambda: admin.table("contratacoes")
                        .select("id, usuario_id_contratado, status")
                        .in_("usuario_id_contratado", user_ids)
                        .execute()
                        .data or [],
                    max_attempts=2,
                    delay=0.2
                )
                
                # Agrupar por profissional
                contratacoes_por_prof = {}
                for c in contratacoes:
                    prof_id = c.get("usuario_id_contratado")
                    if prof_id:
                        if prof_id not in contratacoes_por_prof:
                            contratacoes_por_prof[prof_id] = []
                        contratacoes_por_prof[prof_id].append(c)
                
                # Calcular estatísticas
                for prof_id, conts in contratacoes_por_prof.items():
                    estatisticas_map[prof_id] = {
                        "total_contratacoes": len(conts),
                        "projetos_concluidos": len([c for c in conts if c.get("status") == "concluido"])
                    }
                
                # Buscar avaliações
                if contratacoes:
                    cids = [c.get("id") for c in contratacoes if c.get("id")]
                    avaliacoes = execute_with_retry(
                        lambda: admin.table("avaliacoes")
                            .select("contratacao_id, nota")
                            .in_("contratacao_id", cids)
                            .execute()
                            .data or [],
                        max_attempts=2,
                        delay=0.2
                    )
                    
                    # Agrupar avaliações por profissional
                    notas_por_prof = {}
                    for av in avaliacoes:
                        cid = av.get("contratacao_id")
                        nota = av.get("nota")
                        if cid and nota:
                            # Encontrar qual profissional pertence a esta contratação
                            for c in contratacoes:
                                if c.get("id") == cid:
                                    prof_id = c.get("usuario_id_contratado")
                                    if prof_id:
                                        if prof_id not in notas_por_prof:
                                            notas_por_prof[prof_id] = []
                                        notas_por_prof[prof_id].append(nota)
                    
                    # Calcular médias
                    for prof_id, notas in notas_por_prof.items():
                        if notas:
                            avaliacoes_map[prof_id] = {
                                "media": round(sum(notas) / len(notas), 2),
                                "total": len(notas)
                            }
            except Exception as e:
                import traceback
                print(f"[AVISO] Erro ao buscar avaliações/estatísticas em lote: {e}")
                traceback.print_exc()
        
        # Montar resposta
        out: List[Dict[str, Any]] = []
        for p in filtered:
            prof_id = p.get("id")
            # Adicionar perfil worker
            p["perfil_worker"] = worker_profiles_map.get(prof_id, {})
            # Adicionar avaliações
            if prof_id in avaliacoes_map:
                p["avaliacoes"] = avaliacoes_map[prof_id]
            else:
                p["avaliacoes"] = {"media": 0, "total": 0}
            # Adicionar estatísticas
            if prof_id in estatisticas_map:
                p["estatisticas"] = estatisticas_map[prof_id]
            else:
                p["estatisticas"] = {"total_contratacoes": 0, "projetos_concluidos": 0}
            out.append(p)
        
        # Aplicar paginação
        start = page_params["offset"]
        end = start + page_params["limit"]
        paginated_items = out[start:end]
        
        return ok({
            "items": paginated_items,
            "total": len(out),
            "page": page_params["page"],
            "page_size": page_params["page_size"]
        })
    except Exception as e:
        import traceback
        print(f"[ERRO] Falha ao listar profissionais: {e}")
        print(traceback.format_exc())
        return fail(f"Falha ao listar profissionais: {str(e)}", 500)

