import { useState } from 'react';
import { FiX, FiDollarSign, FiMessageSquare, FiSend, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { createPropostaApi } from '../../services/apiClient';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

function PropostaModal({ servico, isOpen, onClose, onSuccess }) {
  const [valorProposto, setValorProposto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [erroDuplicado, setErroDuplicado] = useState(false);
  const { success, error: showError } = useNotification();
  const navigate = useNavigate();

  if (!isOpen || !servico) return null;

  const formatarMoeda = (valor) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    if (!apenasNumeros) return '';
    
    // Converte para número e divide por 100 para ter centavos
    const numero = parseFloat(apenasNumeros) / 100;
    
    // Formata como moeda brasileira
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleValorChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value);
    setValorProposto(valorFormatado);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      // Converte o valor formatado para número
      const valorNumerico = valorProposto 
        ? parseFloat(valorProposto.replace(/\./g, '').replace(',', '.'))
        : null;

      const payload = {
        anuncio_id: servico.id,
        ...(valorNumerico && { valor_proposto: valorNumerico }),
        ...(mensagem.trim() && { mensagem: mensagem.trim() })
      };

      await createPropostaApi(payload);
      
      success('Sua proposta foi enviada com sucesso. O cliente será notificado.', {
        title: 'Proposta enviada!'
      });

      // Limpar formulário
      setValorProposto('');
      setMensagem('');
      
      // Fechar modal e chamar callback de sucesso
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      let mensagemErro = 'Erro ao enviar proposta. Tente novamente.';
      let isDuplicado = false;
      
      // Tratar diferentes tipos de erro
      if (error.message) {
        // Verificar se é erro de proposta duplicada
        if (error.message.includes('já enviou uma proposta') || 
            error.message.includes('duplicate') ||
            error.message.includes('23505')) {
          mensagemErro = 'Você já enviou uma proposta para este serviço.';
          isDuplicado = true;
        } else if (error.message.includes('não pode propor no seu próprio anúncio')) {
          mensagemErro = 'Você não pode enviar uma proposta para seu próprio anúncio.';
        } else if (error.message.includes('Anúncio não encontrado')) {
          mensagemErro = 'Este serviço não foi encontrado. Ele pode ter sido removido.';
        } else {
          // Tentar extrair mensagem amigável do erro
          mensagemErro = error.message;
        }
      }
      
      setErro(mensagemErro);
      setErroDuplicado(isDuplicado);
      showError(mensagemErro, {
        title: 'Erro ao enviar proposta'
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleClose = () => {
    if (!enviando) {
      setValorProposto('');
      setMensagem('');
      setErro('');
      setErroDuplicado(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#317e38] to-[#2a6b30] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiSend className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Enviar Proposta
                </h2>
                <p className="text-green-100 text-sm">
                  {servico.titulo}
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
          {/* Informações do Serviço */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Serviço</h3>
            <p className="text-gray-700">{servico.titulo}</p>
            <p className="text-sm text-gray-600 mt-1">{servico.categoria}</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Valor Proposto */}
            <div>
              <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4 text-[#317e38]" />
                  Valor Proposto (R$)
                </div>
                <span className="text-xs text-gray-500 font-normal block mt-1">
                  Opcional - Informe o valor que você propõe para realizar este serviço
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <input
                  type="text"
                  id="valor"
                  value={valorProposto}
                  onChange={handleValorChange}
                  placeholder="0,00"
                  disabled={enviando}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#317e38] focus:border-[#317e38] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Campo Mensagem */}
            <div>
              <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="w-4 h-4 text-[#317e38]" />
                  Mensagem
                </div>
                <span className="text-xs text-gray-500 font-normal block mt-1">
                  Opcional - Adicione uma mensagem explicando sua proposta
                </span>
              </label>
              <textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Descreva sua proposta, experiência relevante ou qualquer informação que considere importante..."
                rows={6}
                disabled={enviando}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#317e38] focus:border-[#317e38] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {mensagem.length} caracteres
              </p>
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                erroDuplicado 
                  ? 'bg-amber-50 border-amber-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                {erroDuplicado ? (
                  <FiInfo className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-semibold mb-1 ${
                    erroDuplicado ? 'text-amber-900' : 'text-red-900'
                  }`}>
                    {erroDuplicado ? 'Proposta já enviada' : 'Não foi possível enviar a proposta'}
                  </p>
                  <p className={`text-sm leading-relaxed ${
                    erroDuplicado ? 'text-amber-800' : 'text-red-700'
                  }`}>
                    {erro}
                  </p>
                  {erroDuplicado && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-amber-700 font-medium">
                        💡 O que você pode fazer:
                      </p>
                      <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc">
                        <li>Editar sua proposta existente na página "Meus Serviços"</li>
                        <li>Aguardar a resposta do cliente</li>
                        <li>Retirar sua proposta atual e enviar uma nova</li>
                      </ul>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate('/dashboard/meus-servicos');
                        }}
                        className="mt-3 w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                      >
                        Ir para Meus Serviços
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Aviso */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Ao enviar esta proposta, o cliente será notificado e poderá aceitar, recusar ou entrar em contato com você.
              </p>
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
                disabled={enviando || (!valorProposto && !mensagem.trim())}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#317e38] to-[#2a6b30] text-white font-semibold rounded-lg hover:from-[#2a6b30] hover:to-[#317e38] focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    Enviar Proposta
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

export default PropostaModal;

