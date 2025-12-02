"""
Schemas reutilizáveis para documentação Swagger/OpenAPI
"""

# === SCHEMAS DE USUÁRIO ===

usuario_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string", "format": "uuid", "description": "ID único do usuário"},
        "nome": {"type": "string", "description": "Nome completo do usuário"},
        "email": {"type": "string", "format": "email", "description": "Email do usuário"},
        "cpf": {"type": "string", "description": "CPF (apenas dígitos)"},
        "apelido": {"type": "string", "description": "Apelido/nome de exibição"},
        "foto_url": {"type": "string", "format": "uri", "description": "URL da foto de perfil"},
        "telefone_ddd": {"type": "string", "description": "DDD do telefone (2 dígitos)"},
        "telefone_numero": {"type": "string", "description": "Número do telefone"},
        "endereco_cep": {"type": "string", "description": "CEP (8 dígitos)"},
        "endereco_logradouro": {"type": "string", "description": "Logradouro"},
        "endereco_numero": {"type": "string", "description": "Número do endereço"},
        "endereco_bairro": {"type": "string", "description": "Bairro"},
        "endereco_cidade": {"type": "string", "description": "Cidade"},
        "endereco_estado": {"type": "string", "description": "Estado (UF)"},
        "endereco_complemento": {"type": "string", "description": "Complemento"},
        "is_worker": {"type": "boolean", "description": "Se o usuário é um profissional"},
        "email_verificado": {"type": "boolean", "description": "Se o email foi verificado"},
        "perfil_worker": {
            "type": "object",
            "description": "Informações do perfil profissional",
            "properties": {
                "descricao": {"type": "string", "description": "Descrição profissional"},
                "categorias": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Categorias de serviço que oferece"
                },
                "experiencia_anos": {"type": "number", "description": "Anos de experiência"},
                "portfolio": {
                    "type": "array",
                    "items": {"type": "string", "format": "uri"},
                    "description": "URLs de imagens do portfólio"
                }
            }
        },
        "preferencias": {
            "type": "object",
            "description": "Preferências do usuário",
        },
        "criado_em": {"type": "string", "format": "date-time"},
        "atualizado_em": {"type": "string", "format": "date-time"},
    }
}

# === SCHEMAS DE AUTENTICAÇÃO ===

auth_response_schema = {
    "type": "object",
    "properties": {
        "user": {
            "type": "object",
            "properties": {
                "id": {"type": "string", "format": "uuid"},
                "email": {"type": "string", "format": "email"},
            }
        },
        "profile": usuario_schema,
        "access_token": {"type": "string", "description": "Token JWT de acesso"},
        "refresh_token": {"type": "string", "description": "Token para renovação"},
    }
}

# === SCHEMAS DE ANÚNCIO ===

anuncio_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "integer", "description": "ID único do anúncio"},
        "usuario_id": {"type": "string", "format": "uuid", "description": "ID do usuário que criou"},
        "tipo": {
            "type": "string",
            "enum": ["oferta", "oportunidade"],
            "description": "Tipo do anúncio: oferta (profissional oferece) ou oportunidade (cliente busca)"
        },
        "categoria_id": {"type": "integer", "description": "ID da categoria do serviço"},
        "titulo": {"type": "string", "description": "Título do anúncio"},
        "descricao": {"type": "string", "description": "Descrição detalhada"},
        "localizacao": {"type": "string", "description": "Localização do serviço"},
        "preco_min": {"type": "number", "format": "float", "description": "Preço mínimo em R$"},
        "preco_max": {"type": "number", "format": "float", "description": "Preço máximo em R$"},
        "urgencia": {
            "type": "string",
            "enum": ["normal", "alta"],
            "description": "Nível de urgência"
        },
        "prazo": {"type": "string", "format": "date", "description": "Prazo desejado"},
        "status": {
            "type": "string",
            "enum": ["disponivel", "fechado", "cancelado"],
            "description": "Status do anúncio"
        },
        "imagens": {
            "type": "array",
            "items": {"type": "string", "format": "uri"},
            "description": "URLs de imagens do anúncio"
        },
        "requisitos": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Lista de requisitos ou detalhes"
        },
        "publicado_em": {"type": "string", "format": "date-time"},
        "atualizado_em": {"type": "string", "format": "date-time"},
    }
}

# === SCHEMAS DE ERRO ===

error_schema = {
    "type": "object",
    "properties": {
        "error": {"type": "string", "description": "Mensagem de erro"}
    }
}

# === SCHEMAS DE SUCESSO ===

success_schema = {
    "type": "object",
    "properties": {
        "message": {"type": "string", "description": "Mensagem de sucesso"}
    }
}

# === SCHEMAS DE PAGINAÇÃO ===

pagination_response = lambda item_schema: {
    "type": "object",
    "properties": {
        "items": {
            "type": "array",
            "items": item_schema,
            "description": "Lista de itens da página atual"
        },
        "total": {"type": "integer", "description": "Total de itens (quando disponível)"},
        "page": {"type": "integer", "description": "Página atual"},
        "limit": {"type": "integer", "description": "Limite de itens por página"},
        "offset": {"type": "integer", "description": "Offset aplicado"},
    }
}

