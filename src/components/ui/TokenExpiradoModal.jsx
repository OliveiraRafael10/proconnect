import { useEffect } from 'react';
import { FiAlertCircle, FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/ROUTES';

function TokenExpiradoModal({ isOpen, onClose, onEncerrarSessao }) {
  const navigate = useNavigate();

  const handleEncerrarSessao = () => {
    if (onEncerrarSessao) {
      onEncerrarSessao();
    }
    onClose();
    navigate(ROUTES.LOGINPAGE, { replace: true });
  };

  useEffect(() => {
    if (isOpen) {
      // Fechar modal e redirecionar após 5 segundos automaticamente (aumentado para dar tempo de ler)
      const timer = setTimeout(() => {
        handleEncerrarSessao();
      }, 5000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Sessão Expirada</h2>
              <p className="text-red-100 text-sm mt-1">Token inválido ou expirado</p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Sua sessão expirou ou o token de autenticação é inválido. 
              Para continuar usando a plataforma, é necessário <strong>reiniciar sua sessão</strong> fazendo login novamente.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-blue-800">
                <strong>O que fazer:</strong> Clique no botão abaixo para encerrar a sessão atual e ser redirecionado à página de login. 
                Você será redirecionado automaticamente em alguns segundos.
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={handleEncerrarSessao}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white font-semibold rounded-xl hover:from-[#19506e] hover:to-[#2174a7] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiLogIn className="w-5 h-5" />
              Encerrar Sessão e Fazer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenExpiradoModal;

