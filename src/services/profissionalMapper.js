// Mapper para transformar dados de profissionais do backend no formato esperado pelo frontend

import { dbToUi } from './userMapper';

/**
 * Transforma um profissional do backend no formato esperado pelo frontend
 * @param {Object} profissional - Profissional do backend
 * @param {Object} avaliacoes - Dados de avaliações { media, total }
 * @param {Object} estatisticas - Dados de estatísticas { projetos_concluidos, total_contratacoes }
 * @returns {Object} - Profissional no formato do frontend
 */
export function mapProfissionalToFrontend(profissional, avaliacoes = null, estatisticas = null) {
  if (!profissional) return null;

  // Usa o mapper de usuário para transformar os dados básicos
  const profissionalMapeado = dbToUi(profissional);
  
  // Extrai perfil_worker do backend
  const perfilWorker = profissional.perfil_worker || {};
  
  // Calcula avaliação média e total
  const avaliacaoMedia = avaliacoes?.media || 0;
  const totalAvaliacoes = avaliacoes?.total || 0;
  
  // Estatísticas de projetos
  const projetosConcluidos = estatisticas?.projetos_concluidos || 0;

  // Normalizar portfólio: garantir que cada item tenha id, url e name
  const portfolioNormalizado = (perfilWorker.portfolio || []).map((item, index) => {
    if (typeof item === 'string') {
      // Se for apenas uma string (URL), converter para objeto
      return {
        id: `portfolio-${index}`,
        url: item,
        name: `Trabalho ${index + 1}`
      };
    }
    // Se já for objeto, garantir que tenha name
    return {
      id: item.id || `portfolio-${index}`,
      url: item.url || '',
      name: item.name || item.url?.split('/').pop() || `Trabalho ${index + 1}`
    };
  });

  return {
    ...profissionalMapeado,
    workerProfile: {
      ...perfilWorker,
      avaliacao: avaliacaoMedia,
      totalAvaliacoes: totalAvaliacoes,
      projetosConcluidos: projetosConcluidos,
      categorias: perfilWorker.categorias || [],
      descricao: perfilWorker.descricao || '',
      experiencia: perfilWorker.experiencia || '',
      disponibilidade: perfilWorker.disponibilidade || {},
      portfolio: portfolioNormalizado
    }
  };
}

/**
 * Transforma uma lista de profissionais do backend
 * @param {Array} profissionais - Lista de profissionais do backend
 * @param {Object} avaliacoesMap - Mapa de avaliações por usuário_id { [userId]: { media, total } }
 * @param {Object} estatisticasMap - Mapa de estatísticas por usuário_id { [userId]: { projetos_concluidos, total_contratacoes } }
 * @returns {Array} - Lista de profissionais no formato do frontend
 */
export function mapProfissionaisToFrontend(profissionais, avaliacoesMap = {}, estatisticasMap = {}) {
  if (!Array.isArray(profissionais)) return [];
  return profissionais
    .map(prof => {
      const userId = prof.id;
      const avaliacoes = avaliacoesMap[userId] || null;
      const estatisticas = estatisticasMap[userId] || null;
      return mapProfissionalToFrontend(prof, avaliacoes, estatisticas);
    })
    .filter(Boolean);
}

