import { useEffect, useState } from "react";
import { profissionais } from "../../data/mockProfissionais";
import perfilSemFoto from "../../assets/perfil_sem_foto.png";
import { FiMapPin, FiUser } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
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
    <div>
      <div className="flex justify-between gap-4 mb-5 p-5 border-b-0 shadow-[0px_8px_10px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded shadow-sm">
          <input
            type="text"
            className="flex w-130 rounded-sm bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Pesquisar profissional"
          />
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors  focus:outline-none focus:ring-2 focus:ring-offset-2"><IoSearchOutline className="mr-1 focus:outline-none" size={36} /></button>
        </div>
        <div className="flex items-center gap-2 px-4">
          <select className="bg-white rounded-sm shadow-lg py-2 px-4">
            <option value="">Função</option>
            <option value="garcom">Garçom</option>
            <option value="pedreiro">Pedreiro</option>
            <option value="professor">Professor</option>
            <option value="manicure">Manicure</option>
          </select>
          <select className="bg-white rounded-sm shadow-lg py-2 px-4">
            <option value="">Localização</option>
            <option value="capivari">Capivari</option>
            <option value="piracicaba">Piracicaba</option>
            <option value="itu">Itu</option>
          </select>
          <select className="bg-white rounded-sm shadow-lg py-2 px-4">
            <option value="">Avaliações</option>
            <option value="4">⭐ 4.0+</option>
            <option value="45">⭐ 4.5+</option>
            <option value="5">⭐ 5.0</option>
          </select>
          
          <button className="bg-[#2174a7] text-white font-semibold px-6 py-2 rounded-sm shadow hover:bg-[#1c587e] hover:shadow-lg transition duration-200">
            Aplicar filtros
          </button>

        </div>
      </div>

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
                  src={profissional.avatar || perfilSemFoto }
                  alt="Usuário"
                  className="w-28 h-22 rounded-3xl border-none object-cover border"
                />
              </div>
              <div className="w-full relative">
                <h3 className="text-lg font-bold text-[#222]">{profissional.funcao}</h3>
                
                <div className="absolute top-0 right-0 flex gap-1">
                  <FaStar className="text-yellow-200" />
                  <span className="text-sm text-gray-500">{profissional.avaliacao_media}</span>
                  {/*<span className="text-sm text-gray-500">| {profissional.qtde_avaliacao} avaliações</span>*/}
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
        <main className="flex-1 px-4 overflow-y-auto">
          {selecionado ? (
            <div className="relative bg-white p-6 rounded shadow">
              <div className="flex gap-4">
                <div>
                  <img src={selecionado.avatar} alt="avatar" className="w-36 h-36 rounded-4xl object-cover" />
                </div>
                <div className="mt-2">
                  <h2 className="text-2xl font-bold">{selecionado.nome}</h2>
                  <p className="text-sm text-gray-500">{selecionado.funcao}</p>
                </div>
              </div>
              <p className="text-gray-800 mt-10">{selecionado.resumo}</p>
              <div className="absolute top-4 right-4 flex gap-1">
                <FaStar className="text-yellow-200" />
                <span className="text-sm text-gray-500">{selecionado.avaliacao_media}</span>
                <span className="text-sm text-gray-500">| {selecionado.qtde_avaliacao} avaliações</span>
              </div>
              <div className="flex justify-end items-end gap-3 mt-6">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
                  💬 Falar agora
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600">
                  🤝 Contratar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Selecione um serviço para ver os detalhes.</p>
          )}
        </main>
      </div>
    </div>
    
  );
}
