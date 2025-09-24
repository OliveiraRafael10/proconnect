import { useState, useRef, useEffect  } from "react";
import { IoSend } from "react-icons/io5";
import { getDataHoraAtual } from "../../util/formatDateTime";
import { mensagensMock } from "../../data/mockMensagens";
import ConversaModal from "../../components/ui/ConversaModal";



export default function MensagensPage() {
  const [conversas] = useState(mensagensMock);
  const [selecionada, setSelecionada] = useState(conversas[0]);
  const [novaMsg, setNovaMsg] = useState("");
  const [showConversaModal, setShowConversaModal] = useState(false);
  const [selectedConversa, setSelectedConversa] = useState(null);
  const mensagensRef = useRef(null);

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
  
  const textareaRef = useRef(null);

  const handleAutoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";           // reset height
      el.style.height = `${el.scrollHeight}px`; // ajusta conforme conteúdo
    }
  };

  const handleConversaClick = (conversa) => {
    // Em mobile, abre o modal; em desktop, seleciona
    if (window.innerWidth < 1024) {
      setSelectedConversa(conversa);
      setShowConversaModal(true);
    } else {
      setSelecionada(conversa);
    }
  };

  const fecharConversaModal = () => {
    setShowConversaModal(false);
    setSelectedConversa(null);
  };

  return (
    <div className="p-4 lg:p-5 h-full flex flex-col">
      <div className="mt-4 bg-white shadow-2xl rounded-2xl flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Lista de conversas */}
        <div className="w-full lg:w-1/3 border-r border-gray-300 flex flex-col">
          <div className="bg-[#2f7fb1] rounded-tl-lg flex-shrink-0">
              <h2 className="p-5.5 text-white text-center text-lg border-b">Mensagens</h2>
          </div>
          <div className="flex-1 overflow-y-auto conversas-scroll min-h-0">
            {conversas.map((conv) => (
              <div
                key={conv.id}
                className={`flex gap-3 items-start p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                  selecionada.id === conv.id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleConversaClick(conv)}
              >
                <img 
                  src={conv.avatar} 
                  alt="avatar" 
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/40x40/2f7fb1/ffffff?text=" + conv.nome.charAt(0);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{conv.nome}</p>
                  <p className="text-xs text-gray-500 truncate">{conv.empresa}</p>
                  <p className="text-sm text-gray-600 truncate">{conv.mensagens.slice(-1)[0]?.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de mensagens - Apenas Desktop */}
        <div className="hidden lg:flex flex-1 flex-col min-h-0">
          <div className="bg-[#2f7fb1] p-4 rounded-tr-lg flex-shrink-0">
            <p className="text-white font-semibold">{selecionada.nome}</p>
            <p className="text-xs text-gray-300">{selecionada.empresa}</p>
          </div>

          <div
            ref={mensagensRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 smooth-scroll min-h-0"
          >
            {selecionada.mensagens.map((msg, index) => (
              <div
              key={index}
              className={`max-w-[80%] px-4 py-2 my-1 rounded-lg ${
                msg.tipo === "enviada" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.texto}</p>
              <p className="text-xs text-right text-gray-500 mt-1">{msg.dataHora}</p>
            </div>
            ))}
          </div>

          {/* input de mensagem */}
          <div className="flex p-4 border-t border-gray-200 flex-shrink-0">
            <textarea
              ref={textareaRef}
              value={novaMsg}
              onChange={(e) => {
                setNovaMsg(e.target.value);
                handleAutoResize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleEnviarMensagem();
                  setTimeout(() => handleAutoResize(), 0); // reposiciona após limpar
                }
              }}
              placeholder="Digite sua mensagem..."
              rows={1}
              className="flex-1 max-h-32 overflow-y-auto border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              onClick={handleEnviarMensagem}
              className="ml-3 px-4 py-2 bg-[#2f7fb1] text-white rounded-lg hover:bg-[#256b96] transition-colors self-end"
            >
              <IoSend className="text-lg" />
            </button>
          </div>
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
