import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiClock, FiEye, FiUsers, FiStar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { FaAngleDown } from "react-icons/fa";
import { niveisUrgencia, filtrarServicos, ordenarServicos } from '../../data/mockServicos';
import { obterOpcoesCategoriaComIcones } from '../../data/mockCategorias';
import ServiceDetailModal from '../../components/ui/ServiceDetailModal';
import PropostaModal from '../../components/ui/PropostaModal';
import { listAnunciosApi, listCategoriasApi } from '../../services/apiClient';
import { mapAnunciosToFrontend } from '../../services/anuncioMapper';
import { useAuth } from '../../context/AuthContext';

function InicioPage() {
  const { usuario } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [servicosCarregados, setServicosCarregados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [categoriasBackend, setCategoriasBackend] = useState([]);
  const [filtros, setFiltros] = useState({
    busca: '',
    categoria: '',
    urgencia: 'todas',
    valorMinimo: '',
    valorMaximo: ''
  });
  const [ordenacao, setOrdenacao] = useState('mais_recente');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [modalPropostaAberto, setModalPropostaAberto] = useState(false);
  const [servicoParaProposta, setServicoParaProposta] = useState(null);

  // Categorias centralizadas (fallback para mock)
  const categoriasMock = obterOpcoesCategoriaComIcones(true);
  
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

  // Usar categorias do backend se disponíveis, senão usar mock
  const categorias = categoriasBackend.length > 0 
    ? categoriasBackend.map(cat => ({
        value: cat.id?.toString() || cat.slug || '',
        label: cat.nome || '',
        id: cat.id,
        slug: cat.slug
      }))
    : categoriasMock;

  // Carregar anúncios do backend
  useEffect(() => {
    const carregarAnuncios = async () => {
      try {
        setCarregando(true);
        // Mapear ordenação do frontend para o backend
        const orderMap = {
          'mais_recente': 'recentes',
          'mais_antigo': 'antigos',
          'mais_visualizado': 'recentes', // backend não tem essa opção ainda
          'mais_propostas': 'recentes' // backend não tem essa opção ainda
        };
        
        const params = {
          tipo: 'oportunidade', // Por padrão, mostrar apenas oportunidades
          status: 'disponivel',
          order: orderMap[ordenacao] || 'recentes'
        };

        // Adicionar filtros se houver
        if (filtros.busca) {
          params.busca = filtros.busca;
        }
        
        // Mapear categoria para categoria_id
        if (filtros.categoria) {
          // Usar categoriasBackend se disponível, senão categoriasMock
          const catsToUse = categoriasBackend.length > 0 ? categoriasBackend : categoriasMock;
          const categoriaSelecionada = catsToUse.find(c => {
            if (categoriasBackend.length > 0) {
              // Se estamos usando categorias do backend, buscar por ID ou slug
              return c.id?.toString() === filtros.categoria || c.slug === filtros.categoria;
            } else {
              // Se estamos usando mock, buscar por value
              return c.value === filtros.categoria;
            }
          });
          
          if (categoriaSelecionada?.id) {
            params.categoria_id = categoriaSelecionada.id;
          } else if (!isNaN(parseInt(filtros.categoria))) {
            // Se for um número, usar diretamente
            params.categoria_id = parseInt(filtros.categoria);
          }
        }
        
        if (filtros.urgencia && filtros.urgencia !== 'todas') {
          params.urgencia = filtros.urgencia;
        }

        const response = await listAnunciosApi(params);
        const anunciosMapeados = mapAnunciosToFrontend(response.items || []);
        
        // Filtrar os próprios anúncios se estiver autenticado
        const anunciosFiltrados = usuario 
          ? anunciosMapeados.filter(anuncio => anuncio.cliente?.id !== usuario.id)
          : anunciosMapeados;
        
        setServicosCarregados(anunciosFiltrados);
        
        // Aplicar filtros locais (busca, categoria por nome, etc.)
        const servicosFiltrados = filtrarServicos(anunciosFiltrados, filtros);
        const servicosOrdenados = ordenarServicos(servicosFiltrados, ordenacao);
        setServicos(servicosOrdenados);
      } catch (error) {
        console.error('Erro ao carregar anúncios:', error);
        setServicos([]);
        setServicosCarregados([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarAnuncios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.busca, filtros.categoria, filtros.urgencia, ordenacao, categoriasBackend.length, usuario]);

  // Aplicar filtros locais quando necessário
  useEffect(() => {
    if (servicosCarregados.length > 0) {
      const servicosFiltrados = filtrarServicos(servicosCarregados, filtros);
      const servicosOrdenados = ordenarServicos(servicosFiltrados, ordenacao);
      setServicos(servicosOrdenados);
    }
  }, [filtros, ordenacao, servicosCarregados]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      busca: '',
      categoria: '',
      urgencia: 'todas',
      valorMinimo: '',
      valorMaximo: ''
    });
  };

  const abrirModal = (servico) => {
    setServicoSelecionado(servico);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setServicoSelecionado(null);
  };

  const abrirModalProposta = (servico) => {
    setServicoParaProposta(servico);
    setModalPropostaAberto(true);
  };

  const fecharModalProposta = () => {
    setModalPropostaAberto(false);
    setServicoParaProposta(null);
  };

  const handlePropostaSucesso = () => {
    // Recarregar os serviços para atualizar contadores
    // Isso será feito automaticamente pelo useEffect quando necessário
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgenciaIcon = (urgencia) => {
    return urgencia === 'alta' ? <FiAlertCircle /> : <FiCheckCircle />;
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Oportunidades de Trabalho
        </h1>
        <p className="text-gray-600">
          Encontre serviços que correspondem ao seu perfil profissional
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Serviços</p>
              <p className="text-2xl font-bold text-gray-900">{servicosCarregados.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disponíveis</p>
              <p className="text-2xl font-bold text-gray-900">{servicos.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiAlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgência Alta</p>
              <p className="text-2xl font-bold text-gray-900">
                {servicosCarregados.filter(s => s.urgencia === 'alta').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiUsers className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Propostas</p>
              <p className="text-2xl font-bold text-gray-900">
                {servicosCarregados.reduce((acc, s) => acc + (s.propostas || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 mt-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por título, descrição ou localização..."
                value={filtros.busca}
                onChange={(e) => handleFiltroChange('busca', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Botão de Filtros */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
              <FaAngleDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filtros Avançados */}
        {mostrarFiltros && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ordenação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenação
                </label>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="mais_recente">Mais Recente</option>
                  <option value="mais_antigo">Mais Antigo</option>
                  <option value="mais_visualizado">Mais Visualizado</option>
                  <option value="mais_propostas">Mais Propostas</option>
                </select>
              </div>
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={filtros.categoria}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categorias.map(categoria => (
                    <option key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgência
                </label>
                <select
                  value={filtros.urgencia}
                  onChange={(e) => handleFiltroChange('urgencia', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {niveisUrgencia.map(nivel => (
                    <option key={nivel.id} value={nivel.id}>
                      {nivel.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={limparFiltros}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {carregando && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FiSearch className="h-12 w-12 mx-auto animate-pulse" />
          </div>
          <p className="text-gray-500">Carregando anúncios...</p>
        </div>
      )}

      {/* Lista de Serviços */}
      {!carregando && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map(servico => (
          <div key={servico.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Imagem do Serviço */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={servico.imagens[0]}
                alt={servico.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getUrgenciaColor(servico.urgencia)}`}>
                  {getUrgenciaIcon(servico.urgencia)}
                  {servico.urgencia === 'alta' ? 'Urgente' : 'Normal'}
                </span>
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

              {/* Informações do Cliente */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-900">Publicado por:</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {servico.cliente.nome.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {servico.cliente.nome}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <FiClock className="h-4 w-4" />
                  <span>Prazo: {formatarData(servico.prazo)}</span>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Publicado em {formatarData(servico.dataPublicacao)}</span>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2">
                <button 
                  onClick={() => abrirModal(servico)}
                  className="flex-1 bg-[#2174a7] text-white py-2 px-4 rounded-lg hover:bg-[#416981] transition-colors font-medium"
                >
                  Ver Detalhes
                </button>
                <button 
                  onClick={() => abrirModalProposta(servico)}
                  className="px-4 py-2 bg-[#317e38] text-white border border-gray-300 rounded-lg hover:bg-[#3a6341] transition-colors font-medium"
                >
                  Proposta
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {!carregando && servicos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FiSearch className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum serviço encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Tente ajustar os filtros para encontrar mais oportunidades
          </p>
          <button
            onClick={limparFiltros}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Modal de Detalhes */}
      <ServiceDetailModal
        servico={servicoSelecionado}
        isOpen={modalAberto}
        onClose={fecharModal}
      />

      {/* Modal de Proposta */}
      <PropostaModal
        servico={servicoParaProposta}
        isOpen={modalPropostaAberto}
        onClose={fecharModalProposta}
        onSuccess={handlePropostaSucesso}
      />
    </div>
  );
}

export default InicioPage;