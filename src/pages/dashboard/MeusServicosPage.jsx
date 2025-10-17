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
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Publicar Novo Serviço
              </h2>
              <p className="text-gray-600 mt-1">Preencha os dados do seu serviço</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-8">
          
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Localização e Prazo */}
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

            {/* Urgência */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FiAlertCircle className="inline mr-1" />
                Nível de Urgência
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="baixa"
                    checked={urgencia === "baixa"}
                    onChange={(e) => setUrgencia(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-green-600">🟢 Baixa</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="normal"
                    checked={urgencia === "normal"}
                    onChange={(e) => setUrgencia(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-yellow-600">🟡 Normal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="alta"
                    checked={urgencia === "alta"}
                    onChange={(e) => setUrgencia(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-red-600">🔴 Alta</span>
                </label>
              </div>
            </div>

            {/* Requisitos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requisitos (Opcional)
              </label>
              <div className="space-y-2">
                {requisitos.map((requisito, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={requisito}
                      onChange={(e) => atualizarRequisito(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Requisito ${index + 1}`}
                    />
                    {requisitos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerRequisito(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={adicionarRequisito}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1" />
                  Adicionar requisito
                </button>
              </div>
            </div>

            {/* Upload de Imagens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens (Opcional)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
                  className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Adicionar Imagens
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Adicione fotos para ilustrar melhor o serviço desejado
                </p>
              </div>

              {/* Preview das Imagens */}
              {imagens.length > 0 && (
                <div className="mt-4 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => scrollCarousel("left")}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      <IoChevronBack />
                    </button>
                    <span className="text-sm text-gray-600">
                      {imagens.length} imagem(ns) selecionada(s)
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollCarousel("right")}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
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
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="pt-8 border-t border-gray-200 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Publicar Serviço
              </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Serviço Publicado!
            </h3>
            <p className="text-gray-600 mb-6">
              Seu serviço foi publicado com sucesso e já está disponível para os profissionais da plataforma.
            </p>
            <button
              onClick={fecharPopup}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continuar
            </button>
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
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                Meus Serviços
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie e acompanhe os serviços que você publicou na plataforma
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {meusServicos.map(servico => (
            <div key={servico.id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Header do Card com gradiente */}
              <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {servico.titulo}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                        {servico.categoria}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FiMapPin className="h-4 w-4" />
                        <span>{servico.localizacao.split(',')[0]}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getUrgenciaColor(servico.urgencia)}`}>
                      {getUrgenciaText(servico.urgencia)}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditarServico(servico)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Editar"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExcluirServico(servico.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Excluir"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {servico.descricao}
                </p>

                {/* Estatísticas com ícones */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FiClock className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 mb-1">Prazo</p>
                    <p className="text-sm font-semibold text-gray-900">{formatarData(servico.prazo)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FiEye className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 mb-1">Visualizações</p>
                    <p className="text-sm font-semibold text-gray-900">{servico.visualizacoes}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FiCheckCircle className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 mb-1">Propostas</p>
                    <p className="text-sm font-semibold text-gray-900">{servico.propostas}</p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Ver Propostas
                  </button>
                  <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold border border-gray-200">
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
