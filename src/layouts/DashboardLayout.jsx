import { FiUser, FiSettings, FiMessageCircle, FiSearch, FiPlusCircle } from "react-icons/fi";
import { FaPowerOff } from "react-icons/fa";
import { BsHouse } from "react-icons/bs";
import perfil_sem_foto from "../assets/perfil_sem_foto.png";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/ROUTES";
import { useAuth } from "../context/AuthContext";

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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2174a7] text-white flex flex-col p-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center">LanceFácil</h2>
          <img className="w-32 h-32 p-1 rounded-full mx-auto mb-4 object-cover" src={usuario?.foto_url || perfil_sem_foto} alt="person" />
          <p className="text-sm text-center">{usuario?.nome || "Usuário"}</p>
          <p className="text-sm text-center">{usuario?.email || "Usuário"}</p>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <Link to={ROUTES.INICIOPAGE}  className={linkClasses("/dashboard/inicio")}>
            <BsHouse /> Início
          </Link>
          <Link to={ROUTES.PERFILPAGE}  className={linkClasses("/dashboard/perfil")}>
            <FiUser /> Perfil
          </Link>
          <Link to={ROUTES.SERVICOSPAGE}  className={linkClasses("/dashboard/servicos")}>
            <FiSearch /> Buscar Serviços
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
            className="flex items-center px-4 py-2 rounded gap-2 text-red-500 hover:text-red-600 mt-auto hover:bg-[#1c5d82]"
            onClick={handleLogout}
          >
            <FaPowerOff /> Sair
          </Link>
        </nav>
      </aside>


      {/* Main Content */}
      <main className="flex-1 p-10">
        <Outlet /> {/* Aqui entra o conteúdo de cada página */}
      </main>
    </div>
  );
}

export default DashboardLayout;
