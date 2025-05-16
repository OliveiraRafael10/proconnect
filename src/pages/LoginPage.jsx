import { Card } from "../components/ui/Card";
import { CardContent } from "../components/ui/CardContent";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button"; 
import { Label } from "../components/ui/label";
import { Link } from "react-router-dom";


function LoginPage() {

  return (
    <div className="min-h-screen bg-[#fdfcee] flex items-center justify-center">
      <Card className="p-8 rounded-2xl w-[480px] shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Bem-vindo</h1>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="emailCpf" className="text-white">E-mail ou CPF</Label>
            <Input id="emailCpf" type="text" placeholder="Digite seu e-mail ou CPF" className="rounded-full" />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="senha" className="text-white">Senha</Label>
            <Input id="senha" type="password" placeholder="Digite sua senha" className="rounded-full" />
          </div>

          <a
            href="#"
            className="text-xs text-right text-white underline hover:text-gray-200"
          >
            Esqueci minha senha
          </a>

          <hr className="border-t border-white my-4" />

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 bg-[#4285F4] text-white font-bold py-2 px-4 rounded-full">
              <img className="bg-white h-6 p-1 rounded-xl" src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
              Continue com o Google
            </button>

            <button className="flex items-center justify-center gap-2 bg-white text-[#19506e] border border-[#19506e] py-2 px-4 rounded-full">
              <img className="bg-[#3f98fd] h-6 p-0.5 rounded-xl" src="https://img.icons8.com/color/16/000000/facebook-new.png" alt="Facebook" />
              Continue com o Facebook
            </button>
          </div>

          <p className="text-sm text-center mt-6">
            não tem uma conta? <Link to="/register" className="text-white font-bold hover:underline">Cadastre-se</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
