# 🚀 Backend Lance Fácil – API Flask + Supabase + Swagger

## 📚 Documentação Interativa da API (Swagger/OpenAPI)

### ✨ Acesse o Swagger UI

Após iniciar o servidor, a documentação interativa completa estará disponível em:

```
http://localhost:5000/api/docs/
```

**Recursos da Documentação:**
- ✅ Interface interativa para testar todos os endpoints
- ✅ Schemas completos de request/response
- ✅ Autenticação Bearer token integrada
- ✅ Exemplos práticos para cada endpoint
- ✅ Especificação OpenAPI JSON disponível em `/apispec.json`

### 🔐 Como Usar o Swagger UI

#### 1. Endpoints Públicos (sem autenticação)
- Clique no endpoint desejado (ex: `POST /api/auth/login`)
- Clique em **"Try it out"**
- Preencha os dados de exemplo
- Clique em **"Execute"**
- Visualize a resposta

#### 2. Endpoints Protegidos (requerem autenticação)
1. Faça login via `POST /api/auth/login`
2. Copie o `access_token` da resposta
3. Clique no botão **"🔒 Authorize"** no topo da página
4. Digite: `Bearer {seu_token_aqui}` (importante: com o espaço após "Bearer")
5. Clique em **"Authorize"**
6. Agora você pode testar todos os endpoints protegidos! 🎉

---

## 📖 Resumo
- API em Flask pronta para PythonAnywhere com rotas de autenticação integradas ao Supabase Auth e à tabela `usuarios` do seu schema simplificado.
- Estrutura mínima: `auth/register`, `auth/login`, `auth/me`, e rotas `users/me` (GET/PATCH).
- **NOVO:** Documentação completa com Swagger/OpenAPI usando Flasgger.

Requisitos
- Python 3.10+
- Variáveis de ambiente:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY (opcional; preferimos SERVICE_ROLE para server-side)
  - SUPABASE_SERVICE_ROLE_KEY
  - SUPABASE_JWT_SECRET
  - CORS_ORIGINS (opcional, padrão: *)

## 🛠️ Instalação local
1. Crie e ative um virtualenv:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. Instale dependências (incluindo Flasgger para Swagger):
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Configure `.env` (baseie-se em `backend/.env.example`).

4. Execute o servidor:
   ```bash
   flask --app backend.app:app run --debug
   # OU
   python -m backend.wsgi
   ```

5. Acesse:
   - **API:** `http://localhost:5000/api/`
   - **Swagger UI:** `http://localhost:5000/api/docs/` 📚
   - **Health Check:** `http://localhost:5000/api/health`

Deploy no PythonAnywhere (WSGI)
- Use `backend/wsgi.py` como entrypoint (aponta para `backend.app:app`).
- Defina as variáveis de ambiente no painel do PythonAnywhere.

Notas sobre Supabase
 - Registro (`/api/auth/register`) cria usuário no Supabase Auth (via Service Role) e em seguida insere o perfil em `usuarios` com o mesmo UUID.
 - Login (`/api/auth/login`) autentica no Supabase Auth e retorna os tokens + perfil.
 - `GET /api/auth/me`/`GET /api/users/me` exige `Authorization: Bearer <access_token>` do Supabase; o backend valida o JWT usando `SUPABASE_JWT_SECRET` e recupera o perfil.

Endpoints adicionais
- Categorias
  - `GET /api/categorias` – lista categorias.
- Anúncios
  - `GET /api/anuncios?tipo=&categoria_id=&busca=&urgencia=&status=&order=&page=&page_size=`
  - `POST /api/anuncios` – cria (auth).
  - `GET /api/anuncios/:id` – detalhe.
  - `PATCH /api/anuncios/:id` – atualiza (dono).
  - `DELETE /api/anuncios/:id` – exclui (dono).
- Propostas
  - `POST /api/propostas` – cria (worker) com `anuncio_id`.
  - `GET /api/propostas?anuncio_id=` – se informado, requer ser dono do anúncio; senão, lista do usuário autenticado.
  - `PATCH /api/propostas/:id` – atualiza (worker).
- Contratações
  - `POST /api/contratacoes` – cria (dono do anúncio) a partir de `anuncio_id` e opcional `proposta_id`.
  - `GET /api/contratacoes/minhas` – listagem para contratado e/ou anunciante.
  - `PATCH /api/contratacoes/:id` – atualizar status/valor (partes).
- Avaliações
  - `POST /api/avaliacoes` – cria (partes da contratação).
  - `GET /api/avaliacoes?contratacao_id=` – lista por contratação.
  - `GET /api/avaliacoes/por-contratado/:usuario_id` – lista e média agregada.
- Conversas e Mensagens
  - `GET /api/conversas` – lista conversas do usuário.
  - `POST /api/conversas` – cria conversa com `usuario_b_id` (opcional contexto do anúncio).
  - `GET /api/conversas/:id` – detalhe (participante).
  - `GET /api/conversas/:id/mensagens` – lista mensagens (participante).
  - `POST /api/conversas/:id/mensagens` – envia mensagem (participante).
  - `PATCH /api/mensagens/:id` – marcar lida.

## 📝 Documentando Novos Endpoints

Para adicionar documentação Swagger a novos endpoints:

1. Consulte o arquivo **`backend/SWAGGER_GUIDE.md`** para templates e exemplos completos
2. Adicione docstrings YAML aos seus endpoints seguindo os exemplos em:
   - `routes_auth.py` (autenticação)
   - `routes_anuncios.py` (CRUD completo)
   - `routes_profissionais.py` (listagem com filtros)
3. Use schemas reutilizáveis definidos em `swagger_definitions.py`
4. Teste a documentação acessando `/api/docs/`

### Endpoints Já Documentados ✅
- **Auth:** register, login, me, refresh, logout
- **Anúncios:** listar, criar, obter, atualizar, excluir
- **Profissionais:** listar com filtros

### Endpoints Pendentes de Documentação ⏳
- Users (perfil, onboarding, upload de foto)
- Categorias
- Propostas
- Contratações
- Avaliações
- Chat/Mensagens

**Consulte `backend/SWAGGER_GUIDE.md` para instruções detalhadas!**

---

## Observações
- Filtros de busca em anúncios usam uma estratégia simples com duas consultas (título e descrição) e mescla no backend (MVP).
- Autorização é checada no backend (mesmo usando a Service Role) para respeitar as regras de negócio.
- A documentação Swagger é gerada automaticamente a partir das docstrings YAML nos endpoints.
- Schemas de dados estão centralizados em `swagger_definitions.py` para reutilização.
