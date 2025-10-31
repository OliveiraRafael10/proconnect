from typing import Any, Dict

from flask import Blueprint, request

from .auth import require_auth
from .supabase_client import get_admin_client
from .utils import ok, fail


propostas_bp = Blueprint("propostas", __name__, url_prefix="/api/propostas")


def _get_anuncio(anuncio_id: int):
    return (
        get_admin_client().table("anuncios").select("id, usuario_id, tipo").eq("id", anuncio_id).single().execute().data
    )


@propostas_bp.post("")
@require_auth
def criar_proposta(user_id: str):
    body: Dict[str, Any] = request.get_json(silent=True) or {}
    anuncio_id = body.get("anuncio_id")
    if not anuncio_id:
        return fail("anuncio_id é obrigatório", 400)
    anuncio = _get_anuncio(anuncio_id)
    if not anuncio:
        return fail("Anúncio não encontrado", 404)
    if anuncio.get("usuario_id") == user_id:
        return fail("Você não pode propor no seu próprio anúncio", 400)
    payload = {
        "anuncio_id": anuncio_id,
        "usuario_id_worker": user_id,
        "valor_proposto": body.get("valor_proposto"),
        "mensagem": body.get("mensagem"),
    }
    try:
        res = get_admin_client().table("propostas").insert(payload).execute()
        return ok((res.data or [None])[0], 201)
    except Exception as e:
        return fail(f"Falha ao criar proposta: {e}", 400)


@propostas_bp.get("")
@require_auth
def listar_propostas(user_id: str):
    anuncio_id = request.args.get("anuncio_id")
    try:
        q = get_admin_client().table("propostas").select("*")
        if anuncio_id and anuncio_id.isdigit():
            # Só o dono do anúncio pode ver
            anuncio = _get_anuncio(int(anuncio_id))
            if not anuncio:
                return fail("Anúncio não encontrado", 404)
            if anuncio.get("usuario_id") != user_id:
                return fail("Acesso negado", 403)
            q = q.eq("anuncio_id", int(anuncio_id))
        else:
            # Sem anuncio_id: lista só as do usuário
            q = q.eq("usuario_id_worker", user_id)
        res = q.order("criada_em", desc=True).execute()
        return ok({"items": res.data or []})
    except Exception as e:
        return fail(f"Falha ao listar propostas: {e}", 500)


@propostas_bp.patch("/<int:proposta_id>")
@require_auth
def atualizar_proposta(user_id: str, proposta_id: int):
    body = request.get_json(silent=True) or {}
    try:
        pr = (
            get_admin_client().table("propostas").select("*").eq("id", proposta_id).single().execute().data
        )
        if not pr:
            return fail("Proposta não encontrada", 404)

        # Worker pode editar valor/mensagem/retirar
        if pr.get("usuario_id_worker") != user_id:
            return fail("Acesso negado", 403)

        allowed = {"valor_proposto", "mensagem", "status"}
        payload = {k: v for k, v in body.items() if k in allowed}
        if not payload:
            return fail("Nenhum campo válido para atualizar", 400)
        res = (
            get_admin_client()
            .table("propostas")
            .update(payload)
            .eq("id", proposta_id)
            .execute()
        )
        return ok((res.data or [None])[0])
    except Exception as e:
        return fail(f"Falha ao atualizar proposta: {e}", 400)
