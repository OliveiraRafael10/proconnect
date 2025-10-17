// Página de Perfil com layout melhorado
import { useState, useCallback, useMemo } from "react";
import perfil_sem_foto from "../../assets/perfil_sem_foto.png";
import { useAuth } from "../../context/AuthContext";
import { useValidation } from "../../hooks/useValidation";
import { useLoading } from "../../hooks/useLoading";
import { useNotification } from "../../context/NotificationContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Toggle from "../../components/ui/Toggle";
import WorkerProfileForm from "../../components/WorkerProfileForm";
import { FiEdit3, FiEye, FiStar, FiMapPin, FiClock, FiX } from "react-icons/fi";
import { FaBriefcase, FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { updateMeApi, uploadProfilePhotoApi } from "../../services/apiClient";
import { dbToUi, uiToDb } from "../../services/userMapper";
import { buscarEnderecoPorCep as fetchCepAddress, formatCep, normalizeCep } from "../../services/cepService";

export default function PerfilPage() {
  const { usuario, setUsuario } = useAuth();
  const { success, error: showError } = useNotification();
  const { withLoading, isLoading } = useLoading();
  
  // Estados para controle de interface
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [editingWorkerProfile, setEditingWorkerProfile] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState(null);
  
  // Estado inicial do formulário
  const initialForm = useMemo(() => ({
    foto_url: usuario?.foto_url || "",
    nome: usuario?.nome || "",
    apelido: usuario?.apelido || "",
    email: usuario?.email || "",
    telefone: {
      ddd: usuario?.telefone?.ddd || "",
      numero: usuario?.telefone?.numero || ""
    },
    endereco: {
      cep: usuario?.endereco?.cep || "",
      logradouro: usuario?.endereco?.logradouro || "",
      numero: usuario?.endereco?.numero || "",
      bairro: usuario?.endereco?.bairro || "",
      cidade: usuario?.endereco?.cidade || "",
      estado: usuario?.endereco?.estado || "",
      complemento: usuario?.endereco?.complemento || ""
    },
  }), [usuario]);

  const [form, setForm] = useState(initialForm);
  const [cep, setCep] = useState(formatCep(initialForm.endereco?.cep || ""));

  // Função para formatar telefone
  const formatPhone = useCallback((value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{4})/, '$1-$2');
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === "ddd") {
      const dddValue = value.replace(/\D/g, '').slice(0, 2);
      setForm((prev) => ({
        ...prev,
        telefone: {
          ...prev.telefone,
          ddd: dddValue,
        },
      }));
    } else if (name === "numero" && e.target.closest('.telefone-container')) {
      // Apenas formata o telefone se estiver dentro do container de telefone
      const formattedPhone = formatPhone(value);
      setForm((prev) => ({
        ...prev,
        telefone: {
          ...prev.telefone,
          numero: formattedPhone,
        },
      }));
    } else if (["logradouro", "numero", "bairro", "cidade", "estado", "complemento"].includes(name)) {
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
  }, [formatPhone]);

  const handleSalvar = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      // Validações básicas
      if (!form.nome.trim()) {
        showError("Nome é obrigatório");
        return;
      }
      
      if (!form.email.trim()) {
        showError("Email é obrigatório");
        return;
      }
      
      await withLoading(async () => {
        const payload = uiToDb({
          ...form,
          endereco: { ...form.endereco, cep },
          // manter sem alteração de email no backend; apenas para UI
        });
        const updated = await updateMeApi(payload);
        const mapped = dbToUi(updated);
        // preserva email caso backend não retorne
        if (!mapped.email && form.email) mapped.email = form.email;
        setUsuario(prev => ({ ...prev, ...mapped }));
        setForm((prev) => ({ ...prev, ...mapped }));
        setCep(formatCep(mapped.endereco?.cep || ""));
        success("Dados atualizados com sucesso!");
      }, 'save');
      
    } catch (error) {
      showError("Erro ao salvar dados. Tente novamente.");
      console.error("Erro ao salvar:", error);
    }
  }, [form, cep, setUsuario, success, showError, withLoading]);

  const buscarEnderecoPorCep = useCallback(async (value) => {
    const cepNumbers = normalizeCep(value);
    if (!cepNumbers || cepNumbers.length !== 8) return;

    try {
      await withLoading(async () => {
        const data = await fetchCepAddress(cepNumbers);

        setForm((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.cidade || "",
            estado: data.estado || "",
            complemento: data.complemento || prev.endereco.complemento || "",
            cep: data.cep,
          },
        }));
        setCep(formatCep(data.cep));

        success("Endereço encontrado automaticamente!");
      }, "cep");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        showError("Erro de conexão. Verifique sua internet.");
        return;
      }
      showError(error.message || "Erro ao buscar CEP. Tente novamente.");
    }
  }, [withLoading, showError, success]);

  // Funções para gerenciar perfil de trabalhador
  const handleToggleWorker = useCallback(async (isWorker) => {
    try {
      await withLoading(async () => {
        const updated = await updateMeApi({ is_worker: isWorker });
        const mapped = dbToUi(updated);
        setUsuario(prev => ({ ...prev, ...mapped }));
        if (isWorker) {
          setShowWorkerForm(true);
          success("Perfil de trabalhador habilitado! Complete suas informações.");
        } else {
          success("Perfil de trabalhador desabilitado.");
        }
      }, 'toggle');
    } catch (error) {
      showError("Erro ao alterar perfil. Tente novamente.");
      console.error(error);
    }
  }, [setUsuario, success, showError, withLoading]);

  const handleSaveWorkerProfile = useCallback(async (workerData) => {
    try {
      await withLoading(async () => {
        const updated = await updateMeApi({ perfil_worker: workerData, is_worker: true });
        const mapped = dbToUi(updated);
        setUsuario(prev => ({ ...prev, ...mapped }));
        setShowWorkerForm(false);
        setEditingWorkerProfile(false);
        success("Perfil de trabalhador salvo com sucesso!");
      }, 'save');
    } catch (error) {
      showError("Erro ao salvar perfil. Tente novamente.");
      console.error(error);
    }
  }, [setUsuario, success, showError, withLoading]);

  const handleEditWorkerProfile = useCallback(() => {
    setEditingWorkerProfile(true);
    setShowWorkerForm(true);
  }, []);

  const handleCancelWorkerForm = useCallback(() => {
    setShowWorkerForm(false);
    setEditingWorkerProfile(false);
  }, []);

  // Função para obter dias de disponibilidade formatados
  const getDisponibilidadeText = useCallback(() => {
    if (!usuario?.workerProfile?.disponibilidade) return "Não definido";
    
    const dias = {
      segunda: "Seg",
      terca: "Ter", 
      quarta: "Qua",
      quinta: "Qui",
      sexta: "Sex",
      sabado: "Sáb",
      domingo: "Dom"
    };
    
    const diasSelecionados = Object.entries(usuario.workerProfile.disponibilidade)
      .filter(([_, selected]) => selected)
      .map(([dia, _]) => dias[dia]);
    
    return diasSelecionados.length > 0 ? diasSelecionados.join(", ") : "Não definido";
  }, [usuario?.workerProfile?.disponibilidade]);

  // Função para abrir modal do portfólio
  const handlePortfolioImageClick = useCallback((image) => {
    setSelectedPortfolioImage(image);
    setShowPortfolioModal(true);
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Seção de Informações Pessoais */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex gap-3">
            < FaUser className="w-6 h-6 text-[#19506e]" />
            <h3 className="text-xl font-bold mb-6 text-gray-800">Informações Pessoais</h3>
        </div>
        
        <form onSubmit={handleSalvar} className="space-y-6">
          {/* Foto e Informações Básicas */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Foto do perfil */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Foto do Perfil</h4>
                <div className="relative inline-block">
                  <img
                    src={form.foto_url || perfil_sem_foto}
                    alt="Foto do usuário"
                    className="w-38 h-38 rounded-full mx-auto mb-3 object-cover border-4 border-gray-200 cursor-pointer hover:opacity-80 transition"
                    onClick={() => setShowPhotoModal(true)} // abre modal ao clicar
                  />
                  {isLoading('photo') && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <LoadingSpinner size="sm" color="white" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="fotoInput"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      showError("Arquivo muito grande. Máximo 5MB.");
                      return;
                    }
                    if (!file.type.startsWith('image/')) {
                      showError("Apenas arquivos de imagem são permitidos.");
                      return;
                    }
                    try {
                      await withLoading(async () => {
                        const res = await uploadProfilePhotoApi(file);
                        const mapped = dbToUi(res.profile || {});
                        const fotoUrl = res.foto_url || mapped.foto_url || '';
                        setUsuario(prev => ({ ...prev, ...mapped, foto_url: fotoUrl }));
                        setForm(prev => ({ ...prev, foto_url: fotoUrl }));
                        success("Foto atualizada com sucesso!");
                      }, 'photo');
                    } catch (err) {
                      console.error(err);
                      showError("Falha ao enviar foto. Tente novamente.");
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('fotoInput').click()}
                  disabled={isLoading('photo')}
                  className="w-full"
                >
                  Alterar Foto
                </Button>
              </div>
            </div>

            {/* Informações básicas */}
            <div className="lg:col-span-3 space-y-4">
              {/* Nome e Apelido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                  required
                />
                <div className="w-4/5 min-w-66">
                  <Input
                    label="Apelido"
                    name="apelido"
                    value={form.apelido}
                    onChange={handleChange}
                    placeholder="Como gostaria de ser chamado"
                  />
                </div>
              </div>

              {/* Email e Telefone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="flex gap-2 telefone-container">
                    <div className="w-1/6">
                      <Input
                        name="ddd"
                        value={form.telefone.ddd}
                        onChange={handleChange}
                        placeholder="11"
                        className="w-20"
                        maxLength={2}
                      />
                    </div>
                    <Input
                      name="numero"
                      value={form.telefone.numero}
                      onChange={handleChange}
                      placeholder="99999-9999"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="border-t pt-6">
            <div className="flex gap-3">
                < FaHouse className="w-6 h-6 text-[#19506e]" />
                <h3 className="text-xl font-bold mb-6 text-gray-800">Endereço</h3>
            </div>
            
            {/* CEP */}
            <div className="w-1/6 mb-4 min-w-30">
              <Input
                label="CEP"
                name="cep"
                value={cep}
                onChange={(e) => {
                  const formattedCep = formatCep(e.target.value);
                  setCep(formattedCep);
                  const cepNumbers = normalizeCep(formattedCep);
                  if (cepNumbers.length === 8) {
                    buscarEnderecoPorCep(cepNumbers);
                  }
                }}
                placeholder="00000-000"
                loading={isLoading('cep')}
              />
            </div>

            {/* Logradouro e Número */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <Input
                  label="Logradouro"
                  name="logradouro"
                  value={form.endereco.logradouro}
                  onChange={handleChange}
                  placeholder="Rua, Avenida, etc."
                />
              </div>
              <div className="w-1/4">
                <Input
                  label="Número"
                  name="numero"
                  value={form.endereco.numero}
                  onChange={handleChange}
                  placeholder="123"
                />
              </div>
            </div>

            {/* Bairro, Cidade e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label="Bairro"
                name="bairro"
                value={form.endereco.bairro}
                onChange={handleChange}
                placeholder="Nome do bairro"
              />
              <Input
                label="Cidade"
                name="cidade"
                value={form.endereco.cidade}
                onChange={handleChange}
                placeholder="Nome da cidade"
              />
              <div className="w-1/4">
                <Input
                  label="Estado"
                  name="estado"
                  value={form.endereco.estado}
                  onChange={handleChange}
                  placeholder="UF"
                  maxLength={2}
                />
              </div>
            </div>

            {/* Complemento */}
            <div className="w-3/4">
              <Input
                label="Complemento"
                name="complemento"
                value={form.endereco.complemento}
                onChange={handleChange}
                placeholder="Apartamento, casa, etc."
              />
            </div>
          </div>

          {/* Botão de salvar */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              loading={isLoading('save')}
              disabled={isLoading('save')}
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>

      {/* Seção de Perfil de Trabalhador */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaBriefcase className="w-6 h-6 text-[#19506e]" />
            <h3 className="text-xl font-bold text-gray-900">Perfil de Trabalhador</h3>
          </div>
          {usuario?.isWorker && !showWorkerForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditWorkerProfile}
            >
              <FiEdit3 className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          )}
        </div>

        {/* Toggle para habilitar/desabilitar perfil de trabalhador */}
        <div className="mb-6">
          <Toggle
            checked={usuario?.isWorker || false}
            onChange={handleToggleWorker}
            label="Oferecer Serviços na Plataforma"
            description="Habilite para que outros usuários possam contratar seus serviços"
            disabled={isLoading('toggle')}
          />
        </div>

        {/* Formulário de trabalhador */}
        {showWorkerForm && (
          <div className="border-t pt-6">
            <WorkerProfileForm
              initialData={usuario?.workerProfile || {}}
              onSave={handleSaveWorkerProfile}
              onCancel={handleCancelWorkerForm}
              isEditing={editingWorkerProfile}
            />
          </div>
        )}

        {/* Visualização do perfil de trabalhador */}
        {usuario?.isWorker && !showWorkerForm && usuario?.workerProfile && (
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações básicas */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Categorias de Serviços</h4>
                  <div className="flex flex-wrap gap-2">
                    {usuario.workerProfile.categorias?.map((categoria, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#19506e] text-white text-sm rounded-full"
                      >
                        {categoria}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Descrição dos Serviços</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {usuario.workerProfile.descricao || "Não informado"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Experiência</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {usuario.workerProfile.experiencia || "Não informado"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Disponibilidade</h4>
                  <p className="text-gray-700 text-sm">
                    {getDisponibilidadeText()}
                  </p>
                </div>
              </div>

              {/* Informações de disponibilidade */}
              <div className="space-y-4">
                

                {/* Certificações */}

                {/* Portfólio */}
                {usuario.workerProfile.portfolio?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Portfólio</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {usuario.workerProfile.portfolio.slice(0, 16).map((item, index) => (
                        <div 
                          key={index} 
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                          onClick={() => handlePortfolioImageClick(item)}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = perfil_sem_foto;
                              e.target.alt = "Imagem não disponível";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {usuario.workerProfile.portfolio.length > 6 && (
                      <p className="text-xs text-gray-500 mt-2">
                        +{usuario.workerProfile.portfolio.length - 6} imagens
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Estatísticas do trabalhador */}
            <div className="border-t pt-6 mt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Estatísticas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <FiStar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">
                    {usuario.workerProfile.avaliacaoMedia || 0}
                  </p>
                  <p className="text-sm text-blue-700">Avaliação Média</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <FiEye className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">
                    {usuario.workerProfile.totalAvaliacoes || 0}
                  </p>
                  <p className="text-sm text-green-700">Total de Avaliações</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <FiMapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">
                    {usuario.workerProfile.raioAtendimento || 0}km
                  </p>
                  <p className="text-sm text-purple-700">Raio de Atendimento</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modal de visualização da foto de perfil */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop translúcido + blur leve */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            onClick={() => setShowPhotoModal(false)}
          />
          {/* Painel */}
          <div className="relative z-10 flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-3xl">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="absolute -top-3 -right-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow"
                aria-label="Fechar visualização"
              >
                <FiX className="w-6 h-6 text-gray-700" />
              </button>
              <img
                src={form.foto_url || perfil_sem_foto}
                alt="Foto ampliada"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl bg-black/5"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualização do portfólio */}
      {showPortfolioModal && selectedPortfolioImage && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop translúcido + blur leve */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            onClick={() => setShowPortfolioModal(false)}
          />
          {/* Painel */}
          <div className="relative z-10 flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="absolute -top-3 -right-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow"
                aria-label="Fechar visualização"
              >
                <FiX className="w-6 h-6 text-gray-700" />
              </button>
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {selectedPortfolioImage.name}
                </h3>
                <img
                  src={selectedPortfolioImage.url}
                  alt={selectedPortfolioImage.name}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = perfil_sem_foto;
                    e.target.alt = "Imagem não disponível";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
