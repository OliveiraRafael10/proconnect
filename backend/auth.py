import functools
from typing import Callable, Dict, Optional

import jwt
from flask import request, jsonify, make_response

from .config import settings
from .supabase_client import get_admin_client
from .utils import build_worker_profile


class AuthError(Exception):
    def __init__(self, message: str, status_code: int = 401):
        super().__init__(message)
        self.status_code = status_code


def get_bearer_token() -> Optional[str]:
    auth_header = request.headers.get("Authorization", "")
    parts = auth_header.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    # fallback: cookie-based
    cookie_token = request.cookies.get("sb_access_token")
    return cookie_token


def decode_supabase_jwt(token: str) -> Dict:
    try:
        # Supabase access tokens incluem claim 'aud' ('authenticated').
        # Desativamos a verificação de audiência aqui para simplificar.
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
    except jwt.PyJWTError:
        raise AuthError("Token inválido ou expirado", 401)


def _csrf_required() -> bool:
    return request.method in ("POST", "PUT", "PATCH", "DELETE")


def _validate_csrf_if_cookie(token_used_from_cookie: bool) -> None:
    if token_used_from_cookie and _csrf_required():
        csrf_header = request.headers.get("X-CSRF-Token")
        csrf_cookie = request.cookies.get("sb_csrf")
        if not csrf_header or not csrf_cookie or csrf_header != csrf_cookie:
            raise AuthError("CSRF inválido", 403)


def require_auth(f: Callable):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        token = get_bearer_token()
        if not token:
            raise AuthError("Authorization header missing", 401)
        # verifica se veio de cookie para aplicar CSRF em métodos de escrita
        token_from_cookie = request.cookies.get("sb_access_token") is not None and not request.headers.get("Authorization")
        try:
            _validate_csrf_if_cookie(token_from_cookie)
        except AuthError:
            raise  # Re-raise AuthError para ser capturado pelo handler
        try:
            claims = decode_supabase_jwt(token)
        except AuthError:
            raise  # Re-raise AuthError para ser capturado pelo handler
        user_id = claims.get("sub")
        if not user_id:
            raise AuthError("Token inválido: sem sub", 401)
        # injeta user_id nos kwargs
        return f(*args, user_id=user_id, **kwargs)

    return wrapper


def get_current_user_profile(user_id: str) -> Optional[Dict]:
    client = get_admin_client()
    resp = client.table("usuarios").select("*").eq("id", user_id).single().execute()
    data = resp.data if resp.data else None
    if not data:
        return None
    try:
        if data.get("is_worker"):
            worker = build_worker_profile(client, user_id)
            if worker:
                data["perfil_worker"] = worker
    except Exception:
        # Não interromper o fluxo se falhar o anexo do perfil
        pass
    return data


def _set_cookie(resp, key: str, value: str, max_age: Optional[int] = None):
    resp.set_cookie(
        key,
        value,
        max_age=max_age or settings.cookie_max_age,
        secure=settings.cookie_secure,
        httponly=True,
        samesite=settings.cookie_samesite,
        domain=settings.cookie_domain,
        path="/",
    )


def _clear_cookie(resp, key: str):
    resp.set_cookie(
        key,
        "",
        expires=0,
        secure=settings.cookie_secure,
        httponly=True,
        samesite=settings.cookie_samesite,
        domain=settings.cookie_domain,
        path="/",
    )


def attach_session_cookies(access_token: str, refresh_token: str, extra_body: Optional[Dict] = None):
    csrf = jwt.encode({"nonce": "csrf"}, settings.supabase_jwt_secret, algorithm="HS256")
    body = {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }
    if extra_body:
        body.update(extra_body)
    resp = make_response(jsonify(body))
    _set_cookie(resp, "sb_access_token", access_token)
    _set_cookie(resp, "sb_refresh_token", refresh_token)
    # CSRF em cookie não httpOnly para leitura pelo front e envio no header
    resp.set_cookie(
        "sb_csrf",
        csrf,
        max_age=settings.cookie_max_age,
        secure=settings.cookie_secure,
        httponly=False,
        samesite=settings.cookie_samesite,
        domain=settings.cookie_domain,
        path="/",
    )
    return resp


def clear_session_cookies():
    resp = make_response(jsonify({"ok": True}))
    _clear_cookie(resp, "sb_access_token")
    _clear_cookie(resp, "sb_refresh_token")
    resp.set_cookie(
        "sb_csrf",
        "",
        expires=0,
        secure=settings.cookie_secure,
        httponly=False,
        samesite=settings.cookie_samesite,
        domain=settings.cookie_domain,
        path="/",
    )
    return resp
