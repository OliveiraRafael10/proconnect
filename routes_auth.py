from typing import Any, Dict

from flask import Blueprint, jsonify, request

from supabase_client import get_admin_client, get_public_client
from utils import upsert_worker_profile
from auth import (
    require_auth,
    get_current_user_profile,
    attach_session_cookies,
    clear_session_cookies,
)


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    """Registrar novo usuário
    Cria uma nova conta de usuário na plataforma Lance Fácil
    ---
    tags:
      - Auth
    parameters:
      - name: body
        in: body
        required: true
        description: Dados para criação de novo usuário
        schema:
          type: object
          required:
            - nome
            - email
            - password
          properties:
            nome:
              type: string
              example: "João Silva"
              description: Nome completo do usuário
            email:
              type: string
              format: email
              example: "joao@email.com"
              description: Email do usuário (será usado para login)
            password:
              type: string
              format: password
              example: "SenhaSegura123!"
              description: Senha (mínimo 6 caracteres)
            cpf:
              type: string
              example: "123.456.789-00"
              description: CPF do usuário (opcional)
            is_worker:
              type: boolean
              default: false
              description: Se o usuário é um profissional que oferece serviços
            perfil_worker:
              type: object
              description: Dados do perfil profissional (se is_worker=true)
              properties:
                descricao:
                  type: string
                  example: "Eletricista com 10 anos de experiência"
                categorias:
                  type: array
                  items:
                    type: string
                  example: ["eletrica", "instalacao"]
            preferencias:
              type: object
              description: Preferências do usuário (opcional)
    responses:
      201:
        description: Usuário criado com sucesso
        schema:
          type: object
          properties:
            user:
              type: object
              properties:
                id:
                  type: string
                  format: uuid
                email:
                  type: string
            profile:
              $ref: '#/definitions/Usuario'
      400:
        description: Erro na validação dos dados ou usuário já existe
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Campos obrigatórios: nome, email, password"
    """
    data: Dict[str, Any] = request.get_json(silent=True) or {}
    nome = (data.get("nome") or "").strip()
    email = (data.get("email") or "").strip()
    password = (data.get("password") or "").strip()
    cpf_raw = (data.get("cpf") or "").strip()
    is_worker = bool(data.get("is_worker", False))
    perfil_worker = data.get("perfil_worker") or {}
    preferencias = data.get("preferencias") or {}

    if not nome or not email or not password:
        return jsonify({"error": "Campos obrigatórios: nome, email, password"}), 400

    admin = get_admin_client()

    # 1) Cria usuário no Supabase Auth (email confirmado para facilitar MVP)
    try:
        created = admin.auth.admin.create_user(
            {
                "email": email,
                "password": password,
                "email_confirm": True,
                "user_metadata": {"nome": nome},
            }
        )
    except Exception as e:
        return jsonify({"error": f"Falha ao criar usuário no Auth: {e}"}), 400

    user = getattr(created, "user", None) or {}
    user_id = user.get("id") if isinstance(user, dict) else getattr(user, "id", None)
    email_confirmed_at = user.get("email_confirmed_at") if isinstance(user, dict) else getattr(user, "email_confirmed_at", None)
    if not user_id:
        return jsonify({"error": "Não foi possível obter o id do usuário criado"}), 500

    # 2) Insere perfil em `usuarios`
    try:
        # normaliza CPF para apenas dígitos (se enviado)
        try:
            import re
            cpf_digits = re.sub(r"\D", "", cpf_raw) if cpf_raw else None
        except Exception:
            cpf_digits = cpf_raw or None

        profile = {
            "id": user_id,
            "nome": nome,
            "email": email,
            "cpf": cpf_digits,
            "is_worker": is_worker,
            "email_verificado": bool(email_confirmed_at),
            "preferencias": preferencias,
        }
        inserted = admin.table("usuarios").insert(profile).execute()
        # Grava perfil_worker nas tabelas normalizadas, se aplicável
        if is_worker and perfil_worker:
            try:
                upsert_worker_profile(admin, user_id, perfil_worker)
            except Exception:
                pass
        # Retorna perfil completo lendo novamente (agora com perfil_worker montado pelo /auth.get_current_user_profile)
        try:
            from .auth import get_current_user_profile
            full_profile = get_current_user_profile(user_id)
        except Exception:
            full_profile = inserted.data[0] if inserted.data else None
        return jsonify({"user": {"id": user_id, "email": email}, "profile": full_profile}), 201
    except Exception as e:
        # rollback lógico: remover usuário Auth se perfil falhar
        try:
            admin.auth.admin.delete_user(user_id)
        except Exception:
            pass
        return jsonify({"error": f"Falha ao criar perfil: {e}"}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login de usuário
    Autentica um usuário e retorna tokens de acesso
    ---
    tags:
      - Auth
    parameters:
      - name: body
        in: body
        required: true
        description: Credenciais de login
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: "joao@email.com"
              description: Email ou CPF do usuário
            password:
              type: string
              format: password
              example: "SenhaSegura123!"
              description: Senha do usuário
    responses:
      200:
        description: Login realizado com sucesso
        schema:
          type: object
          properties:
            user:
              type: object
              properties:
                id:
                  type: string
                  format: uuid
                email:
                  type: string
            profile:
              $ref: '#/definitions/Usuario'
            access_token:
              type: string
              description: Token JWT para autenticação
            refresh_token:
              type: string
              description: Token para renovação do access_token
        headers:
          Set-Cookie:
            description: Cookies httpOnly com os tokens (access_token e refresh_token)
            type: string
      401:
        description: Credenciais inválidas
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Credenciais inválidas"
      400:
        description: Dados inválidos
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Campos obrigatórios: email, password"
    """
    data = request.get_json(silent=True) or {}
    email_or_cpf = (data.get("email") or "").strip()
    password = (data.get("password") or "").strip()
    if not email_or_cpf or not password:
        return jsonify({"error": "Campos obrigatórios: email, password"}), 400

    # Se veio CPF, converte para email procurando na tabela usuarios
    email = email_or_cpf
    if "@" not in email_or_cpf:
        try:
            import re
            cpf_digits = re.sub(r"\D", "", email_or_cpf)
            # busca usuário por CPF
            pr = get_admin_client().table("usuarios").select("email").eq("cpf", cpf_digits).single().execute()
            if not pr.data or not pr.data.get("email"):
                return jsonify({"error": "CPF não encontrado"}), 401
            email = pr.data["email"]
        except Exception:
            return jsonify({"error": "CPF inválido"}), 400

    public_client = get_public_client()
    try:
        res = public_client.auth.sign_in_with_password({"email": email, "password": password})
    except Exception as e:
        # fallback: tenta com admin client se anon não estiver presente
        try:
            admin = get_admin_client()
            res = admin.auth.sign_in_with_password({"email": email, "password": password})
        except Exception as e2:
            return jsonify({"error": f"Falha no login: {e2}"}), 401

    session = getattr(res, "session", None)
    user = getattr(res, "user", None)
    if not session or not user:
        return jsonify({"error": "Credenciais inválidas"}), 401

    user_id = user.id if hasattr(user, "id") else user.get("id")
    # busca perfil (service key; filtra por id)
    try:
        profile = get_current_user_profile(user_id)
    except Exception:
        profile = None

    # Retorna tokens no corpo e em cookies httpOnly
    resp = attach_session_cookies(
        getattr(session, "access_token", None),
        getattr(session, "refresh_token", None),
        {"user": {"id": user_id, "email": getattr(user, "email", None)}, "profile": profile},
    )
    return resp


@auth_bp.route("/me", methods=["GET"])
@require_auth
def me(user_id: str):
    """Obter perfil do usuário autenticado
    Retorna os dados do perfil do usuário logado
    ---
    tags:
      - Auth
    security:
      - Bearer: []
    responses:
      200:
        description: Perfil do usuário
        schema:
          type: object
          properties:
            user_id:
              type: string
              format: uuid
            profile:
              $ref: '#/definitions/Usuario'
      401:
        description: Token inválido ou expirado
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Token inválido"
      404:
        description: Perfil não encontrado
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Perfil não encontrado"
    """
    profile = get_current_user_profile(user_id)
    if not profile:
        return jsonify({"error": "Perfil não encontrado"}), 404
    return jsonify({"user_id": user_id, "profile": profile})


@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    """Renovar token de acesso
    Gera um novo access_token usando o refresh_token
    ---
    tags:
      - Auth
    parameters:
      - name: body
        in: body
        required: true
        description: Token de renovação
        schema:
          type: object
          required:
            - refresh_token
          properties:
            refresh_token:
              type: string
              description: Refresh token obtido no login
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    responses:
      200:
        description: Token renovado com sucesso
        schema:
          type: object
          properties:
            user:
              type: object
              properties:
                id:
                  type: string
                  format: uuid
                email:
                  type: string
            profile:
              $ref: '#/definitions/Usuario'
            access_token:
              type: string
              description: Novo token JWT
            refresh_token:
              type: string
              description: Novo refresh token
      401:
        description: Refresh token inválido ou expirado
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Refresh inválido"
      400:
        description: Refresh token não fornecido
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Campo obrigatório: refresh_token"
    """
    data = request.get_json(silent=True) or {}
    refresh_token = data.get("refresh_token")
    if not refresh_token:
        return jsonify({"error": "Campo obrigatório: refresh_token"}), 400

    client = get_public_client()
    try:
        # supabase-py v2 aceita string diretamente
        res = client.auth.refresh_session(refresh_token)
    except Exception:
        try:
            # fallback com dict (varia conforme versão)
            res = client.auth.refresh_session({"refresh_token": refresh_token})
        except Exception as e2:
            return jsonify({"error": f"Falha no refresh: {e2}"}), 401

    session = getattr(res, "session", None) or res
    user = getattr(res, "user", None) or getattr(session, "user", None)
    if not session or not user:
        return jsonify({"error": "Refresh inválido"}), 401

    user_id = user.id if hasattr(user, "id") else user.get("id")
    try:
        profile = get_current_user_profile(user_id)
    except Exception:
        profile = None

    resp = attach_session_cookies(
        getattr(session, "access_token", None),
        getattr(session, "refresh_token", None),
        {"user": {"id": user_id, "email": getattr(user, "email", None)}, "profile": profile},
    )
    return resp


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logout do usuário
    Limpa os cookies de sessão e invalida o token
    ---
    tags:
      - Auth
    responses:
      200:
        description: Logout realizado com sucesso
        schema:
          type: object
          properties:
            message:
              type: string
              example: "Logout realizado com sucesso"
        headers:
          Set-Cookie:
            description: Cookies limpos
            type: string
    """
    return clear_session_cookies()
