from typing import Any, Dict

from flask import Blueprint, request

from auth import require_auth
from supabase_client import get_admin_client
from utils import ok, fail, paginate_params


anuncios_bp = Blueprint("anuncios", __name__, url_prefix="/api/anuncios")


def _select_anuncio_query():
    return (
        get_admin_client()
        .table("anuncios")
        .select("*")
    )


@anuncios_bp.get("")
def list_anuncios():
    """Listar anúncios
    Lista anúncios com filtros opcionais e paginação
    ---
    tags:
      - Anúncios
    parameters:
      - name: tipo
        in: query
        type: string
        enum: [oferta, oportunidade]
        description: Filtrar por tipo (oferta=profissional oferece, oportunidade=cliente busca)
      - name: categoria_id
        in: query
        type: integer
        description: ID da categoria para filtrar
      - name: busca
        in: query
        type: string
        description: Busca por título ou descrição
      - name: urgencia
        in: query
        type: string
        enum: [normal, alta]
        description: Filtrar por nível de urgência
      - name: status
        in: query
        type: string
        enum: [disponivel, fechado, cancelado]
        description: Filtrar por status
      - name: order
        in: query
        type: string
        enum: [recentes, antigos]
        default: recentes
        description: Ordenação dos resultados
      - name: page
        in: query
        type: integer
        default: 1
        description: Número da página (paginação)
      - name: limit
        in: query
        type: integer
        default: 20
        description: Limite de itens por página
    responses:
      200:
        description: Lista de anúncios
        schema:
          type: object
          properties:
            items:
              type: array
              items:
                $ref: '#/definitions/Anuncio'
            total:
              type: integer
              description: Total de anúncios encontrados (quando disponível)
            page:
              type: integer
            limit:
              type: integer
            offset:
              type: integer
      500:
        description: Erro ao listar anúncios
        schema:
          type: object
          properties:
            error:
              type: string
    """
    args = request.args
    tipo = args.get("tipo")
    categoria_id = args.get("categoria_id")
    busca = args.get("busca")
    urgencia = args.get("urgencia")
    status = args.get("status")
    order = args.get("order", "recentes")

    try:
        q = _select_anuncio_query()
        if tipo in ("oferta", "oportunidade"):
            q = q.eq("tipo", tipo)
        if categoria_id and categoria_id.isdigit():
            q = q.eq("categoria_id", int(categoria_id))
        if urgencia in ("normal", "alta"):
            q = q.eq("urgencia", urgencia)
        if status in ("disponivel", "fechado", "cancelado"):
            q = q.eq("status", status)
        if busca:
            # ilike em titulo ou descricao
            like = f"%{busca}%"
            # supabase-py não tem OR simples; usamos RPC utilizando or via querystring? Alternativamente, aplicar filtro via text search não trivial.
            # Estratégia simples: duas queries e mescla única por id (custo extra aceitável no MVP)
            q1 = _select_anuncio_query()
            if tipo in ("oferta", "oportunidade"):
                q1 = q1.eq("tipo", tipo)
            if categoria_id and categoria_id.isdigit():
                q1 = q1.eq("categoria_id", int(categoria_id))
            if urgencia in ("normal", "alta"):
                q1 = q1.eq("urgencia", urgencia)
            if status in ("disponivel", "fechado", "cancelado"):
                q1 = q1.eq("status", status)
            by_title = q1.ilike("titulo", like).execute().data or []

            q2 = _select_anuncio_query()
            if tipo in ("oferta", "oportunidade"):
                q2 = q2.eq("tipo", tipo)
            if categoria_id and categoria_id.isdigit():
                q2 = q2.eq("categoria_id", int(categoria_id))
            if urgencia in ("normal", "alta"):
                q2 = q2.eq("urgencia", urgencia)
            if status in ("disponivel", "fechado", "cancelado"):
                q2 = q2.eq("status", status)
            by_desc = q2.ilike("descricao", like).execute().data or []

            seen = set()
            merged = []
            for it in by_title + by_desc:
                if it["id"] not in seen:
                    seen.add(it["id"])
                    merged.append(it)

            # ordenar
            if order == "recentes":
                merged.sort(key=lambda x: x.get("publicado_em"), reverse=True)
            elif order == "antigos":
                merged.sort(key=lambda x: x.get("publicado_em"))

            # Paginação simples via query params
            page = paginate_params(args)
            start = page["offset"]
            end = start + page["limit"]
            return ok({"items": merged[start:end], "total": len(merged), **page})

        # Sem busca: usar order do banco
        if order == "recentes":
            q = q.order("publicado_em", desc=True)
        elif order == "antigos":
            q = q.order("publicado_em", desc=False)
        page = paginate_params(args)
        q = q.range(page["offset"], page["offset"] + page["limit"] - 1)
        res = q.execute().data or []
        # Não temos total facilmente; retornamos somente página
        return ok({"items": res, **page})
    except Exception as e:
        return fail(f"Falha ao listar anúncios: {e}", 500)


