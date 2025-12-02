from typing import Any, Dict

from flask import Blueprint, request

from .auth import require_auth
from .supabase_client import get_admin_client
from .utils import ok, fail


chat_bp = Blueprint("chat", __name__, url_prefix="/api")


def _conversa_participa(conversa: Dict[str, Any], user_id: str) -> bool:
    return user_id in (conversa.get("usuario_a_id"), conversa.get("usuario_b_id"))


@chat_bp.get("/conversas")
@require_auth
def listar_conversas(user_id: str):
    try:
        from .utils import execute_with_retry
        admin = get_admin_client()
        # busca conversas onde usuário é A ou B com retry
        a = execute_with_retry(
            lambda: admin.table("conversas")
                .select("*")
                .eq("usuario_a_id", user_id)
                .execute()
                .data or [],
            max_attempts=3,
            delay=0.3
        )
        b = execute_with_retry(
            lambda: admin.table("conversas")
                .select("*")
                .eq("usuario_b_id", user_id)
                .execute()
                .data or [],
            max_attempts=3,
            delay=0.3
        )
        # Mesclar conversas
        merged = {c["id"]: c for c in (a + b)}
        conversas_list = list(merged.values())
        
        # Buscar última mensagem de cada conversa para ordenação (otimizado)
        conversa_ids = [c["id"] for c in conversas_list]
        ultimas_mensagens = {}
        
        if conversa_ids:
            try:
                # Buscar todas as mensagens das conversas de uma vez
                # Processar em lotes para evitar queries muito grandes
                batch_size = 30
                for i in range(0, len(conversa_ids), batch_size):
                    batch_ids = conversa_ids[i:i + batch_size]
                    try:
                        # Buscar todas as mensagens do lote ordenadas por data
                        todas_mensagens = execute_with_retry(
                            lambda: admin.table("mensagens")
                                .select("conversa_id, enviada_em")
                                .in_("conversa_id", batch_ids)
                                .order("enviada_em", desc=True)
                                .execute()
                                .data or [],
                            max_attempts=2,
                            delay=0.2
                        )
                        
                        # Agrupar por conversa_id e pegar a primeira (mais recente) de cada uma
                        for msg in todas_mensagens:
                            conv_id = msg.get("conversa_id")
                            if conv_id and conv_id not in ultimas_mensagens:
                                ultimas_mensagens[conv_id] = msg.get("enviada_em")
                    except Exception as e:
                        # Se falhar, continuar sem última mensagem para esse lote
                        print(f"[AVISO] Erro ao buscar últimas mensagens do lote: {e}")
            except Exception as e:
                # Se falhar completamente, continuar sem última mensagem
                print(f"[AVISO] Erro ao buscar últimas mensagens: {e}")
        
        # Ordenar por última mensagem (se houver) ou data de criação
        def get_sort_key(conv):
            conv_id = conv.get("id")
            # Priorizar última mensagem, senão usar data de criação
            ultima_msg_time = ultimas_mensagens.get(conv_id)
            if ultima_msg_time:
                return ultima_msg_time
            return conv.get("criado_em", "")
        
        conversas_list.sort(key=get_sort_key, reverse=True)
        return ok({"items": conversas_list})
    except Exception as e:
        return fail(f"Falha ao listar conversas: {e}", 500)


