// Componente de filtro select
import { forwardRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FilterSelect = forwardRef(({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Selecione...",
  required = false,
  disabled = false,
  className = "",
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full px-3 py-2 pr-10 border rounded-lg transition-colors
            focus:outline-none focus:ring-2 focus:ring-[#19506e] focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            bg-white border-gray-300 hover:border-gray-400
            appearance-none cursor-pointer
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
});

FilterSelect.displayName = 'FilterSelect';

export default FilterSelect;
