import { useEffect, useState } from "react";

function Dashboard() {
  const [usuario, setUsuario] = useState("");

  useEffect(() => {
    const login = localStorage.getItem("usuarioLogado");
    setUsuario(login);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]">
      <h1 className="text-2xl font-bold">Bem-vindo, {usuario}!</h1>
    </div>
  );
}

export default Dashboard;