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
    <div className={`flex items-center justify-between p-4 bg-white rounded-lg border ${className}`}>
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>
      
      <div className="ml-4">
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
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
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${checked ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    </div>
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;

