# 📚 Guia de Documentação Swagger - Lance Fácil API

## 🎯 Visão Geral

A API Lance Fácil agora possui documentação interativa completa usando **Swagger/OpenAPI** via Flasgger.

### 🔗 Acessando a Documentação

Após iniciar o servidor backend, acesse:

```
http://localhost:5000/api/docs/
```

Você verá uma interface interativa onde pode:
- ✅ Visualizar todos os endpoints disponíveis
- ✅ Testar endpoints diretamente pelo navegador
- ✅ Ver schemas de request/response
- ✅ Autenticar usando Bearer token

---

## 🚀 Como Testar Endpoints na Interface Swagger

### 1. **Endpoints Públicos** (sem autenticação)
- Clique no endpoint desejado (ex: `POST /api/auth/login`)
- Clique no botão **"Try it out"**
- Preencha os dados no JSON de exemplo
- Clique em **"Execute"**
- Veja a resposta abaixo

### 2. **Endpoints Protegidos** (requerem autenticação)

#### Passo 1: Fazer Login
1. Acesse `POST /api/auth/login`
2. Execute com suas credenciais
3. Copie o `access_token` da resposta

#### Passo 2: Autenticar no Swagger
1. Clique no botão **"Authorize"** 🔒 no topo da página
2. Digite: `Bearer SEU_TOKEN_AQUI` (com o espaço após "Bearer")
3. Clique em **"Authorize"**
4. Agora você pode testar endpoints protegidos!

---

## 📝 Como Documentar Novos Endpoints

### Template Básico

Adicione uma docstring YAML após a definição da função:

```python
@seu_bp.route("/endpoint", methods=["POST"])
@require_auth  # se requer autenticação
def seu_endpoint(user_id: str):  # se usa @require_auth
    """Título curto do endpoint
    Descrição mais detalhada do que o endpoint faz
    ---
    tags:
      - Nome da Tag (ex: Auth, Users, Anúncios)
    security:  # Apenas se requer autenticação
      - Bearer: []
    parameters:
      - name: parametro1
        in: query  # ou: path, body, header
        type: string  # ou: integer, boolean, array, object
        required: true  # ou: false
        description: Descrição do parâmetro
        example: "valor de exemplo"
    responses:
      200:
        description: Sucesso
        schema:
          type: object
          properties:
            campo1:
              type: string
            campo2:
              type: integer
      400:
        description: Erro de validação
        schema:
          type: object
          properties:
            error:
              type: string
    """
    # Seu código aqui
    pass
```

### Exemplos por Tipo de Endpoint

#### 1. **GET com Query Parameters**

```python
@bp.route("/items", methods=["GET"])
def list_items():
    """Listar itens com filtros
    ---
    tags:
      - Items
    parameters:
      - name: status
        in: query
        type: string
        enum: [ativo, inativo]
        description: Filtrar por status
      - name: page
        in: query
        type: integer
        default: 1
      - name: limit
        in: query
        type: integer
        default: 20
    responses:
      200:
        description: Lista de itens
        schema:
          type: object
          properties:
            items:
              type: array
              items:
                type: object
            total:
              type: integer
    """
    pass
```

#### 2. **POST com Body JSON**

```python
@bp.route("/items", methods=["POST"])
@require_auth
def create_item(user_id: str):
    """Criar novo item
    ---
    tags:
      - Items
    security:
      - Bearer: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - nome
            - categoria
          properties:
            nome:
              type: string
              example: "Meu Item"
            categoria:
              type: string
              example: "categoria1"
            preco:
              type: number
              format: float
              example: 99.90
            tags:
              type: array
              items:
                type: string
              example: ["tag1", "tag2"]
    responses:
      201:
        description: Item criado
        schema:
          $ref: '#/definitions/Item'
      400:
        description: Dados inválidos
    """
    pass
```

#### 3. **GET com Path Parameter**

```python
@bp.route("/items/<int:item_id>", methods=["GET"])
def get_item(item_id: int):
    """Obter item por ID
    ---
    tags:
      - Items
    parameters:
      - name: item_id
        in: path
        type: integer
        required: true
        description: ID do item
    responses:
      200:
        description: Detalhes do item
        schema:
          $ref: '#/definitions/Item'
      404:
        description: Item não encontrado
    """
    pass
```

#### 4. **PATCH para Atualização Parcial**

```python
@bp.route("/items/<int:item_id>", methods=["PATCH"])
@require_auth
def update_item(user_id: str, item_id: int):
    """Atualizar item
    ---
    tags:
      - Items
    security:
      - Bearer: []
    parameters:
      - name: item_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        schema:
          type: object
          properties:
            nome:
              type: string
            categoria:
              type: string
            preco:
              type: number
    responses:
      200:
        description: Atualizado
      403:
        description: Sem permissão
      404:
        description: Não encontrado
    """
    pass
```

#### 5. **DELETE**