@anuncios_bp.post("")
@require_auth
def create_anuncio(user_id: str):
    """Criar novo anúncio
    Cria um novo anúncio de serviço (oferta ou oportunidade)
    ---
    tags:
      - Anúncios
    security:
      - Bearer: []
    parameters:
      - name: body
        in: body
        required: true
        description: Dados do novo anúncio
        schema:
          type: object
          required:
            - categoria_id
            - titulo
            - descricao
          properties:
            tipo:
              type: string
              enum: [oferta, oportunidade]
              description: Tipo do anúncio (inferido automaticamente se não fornecido)
              example: "oferta"
            categoria_id:
              type: integer
              description: ID da categoria do serviço
              example: 1
            titulo:
              type: string
              description: Título do anúncio
              example: "Instalação elétrica residencial"
            descricao:
              type: string
              description: Descrição detalhada do serviço
              example: "Realizo instalação elétrica completa em residências"
            localizacao:
              type: string
              description: Localização onde o serviço será prestado
              example: "São Paulo, SP"
            preco_min:
              type: number
              format: float
              description: Preço mínimo em R$
              example: 150.00
            preco_max:
              type: number
              format: float
              description: Preço máximo em R$
              example: 300.00
            urgencia:
              type: string
              enum: [normal, alta]
              description: Nível de urgência
              example: "normal"
            prazo:
              type: string
              format: date
              description: Prazo desejado (formato YYYY-MM-DD)
              example: "2025-11-01"
            status:
              type: string
              enum: [disponivel, fechado, cancelado]
              default: disponivel
              description: Status do anúncio
            imagens:
              type: array
              items:
                type: string
                format: uri
              description: URLs de imagens do anúncio
              example: ["https://example.com/imagem1.jpg"]
            requisitos:
              type: array
              items:
                type: string
              description: Lista de requisitos ou detalhes
              example: ["Experiência mínima de 2 anos", "Ferramentas próprias"]
    responses:
      201:
        description: Anúncio criado com sucesso
        schema:
          $ref: '#/definitions/Anuncio'
      400:
        description: Dados inválidos ou campos obrigatórios faltando
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Campo obrigatório: categoria_id"
      401:
        description: Não autenticado
        schema:
          type: object
          properties:
            error:
              type: string
    """
    body: Dict[str, Any] = request.get_json(silent=True) or {}
    tipo = (body.get("tipo") or "").strip().lower()
    if not tipo:
        # Inferência simples: se tem prazo/urgencia assume oportunidade; senão, oferta
        if body.get("prazo") or body.get("urgencia"):
            tipo = "oportunidade"
        else:
            tipo = "oferta"
    if tipo not in ("oferta", "oportunidade"):
        return fail("tipo inválido (oferta|oportunidade)", 400)

    required = ["categoria_id", "titulo", "descricao"]
    for r in required:
        if not body.get(r):
            return fail(f"Campo obrigatório: {r}", 400)

    payload = {
        "usuario_id": user_id,
        "tipo": tipo,
        "categoria_id": body.get("categoria_id"),
        "titulo": body.get("titulo"),
        "descricao": body.get("descricao"),
        "localizacao": body.get("localizacao"),
        "preco_min": body.get("preco_min"),
        "preco_max": body.get("preco_max"),
        "urgencia": body.get("urgencia"),
        "prazo": body.get("prazo"),
        "status": body.get("status", "disponivel"),
        "imagens": body.get("imagens") or [],
        "requisitos": body.get("requisitos") or [],
    }

    try:
        res = get_admin_client().table("anuncios").insert(payload).execute()
        return ok((res.data or [None])[0], 201)
    except Exception as e:
        return fail(f"Falha ao criar anúncio: {e}", 400)


def _anuncio_by_id(anuncio_id: int):
    return get_admin_client().table("anuncios").select("*").eq("id", anuncio_id).single().execute().data


