import { useState, useEffect } from 'react';
import { 
  FiX, 
  FiDollarSign, 
  FiFileText, 
  FiMapPin, 
  FiCalendar, 
  FiAlertCircle, 
  FiClock,
  FiCheck,
  FiCheckCircle,
  FiSend,
  FiInfo,
  FiHome,
  FiList
} from 'react-icons/fi';
import { createAnuncioApi } from '../../services/apiClient';
import { useNotification } from '../../context/NotificationContext';
import { listCategoriasApi } from '../../services/apiClient';

function ContratarProfissionalModal({ profissional, isOpen, onClose, onSuccess }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [prazo, setPrazo] = useState('');
  const [urgencia, setUrgencia] = useState('normal');
  const [requisitos, setRequisitos] = useState(['']);
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const { success, error: showError } = useNotification();

  useEffect(() => {
    if (isOpen) {
      // Carregar categorias
      const carregarCategorias = async () => {
        try {
          const cats = await listCategoriasApi();
          setCategorias(cats || []);
          // Tentar selecionar a primeira categoria do profissional, se houver
          if (profissional?.workerProfile?.categorias?.length > 0 && cats?.length > 0) {
            const primeiraCategoria = profissional.workerProfile.categorias[0];
            const categoriaEncontrada = cats.find(c => 
              c.nome?.toLowerCase() === primeiraCategoria.toLowerCase() ||
              c.slug?.toLowerCase() === primeiraCategoria.toLowerCase()
            );
            if (categoriaEncontrada) {
              setCategoriaId(categoriaEncontrada.id.toString());
            }
          }
        } catch (error) {
          console.error('Erro ao carregar categorias:', error);
        }
      };
      carregarCategorias();

      // Resetar formulário
      setTitulo('');
      setDescricao('');
      setLocalizacao('');
      setValorMin('');
      setValorMax('');
      setPrazo('');
      setUrgencia('normal');
      setRequisitos(['']);
      setErro('');
    }
  }, [isOpen, profissional]);

  if (!isOpen || !profissional) return null;

  const formatarMoeda = (valor) => {
    if (!valor) return '';
    const apenasNumeros = valor.replace(/\D/g, '');
    if (!apenasNumeros) return '';
    const numero = parseFloat(apenasNumeros) / 100;
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleValorMinChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value);
    setValorMin(valorFormatado);
  };

  const handleValorMaxChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value);
    setValorMax(valorFormatado);
  };

  const adicionarRequisito = () => {
    setRequisitos([...requisitos, '']);
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
    setErro('');
    setEnviando(true);

    try {
      // Validações
      if (!titulo.trim()) {
        throw new Error('Título é obrigatório');
      }
      if (!descricao.trim()) {
        throw new Error('Descrição é obrigatória');
      }
      if (!categoriaId) {
        throw new Error('Categoria é obrigatória');
      }
      if (!localizacao.trim()) {
        throw new Error('Localização é obrigatória');
      }

      // Converter valores para número
      const valorMinNumerico = valorMin 
        ? parseFloat(valorMin.replace(/\./g, '').replace(',', '.'))
        : null;
      const valorMaxNumerico = valorMax 
        ? parseFloat(valorMax.replace(/\./g, '').replace(',', '.'))
        : null;

      if (valorMinNumerico && valorMaxNumerico && valorMinNumerico > valorMaxNumerico) {
        throw new Error('Valor mínimo não pode ser maior que o valor máximo');
      }

      // Limpar requisitos vazios
      const requisitosLimpos = requisitos.filter(req => req.trim() !== '');

      // Criar payload com indicação de profissional direcionado na descrição
      const descricaoComDirecionamento = `${descricao.trim()}\n\n📌 Esta oportunidade foi direcionada ao profissional ${profissional.nome} (ID: ${profissional.id}).`;
      
      const payload = {
        tipo: 'oportunidade',
        categoria_id: parseInt(categoriaId),
        titulo: titulo.trim(),
        descricao: descricaoComDirecionamento,
        localizacao: localizacao.trim(),
        preco_min: valorMinNumerico,
        preco_max: valorMaxNumerico,
        prazo: prazo || null,
        urgencia: urgencia,
        requisitos: requisitosLimpos,
        imagens: [],
        status: 'disponivel'
      };

      const anuncioCriado = await createAnuncioApi(payload);

      success(`Solicitação de contratação enviada para ${profissional.nome}! Ele será notificado.`, {
        title: 'Solicitação enviada!'
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      const mensagemErro = error.message || 'Erro ao enviar solicitação. Tente novamente.';
      setErro(mensagemErro);
      showError(mensagemErro, {
        title: 'Erro ao enviar solicitação'
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleClose = () => {
    if (!enviando) {
      setTitulo('');
      setDescricao('');
      setLocalizacao('');
      setValorMin('');
      setValorMax('');
      setPrazo('');
      setUrgencia('normal');
      setRequisitos(['']);
      setCategoriaId('');
      setErro('');
      onClose();
    }
  };

  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Contratar Profissional
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  Descreva detalhadamente o que você precisa de {profissional.nome}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={enviando}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Informações do Profissional */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-4">
              <img 
                src={profissional.foto_url || '/perfil_sem_foto.png'} 
                alt={profissional.nome}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{profissional.nome}</h3>
                <p className="text-sm text-gray-600">
                  {profissional.workerProfile?.categorias?.join(', ') || 'Profissional'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Categoria */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiList className="w-4 h-4 text-green-600" />
                  Categoria do Serviço *
                </div>
              </label>
              <select
                id="categoria"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
                disabled={enviando}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiFileText className="w-4 h-4 text-green-600" />
                  Título do Serviço *
                </div>
                <span className="text-xs text-gray-500 font-normal block mt-1">
                  Ex: "Preciso de um eletricista para instalação residencial"
                </span>
              </label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Descreva brevemente o serviço que precisa"
                required
                disabled={enviando}
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">{titulo.length}/100 caracteres</p>
            </div>

            {/* Descrição Detalhada */}
            <div>
              <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiFileText className="w-4 h-4 text-green-600" />
                  Descrição Detalhada *
                </div>
                <span className="text-xs text-gray-500 font-normal block mt-1">
                  Seja específico: descreva o problema, o que precisa ser feito, dimensões, materiais necessários, etc.
                </span>
              </label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Tenho um apartamento de 80m² e preciso de uma instalação elétrica completa. A unidade está em construção e necessito de pontos de luz, tomadas, ventilador no teto da sala e ar condicionado no quarto principal. Já tenho todos os materiais comprados..."
                rows={6}
                required
                disabled={enviando}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">{descricao.length} caracteres</p>
            </div>

            {/* Localização */}
            <div>
              <label htmlFor="localizacao" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-4 h-4 text-green-600" />
                  Localização *
                </div>
                <span className="text-xs text-gray-500 font-normal block mt-1">
                  Onde o serviço será realizado? (Endereço completo ou região)
                </span>
              </label>
              <input
                type="text"
                id="localizacao"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
                required
                disabled={enviando}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Valores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="valorMin" className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="w-4 h-4 text-green-600" />
                    Orçamento Mínimo (R$)
                  </div>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="text"
                    id="valorMin"
                    value={valorMin}
                    onChange={handleValorMinChange}
                    placeholder="0,00"
                    disabled={enviando}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="valorMax" className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="w-4 h-4 text-green-600" />
                    Orçamento Máximo (R$)
                  </div>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="text"
                    id="valorMax"
                    value={valorMax}
                    onChange={handleValorMaxChange}
                    placeholder="0,00"
                    disabled={enviando}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Prazo */}
            <div>
              <label htmlFor="prazo" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-green-600" />
                  Prazo Desejado
                </div>
                <span className="text-xs text-gray-500 font-normal block mt-1">
                  Quando você precisa que o serviço seja concluído?
                </span>
              </label>
              <input
                type="date"
                id="prazo"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                min={hoje}
                disabled={enviando}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Urgência */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 text-green-600" />
                  Nível de Urgência
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgencia('normal')}
                  disabled={enviando}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                    urgencia === 'normal'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-green-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FiClock className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">Normal</p>
                    <p className="text-xs">Sem pressa</p>
                  </div>
                  {urgencia === 'normal' && <FiCheck className="w-5 h-5 ml-auto" />}
                </button>
                <button
                  type="button"
                  onClick={() => setUrgencia('alta')}
                  disabled={enviando}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                    urgencia === 'alta'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-red-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FiAlertCircle className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">Alta</p>
                    <p className="text-xs">Urgente</p>
                  </div>
                  {urgencia === 'alta' && <FiCheck className="w-5 h-5 ml-auto" />}
                </button>
              </div>
            </div>

            {/* Requisitos Adicionais */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiList className="w-4 h-4 text-green-600" />
                  Requisitos ou Observações Adicionais
                </div>
                <span className="text-xs text-gray-500 font-normal block mt-1">
                  Ex: "Preciso de alguém que tenha seu próprio transporte", "Horário comercial apenas"
                </span>
              </label>
              <div className="space-y-2">
                {requisitos.map((requisito, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={requisito}
                      onChange={(e) => atualizarRequisito(index, e.target.value)}
                      placeholder={`Requisito ${index + 1} (opcional)`}
                      disabled={enviando}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    {requisitos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerRequisito(index)}
                        disabled={enviando}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={adicionarRequisito}
                  disabled={enviando}
                  className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  Adicionar outro requisito
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Erro ao enviar solicitação
                  </p>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {erro}
                  </p>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Como funciona?
                </p>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>O profissional receberá uma notificação sobre sua solicitação</li>
                  <li>Ele poderá visualizar todos os detalhes e fazer uma proposta</li>
                  <li>Você será notificado quando ele responder</li>
                </ul>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={enviando}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    Enviar Solicitação
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContratarProfissionalModal;

