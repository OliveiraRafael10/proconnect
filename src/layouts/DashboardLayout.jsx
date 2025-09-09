import { FiUser, FiSettings, FiMessageCircle, FiSearch, FiPlusCircle, FiBarChart3, FiPalette } from "react-icons/fi";
import { FaPowerOff, FaBriefcase } from "react-icons/fa";
import { BsHouse } from "react-icons/bs";
import perfil_sem_foto from "../assets/perfil_sem_foto.png";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/ROUTES";
import { useAuth } from "../context/AuthContext";
import NotificationCenter from "../components/notifications/NotificationCenter";

function DashboardLayout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const location = useLocation();

   const linkClasses = (path) => {
    const isActive = location.pathname.startsWith(path);
    return `
      flex items-center gap-2 px-4 py-2 rounded 
      transition duration-200
      ${isActive ? "bg-white text-[#19506e] font-semibold" : "text-white hover:bg-[#1a4e6d]"}
    `;
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true }); // impede voltar
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-74 h-screen bg-[#2174a7] text-white flex flex-col p-6 shadow-[6px_0_12px_rgba(0,0,0,0.4)]">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center">LanceFácil</h2>
          <div className="relative">
            <img className="w-32 h-32 p-1 rounded-full mx-auto mb-4 object-cover" src={usuario?.foto_url || perfil_sem_foto} alt="person" />
            {usuario?.isWorker && (
              <div className="absolute bottom-2 right-2 bg-yellow-400 text-yellow-900 p-1 rounded-full">
                <FaBriefcase className="w-4 h-4" />
              </div>
            )}
          </div>
          <p className="text-sm text-center">{usuario?.nome || "Usuário"}</p>
          <p className="text-sm text-center">{usuario?.email || "Usuário"}</p>
          {usuario?.isWorker && (
            <div className="mt-2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs rounded-full text-center font-medium">
              Trabalhador Ativo
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <Link to={ROUTES.INICIOPAGE}  className={linkClasses("/dashboard/inicio")}>
            <BsHouse /> Início
          </Link>
          <Link to={ROUTES.PERFILPAGE}  className={linkClasses("/dashboard/perfil")}>
            <FiUser /> Perfil
          </Link>
          <Link to={ROUTES.PROFISSIONAISPAGE}  className={linkClasses("/dashboard/profissionais")}>
            <FiSearch /> Buscar Profissional
          </Link>
          <Link to={ROUTES.MENSAGENSPAGE}  className={linkClasses("/dashboard/mensagens")}>
            <FiMessageCircle /> Mensagens
          </Link>
          <Link to={ROUTES.PUBLICARPAGE}  className={linkClasses("/dashboard/publicar")}>
            <FiPlusCircle /> Publicar Serviço
          </Link>
          <Link to={ROUTES.CONFIGURACOESPAGE}  className={linkClasses("/dashboard/configuracoes")}>
            <FiSettings /> Configurações
          </Link>
          <Link to={ROUTES.ANALYTICS}  className={linkClasses("/dashboard/analytics")}>
            <FiBarChart3 /> Analytics
          </Link>
          <Link to={ROUTES.PERSONALIZATION}  className={linkClasses("/dashboard/personalization")}>
            <FiPalette /> Personalização
          </Link>

          {/* Link de sair fixado no rodapé */}
          <Link
            to="/login"
            className="flex items-center px-4 py-2 rounded gap-2 text-red-500 hover:text-red-600 mt-auto hover:bg-[#1a4e6d]"
            onClick={handleLogout}
          >
            <FaPowerOff /> Sair
          </Link>
        </nav>
      </aside>


      {/* Main Content */}
      <main className="flex-1 px-8 overflow-y-auto max-h-screen">
        {/* Header com notificações */}
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {location.pathname === '/dashboard/inicio' && 'Início'}
              {location.pathname === '/dashboard/perfil' && 'Perfil'}
              {location.pathname === '/dashboard/profissionais' && 'Profissionais'}
              {location.pathname === '/dashboard/mensagens' && 'Mensagens'}
              {location.pathname === '/dashboard/publicar' && 'Publicar Serviço'}
              {location.pathname === '/dashboard/configuracoes' && 'Configurações'}
              {location.pathname === '/dashboard/analytics' && 'Analytics'}
              {location.pathname === '/dashboard/personalization' && 'Personalização'}
            </h1>
          </div>
          <NotificationCenter />
        </div>
        
        <Outlet /> {/* Aqui entra o conteúdo de cada página */}
      </main>
    </div>
  );
}

export default DashboardLayout;
