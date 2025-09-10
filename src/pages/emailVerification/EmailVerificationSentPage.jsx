import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../registerPage/ui/Button";
import { Input } from "../registerPage/ui/Input";
import { Label } from "../registerPage/ui/Label";

function EmailVerificationSentPage() {
  const [email, setEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('idle'); // 'idle', 'sending', 'sent', 'error'

  const resendVerification = async () => {
    if (!email) return;
    
    setResendStatus('sending');
    
    try {
      // ========================================
      // SIMULAÇÃO - REMOVER EM PRODUÇÃO
      // ========================================
      // Simular envio de email por 1.5 segundos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ========================================
      // IMPLEMENTAÇÃO REAL - SUBSTITUIR SIMULAÇÃO
      // ========================================
      
      // 1. CHAMADA PARA API DE REENVIO
      // const response = await fetch('/api/auth/resend-verification', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Se necessário
      //   },
      //   body: JSON.stringify({ 
      //     email: email,
      //     type: 'email_verification',
      //     timestamp: new Date().toISOString()
      //   })
      // });
      
      // 2. VERIFICAR RESPOSTA DA API
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Erro ao reenviar email');
      // }
      
      // 3. PROCESSAR RESPOSTA DE SUCESSO
      // const data = await response.json();
      // console.log('Email reenviado:', data);
      
      // 4. VERIFICAR SE HÁ LIMITE DE REENVIOS
      // if (data.remainingAttempts !== undefined) {
      //   // Mostrar quantos reenvios restam
      //   console.log(`Reenvios restantes: ${data.remainingAttempts}`);
      // }
      
      // 5. VERIFICAR TEMPO DE ESPERA (rate limiting)
      // if (data.nextAttemptAt) {
      //   // Mostrar quando pode tentar novamente
      //   const nextAttempt = new Date(data.nextAttemptAt);
      //   console.log(`Próximo reenvio disponível em: ${nextAttempt.toLocaleString()}`);
      // }
      
      // ========================================
      // FIM DA IMPLEMENTAÇÃO REAL
      // ========================================
      
      // Simular sucesso (REMOVER EM PRODUÇÃO)
      setResendStatus('sent');
      
      setTimeout(() => {
        setResendStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      setResendStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Verifique seu email</h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-8">
            Enviamos um link de verificação para seu email. Clique no link para ativar sua conta.
          </p>

          {/* Email Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>Email enviado para:</strong><br />
              {email || 'seu-email@exemplo.com'}
            </p>
          </div>

          {/* Resend Section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Não recebeu o email?</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Digite seu email para reenviar
                </Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="seu-email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500"
                />
              </div>
              
              <Button
                onClick={resendVerification}
                disabled={!email || resendStatus === 'sending'}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendStatus === 'sending' ? 'Enviando...' : 'Reenviar Email'}
              </Button>
              
              {resendStatus === 'sent' && (
                <p className="text-green-600 text-sm">Email reenviado com sucesso!</p>
              )}
              
              {resendStatus === 'error' && (
                <p className="text-red-600 text-sm">Erro ao reenviar email. Tente novamente.</p>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-sm text-gray-600 mb-6">
            <p className="mb-2">Verifique também:</p>
            <ul className="text-left space-y-1">
              <li>• Sua caixa de spam/lixo eletrônico</li>
              <li>• Se o email foi digitado corretamente</li>
              <li>• Aguarde alguns minutos para o email chegar</li>
            </ul>
          </div>

          {/* Back to Login */}
          <div className="pt-4 border-t border-gray-200">
            <Link 
              to="/login" 
              className="text-blue-600 hover:underline font-medium"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationSentPage;
