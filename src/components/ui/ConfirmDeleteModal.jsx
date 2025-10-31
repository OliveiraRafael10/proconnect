import { FiX, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';

/**
 * Modal de confirmação de exclusão padronizado
 * @param {boolean} isOpen - Controla se o modal está aberto
 * @param {function} onClose - Função chamada ao fechar o modal
 * @param {function} onConfirm - Função chamada ao confirmar a exclusão
 * @param {string} title - Título do modal (opcional)
 * @param {string} message - Mensagem de confirmação (opcional)
 * @param {string} itemName - Nome do item sendo excluído (opcional)
 * @param {boolean} loading - Indica se está processando (opcional)
 */
export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Exclusão",
  message = "Esta ação não pode ser desfeita.",
  itemName = "",
  loading = false
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiTrash2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {title}
                </h2>
                <p className="text-red-100 text-sm">
                  Ação irreversível
                </p>
              </div>
            </div>
            {!loading && (
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <FiX className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tem certeza que deseja excluir?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {itemName && (
                  <span className="font-medium text-gray-900">"{itemName}"</span>
                )}
                {itemName && <br />}
                {message}
              </p>
            </div>
          </div>

          {/* Informação adicional */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Esta ação é permanente</p>
                <p className="text-red-700">
                  Todos os dados relacionados serão removidos permanentemente.
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Excluindo...
                </>
              ) : (
                <>
                  <FiTrash2 className="w-5 h-5" />
                  Excluir
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

