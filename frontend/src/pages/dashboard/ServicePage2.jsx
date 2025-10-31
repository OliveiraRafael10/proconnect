import { useEffect, useState } from "react";
import { servicos } from "../../data/mockDados";
import { FiMapPin, FiDollarSign, FiUser } from "react-icons/fi";

export default function ServicosPage2() {
  const [listServicos, setServicos] = useState([]);

  useEffect(() => {
    setServicos(servicos);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#2174a7] mb-6">📋 Lista de Serviços Disponíveis</h1>

      <div className="flex flex-col gap-6">
        {listServicos.map((servico) => (
          <div
            key={servico.id}
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex items-start gap-5 hover:shadow-lg transition duration-300"
          >
            {/* Avatar */}
            <img
              src={servico.avatar || "/default.png"}
              alt="Usuário"
              className="w-16 h-16 rounded-full object-cover border"
            />

            {/* Conteúdo */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#2174a7] mb-1">
                {servico.titulo}
              </h2>
              <p className="text-sm text-gray-700 mb-2">{servico.descricao}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FiDollarSign className="text-green-600" />
                  Valores R$ {servico.preco_min} - {servico.preco_max}
                </span>
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-blue-500" />
                  {servico.local}
                </span>
                <span className="flex items-center gap-1">
                  <FiUser className="text-gray-500" />
                  {servico.id_usuario_criador}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
