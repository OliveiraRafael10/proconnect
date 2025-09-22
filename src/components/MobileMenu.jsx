// Projeto: Lance Fácil - Desenvolvido por: Jefter Ruthes (https://ruthes.dev)

import { useState, useEffect } from 'react';
import { FiUser, FiSettings, FiMessageCircle, FiSearch, FiPlusCircle, FiX, FiMenu } from "react-icons/fi";
import { FaPowerOff, FaBriefcase } from "react-icons/fa";
import { BsHouse } from "react-icons/bs";
import perfil_sem_foto from "../assets/perfil_sem_foto.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/ROUTES";
import { useAuth } from "../context/AuthContext";

function MobileMenu() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = (path) => {
    const isActive = location.pathname.startsWith(path);
    return `
      flex items-center gap-3 px-4 py-3 rounded-lg mx-2
      transition duration-200
      ${isActive ? "bg-white text-[#19506e] font-semibold" : "text-white hover:bg-[#1a4e6d]"}
    `;
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Fechar menu ao navegar
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Botão do menu hambúrguer */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#2174a7] text-white p-3 rounded-lg shadow-lg"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Menu lateral móvel */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-[#2174a7] text-white z-50 transform transition-transform duration-300 ease-in-out
        lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header do menu */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a4e6d]">
          <h2 className="text-xl font-bold">LanceFácil</h2>
          <button
            onClick={closeMenu}
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
    </>
  );
}

export default MobileMenu;