@chat_bp.post("/conversas")
@require_auth
def criar_conversa(user_id: str):
    body: Dict[str, Any] = request.get_json(silent=True) or {}
    usuario_b_id = body.get("usuario_b_id")
    if not usuario_b_id:
        return fail("usuario_b_id é obrigatório", 400)
    if usuario_b_id == user_id:
        return fail("Não é possível criar conversa consigo mesmo", 400)

    admin = get_admin_client()
    
    # Normalizar IDs para garantir ordem consistente (menor ID sempre em usuario_a_id)
    # Isso evita duplicatas quando a ordem dos usuários é invertida
    id_a = user_id if user_id < usuario_b_id else usuario_b_id
    id_b = usuario_b_id if user_id < usuario_b_id else user_id
    
    # Verificar se já existe conversa entre esses dois usuários (em qualquer ordem)
    from .utils import execute_with_retry
    try:
        # Buscar conversas onde usuario_a_id = id_a E usuario_b_id = id_b
        conversa_1 = execute_with_retry(
            lambda: admin.table("conversas")
                .select("*")
                .eq("usuario_a_id", id_a)
                .eq("usuario_b_id", id_b)
                .limit(1)
                .execute()
                .data or [],
            max_attempts=2,
            delay=0.2
        )
        
        # Buscar conversas onde usuario_a_id = id_b E usuario_b_id = id_a (ordem invertida)
        conversa_2 = execute_with_retry(
            lambda: admin.table("conversas")
                .select("*")
                .eq("usuario_a_id", id_b)
                .eq("usuario_b_id", id_a)
                .limit(1)
                .execute()
                .data or [],
            max_attempts=2,
            delay=0.2
        )
        
        # Verificar se encontrou conversa existente
        conversa_existente = None
        if conversa_1 and len(conversa_1) > 0:
            conversa_existente = conversa_1[0]
        elif conversa_2 and len(conversa_2) > 0:
            conversa_existente = conversa_2[0]
        
        if conversa_existente:
            # Retornar conversa existente
            return ok(conversa_existente, 200)
    except Exception as e:
        # Se houver erro na busca, continua e tenta criar
        import traceback
        print(f"[AVISO] Erro ao verificar conversa existente: {e}")
        traceback.print_exc()

    # Criar nova conversa usando ordem normalizada
    payload = {
        "usuario_a_id": id_a,
        "usuario_b_id": id_b,
        "contexto_tipo": body.get("contexto_tipo"),
        "contexto_id": body.get("contexto_id"),
    }
    
    try:
        res = execute_with_retry(
            lambda: admin.table("conversas").insert(payload).execute(),
            max_attempts=2,
            delay=0.2
        )
        return ok((res.data or [None])[0], 201)
    except Exception as e:
        import traceback
        
        error_str = str(e).lower()
        error_dict = {}
        error_code = None
        
        # Tentar extrair informações do erro (APIError do postgrest)
        try:
            from postgrest.exceptions import APIError
            if isinstance(e, APIError):
                # APIError tem um dict com message, code, etc.
                if hasattr(e, 'message') and isinstance(e.message, dict):
                    error_dict = e.message
                    error_code = error_dict.get("code")
                elif hasattr(e, 'args') and len(e.args) > 0:
                    if isinstance(e.args[0], dict):
                        error_dict = e.args[0]
                        error_code = error_dict.get("code")
                    elif isinstance(e.args[0], str):
                        # Tentar parsear se for JSON string
                        import json
                        try:
                            error_dict = json.loads(e.args[0])
                            error_code = error_dict.get("code")
                        except:
                            pass
        except Exception as parse_error:
            # Ignorar erros de parsing
            pass
        
        # Verificar se é erro de duplicata/constraint única
        is_duplicate_error = (
            "duplicate" in error_str or 
            "unique" in error_str or 
            "23505" in str(e) or
            error_code == "23505" or
            str(error_code) == "23505" or
            "idx_conversas_unique_pair" in error_str or
            "duplicate key" in error_str
        )
        
        if is_duplicate_error:
            # Se for erro de duplicata, buscar a conversa existente (comportamento esperado)
            try:
                # Tentar buscar a conversa que já existe
                conversa_1 = execute_with_retry(
                    lambda: admin.table("conversas")
                        .select("*")
                        .eq("usuario_a_id", id_a)
                        .eq("usuario_b_id", id_b)
                        .limit(1)
                        .execute()
                        .data or [],
                    max_attempts=2,
                    delay=0.2
                )
                
                conversa_2 = execute_with_retry(
                    lambda: admin.table("conversas")
                        .select("*")
                        .eq("usuario_a_id", id_b)
                        .eq("usuario_b_id", id_a)
                        .limit(1)
                        .execute()
                        .data or [],
                    max_attempts=2,
                    delay=0.2
                )
                
                # Retornar conversa encontrada (sucesso - conversa já existe)
                if conversa_1 and len(conversa_1) > 0:
                    return ok(conversa_1[0], 200)
                elif conversa_2 and len(conversa_2) > 0:
                    return ok(conversa_2[0], 200)
            except Exception as e2:
                # Se falhar ao buscar, logar mas tentar retornar erro genérico
                print(f"[AVISO] Erro ao buscar conversa após duplicata: {e2}")
        
        # Se não for erro de duplicata ou não encontrou a conversa, logar e retornar erro
        if not is_duplicate_error:
            print(f"[ERRO] Falha ao criar conversa: {e}")
            traceback.print_exc()
        
        return fail(f"Falha ao criar conversa: {e}", 400)


