// Componente para seleção de categorias de serviços
import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiX, FiCheck } from 'react-icons/fi';

const CategorySelect = ({
  label,
  value = [],
  onChange,
  options = [],
  placeholder = "Selecione as categorias...",
  maxSelections = 3,
  required = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filtrar opções baseado na busca
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (option) => {
    if (value.includes(option.value)) {
      // Remover se já estiver selecionado
      onChange(value.filter(v => v !== option.value));
    } else if (value.length < maxSelections) {
      // Adicionar se não exceder o limite
      onChange([...value, option.value]);
    }
  };

  const handleRemoveOption = (optionValue) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const getSelectedLabels = () => {
    return value.map(val => options.find(opt => opt.value === val)?.label).filter(Boolean);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        {/* Campo de seleção */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-3 py-2 text-left border rounded-lg transition-colors
            focus:outline-none focus:ring-2 focus:ring-[#19506e] focus:border-transparent
            ${isOpen 
              ? 'border-[#19506e] bg-white' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {value.length === 0 ? (
                <span className="text-gray-500">{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {getSelectedLabels().map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#19506e] text-white text-xs rounded-full"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveOption(value[index]);
                        }}
                        className="hover:bg-[#153f59] rounded-full p-0.5"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Campo de busca */}
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#19506e]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Lista de opções */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nenhuma categoria encontrada
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  const isDisabled = !isSelected && value.length >= maxSelections;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleToggleOption(option)}
                      disabled={isDisabled}
                      className={`
                        w-full px-3 py-2 text-left text-sm transition-colors
                        flex items-center justify-between
                        ${isSelected 
                          ? 'bg-[#19506e] text-white' 
                          : isDisabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <span>{option.label}</span>
                      {isSelected && <FiCheck className="w-4 h-4" />}
                    </button>
                  );
                })
              )}
            </div>

            {/* Contador de seleções */}
            <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
              {value.length} de {maxSelections} categorias selecionadas
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelect;