@anuncios_bp.get("/<int:anuncio_id>")
def get_anuncio(anuncio_id: int):
    """Obter anúncio por ID
    Retorna os detalhes de um anúncio específico
    ---
    tags:
      - Anúncios
    parameters:
      - name: anuncio_id
        in: path
        type: integer
        required: true
        description: ID do anúncio
    responses:
      200:
        description: Detalhes do anúncio
        schema:
          $ref: '#/definitions/Anuncio'
      404:
        description: Anúncio não encontrado
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Anúncio não encontrado"
      500:
        description: Erro ao obter anúncio
        schema:
          type: object
          properties:
            error:
              type: string
    """
    try:
        data = _anuncio_by_id(anuncio_id)
        if not data:
            return fail("Anúncio não encontrado", 404)
        return ok(data)
    except Exception as e:
        return fail(f"Falha ao obter anúncio: {e}", 500)


@anuncios_bp.patch("/<int:anuncio_id>")
@require_auth
def update_anuncio(user_id: str, anuncio_id: int):
    """Atualizar anúncio
    Atualiza os dados de um anúncio existente (apenas o dono pode atualizar)
    ---
    tags:
      - Anúncios
    security:
      - Bearer: []
    parameters:
      - name: anuncio_id
        in: path
        type: integer
        required: true
        description: ID do anúncio a ser atualizado
      - name: body
        in: body
        required: true
        description: Campos a serem atualizados
        schema:
          type: object
          properties:
            categoria_id:
              type: integer
            titulo:
              type: string
            descricao:
              type: string
            localizacao:
              type: string
            preco_min:
              type: number
            preco_max:
              type: number
            urgencia:
              type: string
              enum: [normal, alta]
            prazo:
              type: string
              format: date
            status:
              type: string
              enum: [disponivel, fechado, cancelado]
            imagens:
              type: array
              items:
                type: string
            requisitos:
              type: array
              items:
                type: string
    responses:
      200:
        description: Anúncio atualizado com sucesso
        schema:
          $ref: '#/definitions/Anuncio'
      400:
        description: Dados inválidos
        schema:
          type: object
          properties:
            error:
              type: string
      401:
        description: Não autenticado
        schema:
          type: object
          properties:
            error:
              type: string
      403:
        description: Acesso negado (não é o dono do anúncio)
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Acesso negado"
      404:
        description: Anúncio não encontrado
        schema:
          type: object
          properties:
            error:
              type: string
    """
    body = request.get_json(silent=True) or {}
    try:
        current = _anuncio_by_id(anuncio_id)
        if not current:
            return fail("Anúncio não encontrado", 404)
        if current.get("usuario_id") != user_id:
            return fail("Acesso negado", 403)
        allowed = {
            "categoria_id",
            "titulo",
            "descricao",
            "localizacao",
            "preco_min",
            "preco_max",
            "urgencia",
            "prazo",
            "status",
            "imagens",
            "requisitos",
        }
        update_payload = {k: v for k, v in body.items() if k in allowed}
        if not update_payload:
            return fail("Nenhum campo válido para atualizar", 400)
        res = (
            get_admin_client()
            .table("anuncios")
            .update(update_payload)
            .eq("id", anuncio_id)
            .execute()
        )
        return ok((res.data or [None])[0])
    except Exception as e:
        return fail(f"Falha ao atualizar anúncio: {e}", 400)


@anuncios_bp.delete("/<int:anuncio_id>")
@require_auth
def delete_anuncio(user_id: str, anuncio_id: int):
    """Excluir anúncio
    Remove um anúncio (apenas o dono pode excluir)
    ---
    tags:
      - Anúncios
    security:
      - Bearer: []
    parameters:
      - name: anuncio_id
        in: path
        type: integer
        required: true
        description: ID do anúncio a ser excluído
    responses:
      200:
        description: Anúncio excluído com sucesso
        schema:
          type: object
          properties:
            deleted:
              type: boolean
              example: true
      400:
        description: Erro ao excluir
        schema:
          type: object
          properties:
            error:
              type: string
      401:
        description: Não autenticado
        schema:
          type: object
          properties:
            error:
              type: string
      403:
        description: Acesso negado
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Acesso negado"
      404:
        description: Anúncio não encontrado
        schema:
          type: object
          properties:
            error:
              type: string
    """
    try:
        current = _anuncio_by_id(anuncio_id)
        if not current:
            return fail("Anúncio não encontrado", 404)
        if current.get("usuario_id") != user_id:
            return fail("Acesso negado", 403)
        get_admin_client().table("anuncios").delete().eq("id", anuncio_id).execute()
        return ok({"deleted": True})
    except Exception as e:
        return fail(f"Falha ao excluir anúncio: {e}", 400)
