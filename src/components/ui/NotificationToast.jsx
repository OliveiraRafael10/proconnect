// Componente de notificação toast
import { useEffect } from 'react';
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const NotificationToast = ({ notification, onRemove }) => {
  const { id, message, type } = notification;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, notification.duration);

    return () => clearTimeout(timer);
  }, [id, notification.duration, onRemove]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck className="w-5 h-5" />;
      case 'error':
        return <FiX className="w-5 h-5" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5" />;
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div 
      className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${getStyles()} animate-slide-in`}
      role="alert"
      aria-live="polite"
    >
      {getIcon()}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Fechar notificação"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export default NotificationToast;
