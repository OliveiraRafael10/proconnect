// Mapper para transformar dados do backend no formato esperado pelo frontend

/**
 * Transforma um anúncio do backend no formato esperado pelo frontend
 * @param {Object} anuncio - Anúncio do backend
 * @returns {Object} - Anúncio no formato do frontend
 */
export function mapAnuncioToFrontend(anuncio) {
  if (!anuncio) return null;

  // Extrai dados relacionados
  const categoria = anuncio.categorias || {};
  const usuario = anuncio.usuarios || {};

  return {
    id: anuncio.id,
    titulo: anuncio.titulo || '',
    descricao: anuncio.descricao || '',
    categoria: categoria.nome || 'Sem categoria',
    categoria_id: anuncio.categoria_id,
    localizacao: anuncio.localizacao || 'Localização não informada',
    dataPublicacao: anuncio.publicado_em || new Date().toISOString(),
    prazo: anuncio.prazo || null,
    urgencia: anuncio.urgencia || 'normal',
    tipo: anuncio.tipo || 'oportunidade',
    cliente: {
      id: anuncio.usuario_id,
      nome: usuario.nome || 'Usuário',
      foto_url: usuario.foto_url || null,
      verificado: usuario.email_verificado || false,
      avaliacao: 0, // TODO: calcular a partir de avaliações
      totalAvaliacoes: 0 // TODO: contar avaliações
    },
    requisitos: Array.isArray(anuncio.requisitos) ? anuncio.requisitos : [],
    imagens: Array.isArray(anuncio.imagens) && anuncio.imagens.length > 0 
      ? anuncio.imagens 
      : ['https://via.placeholder.com/800x600?text=Sem+Imagem'],
    status: anuncio.status || 'disponivel',
    preco_min: anuncio.preco_min || null,
    preco_max: anuncio.preco_max || null,
    visualizacoes: 0, // TODO: implementar contador de visualizações
    propostas: 0 // TODO: contar propostas relacionadas
  };
}

/**
 * Transforma uma lista de anúncios do backend
 * @param {Array} anuncios - Lista de anúncios do backend
 * @returns {Array} - Lista de anúncios no formato do frontend
 */
export function mapAnunciosToFrontend(anuncios) {
  if (!Array.isArray(anuncios)) return [];
  return anuncios.map(mapAnuncioToFrontend).filter(Boolean);
}

