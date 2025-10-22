import { useState, useRef, useEffect } from "react";
import { FiPlus, FiMapPin, FiClock, FiAlertCircle, FiCheckCircle, FiX, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { obterOpcoesCategoriaComIcones } from "../../data/mockCategorias";
import { useServicos } from "../../context/ServicosContext";

// Mock de serviços publicados pelo usuário
const meusServicosMock = [
  {
    id: 1,
    titulo: "Limpeza Residencial Completa",
    categoria: "Limpeza",
    descricao: "Preciso de uma limpeza completa na minha casa de 3 quartos, incluindo cozinha e banheiros.",
    localizacao: "Centro, Capivari-SP",
    prazo: "2024-01-15",
    urgencia: "normal",
    requisitos: ["Experiência com produtos de limpeza", "Disponibilidade nos finais de semana"],
    imagens: [],
    dataPublicacao: "2024-01-10",
    status: "disponivel",
    visualizacoes: 45,
    propostas: 12
  },
  {
    id: 2,
    titulo: "Organização de Home Office",
    categoria: "Organização",
    descricao: "Preciso organizar meu escritório em casa, incluindo arquivos e equipamentos eletrônicos.",
    localizacao: "Jardim América, Capivari-SP",
    prazo: "2024-01-20",
    urgencia: "baixa",
    requisitos: ["Conhecimento em organização", "Experiência com documentos"],
    imagens: [],
    dataPublicacao: "2024-01-12",
    status: "disponivel",
    visualizacoes: 28,
    propostas: 5
  }
];

// Componente Modal para Publicar Serviço
function PublicarServicoModal({ isOpen, onClose }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [urgencia, setUrgencia] = useState("normal");
  const [requisitos, setRequisitos] = useState([""]);
  const [imagens, setImagens] = useState([]);
  const [visualizarImagem, setVisualizarImagem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const inputFileRef = useRef(null);
  const carouselRef = useRef(null);

  const opcoesCategoria = obterOpcoesCategoriaComIcones();

  const handleImagemChange = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagens((prev) => [...prev, ...previewUrls]);
  };

  const handleRemoveImagem = (index) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const abrirSeletorArquivos = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const adicionarRequisito = () => {
    setRequisitos([...requisitos, ""]);
  };

  const removerRequisito = (index) => {
    if (requisitos.length > 1) {
      setRequisitos(requisitos.filter((_, i) => i !== index));
    }
  };

  const atualizarRequisito = (index, valor) => {
    const novosRequisitos = [...requisitos];
    novosRequisitos[index] = valor;
    setRequisitos(novosRequisitos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const requisitosLimpos = requisitos.filter(req => req.trim() !== "");
    
    const novoServico = {
      titulo,
      categoria,
      descricao,
      localizacao,
      prazo,
      urgencia,
      requisitos: requisitosLimpos,
      imagens,
      dataPublicacao: new Date().toLocaleDateString(),
      status: "disponivel"
    };
    
    console.log("Novo serviço:", novoServico);
    setShowPopup(true);
    
    // Limpar formulário
    setTitulo("");
    setCategoria("");
    setDescricao("");
    setLocalizacao("");
    setPrazo("");
    setUrgencia("normal");
    setRequisitos([""]);
    setImagens([]);
  };

  const fecharPopup = () => {
    setShowPopup(false);
    onClose();
  };

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-yellow-600 bg-yellow-100';
      case 'baixa': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgenciaText = (urgencia) => {
    switch (urgencia) {
      case 'alta': return 'Alta';
      case 'normal': return 'Normal';
      case 'baixa': return 'Baixa';
      default: return 'Normal';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2174a7] to-[#19506e] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Publicar Novo Serviço
                </h2>
                <p className="text-blue-100 text-sm">
                  Preencha os dados do seu serviço
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações Básicas */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiPlus className="w-5 h-5 text-[#2174a7]" />
                Informações Básicas
              </h3>
              
              <div className="space-y-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Título do Serviço *
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="Ex: Limpeza completa de casa"
                    required
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione a categoria</option>
                    {opcoesCategoria.map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição Detalhada *
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Descreva detalhadamente o serviço que você precisa..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Localização e Prazo */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-green-600" />
                Localização e Prazo
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline mr-1" />
                    Localização *
                  </label>
                  <input
                    type="text"
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Centro, Capivari-SP"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiClock className="inline mr-1" />
                    Prazo Desejado *
                  </label>
                  <input
                    type="date"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Urgência */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-purple-600" />
                Nível de Urgência
              </h3>
              
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="baixa"
                    checked={urgencia === "baixa"}
                    onChange={(e) => setUrgencia(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-green-600 font-medium">🟢 Baixa</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="normal"
                    checked={urgencia === "normal"}
                    onChange={(e) => setUrgencia(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-yellow-600 font-medium">🟡 Normal</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="alta"
                    checked={urgencia === "alta"}
                    onChange={(e) => setUrgencia(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-red-600 font-medium">🔴 Alta</span>
                </label>
              </div>
            </div>

            {/* Requisitos */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-[#2174a7]" />
                Requisitos (Opcional)
              </h3>
              
              <div className="space-y-3">
                {requisitos.map((requisito, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={requisito}
                      onChange={(e) => atualizarRequisito(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Requisito ${index + 1}`}
                    />
                    {requisitos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerRequisito(index)}
                        className="px-3 py-3 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={adicionarRequisito}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <FiPlus className="mr-2" />
                  Adicionar requisito
                </button>
              </div>
            </div>

            {/* Upload de Imagens */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiEye className="w-5 h-5 text-[#2174a7]" />
                Imagens (Opcional)
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={inputFileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagemChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={abrirSeletorArquivos}
                  className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                >
                  <FiPlus className="mr-2" />
                  Adicionar Imagens
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Adicione fotos para ilustrar melhor o serviço desejado
                </p>
              </div>

              {/* Preview das Imagens */}
              {imagens.length > 0 && (
                <div className="mt-6 relative">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => scrollCarousel("left")}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <IoChevronBack />
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                      {imagens.length} imagem(ns) selecionada(s)
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollCarousel("right")}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <IoChevronForward />
                    </button>
                  </div>
                  
                  <div
                    ref={carouselRef}
                    className="flex gap-4 overflow-x-auto pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {imagens.map((imagem, index) => (
                      <div key={index} className="relative flex-shrink-0">
                        <img
                          src={imagem}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => setVisualizarImagem(imagem)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImagem(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white font-semibold rounded-xl hover:from-[#19506e] hover:to-[#2174a7] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Publicar Serviço
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Preview de Imagem */}
      {visualizarImagem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-60 p-4">
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden">
            <button
              onClick={() => setVisualizarImagem(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 z-10"
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={visualizarImagem}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Popup de Sucesso */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-8 h-8" />
                </div>
              </div>
            </div>
            
            {/* Conteúdo */}
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Serviço Publicado!
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Seu serviço foi publicado com sucesso e já está disponível para os profissionais da plataforma.
              </p>
              <button
                onClick={fecharPopup}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white font-semibold rounded-xl hover:from-[#19506e] hover:to-[#2174a7] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principal
function MeusServicosPage() {
  const [meusServicos, setMeusServicos] = useState(meusServicosMock);
  const { atualizarEstadoServicos } = useServicos();
  const [showModal, setShowModal] = useState(false);

  // Atualiza o contexto quando os serviços mudarem
  useEffect(() => {
    atualizarEstadoServicos(meusServicos.length > 0);
  }, [meusServicos, atualizarEstadoServicos]);

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-yellow-600 bg-yellow-100';
      case 'baixa': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgenciaText = (urgencia) => {
    switch (urgencia) {
      case 'alta': return 'Alta';
      case 'normal': return 'Normal';
      case 'baixa': return 'Baixa';
      default: return 'Normal';
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleEditarServico = (servico) => {
    console.log("Editar serviço:", servico);
    // Implementar edição
  };

  const handleExcluirServico = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      setMeusServicos(meusServicos.filter(servico => servico.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-white min-h-screen">
      {/* Header com gradiente */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#2174a7] to-indigo-600 bg-clip-text text-transparent mb-3">
                Meus Serviços
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie e acompanhe os serviços que você publicou na plataforma
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#2174a7] to-[#0e5b8b] text-white rounded-xl hover:from-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">Publicar Serviço</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Serviços ou Estado Vazio */}
      {meusServicos.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Você ainda não publicou nenhum serviço
          </h3>
          <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            Comece sua jornada publicando seu primeiro serviço e conecte-se com profissionais qualificados da nossa plataforma.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FiPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            Publicar Meu Primeiro Serviço
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meusServicos.map(servico => (
            <div key={servico.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Imagem do Serviço */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                {servico.imagens && servico.imagens.length > 0 ? (
                  <img
                    src={servico.imagens[0]}
                    alt={servico.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <FiCheckCircle className="h-12 w-12 text-blue-300 mx-auto mb-2" />
                    <p className="text-sm text-blue-600 font-medium">Seu Serviço</p>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getUrgenciaColor(servico.urgencia)}`}>
                    {servico.urgencia === 'alta' ? <FiAlertCircle /> : <FiCheckCircle />}
                    {getUrgenciaText(servico.urgencia)}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={() => handleEditarServico(servico)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white rounded-lg transition-all duration-200 shadow-sm"
                    title="Editar"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExcluirServico(servico.id)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-white rounded-lg transition-all duration-200 shadow-sm"
                    title="Excluir"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-4">
                {/* Título e Categoria */}
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {servico.titulo}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-600 font-medium">
                      {servico.categoria}
                    </span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FiMapPin className="h-3 w-3" />
                      {servico.localizacao.split(',')[0]}
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {servico.descricao}
                </p>

                {/* Informações Adicionais */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FiClock className="h-4 w-4" />
                    <span>Prazo: {formatarData(servico.prazo)}</span>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FiEye className="h-4 w-4" />
                      <span>{servico.visualizacoes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-medium">
                      <FiCheckCircle className="h-4 w-4" />
                      <span>{servico.propostas} propostas</span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2">
                  <button 
                    className="flex-1 bg-[#2174a7] text-white py-2 px-4 rounded-lg hover:bg-[#416981] transition-colors font-medium"
                  >
                    Ver Propostas
                  </button>
                  <button 
                    onClick={() => handleEditarServico(servico)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Publicar Serviço */}
      <PublicarServicoModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}

export default MeusServicosPage;
