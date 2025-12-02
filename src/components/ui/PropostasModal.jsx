import { useState, useEffect } from 'react';
import { FiX, FiDollarSign, FiMessageSquare, FiUser, FiClock, FiCheckCircle, FiXCircle, FiSend, FiAlertCircle } from 'react-icons/fi';
import { listPropostasApi } from '../../services/apiClient';
import { useNotification } from '../../context/NotificationContext';

function PropostasModal({ servico, isOpen, onClose }) {
  const [propostas, setPropostas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const { error: showError } = useNotification();

  useEffect(() => {
    if (isOpen && servico) {
      carregarPropostas();
    } else {
      setPropostas([]);
      setErro('');
    }
  }, [isOpen, servico]);

  const carregarPropostas = async () => {
    if (!servico?.id) return;
    
    setCarregando(true);
    setErro('');
    
    try {
      const response = await listPropostasApi(servico.id);
      setPropostas(response.items || []);
    } catch (error) {
      const mensagemErro = error.message || 'Erro ao carregar propostas. Tente novamente.';
      setErro(mensagemErro);
      showError(mensagemErro, {
        title: 'Erro ao carregar propostas'
      });
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return 'Data não informada';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarMoeda = (valor) => {
    if (!valor) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aceita':
        return 'text-green-600 bg-green-100';
      case 'recusada':
        return 'text-red-600 bg-red-100';
      case 'retirada':
        return 'text-gray-600 bg-gray-100';
      case 'enviada':
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aceita':
        return 'Aceita';
      case 'recusada':
        return 'Recusada';
      case 'retirada':
        return 'Retirada';
      case 'enviada':
      default:
        return 'Enviada';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'aceita':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'recusada':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiSend className="w-4 h-4" />;
    }
  };

  if (!isOpen || !servico) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2174a7] to-[#19506e] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiMessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Propostas Recebidas
                </h2>
                <p className="text-blue-100 text-sm">
                  {servico.titulo}
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
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Estatísticas */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <FiMessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{propostas.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Aceitas</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {propostas.filter(p => p.status === 'aceita').length}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <FiSend className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Pendentes</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {propostas.filter(p => p.status === 'enviada').length}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {carregando && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiMessageSquare className="h-12 w-12 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-500">Carregando propostas...</p>
            </div>
          )}

          {/* Erro */}
          {erro && !carregando && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
              <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{erro}</p>
            </div>
          )}

          {/* Lista de Propostas */}
          {!carregando && !erro && (
            <>
              {propostas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FiMessageSquare className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma proposta ainda
                  </h3>
                  <p className="text-gray-500">
                    Quando profissionais enviarem propostas para este serviço, elas aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {propostas.map((proposta) => (
                    <div
                      key={proposta.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      {/* Header da Proposta */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                            <FiUser className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {proposta.usuarios?.nome || proposta.usuario_id_worker || 'Profissional'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {proposta.usuarios?.email || 'Email não disponível'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposta.status)}`}>
                            {getStatusIcon(proposta.status)}
                            {getStatusText(proposta.status)}
                          </span>
                        </div>
                      </div>

                      {/* Conteúdo da Proposta */}
                      <div className="space-y-3">
                        {/* Valor Proposto */}
                        {proposta.valor_proposto && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                            <FiDollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-green-700 font-medium">Valor Proposto</p>
                              <p className="text-lg font-bold text-green-900">
                                {formatarMoeda(proposta.valor_proposto)}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Mensagem */}
                        {proposta.mensagem && (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-2 mb-2">
                              <FiMessageSquare className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                              <p className="text-xs font-medium text-gray-700">Mensagem</p>
                            </div>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {proposta.mensagem}
                            </p>
                          </div>
                        )}

                        {/* Data */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FiClock className="w-4 h-4" />
                          <span>Enviada em {formatarData(proposta.criada_em)}</span>
                        </div>
                      </div>

                      {/* Ações (se necessário no futuro) */}
                      {proposta.status === 'enviada' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                              Aceitar Proposta
                            </button>
                            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">
                              Recusar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#2174a7] text-white rounded-lg hover:bg-[#19506e] transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropostasModal;

