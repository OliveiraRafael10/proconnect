import { useRef, useEffect } from 'react';

/**
 * Hook para detectar gestos de swipe em elementos
 * @param {function} onSwipeLeft - Callback para swipe para a esquerda
 * @param {function} onSwipeRight - Callback para swipe para a direita
 * @param {number} threshold - Distância mínima para considerar como swipe
 * @returns {Object} Ref para o elemento e configurações
 */
const useSwipe = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const elementRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof window === 'undefined') return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      isDragging.current = true;
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      
      // Previne scroll vertical durante swipe horizontal
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startX.current);
      const deltaY = Math.abs(touch.clientY - startY.current);
      
      if (deltaX > deltaY) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!isDragging.current) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = Math.abs(touch.clientY - startY.current);
      
      // Só considera swipe se o movimento horizontal for maior que o vertical
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight && onSwipeRight();
        } else {
          onSwipeLeft && onSwipeLeft();
        }
      }
      
      isDragging.current = false;
    };

    // Adiciona event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return elementRef;
};

export default useSwipe;
