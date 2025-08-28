import { useEffect, useState } from "react";
import { profissionais } from "../../data/mockProfissionais";
import { FiMapPin, FiUser } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import "./css/servicosPage.css"

export default function ProfissionaisPage() {
  const [selecionado, setSelecionado] = useState([]);
  const [listProfissionais, setProfissionais] = useState([]);

  useEffect(() => {
    setProfissionais(profissionais);
    if (profissionais.length > 0) {
      setSelecionado(profissionais[0]);
    }
  }, []);

  return (
   <div className="flex h-screen bg-[#f9f9f0]">
  {/* Lista de Serviços */}
  <aside className="w-1/3 border-r border-gray-300 overflow-y-auto scrollbar-custom">
    {listProfissionais.map((profissional) => (
      <div
        key={profissional.id_profissional}
        onClick={() => setSelecionado(profissional)}
        className={`flex bg-white h-32 p-4 gap-1 mb-3 mr-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg ${
          selecionado?.id_profissional === profissional.id_profissional ? "border-l-4 border-blue-500 bg-white" : ""
        }`}
      >
        <div className="mr-2">
          <img
            src={profissional.avatar || "/default.png"}
            alt="Usuário"
            className="w-20 h-22 rounded-3xl border-none object-cover border"
          />
        </div>
        <div className="w-full relative">
          <h3 className="text-lg font-bold text-[#222]">{profissional.funcao}</h3>
          
          <div className="absolute top-0 right-0 flex gap-1">
            <FaStar className="text-yellow-200" />
            <span className="text-sm text-gray-500">{profissional.avaliacao_media}</span>
            <span className="text-sm text-gray-500">| {profissional.qtde_avaliacao} avaliações</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FiUser className="text-gray-600" />
            <span className="text-gray-500">{profissional.nome}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-gray-600" />
            <span className="text-gray-500">{profissional.localizacao}</span>
          </div>
        </div>
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
            <h2 className="text-2xl font-bold">{selecionado.nome}</h2>
            <p className="text-sm text-gray-500">Publicado por: {selecionado.funcao}</p>
          </div>
        </div>
        <p className="text-gray-800 mb-2">{selecionado.resumo}</p>
      </div>
    ) : (
      <p className="text-gray-500">Selecione um serviço para ver os detalhes.</p>
    )}
  </main>
</div>

  );
}
