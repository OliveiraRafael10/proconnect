import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger

from .config import settings
from .auth import AuthError
from .routes_auth import auth_bp
from .routes_users import users_bp
from .routes_categorias import categorias_bp
from .routes_anuncios import anuncios_bp
from .routes_propostas import propostas_bp
from .routes_contratacoes import contratacoes_bp
from .routes_avaliacoes import avaliacoes_bp
from .routes_chat import chat_bp
from .routes_profissionais import profissionais_bp
from .swagger_definitions import SWAGGER_DEFINITIONS


def create_app() -> Flask:
    settings.validate()

    app = Flask(__name__)

    # CORS
    cors_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()] if settings.cors_origins else ["*"]
    CORS(
        app,
        resources={r"/api/*": {"origins": cors_origins}},
        supports_credentials=True,
        expose_headers=["Content-Type"],
        allow_headers=["Content-Type", "Authorization", "X-CSRF-Token"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    # Swagger/OpenAPI Configuration
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec",
                "route": "/apispec.json",
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/api/docs/",
    }

    swagger_template = {
        "swagger": "2.0",
        "info": {
            "title": "Lance Fácil API",
            "description": "API completa para a plataforma Lance Fácil - Conectando clientes e profissionais de serviços",
            "contact": {
                "name": "Equipe Lance Fácil",
                "email": "contato@lancefacil.com.br",
            },
            "version": "1.0.0",
        },
        "host": os.getenv("API_HOST", "localhost:5000"),
        "basePath": "/",
        "schemes": ["http", "https"],
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "Token JWT no formato: Bearer {token}",
            }
        },
        "tags": [
            {"name": "Auth", "description": "Autenticação e autorização de usuários"},
            {"name": "Users", "description": "Gerenciamento de perfil de usuários"},
            {"name": "Categorias", "description": "Categorias de serviços disponíveis"},
            {"name": "Anúncios", "description": "Anúncios de serviços (ofertas e oportunidades)"},
            {"name": "Propostas", "description": "Propostas de serviços"},
            {"name": "Contratações", "description": "Gerenciamento de contratações"},
            {"name": "Avaliações", "description": "Avaliações de serviços e profissionais"},
            {"name": "Chat", "description": "Sistema de mensagens entre usuários"},
            {"name": "Profissionais", "description": "Listagem e busca de profissionais"},
        ],
        "definitions": SWAGGER_DEFINITIONS,
    }

    Swagger(app, config=swagger_config, template=swagger_template)

    # Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(categorias_bp)
    app.register_blueprint(anuncios_bp)
    app.register_blueprint(propostas_bp)
    app.register_blueprint(contratacoes_bp)
    app.register_blueprint(avaliacoes_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(profissionais_bp)

    # Healthcheck
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    # Handler para ignorar requisições HTTPS malformadas (handshakes TLS)
    @app.before_request
    def handle_preflight():
        # Ignora requisições que parecem ser handshakes TLS/SSL
        if request.method == 'OPTIONS':
            return '', 200
        # Verifica se a requisição parece ser um handshake TLS (começa com \x16\x03)
        try:
            if hasattr(request, 'data') and request.data:
                data = request.data[:3] if len(request.data) >= 3 else b''
                # Handshakes TLS começam com 0x16 0x03
                if data[:2] == b'\x16\x03':
                    return '', 400
        except Exception:
            pass
    
    # Handler específico para AuthError (retorna 401 ou 403)
    @app.errorhandler(AuthError)
    def handle_auth_error(e):
        return jsonify({"error": str(e)}), e.status_code

    # JSON error handlers
    @app.errorhandler(Exception)
    def handle_exception(e):
        # Se for AuthError, não tratar aqui (já foi tratado acima)
        if isinstance(e, AuthError):
            return handle_auth_error(e)
        
        try:
            from werkzeug.exceptions import HTTPException
            if isinstance(e, HTTPException):
                # Ignora erros de requisições malformadas silenciosamente
                error_desc = str(e.description) if hasattr(e, 'description') else str(e)
                if 'Bad request' in error_desc or 'Bad request version' in error_desc or 'Bad request syntax' in error_desc:
                    return '', 400
                return jsonify({"error": e.description}), e.code
        except Exception:
            pass
        # Ignora erros de requisições malformadas (handshakes TLS)
        error_str = str(e)
        if 'Bad request' in error_str or 'Bad request version' in error_str or 'Bad request syntax' in error_str:
            return '', 400
        return jsonify({"error": str(e)}), 500

    return app


app = create_app()
