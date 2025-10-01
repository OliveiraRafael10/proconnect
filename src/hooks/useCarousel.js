import { useState } from 'react';

/**
 * Hook customizado para gerenciar estado de carrossel
 * @param {Array} items - Array de itens do carrossel
 * @param {number} itemsPerView - Número de itens visíveis por vez
 * @returns {Object} Objeto com estado e funções do carrossel
 */
const useCarousel = (items, itemsPerView = 3) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(items.length / itemsPerView);
  
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
    const startIndex = currentSlide * itemsPerView;
    return items.slice(startIndex, startIndex + itemsPerView);
  };
  
  return {
    currentSlide,
    totalSlides,
    nextSlide,
    prevSlide,
    goToSlide,
    getVisibleItems,
    hasNext: currentSlide < totalSlides - 1,
    hasPrev: currentSlide > 0
  };
};

export default useCarousel;
