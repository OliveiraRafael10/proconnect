import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useCarousel from '../../../hooks/useCarousel';
import useSwipe from '../../../hooks/useSwipe';
import '../mobile-responsive.css';
import montagemMoveis from '../../../assets/img/servicos/montagem-moveis.png';
import mudancasCarreto from '../../../assets/img/servicos/mudancas-carreto.png';
import servicoPedreiro from '../../../assets/img/servicos/servico-pedreiro.png';
import limpezaResidencial from '../../../assets/img/servicos/limpeza-residencial.png';
import instalacaoEletrica from '../../../assets/img/servicos/instalacao-eletrica.png';
import pinturaResidencial from '../../../assets/img/servicos/pintura-residencial.png';

const PrincipaisServicos = () => {
  const [imageErrors, setImageErrors] = useState({});

  const servicos = [
    {
      id: 1,
      titulo: "Montagem de móveis",
      imagem: montagemMoveis,
      alt: "Profissional montando móveis"
    },
    {
      id: 2,
      titulo: "Mudanças e Carretos",
      imagem: mudancasCarreto,
      alt: "Serviço de mudança e carreto"
    },
    {
      id: 3,
      titulo: "Serviço de Pedreiro",
      imagem: servicoPedreiro,
      alt: "Serviço de pedreiro e construção"
    },
    {
      id: 4,
      titulo: "Limpeza Residencial",
      imagem: limpezaResidencial,
      alt: "Serviço de limpeza residencial"
    },
    {
      id: 5,
      titulo: "Instalação Elétrica",
      imagem: instalacaoEletrica,
      alt: "Serviço de instalação elétrica"
    },
    {
      id: 6,
      titulo: "Pintura Residencial",
      imagem: pinturaResidencial,
      alt: "Serviço de pintura residencial"
    }
  ];

  // Hook customizado para gerenciar o carrossel
  const {
    currentSlide,
    totalSlides,
    nextSlide,
    prevSlide,
    goToSlide,
    getVisibleItems,
    hasNext,
    hasPrev,
    isMobile,
    effectiveItemsPerView
  } = useCarousel(servicos, 3, 1);

  const handleImageError = (servicoId) => {
    setImageErrors(prev => ({
      ...prev,
      [servicoId]: true
    }));
  };

  // Hook para gestos de swipe em mobile
  const swipeRef = useSwipe(
    () => isMobile && nextSlide(), // Swipe left = próximo
    () => isMobile && prevSlide(), // Swipe right = anterior
    50 // Threshold de 50px
  );

  return (
    <div className="py-16 px-4 servicos-mobile">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 servicos-title">
            Principais serviços pedidos
          </h2>
          {isMobile && (
            <p className="text-gray-600 text-sm">
              Deslize para ver mais serviços
            </p>
          )}
        </div>

        {/* Carrossel */}
        <div className="relative">
          {/* Botão Anterior */}
          <button
            onClick={prevSlide}
            disabled={!hasPrev}
            className={`absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 carousel-buttons touch-target ${
              !hasPrev ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Serviços anteriores"
          >
            <FiChevronLeft className="w-6 h-6 text-blue-600" />
          </button>

          {/* Botão Próximo */}
          <button
            onClick={nextSlide}
            disabled={!hasNext}
            className={`absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 carousel-buttons touch-target ${
              !hasNext ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Próximos serviços"
          >
            <FiChevronRight className="w-6 h-6 text-blue-600" />
          </button>

          {/* Cards dos Serviços */}
          <div 
            ref={swipeRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-16 servicos-grid"
          >
            {getVisibleItems().map((servico) => (
              <div
                key={servico.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 servico-card touch-target"
              >
                 {/* Imagem */}
                 <div className="aspect-w-16 aspect-h-14 h-48 overflow-hidden servico-image">
                   {imageErrors[servico.id] ? (
                     <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                       <div className="text-center">
                         <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                           <span className="text-white font-bold text-xl">
                             {servico.titulo.charAt(0)}
                           </span>
                         </div>
                         <p className="text-blue-700 font-medium text-sm">Imagem não disponível</p>
                       </div>
                     </div>
                   ) : (
                     <img
                       src={servico.imagem}
                       alt={servico.alt}
                       className="w-full h-full object-cover"
                       onError={() => handleImageError(servico.id)}
                     />
                   )}
                 </div>

                {/* Conteúdo */}
                <div className="p-6 servico-content">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center servico-title">
                    {servico.titulo}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-8 space-x-2 carousel-indicators">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 touch-target ${
                isMobile ? 'w-0.5 h-0.5' : 'w-3 h-3'
              } ${
                currentSlide === index
                  ? 'bg-blue-600 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrincipaisServicos;
