// Container para exibir notificações
import { useNotification } from '../../context/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 space-y-2 max-w-sm"
      aria-live="polite"
      aria-label="Notificações"
    >
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
