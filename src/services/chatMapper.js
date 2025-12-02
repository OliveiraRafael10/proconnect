// Mapper para transformar dados de conversas e mensagens do backend no formato esperado pelo frontend

/**
 * Transforma uma mensagem do backend no formato do frontend
 * @param {Object} mensagem - Mensagem do backend
 * @param {string} currentUserId - ID do usuário atual
 * @returns {Object} - Mensagem no formato do frontend
 */
export function mapMensagemToFrontend(mensagem, currentUserId) {
  if (!mensagem) return null;

  const isEnviada = mensagem.remetente_id === currentUserId;
  
  return {
    id: mensagem.id,
    texto: mensagem.conteudo || '',
    tipo: isEnviada ? 'enviada' : 'recebida',
    dataHora: mensagem.enviada_em ? new Date(mensagem.enviada_em).toLocaleString('pt-BR') : '',
    lida: mensagem.lida || false,
    enviada_em: mensagem.enviada_em
  };
}

/**
 * Transforma uma lista de mensagens do backend
 * @param {Array} mensagens - Lista de mensagens do backend
 * @param {string} currentUserId - ID do usuário atual
 * @returns {Array} - Lista de mensagens no formato do frontend
 */
export function mapMensagensToFrontend(mensagens, currentUserId) {
  if (!Array.isArray(mensagens)) return [];
  return mensagens
    .map(msg => mapMensagemToFrontend(msg, currentUserId))
    .filter(Boolean);
}

/**
 * Transforma uma conversa do backend no formato do frontend
 * @param {Object} conversa - Conversa do backend
 * @param {Object} outroUsuario - Dados do outro usuário da conversa
 * @param {Array} mensagens - Mensagens da conversa (já mapeadas)
 * @param {string} currentUserId - ID do usuário atual
 * @returns {Object} - Conversa no formato do frontend
 */
export function mapConversaToFrontend(conversa, outroUsuario, mensagens = [], currentUserId) {
  if (!conversa) return null;

  // Determinar qual é o outro usuário (não o atual)
  const outroId = conversa.usuario_a_id === currentUserId 
    ? conversa.usuario_b_id 
    : conversa.usuario_a_id;

  return {
    id: conversa.id,
    nome: outroUsuario?.nome || 'Usuário',
    empresa: outroUsuario?.apelido || '',
    avatar: outroUsuario?.foto_url || '',
    mensagens: mensagens || [],
    usuario_id: outroId,
    criado_em: conversa.criado_em
  };
}

/**
 * Transforma uma lista de conversas do backend
 * @param {Array} conversas - Lista de conversas do backend
 * @param {Object} usuariosMap - Mapa de usuários por ID { [userId]: { nome, foto_url, ... } }
 * @param {Object} mensagensMap - Mapa de mensagens por conversa_id { [conversaId]: [...] }
 * @param {string} currentUserId - ID do usuário atual
 * @returns {Array} - Lista de conversas no formato do frontend
 */
export function mapConversasToFrontend(conversas, usuariosMap = {}, mensagensMap = {}, currentUserId) {
  if (!Array.isArray(conversas)) return [];
  
  return conversas
    .map(conv => {
      const outroId = conv.usuario_a_id === currentUserId 
        ? conv.usuario_b_id 
        : conv.usuario_a_id;
      
      const outroUsuario = usuariosMap[outroId] || {};
      const mensagens = mapMensagensToFrontend(mensagensMap[conv.id] || [], currentUserId);
      
      return mapConversaToFrontend(conv, outroUsuario, mensagens, currentUserId);
    })
    .filter(Boolean);
}

