import { useState } from "react";
import { GiLaptop } from "react-icons/gi"; // Tecnologia
import { LuHandPlatter } from "react-icons/lu"; // Garçom
import { FaFaucetDrip } from "react-icons/fa6"; // Reparos
import { ImBooks } from "react-icons/im"; // Aulas
import { AiFillFormatPainter, AiFillTool } from "react-icons/ai"; // Pintura / Mecânica
import { BsCameraFill, BsFillKeyFill } from "react-icons/bs"; // Fotógrafo / Chaveiro
import { BiSolidTruck } from "react-icons/bi"; // Carreto
import { FaBaby, FaUserShield } from "react-icons/fa"; // Babá / Segurança
import { FaCheckCircle } from "react-icons/fa"; // Check de seleção

const categories = [
  { name: "Tecnologia", icon: <GiLaptop size={24} /> },
  { name: "Garçom", icon: <LuHandPlatter size={24} /> },
  { name: "Reparos", icon: <FaFaucetDrip size={24} /> },
  { name: "Aulas", icon: <ImBooks size={24} /> },
  { name: "Pintura", icon: <AiFillFormatPainter size={24} /> },
  { name: "Mecânica", icon: <AiFillTool size={24} /> },
  { name: "Fotógrafo", icon: <BsCameraFill size={24} /> },
  { name: "Chaveiro", icon: <BsFillKeyFill size={24} /> },
  { name: "Carreto", icon: <BiSolidTruck size={24} /> },
  { name: "Babá", icon: <FaBaby size={24} /> },
  { name: "Segurança", icon: <FaUserShield size={24} /> },
];

const Categorias = () => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((item) => item !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  return (
    <section id="categorias" className="flex justify-center gap-2 flex-wrap relative">
      {categories.map(({ name, icon }) => {
        const isSelected = selected.includes(name);
        return (
          <div
            key={name}
            onClick={() => toggleSelect(name)}
            className={`relative flex flex-col justify-center items-center 
              rounded-md p-2 w-22 h-18 text-center cursor-pointer
              transition-all duration-300 ease-in-out
              ${isSelected
                ? "bg-[#487f9e] text-white border-2 border-[#487f9e] shadow-md scale-105"
                : "bg-white text-gray border border-gray-200 hover:bg-gray-100 hover:scale-105 hover:shadow-md"
              }
            `}
          >
            {isSelected && (
              <FaCheckCircle className="absolute top-1 right-1 text-white" size={12} />
            )}
            {icon}
            <p className="text-[9px] font-medium mt-1">{name}</p>
          </div>

        );
      })}
    </section>
  )
}

export default Categorias;
