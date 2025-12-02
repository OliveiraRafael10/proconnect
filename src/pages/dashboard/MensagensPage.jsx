import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  FiSearch, 
  FiPaperclip, 
  FiSmile, 
  FiSend,
  FiMessageCircle,
  FiUser
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { 
  listConversasApi, 
  criarConversaApi, 
  listMensagensApi, 
  enviarMensagemApi,
  atualizarMensagemApi,
  getUserByIdApi
} from "../../services/apiClient";
import { mapConversasToFrontend, mapMensagensToFrontend } from "../../services/chatMapper";
import ConversaModal from "../../components/ui/ConversaModal";
import perfilSemFoto from "../../assets/perfil_sem_foto.png";

export default function MensagensPage() {
  const { usuario } = useAuth();
  const { error, success } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profissionalId = searchParams.get('profissional');
  
  const [conversas, setConversas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [novaMsg, setNovaMsg] = useState("");
  const [showConversaModal, setShowConversaModal] = useState(false);
  const [selectedConversa, setSelectedConversa] = useState(null);
  const [buscaConversa, setBuscaConversa] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const mensagensRef = useRef(null);

  // Carregar conversas do backend
  useEffect(() => {
    const carregarConversas = async () => {
      if (!usuario?.id) return;
      
      setLoading(true);
      try {
        // Buscar conversas
        const conversasResponse = await listConversasApi();
        const conversasBackend = conversasResponse.items || [];

        // Buscar dados dos outros usuários e mensagens
        const usuariosMap = {};
        const mensagensMap = {};
        
        // Buscar mensagens e dados dos usuários para cada conversa
        await Promise.all(
          conversasBackend.map(async (conv) => {
            const outroId = conv.usuario_a_id === usuario.id 
              ? conv.usuario_b_id 
              : conv.usuario_a_id;
            
            // Buscar mensagens da conversa
            try {
              const mensagensResponse = await listMensagensApi(conv.id);
              mensagensMap[conv.id] = mensagensResponse.items || [];
            } catch (err) {
              console.warn(`Erro ao buscar mensagens da conversa ${conv.id}:`, err);
              mensagensMap[conv.id] = [];
            }
            
            // Buscar dados do outro usuário (se ainda não tiver)
            if (!usuariosMap[outroId]) {
              try {
                const dadosUsuario = await getUserByIdApi(outroId);
                if (dadosUsuario) {
                  usuariosMap[outroId] = {
                    id: dadosUsuario.id,
                    nome: dadosUsuario.nome || 'Usuário',
                    foto_url: dadosUsuario.foto_url || perfilSemFoto,
                    apelido: dadosUsuario.apelido || ''
                  };
                } else {
                  usuariosMap[outroId] = { 
                    id: outroId,
                    nome: 'Usuário',
                    foto_url: perfilSemFoto,
                    apelido: ''
                  };
                }
              } catch (err) {
                console.warn(`Erro ao buscar dados do usuário ${outroId}:`, err);
                usuariosMap[outroId] = { 
                  id: outroId,
                  nome: 'Usuário',
                  foto_url: perfilSemFoto,
                  apelido: ''
                };
              }
            }
          })
        );

        // Mapear conversas para o formato do frontend
        const conversasMapeadas = mapConversasToFrontend(
          conversasBackend, 
          usuariosMap, 
          mensagensMap, 
          usuario.id
        );

        setConversas(conversasMapeadas);

        // Se houver profissionalId na URL, criar/buscar conversa
        if (profissionalId && profissionalId !== usuario.id) {
          // Aguardar um pouco para garantir que as conversas foram setadas
          await new Promise(resolve => setTimeout(resolve, 100));
          await abrirConversaComProfissional(profissionalId, conversasMapeadas);
        } else if (conversasMapeadas.length > 0) {
          setSelecionada(conversasMapeadas[0]);
        }
      } catch (err) {
        console.error("Erro ao carregar conversas:", err);
        error("Erro ao carregar conversas. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    carregarConversas();
  }, [usuario?.id, profissionalId, error]);

  // Função para abrir/criar conversa com profissional
  const abrirConversaComProfissional = async (profId, conversasExistentes = null) => {
    try {
      // Verificar se já existe conversa com este profissional
      const conversasAtuais = conversasExistentes || conversas;
      const conversaExistente = conversasAtuais.find(
        conv => conv.usuario_id === profId
      );

      if (conversaExistente) {
        // Carregar mensagens se necessário
        if (!conversaExistente.mensagens || conversaExistente.mensagens.length === 0) {
          try {
            const mensagensResponse = await listMensagensApi(conversaExistente.id);
            const mensagens = mapMensagensToFrontend(mensagensResponse.items || [], usuario.id);
            conversaExistente.mensagens = mensagens;
          } catch (err) {
            console.warn(`Erro ao carregar mensagens da conversa existente:`, err);
          }
        }

        // Selecionar conversa existente
        if (window.innerWidth < 1024) {
          setSelectedConversa(conversaExistente);
          setShowConversaModal(true);
        } else {
          setSelecionada(conversaExistente);
        }
        // Remover parâmetro da URL
        navigate('/dashboard/mensagens', { replace: true });
        return;
      }

      // Buscar dados do profissional primeiro
      let dadosProfissional = null;
      try {
        dadosProfissional = await getUserByIdApi(profId);
      } catch (err) {
        console.warn(`Erro ao buscar dados do profissional ${profId}:`, err);
      }

      // Criar nova conversa
      const novaConversa = await criarConversaApi(profId);
      
      // Buscar mensagens da nova conversa
      const mensagensResponse = await listMensagensApi(novaConversa.id);
      const mensagens = mapMensagensToFrontend(mensagensResponse.items || [], usuario.id);
      
      // Mapear conversa com dados do profissional
      const conversaMapeada = {
        id: novaConversa.id,
        nome: dadosProfissional?.nome || 'Profissional',
        empresa: dadosProfissional?.apelido || '',
        avatar: dadosProfissional?.foto_url || perfilSemFoto,
        mensagens: mensagens,
        usuario_id: profId
      };

      // Adicionar à lista e selecionar
      const novasConversas = [...conversasAtuais, conversaMapeada];
      setConversas(novasConversas);
      
      if (window.innerWidth < 1024) {
        setSelectedConversa(conversaMapeada);
        setShowConversaModal(true);
      } else {
        setSelecionada(conversaMapeada);
      }

      // Remover parâmetro da URL
      navigate('/dashboard/mensagens', { replace: true });
      success("Conversa iniciada com sucesso!");
    } catch (err) {
      console.error("Erro ao criar conversa:", err);
      error("Erro ao iniciar conversa. Tente novamente.");
    }
  };

>>>>>>> back-branch-nova
  // Filtrar conversas pela busca
  const conversasFiltradas = conversas.filter(conversa =>
    conversa.nome.toLowerCase().includes(buscaConversa.toLowerCase()) ||
    conversa.empresa.toLowerCase().includes(buscaConversa.toLowerCase())
  );

  useEffect(() => {
    if (mensagensRef.current && selecionada?.mensagens) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [selecionada?.mensagens]);

  const handleEnviarMensagem = async () => {
    if (!novaMsg.trim() || !selecionada || enviando) return;

    setEnviando(true);
    try {
      // Enviar mensagem via API
      const mensagemEnviada = await enviarMensagemApi(selecionada.id, novaMsg.trim());
      
      // Mapear mensagem para o formato do frontend
      const mensagemMapeada = mapMensagensToFrontend([mensagemEnviada], usuario.id)[0];
      
      // Atualizar conversa selecionada
      setSelecionada(prev => ({
        ...prev,
        mensagens: [...(prev.mensagens || []), mensagemMapeada]
      }));

      // Atualizar na lista de conversas
      setConversas(prev => prev.map(conv => 
        conv.id === selecionada.id 
          ? { ...conv, mensagens: [...(conv.mensagens || []), mensagemMapeada] }
          : conv
      ));

      setNovaMsg("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const handleConversaClick = async (conversa) => {
    // Carregar mensagens se necessário
    if (!conversa.mensagens || conversa.mensagens.length === 0) {
      try {
        const mensagensResponse = await listMensagensApi(conversa.id);
        const mensagens = mapMensagensToFrontend(mensagensResponse.items || [], usuario.id);
        conversa.mensagens = mensagens;
      } catch (err) {
        console.warn(`Erro ao carregar mensagens:`, err);
      }
    }

    // Marcar mensagens não lidas como lidas
    const mensagensNaoLidas = conversa.mensagens
      .filter(msg => msg.tipo === "recebida" && !msg.lida)
      .map(msg => msg.id);

    if (mensagensNaoLidas.length > 0) {
      try {
        await Promise.all(
          mensagensNaoLidas.map(id => atualizarMensagemApi(id, { lida: true }))
        );
      } catch (err) {
        console.warn("Erro ao marcar mensagens como lidas:", err);
      }
    }

    const conversaAtualizada = {
      ...conversa,
      mensagens: conversa.mensagens.map(msg => 
        msg.tipo === "recebida" ? { ...msg, lida: true } : msg
      )
    };

    // Atualizar na lista
    setConversas(prev => prev.map(conv => 
      conv.id === conversa.id ? conversaAtualizada : conv
    ));

    // Em mobile, abre o modal; em desktop, seleciona
    if (window.innerWidth < 1024) {
      setSelectedConversa(conversaAtualizada);
      setShowConversaModal(true);
    } else {
      setSelecionada(conversaAtualizada);
    }
  };

  const fecharConversaModal = () => {
    setShowConversaModal(false);
    setSelectedConversa(null);
  };

  const getMensagensNaoLidas = (conversa) => {
    return (conversa.mensagens || []).filter(msg => msg.tipo === "recebida" && !msg.lida).length;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 pt-16 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2174a7] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conversas...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 pt-16 flex items-center justify-center bg-white">
      <div className="max-w-7xl w-full h-full flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl flex flex-col lg:flex-row w-full h-full max-h-[calc(100vh-120px)]">
        
        {/* Lista de conversas - Coluna Esquerda */}
        <div className="w-full lg:w-1/3 border-r border-gray-200 flex flex-col h-full">
          {/* Header da lista de conversas */}
          <div className="bg-[#2174a7] p-6 flex-shrink-0">
            <h2 className="text-white text-xl font-bold text-center">
              Mensagens
            </h2>
          </div>

          {/* Barra de busca */}
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={buscaConversa}
                onChange={(e) => setBuscaConversa(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2174a7] focus:border-[#2174a7] transition-all duration-200"
              />
            </div>
          </div>

          {/* Lista de conversas */}
          <div className="flex-1 overflow-y-auto h-0">
            {conversasFiltradas.length === 0 ? (
              <div className="p-8 text-center">
                <FiMessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Nenhuma conversa encontrada</p>
              </div>
            ) : (
              conversasFiltradas.map((conv) => {
                const mensagensNaoLidas = getMensagensNaoLidas(conv);
                const isSelected = selecionada?.id === conv.id;
                const ultimaMensagem = conv.mensagens?.slice(-1)[0];
                
                return (
                  <div
                    key={conv.id}
                    className={`relative flex gap-4 items-center p-4 cursor-pointer transition-all duration-200 border-b border-gray-50 ${
                      isSelected 
                        ? "bg-blue-50 border-l-4 border-l-[#2174a7]" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleConversaClick(conv)}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <img 
                        src={conv.avatar || perfilSemFoto} 
                        alt={conv.nome} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        onError={(e) => {
                          e.target.src = perfilSemFoto;
                        }}
                      />
                    </div>

                    {/* Informações da conversa */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 truncate">{conv.nome}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1 truncate">{conv.empresa || ''}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {ultimaMensagem?.texto || 'Nenhuma mensagem'}
                      </p>
                    </div>

                    {/* Indicador de mensagens não lidas */}
                    {mensagensNaoLidas > 0 && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#2174a7] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">{mensagensNaoLidas}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Área de chat - Coluna Direita */}
<<<<<<< HEAD
        <div className="hidden lg:flex flex-1 flex-col h-full">
          {/* Header do chat */}
          <div className="bg-[#2174a7] p-6 flex-shrink-0">
            <div className="flex items-center gap-4">
              <img 
                src={selecionada.avatar} 
                alt={selecionada.nome}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40x40/ffffff/2174a7?text=" + selecionada.nome.charAt(0);
                }}
              />
              <div>
                <h3 className="text-white font-bold text-lg">{selecionada.nome}</h3>
                <p className="text-blue-100 text-sm">{selecionada.empresa}</p>
              </div>
            </div>
          </div>

          {/* Área de mensagens */}
          <div
            ref={mensagensRef}
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gradient-to-b from-gray-50 to-white h-0"
          >
            {selecionada.mensagens.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.tipo === "enviada" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    msg.tipo === "enviada" 
                      ? "bg-[#2174a7] text-white" 
                      : "bg-white text-gray-800 shadow-sm border border-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{msg.texto}</p>
                  <p className={`text-xs mt-2 ${
                    msg.tipo === "enviada" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {msg.dataHora}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Área de input de mensagem */}
          <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-end gap-3">
              {/* Input de mensagem */}
              <div className="flex-1 relative">
                <textarea
                  value={novaMsg}
                  onChange={(e) => setNovaMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleEnviarMensagem();
                    }
                  }}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#2174a7] focus:border-[#2174a7] transition-all duration-200"
                />
              </div>

              {/* Botões de ação */}
              <div className="flex items-center gap-2">
                <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                  <FiPaperclip className="w-5 h-5" />
                </button>
                <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                  <FiSmile className="w-5 h-5" />
                </button>
                <button
                  onClick={handleEnviarMensagem}
                  disabled={!novaMsg.trim()}
                  className="p-3 bg-[#2174a7] text-white rounded-xl hover:bg-[#19506e] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {selecionada ? (
          <div className="hidden lg:flex flex-1 flex-col h-full">
            {/* Header do chat */}
            <div className="bg-[#2174a7] p-6 flex-shrink-0">
              <div className="flex items-center gap-4">
                <img 
                  src={selecionada.avatar || perfilSemFoto} 
                  alt={selecionada.nome}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  onError={(e) => {
                    e.target.src = perfilSemFoto;
                  }}
                />
                <div>
                  <h3 className="text-white font-bold text-lg">{selecionada.nome}</h3>
                  <p className="text-blue-100 text-sm">{selecionada.empresa || ''}</p>
                </div>
              </div>
            </div>

            {/* Área de mensagens */}
            <div
              ref={mensagensRef}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gradient-to-b from-gray-50 to-white h-0"
            >
              {(selecionada.mensagens || []).map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex ${msg.tipo === "enviada" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      msg.tipo === "enviada" 
                        ? "bg-[#2174a7] text-white" 
                        : "bg-white text-gray-800 shadow-sm border border-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.texto}</p>
                    <p className={`text-xs mt-2 ${
                      msg.tipo === "enviada" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {msg.dataHora}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Área de input de mensagem */}
            <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={novaMsg}
                    onChange={(e) => setNovaMsg(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleEnviarMensagem();
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    rows={1}
                    disabled={enviando}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#2174a7] focus:border-[#2174a7] transition-all duration-200 disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <FiPaperclip className="w-5 h-5" />
                  </button>
                  <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <FiSmile className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleEnviarMensagem}
                    disabled={!novaMsg.trim() || enviando}
                    className="p-3 bg-[#2174a7] text-white rounded-xl hover:bg-[#19506e] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
>>>>>>> back-branch-nova
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gray-50">
            <div className="text-center">
              <FiMessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conversa selecionada</h3>
              <p className="text-gray-600">Escolha uma conversa para começar a conversar</p>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Modal de Conversa para Mobile */}
      <ConversaModal
        conversa={selectedConversa}
        isOpen={showConversaModal}
        onClose={fecharConversaModal}
      />
    </div>
  );
}
