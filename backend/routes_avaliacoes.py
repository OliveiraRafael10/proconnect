from typing import Any, Dict

from flask import Blueprint, request

from .auth import require_auth
from .supabase_client import get_admin_client
from .utils import ok, fail


avaliacoes_bp = Blueprint("avaliacoes", __name__, url_prefix="/api/avaliacoes")


@avaliacoes_bp.post("")
@require_auth
def criar_avaliacao(user_id: str):
    body: Dict[str, Any] = request.get_json(silent=True) or {}
    contratacao_id = body.get("contratacao_id")
    nota = body.get("nota")
    if not contratacao_id or nota is None:
        return fail("contratacao_id e nota são obrigatórios", 400)
    if not (1 <= int(nota) <= 5):
        return fail("nota deve ser 1..5", 400)
    try:
        # verifica se usuário faz parte da contratação
        admin = get_admin_client()
        c = admin.table("contratacoes").select("*").eq("id", contratacao_id).single().execute().data
        if not c:
            return fail("Contratação não encontrada", 404)
        # permite avaliar se é contratado ou anunciante
        a = admin.table("anuncios").select("usuario_id").eq("id", c.get("anuncio_id")).single().execute().data
        if not a:
            return fail("Anúncio não encontrado", 404)
        if user_id not in (c.get("usuario_id_contratado"), a.get("usuario_id")):
            return fail("Acesso negado", 403)

        payload = {
            "contratacao_id": contratacao_id,
            "avaliador_id": user_id,
            "nota": nota,
            "comentario": body.get("comentario"),
        }
        res = admin.table("avaliacoes").insert(payload).execute()
        return ok((res.data or [None])[0], 201)
    except Exception as e:
        return fail(f"Falha ao criar avaliação: {e}", 400)


@avaliacoes_bp.get("")
def listar_avaliacoes():
    contratacao_id = request.args.get("contratacao_id")
    try:
        q = get_admin_client().table("avaliacoes").select("*")
        if contratacao_id and contratacao_id.isdigit():
            q = q.eq("contratacao_id", int(contratacao_id))
        res = q.order("criado_em", desc=True).execute()
        return ok({"items": res.data or []})
    except Exception as e:
        return fail(f"Falha ao listar avaliações: {e}", 500)


@avaliacoes_bp.get("/por-contratado/<usuario_id>")
def avaliacoes_por_contratado(usuario_id: str):
    try:
        admin = get_admin_client()
        if not admin:
            return ok({"items": [], "media": 0, "total": 0})
        
        # contratações onde este usuário foi contratado
        try:
            # Tentar buscar com retry para lidar com WinError 10035
            cs = None
            max_tentativas = 2
            for tentativa in range(max_tentativas):
                try:
                    cs = admin.table("contratacoes").select("id").eq("usuario_id_contratado", usuario_id).execute().data or []
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
                        import time
                        time.sleep(0.3)
                        continue
                    # Se não for erro de rede ou última tentativa, retornar valores padrão
                    cs = []
                    break
            
            cids = [c["id"] for c in (cs or [])]
            if not cids:
                return ok({"items": [], "media": 0, "total": 0})
            
            # Tentar buscar avaliações com retry
            avs = None
            for tentativa in range(max_tentativas):
                try:
                    avs = admin.table("avaliacoes").select("*").in_("contratacao_id", cids).execute().data or []
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
                        import time
                        time.sleep(0.3)
                        continue
                    # Se não for erro de rede ou última tentativa, retornar valores padrão
                    avs = []
                    break
            
            notas = [a.get("nota") for a in (avs or []) if a.get("nota") is not None]
            media = round(sum(notas) / len(notas), 2) if notas else 0
            return ok({"items": avs or [], "media": media, "total": len(notas)})
        except Exception as e:
            # Se houver erro geral, retorna valores padrão silenciosamente
            error_str = str(e)
            is_network_error = (
                "WinError 10035" in error_str or
                "10035" in error_str or
                "socket" in error_str.lower() or
                "network" in error_str.lower()
            )
            # Só logar se não for erro de rede
            if not is_network_error:
                import traceback
                print(f"[AVISO] Erro ao buscar avaliações para {usuario_id}: {e}")
            return ok({"items": [], "media": 0, "total": 0})
    except Exception as e:
        import traceback
        print(f"[ERRO] Falha ao listar avaliações: {e}")
        print(traceback.format_exc())
        # Retorna valores padrão ao invés de erro 500
        return ok({"items": [], "media": 0, "total": 0})
