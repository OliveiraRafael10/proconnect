-- Schema simplificado para Supabase (PostgreSQL)
-- MVP: menos tabelas, JSONB onde faz sentido e RLS básico

BEGIN;

-- Extensões úteis (Supabase suporta)
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;

-- Tipos enumerados essenciais
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_anuncio') THEN
    CREATE TYPE tipo_anuncio AS ENUM ('oferta', 'oportunidade');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_anuncio') THEN
    CREATE TYPE status_anuncio AS ENUM ('disponivel', 'fechado', 'cancelado');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'urgencia_nivel') THEN
    CREATE TYPE urgencia_nivel AS ENUM ('normal', 'alta');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_proposta') THEN
    CREATE TYPE status_proposta AS ENUM ('enviada', 'aceita', 'recusada', 'retirada');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_contratacao') THEN
    CREATE TYPE status_contratacao AS ENUM ('solicitado', 'em_andamento', 'concluido', 'cancelado');
  END IF;
END $$;

-- Usuários (perfil) – vinculado ao Supabase Auth
-- id referencia auth.users(id); insira com o mesmo UUID do usuário autenticado
CREATE TABLE IF NOT EXISTS usuarios (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome                TEXT NOT NULL,
  email               CITEXT,                  -- opcional (já existe em auth.users)
  cpf                 TEXT UNIQUE,
  apelido             TEXT,
  foto_url            TEXT,
  -- telefone
  telefone_ddd        VARCHAR(2),
  telefone_numero     VARCHAR(20),
  -- endereço
  endereco_cep        VARCHAR(9),
  endereco_logradouro TEXT,
  endereco_numero     TEXT,
  endereco_bairro     TEXT,
  endereco_cidade     TEXT,
  endereco_estado     VARCHAR(2),
  endereco_complemento TEXT,
  -- flags e dados agregados
  is_worker           BOOLEAN NOT NULL DEFAULT FALSE,
  email_verificado    BOOLEAN NOT NULL DEFAULT FALSE,
  -- Perfil de worker consolidado em JSONB (categorias, descricao, experiencia, disponibilidade, certificacoes, portfolio, precos, raio, notas)
  perfil_worker       JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Preferências/configurações diversas (notificações, privacidade, etc.)
  preferencias        JSONB NOT NULL DEFAULT '{}'::jsonb,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_nome ON usuarios USING GIN (to_tsvector('portuguese', coalesce(nome,'')));

-- Categorias
CREATE TABLE IF NOT EXISTS categorias (
  id        BIGSERIAL PRIMARY KEY,
  slug      TEXT NOT NULL UNIQUE, -- ex: 'limpeza', 'reparos'
  nome      TEXT NOT NULL,
  descricao TEXT,
  icone     TEXT
);

-- Anúncios: unifica ofertas de profissionais e oportunidades de clientes
CREATE TABLE IF NOT EXISTS anuncios (
  id              BIGSERIAL PRIMARY KEY,
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo            tipo_anuncio NOT NULL, -- 'oferta' | 'oportunidade'
  categoria_id    BIGINT NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  titulo          TEXT NOT NULL,
  descricao       TEXT NOT NULL,
  localizacao     TEXT,
  preco_min       NUMERIC(12,2),
  preco_max       NUMERIC(12,2),
  urgencia        urgencia_nivel, -- somente para 'oportunidade'
  prazo           DATE,           -- somente para 'oportunidade'
  status          status_anuncio NOT NULL DEFAULT 'disponivel',
  imagens         JSONB NOT NULL DEFAULT '[]'::jsonb,
  requisitos      JSONB NOT NULL DEFAULT '[]'::jsonb,
  publicado_em    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anuncios_categoria ON anuncios(categoria_id);
CREATE INDEX IF NOT EXISTS idx_anuncios_usuario ON anuncios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_anuncios_tipo ON anuncios(tipo);
CREATE INDEX IF NOT EXISTS idx_anuncios_status ON anuncios(status);

-- Propostas/Lances para um anúncio (oportunidade)
CREATE TABLE IF NOT EXISTS propostas (
  id                 BIGSERIAL PRIMARY KEY,
  anuncio_id         BIGINT NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
  usuario_id_worker  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  valor_proposto     NUMERIC(12,2),
  mensagem           TEXT,
  status             status_proposta NOT NULL DEFAULT 'enviada',
  criada_em          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (anuncio_id, usuario_id_worker)
);

CREATE INDEX IF NOT EXISTS idx_propostas_anuncio ON propostas(anuncio_id);
CREATE INDEX IF NOT EXISTS idx_propostas_worker ON propostas(usuario_id_worker);

-- Contratações decorrentes de um anúncio (geralmente a partir de uma proposta)
CREATE TABLE IF NOT EXISTS contratacoes (
  id                    BIGSERIAL PRIMARY KEY,
  anuncio_id            BIGINT NOT NULL REFERENCES anuncios(id) ON DELETE RESTRICT,
  proposta_id           BIGINT REFERENCES propostas(id) ON DELETE SET NULL,
  usuario_id_contratado UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  valor_acordado        NUMERIC(12,2),
  status                status_contratacao NOT NULL DEFAULT 'solicitado',
  data_contratacao      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contratacoes_anuncio ON contratacoes(anuncio_id);
CREATE INDEX IF NOT EXISTS idx_contratacoes_worker ON contratacoes(usuario_id_contratado);

-- Avaliações pós-serviço
CREATE TABLE IF NOT EXISTS avaliacoes (
  id             BIGSERIAL PRIMARY KEY,
  contratacao_id BIGINT NOT NULL REFERENCES contratacoes(id) ON DELETE CASCADE,
  avaliador_id   UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nota           SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario     TEXT,
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_contratacao ON avaliacoes(contratacao_id);

-- Conversas 1-para-1 (simples)
CREATE TABLE IF NOT EXISTS conversas (
  id            BIGSERIAL PRIMARY KEY,
  usuario_a_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  usuario_b_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  contexto_tipo TEXT,          -- opcional: 'anuncio'
  contexto_id   BIGINT,        -- id do anúncio se aplicável
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT conversas_participantes_diferentes CHECK (usuario_a_id <> usuario_b_id)
);

CREATE INDEX IF NOT EXISTS idx_conversas_usuarios ON conversas(usuario_a_id, usuario_b_id);

-- Mensagens
CREATE TABLE IF NOT EXISTS mensagens (
  id            BIGSERIAL PRIMARY KEY,
  conversa_id   BIGINT NOT NULL REFERENCES conversas(id) ON DELETE CASCADE,
  remetente_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  conteudo      TEXT NOT NULL,
  lida          BOOLEAN NOT NULL DEFAULT FALSE,
  enviada_em    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mensagens_conversa ON mensagens(conversa_id, enviada_em);
CREATE INDEX IF NOT EXISTS idx_mensagens_remetente ON mensagens(remetente_id);

COMMIT;

-- =========================
-- Supabase RLS (políticas)
-- =========================

-- Ativar RLS
ALTER TABLE usuarios      ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias    ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncios      ENABLE ROW LEVEL SECURITY;
ALTER TABLE propostas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratacoes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens     ENABLE ROW LEVEL SECURITY;

-- Politicas basicas
-- usuarios: o próprio usuário pode ver/alterar seu perfil
CREATE POLICY usuarios_select_self ON usuarios
  FOR SELECT USING (id = auth.uid());
CREATE POLICY usuarios_update_self ON usuarios
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY usuarios_insert_self ON usuarios
  FOR INSERT WITH CHECK (id = auth.uid());

-- categorias: leitura pública
CREATE POLICY categorias_public_select ON categorias
  FOR SELECT USING (true);
-- (inserção/alteração podem ser restritas a um papel admin conforme necessidade)

-- anuncios: leitura pública; CRUD do dono
CREATE POLICY anuncios_public_select ON anuncios
  FOR SELECT USING (true);
CREATE POLICY anuncios_insert_owner ON anuncios
  FOR INSERT WITH CHECK (usuario_id = auth.uid());
CREATE POLICY anuncios_update_owner ON anuncios
  FOR UPDATE USING (usuario_id = auth.uid()) WITH CHECK (usuario_id = auth.uid());
CREATE POLICY anuncios_delete_owner ON anuncios
  FOR DELETE USING (usuario_id = auth.uid());

-- propostas: o worker pode gerenciar as suas; o dono do anúncio pode ler
CREATE POLICY propostas_select_owner_or_anunciante ON propostas
  FOR SELECT USING (
    usuario_id_worker = auth.uid()
    OR EXISTS (
      SELECT 1 FROM anuncios a WHERE a.id = propostas.anuncio_id AND a.usuario_id = auth.uid()
    )
  );
CREATE POLICY propostas_insert_self ON propostas
  FOR INSERT WITH CHECK (usuario_id_worker = auth.uid());
CREATE POLICY propostas_update_self ON propostas
  FOR UPDATE USING (usuario_id_worker = auth.uid()) WITH CHECK (usuario_id_worker = auth.uid());
CREATE POLICY propostas_delete_self ON propostas
  FOR DELETE USING (usuario_id_worker = auth.uid());

-- contratacoes: visível para contratado ou anunciante
CREATE POLICY contratacoes_select_partes ON contratacoes
  FOR SELECT USING (
    usuario_id_contratado = auth.uid()
    OR EXISTS (
      SELECT 1 FROM anuncios a WHERE a.id = contratacoes.anuncio_id AND a.usuario_id = auth.uid()
    )
  );

-- avaliacoes: partes podem ver; avaliador pode inserir
CREATE POLICY avaliacoes_select_partes ON avaliacoes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contratacoes c
      JOIN anuncios a ON a.id = c.anuncio_id
      WHERE c.id = avaliacoes.contratacao_id
        AND (c.usuario_id_contratado = auth.uid() OR a.usuario_id = auth.uid())
    )
  );
CREATE POLICY avaliacoes_insert_self ON avaliacoes
  FOR INSERT WITH CHECK (avaliador_id = auth.uid());

-- conversas: somente participantes
CREATE POLICY conversas_participantes_select ON conversas
  FOR SELECT USING (auth.uid() IN (usuario_a_id, usuario_b_id));
CREATE POLICY conversas_participantes_crud ON conversas
  FOR ALL USING (auth.uid() IN (usuario_a_id, usuario_b_id))
  WITH CHECK (auth.uid() IN (usuario_a_id, usuario_b_id));

-- mensagens: somente participantes; remetente é o auth.uid() na inserção
CREATE POLICY mensagens_participantes_select ON mensagens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversas c WHERE c.id = mensagens.conversa_id
      AND auth.uid() IN (c.usuario_a_id, c.usuario_b_id)
    )
  );
CREATE POLICY mensagens_participantes_insert ON mensagens
  FOR INSERT WITH CHECK (
    remetente_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversas c WHERE c.id = mensagens.conversa_id
      AND auth.uid() IN (c.usuario_a_id, c.usuario_b_id)
    )
  );

