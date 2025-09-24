import { useState, useCallback } from "react";
import { FiX, FiMapPin, FiUser, FiMessageCircle, FiCheckCircle, FiClock, FiAward, FiEye } from "react-icons/fi";
import { FaStar, FaBriefcase } from "react-icons/fa";
import Button from "./Button";
import perfilSemFoto from "../../assets/perfil_sem_foto.png";

export default function ProfissionalDetailModal({ profissional, isOpen, onClose, onContratar, loading }) {
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState(null);

  const handleVerPortfolio = useCallback((imagem) => {
    setSelectedPortfolioImage(imagem);
    setShowPortfolioModal(true);
  }, []);

  const fecharPortfolioModal = useCallback(() => {
    setShowPortfolioModal(false);
    setSelectedPortfolioImage(null);
  }, []);

  const renderDisponibilidade = (disponibilidade) => {
    if (!disponibilidade) return null;
    
    const dias = [
      { key: 'segunda', label: 'Seg' },
      { key: 'terca', label: 'Ter' },
      { key: 'quarta', label: 'Qua' },
      { key: 'quinta', label: 'Qui' },
      { key: 'sexta', label: 'Sex' },
      { key: 'sabado', label: 'Sáb' },
      { key: 'domingo', label: 'Dom' }
    ];

    return (
      <div className="flex gap-1 flex-wrap">
        {dias.map((dia) => (
          <span
            key={dia.key}
            className={`px-2 py-1 rounded text-xs ${
              disponibilidade[dia.key]
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {dia.label}
          </span>
        ))}
      </div>
    );
  };
  
  const renderPortfolio = (portfolio) => {
    if (!portfolio || portfolio.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">Portfólio</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {portfolio.slice(0, 12).map((item) => {
            if (!item || !item.id || !item.url || !item.name) return null;
            
            return (
              <div
                key={item.id}
                className="relative group cursor-pointer"
                onClick={() => handleVerPortfolio(item)}
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-16 sm:h-20 object-cover rounded-sm"
                  onError={(e) => {
                    e.target.src = perfilSemFoto;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <FiEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen || !profissional) return null;

  return (
    <>
      {/* Modal Principal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Detalhes do Profissional
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Informações do Profissional */}
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <img
                src={profissional.foto_url || perfilSemFoto}
                alt={profissional.nome}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto sm:mx-0"
                onError={(e) => {
                  e.target.src = perfilSemFoto;
                }}
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {profissional.nome}
                  </h3>
                  <FiCheckCircle className="text-green-500" />
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center">
                    <FiMapPin className="mr-1" />
                    {profissional.endereco.cidade}, {profissional.endereco.estado}
                  </div>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    {profissional.workerProfile.avaliacaoMedia} ({profissional.workerProfile.totalAvaliacoes} avaliações)
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {profissional.workerProfile.categorias.map((categoria, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {categoria}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="space-y-6">
              {/* Sobre */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Sobre</h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  {profissional.workerProfile.descricao}
                </p>
              </div>
              
              {/* Experiência */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Experiência</h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  {profissional.workerProfile.experiencia}
                </p>
              </div>

              {/* Disponibilidade */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Disponibilidade</h4>
                {renderDisponibilidade(profissional.workerProfile.disponibilidade)}
              </div>

              {/* Portfólio */}
              {renderPortfolio(profissional.workerProfile.portfolio)}
            </div>

            {/* Botão de Ação */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-center sm:justify-end">
              <Button
                onClick={() => onContratar(profissional)}
                loading={loading}
                className="bg-[#317e38] hover:bg-[#2a6b30] text-white w-full sm:w-auto"
              >
                <FiMessageCircle className="mr-2" />
                Entrar em Contato
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do Portfolio */}
      {showPortfolioModal && selectedPortfolioImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedPortfolioImage.name || 'Imagem do Portfolio'}
              </h3>
              <button
                onClick={fecharPortfolioModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedPortfolioImage.url}
                alt={selectedPortfolioImage.name || 'Imagem do Portfolio'}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.src = perfilSemFoto;
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

