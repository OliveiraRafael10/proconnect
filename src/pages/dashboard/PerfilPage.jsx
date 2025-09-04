import { useState } from "react";
import perfil_sem_foto from "../../assets/perfil_sem_foto.png";
import { useAuth } from "../../context/AuthContext";

export default function PerfilPage() {
  const { usuario, setUsuario } = useAuth();
  const [form, setForm] = useState(() => ({ ...usuario }));
  const [mensagem, setMensagem] = useState("");
  const [cep, setCep] = useState(form.endereco?.cep || "");
  const [loading, setLoading] = useState(false);
  const [erroCep, setErroCep] = useState(""); // novo estado para erro de CEP

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
    } else if (
      ["logradouro", "bairro", "cidade", "estado", "complemento"].includes(
        name
      )
    ) {
      setForm((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    setUsuario({ ...form, endereco: { ...form.endereco, cep } });
    setMensagem("Dados atualizados com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
  };

  const buscarEnderecoPorCep = async (valorCep) => {
    setLoading(true);
    setErroCep(""); // limpa mensagem de erro antes de buscar
    try {
      const response = await fetch(`https://viacep.com.br/ws/${valorCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          },
        }));
      } else {
        setErroCep("CEP não encontrado."); // mostra mensagem de erro
        setForm((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            logradouro: "",
            bairro: "",
            cidade: "",
            estado: "",
          },
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setErroCep("Erro ao buscar CEP.");
    } finally {
      setLoading(false);
    }
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

        {mensagem && (
          <div className="text-green-600 mb-4 font-medium">{mensagem}</div>
        )}

        <form
          onSubmit={handleSalvar}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Nome, apelido, email */}
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

          {/* Telefone */}
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

          {/* CEP */}
          <div>
            <label className="block text-sm font-medium">CEP</label>
            <div className="relative">
              <input
                name="cep"
                value={cep}
                onChange={(e) => {
                  let valor = e.target.value.replace(/\D/g, "");
                  if (valor.length > 8) valor = valor.slice(0, 8);

                  const formatado = valor.replace(/(\d{5})(\d)/, "$1-$2");
                  setCep(formatado);

                  if (valor.length === 8) {
                    buscarEnderecoPorCep(valor);
                  }
                }}
                className="w-full p-2 border rounded"
                placeholder="00000-000"
              />
              {loading && (
                <div className="absolute right-2 top-2">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
            {erroCep && (
              <div className="text-red-600 mt-1 text-sm font-medium">
                {erroCep}
              </div>
            )}
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium">Logradouro</label>
            <input
              name="logradouro"
              value={form.endereco?.logradouro || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Bairro</label>
            <input
              name="bairro"
              value={form.endereco?.bairro || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Cidade</label>
            <input
              name="cidade"
              value={form.endereco?.cidade || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Estado</label>
            <input
              name="estado"
              value={form.endereco?.estado || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium">Complemento</label>
            <input
              name="complemento"
              value={form.endereco?.complemento || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Apartamento, bloco, ponto de referência..."
            />
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