@chat_bp.get("/conversas/<int:conversa_id>")
@require_auth
def obter_conversa(user_id: str, conversa_id: int):
    try:
        c = get_admin_client().table("conversas").select("*").eq("id", conversa_id).single().execute().data
        if not c or not _conversa_participa(c, user_id):
            return fail("Conversa não encontrada ou acesso negado", 404)
        return ok(c)
    except Exception as e:
        return fail(f"Falha ao obter conversa: {e}", 500)


@chat_bp.get("/conversas/<int:conversa_id>/mensagens")
@require_auth
def listar_mensagens(user_id: str, conversa_id: int):
    try:
        c = get_admin_client().table("conversas").select("*").eq("id", conversa_id).single().execute().data
        if not c or not _conversa_participa(c, user_id):
            return fail("Conversa não encontrada ou acesso negado", 404)
        msgs = (
            get_admin_client()
            .table("mensagens")
            .select("*")
            .eq("conversa_id", conversa_id)
            .order("enviada_em", desc=False)
            .execute()
            .data
            or []
        )
        return ok({"items": msgs})
    except Exception as e:
        return fail(f"Falha ao listar mensagens: {e}", 500)


@chat_bp.post("/conversas/<int:conversa_id>/mensagens")
@require_auth
def enviar_mensagem(user_id: str, conversa_id: int):
    body = request.get_json(silent=True) or {}
    conteudo = body.get("conteudo")
    if not conteudo or not str(conteudo).strip():
        return fail("conteudo é obrigatório", 400)
    try:
        c = get_admin_client().table("conversas").select("*").eq("id", conversa_id).single().execute().data
        if not c or not _conversa_participa(c, user_id):
            return fail("Conversa não encontrada ou acesso negado", 404)
        res = (
            get_admin_client()
            .table("mensagens")
            .insert({"conversa_id": conversa_id, "remetente_id": user_id, "conteudo": conteudo})
            .execute()
        )
        return ok((res.data or [None])[0], 201)
    except Exception as e:
        return fail(f"Falha ao enviar mensagem: {e}", 400)


@chat_bp.patch("/mensagens/<int:mensagem_id>")
@require_auth
def atualizar_mensagem(user_id: str, mensagem_id: int):
    body = request.get_json(silent=True) or {}
    try:
        admin = get_admin_client()
        m = admin.table("mensagens").select("*").eq("id", mensagem_id).single().execute().data
        if not m:
            return fail("Mensagem não encontrada", 404)
        # verifica participação
        c = admin.table("conversas").select("*").eq("id", m.get("conversa_id")).single().execute().data
        if not c or not _conversa_participa(c, user_id):
            return fail("Acesso negado", 403)
        allowed = {"lida"}
        payload = {k: v for k, v in body.items() if k in allowed}
        if not payload:
            return fail("Nada para atualizar", 400)
        res = admin.table("mensagens").update(payload).eq("id", mensagem_id).execute()
        return ok((res.data or [None])[0])
    except Exception as e:
        return fail(f"Falha ao atualizar mensagem: {e}", 400)
