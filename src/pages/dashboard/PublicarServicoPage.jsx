import { useState, useRef } from "react";
import { FiPlus, FiMapPin, FiClock, FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { obterOpcoesCategoriaComIcones } from "../../data/mockCategorias";

function PublicarServicoPage() {
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

  // Obter opções de categoria com ícones
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
    
    // Filtrar requisitos vazios
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
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Publicar Novo Serviço</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Serviço *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  type="text"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Até o final da semana"
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

            {/* Botão de Envio */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Publicar Serviço
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Preview de Imagem */}
      {visualizarImagem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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

export default PublicarServicoPage;