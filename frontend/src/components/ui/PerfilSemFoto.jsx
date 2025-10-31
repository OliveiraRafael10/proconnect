import { FiUser } from "react-icons/fi";

// Componente para exibir perfil sem foto
const PerfilSemFoto = ({ 
  size = "medium", 
  onClick, 
  className = "",
  showBorder = true 
}) => {
  // Configurações de tamanho
  const sizeConfig = {
    small: {
      container: "w-12 h-12",
      icon: "w-6 h-6",
      border: "border-2"
    },
    medium: {
      container: "w-38 h-38",
      icon: "w-20 h-20",
      border: "border-4"
    },
    large: {
      container: "w-32 h-32",
      icon: "w-16 h-16",
      border: "border-4"
    },
    xlarge: {
      container: "w-42 h-42",
      icon: "w-20 h-20",
      border: "border-4"
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <div 
      className={`
        ${config.container} 
        bg-gradient-to-br from-gray-200 to-gray-400 
        rounded-full 
        flex items-center justify-center 
        shadow-xl 
        mx-auto mb-3 
        cursor-pointer 
        hover:opacity-80 
        transition
        ${className}
      `}
      onClick={onClick}
    >
      <FiUser className={`${config.icon} text-gray-600`} />
    </div>
  );
};

export default PerfilSemFoto;
