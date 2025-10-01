import { useState, useEffect } from 'react';
import { FiUser, FiSettings, FiMessageCircle, FiSearch, FiPlusCircle, FiX, FiMenu } from "react-icons/fi";
import { FaPowerOff, FaBriefcase } from "react-icons/fa";
import { BsHouse } from "react-icons/bs";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/ROUTES";
import { useAuth } from "../context/AuthContext";
import NotificationCenter from "../components/notifications/NotificationCenter";
import MobileMenu from "../components/MobileMenu";
import PerfilSemFoto from "../components/ui/PerfilSemFoto";

function DashboardLayout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Fechar menu ao navegar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Resetar erro de imagem quando usuário mudar
  useEffect(() => {
    setImageError(false);
  }, [usuario?.foto_url]);

  // Forçar re-renderização quando a foto mudar
  const [imageKey, setImageKey] = useState(0);
  
  useEffect(() => {
    if (usuario?.foto_url) {
      setImageKey(prev => prev + 1);
      setImageError(false);
    }
  }, [usuario?.foto_url]);

  
  return (
    <div className="min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Header Mobile */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-[#2174a7] shadow-sm px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMobileMenu}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-white">ProConnect</h1>
            </div>
            <NotificationCenter />
          </div>
        </header>

        {/* MobileMenu Component */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

        {/* Main Content Mobile */}
        <main className="px-4 pt-20 pb-4 overflow-y-auto min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-74 h-screen bg-[#2174a7] text-white flex flex-col p-6 shadow-[6px_0_12px_rgba(0,0,0,0.4)]">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-center">ProConnect</h2>
            <div className="relative">
              {usuario?.foto_url && !imageError ? (
                <img 
                  key={imageKey}
                  className="w-32 h-32 p-1 rounded-full mx-auto mb-4 object-cover" 
                  src={usuario.foto_url} 
                  alt="person"
                  onError={() => setImageError(true)}
                />
              ) : (
                <PerfilSemFoto size="large" />
              )}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;