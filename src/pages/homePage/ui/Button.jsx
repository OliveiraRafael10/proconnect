import { IoSearchOutline } from "react-icons/io5";

/**
 * Componente Button reutilizável com variantes e props
 * @param {string} variant - Variante do botão (primary, secondary, ghost)
 * @param {string} size - Tamanho do botão (sm, md, lg)
 * @param {boolean} disabled - Se o botão está desabilitado
 * @param {function} onClick - Função de callback para clique
 * @param {React.ReactNode} children - Conteúdo do botão
 * @param {string} className - Classes CSS adicionais
 * @param {Object} props - Outras props do elemento button
 */
const Button = ({ 
  variant = "primary", 
  size = "md", 
  disabled = false,
  onClick,
  children,
  className = "",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    search: "bg-[#36759c] text-white hover:bg-[#165277] shadow-sm hover:shadow-md"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
