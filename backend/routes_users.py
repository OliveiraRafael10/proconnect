from typing import Any, Dict
import re

from flask import Blueprint, jsonify, request

from .auth import require_auth, get_current_user_profile
from .supabase_client import get_admin_client
from .utils import build_worker_profile, upsert_worker_profile
import time, os


users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.route("/me", methods=["GET"])
@require_auth
def get_me(user_id: str):
    profile = get_current_user_profile(user_id)
    if not profile:
        return jsonify({"error": "Perfil não encontrado"}), 404
    return jsonify(profile)


@users_bp.route("/me", methods=["PATCH", "PUT"])
@require_auth
def update_me(user_id: str):
    # Força tentar parsear JSON mesmo que o header esteja incorreto ou payload seja grande
    try:
        data: Dict[str, Any] = request.get_json(silent=True) or request.get_json(force=True, silent=True) or {}
    except Exception:
        data = {}

    # Campos permitidos
    allowed_fields = {
        "nome",
        "apelido",
        "foto_url",
        "telefone_ddd",
        "telefone_numero",
        "endereco_cep",
        "endereco_logradouro",
        "endereco_numero",
        "endereco_bairro",
        "endereco_cidade",
        "endereco_estado",
        "endereco_complemento",
        "is_worker",
        "perfil_worker",
        "preferencias",
    }

    update_payload = {k: v for k, v in data.items() if k in allowed_fields}

    client = get_admin_client()
    try:
        # Se veio perfil_worker, gravar nas tabelas normalizadas
        performed_worker_upsert = False
        if "perfil_worker" in update_payload:
            worker = update_payload.pop("perfil_worker") or {}
            upsert_worker_profile(client, user_id, worker)
            performed_worker_upsert = True

        # Se não há mais campos para atualizar em usuarios e apenas trabalhamos o perfil_worker,
        # retornamos o perfil atualizado diretamente.
        if not update_payload and performed_worker_upsert:
            sel = (
                client.table("usuarios").select("*").eq("id", user_id).single().execute()
            )
            out = sel.data
            try:
                if out and out.get("is_worker"):
                    worker_built = build_worker_profile(client, user_id)
                    if worker_built:
                        out["perfil_worker"] = worker_built
            except Exception:
                pass
            return jsonify(out), 200

        # Algumas versões do supabase-py não suportam encadear .select() após update().
        # 1) Tenta retornar a representação diretamente
        try:
            res = (
                client.table("usuarios")
                .update(update_payload, returning="representation")
                .eq("id", user_id)
                .execute()
            )
            data = getattr(res, "data", None) or []
            if isinstance(data, list) and data:
                out = data[0]
                try:
                    if out.get("is_worker"):
                        worker_built = build_worker_profile(client, user_id)
                        if worker_built:
                            out["perfil_worker"] = worker_built
                except Exception:
                    pass
                return jsonify(out), 200
            if isinstance(data, dict) and data:
                out = data
                try:
                    if out.get("is_worker"):
                        worker_built = build_worker_profile(client, user_id)
                        if worker_built:
                            out["perfil_worker"] = worker_built
                except Exception:
                    pass
                return jsonify(out), 200
        except Exception:
            # Prossegue para fallback
            pass

        # 2) Fallback: faz update e em seguida select single
        client.table("usuarios").update(update_payload).eq("id", user_id).execute()
        sel = (
            client.table("usuarios").select("*").eq("id", user_id).single().execute()
        )
        out = sel.data
        try:
            if out and out.get("is_worker"):
                worker_built = build_worker_profile(client, user_id)
                if worker_built:
                    out["perfil_worker"] = worker_built
        except Exception:
            pass
        return jsonify(out), 200
    except Exception as e:
        return jsonify({"error": f"Falha ao atualizar perfil: {e}"}), 400


def _digits_only(value: Any) -> str:
    return re.sub(r"\D", "", str(value or ""))


