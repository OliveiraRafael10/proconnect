import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Input } from "../registerPage/ui/Input";
import { Button } from "../registerPage/ui/Button";
import { Label } from "../registerPage/ui/Label";

function EmailVerificationPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'expired'
  const [resendStatus, setResendStatus] = useState('idle'); // 'idle', 'sending', 'sent', 'error'
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      // ========================================
      // SIMULAÇÃO - REMOVER EM PRODUÇÃO
      // ========================================
      // Simular verificação de email por 5 segundos
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // ========================================
      // IMPLEMENTAÇÃO REAL - SUBSTITUIR SIMULAÇÃO
      // ========================================
      
      // 1. CHAMADA PARA API DE VERIFICAÇÃO
      // const response = await fetch(`/api/auth/verify-email/${verificationToken}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     token: verificationToken,
      //     timestamp: new Date().toISOString()
      //   })
      // });
      
      // 2. VERIFICAR RESPOSTA DA API
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Erro na verificação');
      // }
      
      // 3. PROCESSAR RESPOSTA DE SUCESSO
      // const data = await response.json();
      // console.log('Email verificado:', data);
      
      // 4. ATUALIZAR CONTEXTO DE AUTENTICAÇÃO (se necessário)
      // if (data.user) {
      //   // Atualizar dados do usuário no contexto
      //   updateUser({ ...data.user, emailVerified: true });
      // }
      
      // 5. SALVAR TOKEN DE AUTENTICAÇÃO (se retornado)
      // if (data.accessToken) {
      //   localStorage.setItem('accessToken', data.accessToken);
      // }
      
      // ========================================
      // FIM DA IMPLEMENTAÇÃO REAL
      // ========================================
      
      // Simular sucesso (REMOVER EM PRODUÇÃO)
      setVerificationStatus('success');
      
      // Redirecionar para onboarding após 3 segundos
      setTimeout(() => {
        navigate('/onboarding');
      }, 3000);
      
    } catch (error) {
      console.error('Erro na verificação:', error);
      setVerificationStatus('error');
    }
  };

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

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verificando seu email...</h1>
            <p className="text-gray-600">Aguarde enquanto confirmamos sua conta.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Email verificado com sucesso!</h1>
            <p className="text-gray-600 mb-6">Sua conta foi ativada. Redirecionando para o onboarding...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Erro na verificação</h1>
            <p className="text-gray-600 mb-6">O link de verificação é inválido ou expirou.</p>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reenviar email de verificação</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {renderContent()}
          
          {verificationStatus === 'error' && (
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-blue-600 hover:underline font-medium"
              >
                Voltar para o login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationPage;
