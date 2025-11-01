from flask import Blueprint, request

from supabase_client import get_admin_client
from utils import ok, fail


categorias_bp = Blueprint("categorias", __name__, url_prefix="/api/categorias")


@categorias_bp.get("")
def list_categorias():
    try:
        data = get_admin_client().table("categorias").select("*").order("id").execute().data
        return ok({"items": data or []})
    except Exception as e:
        return fail(f"Falha ao listar categorias: {e}", 500)


@categorias_bp.post("")
def create_categoria():
    body = request.get_json(silent=True) or {}
    nome = (body.get("nome") or "").strip()
    if not nome:
        return fail("nome é obrigatório", 400)
    payload = {
        "nome": nome,
        "icone": body.get("icone"),
    }
    try:
        res = get_admin_client().table("categorias").insert(payload).execute()
        return ok((res.data or [None])[0], 201)
    except Exception as e:
        return fail(f"Falha ao criar categoria: {e}", 400)
