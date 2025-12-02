-- Migration: Prevenir conversas duplicadas entre os mesmos dois usuários
-- Esta migration adiciona uma constraint única que garante que não haverá
-- conversas duplicadas entre os mesmos dois usuários, independente da ordem

BEGIN;

-- Criar uma função auxiliar para normalizar a ordem dos IDs (menor sempre primeiro)
-- Isso permite criar uma constraint única que funciona independente da ordem
CREATE OR REPLACE FUNCTION conversas_unique_pair(usuario_a UUID, usuario_b UUID)
RETURNS TEXT AS $$
BEGIN
  -- Retorna uma string ordenada com os dois IDs (menor primeiro)
  IF usuario_a < usuario_b THEN
    RETURN usuario_a::TEXT || '|' || usuario_b::TEXT;
  ELSE
    RETURN usuario_b::TEXT || '|' || usuario_a::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Adicionar uma coluna virtual (gerada) que representa o par único de usuários
-- Esta coluna será usada para criar a constraint única
ALTER TABLE conversas 
ADD COLUMN IF NOT EXISTS usuarios_pair TEXT 
GENERATED ALWAYS AS (conversas_unique_pair(usuario_a_id, usuario_b_id)) STORED;

-- Criar índice único na coluna gerada para prevenir duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversas_unique_pair 
ON conversas(usuarios_pair);

COMMIT;

-- Nota: Se já existirem conversas duplicadas no banco, será necessário
-- removê-las manualmente antes de executar esta migration, ou ajustar
-- a migration para lidar com duplicatas existentes.

