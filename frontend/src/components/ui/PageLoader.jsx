// Componente de loading para páginas
import { memo } from 'react';
import LoadingSpinner from './LoadingSpinner';

const PageLoader = memo(({ message = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="xl" color="blue" />
      <p className="text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
});

PageLoader.displayName = 'PageLoader';

export default PageLoader;
