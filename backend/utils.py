from typing import Any, Dict, Optional, List
import os
import base64

from flask import jsonify


def ok(data: Any, status: int = 200):
    return jsonify(data), status


def fail(message: str, status: int = 400):
    return jsonify({"error": message}), status


def to_int(value: Optional[str], default: int = 0) -> int:
    try:
        return int(value) if value is not None else default
    except Exception:
        return default


def paginate_params(args) -> Dict[str, int]:
    page = max(to_int(args.get("page"), 1), 1)
    page_size = min(max(to_int(args.get("page_size"), 20), 1), 100)
    offset = (page - 1) * page_size
    return {"page": page, "page_size": page_size, "offset": offset, "limit": page_size}


# -------------------- Worker Profile helpers --------------------
# Monta objeto perfil_worker agregando tabelas: perfil_worker, worker_categorias, worker_portfolio
def build_worker_profile(admin_client, user_id: str) -> Optional[Dict[str, Any]]:
    try:
        base = (
            admin_client.table("perfil_worker")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
            .data
        )
    except Exception:
        base = None

    if not base:
        return None

    # Disponibilidade em objeto
    disponibilidade = {
        "segunda": bool(base.get("disp_segunda")),
        "terca": bool(base.get("disp_terca")),
        "quarta": bool(base.get("disp_quarta")),
        "quinta": bool(base.get("disp_quinta")),
        "sexta": bool(base.get("disp_sexta")),
        "sabado": bool(base.get("disp_sabado")),
        "domingo": bool(base.get("disp_domingo")),
    }

    # Categorias (nomes)
    try:
        wc = (
            admin_client.table("worker_categorias")
            .select("categoria_id")
            .eq("user_id", user_id)
            .execute()
            .data
            or []
        )
        categoria_ids: List[int] = [c.get("categoria_id") for c in wc if c and c.get("categoria_id") is not None]
    except Exception:
        categoria_ids = []

    categorias: List[str] = []
    if categoria_ids:
        try:
            cats = (
                admin_client.table("categorias")
                .select("id, nome")
                .in_("id", categoria_ids)
                .execute()
                .data
                or []
            )
            categorias = [c.get("nome") for c in cats]
        except Exception:
            categorias = []

    # Portfólio
    try:
        portfolio_rows = (
            admin_client.table("worker_portfolio")
            .select("id, url, criado_em")
            .eq("user_id", user_id)
            .order("id")
            .execute()
            .data
            or []
        )
        portfolio = [
            {"id": p.get("id"), "url": p.get("url")}
            for p in portfolio_rows
        ]
    except Exception:
        portfolio = []

    return {
        "descricao": base.get("descricao"),
        "experiencia": base.get("experiencia"),
        "disponibilidade": disponibilidade,
        "categorias": categorias,
        "portfolio": portfolio,
    }


