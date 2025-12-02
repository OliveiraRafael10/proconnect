# 🚀 Quick Start - Swagger API Lance Fácil

## ⚡ Início Rápido (3 passos)

### 1️⃣ Instalar Dependências
```bash
pip install -r backend/requirements.txt
```

### 2️⃣ Iniciar Servidor
```bash
# No diretório raiz do projeto:
python -m backend.wsgi

# OU se preferir:
flask --app backend.app:app run --debug
```

### 3️⃣ Abrir Swagger UI
Acesse no navegador:
```
http://localhost:5000/api/docs/
```

---

## 🎯 Testando a API (2 minutos)

### Teste 1: Endpoint Público (Register)
1. No Swagger UI, vá para `POST /api/auth/register`
2. Clique em **"Try it out"**
3. Use este JSON de exemplo:
```json
{
  "nome": "Teste Swagger",
  "email": "teste@swagger.com",
  "password": "senha123",
  "is_worker": false
}
```
4. Clique em **"Execute"**
5. ✅ Você deve ver uma resposta 201 com os dados do usuário criado

### Teste 2: Login e Autenticação
1. Vá para `POST /api/auth/login`
2. Clique em **"Try it out"**
3. Use:
```json
{
  "email": "teste@swagger.com",
  "password": "senha123"
}
```
4. Clique em **"Execute"**
5. Copie o `access_token` da resposta

### Teste 3: Endpoint Protegido
1. Clique no botão **"🔒 Authorize"** no topo da página
2. Digite: `Bearer SEU_TOKEN_AQUI` (cole o token copiado)
3. Clique em **"Authorize"**
4. Vá para `GET /api/auth/me`
5. Clique em **"Try it out"** e depois **"Execute"**
6. ✅ Você deve ver seus dados de perfil!

---

## 📱 Testando Outros Endpoints

### Criar um Anúncio
1. Certifique-se de estar autenticado (passo anterior)
2. Vá para `POST /api/anuncios`
3. Use este exemplo:
```json
{
  "tipo": "oferta",
  "categoria_id": 1,
  "titulo": "Instalação Elétrica Profissional",
  "descricao": "Eletricista com 10 anos de experiência",
  "localizacao": "São Paulo, SP",
  "preco_min": 150,
  "preco_max": 300,
  "urgencia": "normal"
}
```
4. Execute e copie o `id` do anúncio criado

### Listar Anúncios
1. Vá para `GET /api/anuncios`
2. Teste os filtros:
   - `tipo`: oferta
   - `status`: disponivel
   - `order`: recentes
3. Execute

### Buscar Profissionais
1. Vá para `GET /api/profissionais`
2. Teste busca por:
   - `busca`: eletricista
   - `localizacao`: São Paulo
3. Execute

---

## 🎨 Explorando a Interface

### Recursos Disponíveis:
- 📚 **Navegação por Tags** - Endpoints organizados por categoria
- 🔍 **Schemas** - Clique em "Schema" para ver a estrutura completa
- 📝 **Modelos** - Role até o final para ver todos os modelos de dados
- 💾 **Download** - Baixe a especificação OpenAPI em JSON
- 🌐 **Servers** - Configure diferentes ambientes (dev, staging, prod)

---

## 🔗 Links Úteis

- **Swagger UI:** http://localhost:5000/api/docs/
- **Spec JSON:** http://localhost:5000/apispec.json
- **Health Check:** http://localhost:5000/api/health
- **Guia Completo:** `backend/SWAGGER_GUIDE.md`
- **Implementação:** `backend/SWAGGER_IMPLEMENTATION.md`

---

## 💡 Dicas Rápidas

### Copiar Exemplo
Clique no exemplo no schema para copiar automaticamente

### Limpar Autorização
Se precisar trocar de usuário:
1. Clique em "🔒 Authorize"
2. Clique em "Logout"
3. Faça login com outro usuário

### Ver Código de Resposta
Cada cor indica um tipo de resposta:
- 🟢 Verde (200-299): Sucesso
- 🟡 Amarelo (300-399): Redirecionamento
- 🔴 Vermelho (400-499): Erro do cliente
- ⚫ Preto (500-599): Erro do servidor

### Testar Diferentes Cenários
- Tente enviar dados inválidos para ver erros 400
- Tente acessar recursos sem token para ver erro 401
- Tente atualizar/deletar recursos de outros usuários para ver erro 403

---

## 🐛 Problemas Comuns

### "Failed to fetch"
**Solução:** Verifique se o servidor está rodando em `localhost:5000`

### "401 Unauthorized"
**Solução:** 
1. Faça login novamente
2. Copie o novo token
3. Atualize a autorização

### "TypeError: 'bool' object is not iterable"
**Solução:** Isso pode indicar um erro no código do endpoint, não no Swagger

### Swagger UI está em branco
**Solução:**
```bash
pip uninstall flasgger
pip install flasgger
```

---

## 🎓 Próximos Passos

1. ✅ Teste todos os endpoints documentados
2. 📖 Leia o `SWAGGER_GUIDE.md` para aprender a documentar
3. 🔨 Documente os endpoints pendentes
4. 🚀 Compartilhe a documentação com o time!

---

## 📞 Suporte

Dúvidas sobre:
- **Como usar Swagger:** `SWAGGER_GUIDE.md`
- **O que foi implementado:** `SWAGGER_IMPLEMENTATION.md`
- **Configuração geral:** `README.md`

---

**Happy Testing! 🎉**

