// Context para sistema de notificações
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calcular notificações não lidas
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const addNotification = useCallback((message, type = 'info', duration = 5000, options = {}) => {
    const id = Date.now() + Math.random();
    const notification = { 
      id, 
      message, 
      type, 
      duration,
      read: false,
      timestamp: new Date().toISOString(),
      ...options
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove após o tempo especificado (apenas para toasts)
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }

    // Simular notificação do navegador
    if (Notification.permission === 'granted' && options.showBrowserNotification !== false) {
      new Notification(options.title || 'ProConnect', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Solicitar permissão para notificações
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Métodos de conveniência
  const success = useCallback((message, options = {}) => 
    addNotification(message, 'success', 5000, options), [addNotification]);
  
  const error = useCallback((message, options = {}) => 
    addNotification(message, 'error', 7000, options), [addNotification]);
  
  const warning = useCallback((message, options = {}) => 
    addNotification(message, 'warning', 6000, options), [addNotification]);
  
  const info = useCallback((message, options = {}) => 
    addNotification(message, 'info', 5000, options), [addNotification]);

  // Simular notificações em tempo real para demonstração
  useEffect(() => {
    const interval = setInterval(() => {
      // 5% de chance de gerar uma notificação a cada 30 segundos
      if (Math.random() < 0.05) {
        const randomNotifications = [
          {
            message: 'Você recebeu uma nova proposta para um serviço de limpeza.',
            type: 'info',
            title: 'Nova proposta recebida',
            category: 'proposal',
            duration: 0 // Não remove automaticamente
          },
          {
            message: 'O cliente avaliou seu serviço com 5 estrelas!',
            type: 'success',
            title: 'Serviço avaliado',
            category: 'rating',
            duration: 0
          },
          {
            message: 'Você tem um pagamento pendente há 3 dias.',
            type: 'warning',
            title: 'Lembrete de pagamento',
            category: 'payment',
            duration: 0
          }
        ];

        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        addNotification(randomNotification.message, randomNotification.type, randomNotification.duration, {
          title: randomNotification.title,
          category: randomNotification.category,
          showBrowserNotification: false // Não mostrar notificação do navegador para simulação
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [addNotification]);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount,
        addNotification, 
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        success,
        error,
        warning,
        info,
        requestNotificationPermission
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  return context;
}
