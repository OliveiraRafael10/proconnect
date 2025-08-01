import { useEffect, useState } from "react";
import { servicos } from "../../data/mockDados";
import { FiMapPin, FiDollarSign, FiUser } from "react-icons/fi";
import "./css/servicosPage.css"

export default function ServicosPage() {
  const [selecionado, setSelecionado] = useState([]);
  const [listServicos, setServicos] = useState([]);

  useEffect(() => {
    setServicos(servicos);
  }, []);

  return (
   <div className="flex h-screen bg-[#f9f9f0]">
  {/* Lista de Serviços */}
  <aside className="w-1/3 border-r border-gray-300 overflow-y-auto scrollbar-custom">
    {listServicos.map((servico) => (
      <div
        key={servico.id_servico}
        onClick={() => setSelecionado(servico)}
        className={`bg-white p-4 gap-2 mb-4 mr-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg ${
          selecionado?.id_servico === servico.id_servico ? "border-l-4 border-blue-500 bg-white" : ""
        }`}
      >
        <h3 className="text-lg font-bold text-[#222]">{servico.titulo}</h3>
        <p className="text-sm text-gray-600">{servico.descricao}</p>
        <p className="text-sm text-gray-500 mt-1">R$ {servico.preco_min} - {servico.preco_max}</p>
      </div>
    ))}
  </aside>

  {/* Detalhes do Serviço */}
  <main className="flex-1 p-6 overflow-y-auto">
    {selecionado ? (
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center gap-4 mb-4">
          <img src={selecionado.avatar} alt="avatar" className="w-32 h-32 rounded-full object-cover" />
          <div>
            <h2 className="text-2xl font-bold">{selecionado.titulo}</h2>
            <p className="text-sm text-gray-500">Publicado por: {selecionado.id_usuario_criador}</p>
          </div>
        </div>

        <p className="text-gray-800 mb-2">{selecionado.descricao}</p>
        <p className="text-gray-600 mb-2">Preço: R$ {selecionado.preco_min} - {selecionado.preco_max}</p>
        <p className="text-sm text-gray-400">
          Publicado em: {new Date(selecionado.publicado_em).toLocaleDateString()}
        </p>
      </div>
    ) : (
      <p className="text-gray-500">Selecione um serviço para ver os detalhes.</p>
    )}
  </main>
</div>

  );
}
