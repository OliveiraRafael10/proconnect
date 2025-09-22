// Projeto: Lance Fácil - Desenvolvido por: Jefter Ruthes (https://ruthes.dev)

import { useState, useEffect } from 'react';
import { FiUser, FiSettings, FiMessageCircle, FiSearch, FiPlusCircle, FiX, FiMenu } from "react-icons/fi";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  
  return (
    <div className="min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Botão do menu hambúrguer */}
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 bg-[#2174a7] text-white p-3 rounded-lg shadow-lg"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        {/* Header Mobile */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between ml-16">
            <h1 className="text-lg font-semibold text-gray-900">LanceFácil</h1>
            <NotificationCenter />
          </div>
        </header>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMobileMenu}
          />
        )}

        {/* Menu lateral móvel */}
        <div className={`
          fixed top-0 left-0 h-full w-80 bg-[#2174a7] text-white z-50 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Header do menu */}
          <div className="flex items-center justify-between p-4 border-b border-[#1a4e6d]">
            <h2 className="text-xl font-bold">LanceFácil</h2>
            <button
              onClick={closeMobileMenu}
              className="text-white hover:text-gray-300"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Perfil do usuário */}
          <div className="p-4 border-b border-[#1a4e6d]">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  className="w-12 h-12 rounded-full object-cover" 
                  src={usuario?.foto_url || perfil_sem_foto} 
                  alt="person" 
                />
                {usuario?.isWorker && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 p-1 rounded-full">
                    <FaBriefcase className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{usuario?.nome || "Usuário"}</p>
                <p className="text-xs text-gray-300 truncate">{usuario?.email || "Usuário"}</p>
                {usuario?.isWorker && (
                  <div className="mt-1 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs rounded-full inline-block font-medium">
                    Trabalhador Ativo
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navegação */}
          <nav className="flex flex-col gap-1 py-4 flex-1">
            <Link to={ROUTES.INICIOPAGE} className={linkClasses("/dashboard/inicio")}>
              <BsHouse className="w-5 h-5" /> Início
            </Link>
            <Link to={ROUTES.PERFILPAGE} className={linkClasses("/dashboard/perfil")}>
              <FiUser className="w-5 h-5" /> Perfil
            </Link>
            <Link to={ROUTES.PROFISSIONAISPAGE} className={linkClasses("/dashboard/profissionais")}>
              <FiSearch className="w-5 h-5" /> Buscar Profissional
            </Link>
            <Link to={ROUTES.MENSAGENSPAGE} className={linkClasses("/dashboard/mensagens")}>
              <FiMessageCircle className="w-5 h-5" /> Mensagens
            </Link>
            <Link to={ROUTES.PUBLICARPAGE} className={linkClasses("/dashboard/publicar")}>
              <FiPlusCircle className="w-5 h-5" /> Publicar Serviço
            </Link>
            <Link to={ROUTES.CONFIGURACOESPAGE} className={linkClasses("/dashboard/configuracoes")}>
              <FiSettings className="w-5 h-5" /> Configurações
            </Link>

            {/* Link de sair */}
            <div className="mt-auto p-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg mx-2 text-red-400 hover:text-red-300 hover:bg-[#1a4e6d] w-full transition duration-200"
              >
                <FaPowerOff className="w-5 h-5" /> Sair
              </button>
            </div>
          </nav>
        </div>

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