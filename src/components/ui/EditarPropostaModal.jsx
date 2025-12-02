import { useState, useEffect } from 'react';
import { FiX, FiDollarSign, FiMessageSquare, FiSend, FiAlertCircle, FiSave } from 'react-icons/fi';
import { updatePropostaApi } from '../../services/apiClient';
import { useNotification } from '../../context/NotificationContext';

function EditarPropostaModal({ proposta, isOpen, onClose, onSuccess }) {
  const [valorProposto, setValorProposto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const { success, error: showError } = useNotification();

  const formatarMoeda = (valor) => {
    if (!valor) return '';
    // Se já é uma string formatada, retornar
    if (typeof valor === 'string' && valor.includes(',')) {
      return valor;
    }
    // Se é número, formatar
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (isNaN(numero)) return '';
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  useEffect(() => {
    if (isOpen && proposta) {
      setValorProposto(proposta.valor_proposto ? formatarMoeda(proposta.valor_proposto.toString()) : '');
      setMensagem(proposta.mensagem || '');
      setErro('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, proposta]);

  if (!isOpen || !proposta) return null;

  const handleValorChange = (e) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '');
    if (!apenasNumeros) {
      setValorProposto('');
      return;
    }
    const numero = parseFloat(apenasNumeros) / 100;
    setValorProposto(numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      const valorNumerico = valorProposto 
        ? parseFloat(valorProposto.replace(/\./g, '').replace(',', '.'))
        : null;

      const payload = {
        ...(valorNumerico !== null && { valor_proposto: valorNumerico }),
        ...(mensagem.trim() && { mensagem: mensagem.trim() })
      };

      // Se não há mudanças, não enviar
      if (Object.keys(payload).length === 0) {
        setErro('Nenhuma alteração foi feita.');
        setSalvando(false);
        return;
      }

      await updatePropostaApi(proposta.id, payload);
      
      success('Proposta atualizada com sucesso!', {
        title: 'Proposta atualizada!'
      });

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const mensagemErro = error.message || 'Erro ao atualizar proposta. Tente novamente.';
      setErro(mensagemErro);
      showError(mensagemErro, {
        title: 'Erro ao atualizar proposta'
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleClose = () => {
    if (!salvando) {
      setValorProposto('');
      setMensagem('');
      setErro('');
      onClose();
    }
  };

  const anuncio = proposta.anuncios || {};
  const categoria = anuncio.categorias || {};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2174a7] to-[#19506e] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiSave className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Editar Proposta
                </h2>
                <p className="text-blue-100 text-sm">
                  {anuncio.titulo || 'Serviço'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={salvando}
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
            <p className="text-gray-700">{anuncio.titulo || 'N/A'}</p>
            <p className="text-sm text-gray-600 mt-1">{categoria.nome || 'Sem categoria'}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span className={`px-2 py-1 rounded-full ${
                proposta.status === 'aceita' ? 'bg-green-100 text-green-700' :
                proposta.status === 'recusada' ? 'bg-red-100 text-red-700' :
                proposta.status === 'retirada' ? 'bg-gray-100 text-gray-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {proposta.status === 'aceita' ? 'Aceita' :
                 proposta.status === 'recusada' ? 'Recusada' :
                 proposta.status === 'retirada' ? 'Retirada' :
                 'Enviada'}
              </span>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Valor Proposto */}
            <div>
              <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4 text-[#2174a7]" />
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
                  disabled={salvando}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2174a7] focus:border-[#2174a7] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Campo Mensagem */}
            <div>
              <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="w-4 h-4 text-[#2174a7]" />
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
                disabled={salvando}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2174a7] focus:border-[#2174a7] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {mensagem.length} caracteres
              </p>
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Erro ao atualizar
                  </p>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {erro}
                  </p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={salvando}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2174a7] to-[#19506e] text-white font-semibold rounded-lg hover:from-[#19506e] hover:to-[#2174a7] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {salvando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    Salvar Alterações
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

export default EditarPropostaModal;

