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
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoadingState(key, false);
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