def upsert_worker_profile(admin_client, user_id: str, worker: Dict[str, Any]):
    """Grava dados do perfil do trabalhador nas tabelas normalizadas.
    worker: {
      descricao?, experiencia?, disponibilidade?: {segunda..domingo}, categorias?: [string|int], portfolio?: [{url,name?}]
    }
    """
    # Upsert no perfil_worker
    disponibilidade = worker.get("disponibilidade") or {}
    payload = {
        "user_id": user_id,
        "descricao": worker.get("descricao"),
        "experiencia": worker.get("experiencia"),
        "disp_segunda": bool(disponibilidade.get("segunda")),
        "disp_terca": bool(disponibilidade.get("terca")),
        "disp_quarta": bool(disponibilidade.get("quarta")),
        "disp_quinta": bool(disponibilidade.get("quinta")),
        "disp_sexta": bool(disponibilidade.get("sexta")),
        "disp_sabado": bool(disponibilidade.get("sabado")),
        "disp_domingo": bool(disponibilidade.get("domingo")),
    }

    admin_client.table("perfil_worker").upsert(payload, on_conflict="user_id").execute()

    # Categorias: aceita nomes ou ids
    categorias = worker.get("categorias") or []
    if categorias is not None:
        # Limpa e recria (estratégia simples)
        admin_client.table("worker_categorias").delete().eq("user_id", user_id).execute()
        if categorias:
            # Mapear qualquer formato (id, string id, slug, nome) -> id
            ids: List[int] = []
            try:
                cats_all = (
                    admin_client.table("categorias")
                    .select("id, nome")
                    .execute()
                    .data
                    or []
                )
            except Exception:
                cats_all = []
            by_nome = {str((c.get("nome") or "").strip().lower()): c.get("id") for c in cats_all}
            for c in categorias:
                if isinstance(c, int):
                    ids.append(c)
                    continue
                s = str(c).strip()
                if not s:
                    continue
                # string que representa número
                try:
                    n = int(s)
                    ids.append(n)
                    continue
                except Exception:
                    pass
                key_nome = s.lower()
                cid = by_nome.get(key_nome)
                if cid is not None:
                    ids.append(cid)

            rows = [{"user_id": user_id, "categoria_id": cid} for cid in ids]
            if rows:
                admin_client.table("worker_categorias").insert(rows).execute()

    # Portfólio: substituir lista
    portfolio = worker.get("portfolio")
    if portfolio is not None:
        admin_client.table("worker_portfolio").delete().eq("user_id", user_id).execute()
        rows = []
        for item in portfolio:
            if not item:
                continue
            url = item.get("url") if isinstance(item, dict) else None
            nome = item.get("name") if isinstance(item, dict) else None
            # Se veio data URL (base64), faz upload para o storage e usa URL pública
            if isinstance(url, str) and url.startswith("data:"):
                try:
                    public_url = upload_data_url(admin_client, "portifolio-fotos", user_id, url, nome)
                    if public_url:
                        url = public_url
                except Exception:
                    # ignora falha em upload desse item específico
                    url = None
            if url:
                rows.append({"user_id": user_id, "url": url})
        if rows:
            admin_client.table("worker_portfolio").insert(rows).execute()


# -------------------- Storage helpers --------------------
def _ensure_bucket(admin, bucket: str):
    try:
        buckets = admin.storage.list_buckets()
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
            try:
                admin.storage.update_bucket(bucket, public=True)
            except Exception:
                pass
    except Exception:
        try:
            admin.storage.create_bucket(bucket, public=True)
        except Exception:
            pass


def upload_data_url(admin, bucket: str, user_id: str, data_url: str, name: Optional[str] = None) -> Optional[str]:
    """Recebe uma data URL (ex.: data:image/png;base64,AAA...) e publica no storage, retornando a URL pública."""
    _ensure_bucket(admin, bucket)
    if not data_url.startswith("data:"):
        return None
    try:
        header, b64 = data_url.split(",", 1)
        mime = header.split(";")[0].split(":")[1] if ":" in header else "application/octet-stream"
        ext = {
            "image/png": ".png",
            "image/jpeg": ".jpg",
            "image/jpg": ".jpg",
            "image/gif": ".gif",
            "image/webp": ".webp",
        }.get(mime, "")
        raw = base64.b64decode(b64)
        filename = (name or "portfolio")
        path = f"{user_id}/{int(os.getenv('EPOCH', '0')) or 0}_{abs(hash(filename))}{ext}"
        admin.storage.from_(bucket).upload(path, raw, {"content-type": mime})
        url_data = admin.storage.from_(bucket).get_public_url(path)
        if isinstance(url_data, str):
            return url_data
        if isinstance(url_data, dict):
            return url_data.get("public_url") or url_data.get("publicURL") or url_data.get("signedURL")
        try:
            return getattr(url_data, "public_url", None) or getattr(url_data, "publicURL", None)
        except Exception:
            return None
    except Exception:
        return None


