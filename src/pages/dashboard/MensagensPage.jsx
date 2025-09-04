import { useState, useRef, useEffect  } from "react";
import { IoSend } from "react-icons/io5";
import { getDataHoraAtual } from "../../util/formatDateTime";

const mensagensMock = [
  {
    id: 1,
    nome: "Marcos Oliveira",
    empresa: "Cliente - Pedido de Conserto de Torneira",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    mensagens: [
      {
        texto: "Olá Marcos! Recebi seu pedido para o conserto da torneira. Qual seria o melhor horário para você?",
        tipo: "recebida",
        dataHora: "25/07/2025 14:32"
      },
      {
        texto: "Boa tarde! Pode ser amanhã às 10h?",
        tipo: "enviada",
        dataHora: "25/07/2025 14:35"
      },
      {
        texto: "Perfeito, estarei no local às 10h. Obrigado!",
        tipo: "recebida",
        dataHora: "25/07/2025 14:36"
      }
    ]
  },
  {
    id: 2,
    nome: "Luciana Silva",
    empresa: "Prestadora - Aulas de Matemática",
    avatar: "https://randomuser.me/api/portraits/women/38.jpg",
    mensagens: [
      {
        texto: "Olá Luciana! Estou interessado nas suas aulas de reforço. Você atende alunos do 9º ano?",
        tipo: "enviada",
        dataHora: "24/07/2025 09:12"
      },
      {
        texto: "Sim, atendo! Posso adaptar o conteúdo conforme a necessidade. Vamos marcar uma aula experimental?",
        tipo: "recebida",
        dataHora: "24/07/2025 09:15"
      }
    ]
  }
];



export default function MensagensPage() {
  const [conversas] = useState(mensagensMock);
  const [selecionada, setSelecionada] = useState(conversas[0]);
  const [novaMsg, setNovaMsg] = useState("");
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

  return (
    <div className="p-5">
      <div className="mt-4 bg-white shadow-2xl rounded-2xl flex h-[90vh]">
        {/* Lista de conversas */}
        <div className="w-1/3 border-r rounded-tl-lg border-gray-300 overflow-y-auto">
          <div className="bg-[#2f7fb1]">
              <h2 className="p-5.5 text-white text-center text-lg border-b">Mensagens</h2>
          </div>
          {conversas.map((conv) => (
            <div
              key={conv.id}
              className={`flex gap-3 items-start p-4 hover:bg-gray-100 cursor-pointer ${
                selecionada.id === conv.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelecionada(conv)}
            >
              <img src={conv.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{conv.nome}</p>
                <p className="text-xs text-gray-500">{conv.empresa}</p>
                <p className="text-sm text-gray-600 truncate max-w-[180px]">{conv.mensagens.slice(-1)[0]?.texto}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Área de mensagens */}
        <div className="flex-1 flex flex-col">
          <div className="bg-[#2f7fb1] p-4 rounded-tr-lg">
            <p className="text-white font-semibold">{selecionada.nome}</p>
            <p className="text-xs text-gray-300">{selecionada.empresa}</p>
          </div>

          <div
            ref={mensagensRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
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
          <div className="flex p-4">
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
              className="flex-1 max-h-40 overflow-y-auto border border-gray-500 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleEnviarMensagem}
              className="ml-2 px-4 py-2 self-end text-gray-500 text-xl border-2 rounded-full hover:text-blue-800"
            >
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
