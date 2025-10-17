import { FiMenu } from 'react-icons/fi';
import NotificationCenter from '../notifications/NotificationCenter';
import { useAuth } from '../../context/AuthContext';
import perfilSemFoto from '../../assets/perfil_sem_foto.png';

const DashboardHeader = ({ onToggleMenu, showNotifications = true }) => {
  const { usuario } = useAuth();

  return (
    <>
      {/* Header principal - estilo mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#2174a7] shadow-sm">
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-4 max-w-8xl mx-auto">
          {/* Lado esquerdo - Menu e título */}
          <div className="flex items-center gap-3">    
            {/* Botão do menu hambúrguer */}
            <button
              onClick={onToggleMenu}
              className="text-white hover:text-gray-300 transition-colors duration-200 flex items-center justify-center"
              aria-label="Abrir menu de navegação"
            >
              <FiMenu className="w-8 h-8" />
            </button>
            
            {/* Título */}
            <h1 className="text-xl md:text-2xl font-bold text-white">
              ProConnect
            </h1>
          </div>

          {/* Lado direito - Perfil e Notificações */}
          <div className="flex items-center gap-4">
            {/* Foto de perfil e saudação */}
            <div className="flex items-center gap-3">
              <img
                src={usuario?.foto_url || perfilSemFoto}
                alt={usuario?.nome || 'Usuário'}
                className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                onError={(e) => {
                  e.target.src = perfilSemFoto;
                }}
              />
              <span className="text-white font-medium">
                Olá, {usuario?.nome?.split(' ')[0] || 'Usuário'}
              </span>
            </div>

            {/* Separador vertical */}
            <div className="w-px h-6 bg-white/30"></div>

            {/* Notificações */}
            {showNotifications && <NotificationCenter />}
          </div>
        </div>
      </header>

    </>
  );
};

export default DashboardHeader;
