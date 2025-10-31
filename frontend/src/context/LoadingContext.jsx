import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const LoadingContext = createContext(null);

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `loading-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function LoadingProvider({ children }) {
  const [stack, setStack] = useState([]);

  const showLoading = useCallback((detail = {}) => {
    const id = detail.id || generateId();
    setStack((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      return [...filtered, { ...detail, id }];
    });
    return id;
  }, []);

  const hideLoading = useCallback((id) => {
    if (!id) return;
    setStack((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearLoading = useCallback(() => {
    setStack([]);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleStart = (event) => {
      const detail = event.detail || {};
      showLoading(detail);
    };

    const handleEnd = (event) => {
      const { id } = event.detail || {};
      hideLoading(id);
    };

    window.addEventListener("app-loading:start", handleStart);
    window.addEventListener("app-loading:end", handleEnd);

    return () => {
      window.removeEventListener("app-loading:start", handleStart);
      window.removeEventListener("app-loading:end", handleEnd);
    };
  }, [showLoading, hideLoading]);

  const loadingCount = stack.length;
  const isLoading = loadingCount > 0;
  const activeOptions = stack[loadingCount - 1] || null;

  const value = useMemo(
    () => ({
      isLoading,
      showLoading,
      hideLoading,
      clearLoading,
      activeOptions,
      loadingCount,
    }),
    [isLoading, showLoading, hideLoading, clearLoading, activeOptions, loadingCount],
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading deve ser usado dentro de LoadingProvider");
  }
  return context;
}
