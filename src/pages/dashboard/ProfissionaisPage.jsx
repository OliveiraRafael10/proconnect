import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import perfilSemFoto from "../../assets/perfil_sem_foto.png";
import { FiMapPin, FiUser, FiMessageCircle, FiCheckCircle, FiClock, FiAward, FiEye, FiX } from "react-icons/fi";
import { FaStar, FaBriefcase } from "react-icons/fa";
import SearchBar from "../../components/ui/SearchBar";
import FilterSelect from "../../components/ui/FilterSelect";
import Button from "../../components/ui/Button";
import ProfissionalDetailModal from "../../components/ui/ProfissionalDetailModal";
import { useNotification } from "../../context/NotificationContext";
import { profissionais } from "../../data/mockProfissionais";
import { obterOpcoesCategoria } from "../../data/mockCategorias";

export default function ProfissionaisPage() {
  const { success } = useNotification();
  const { usuario } = useAuth();
  const [selecionado, setSelecionado] = useState(null);
  const [listProfissionais, setProfissionais] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtros, setFiltros] = useState({
    categoria: "",
    localizacao: "",
    avaliacao: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState(null);

  // Usar dados do arquivo mockProfissionais.js
  const profissionaisMock = useMemo(() => profissionais, []);

  // Opções para os filtros baseadas nas categorias centralizadas
  const opcoesCategoria = useMemo(() => obterOpcoesCategoria(true), []);

  const opcoesLocalizacao = useMemo(() => [
    { value: "", label: "Todas as localizações" },
    { value: "capivari", label: "Capivari" },
    { value: "piracicaba", label: "Piracicaba" },
    { value: "itu", label: "Itu" },
    { value: "sorocaba", label: "Sorocaba" }
  ], []);

  const opcoesAvaliacao = useMemo(() => [
    { value: "", label: "Todas as avaliações" },
    { value: "4", label: "⭐ 4.0+" },
    { value: "4.5", label: "⭐ 4.5+" },
    { value: "5", label: "⭐ 5.0" }
  ], []);

  // Filtrar profissionais
  const profissionaisFiltrados = useMemo(() => {
    return profissionaisMock.filter(profissional => {
      // Verificar se é um trabalhador com perfil completo
      if (!profissional.isWorker || !profissional.workerProfile) return false;

      // Verificações de segurança para evitar erros
      if (!profissional.nome || !profissional.workerProfile.categorias || !profissional.workerProfile.descricao || !profissional.endereco) return false;

      const matchSearch = !searchQuery || 
        profissional.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profissional.workerProfile.categorias && profissional.workerProfile.categorias.some(cat => 
          cat.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        profissional.workerProfile.descricao.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategoria = !filtros.categoria || 
        (profissional.workerProfile.categorias && profissional.workerProfile.categorias.some(cat => 
          cat.toLowerCase().includes(filtros.categoria.toLowerCase())
        ));

      const matchLocalizacao = !filtros.localizacao || 
        (profissional.endereco.cidade && profissional.endereco.cidade.toLowerCase().includes(filtros.localizacao.toLowerCase()));

      const matchAvaliacao = !filtros.avaliacao || 
        (profissional.workerProfile.avaliacaoMedia && profissional.workerProfile.avaliacaoMedia >= parseFloat(filtros.avaliacao));
      
      return matchSearch && matchCategoria && matchLocalizacao && matchAvaliacao;
    });
  }, [searchQuery, filtros, profissionaisMock]);

  useEffect(() => {
    setProfissionais(profissionaisFiltrados);
    if (profissionaisFiltrados.length > 0 && !selecionado) {
      setSelecionado(profissionaisFiltrados[0]);
    }
  }, [profissionaisFiltrados, selecionado]);

  const handleContratar = useCallback((profissional) => {
    setLoading(true);
    setTimeout(() => {
      success(`Solicitação enviada para ${profissional.nome}!`);
      setLoading(false);
    }, 1000);
  }, [success]);

  const handleVerPortfolio = useCallback((imagem) => {
    setSelectedPortfolioImage(imagem);
    setShowPortfolioModal(true);
  }, []);

  const fecharPortfolioModal = useCallback(() => {
    setShowPortfolioModal(false);
    setSelectedPortfolioImage(null);
  }, []);

  const handleProfissionalClick = useCallback((profissional) => {
    setSelectedProfissional(profissional);
    setShowDetailModal(true);
  }, []);

  const fecharDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedProfissional(null);
  }, []);

  const renderDisponibilidade = (disponibilidade) => {
    if (!disponibilidade) return null;
    
    const dias = [
      { key: 'segunda', label: 'Seg' },
      { key: 'terca', label: 'Ter' },
      { key: 'quarta', label: 'Qua' },
      { key: 'quinta', label: 'Qui' },
      { key: 'sexta', label: 'Sex' },
      { key: 'sabado', label: 'Sáb' },
      { key: 'domingo', label: 'Dom' }
    ];

    return (
      <div className="flex gap-1">
        {dias.map((dia) => (
          <span
            key={dia.key}
            className={`px-2 py-1 rounded text-xs ${
              disponibilidade[dia.key]
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {dia.label}
          </span>
        ))}
      </div>
    );
  };
  
  const renderPortfolio = (portfolio) => {
    if (!portfolio || portfolio.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">Portfólio</h4>
        <div className="grid grid-cols-4 gap-2">
          {portfolio.slice(0, 16).map((item) => {
            // Verificação de segurança para o item do portfolio
            if (!item || !item.id || !item.url || !item.name) return null;
            
            return (
              <div
                key={item.id}
                className="relative group cursor-pointer"
                onClick={() => handleVerPortfolio(item)}
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-20 object-cover rounded-sm"
                  onError={(e) => {
                    e.target.src = perfilSemFoto;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <FiEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profissionais Disponíveis
          </h1>
          <p className="text-gray-600">
            Encontre o profissional ideal para seu serviço
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          {/* Search Bar - Mobile First */}
          <div className="mb-4 sm:mb-0 sm:w-1/2 sm:mr-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar profissionais..."
              className="w-full"
            />
          </div>
          
          {/* Filtros - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-2">
            <FilterSelect
              value={filtros.categoria}
              onChange={(value) => setFiltros(prev => ({ ...prev, categoria: value }))}
              options={opcoesCategoria}
              placeholder="Categoria"
              className="w-full"
            />
            <FilterSelect
              value={filtros.localizacao}
              onChange={(value) => setFiltros(prev => ({ ...prev, localizacao: value }))}
              options={opcoesLocalizacao}
              placeholder="Localização"
              className="w-full"
            />
            <FilterSelect
              value={filtros.avaliacao}
              onChange={(value) => setFiltros(prev => ({ ...prev, avaliacao: value }))}
              options={opcoesAvaliacao}
              placeholder="Avaliação"
              className="w-full sm:col-span-2 lg:col-span-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Lista de Profissionais */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  {profissionaisFiltrados.length} Profissionais Encontrados
                </h3>
              </div>
              <div className="max-h-150 overflow-y-auto smooth-scroll">
                {profissionaisFiltrados.map((profissional) => (
                  <div
                    key={profissional.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selecionado?.id === profissional.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      // Em mobile, abre o modal; em desktop, seleciona
                      if (window.innerWidth < 1024) {
                        handleProfissionalClick(profissional);
                      } else {
                        setSelecionado(profissional);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={profissional.foto_url || perfilSemFoto}
                        alt={profissional.nome}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = perfilSemFoto;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {profissional.nome}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {profissional.workerProfile.categorias.join(", ")}
                        </p>
                        <div className="flex items-center mt-1">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-xs text-gray-600 ml-1">
                            {profissional.workerProfile.avaliacaoMedia} ({profissional.workerProfile.totalAvaliacoes})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detalhes do profissional selecionado - Apenas Desktop */}
          <div className="hidden lg:block lg:col-span-2">
            {selecionado ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-6">
                    <img
                      src={selecionado.foto_url || perfilSemFoto}
                      alt={selecionado.nome}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selecionado.nome}
                        </h2>
                        <FiCheckCircle className="text-green-500" />
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <FiMapPin className="mr-1" />
                          {selecionado.endereco.cidade}, {selecionado.endereco.estado}
                        </div>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          {selecionado.workerProfile.avaliacaoMedia} ({selecionado.workerProfile.totalAvaliacoes} avaliações)
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selecionado.workerProfile.categorias.map((categoria, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {categoria}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Sobre</h3>
                      <p className="text-gray-600 mb-4">
                        {selecionado.workerProfile.descricao}
                      </p>
                      
                      <h3 className="font-semibold text-gray-900 mb-3">Experiência</h3>
                      <p className="text-gray-600 mb-4">
                        {selecionado.workerProfile.experiencia}
                      </p>

                      <h3 className="font-semibold text-gray-900 mb-3">Disponibilidade</h3>
                      {renderDisponibilidade(selecionado.workerProfile.disponibilidade)}
                    </div>

                    <div>
                      {renderPortfolio(selecionado.workerProfile.portfolio)}
                    </div>
                  </div>

                  {/* Botão Entrar em Contato */}
                  <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                    <Button
                      onClick={() => handleContratar(selecionado)}
                      loading={loading}
                      className="bg-[#317e38] hover:bg-[#2a6b30] text-white"
                    >
                      <FiMessageCircle className="mr-2" />
                      Entrar em Contato
                    </Button>
                  </div>

                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FaBriefcase className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione um profissional
                </h3>
                <p className="text-gray-600">
                  Escolha um profissional da lista para ver os detalhes
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Detalhes do Profissional */}
        <ProfissionalDetailModal
          profissional={selectedProfissional}
          isOpen={showDetailModal}
          onClose={fecharDetailModal}
          onContratar={handleContratar}
          loading={loading}
        />

        {/* Modal do Portfolio */}
        {showPortfolioModal && selectedPortfolioImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedPortfolioImage.name || 'Imagem do Portfolio'}
                </h3>
                <button
                  onClick={fecharPortfolioModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={selectedPortfolioImage.url}
                  alt={selectedPortfolioImage.name || 'Imagem do Portfolio'}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.target.src = perfilSemFoto;
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}