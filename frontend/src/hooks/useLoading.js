// Hook personalizado para gerenciar estados de loading
import { useState, useCallback } from 'react';

export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [loadingStates, setLoadingStates] = useState({});

  const setLoadingState = useCallback((key, state) => {
    setLoadingStates(prev => ({ ...prev, [key]: state }));
  }, []);

  const withLoading = useCallback(async (asyncFunction, key = 'default') => {
    setLoadingState(key, true);
    try {
      const result = await asyncFunction();
      // Aguardar um tick antes de desativar o loading para garantir que o DOM estabilize
      await new Promise(resolve => setTimeout(resolve, 0));
      return result;
    } catch (error) {
      // Aguardar mesmo em caso de erro
      await new Promise(resolve => setTimeout(resolve, 0));
      throw error;
    } finally {
      // Usar setTimeout para garantir que a desativação do loading aconteça após todas as atualizações de estado
      setTimeout(() => {
        setLoadingState(key, false);
      }, 0);
    }
  }, [setLoadingState]);

  const isLoading = useCallback((key = 'default') => {
    return key === 'default' ? loading : loadingStates[key] || false;
  }, [loading, loadingStates]);

  return {
    loading,
    setLoading,
    withLoading,
    isLoading,
    setLoadingState
  };
};
