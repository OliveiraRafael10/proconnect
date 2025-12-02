import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiMapPin, FiClock, FiStar, FiCheckCircle, FiAlertCircle, FiMessageCircle, FiHeart, FiUser, FiEye, FiCalendar, FiAward } from 'react-icons/fi';

function ServiceDetailModal({ servico, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!isOpen || !servico) return null;

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgenciaIcon = (urgencia) => {
    return urgencia === 'alta' ? <FiAlertCircle /> : <FiCheckCircle />;
  };

  const nextImage = () => {
    if (!servico.imagens || servico.imagens.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === servico.imagens.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!servico.imagens || servico.imagens.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? servico.imagens.length - 1 : prev - 1
    );
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2174a7] to-[#19506e] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiEye className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Detalhes do Serviço
                </h2>
                <p className="text-blue-100 text-sm">
                  {servico.titulo}
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
          {/* Informações do Serviço */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {servico.titulo}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <FiMapPin className="w-4 h-4 text-[#2174a7]" />
                    {servico.localizacao}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4 text-[#2174a7]" />
                    Prazo: {formatarData(servico.prazo)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getUrgenciaColor(servico.urgencia)}`}>
                    {getUrgenciaIcon(servico.urgencia)}
                    {servico.urgencia === 'alta' ? 'Urgente' : 'Normal'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Publicado em {formatarData(servico.dataPublicacao)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-[#2174a7] text-sm font-semibold rounded-xl border border-blue-200">
                {servico.categoria}
              </span>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="space-y-8">
            {/* Descrição e Cliente lado a lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Descrição */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-[#2174a7]" />
                  Descrição
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {servico.descricao}
                </p>
              </div>
              
              {/* Informações do Cliente */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiAward className="w-5 h-5 text-green-600" />
                  Publicado por
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {servico.cliente.nome.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{servico.cliente.nome}</p>
                    <p className="text-sm text-gray-600">Cliente</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carrossel de Imagens Grande */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiEye className="w-5 h-5 text-[#2174a7]" />
                Galeria de Imagens
              </h4>
              <div className="relative">
                {servico.imagens && servico.imagens.length > 0 ? (
                  <>
                    <img
                      src={servico.imagens[currentImageIndex]}
                      alt={servico.titulo}
                      className="w-full h-96 rounded-xl object-cover shadow-lg"
                    />
                    
                    {/* Navegação do carrossel */}
                    {servico.imagens.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-colors"
                        >
                          <FiChevronLeft className="h-6 w-6 text-gray-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-colors"
                        >
                          <FiChevronRight className="h-6 w-6 text-gray-700" />
                        </button>
                      </>
                    )}

                    {/* Contador de imagens */}
                    {servico.imagens.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {servico.imagens.length}
                      </div>
                    )}

                    {/* Miniaturas embaixo */}
                    {servico.imagens.length > 1 && (
                      <div className="mt-6">
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {servico.imagens.map((imagem, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                index === currentImageIndex 
                                  ? 'border-[#2174a7] shadow-lg' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img
                                src={imagem}
                                alt={`${servico.titulo} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-96 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <FiCheckCircle className="h-16 w-16 text-blue-300 mx-auto mb-3" />
                      <p className="text-blue-600 font-medium">Sem imagens disponíveis</p>
                    </div>
                  </div>
                )}
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
              <button className="px-8 py-4 bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white font-semibold rounded-xl hover:from-[#19506e] hover:to-[#2174a7] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <FiMessageCircle className="w-5 h-5" />
                Entrar em Contato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailModal;
