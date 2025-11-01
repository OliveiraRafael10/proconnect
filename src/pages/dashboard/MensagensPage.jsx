import { useState, useRef, useEffect } from "react";
import { 
  FiSearch, 
  FiPaperclip, 
  FiSmile, 
  FiSend,
  FiMessageCircle,
  FiUser
} from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { getDataHoraAtual } from "../../util/formatDateTime";
import { mensagensMock } from "../../data/mockMensagens";
import ConversaModal from "../../components/ui/ConversaModal";

export default function MensagensPage() {
  const [conversas, setConversas] = useState(mensagensMock);
  const [selecionada, setSelecionada] = useState(conversas[0]);
  const [novaMsg, setNovaMsg] = useState("");
  const [showConversaModal, setShowConversaModal] = useState(false);
  const [selectedConversa, setSelectedConversa] = useState(null);
  const [buscaConversa, setBuscaConversa] = useState("");
  const mensagensRef = useRef(null);

  // Filtrar conversas pela busca
  const conversasFiltradas = conversas.filter(conversa =>
    conversa.nome.toLowerCase().includes(buscaConversa.toLowerCase()) ||
    conversa.empresa.toLowerCase().includes(buscaConversa.toLowerCase())
  );

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [selecionada.mensagens]);

  const handleEnviarMensagem = () => {
    if (!novaMsg.trim()) return;

    const nova = {
      texto: novaMsg,
      tipo: "enviada",
      dataHora: getDataHoraAtual(),
    };

    setSelecionada((prev) => ({
      ...prev,
      mensagens: [...prev.mensagens, nova],
    }));

    setNovaMsg("");
  };

  const handleConversaClick = (conversa) => {
    // Marcar mensagens como lidas quando abrir a conversa
    const conversaAtualizada = {
      ...conversa,
      mensagens: conversa.mensagens.map(msg => 
        msg.tipo === "recebida" ? { ...msg, lida: true } : msg
      )
    };

    // Atualizar a conversa na lista
    const conversasAtualizadas = conversas.map(conv => 
      conv.id === conversa.id ? conversaAtualizada : conv
    );

    // Atualizar o estado das conversas
    setConversas(conversasAtualizadas);

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
    return conversa.mensagens.filter(msg => msg.tipo === "recebida" && !msg.lida).length;
  };

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
            {conversasFiltradas.map((conv) => {
              const mensagensNaoLidas = getMensagensNaoLidas(conv);
              const isSelected = selecionada.id === conv.id;
              
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
                      src={conv.avatar} 
                      alt={conv.nome} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/48x48/2174a7/ffffff?text=" + conv.nome.charAt(0);
                      }}
                    />
                  </div>

                  {/* Informações da conversa */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{conv.nome}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">{conv.empresa}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.mensagens.slice(-1)[0]?.texto}
                    </p>
                  </div>

                  {/* Indicador de mensagens não lidas - Canto superior direito do card */}
                  {mensagensNaoLidas > 0 && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#2174a7] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">{mensagensNaoLidas}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Área de chat - Coluna Direita */}
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

        {/* Estado vazio para desktop quando não há conversa selecionada */}
        {!selecionada && (
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