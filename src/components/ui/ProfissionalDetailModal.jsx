import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiX, 
  FiMapPin, 
  FiUser, 
  FiMessageCircle, 
  FiCheckCircle, 
  FiClock, 
  FiAward, 
  FiEye,
  FiStar,
  FiBriefcase,
  FiHeart,
  FiCalendar,
  FiDownload
} from "react-icons/fi";
import { FaStar, FaBriefcase } from "react-icons/fa";
import Button from "./Button";
import perfilSemFoto from "../../assets/perfil_sem_foto.png";
import { ROUTES } from "../../routes/ROUTES";

export default function ProfissionalDetailModal({ profissional, isOpen, onClose, onContratar, loading }) {
  const navigate = useNavigate();
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 w-5 h-5" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 w-5 h-5" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 w-5 h-5" />);
    }

    return stars;
  };

  const renderDisponibilidade = (disponibilidade) => {
    if (!disponibilidade) return null;
    
    const dias = [
      { key: 'segunda', label: 'Seg', full: 'Segunda' },
      { key: 'terca', label: 'Ter', full: 'Terça' },
      { key: 'quarta', label: 'Qua', full: 'Quarta' },
      { key: 'quinta', label: 'Qui', full: 'Quinta' },
      { key: 'sexta', label: 'Sex', full: 'Sexta' },
      { key: 'sabado', label: 'Sáb', full: 'Sábado' },
      { key: 'domingo', label: 'Dom', full: 'Domingo' }
    ];

    return (
      <div className="grid grid-cols-7 gap-2">
        {dias.map((dia) => (
          <div
            key={dia.key}
            className={`p-3 rounded-xl text-center transition-all duration-200 ${
              disponibilidade[dia.key]
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-green-800'
                : 'bg-gray-50 border-2 border-gray-200 text-gray-500'
            }`}
          >
            <div className="text-xs font-medium mb-1">{dia.label}</div>
            <div className={`w-2 h-2 rounded-full mx-auto ${
              disponibilidade[dia.key] ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
        ))}
      </div>
    );
  };
  
  const renderPortfolio = (portfolio) => {
    if (!portfolio || portfolio.length === 0) return (
      <div className="text-center py-8">
        <FiEye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Nenhum trabalho no portfólio</p>
      </div>
    );
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-gray-900 flex items-center gap-2">
            <FiEye className="w-5 h-5 text-[#2174a7]" />
            Portfólio ({portfolio.length})
          </h4>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {portfolio.slice(0, 12).map((item, index) => {
            // Validar item: precisa ter pelo menos url
            if (!item || !item.url) return null;
            
            const itemId = item.id || `portfolio-${index}`;
            const itemName = item.name || item.url?.split('/').pop() || `Trabalho ${index + 1}`;
            
            return (
              <div
                key={itemId}
                className="relative group cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => handleVerPortfolio({ ...item, id: itemId, name: itemName })}
              >
                <div className="aspect-square rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={item.url}
                    alt={itemName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = perfilSemFoto;
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-2">
                  <FiEye className="text-white w-4 h-4 mb-1" />
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2174a7] to-[#19506e] p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiUser className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    Perfil do Profissional
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Conheça mais sobre {profissional.nome}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Informações do Profissional */}
            <div className="flex flex-col lg:flex-row items-start gap-6 mb-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={profissional.foto_url || perfilSemFoto}
                    alt={profissional.nome}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-100 shadow-lg"
                    onError={(e) => {
                      e.target.src = perfilSemFoto;
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
                    <FiCheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {profissional.nome}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <FiMapPin className="w-4 h-4 text-[#2174a7]" />
                        {profissional.endereco?.cidade}, {profissional.endereco?.estado}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaBriefcase className="w-4 h-4 text-[#2174a7]" />
                        {profissional.workerProfile?.categorias?.length || 0} especialidades
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(profissional.workerProfile?.avaliacao || 0)}
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {profissional.workerProfile?.avaliacao?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      ({profissional.workerProfile?.totalAvaliacoes || 0} avaliações)
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {profissional.workerProfile?.categorias?.map((categoria, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-[#2174a7] text-sm font-semibold rounded-xl border border-blue-200"
                    >
                      {categoria}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Coluna Esquerda */}
              <div className="space-y-6">
                {/* Sobre */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-[#2174a7]" />
                    Sobre
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {profissional.workerProfile?.descricao || "Profissional dedicado e experiente em sua área de atuação."}
                  </p>
                </div>
                
                {/* Experiência */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiAward className="w-5 h-5 text-green-600" />
                    Experiência
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {profissional.workerProfile?.experiencia || "Experiência sólida e comprovada no mercado."}
                  </p>
                </div>

                {/* Disponibilidade */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiCalendar className="w-5 h-5 text-purple-600" />
                    Disponibilidade
                  </h4>
                  {renderDisponibilidade(profissional.workerProfile?.disponibilidade)}
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-6">
                {/* Portfólio */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  {renderPortfolio(profissional.workerProfile?.portfolio)}
                </div>

                {/* Estatísticas */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiStar className="w-5 h-5 text-[#2174a7]" />
                    Estatísticas
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                      <div className="text-2xl font-bold text-[#2174a7] mb-1">
                        {profissional.workerProfile?.totalAvaliacoes || 0}
                      </div>
                      <div className="text-sm text-gray-600">Avaliações</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {profissional.workerProfile?.projetosConcluidos || 0}
                      </div>
                      <div className="text-sm text-gray-600">Projetos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onClose}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate(`${ROUTES.MENSAGENSPAGE}?profissional=${profissional.id}`);
                  }}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white font-semibold rounded-xl hover:from-[#19506e] hover:to-[#2174a7] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <FiMessageCircle className="w-5 h-5" />
                  {loading ? 'Enviando...' : 'Entrar em Contato'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do Portfolio */}
      {showPortfolioModal && selectedPortfolioImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[4px] flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-[#2174a7] to-[#19506e] p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FiEye className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedPortfolioImage.name || 'Imagem do Portfólio'}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Trabalho de {profissional.nome}
                    </p>
                  </div>
                </div>
                <button
                  onClick={fecharPortfolioModal}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="relative">
                <img
                  src={selectedPortfolioImage.url}
                  alt={selectedPortfolioImage.name || 'Imagem do Portfolio'}
                  className="w-full h-auto rounded-xl shadow-lg"
                  onError={(e) => {
                    e.target.src = perfilSemFoto;
                  }}
                />
                <div className="absolute top-4 right-4">
                  <button className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200">
                    <FiDownload className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}