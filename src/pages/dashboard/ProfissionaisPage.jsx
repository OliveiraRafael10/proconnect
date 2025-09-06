import { useEffect, useState, useCallback, useMemo } from "react";
import { profissionais } from "../../data/mockProfissionais";
import perfilSemFoto from "../../assets/perfil_sem_foto.png";
import { FiMapPin, FiUser, FiMessageCircle, FiCheckCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import SearchBar from "../../components/ui/SearchBar";
import FilterSelect from "../../components/ui/FilterSelect";
import Button from "../../components/ui/Button";
import { useNotification } from "../../context/NotificationContext";
import "./css/servicosPage.css"

export default function ProfissionaisPage() {
  const { success } = useNotification();
  const [selecionado, setSelecionado] = useState(null);
  const [listProfissionais, setProfissionais] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtros, setFiltros] = useState({
    funcao: "",
    localizacao: "",
    avaliacao: ""
  });
  const [loading, setLoading] = useState(false);

  // Opções para os filtros
  const opcoesFuncao = useMemo(() => [
    { value: "", label: "Todas as funções" },
    { value: "garcom", label: "Garçom" },
    { value: "pedreiro", label: "Pedreiro" },
    { value: "professor", label: "Professor" },
    { value: "manicure", label: "Manicure" },
    { value: "eletricista", label: "Eletricista" },
    { value: "mecanico", label: "Mecânico" }
  ], []);

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
    return profissionais.filter(profissional => {
      const matchSearch = !searchQuery || 
        profissional.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profissional.funcao.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchFuncao = !filtros.funcao || 
        profissional.funcao.toLowerCase().includes(filtros.funcao.toLowerCase());
      
      const matchLocalizacao = !filtros.localizacao || 
        profissional.localizacao.toLowerCase().includes(filtros.localizacao.toLowerCase());
      
      const matchAvaliacao = !filtros.avaliacao || 
        profissional.avaliacao_media >= parseFloat(filtros.avaliacao);
      
      return matchSearch && matchFuncao && matchLocalizacao && matchAvaliacao;
    });
  }, [searchQuery, filtros]);

  useEffect(() => {
    setProfissionais(profissionaisFiltrados);
    if (profissionaisFiltrados.length > 0 && !selecionado) {
      setSelecionado(profissionaisFiltrados[0]);
    }
  }, [profissionaisFiltrados, selecionado]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleContratar = useCallback(async (profissional) => {
    setLoading(true);
    try {
      // Simular processo de contratação
      await new Promise(resolve => setTimeout(resolve, 1000));
      success(`Solicitação enviada para ${profissional.nome}!`);
    } catch (error) {
      console.error("Erro ao contratar:", error);
    } finally {
      setLoading(false);
    }
  }, [success]);

  const handleMensagem = useCallback((profissional) => {
    success(`Redirecionando para conversa com ${profissional.nome}...`);
  }, [success]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header com busca e filtros */}
      <div className="bg-white shadow-lg p-6 border-b">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="w-full lg:w-96">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Buscar por nome ou função..."
              className="w-full"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <FilterSelect
              label="Função"
              name="funcao"
              value={filtros.funcao}
              onChange={(e) => handleFilterChange('funcao', e.target.value)}
              options={opcoesFuncao}
              placeholder="Todas as funções"
              className="min-w-[150px]"
            />
            
            <FilterSelect
              label="Localização"
              name="localizacao"
              value={filtros.localizacao}
              onChange={(e) => handleFilterChange('localizacao', e.target.value)}
              options={opcoesLocalizacao}
              placeholder="Todas as localizações"
              className="min-w-[150px]"
            />
            
            <FilterSelect
              label="Avaliação"
              name="avaliacao"
              value={filtros.avaliacao}
              onChange={(e) => handleFilterChange('avaliacao', e.target.value)}
              options={opcoesAvaliacao}
              placeholder="Todas as avaliações"
              className="min-w-[150px]"
            />
          </div>
        </div>
        
        {/* Contador de resultados */}
        <div className="mt-4 text-sm text-gray-600">
          {profissionaisFiltrados.length} profissional(is) encontrado(s)
          {searchQuery && ` para "${searchQuery}"`}
        </div>
      </div>

      <div className="flex flex-1 bg-gray-50">

        {/* Lista de Profissionais */}
        <aside className="w-1/3 border-r border-gray-200 overflow-y-auto">
          {listProfissionais.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FiUser className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum profissional encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {listProfissionais.map((profissional) => (
                <div
                  key={profissional.id_profissional}
                  onClick={() => setSelecionado(profissional)}
                  className={`
                    flex bg-white p-4 rounded-xl shadow-sm cursor-pointer 
                    transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                    ${selecionado?.id_profissional === profissional.id_profissional 
                      ? "ring-2 ring-[#19506e] bg-blue-50" 
                      : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="mr-3">
                    <img
                      src={profissional.avatar || perfilSemFoto}
                      alt={profissional.nome}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {profissional.funcao}
                      </h3>
                      <div className="flex items-center gap-1 ml-2">
                        <FaStar className="text-yellow-400 w-4 h-4" />
                        <span className="text-sm font-medium text-gray-700">
                          {profissional.avaliacao_media}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <FiUser className="text-gray-400 w-4 h-4" />
                      <span className="text-sm text-gray-600 truncate">
                        {profissional.nome}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <FiMapPin className="text-gray-400 w-4 h-4" />
                      <span className="text-sm text-gray-600 truncate">
                        {profissional.localizacao}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Detalhes do Profissional */}
        <main className="flex-1 p-6 overflow-y-auto">
          {selecionado ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={selecionado.avatar || perfilSemFoto} 
                    alt={selecionado.nome} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" 
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selecionado.nome}
                      </h2>
                      <p className="text-xl text-[#19506e] font-semibold mb-4">
                        {selecionado.funcao}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                      <FaStar className="text-yellow-400 w-5 h-5" />
                      <span className="text-lg font-bold text-gray-900">
                        {selecionado.avaliacao_media}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({selecionado.qtde_avaliacao} avaliações)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMapPin className="w-5 h-5" />
                      <span>{selecionado.localizacao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiUser className="w-5 h-5" />
                      <span>Profissional Verificado</span>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selecionado.resumo || "Profissional experiente e dedicado, pronto para atender suas necessidades com qualidade e pontualidade."}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleMensagem(selecionado)}
                      className="flex items-center gap-2"
                    >
                      <FiMessageCircle className="w-5 h-5" />
                      Enviar Mensagem
                    </Button>
                    
                    <Button
                      onClick={() => handleContratar(selecionado)}
                      loading={loading}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <FiCheckCircle className="w-5 h-5" />
                      Contratar Serviço
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <FiUser className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">Selecione um profissional</h3>
                <p>Escolha um profissional da lista para ver os detalhes</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
    
  );
}
