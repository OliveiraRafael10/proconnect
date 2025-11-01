"""
Definições de modelos para Swagger/OpenAPI
Este arquivo contém as definições que podem ser referenciadas via $ref
"""

SWAGGER_DEFINITIONS = {
    "Usuario": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "format": "uuid",
                "description": "ID único do usuário",
                "example": "550e8400-e29b-41d4-a716-446655440000"
            },
            "nome": {
                "type": "string",
                "description": "Nome completo do usuário",
                "example": "João Silva"
            },
            "email": {
                "type": "string",
                "format": "email",
                "description": "Email do usuário",
                "example": "joao@email.com"
            },
            "cpf": {
                "type": "string",
                "description": "CPF (apenas dígitos)",
                "example": "12345678900"
            },
            "apelido": {
                "type": "string",
                "description": "Apelido ou nome de exibição",
                "example": "João"
            },
            "foto_url": {
                "type": "string",
                "format": "uri",
                "description": "URL da foto de perfil",
                "example": "https://storage.example.com/foto.jpg"
            },
            "telefone_ddd": {
                "type": "string",
                "description": "DDD do telefone",
                "example": "11"
            },
            "telefone_numero": {
                "type": "string",
                "description": "Número do telefone",
                "example": "987654321"
            },
            "endereco_cep": {
                "type": "string",
                "description": "CEP (8 dígitos)",
                "example": "01310100"
            },
            "endereco_logradouro": {
                "type": "string",
                "description": "Logradouro do endereço",
                "example": "Avenida Paulista"
            },
            "endereco_numero": {
                "type": "string",
                "description": "Número do endereço",
                "example": "1000"
            },
            "endereco_bairro": {
                "type": "string",
                "description": "Bairro",
                "example": "Bela Vista"
            },
            "endereco_cidade": {
                "type": "string",
                "description": "Cidade",
                "example": "São Paulo"
            },
            "endereco_estado": {
                "type": "string",
                "description": "Estado (UF)",
                "example": "SP"
            },
            "endereco_complemento": {
                "type": "string",
                "description": "Complemento do endereço",
                "example": "Apto 101"
            },
            "is_worker": {
                "type": "boolean",
                "description": "Se o usuário é um profissional",
                "example": True
            },
            "email_verificado": {
                "type": "boolean",
                "description": "Se o email foi verificado",
                "example": True
            },
            "perfil_worker": {
                "type": "object",
                "description": "Informações do perfil profissional (se is_worker=true)",
                "properties": {
                    "descricao": {
                        "type": "string",
                        "description": "Descrição profissional",
                        "example": "Eletricista com 10 anos de experiência"
                    },
                    "categorias": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Categorias de serviço que oferece",
                        "example": ["eletrica", "instalacao"]
                    },
                    "experiencia_anos": {
                        "type": "number",
                        "description": "Anos de experiência",
                        "example": 10
                    },
                    "portfolio": {
                        "type": "array",
                        "items": {"type": "string", "format": "uri"},
                        "description": "URLs de imagens do portfólio",
                        "example": ["https://example.com/portfolio1.jpg"]
                    }
                }
            },
            "preferencias": {
                "type": "object",
                "description": "Preferências do usuário"
            },
            "criado_em": {
                "type": "string",
                "format": "date-time",
                "description": "Data e hora de criação",
                "example": "2025-10-17T10:30:00Z"
            },
            "atualizado_em": {
                "type": "string",
                "format": "date-time",
                "description": "Data e hora da última atualização",
                "example": "2025-10-17T10:30:00Z"
            }
        }
    },
    "Anuncio": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "description": "ID único do anúncio",
                "example": 1
            },
            "usuario_id": {
                "type": "string",
                "format": "uuid",
                "description": "ID do usuário que criou o anúncio",
                "example": "550e8400-e29b-41d4-a716-446655440000"
            },
            "tipo": {
                "type": "string",
                "enum": ["oferta", "oportunidade"],
                "description": "Tipo: oferta (profissional oferece) ou oportunidade (cliente busca)",
                "example": "oferta"
            },
            "categoria_id": {
                "type": "integer",
                "description": "ID da categoria do serviço",
                "example": 1
            },
            "titulo": {
                "type": "string",
                "description": "Título do anúncio",
                "example": "Instalação elétrica residencial"
            },
            "descricao": {
                "type": "string",
                "description": "Descrição detalhada do serviço",
                "example": "Realizo instalação elétrica completa em residências com garantia"
            },
            "localizacao": {
                "type": "string",
                "description": "Localização onde o serviço será prestado",
                "example": "São Paulo, SP"
            },
            "preco_min": {
                "type": "number",
                "format": "float",
                "description": "Preço mínimo em R$",
                "example": 150.00
            },
            "preco_max": {
                "type": "number",
                "format": "float",
                "description": "Preço máximo em R$",
                "example": 300.00
            },
            "urgencia": {
                "type": "string",
                "enum": ["normal", "alta"],
                "description": "Nível de urgência do serviço",
                "example": "normal"
            },
            "prazo": {
                "type": "string",
                "format": "date",
                "description": "Prazo desejado para o serviço",
                "example": "2025-11-01"
            },
            "status": {
                "type": "string",
                "enum": ["disponivel", "fechado", "cancelado"],
                "description": "Status do anúncio",
                "example": "disponivel"
            },
            "imagens": {
                "type": "array",
                "items": {"type": "string", "format": "uri"},
                "description": "URLs de imagens do anúncio",
                "example": ["https://example.com/imagem1.jpg"]
            },
            "requisitos": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Lista de requisitos ou detalhes adicionais",
                "example": ["Experiência mínima de 2 anos", "Ferramentas próprias"]
            },
            "publicado_em": {
                "type": "string",
                "format": "date-time",
                "description": "Data e hora de publicação",
                "example": "2025-10-17T10:30:00Z"
            },
            "atualizado_em": {
                "type": "string",
                "format": "date-time",
                "description": "Data e hora da última atualização",
                "example": "2025-10-17T10:30:00Z"
            }
        }
    },
    "Categoria": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "description": "ID da categoria",
                "example": 1
            },
            "nome": {
                "type": "string",
                "description": "Nome da categoria",
                "example": "Elétrica"
            },
            "slug": {
                "type": "string",
                "description": "Slug da categoria para URLs",
                "example": "eletrica"
            },
            "icone": {
                "type": "string",
                "description": "Nome do ícone ou URL",
                "example": "bolt"
            },
            "descricao": {
                "type": "string",
                "description": "Descrição da categoria",
                "example": "Serviços relacionados a instalação e manutenção elétrica"
            }
        }
    },
    "Proposta": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "description": "ID da proposta",
                "example": 1
            },
            "anuncio_id": {
                "type": "integer",
                "description": "ID do anúncio relacionado",
                "example": 1
            },
            "profissional_id": {
                "type": "string",
                "format": "uuid",
                "description": "ID do profissional que fez a proposta"
            },
            "mensagem": {
                "type": "string",
                "description": "Mensagem da proposta",
                "example": "Tenho 10 anos de experiência neste tipo de serviço"
            },
            "preco_proposto": {
                "type": "number",
                "format": "float",
                "description": "Preço proposto em R$",
                "example": 200.00
            },
            "prazo_proposto": {
                "type": "string",
                "format": "date",
                "description": "Prazo proposto",
                "example": "2025-10-25"
            },
            "status": {
                "type": "string",
                "enum": ["pendente", "aceita", "recusada", "cancelada"],
                "description": "Status da proposta",
                "example": "pendente"
            },
            "criada_em": {
                "type": "string",
                "format": "date-time"
            }
        }
    },
    "Contratacao": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "description": "ID da contratação",
                "example": 1
            },
            "proposta_id": {
                "type": "integer",
                "description": "ID da proposta aceita"
            },
            "cliente_id": {
                "type": "string",
                "format": "uuid",
                "description": "ID do cliente"
            },
            "profissional_id": {
                "type": "string",
                "format": "uuid",
                "description": "ID do profissional contratado"
            },
            "status": {
                "type": "string",
                "enum": ["ativa", "concluida", "cancelada"],
                "description": "Status da contratação",
                "example": "ativa"
            },
            "valor_acordado": {
                "type": "number",
                "format": "float",
                "description": "Valor acordado em R$",
                "example": 200.00
            },
            "data_inicio": {
                "type": "string",
                "format": "date",
                "description": "Data de início do serviço"
            },
            "data_conclusao": {
                "type": "string",
                "format": "date",
                "description": "Data de conclusão do serviço"
            },
            "criada_em": {
                "type": "string",
                "format": "date-time"
            }
        }
    },
    "Avaliacao": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "description": "ID da avaliação",
                "example": 1
            },
            "contratacao_id": {
                "type": "integer",
                "description": "ID da contratação avaliada"
            },
            "avaliador_id": {
                "type": "string",
                "format": "uuid",
                "description": "ID de quem avaliou"
            },
            "avaliado_id": {
                "type": "string",
                "format": "uuid",
                "description": "ID de quem foi avaliado"
            },
            "nota": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5,
                "description": "Nota de 1 a 5",
                "example": 5
            },
            "comentario": {
                "type": "string",
                "description": "Comentário da avaliação",
                "example": "Excelente profissional, recomendo!"
            },
            "criada_em": {
                "type": "string",
                "format": "date-time"
            }
        }
    },
    "Mensagem": {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "description": "ID da mensagem",
                "example": 1
            },
            "remetente_id": {
                "type": "string",
                "format": "uuid",
                "description": "ID do remetente"
            },
            "destinatario_id": {
                "type": "string",
                "format": "uuid",
                "description": "ID do destinatário"
            },
            "conteudo": {
                "type": "string",
                "description": "Conteúdo da mensagem",
                "example": "Olá, tenho interesse no seu serviço"
            },
            "lida": {
                "type": "boolean",
                "description": "Se a mensagem foi lida",
                "example": False
            },
            "enviada_em": {
                "type": "string",
                "format": "date-time"
            }
        }
    },
    "Error": {
        "type": "object",
        "properties": {
            "error": {
                "type": "string",
                "description": "Mensagem de erro",
                "example": "Erro ao processar requisição"
            }
        }
    },
    "Success": {
        "type": "object",
        "properties": {
            "message": {
                "type": "string",
                "description": "Mensagem de sucesso",
                "example": "Operação realizada com sucesso"
            }
        }
    }
}

