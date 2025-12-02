import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import perfilSemFoto from "../../assets/perfil_sem_foto.png";
import { 
  FiMapPin, 
  FiUser, 
  FiMessageCircle, 
  FiCheckCircle, 
  FiClock, 
  FiAward, 
  FiEye, 
  FiX, 
  FiFilter, 
  FiSearch,
  FiHome,
  FiScissors,
  FiTool,
  FiBook,
  FiHeart,
  FiSettings
} from "react-icons/fi";
import { FaStar, FaBriefcase, FaAngleDown } from "react-icons/fa";
import { BiHomeHeart, BiPaint } from "react-icons/bi";
import { MdCleaningServices, MdSchool } from "react-icons/md";
import ProfissionalDetailModal from "../../components/ui/ProfissionalDetailModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ContratarProfissionalModal from "../../components/ui/ContratarProfissionalModal";
import { useNotification } from "../../context/NotificationContext";
import { listProfissionaisApi, listCategoriasApi } from "../../services/apiClient";
import { mapProfissionaisToFrontend } from "../../services/profissionalMapper";
import { useDebounce } from "../../hooks/useDebounce";

export default function ProfissionaisPage() {
  const { success, error } = useNotification();
  const { usuario } = useAuth();
  const [selecionado, setSelecionado] = useState(null);
  const [listProfissionais, setProfissionais] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtros, setFiltros] = useState({
    categoria: "",
    localizacao: "",
    avaliacao: "",
    preco: "",
    disponibilidade: ""
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;
  
  // Debounce na busca para evitar muitas requisições
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState(null);
  const [showContratarModal, setShowContratarModal] = useState(false);
  const [profissionalParaContratar, setProfissionalParaContratar] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [categoriasBackend, setCategoriasBackend] = useState([]);

  // Categorias populares com ícones (definido antes dos useEffects)
  const categoriasPopulares = [
    { id: "limpeza", nome: "Limpeza", icone: MdCleaningServices, cor: "bg-blue-50 text-blue-600 border-blue-200" },
    { id: "jardinagem", nome: "Jardinagem", icone: FiHome, cor: "bg-green-50 text-green-600 border-green-200" },
    { id: "reformas", nome: "Reformas", icone: FiTool, cor: "bg-orange-50 text-orange-600 border-orange-200" },
    { id: "tecnologia", nome: "Tecnologia", icone: FiSettings, cor: "bg-purple-50 text-purple-600 border-purple-200" },
    { id: "aulas", nome: "Aulas Particulares", icone: MdSchool, cor: "bg-yellow-50 text-yellow-600 border-yellow-200" },
    { id: "bemestar", nome: "Bem Estar", icone: FiHeart, cor: "bg-pink-50 text-pink-600 border-pink-200" }
  ];

  // Carregar categorias do backend
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const cats = await listCategoriasApi();
        setCategoriasBackend(cats);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    carregarCategorias();
  }, []);

  // Carregar profissionais do backend (com debounce na busca)
  useEffect(() => {
    const carregarProfissionais = async () => {
      setLoading(true);
      try {
        // Busca profissionais com filtros
        const params = {
          page: page,
          page_size: pageSize
        };
        if (debouncedSearchQuery) params.busca = debouncedSearchQuery;
        
        // Mapear categoria: se for um ID das categorias populares, buscar o slug/nome correspondente
        if (filtros.categoria) {
          // Verificar se é uma categoria popular (por ID) ou se já é um slug/nome
          const categoriaPopular = categoriasPopulares.find(c => c.id === filtros.categoria);
          if (categoriaPopular) {
            // Buscar no backend por nome ou slug
            const categoriaBackend = categoriasBackend.find(c => 
              c.nome?.toLowerCase() === categoriaPopular.nome.toLowerCase() ||
              c.slug?.toLowerCase() === categoriaPopular.id.toLowerCase()
            );
            if (categoriaBackend) {
              params.categoria = categoriaBackend.slug || categoriaBackend.nome;
            } else {
              // Fallback: usar o nome da categoria popular
              params.categoria = categoriaPopular.nome;
            }
          } else {
            // Já é um slug/nome, usar diretamente
            params.categoria = filtros.categoria;
          }
        }
        
        if (filtros.localizacao) params.localizacao = filtros.localizacao;

        const response = await listProfissionaisApi(params);
        const profissionaisBackend = response.items || [];
        const totalItems = response.total || 0;

        // O backend já retorna avaliações e estatísticas agregadas
        // Mapear profissionais para o formato do frontend
        const avaliacoesMap = {};
        const estatisticasMap = {};
        
        profissionaisBackend.forEach(prof => {
          if (prof.avaliacoes) {
            avaliacoesMap[prof.id] = prof.avaliacoes;
          }
          if (prof.estatisticas) {
            estatisticasMap[prof.id] = prof.estatisticas;
          }
        });

        const profissionaisMapeados = mapProfissionaisToFrontend(profissionaisBackend, avaliacoesMap, estatisticasMap);
        
        // Filtrar o próprio perfil se estiver autenticado
        const profissionaisFiltrados = usuario 
          ? profissionaisMapeados.filter(prof => prof.id !== usuario.id)
          : profissionaisMapeados;
        
        setProfissionais(profissionaisFiltrados);
        setTotal(totalItems);
      } catch (err) {
        console.error('Erro ao carregar profissionais:', err);
        error("Erro ao carregar profissionais. Verifique sua conexão e tente novamente.");
        setProfissionais([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    carregarProfissionais();
  }, [debouncedSearchQuery, filtros.categoria, filtros.localizacao, page, categoriasBackend, usuario, error]);

  // Filtros profissionais (aplicados localmente após buscar do backend)
  const profissionaisFiltrados = useMemo(() => {
    let filtrados = listProfissionais;

    // Filtro por avaliação (aplicado localmente, pois já veio filtrado do backend)
    if (filtros.avaliacao) {
      const minAvaliacao = parseFloat(filtros.avaliacao);
      filtrados = filtrados.filter(profissional =>
        (profissional.workerProfile?.avaliacao || 0) >= minAvaliacao
      );
    }

    return filtrados;
  }, [listProfissionais, filtros.avaliacao]);

  const handleBuscar = useCallback((query) => {
    setSearchQuery(query);
    setPage(1); // Resetar página ao buscar
  }, []);
  
  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPage(1);
  }, [filtros.categoria, filtros.localizacao]);
  
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleVerPortfolio = useCallback((portfolio) => {
    setSelectedPortfolioImage(portfolio);
    setShowPortfolioModal(true);
  }, []);

  const handleVerPerfil = useCallback((profissional) => {
    setSelectedProfissional(profissional);
    setShowDetailModal(true);
  }, []);

  const handleContratar = useCallback((profissional) => {
    setProfissionalParaContratar(profissional);
    setShowContratarModal(true);
  }, []);

  const handleFecharContratarModal = useCallback(() => {
    setShowContratarModal(false);
    setProfissionalParaContratar(null);
  }, []);

  const handleContratacaoSucesso = useCallback(() => {
    // Pode recarregar dados ou mostrar mensagem
    success('Solicitação de contratação enviada com sucesso!');
  }, [success]);

  const handleFiltroChange = useCallback((campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  }, []);

  const handleCategoriaClick = useCallback((categoria) => {
    setCategoriaSelecionada(categoria.nome);
    setFiltros(prev => ({
      ...prev,
      categoria: categoria.id
    }));
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros({
      categoria: "",
      localizacao: "",
      avaliacao: "",
      preco: "",
      disponibilidade: ""
    });
    setSearchQuery("");
    setCategoriaSelecionada("");
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 w-4 h-4" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 w-4 h-4" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 w-4 h-4" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full">
        {/* Header com barra de busca */}
        <div className="bg-white shadow-lg border-b border-blue-100">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Barra de busca */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#2174a7] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Procure por serviço, profissional ou localização..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2174a7] focus:border-[#2174a7] transition-all duration-200 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categorias Populares */}
        <div className="bg-gradient-to-r from-white to-blue-50 border-b border-blue-100">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiSettings className="w-5 h-5 text-[#2174a7]" />
              Categorias Populares
            </h2>
            <div className="flex gap-3 overflow-x-auto p-2">
              {categoriasPopulares.map((categoria) => {
                const IconComponent = categoria.icone;
                const isSelected = categoriaSelecionada === categoria.nome;
                
                return (
                  <button
                    key={categoria.id}
                    onClick={() => handleCategoriaClick(categoria)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 min-w-[100px] transform hover:-translate-y-0.5 ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#2174a7] to-[#19506e] text-white border-[#2174a7] shadow-lg' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#2174a7] hover:shadow-md hover:text-[#2174a7]'
                    }`}
                  >
                    <IconComponent className={`w-7 h-7 ${isSelected ? 'text-white' : ''}`} />
                    <span className="text-xs font-semibold text-center leading-tight">{categoria.nome}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex gap-6 p-6">
          {/* Sidebar de filtros */}
          <div className={`w-80 bg-white rounded-2xl shadow-lg border border-blue-100 ${mostrarFiltros ? 'block' : 'hidden lg:block'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FiFilter className="w-5 h-5 text-[#2174a7]" />
                  Filtros
                </h3>
                <button
                  onClick={limparFiltros}
                  className="text-sm text-[#2174a7] hover:text-[#19506e] font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  Limpar
                </button>
              </div>

              {/* Categoria */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiSettings className="w-4 h-4 text-[#2174a7]" />
                  Categoria
                </h4>
                <div className="space-y-3">
                  {categoriasPopulares.map((categoria) => (
                    <label key={categoria.id} className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filtros.categoria === categoria.id}
                        onChange={(e) => handleFiltroChange('categoria', e.target.checked ? categoria.id : '')}
                        className="rounded border-gray-300 text-[#2174a7] focus:ring-[#2174a7] focus:ring-2"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{categoria.nome}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Localização */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiMapPin className="w-4 h-4 text-[#2174a7]" />
                  Localização
                </h4>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2174a7] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar localização"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2174a7] focus:border-[#2174a7] transition-all duration-200"
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium">
                    <span>0 km</span>
                    <span>50 km</span>
                  </div>
                </div>
                <label className="flex items-center mt-4 p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#2174a7] focus:ring-[#2174a7] focus:ring-2" />
                  <span className="ml-3 text-sm font-medium text-gray-700">Disponível para deslocamento</span>
                </label>
              </div>

              {/* Avaliação */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaStar className="w-4 h-4 text-[#2174a7]" />
                  Avaliação
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filtros.avaliacao === '4.5'}
                      onChange={(e) => handleFiltroChange('avaliacao', e.target.checked ? '4.5' : '')}
                      className="rounded border-gray-300 text-[#2174a7] focus:ring-[#2174a7] focus:ring-2"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">4.5 estrelas ou mais</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preço */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiAward className="w-4 h-4 text-[#2174a7]" />
                  Preço
                </h4>
                <label className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2174a7] focus:ring-[#2174a7] focus:ring-2"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Orçamento disponível</span>
                </label>
              </div>

              {/* Disponibilidade */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-[#2174a7]" />
                  Disponibilidade
                </h4>
                <label className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2174a7] focus:ring-[#2174a7] focus:ring-2"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Disponível agora</span>
                </label>
              </div>
            </div>
          </div>

          {/* Área principal - Lista de profissionais */}
          <div className="flex-1">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FaBriefcase className="w-8 h-8 text-[#2174a7]" />
                  Profissionais Disponíveis
                </h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
                  <FiUser className="w-4 h-4 text-[#2174a7]" />
                  <span className="text-sm font-semibold text-[#2174a7]">
                    {profissionaisFiltrados.length} encontrados
                  </span>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <LoadingSpinner size="xl" color="primary" />
                  <p className="text-gray-600 font-medium">Carregando profissionais...</p>
                </div>
              </div>
            )}

            {/* Grid de profissionais */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {profissionaisFiltrados.map((profissional) => (
                <div key={profissional.id} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start gap-5">
                    {/* Foto do profissional */}
                    <div className="flex-shrink-0 relative">
                      <img
                        src={profissional.foto_url || perfilSemFoto}
                        alt={profissional.nome}
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <FiCheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Informações do profissional */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-xl mb-2">{profissional.nome}</h3>
                      
                      {/* Avaliação */}
                      <div className="flex items-center gap-3 mb-3">
                        {profissional.workerProfile?.totalAvaliacoes > 0 ? (
                          <>
                            <div className="flex items-center gap-1">
                              {renderStars(profissional.workerProfile.avaliacao || 0)}
                            </div>
                            <span className="text-sm font-semibold text-gray-600">
                              {profissional.workerProfile.avaliacao?.toFixed(1) || '0.0'} ({profissional.workerProfile.totalAvaliacoes} avaliações)
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-gray-500">
                            Sem avaliações ainda
                          </span>
                        )}
                      </div>

                      {/* Especialidades */}
                      <p className="text-gray-600 text-sm mb-5 line-clamp-2 bg-gray-50 p-3 rounded-lg">
                        {profissional.workerProfile?.categorias?.join(", ") || "Profissional dedicado com experiência"}
                      </p>

                      {/* Botões de ação */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVerPerfil(profissional)}
                          className="flex-1 bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white px-6 py-3 rounded-xl hover:from-[#19506e] hover:to-[#2174a7] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                        >
                          Ver Perfil
                        </button>
                        <button
                          onClick={() => handleContratar(profissional)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                        >
                          Contratar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}

            {/* Estado vazio */}
            {!loading && profissionaisFiltrados.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FiUser className="w-12 h-12 text-[#2174a7]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhum profissional encontrado</h3>
                <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                  Tente ajustar os filtros ou termos de busca para encontrar mais profissionais disponíveis.
                </p>
                <button
                  onClick={limparFiltros}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white rounded-xl hover:from-[#19506e] hover:to-[#2174a7] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                >
                  <FiFilter className="w-5 h-5" />
                  Limpar Filtros
                </button>
              </div>
            )}
            
            {/* Controles de paginação */}
            {!loading && profissionaisFiltrados.length > 0 && total > pageSize && (
              <div className="flex items-center justify-center gap-4 mt-8 pb-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    page === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white hover:from-[#19506e] hover:to-[#2174a7] shadow-lg hover:shadow-xl'
                  }`}
                >
                  Anterior
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-semibold">
                    Página {page} de {Math.ceil(total / pageSize)}
                  </span>
                </div>
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    page >= Math.ceil(total / pageSize)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white hover:from-[#19506e] hover:to-[#2174a7] shadow-lg hover:shadow-xl'
                  }`}
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      {showDetailModal && selectedProfissional && (
        <ProfissionalDetailModal
          profissional={selectedProfissional}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onContratar={handleContratar}
        />
      )}

      {/* Modal de Contratar Profissional */}
      {showContratarModal && profissionalParaContratar && (
        <ContratarProfissionalModal
          profissional={profissionalParaContratar}
          isOpen={showContratarModal}
          onClose={handleFecharContratarModal}
          onSuccess={handleContratacaoSucesso}
        />
      )}
    </div>
  );
}