```python
@bp.route("/items/<int:item_id>", methods=["DELETE"])
@require_auth
def delete_item(user_id: str, item_id: int):
    """Excluir item
    ---
    tags:
      - Items
    security:
      - Bearer: []
    parameters:
      - name: item_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Excluído com sucesso
        schema:
          type: object
          properties:
            deleted:
              type: boolean
      403:
        description: Sem permissão
      404:
        description: Não encontrado
    """
    pass
```

---

## 🔧 Schemas Reutilizáveis

Use `$ref` para referenciar schemas definidos:

```python
# Na resposta:
schema:
  $ref: '#/definitions/Usuario'

# Para arrays:
schema:
  type: array
  items:
    $ref: '#/definitions/Usuario'
```

Schemas disponíveis (ver `swagger_schemas.py`):
- `Usuario`
- `Anuncio`
- `Proposta`
- `Contratacao`
- `Avaliacao`
- `Mensagem`

---

## 📂 Endpoints que Ainda Precisam de Documentação

### ✅ **Já Documentados:**
- ✅ Auth (register, login, me, refresh, logout)
- ✅ Anúncios (list, create, get, update, delete)
- ✅ Profissionais (list)

### ⏳ **Pendentes de Documentação:**

#### **Users** (`routes_users.py`)
- [ ] `GET /api/users/me` - Obter perfil
- [ ] `PATCH /api/users/me` - Atualizar perfil
- [ ] `POST /api/users/me/onboarding` - Completar onboarding
- [ ] `POST /api/users/me/foto` - Upload de foto (multipart/form-data)

#### **Categorias** (`routes_categorias.py`)
- [ ] `GET /api/categorias` - Listar categorias
- [ ] Outros endpoints de categoria

#### **Propostas** (`routes_propostas.py`)
- [ ] Todos os endpoints de propostas

#### **Contratações** (`routes_contratacoes.py`)
- [ ] Todos os endpoints de contratações

#### **Avaliações** (`routes_avaliacoes.py`)
- [ ] Todos os endpoints de avaliações

#### **Chat** (`routes_chat.py`)
- [ ] Todos os endpoints de mensagens

---

## 🎨 Dicas e Boas Práticas

### 1. **Use Descrições Claras**
```python
description: "ID do usuário no formato UUID v4"  # ✅ BOM
description: "ID"  # ❌ Vago
```

### 2. **Forneça Exemplos**
```python
example: "São Paulo, SP"  # ✅
example: ""  # ❌
```

### 3. **Documente Todos os Códigos de Status**
```python
responses:
  200: # Sucesso
  400: # Validação
  401: # Não autenticado
  403: # Sem permissão
  404: # Não encontrado
  500: # Erro do servidor
```

### 4. **Use Enums para Valores Limitados**
```python
type: string
enum: [ativo, inativo, pendente]  # ✅
```

### 5. **Especifique Campos Obrigatórios**
```python
required:
  - nome
  - email
  - senha
```

### 6. **Para Upload de Arquivos**
```python
consumes:
  - multipart/form-data
parameters:
  - name: file
    in: formData
    type: file
    required: true
```

---

## 🔍 Testando a Documentação

### 1. **Verificar se o Swagger está carregando:**
```bash
# Inicie o servidor
python -m backend.wsgi

# Acesse no navegador:
http://localhost:5000/api/docs/
```

### 2. **Validar o JSON do OpenAPI:**
```bash
# Acesse:
http://localhost:5000/apispec.json
```

### 3. **Testar um Endpoint:**
1. Abra o Swagger UI
2. Faça login via `/api/auth/login`
3. Copie o `access_token`
4. Clique em "Authorize" e cole o token como: `Bearer {token}`
5. Teste um endpoint protegido

---

## 📖 Recursos Adicionais

- **Documentação Flasgger:** https://github.com/flasgger/flasgger
- **OpenAPI Specification:** https://swagger.io/specification/
- **Swagger Editor Online:** https://editor.swagger.io/

---

## 🆘 Troubleshooting

### Problema: Swagger UI não carrega
**Solução:** Verifique se o Flasgger está instalado:
```bash
pip install -r requirements.txt
```

### Problema: Endpoint não aparece na documentação
**Solução:** Verifique se a docstring está no formato YAML correto com `---` após a primeira linha.

### Problema: Schema não reconhecido
**Solução:** Verifique se o nome do schema em `$ref` está correto e definido em `swagger_schemas.py`.

### Problema: Token Bearer não funciona
**Solução:** Certifique-se de incluir "Bearer " (com espaço) antes do token.

---

## 📝 Próximos Passos

1. ✅ Instalar dependências: `pip install -r requirements.txt`
2. ✅ Iniciar o servidor: `python -m backend.wsgi`
3. ✅ Acessar Swagger UI: `http://localhost:5000/api/docs/`
4. ⏳ Documentar endpoints restantes usando os templates acima
5. ⏳ Testar todos os endpoints documentados
6. ⏳ Ajustar schemas conforme necessário

---

**Desenvolvido com ❤️ para Lance Fácil**

