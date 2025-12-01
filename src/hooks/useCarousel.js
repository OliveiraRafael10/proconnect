import { useState, useEffect } from 'react';

/**
 * Hook customizado para gerenciar estado de carrossel
 * @param {Array} items - Array de itens do carrossel
 * @param {number} itemsPerView - Número de itens visíveis por vez
 * @param {number} mobileItemsPerView - Número de itens visíveis em mobile
 * @returns {Object} Objeto com estado e funções do carrossel
 */
const useCarousel = (items = [], itemsPerView = 3, mobileItemsPerView = 1) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detecta mudanças no tamanho da tela
  useEffect(() => {
    const checkIsMobile = () => {
      try {
        return typeof window !== 'undefined' && window.innerWidth <= 768;
      } catch (error) {
        console.warn('Erro ao verificar tamanho da tela:', error);
        return false;
      }
    };
    
    // Define o estado inicial com delay para evitar SSR issues
    const timer = setTimeout(() => {
      setIsMobile(checkIsMobile());
    }, 100);
    
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
    
    return () => clearTimeout(timer);
  }, []);
  
  // Fallback seguro para items
  const safeItems = Array.isArray(items) ? items : [];
  const effectiveItemsPerView = isMobile ? mobileItemsPerView : itemsPerView;
  const totalSlides = Math.ceil(safeItems.length / effectiveItemsPerView);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };
  
  const getVisibleItems = () => {
    const startIndex = currentSlide * effectiveItemsPerView;
    return safeItems.slice(startIndex, startIndex + effectiveItemsPerView);
  };
  
  return {
    currentSlide,
    totalSlides,
    nextSlide,
    prevSlide,
    goToSlide,
    getVisibleItems,
    hasNext: currentSlide < totalSlides - 1,
    hasPrev: currentSlide > 0,
    isMobile,
    effectiveItemsPerView
  };
};

export default useCarousel;
