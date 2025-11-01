from typing import Any, Dict

from flask import Blueprint, request

from .auth import require_auth
from .supabase_client import get_admin_client
from .utils import ok, fail


contratacoes_bp = Blueprint("contratacoes", __name__, url_prefix="/api/contratacoes")


def _get_anuncio(anuncio_id: int):
    return get_admin_client().table("anuncios").select("*").eq("id", anuncio_id).single().execute().data


def _get_proposta(proposta_id: int):
    return get_admin_client().table("propostas").select("*").eq("id", proposta_id).single().execute().data


@contratacoes_bp.post("")
@require_auth
def criar_contratacao(user_id: str):
    body: Dict[str, Any] = request.get_json(silent=True) or {}
    anuncio_id = body.get("anuncio_id")
    proposta_id = body.get("proposta_id")
    valor_acordado = body.get("valor_acordado")
    if not anuncio_id:
        return fail("anuncio_id é obrigatório", 400)

    anuncio = _get_anuncio(anuncio_id)
    if not anuncio:
        return fail("Anúncio não encontrado", 404)
    if anuncio.get("usuario_id") != user_id:
        return fail("Somente o dono do anúncio pode contratar", 403)

    contratado_id = None
    if proposta_id:
        pr = _get_proposta(proposta_id)
        if not pr:
            return fail("Proposta não encontrada", 404)
        if pr.get("anuncio_id") != anuncio_id:
            return fail("Proposta não pertence a este anúncio", 400)
        contratado_id = pr.get("usuario_id_worker")
        if valor_acordado is None:
            valor_acordado = pr.get("valor_proposto")

    payload = {
        "anuncio_id": anuncio_id,
        "proposta_id": proposta_id,
        "usuario_id_contratado": contratado_id,
        "valor_acordado": valor_acordado,
    }
    try:
        res = get_admin_client().table("contratacoes").insert(payload).execute()
        return ok((res.data or [None])[0], 201)
    except Exception as e:
        return fail(f"Falha ao criar contratação: {e}", 400)


@contratacoes_bp.get("/minhas")
@require_auth
def minhas_contratacoes(user_id: str):
    # contratacoes onde usuario é contratado OU é o dono do anúncio
    try:
        admin = get_admin_client()
        # contratado
        as_worker = admin.table("contratacoes").select("*").eq("usuario_id_contratado", user_id).execute().data or []
        # anunciante
        # buscamos anúncios do usuário
        meus_anuncios = admin.table("anuncios").select("id").eq("usuario_id", user_id).execute().data or []
        anuncio_ids = {a["id"] for a in meus_anuncios}
        as_owner = []
        if anuncio_ids:
            # supabase-py: não há .in_ direto? Existe .in_(column, values)
            as_owner = admin.table("contratacoes").select("*").in_("anuncio_id", list(anuncio_ids)).execute().data or []
        merged = {c["id"]: c for c in (as_worker + as_owner)}
        return ok({"items": list(merged.values())})
    except Exception as e:
        return fail(f"Falha ao listar contratações: {e}", 500)


@contratacoes_bp.patch("/<int:contratacao_id>")
@require_auth
def atualizar_contratacao(user_id: str, contratacao_id: int):
    body = request.get_json(silent=True) or {}
    try:
        admin = get_admin_client()
        c = admin.table("contratacoes").select("*").eq("id", contratacao_id).single().execute().data
        if not c:
            return fail("Contratação não encontrada", 404)
        # checa acesso
        anuncio = _get_anuncio(c.get("anuncio_id"))
        if not anuncio:
            return fail("Anúncio não encontrado", 404)
        if user_id not in (c.get("usuario_id_contratado"), anuncio.get("usuario_id")):
            return fail("Acesso negado", 403)

        allowed = {"status", "valor_acordado"}
        payload = {k: v for k, v in body.items() if k in allowed}
        if not payload:
            return fail("Nenhum campo válido para atualizar", 400)
        res = admin.table("contratacoes").update(payload).eq("id", contratacao_id).execute()
        return ok((res.data or [None])[0])
    except Exception as e:
        return fail(f"Falha ao atualizar contratação: {e}", 400)
