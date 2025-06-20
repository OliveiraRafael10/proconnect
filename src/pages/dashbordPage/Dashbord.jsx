import { Link, useLocation } from "react-router-dom";
import { FiUser, FiSettings, FiMessageCircle, FiSearch, FiPlusCircle } from "react-icons/fi";
import { FaPowerOff } from "react-icons/fa";
import { BsHouse } from "react-icons/bs";
import perfilSemFoto from "../../assets/perfil_sem_foto.png";

function DashboardPage() {
  const location = useLocation();
  const { user } = location.state || {};
  console.log(user?.nome);
  console.log(user?.email);
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2174a7] text-white flex flex-col p-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center">LanceFácil</h2>
          <img className="w-24 m-auto" src={perfilSemFoto} alt="person" />
          <p className="text-sm text-center">{user?.nome || "Usuário"}</p>
          <p className="text-sm text-center">{user?.email || "Usuário"}</p>
        </div>

        <nav className="flex flex-col gap-4 flex-1">
          <Link to="#" className="flex items-center gap-2 hover:underline">
            <BsHouse /> Início
          </Link>
          <Link to="#" className="flex items-center gap-2 hover:underline">
            <FiUser /> Perfil
          </Link>
          <Link to="#" className="flex items-center gap-2 hover:underline">
            <FiSearch /> Buscar Serviços
          </Link>
          <Link to="#" className="flex items-center gap-2 hover:underline">
            <FiMessageCircle /> Mensagens
          </Link>
          <Link to="#" className="flex items-center gap-2 hover:underline">
            <FiPlusCircle /> Publicar Serviço
          </Link>
          <Link to="#" className="flex items-center gap-2 hover:underline">
            <FiSettings /> Configurações
          </Link>

          {/* Link de sair fixado no rodapé */}
          <Link
            to="/login"
            className="flex items-center gap-2 text-red-400 hover:text-red-500 mt-auto"
          >
            <FaPowerOff /> Sair
          </Link>
        </nav>
      </aside>


      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Bem-vindo(a), {user?.nome?.split(" ")[0] || "Usuário"} !</h1>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Seus Serviços</h2>
            <p className="text-sm text-gray-600">Você publicou 3 serviços recentemente.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Mensagens</h2>
            <p className="text-sm text-gray-600">2 novos contatos aguardando resposta.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Avaliações</h2>
            <p className="text-sm text-gray-600">Sua média de avaliação é 4.8.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
