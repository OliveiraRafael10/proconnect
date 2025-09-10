import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiMapPin, FiClock, FiStar, FiCheckCircle, FiAlertCircle, FiMessageCircle, FiHeart } from 'react-icons/fi';

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
    setCurrentImageIndex((prev) => 
      prev === servico.imagens.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? servico.imagens.length - 1 : prev - 1
    );
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getUrgenciaColor(servico.urgencia)}`}>
                {getUrgenciaIcon(servico.urgencia)}
                {servico.urgencia === 'alta' ? 'Urgente' : 'Normal'}
              </span>
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                {servico.categoria}
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-8 w-8" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Imagens */}
              <div className="relative bg-gray-100">
                <div className="relative h-64 lg:h-96">
                  <img
                    src={servico.imagens[currentImageIndex]}
                    alt={servico.titulo}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navegação do carrossel */}
                  {servico.imagens.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <FiChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <FiChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}

                  {/* Indicadores */}
                  {servico.imagens.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {servico.imagens.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Contador de imagens */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {servico.imagens.length}
                  </div>
                </div>

                {/* Miniaturas */}
                {servico.imagens.length > 1 && (
                  <div className="p-4 bg-gray-50">
                    <div className="flex gap-2 overflow-x-auto">
                      {servico.imagens.map((imagem, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex 
                              ? 'border-blue-500' 
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
              </div>

              {/* Informações */}
              <div className="p-6">
                {/* Título */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {servico.titulo}
                </h2>

                {/* Localização */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FiMapPin className="h-4 w-4" />
                  <span>{servico.localizacao}</span>
                </div>

                {/* Descrição */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {servico.descricao}
                  </p>
                </div>


                {/* Informações do Publicador */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-100 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Publicado por:</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {servico.cliente.nome.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{servico.cliente.nome}</p>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Informações de Prazo */}
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <FiClock className="h-4 w-4" />
                  <span>Publicado em {formatarData(servico.dataPublicacao)}</span>
                  <span className="text-gray-300">•</span>
                  <span>Prazo: {formatarData(servico.prazo)}</span>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-[#317e38] text-white py-3 px-6 rounded-lg hover:bg-[#3a6341] transition-colors font-medium flex items-center justify-center gap-2">
                    <FiMessageCircle className="h-4 w-4" />
                    Entrar em Contato
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailModal;
