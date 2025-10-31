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
        admin = get_admin_client()
        # busca conversas onde usuário é A ou B
        a = admin.table("conversas").select("*").eq("usuario_a_id", user_id).execute().data or []
        b = admin.table("conversas").select("*").eq("usuario_b_id", user_id).execute().data or []
        merged = {c["id"]: c for c in (a + b)}
        return ok({"items": list(merged.values())})
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

    payload = {
        "usuario_a_id": user_id,
        "usuario_b_id": usuario_b_id,
        "contexto_tipo": body.get("contexto_tipo"),
        "contexto_id": body.get("contexto_id"),
    }
    try:
        res = get_admin_client().table("conversas").insert(payload).execute()
        return ok((res.data or [None])[0], 201)
    except Exception as e:
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
