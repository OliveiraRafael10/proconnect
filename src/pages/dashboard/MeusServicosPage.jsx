import { useState, useRef, useEffect } from "react";
import { FiPlus, FiMapPin, FiClock, FiAlertCircle, FiCheckCircle, FiX, FiEdit, FiTrash2, FiEye, FiMessageSquare } from "react-icons/fi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { obterOpcoesCategoriaComIcones } from "../../data/mockCategorias";
import { listCategoriasApi, listPropostasApi, deletePropostaApi } from "../../services/apiClient";
import { useServicos } from "../../context/ServicosContext";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import PropostasModal from "../../components/ui/PropostasModal";
import EditarPropostaModal from "../../components/ui/EditarPropostaModal";
import { 
  listMeusAnunciosApi, 
  createAnuncioApi, 
  updateAnuncioApi, 
  deleteAnuncioApi,
  uploadAnuncioImageApi 
} from "../../services/apiClient";
import { mapAnunciosToFrontend, mapAnuncioToFrontend } from "../../services/anuncioMapper";

// Removido mock - agora usa dados do backend

// Componente Modal para Publicar/Editar Serviço
function PublicarServicoModal({ isOpen, onClose, servicoParaEditar, onServicoSalvo }) {
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

  const [opcoesCategoria, setOpcoesCategoria] = useState(obterOpcoesCategoriaComIcones());
  const [categoriasBackend, setCategoriasBackend] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const isEditando = !!servicoParaEditar;

  // Carregar categorias do backend
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const cats = await listCategoriasApi();
        setCategoriasBackend(cats);
        // Mapear categorias do backend para o formato esperado
        const catsMapeadas = cats.map(cat => ({
          value: cat.id?.toString() || cat.slug || '',
          label: cat.nome || '',
          id: cat.id,
          slug: cat.slug
        }));
        if (catsMapeadas.length > 0) {
          setOpcoesCategoria(catsMapeadas);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    carregarCategorias();
  }, []);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (isOpen) {
      if (servicoParaEditar) {
        setTitulo(servicoParaEditar.titulo || "");
        // Mapear categoria: pode ser nome ou categoria_id
        const categoriaValue = servicoParaEditar.categoria_id?.toString() || 
                              servicoParaEditar.categoria || "";
        setCategoria(categoriaValue);
        setDescricao(servicoParaEditar.descricao || "");
        setLocalizacao(servicoParaEditar.localizacao || "");
        setPrazo(servicoParaEditar.prazo || "");
        setUrgencia(servicoParaEditar.urgencia || "normal");
        setRequisitos(
          servicoParaEditar.requisitos && servicoParaEditar.requisitos.length > 0
            ? servicoParaEditar.requisitos
            : [""]
        );
        setImagens(servicoParaEditar.imagens || []);
      } else {
        // Limpar formulário para novo serviço
        setTitulo("");
        setCategoria("");
        setDescricao("");
        setLocalizacao("");
        setPrazo("");
        setUrgencia("normal");
        setRequisitos([""]);
        setImagens([]);
      }
    }
  }, [isOpen, servicoParaEditar]);

  const handleImagemChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Criar previews locais imediatamente
    const novasImagens = files.map((file) => {
      // Criar data URL para preview (será substituído por URL real no submit)
      return URL.createObjectURL(file);
    });
    
    setImagens((prev) => [...prev, ...novasImagens]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (salvando) return; // Prevenir múltiplos submits
    
    setSalvando(true);
    
    try {
      const requisitosLimpos = requisitos.filter(req => req.trim() !== "");
      
      // Mapear categoria (nome ou value) para categoria_id
      let categoriaId = null;
      if (categoria) {
        const categoriaEncontrada = opcoesCategoria.find(c => 
          c.value === categoria || c.id?.toString() === categoria || c.slug === categoria
        );
        if (categoriaEncontrada?.id) {
          categoriaId = categoriaEncontrada.id;
        } else if (!isNaN(parseInt(categoria))) {
          categoriaId = parseInt(categoria);
        } else {
          throw new Error("Categoria inválida");
        }
      }
      
      // Processar imagens: fazer upload de arquivos locais e manter URLs existentes
      const imagensProcessadas = [];
      
      for (const img of imagens) {
        if (img.startsWith('blob:')) {
          // É um preview local - precisa fazer upload
          // Buscar o arquivo original (armazenado temporariamente)
          // Por enquanto, vamos converter blob para data URL
          try {
            const response = await fetch(img);
            const blob = await response.blob();
            const reader = new FileReader();
            const dataUrl = await new Promise((resolve, reject) => {
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            imagensProcessadas.push(dataUrl);
          } catch (error) {
            console.error('Erro ao processar imagem:', error);
            // Pular esta imagem se houver erro
          }
        } else {
          // Já é uma URL (do backend ou externa)
          imagensProcessadas.push(img);
        }
      }
      
      const payload = {
        tipo: "oportunidade", // Por padrão, serviços são oportunidades
        categoria_id: categoriaId,
        titulo,
        descricao,
        localizacao,
        prazo,
        urgencia: urgencia === "baixa" ? "normal" : urgencia, // Backend só aceita normal/alta
        requisitos: requisitosLimpos,
        imagens: imagensProcessadas,
        status: servicoParaEditar?.status || "disponivel"
      };
      
      let resultado;
      if (isEditando) {
        resultado = await updateAnuncioApi(servicoParaEditar.id, payload);
      } else {
        resultado = await createAnuncioApi(payload);
      }
      
      // Verificar se o resultado tem a estrutura esperada
      // A API retorna o objeto diretamente (backend usa ok(data))
      const anuncioRetornado = resultado;
      
      if (!anuncioRetornado) {
        throw new Error("Resposta inválida do servidor");
      }
      
      // Mapear resultado do backend para formato do frontend
      const servicoData = mapAnuncioToFrontend(anuncioRetornado);
      
      if (!servicoData) {
        throw new Error("Erro ao processar resposta do servidor");
      }
      
      // Chamar callback para atualizar a lista
      if (onServicoSalvo) {
        onServicoSalvo(servicoData, isEditando);
      }
      
      setShowPopup(true);
    } catch (error) {
      console.error('Erro ao salvar anúncio:', error);
      alert(error.message || 'Erro ao salvar anúncio. Tente novamente.');
    } finally {
      setSalvando(false);
    }
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
                {isEditando ? <FiEdit className="w-6 h-6" /> : <FiPlus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isEditando ? "Editar Serviço" : "Publicar Novo Serviço"}
                </h2>
                <p className="text-blue-100 text-sm">
                  {isEditando ? "Atualize as informações do seu serviço" : "Preencha os dados do seu serviço"}
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
              
              {/* Área de Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#2174a7] hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group"
                onClick={abrirSeletorArquivos}
              >
                <input
                  ref={inputFileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagemChange}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2174a7] to-[#19506e] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <FiPlus className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      Adicionar Imagens
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Clique aqui ou arraste as imagens
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white rounded-lg hover:from-[#19506e] hover:to-[#2174a7] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium">
                      <FiPlus className="mr-1 w-4 h-4" />
                      Selecionar Arquivos
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    JPG, PNG, GIF • Máx. 10MB
                  </div>
                </div>
              </div>

              {/* Preview das Imagens */}
              {imagens.length > 0 && (
                <div className="mt-8">
                  {/* Header do Preview */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#2174a7] to-[#19506e] rounded-full flex items-center justify-center">
                        <FiEye className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Imagens Selecionadas
                        </h4>
                        <p className="text-sm text-gray-600">
                          {imagens.length} de 10 imagens
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => scrollCarousel("left")}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#2174a7] transition-all duration-200 shadow-sm"
                        title="Anterior"
                      >
                        <IoChevronBack className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollCarousel("right")}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#2174a7] transition-all duration-200 shadow-sm"
                        title="Próximo"
                      >
                        <IoChevronForward className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Grid de Imagens */}
                  <div
                    ref={carouselRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {imagens.map((imagem, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 bg-gray-100">
                          <img
                            src={imagem}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                            onClick={() => setVisualizarImagem(imagem)}
                          />
                        </div>
                        
                        {/* Overlay com ações */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVisualizarImagem(imagem);
                              }}
                              className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                              title="Visualizar"
                            >
                              <FiEye className="w-4 h-4 text-gray-700" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImagem(index);
                              }}
                              className="p-2 bg-red-500/90 hover:bg-red-600 rounded-lg transition-colors"
                              title="Remover"
                            >
                              <FiX className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Badge de posição */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Dicas de uso */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Dicas para melhores resultados:</p>
                        <ul className="text-xs space-y-1 text-blue-700">
                          <li>• Use imagens de alta qualidade e boa iluminação</li>
                          <li>• Mostre diferentes ângulos do que precisa ser feito</li>
                          <li>• Evite imagens muito pequenas ou borradas</li>
                        </ul>
                      </div>
                    </div>
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
                  disabled={salvando}
                  className="px-8 py-4 bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white font-semibold rounded-xl hover:from-[#19506e] hover:to-[#2174a7] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {salvando ? "Salvando..." : (isEditando ? "Salvar Alterações" : "Publicar Serviço")}
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
                {isEditando ? "Serviço Atualizado!" : "Serviço Publicado!"}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {isEditando 
                  ? "As alterações no seu serviço foram salvas com sucesso."
                  : "Seu serviço foi publicado com sucesso e já está disponível para os profissionais da plataforma."
                }
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
  const [meusServicos, setMeusServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { atualizarEstadoServicos } = useServicos();
  const [showModal, setShowModal] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);
  const [servicoExcluindo, setServicoExcluindo] = useState(null);
  const [loadingExclusao, setLoadingExclusao] = useState(false);
  const [modalPropostasAberto, setModalPropostasAberto] = useState(false);
  const [servicoParaPropostas, setServicoParaPropostas] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('servicos'); // 'servicos', 'propostas-recebidas' ou 'propostas'
  const [propostasEnviadas, setPropostasEnviadas] = useState([]);
  const [carregandoPropostas, setCarregandoPropostas] = useState(false);
  const [propostasRecebidas, setPropostasRecebidas] = useState([]);
  const [carregandoPropostasRecebidas, setCarregandoPropostasRecebidas] = useState(false);
  const [modalEditarPropostaAberto, setModalEditarPropostaAberto] = useState(false);
  const [propostaParaEditar, setPropostaParaEditar] = useState(null);
  const [propostaParaExcluir, setPropostaParaExcluir] = useState(null);
  const [loadingExclusaoProposta, setLoadingExclusaoProposta] = useState(false);
  const [ultimasPropostasContadas, setUltimasPropostasContadas] = useState(() => {
    // Carregar do localStorage na inicialização
    try {
      const saved = localStorage.getItem('ultimasPropostasContadas');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const { addNotification } = useNotification();

  // Função para carregar anúncios
  const carregarAnuncios = async () => {
    try {
      setCarregando(true);
      
      // Carregar contadores do localStorage para garantir que temos o estado mais recente
      let contadoresAtuais = {};
      try {
        const saved = localStorage.getItem('ultimasPropostasContadas');
        contadoresAtuais = saved ? JSON.parse(saved) : {};
      } catch (error) {
        console.error('Erro ao carregar contadores do localStorage:', error);
      }
      
      const response = await listMeusAnunciosApi();
      const anunciosMapeados = mapAnunciosToFrontend(response.items || []);
      
      // Carregar contagem de propostas para cada anúncio
      const anunciosComPropostas = await Promise.all(
        anunciosMapeados.map(async (anuncio) => {
          try {
            const propostasResponse = await listPropostasApi(anuncio.id);
            const quantidadePropostas = propostasResponse.items?.length || 0;
            
            // Verificar se há novas propostas e criar notificação
            const quantidadeAnterior = contadoresAtuais[anuncio.id] || 0;
            if (quantidadePropostas > quantidadeAnterior && quantidadeAnterior > 0) {
              const novasPropostas = quantidadePropostas - quantidadeAnterior;
              if (novasPropostas > 0) {
                console.log(`Nova proposta detectada! Anúncio ${anuncio.id}: ${quantidadeAnterior} -> ${quantidadePropostas}`);
                addNotification(
                  `Você recebeu ${novasPropostas} nova${novasPropostas > 1 ? 's' : ''} proposta${novasPropostas > 1 ? 's' : ''} para "${anuncio.titulo}"`,
                  'info',
                  0, // Não remove automaticamente
                  {
                    title: 'Nova proposta recebida!',
                    category: 'proposal',
                    anuncio_id: anuncio.id,
                    anuncio_titulo: anuncio.titulo
                  }
                );
              }
            }
            
            return {
              ...anuncio,
              propostas: quantidadePropostas
            };
          } catch (error) {
            console.error(`Erro ao carregar propostas do anúncio ${anuncio.id}:`, error);
            return {
              ...anuncio,
              propostas: 0
            };
          }
        })
      );
      
      // Atualizar contadores para próxima verificação
      const novosContadores = {};
      anunciosComPropostas.forEach(anuncio => {
        novosContadores[anuncio.id] = anuncio.propostas;
      });
      setUltimasPropostasContadas(novosContadores);
      
      // Salvar no localStorage para persistir entre recarregamentos
      try {
        localStorage.setItem('ultimasPropostasContadas', JSON.stringify(novosContadores));
      } catch (error) {
        console.error('Erro ao salvar contadores no localStorage:', error);
      }
      
      setMeusServicos(anunciosComPropostas);
    } catch (error) {
      console.error('Erro ao carregar meus anúncios:', error);
      setMeusServicos([]);
    } finally {
      setCarregando(false);
    }
  };

  // Carregar anúncios na montagem do componente
  useEffect(() => {
    carregarAnuncios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verificar novas propostas periodicamente (a cada 30 segundos)
  useEffect(() => {
    if (meusServicos.length === 0) return;
    
    const intervalId = setInterval(() => {
      carregarAnuncios();
    }, 30000); // 30 segundos
    
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meusServicos.length]);

  // Atualiza o contexto quando os serviços mudarem
  useEffect(() => {
    atualizarEstadoServicos(meusServicos.length > 0);
  }, [meusServicos, atualizarEstadoServicos]);

  // Carregar propostas enviadas
  const carregarPropostasEnviadas = async () => {
    try {
      setCarregandoPropostas(true);
      const response = await listPropostasApi(); // Sem anuncio_id, retorna propostas do usuário
      setPropostasEnviadas(response.items || []);
    } catch (error) {
      console.error('Erro ao carregar propostas enviadas:', error);
      setPropostasEnviadas([]);
    } finally {
      setCarregandoPropostas(false);
    }
  };

  // Carregar propostas recebidas para todos os anúncios
  const carregarPropostasRecebidas = async () => {
    try {
      setCarregandoPropostasRecebidas(true);
      
      // Buscar todos os meus anúncios
      const response = await listMeusAnunciosApi();
      const meusAnuncios = response.items || [];
      
      // Para cada anúncio, buscar suas propostas
      const todasPropostas = [];
      for (const anuncio of meusAnuncios) {
        try {
          const propostasResponse = await listPropostasApi(anuncio.id);
          const propostas = propostasResponse.items || [];
          
          // Adicionar informação do anúncio a cada proposta
          propostas.forEach(proposta => {
            todasPropostas.push({
              ...proposta,
              anuncio: {
                id: anuncio.id,
                titulo: anuncio.titulo,
                categoria: anuncio.categorias?.nome || 'Sem categoria'
              }
            });
          });
        } catch (error) {
          console.error(`Erro ao carregar propostas do anúncio ${anuncio.id}:`, error);
        }
      }
      
      // Ordenar por data (mais recentes primeiro)
      todasPropostas.sort((a, b) => {
        const dataA = new Date(a.criada_em || 0);
        const dataB = new Date(b.criada_em || 0);
        return dataB - dataA;
      });
      
      setPropostasRecebidas(todasPropostas);
    } catch (error) {
      console.error('Erro ao carregar propostas recebidas:', error);
      setPropostasRecebidas([]);
    } finally {
      setCarregandoPropostasRecebidas(false);
    }
  };

  // Carregar propostas quando a aba for ativada
  useEffect(() => {
    if (abaAtiva === 'propostas') {
      carregarPropostasEnviadas();
    } else if (abaAtiva === 'propostas-recebidas') {
      carregarPropostasRecebidas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abaAtiva]);
  
  // Recarregar anúncios após salvar
  const recarregarAnuncios = async () => {
    try {
      const response = await listMeusAnunciosApi();
      const anunciosMapeados = mapAnunciosToFrontend(response.items || []);
      
      // Carregar contagem de propostas para cada anúncio
      const anunciosComPropostas = await Promise.all(
        anunciosMapeados.map(async (anuncio) => {
          try {
            const propostasResponse = await listPropostasApi(anuncio.id);
            const quantidadePropostas = propostasResponse.items?.length || 0;
            
            return {
              ...anuncio,
              propostas: quantidadePropostas
            };
          } catch (error) {
            console.error(`Erro ao carregar propostas do anúncio ${anuncio.id}:`, error);
            return {
              ...anuncio,
              propostas: 0
            };
          }
        })
      );
      
      // Atualizar contadores
      const novosContadores = {};
      anunciosComPropostas.forEach(anuncio => {
        novosContadores[anuncio.id] = anuncio.propostas;
      });
      setUltimasPropostasContadas(novosContadores);
      
      // Salvar no localStorage
      try {
        localStorage.setItem('ultimasPropostasContadas', JSON.stringify(novosContadores));
      } catch (error) {
        console.error('Erro ao salvar contadores no localStorage:', error);
      }
      
      setMeusServicos(anunciosComPropostas);
    } catch (error) {
      console.error('Erro ao recarregar anúncios:', error);
    }
  };

  const abrirModalPropostas = (servico) => {
    setServicoParaPropostas(servico);
    setModalPropostasAberto(true);
  };

  const fecharModalPropostas = () => {
    setModalPropostasAberto(false);
    setServicoParaPropostas(null);
    // Recarregar anúncios para atualizar contadores
    recarregarAnuncios();
    // Recarregar propostas recebidas se estiver na aba correta
    if (abaAtiva === 'propostas-recebidas') {
      carregarPropostasRecebidas();
    }
  };

  const abrirModalEditarProposta = (proposta) => {
    setPropostaParaEditar(proposta);
    setModalEditarPropostaAberto(true);
  };

  const fecharModalEditarProposta = () => {
    setModalEditarPropostaAberto(false);
    setPropostaParaEditar(null);
    // Recarregar propostas enviadas
    if (abaAtiva === 'propostas') {
      carregarPropostasEnviadas();
    }
  };

  const handleExcluirProposta = (proposta) => {
    setPropostaParaExcluir(proposta);
  };

  const confirmarExclusaoProposta = async () => {
    if (!propostaParaExcluir) return;

    setLoadingExclusaoProposta(true);

    try {
      await deletePropostaApi(propostaParaExcluir.id);
      
      // Recarregar propostas enviadas
      await carregarPropostasEnviadas();
      
      // Fechar modal
      setPropostaParaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir proposta:", error);
      alert(error.message || "Erro ao excluir proposta. Tente novamente.");
    } finally {
      setLoadingExclusaoProposta(false);
    }
  };

  const cancelarExclusaoProposta = () => {
    setPropostaParaExcluir(null);
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

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleEditarServico = (servico) => {
    setServicoEditando(servico);
    setShowModal(true);
  };

  const handleServicoSalvo = async (servicoData, isEditando) => {
    // Recarregar anúncios do backend para garantir sincronização
    await recarregarAnuncios();
    
    // Fechar modal após um tempo
    setTimeout(() => {
      setShowModal(false);
      setServicoEditando(null);
    }, 2000);
  };

  const handleFecharModal = () => {
    setShowModal(false);
    setServicoEditando(null);
  };

  const handleExcluirServico = (servico) => {
    setServicoExcluindo(servico);
  };

  const confirmarExclusao = async () => {
    if (!servicoExcluindo) return;

    setLoadingExclusao(true);

    try {
      await deleteAnuncioApi(servicoExcluindo.id);
      
      // Recarregar lista do backend
      await recarregarAnuncios();
      
      // Fechar modal
      setServicoExcluindo(null);
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      alert(error.message || "Erro ao excluir anúncio. Tente novamente.");
    } finally {
      setLoadingExclusao(false);
    }
  };

  const cancelarExclusao = () => {
    setServicoExcluindo(null);
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
            {abaAtiva === 'servicos' && (
              <button
                onClick={() => setShowModal(true)}
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#2174a7] to-[#0e5b8b] text-white rounded-xl hover:from-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold">Publicar Serviço</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Abas de Navegação */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setAbaAtiva('servicos')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            abaAtiva === 'servicos'
              ? 'text-[#2174a7] border-[#2174a7]'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Meus Anúncios ({meusServicos.length})
        </button>
        <button
          onClick={() => setAbaAtiva('propostas-recebidas')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            abaAtiva === 'propostas-recebidas'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Propostas Recebidas ({meusServicos.reduce((total, servico) => total + (servico.propostas || 0), 0)})
        </button>
        <button
          onClick={() => setAbaAtiva('propostas')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            abaAtiva === 'propostas'
              ? 'text-[#317e38] border-[#317e38]'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Propostas Enviadas ({propostasEnviadas.length})
        </button>
      </div>

      {/* Conteúdo baseado na aba ativa */}
      {abaAtiva === 'servicos' ? (
        <>
          {/* Loading State */}
          {carregando && (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <FiCheckCircle className="h-12 w-12 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-500">Carregando seus anúncios...</p>
            </div>
          )}

          {/* Lista de Serviços ou Estado Vazio */}
          {!carregando && meusServicos.length === 0 ? (
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
      ) : !carregando ? (
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
                    onClick={() => handleExcluirServico(servico)}
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
                    onClick={() => abrirModalPropostas(servico)}
                    className="flex-1 bg-[#2174a7] text-white py-2 px-4 rounded-lg hover:bg-[#416981] transition-colors font-medium"
                  >
                    Ver Propostas {servico.propostas > 0 && `(${servico.propostas})`}
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
          ) : null}
        </>
      ) : abaAtiva === 'propostas' ? (
        <>
          {/* Seção de Propostas Enviadas */}
          {carregandoPropostas ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <FiCheckCircle className="h-12 w-12 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-500">Carregando suas propostas...</p>
            </div>
          ) : propostasEnviadas.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <FiMessageSquare className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Você ainda não enviou nenhuma proposta
              </h3>
              <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                Explore as oportunidades disponíveis na página "Início" e envie propostas para serviços que correspondem ao seu perfil profissional.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propostasEnviadas.map((proposta) => {
                const anuncio = proposta.anuncios || {};
                const categoria = anuncio.categorias || {};
                
                return (
                  <div key={proposta.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Header do Card */}
                    <div className="bg-gradient-to-r from-[#317e38] to-[#2a6b30] p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiMessageSquare className="w-5 h-5" />
                          <span className="font-semibold">Proposta Enviada</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          proposta.status === 'aceita' ? 'bg-green-500' :
                          proposta.status === 'recusada' ? 'bg-red-500' :
                          proposta.status === 'retirada' ? 'bg-gray-500' :
                          'bg-blue-500'
                        }`}>
                          {proposta.status === 'aceita' ? 'Aceita' :
                           proposta.status === 'recusada' ? 'Recusada' :
                           proposta.status === 'retirada' ? 'Retirada' :
                           'Pendente'}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-4">
                      {/* Informações do Serviço */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {anuncio.titulo || 'Serviço não encontrado'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {categoria.nome || 'Sem categoria'}
                        </p>
                      </div>

                      {/* Valor Proposto */}
                      {proposta.valor_proposto && (
                        <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 font-medium mb-1">Valor Proposto</p>
                          <p className="text-lg font-bold text-green-900">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(proposta.valor_proposto)}
                          </p>
                        </div>
                      )}

                      {/* Mensagem */}
                      {proposta.mensagem && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Mensagem</p>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {proposta.mensagem}
                          </p>
                        </div>
                      )}

                      {/* Data */}
                      <div className="mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FiClock className="w-3 h-3" />
                          <span>Enviada em {formatarData(proposta.criada_em)}</span>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-2">
                        {proposta.status === 'enviada' && (
                          <>
                            <button
                              onClick={() => abrirModalEditarProposta(proposta)}
                              className="flex-1 bg-[#2174a7] text-white py-2 px-4 rounded-lg hover:bg-[#416981] transition-colors font-medium text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleExcluirProposta(proposta)}
                              className="px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 transition-colors"
                              title="Excluir proposta"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {proposta.status !== 'enviada' && (
                          <div className="w-full text-center text-sm text-gray-500 py-2">
                            {proposta.status === 'aceita' && '✅ Proposta aceita pelo cliente'}
                            {proposta.status === 'recusada' && '❌ Proposta recusada'}
                            {proposta.status === 'retirada' && 'Proposta retirada'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : abaAtiva === 'propostas-recebidas' ? (
        <>
          {/* Seção de Propostas Recebidas */}
          {carregandoPropostasRecebidas ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <FiCheckCircle className="h-12 w-12 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-500">Carregando propostas recebidas...</p>
            </div>
          ) : propostasRecebidas.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <FiMessageSquare className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nenhuma proposta recebida ainda
              </h3>
              <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                Quando profissionais enviarem propostas para seus serviços, elas aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  Total de Propostas Recebidas: {propostasRecebidas.length}
                </h3>
                <p className="text-sm text-blue-700">
                  Você recebeu propostas para {new Set(propostasRecebidas.map(p => p.anuncio?.id)).size} serviço(s) diferente(s)
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {propostasRecebidas.map((proposta) => {
                  const profissional = proposta.usuarios || {};
                  const anuncio = proposta.anuncio || {};
                  
                  return (
                    <div key={proposta.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Header do Card */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={profissional.foto_url || '/perfil_sem_foto.png'} 
                              alt={profissional.nome || 'Profissional'}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white"
                            />
                            <div>
                              <h3 className="font-bold text-lg">{profissional.nome || 'Profissional'}</h3>
                              <p className="text-blue-100 text-sm">{profissional.email || ''}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            proposta.status === 'aceita' ? 'bg-green-500' :
                            proposta.status === 'recusada' ? 'bg-red-500' :
                            proposta.status === 'retirada' ? 'bg-gray-500' :
                            'bg-yellow-500'
                          }`}>
                            {proposta.status === 'aceita' ? 'Aceita' :
                             proposta.status === 'recusada' ? 'Recusada' :
                             proposta.status === 'retirada' ? 'Retirada' :
                             'Pendente'}
                          </span>
                        </div>
                      </div>

                      {/* Conteúdo do Card */}
                      <div className="p-6">
                        {/* Informações do Serviço */}
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Serviço</p>
                          <h4 className="font-semibold text-gray-900">{anuncio.titulo || 'Serviço'}</h4>
                          <p className="text-sm text-gray-600">{anuncio.categoria || ''}</p>
                        </div>

                        {/* Valor Proposto */}
                        {proposta.valor_proposto && (
                          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs text-green-700 font-medium mb-1">Valor Proposto</p>
                            <p className="text-xl font-bold text-green-900">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(proposta.valor_proposto)}
                            </p>
                          </div>
                        )}

                        {/* Mensagem */}
                        {proposta.mensagem && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Mensagem do Profissional</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                              {proposta.mensagem}
                            </p>
                          </div>
                        )}

                        {/* Data */}
                        <div className="mb-4 pb-4 border-b border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                          <FiClock className="w-4 h-4" />
                          <span>Recebida em {formatarData(proposta.criada_em)}</span>
                        </div>

                        {/* Botão para Ver Detalhes */}
                        <button
                          onClick={() => {
                            // Encontrar o serviço correspondente para abrir o modal
                            const servicoCorrespondente = meusServicos.find(s => s.id === anuncio.id);
                            if (servicoCorrespondente) {
                              abrirModalPropostas(servicoCorrespondente);
                            }
                          }}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium"
                        >
                          Ver Todas as Propostas deste Serviço
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : null}

      {/* Modal para Publicar/Editar Serviço */}
      <PublicarServicoModal 
        isOpen={showModal} 
        onClose={handleFecharModal}
        servicoParaEditar={servicoEditando}
        onServicoSalvo={handleServicoSalvo}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        isOpen={!!servicoExcluindo}
        onClose={cancelarExclusao}
        onConfirm={confirmarExclusao}
        title="Excluir Serviço"
        message="O serviço será removido permanentemente e não poderá ser recuperado."
        itemName={servicoExcluindo?.titulo}
        loading={loadingExclusao}
      />

      {/* Modal de Propostas */}
      <PropostasModal
        servico={servicoParaPropostas}
        isOpen={modalPropostasAberto}
        onClose={fecharModalPropostas}
      />

      {/* Modal de Editar Proposta */}
      <EditarPropostaModal
        proposta={propostaParaEditar}
        isOpen={modalEditarPropostaAberto}
        onClose={fecharModalEditarProposta}
        onSuccess={carregarPropostasEnviadas}
      />

      {/* Modal de Confirmação de Exclusão de Proposta */}
      <ConfirmDeleteModal
        isOpen={!!propostaParaExcluir}
        onClose={cancelarExclusaoProposta}
        onConfirm={confirmarExclusaoProposta}
        title="Excluir Proposta"
        message="Esta ação não pode ser desfeita. A proposta será removida permanentemente."
        itemName={propostaParaExcluir ? `proposta para "${propostaParaExcluir.anuncios?.titulo || 'serviço'}"` : ''}
        loading={loadingExclusaoProposta}
      />
    </div>
  );
}

export default MeusServicosPage;
