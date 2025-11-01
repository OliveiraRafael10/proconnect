import { createContext, useContext, useState } from 'react';

const ServicosContext = createContext();

export const useServicos = () => {
  const context = useContext(ServicosContext);
  if (!context) {
    throw new Error('useServicos deve ser usado dentro de um ServicosProvider');
  }
  return context;
};

export const ServicosProvider = ({ children }) => {
  const [temServicos, setTemServicos] = useState(false);

  const atualizarEstadoServicos = (temServicos) => {
    setTemServicos(temServicos);
  };

  return (
    <ServicosContext.Provider value={{ temServicos, atualizarEstadoServicos }}>
      {children}
    </ServicosContext.Provider>
  );
};