@users_bp.route("/me/onboarding", methods=["POST"])
@require_auth
def complete_onboarding(user_id: str):
    payload: Dict[str, Any] = request.get_json(silent=True) or {}

    update_payload: Dict[str, Any] = {}

    phone_digits = _digits_only(payload.get("phone"))
    if len(phone_digits) >= 2:
        update_payload["telefone_ddd"] = phone_digits[:2]
        if len(phone_digits) > 2:
            update_payload["telefone_numero"] = phone_digits[2:]

    cep_digits = _digits_only(payload.get("zipCode") or payload.get("cep"))
    if len(cep_digits) == 8:
        update_payload["endereco_cep"] = cep_digits

    address = (payload.get("address") or "").strip()
    if address:
        update_payload["endereco_logradouro"] = address

    address_number = (payload.get("addressNumber") or "").strip()
    if address_number:
        update_payload["endereco_numero"] = address_number

    neighborhood = (payload.get("neighborhood") or "").strip()
    if neighborhood:
        update_payload["endereco_bairro"] = neighborhood

    city = (payload.get("city") or "").strip()
    if city:
        update_payload["endereco_cidade"] = city

    state = (payload.get("state") or "").strip().upper()
    if state:
        update_payload["endereco_estado"] = state[:2]

    user_type = payload.get("userType")
    if user_type in ("client", "provider"):
        update_payload["is_worker"] = user_type == "provider"

    if not update_payload:
        return jsonify({"error": "Nenhum campo válido para salvar"}), 400

    client = get_admin_client()
    try:
        client.table("usuarios").update(update_payload).eq("id", user_id).execute()
        profile = get_current_user_profile(user_id)
        return jsonify({"profile": profile}), 200
    except Exception as e:
        return jsonify({"error": f"Falha ao salvar onboarding: {e}"}), 400


def _ensure_bucket(admin, bucket: str):
    try:
        buckets = admin.storage.list_buckets()  # returns list[dict]
        names = set()
        for b in buckets or []:
            if isinstance(b, dict):
                names.add(b.get("name") or b.get("id"))
            else:
                try:
                    names.add(getattr(b, "name", None) or getattr(b, "id", None))
                except Exception:
                    pass
        if bucket not in names:
            admin.storage.create_bucket(bucket, public=True)
        else:
            # garante que é público (se já existir)
            try:
                admin.storage.update_bucket(bucket, public=True)
            except Exception:
                pass
    except Exception:
        # fallback: tenta criar diretamente (idempotente)
        try:
            admin.storage.create_bucket(bucket, public=True)
        except Exception:
            pass


@users_bp.route("/me/foto", methods=["POST"])  # multipart/form-data
@require_auth
def upload_foto(user_id: str):
    if 'file' not in request.files:
        return jsonify({"error": "Arquivo 'file' é obrigatório"}), 400
    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({"error": "Arquivo inválido"}), 400
    if not file.mimetype.startswith('image/'):
        return jsonify({"error": "Apenas imagens são permitidas"}), 400
    # Limite básico de 5MB
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > 5 * 1024 * 1024:
        return jsonify({"error": "Arquivo muito grande (máx 5MB)"}), 400

    admin = get_admin_client()
    bucket = 'profile-photos'
    # Tentar criar bucket e garantir que exista e seja público
    _ensure_bucket(admin, bucket)

    name, ext = os.path.splitext(file.filename)
    ext = ext or '.jpg'
    path = f"{user_id}/{int(time.time())}{ext}"
    try:
        # Tenta upload. Se falhar por bucket inexistente, garante e tenta novamente.
        def _do_upload():
            admin.storage.from_(bucket).upload(path, file.read(), {
                "content-type": file.mimetype,
            })

        try:
            _do_upload()
        except Exception:
            _ensure_bucket(admin, bucket)
            file.seek(0)
            _do_upload()
        # URL pública (compatível com diferentes retornos da lib)
        url_data = admin.storage.from_(bucket).get_public_url(path)
        public_url = None
        if isinstance(url_data, str):
            public_url = url_data
        elif isinstance(url_data, dict):
            public_url = url_data.get("public_url") or url_data.get("publicURL") or url_data.get("signedURL")
        else:
            try:
                public_url = getattr(url_data, "public_url", None) or getattr(url_data, "publicURL", None)
            except Exception:
                public_url = None
        public_url = public_url or f"{get_admin_client().storage.url}/object/public/{bucket}/{path}"

        # Atualiza perfil
        res = (
            admin.table("usuarios").update({"foto_url": public_url}).eq("id", user_id).execute()
        )
        return jsonify({"foto_url": public_url, "profile": (res.data or [None])[0]}), 200
    except Exception as e:
        return jsonify({"error": f"Falha ao enviar foto: {e}"}), 400
