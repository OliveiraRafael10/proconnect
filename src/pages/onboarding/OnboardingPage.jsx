import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../registerPage/ui/Button";
import { Input } from "../registerPage/ui/Input";
import { Label } from "../registerPage/ui/Label";
import { useAuth } from "../../context/AuthContext";
import { buscarEnderecoPorCep, formatCep, normalizeCep } from "../../services/cepService";
import { saveOnboardingApi } from "../../services/apiClient";
import { dbToUi } from "../../services/userMapper";
import { FaUserTie } from "react-icons/fa6";
import { FaSearch, FaRegUser } from "react-icons/fa";
import { obterOpcoesCategoriaComIcones } from "../../data/mockCategorias";

function OnboardingPage() {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [profileData, setProfileData] = useState({
    phone: '',
    address: '',
    addressNumber: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    categoria: '',
    descricaoServicos: '',
    diasDisponibilidade: []
  });
  const [zipError, setZipError] = useState('');

  const totalSteps = userType === 'client' ? 3 : 4;

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
      const payload = {
        userType,
        phone: profileData.phone,
        zipCode: profileData.zipCode,
        address: profileData.address,
        addressNumber: profileData.addressNumber,
        neighborhood: profileData.neighborhood,
        city: profileData.city,
        state: profileData.state,
      };

      const response = await saveOnboardingApi(payload);
      const updatedProfile = response?.profile || response;

      const mapped = updatedProfile ? dbToUi(updatedProfile) : {};
      const usuarioBase = usuario ? { ...usuario, ...mapped } : { ...mapped };

      if (Object.keys(usuarioBase).length > 0) {
        setUsuario({
          ...usuarioBase,
          userType,
          onboardingCompleted: true,
          profileData: {
            ...profileData,
            completedAt: new Date().toISOString(),
          },
        });
      }

      // Redirecionar para o dashboard (página inicial)
      navigate('/dashboard/inicio');
      
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      alert(error?.message || 'Erro ao salvar configurações. Tente novamente.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDiasDisponibilidadeChange = (dia) => {
    setProfileData(prev => {
      const diasAtuais = prev.diasDisponibilidade;
      const novosDias = diasAtuais.includes(dia)
        ? diasAtuais.filter(d => d !== dia)
        : [...diasAtuais, dia];
      
      return {
        ...prev,
        diasDisponibilidade: novosDias
      };
    });
  };

  const handleZipCodeChange = async (e) => {
    const formatted = formatCep(e.target.value);
    const cepNumbers = normalizeCep(formatted);

    setProfileData(prev => ({
      ...prev,
      zipCode: formatted
    }));
    setZipError('');

    if (cepNumbers.length === 8) {
      try {
        const data = await buscarEnderecoPorCep(cepNumbers);
        setProfileData(prev => ({
          ...prev,
          zipCode: formatCep(data.cep),
          address: data.logradouro || prev.address,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.cidade || prev.city,
          state: data.estado || prev.state
        }));
      } catch (error) {
        setZipError(error.message || 'Não foi possível buscar o CEP.');
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <FaRegUser className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Bem-vindo ao ProConnect!</h1>
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
                      <FaSearch className="w-6 h-6 text-blue-600" />
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
                      <FaUserTie className="w-6 h-6 text-green-600" />
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
                <Label htmlFor="zipCode" className="text-gray-700 font-medium">
                  CEP
                </Label>
                <Input 
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  placeholder="00000-000"
                  value={profileData.zipCode}
                  onChange={handleZipCodeChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                />
                {zipError && (
                  <p className="text-sm text-red-500 mt-2">{zipError}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-gray-700 font-medium">
                    Rua
                  </Label>
                  <Input 
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Rua, avenida, bairro"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="addressNumber" className="text-gray-700 font-medium">
                    Número
                  </Label>
                  <Input 
                    id="addressNumber"
                    name="addressNumber"
                    type="text"
                    placeholder="123"
                    value={profileData.addressNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
               <div>
                  <Label htmlFor="neighborhood" className="text-gray-700 font-medium">
                    Bairro
                  </Label>
                  <Input 
                    id="neighborhood"
                    name="neighborhood"
                    type="text"
                    placeholder="Seu bairro"
                    value={profileData.neighborhood}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          const diasSemana = [
            { value: 'segunda', label: 'Segunda-feira' },
            { value: 'terca', label: 'Terça-feira' },
            { value: 'quarta', label: 'Quarta-feira' },
            { value: 'quinta', label: 'Quinta-feira' },
            { value: 'sexta', label: 'Sexta-feira' },
            { value: 'sabado', label: 'Sábado' },
            { value: 'domingo', label: 'Domingo' }
          ];

          const opcoesCategoria = obterOpcoesCategoriaComIcones(false);

          return (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Seu Perfil Profissional</h1>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="categoria" className="text-gray-700 font-medium">
                    Categorias de Serviços *
                  </Label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={profileData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
                    required
                  >
                    <option value="">Selecione suas áreas de atuação...</option>
                    {opcoesCategoria.map(opcao => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="descricaoServicos" className="text-gray-700 font-medium">
                    Descrição dos Serviços *
                  </Label>
                  <textarea
                    id="descricaoServicos"
                    name="descricaoServicos"
                    rows={4}
                    placeholder="Descreva os serviços que você oferece, suas especialidades e como pode ajudar os clientes..."
                    value={profileData.descricaoServicos}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 resize-none"
                    required
                  />
                </div>
                
                <div>
                  <Label className="text-gray-700 font-medium">
                    Dias de Disponibilidade *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {diasSemana.map(dia => (
                      <label key={dia.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.diasDisponibilidade.includes(dia.value)}
                          onChange={() => handleDiasDisponibilidadeChange(dia.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{dia.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          // Para clientes, o passo 3 é o passo final (antes era passo 4)
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
                  <li>• Explore os serviços disponíveis</li>
                  <li>• Encontre profissionais qualificados</li>
                  <li>• Faça sua primeira contratação</li>
                </ul>
              </div>
            </div>
          );
        }

      case 4:
        // Este passo só existe para prestadores de serviço
        if (userType === 'provider') {
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
                  <li>• Complete seu portfólio</li>
                  <li>• Aguarde às propostas</li>
                  <li>• Comece a trabalhar</li>
                </ul>
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19506e] via-blue-300 to-blue-400 flex items-center justify-center p-4">
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
