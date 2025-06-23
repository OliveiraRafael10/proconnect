import { FiUser, FiSettings, FiMessageCircle, FiSearch, FiPlusCircle } from "react-icons/fi";
import { FaPowerOff } from "react-icons/fa";
import { BsHouse } from "react-icons/bs";
import perfil_sem_foto from "../assets/perfil_sem_foto.png";
import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/ROUTES";

function DashboardLayout() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => {
    return JSON.parse(localStorage.getItem("usuarioLogado")) || {};
  });

  useEffect(() => {
    const intervalo = setInterval(() => {
      const dadosAtuais = JSON.parse(localStorage.getItem("usuarioLogado")) || {};
      setUsuario(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(dadosAtuais)) {
          return dadosAtuais; // só atualiza se os dados mudarem
        }
        return prev;
      });
    }, 500); // verifica a cada 0,5 segundo

    return () => clearInterval(intervalo);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    navigate(ROUTES.LOGINPAGE);
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

        <nav className="flex flex-col gap-4 flex-1">
          <Link to={ROUTES.INICIOPAGE} className="flex items-center gap-2 hover:underline">
            <BsHouse /> Início
          </Link>
          <Link to={ROUTES.PERFILPAGE} className="flex items-center gap-2 hover:underline">
            <FiUser /> Perfil
          </Link>
          <Link to={ROUTES.SERVICOSPAGE} className="flex items-center gap-2 hover:underline">
            <FiSearch /> Buscar Serviços
          </Link>
          <Link to={ROUTES.MENSAGENSPAGE} className="flex items-center gap-2 hover:underline">
            <FiMessageCircle /> Mensagens
          </Link>
          <Link to={ROUTES.PUBLICARPAGE} className="flex items-center gap-2 hover:underline">
            <FiPlusCircle /> Publicar Serviço
          </Link>
          <Link to={ROUTES.CONFIGURACOESPAGE} className="flex items-center gap-2 hover:underline">
            <FiSettings /> Configurações
          </Link>

          {/* Link de sair fixado no rodapé */}
          <Link
            to="/login"
            className="flex items-center gap-2 text-red-400 hover:text-red-500 mt-auto"
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
