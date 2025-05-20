import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { CardContent } from "../../components/ui/CardContent";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button"; 
import { Label } from "./ui/Label";

function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#fdfcee] flex items-center justify-center">
      <Card className="bg-[#19506e] p-8 rounded-2xl w-[480px] shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Crie sua conta</h1>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="nome" className="text-white">Nome completo</Label>
            <Input id="nome" type="text" placeholder="Digite seu nome completo" className="rounded-full" />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="text-white">E-mail</Label>
            <Input id="email" type="email" placeholder="Digite seu e-mail" className="rounded-full" />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="cpf" className="text-white">CPF</Label>
            <Input id="cpf" type="text" placeholder="Digite seu CPF" className="rounded-full" />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="senha" className="text-white">Senha</Label>
            <Input id="senha" type="password" placeholder="Crie uma senha" className="rounded-full" />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="confirmarSenha" className="text-white">Confirmar senha</Label>
            <Input id="confirmarSenha" type="password" placeholder="Confirme sua senha" className="rounded-full" />
          </div>

          <button className="mt-4 bg-white text-[#19506e] font-bold py-2 px-4 rounded-full hover:bg-gray-100 transition">
            Cadastrar
          </button>

          <p className="text-sm text-center mt-4">
            já tem uma conta? <Link to="/login" className="text-white font-bold hover:underline">Entrar</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;