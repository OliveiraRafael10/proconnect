// Componente de barra de busca com debounce
import { useState, useEffect, useCallback, memo } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

const SearchBar = memo(({ 
  onSearch, 
  placeholder = "Buscar...", 
  debounceMs = 300,
  loading = false,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  return (
    <div className={`relative ${className}`}>
      <div className={`
        relative flex items-center
        border-2 rounded-lg transition-all duration-200
        ${isFocused 
          ? 'border-[#19506e] shadow-md' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}>
        <div className="absolute left-3 text-gray-400">
          <FiSearch className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-10 py-2
            bg-transparent border-0 outline-none
            text-gray-700 placeholder-gray-400
            focus:ring-0
          "
          aria-label="Campo de busca"
        />
        
        <div className="absolute right-3 flex items-center gap-2">
          {loading && <LoadingSpinner size="sm" color="gray" />}
          
          {query && !loading && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpar busca"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 text-sm text-gray-500">
          Buscando por: "{query}"
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
