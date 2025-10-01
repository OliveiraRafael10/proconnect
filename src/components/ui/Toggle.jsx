// Componente Toggle para habilitar/desabilitar funcionalidades
import { forwardRef } from 'react';

const Toggle = forwardRef(({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className = "",
  ...props
}, ref) => {
  return (
    <div className={`flex items-start sm:items-center justify-between p-4 bg-white rounded-lg border ${className}`}>
      <div className="flex-1 pr-4 min-w-0">
        <label className="text-sm font-medium text-gray-900 block">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex items-center flex-col gap-2">
        <span className="font-medium text-gray-700">Habilitar</span>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`
            relative inline-flex h-8 w-20 md:h-6 md:w-11 lg:h-6 lg:w-11 items-center rounded-full transition-colors
            focus:outline-none focus:ring-2 focus:ring-[#19506e] focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${checked 
              ? 'bg-[#19506e]' 
              : 'bg-gray-200'
            }
          `}
          {...props}
        >
          
            <span
              className={`
                inline-block h-4 w-4 md:h-4 md:w-4 lg:h-4 lg:w-4 transform rounded-full bg-white transition-transform shadow-md
                ${checked ? 'translate-x-7' : 'translate-x-0.5'}
              `}
            />
        </button>
      </div>
    </div>
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;

