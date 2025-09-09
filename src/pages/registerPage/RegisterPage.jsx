import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button"; 
import { Label } from "./ui/Label";

function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    dataNascimento: '',
    senha: '',
    confirmarSenha: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Função para formatar CPF
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para validar CPF
  const validateCPF = (cpf) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    // Validação do algoritmo do CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return digit1 === parseInt(numbers[9]) && digit2 === parseInt(numbers[10]);
  };

  // Função para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar senha
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validações
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      const birthDate = new Date(formData.dataNascimento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dataNascimento = 'Você deve ter pelo menos 18 anos';
      }
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (!validatePassword(formData.senha)) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Aqui você faria o cadastro do usuário
      console.log('Dados válidos:', formData);
      
      // Simular cadastro e envio de email de verificação
      try {
        // Simular chamada para API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirecionar para página de verificação de email
        window.location.href = '/email-verification';
        
      } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#19506e] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Crie sua conta</h1>
            <p className="text-white/80 text-lg">Junte-se à nossa plataforma de serviços</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-gray-700 font-medium">
                  Nome completo
                </Label>
                <Input 
                  id="nome" 
                  name="nome"
                  type="text" 
                  placeholder="Digite seu nome completo" 
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:bg-white ${
                    errors.nome ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#19506e]'
                  }`}
                />
                {errors.nome && <span className="text-red-500 text-sm block mt-1">{errors.nome}</span>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  E-mail
                </Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="Digite seu e-mail" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:bg-white ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#19506e]'
                  }`}
                />
                {errors.email && <span className="text-red-500 text-sm block mt-1">{errors.email}</span>}
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-gray-700 font-medium">
                  CPF
                </Label>
                <Input 
                  id="cpf" 
                  name="cpf"
                  type="text" 
                  placeholder="000.000.000-00" 
                  value={formData.cpf}
                  onChange={handleInputChange}
                  maxLength="14"
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:bg-white ${
                    errors.cpf ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#19506e]'
                  }`}
                />
                {errors.cpf && <span className="text-red-500 text-sm block mt-1">{errors.cpf}</span>}
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label htmlFor="dataNascimento" className="text-gray-700 font-medium">
                  Data de nascimento
                </Label>
                <Input 
                  id="dataNascimento" 
                  name="dataNascimento"
                  type="date" 
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:bg-white ${
                    errors.dataNascimento ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#19506e]'
                  }`}
                />
                {errors.dataNascimento && <span className="text-red-500 text-sm block mt-1">{errors.dataNascimento}</span>}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-gray-700 font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Input 
                    id="senha" 
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crie uma senha (mín. 6 caracteres)" 
                    value={formData.senha}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:bg-white ${
                      errors.senha ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#19506e]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#19506e] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.senha && <span className="text-red-500 text-sm block mt-1">{errors.senha}</span>}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha" className="text-gray-700 font-medium">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Input 
                    id="confirmarSenha" 
                    name="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha" 
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:bg-white ${
                      errors.confirmarSenha ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#19506e]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#19506e] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmarSenha && <span className="text-red-500 text-sm block mt-1">{errors.confirmarSenha}</span>}
              </div>

              {/* Botão de Cadastro */}
              <Button 
                type="submit"
                className="w-full bg-[#19506e] text-white font-semibold py-4 px-6 rounded-lg hover:bg-[#144a5e] transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Criar Conta
              </Button>

              {/* Link para Login */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Já tem uma conta? 
                  <Link to="/login" className="text-[#19506e] font-semibold hover:underline ml-1">
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;