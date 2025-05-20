import { useState } from "react";
import { Input } from "../loginPage/ui/Input";
import { Button } from "../loginPage/ui/Button"; 
import { Label } from "../loginPage/ui/Label";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const handleSubmit = (e) => {
  e.preventDefault();

  // Aqui você pode pegar os dados do formulário com:
  const formData = new FormData(e.target);
  const emailCpf = formData.get("emailCpf");
  const senha = formData.get("senha");

  // Enviar para validação
  console.log({ emailCpf, senha });

  // Exemplo: fetch para autenticação
  /*
  fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ emailCpf, senha }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(data => {
    // redirecionar ou mostrar erro
  });
  */
};

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdfcee] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0a5483] p-8 rounded-2xl w-full max-w-md shadow-lg flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">Bem-vindo</h1>
        <div className="flex flex-col gap-1">
          <Label htmlFor="emailCpf" className="text-white">E-mail ou CPF</Label>
          <Input id="emailCpf" name="emailCpf" type="text" placeholder="Digite seu e-mail ou CPF" className="rounded-full" required />
        </div>

        <div className="flex flex-col gap-1 relative">
          <Label htmlFor="senha" className="text-white">Senha</Label>
          <Input id="senha" name="senha" type={showPassword ? "text" : "password"} placeholder="Digite sua senha" className="rounded-full" required />
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
          to="/esqueci-senha"
          className="text-xs text-right text-white no-underline hover:underline hover:text-gray-200"
        >
          Esqueci minha senha
        </Link>

        <Button
          type="submit"
          className="py-2 rounded-full mt-2 hover:bg-white hover:text-blue-900 "
        >
          Entrar
        </Button>

        <hr className="border-t border-white my-4" />

        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-2 bg-white text-[#4285F4] font-bold py-2 px-4 rounded-full hover:bg-[#4285F4] hover:text-white">
            <img className="bg-white h-6 p-1 rounded-xl" src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
            Continue com o Google
          </button>

          <button className="flex items-center justify-center gap-2 bg-[#3f98fd] text-white font-bold py-2 px-4 rounded-full hover:bg-white hover:text-[#3f98fd]">
            <img className="bg-[#3f98fd] h-6 p-0.5 rounded-xl" src="https://img.icons8.com/color/16/000000/facebook-new.png" alt="Facebook" />
            Continue com o Facebook
          </button>
        </div>

        <p className="text-sm text-center mt-6">
          não tem uma conta? <Link to="/register" className="text-white font-bold hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
