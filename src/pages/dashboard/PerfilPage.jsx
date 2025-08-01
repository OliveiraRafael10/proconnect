import { useState } from "react";
import perfil_sem_foto from "../../assets/perfil_sem_foto.png"
import { useAuth } from "../../context/AuthContext";

export default function PerfilPage() {
  const { usuario, setUsuario } = useAuth();
  const [form, setForm] = useState(() => ({ ...usuario }));
  const [mensagem, setMensagem] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ddd" || name === "numero") {
      setForm((prev) => ({
        ...prev,
        telefone: {
          ...prev.telefone,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    setUsuario(form);
    setMensagem("Dados atualizados com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3">
      {/* Foto do perfil */}
      <div className="bg-white shadow-md rounded-l-2xl p-6 text-center">
        <h3 className="text-lg font-bold mb-4">Foto do Perfil</h3>
        <img
          src={form.foto_url || perfil_sem_foto}
          alt="Foto do usuário"
          className="w-38 h-38 rounded-full mx-auto mb-4 object-cover"
        />
        <input
            type="file"
            accept="image/*"
            id="fotoInput"
            className="hidden"
            onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                    setForm((prev) => ({
                        ...prev,
                        foto_url: reader.result,
                    }));
                    };
                    reader.readAsDataURL(file);
                }
            }}
        />

        <label
            htmlFor="fotoInput"
            className="inline-block mt-2 px-4 py-2 rounded cursor-pointer bg-[#19506e] text-white hover:bg-[#153f59]"
        >
            Escolher Foto
        </label>
      </div>

      {/* Dados principais */}
      <div className="col-span-2 bg-white shadow rounded-r-2xl p-6">
        <h3 className="text-lg font-bold mb-4">Informações do Usuário</h3>

        {mensagem && <div className="text-green-600 mb-4 font-medium">{mensagem}</div>}

        <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Nome completo</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Apelido</label>
            <input
              name="apelido"
              value={form.apelido}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium">DDD</label>
              <input
                name="ddd"
                value={form.telefone?.ddd || ""}
                onChange={handleChange}
                className="w-12 p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Telefone</label>
              <input
                name="numero"
                value={form.telefone?.numero || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="col-span-2 text-right mt-4">
            <button
              type="submit"
              className="bg-[#19506e] text-white py-2 px-4 rounded hover:bg-[#153f59]"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
