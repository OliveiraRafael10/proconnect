import { FiMenu } from 'react-icons/fi';
import NotificationCenter from '../notifications/NotificationCenter';

const DashboardHeader = ({ onToggleMenu }) => {

  return (
    <>
      {/* Header principal - estilo mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#2174a7] shadow-sm">
        <div className="flex items-center justify-between px-30 py-3">
          {/* Lado esquerdo - Menu e título */}
          <div className="flex items-center gap-3">    
            {/* Botão do menu hambúrguer */}
            <button
              onClick={onToggleMenu}
              className="text-white hover:text-gray-300 transition-colors duration-200 flex items-center justify-center"
              aria-label="Abrir menu de navegação"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
            {/* Título */}
            <h1 className="text-lg font-bold text-white">
              ProConnect
            </h1>
          </div>

          {/* Lado direito - Notificações */}
          <NotificationCenter />
        </div>
      </header>

    </>
  );
};

export default DashboardHeader;
