import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../registerPage/ui/Button";
import { Input } from "../registerPage/ui/Input";
import { Label } from "../registerPage/ui/Label";

function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [profileData, setProfileData] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bio: '',
    skills: [],
    availability: 'flexible'
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar onboarding
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Simular salvamento dos dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você salvaria os dados do onboarding
      console.log('Dados do onboarding:', { userType, ...profileData });
      
      // ========================================
      // IMPLEMENTAÇÃO REAL - SUBSTITUIR SIMULAÇÃO
      // ========================================
      // Aqui você faria a chamada para a API para salvar os dados do onboarding:
      // const response = await fetch('/api/user/onboarding', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   },
      //   body: JSON.stringify({
      //     userType,
      //     ...profileData
      //   })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Erro ao salvar dados do onboarding');
      // }
      // 
      // const data = await response.json();
      // console.log('Onboarding salvo:', data);
      
      // ========================================
      // FIM DA IMPLEMENTAÇÃO REAL
      // ========================================
      
      // Redirecionar para o dashboard (página inicial)
      navigate('/dashboard/inicio');
      
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bem-vindo ao Lance Fácil!</h1>
            <p className="text-gray-600 mb-8">Vamos configurar seu perfil para uma experiência personalizada.</p>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Como você pretende usar nossa plataforma?</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setUserType('client')}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                    userType === 'client' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900">Contratar Serviços</h4>
                    <p className="text-sm text-gray-600 mt-1">Busco profissionais para realizar serviços</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setUserType('provider')}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                    userType === 'provider' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900">Oferecer Serviços</h4>
                    <p className="text-sm text-gray-600 mt-1">Quero trabalhar como prestador de serviços</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Informações de Contato</h1>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Telefone
                </Label>
                <Input 
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="address" className="text-gray-700 font-medium">
                  Endereço
                </Label>
                <Input 
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Rua, número, bairro"
                  value={profileData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-gray-700 font-medium">
                    Cidade
                  </Label>
                  <Input 
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Sua cidade"
                    value={profileData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="state" className="text-gray-700 font-medium">
                    Estado
                  </Label>
                  <Input 
                    id="state"
                    name="state"
                    type="text"
                    placeholder="UF"
                    value={profileData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        if (userType === 'provider') {
          return (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Seu Perfil Profissional</h1>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio" className="text-gray-700 font-medium">
                    Biografia
                  </Label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="Conte um pouco sobre você e seus serviços..."
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 resize-none"
                  />
                </div>
                
                <div>
                  <Label htmlFor="skills" className="text-gray-700 font-medium">
                    Habilidades (separadas por vírgula)
                  </Label>
                  <Input 
                    id="skills"
                    name="skills"
                    type="text"
                    placeholder="Ex: Pintura, Encanamento, Elétrica"
                    value={profileData.skills.join(', ')}
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                      setProfileData(prev => ({ ...prev, skills }));
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="availability" className="text-gray-700 font-medium">
                    Disponibilidade
                  </Label>
                  <select
                    id="availability"
                    name="availability"
                    value={profileData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                  >
                    <option value="flexible">Flexível</option>
                    <option value="weekdays">Apenas dias úteis</option>
                    <option value="weekends">Apenas fins de semana</option>
                    <option value="evenings">Apenas noites</option>
                  </select>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Preferências de Serviço</h1>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="preferredServices" className="text-gray-700 font-medium">
                    Tipos de serviço que você procura
                  </Label>
                  <Input 
                    id="preferredServices"
                    name="preferredServices"
                    type="text"
                    placeholder="Ex: Limpeza, Manutenção, Reforma"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="budget" className="text-gray-700 font-medium">
                    Faixa de orçamento preferida
                  </Label>
                  <select
                    id="budget"
                    name="budget"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="low">Até R$ 100</option>
                    <option value="medium">R$ 100 - R$ 500</option>
                    <option value="high">R$ 500 - R$ 1000</option>
                    <option value="premium">Acima de R$ 1000</option>
                  </select>
                </div>
              </div>
            </div>
          );
        }

      case 4:
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Perfeito!</h1>
            <p className="text-gray-600 mb-8">
              Seu perfil está configurado. Agora você pode começar a usar nossa plataforma!
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Próximos passos:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {userType === 'client' ? (
                  <>
                    <li>• Explore os serviços disponíveis</li>
                    <li>• Encontre profissionais qualificados</li>
                    <li>• Faça sua primeira contratação</li>
                  </>
                ) : (
                  <>
                    <li>• Complete seu portfólio</li>
                    <li>• Responda às propostas</li>
                    <li>• Comece a trabalhar</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Passo {currentStep} de {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{width: `${(currentStep / totalSteps) * 100}%`}}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 && !userType}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === totalSteps ? 'Finalizar' : 'Continuar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
