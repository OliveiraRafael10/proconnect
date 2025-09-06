// Componente Button melhorado com loading e acessibilidade
import { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-[#19506e] text-white hover:bg-[#153f59]
      focus:ring-[#19506e] shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-200 text-gray-900 hover:bg-gray-300
      focus:ring-gray-500 shadow-sm hover:shadow-md
    `,
    success: `
      bg-green-600 text-white hover:bg-green-700
      focus:ring-green-500 shadow-sm hover:shadow-md
    `,
    danger: `
      bg-red-600 text-white hover:bg-red-700
      focus:ring-red-500 shadow-sm hover:shadow-md
    `,
    outline: `
      border-2 border-[#19506e] text-[#19506e] hover:bg-[#19506e] hover:text-white
      focus:ring-[#19506e] bg-transparent
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" color="white" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
