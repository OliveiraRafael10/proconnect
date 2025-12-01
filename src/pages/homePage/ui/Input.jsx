/**
 * Componente Input reutilizável com props
 * @param {string} type - Tipo do input (text, email, password, etc.)
 * @param {string} placeholder - Texto placeholder
 * @param {string} value - Valor do input (controlado)
 * @param {function} onChange - Função de callback para mudança de valor
 * @param {boolean} disabled - Se o input está desabilitado
 * @param {string} className - Classes CSS adicionais
 * @param {Object} props - Outras props do elemento input
 */
const Input = ({
  type = "text",
  placeholder = "Digite aqui...",
  value,
  onChange,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses = "flex h-8 w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const inputClasses = `${baseClasses} ${className}`;
  
  return (
    <input
      type={type}
      className={inputClasses}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  );
};

export default Input;
