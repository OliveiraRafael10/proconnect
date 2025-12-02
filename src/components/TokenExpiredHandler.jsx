import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { setOnTokenExpiredCallback } from '../services/apiClient';
import TokenExpiradoModal from './ui/TokenExpiradoModal';

function TokenExpiredHandler() {
  const [showModal, setShowModal] = useState(false);
  const { logout } = useAuth();
  const callbackRef = useRef(null);

  // Configurar callback IMEDIATAMENTE na montagem (antes de qualquer useEffect)
  // Isso garante que o callback esteja disponível quando APIs forem chamadas
  if (!callbackRef.current) {
    callbackRef.current = () => {
      // Fazer logout no contexto de autenticação
      logout();
      // Mostrar modal
      setShowModal(true);
    };
    setOnTokenExpiredCallback(callbackRef.current);
  }

  useEffect(() => {
    // Atualizar callback se logout mudar
    callbackRef.current = () => {
      logout();
      setShowModal(true);
    };
    setOnTokenExpiredCallback(callbackRef.current);

    // Cleanup
    return () => {
      setOnTokenExpiredCallback(null);
    };
  }, [logout]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleEncerrarSessao = () => {
    logout();
    setShowModal(false);
    // Redirecionar será feito pelo modal
  };

  return <TokenExpiradoModal isOpen={showModal} onClose={handleClose} onEncerrarSessao={handleEncerrarSessao} />;
}

export default TokenExpiredHandler;

