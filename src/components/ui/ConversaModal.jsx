import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { getDataHoraAtual } from "../../util/formatDateTime";

export default function ConversaModal({ conversa, isOpen, onClose }) {
  const [novaMsg, setNovaMsg] = useState("");
  const mensagensRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (mensagensRef.current && isOpen) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [conversa?.mensagens, isOpen]);

  const handleEnviarMensagem = () => {
    if (!novaMsg.trim() || !conversa) return;

    const nova = {
      texto: novaMsg,
      tipo: "enviada",
      dataHora: getDataHoraAtual(),
    };

    // Adicionar nova mensagem à conversa
    conversa.mensagens.push(nova);
    setNovaMsg("");
    
    // Scroll para baixo após enviar
    setTimeout(() => {
      if (mensagensRef.current) {
        mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleAutoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  if (!isOpen || !conversa) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-[95vw] max-w-2xl h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#2f7fb1] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={conversa.avatar} 
              alt={conversa.nome} 
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40x40/2f7fb1/ffffff?text=" + conversa.nome.charAt(0);
              }}
            />
            <div>
              <h3 className="text-white font-semibold text-lg">{conversa.nome}</h3>
              <p className="text-gray-300 text-sm">{conversa.empresa}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-gray-200 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Mensagens */}
        <div
          ref={mensagensRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 smooth-scroll min-h-0"
        >
          {conversa.mensagens.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] px-4 py-2 my-1 rounded-lg ${
                msg.tipo === "enviada" 
                  ? "bg-blue-100 self-end ml-auto" 
                  : "bg-gray-100 self-start mr-auto"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.texto}</p>
              <p className="text-xs text-right text-gray-500 mt-1">{msg.dataHora}</p>
            </div>
          ))}
        </div>

        {/* Input de mensagem */}
        <div className="flex p-4 border-t border-gray-200">
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
                setTimeout(() => handleAutoResize(), 0);
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
  );
}
