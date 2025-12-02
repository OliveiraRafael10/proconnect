# Correção de Anúncios Direcionados

## Problema
Anúncios que deveriam ser direcionados a profissionais específicos foram criados como anúncios gerais (visíveis para todos).

## Solução Implementada

### 1. Migration do Banco de Dados
Execute a migration para adicionar o campo `profissional_direcionado_id`:

```sql
-- Execute o arquivo: backend/db/migration_add_profissional_direcionado.sql
```

Ou execute diretamente no Supabase SQL Editor:
```sql
ALTER TABLE anuncios 
ADD COLUMN IF NOT EXISTS profissional_direcionado_id UUID REFERENCES usuarios(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_anuncios_profissional_direcionado 
ON anuncios(profissional_direcionado_id) 
WHERE profissional_direcionado_id IS NOT NULL;
```

### 2. Corrigir Anúncios Existentes
Execute o script Python para corrigir os anúncios que foram criados incorretamente:

```bash
cd lance-facil
python backend/scripts/corrigir_anuncios_direcionados.py
```

O script irá:
- Buscar anúncios que contêm "Esta oportunidade foi direcionada ao profissional" na descrição
- Extrair o ID do profissional da descrição
- Atualizar o campo `profissional_direcionado_id` no banco de dados
- Remover a nota da descrição

### 3. Verificação
Após executar o script, verifique no Supabase:
```sql
SELECT id, titulo, profissional_direcionado_id 
FROM anuncios 
WHERE profissional_direcionado_id IS NOT NULL;
```

## Como Funciona Agora

### Criação de Anúncios Direcionados
Quando um cliente contrata um profissional através do modal "Contratar Profissional":
- O campo `profissional_direcionado_id` é preenchido com o ID do profissional
- O anúncio só será visível para:
  - O profissional direcionado
  - O criador do anúncio (cliente)

### Listagem de Anúncios
- **Usuários autenticados**: Veem anúncios gerais (NULL) + anúncios direcionados a eles
- **Usuários não autenticados**: Veem apenas anúncios gerais (NULL)

## Arquivos Modificados

1. **Backend:**
   - `backend/db/migration_add_profissional_direcionado.sql` - Migration SQL
   - `backend/routes_anuncios.py` - Lógica de criação e listagem
   - `backend/scripts/corrigir_anuncios_direcionados.py` - Script de correção

2. **Frontend:**
   - `src/components/ui/ContratarProfissionalModal.jsx` - Envio do campo `profissional_direcionado_id`


