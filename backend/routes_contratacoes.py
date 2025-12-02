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


@contratacoes_bp.post("/solicitar-direta")
@require_auth
def solicitar_contratacao_direta(user_id: str):
    """Solicitar contratação direta de um profissional
    Cria um anúncio privado e uma proposta automaticamente para o profissional
    ---
    tags:
      - Contratações
    security:
      - Bearer: []
    parameters:
      - name: body
        in: body
        required: true
        description: Dados da solicitação de contratação
        schema:
          type: object
          required:
            - profissional_id
            - categoria_id
            - titulo
            - descricao
          properties:
            profissional_id:
              type: string
              format: uuid
              description: ID do profissional a ser contratado
            categoria_id:
              type: integer
              description: ID da categoria do serviço
            titulo:
              type: string
              description: Título do serviço
            descricao:
              type: string
              description: Descrição detalhada do serviço
            localizacao:
              type: string
              description: Localização onde o serviço será prestado
            preco_min:
              type: number
              format: float
              description: Preço mínimo em R$
            preco_max:
              type: number
              format: float
              description: Preço máximo em R$
            prazo:
              type: string
              format: date
              description: Prazo desejado (formato YYYY-MM-DD)
            urgencia:
              type: string
              enum: [normal, alta]
              description: Nível de urgência
            requisitos:
              type: array
              items:
                type: string
              description: Lista de requisitos
            valor_proposto:
              type: number
              format: float
              description: Valor proposto (opcional)
            mensagem:
              type: string
              description: Mensagem adicional para o profissional (opcional)
    responses:
      201:
        description: Solicitação criada com sucesso
        schema:
          type: object
          properties:
            anuncio:
              $ref: '#/definitions/Anuncio'
            proposta:
              type: object
      400:
        description: Dados inválidos
      401:
        description: Não autenticado
    """
    body: Dict[str, Any] = request.get_json(silent=True) or {}
    profissional_id = body.get("profissional_id")
    categoria_id = body.get("categoria_id")
    titulo = body.get("titulo")
    descricao = body.get("descricao")
    
    if not profissional_id:
        return fail("profissional_id é obrigatório", 400)
    if not categoria_id:
        return fail("categoria_id é obrigatório", 400)
    if not titulo:
        return fail("titulo é obrigatório", 400)
    if not descricao:
        return fail("descricao é obrigatória", 400)
    
    admin = get_admin_client()
    
    # Verificar se o profissional existe e é worker
    try:
        profissional = admin.table("usuarios").select("id, nome, is_worker").eq("id", profissional_id).single().execute().data
        if not profissional:
            return fail("Profissional não encontrado", 404)
        if not profissional.get("is_worker"):
            return fail("O usuário selecionado não é um profissional", 400)
    except Exception as e:
        return fail(f"Erro ao verificar profissional: {e}", 400)
    
    try:
        # 1. Criar anúncio privado (direcionado ao profissional)
        anuncio_payload = {
            "usuario_id": user_id,
            "tipo": "oportunidade",
            "categoria_id": categoria_id,
            "titulo": titulo,
            "descricao": descricao,
            "localizacao": body.get("localizacao"),
            "preco_min": body.get("preco_min"),
            "preco_max": body.get("preco_max"),
            "prazo": body.get("prazo"),
            "urgencia": body.get("urgencia", "normal"),
            "status": "disponivel",
            "imagens": body.get("imagens") or [],
            "requisitos": body.get("requisitos") or [],
        }
        
        # Adicionar profissional_direcionado_id apenas se a coluna existir no banco
        # Tentamos adicionar o campo; se a coluna não existir, o insert falhará e trataremos
        anuncio_payload["profissional_direcionado_id"] = profissional_id
        
        # Tentar inserir o anúncio; se falhar por causa da coluna não existir, tentar sem ela
        try:
            anuncio_res = admin.table("anuncios").insert(anuncio_payload).execute()
        except Exception as e:
            # Se falhar por causa da coluna profissional_direcionado_id não existir, tentar sem ela
            error_str = str(e)
            if "profissional_direcionado_id" in error_str and ("does not exist" in error_str or "42703" in error_str):
                anuncio_payload.pop("profissional_direcionado_id", None)
                anuncio_res = admin.table("anuncios").insert(anuncio_payload).execute()
            else:
                raise  # Re-lançar se for outro erro
        anuncio_criado = (anuncio_res.data or [None])[0]
        
        if not anuncio_criado:
            return fail("Falha ao criar anúncio", 500)
        
        anuncio_id = anuncio_criado["id"]
        
        # Buscar dados do cliente (quem está contratando - user_id)
        try:
            cliente_data = admin.table("usuarios").select("nome").eq("id", user_id).single().execute().data
            nome_cliente = cliente_data.get("nome", "Usuário") if cliente_data else "Usuário"
        except Exception:
            nome_cliente = "Usuário"
        
        # 2. Criar proposta automaticamente (como se o profissional tivesse enviado)
        # A mensagem padrão indica que o cliente enviou uma proposta de trabalho
        mensagem_usuario = body.get("mensagem", "").strip()
        if mensagem_usuario:
            # Se o usuário forneceu uma mensagem, adiciona o prefixo
            mensagem_final = f"{nome_cliente} te enviou uma proposta de trabalho: {mensagem_usuario}"
        else:
            # Mensagem padrão sem mensagem adicional do usuário
            mensagem_final = f"{nome_cliente} te enviou uma proposta de trabalho"
        
        proposta_payload = {
            "anuncio_id": anuncio_id,
            "usuario_id_worker": profissional_id,  # Profissional recebe a proposta
            "valor_proposto": body.get("valor_proposto"),
            "mensagem": mensagem_final,
            "status": "enviada"
        }
        
        proposta_res = admin.table("propostas").insert(proposta_payload).execute()
        proposta_criada = (proposta_res.data or [None])[0]
        
        return ok({
            "anuncio": anuncio_criado,
            "proposta": proposta_criada,
            "profissional": {
                "id": profissional_id,
                "nome": profissional.get("nome")
            }
        }, 201)
    except Exception as e:
        return fail(f"Falha ao criar solicitação de contratação: {e}", 400)


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
