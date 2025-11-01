import { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button"; 
import { Label } from "./ui/Label";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/apiClient";
import { dbToUi } from "../../services/userMapper";
import { ROUTES } from "../../routes/ROUTES";
import { useAuth } from "../../context/AuthContext";


function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErro("");
    setIsSubmitting(true);
    try {
      const data = await loginApi(email, senha);
      const perfilDb = data?.profile;
      const perfil = perfilDb ? dbToUi(perfilDb) : { nome: data?.user?.email, email: data?.user?.email, endereco: {}, telefone: {} };
      login(perfil);
      navigate(ROUTES.INICIOPAGE);
    } catch (err) {
      setErro((err && err.message) || "Falha no login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19506e] via-blue-300 to-blue-400 flex items-center justify-center">
      <div className="w-full max-w-lg shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-[#0a5483] p-10 rounded-lg w-full max-w-lg shadow-lg flex flex-col gap-4 relative"
        >
          {/* Botão de Fechar */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Fechar e voltar para home"
          >
            <FaTimes size={24} />
          </button>
          
          <h1 className="text-3xl font-bold text-center text-white mb-6">Bem-vindo !</h1>
          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
          <div className="flex flex-col gap-1">
            <Label htmlFor="emailCpf" className="text-white">E-mail ou CPF</Label>
            <Input id="emailCpf" 
                  name="emailCpf" 
                  type="text" 
                  placeholder="Digite seu e-mail ou CPF" 
                  className="rounded-full" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
          </div>

          <div className="flex flex-col gap-1 relative">
            <Label htmlFor="senha" className="text-white">Senha</Label>
            <Input id="senha" 
                  name="senha" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Digite sua senha" 
                  className="rounded-full" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required 
                />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-11 right-2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <Link
            to="#"
            className="text-xs text-right text-white no-underline hover:underline hover:text-gray-200"
          >
            Esqueci minha senha
          </Link>

          <Button
            type="submit"
            className="py-2 rounded-full mt-2 hover:bg-white hover:text-blue-900 transition disabled:hover:bg-blue-600 disabled:hover:text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Conectando...
              </span>
            ) : (
              "Entrar"
            )}
          </Button>

          <hr className="border-t border-white my-4" />

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 bg-white text-[#4285F4] font-bold py-2 px-4 rounded-full hover:bg-[#4285F4] hover:text-white">
              <img className="bg-white h-6 p-1 rounded-xl" src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
              Continue com o Google
            </button>
          </div>

          <p className="text-sm text-center mt-6">
            não tem uma conta? <Link to={ROUTES.REGISTERPAGE} className="text-white font-bold hover:underline">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
