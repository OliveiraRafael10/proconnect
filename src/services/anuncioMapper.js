// Mapper para transformar dados do backend no formato esperado pelo frontend

/**
 * Transforma um anúncio do backend no formato esperado pelo frontend
 * @param {Object} anuncio - Anúncio do backend
 * @returns {Object} - Anúncio no formato do frontend
 */
export function mapAnuncioToFrontend(anuncio) {
  if (!anuncio) return null;


  // Extrai dados relacionados
  // O Supabase retorna relacionamentos como objeto quando é 1:1 ou como array quando é 1:N
  // Para foreign keys, geralmente retorna como objeto
  let categoria = {};
  if (anuncio.categorias) {
    if (Array.isArray(anuncio.categorias)) {
      categoria = anuncio.categorias[0] || {};
    } else if (typeof anuncio.categorias === 'object') {
      categoria = anuncio.categorias;
    }
  }

  let usuario = {};
  // O Supabase pode retornar como 'usuarios' ou como 'usuario_id' dependendo da sintaxe
  const dadosUsuario = anuncio.usuarios || anuncio.usuario_id || {};
  if (dadosUsuario && typeof dadosUsuario === 'object') {
    if (Array.isArray(dadosUsuario)) {
      usuario = dadosUsuario[0] || {};
    } else {
      usuario = dadosUsuario;
    }
  }

  // Se não conseguiu extrair dados do usuário do relacionamento, usar valores padrão
  const clienteData = {
    id: anuncio.usuario_id,
    nome: usuario.nome || 'Usuário',
    foto_url: usuario.foto_url || null,
    verificado: usuario.email_verificado || false,
    avaliacao: 0, // TODO: calcular a partir de avaliações
    totalAvaliacoes: 0 // TODO: contar avaliações
  };

  // Se não conseguiu extrair dados do relacionamento, marcar para buscar depois
  if (!usuario.nome && anuncio.usuario_id) {
    // Adicionar flag para indicar que precisa buscar dados do usuário
    clienteData._precisaBuscar = true;
  }

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
    cliente: clienteData,
    requisitos: Array.isArray(anuncio.requisitos) ? anuncio.requisitos : [],
    imagens: Array.isArray(anuncio.imagens) && anuncio.imagens.length > 0 
      ? anuncio.imagens 
      : [], // Não usar placeholder externo - deixar vazio para o componente tratar
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

