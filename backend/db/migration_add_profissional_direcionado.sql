-- Migration: Adicionar campo profissional_direcionado_id na tabela anuncios
-- Este campo permite direcionar anúncios (oportunidades) para profissionais específicos

-- Adicionar coluna profissional_direcionado_id (opcional, pode ser NULL para anúncios gerais)
ALTER TABLE anuncios 
ADD COLUMN IF NOT EXISTS profissional_direcionado_id UUID REFERENCES usuarios(id) ON DELETE SET NULL;

-- Criar índice para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_anuncios_profissional_direcionado 
ON anuncios(profissional_direcionado_id) 
WHERE profissional_direcionado_id IS NOT NULL;

-- Comentário na coluna para documentação
COMMENT ON COLUMN anuncios.profissional_direcionado_id IS 
'ID do profissional para o qual este anúncio foi direcionado. NULL significa anúncio geral (visível para todos).';


