import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useCarousel from '../../../hooks/useCarousel';
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
    getVisibleItems
  } = useCarousel(servicos, 3);

  const handleImageError = (servicoId) => {
    setImageErrors(prev => ({
      ...prev,
      [servicoId]: true
    }));
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Principais serviços pedidos
          </h2>
        </div>

        {/* Carrossel */}
        <div className="relative">
          {/* Botão Anterior */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Serviços anteriores"
          >
            <FiChevronLeft className="w-6 h-6 text-blue-600" />
          </button>

          {/* Botão Próximo */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Próximos serviços"
          >
            <FiChevronRight className="w-6 h-6 text-blue-600" />
          </button>

          {/* Cards dos Serviços */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-16">
            {getVisibleItems().map((servico) => (
              <div
                key={servico.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                 {/* Imagem */}
                 <div className="aspect-w-16 aspect-h-14 h-48 overflow-hidden">
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                    {servico.titulo}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'bg-blue-600 scale-125'
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
