import { GiLaptop } from "react-icons/gi"; // Tecnologia
import { LuHandPlatter } from "react-icons/lu"; // Garçom
import { FaFaucetDrip } from "react-icons/fa6"; // Reparos
import { ImBooks } from "react-icons/im"; //Aulas
import { AiFillFormatPainter } from "react-icons/ai"; // Pintura
import { AiFillTool } from "react-icons/ai"; // Mecanica
import { BsCameraFill } from "react-icons/bs"; //Fotografo
import { BsFillKeyFill } from "react-icons/bs"; // Chaveiro
import { BiSolidTruck } from "react-icons/bi"; //Carreto
import { FaBaby } from "react-icons/fa"; //Babá
import { FaUserShield } from "react-icons/fa"; // Segurança
import '../mobile-responsive.css';
// import { FaCircleXmark } from "react-icons/fa6" = Close

const categories = [
  { name: "Tecnologia", icon: <GiLaptop className="h-10 mb-4" size={36}/>},
  { name: "Garçom", icon: <LuHandPlatter className="h-10 mb-4" size={36}/> },
  { name: "Reparos", icon: <FaFaucetDrip className="h-10 mb-4" size={36}/> },
  { name: "Aulas", icon: <ImBooks className="h-10 mb-4" size={36}/> },
  { name: "Pintura", icon: <AiFillFormatPainter className="h-10 mb-4" size={36}/> },
  { name: "Mecânica", icon: <AiFillTool className="h-10 mb-4" size={36}/> },
  { name: "Fotográfo", icon: <BsCameraFill className="h-10 mb-4" size={36}/> },
  { name: "Chaveiro", icon: <BsFillKeyFill className="h-10 mb-4" size={36}/> },
  { name: "Carreto", icon: <BiSolidTruck className="h-10 mb-4" size={36}/> },
  { name: "Babá", icon: <FaBaby className="h-10 mb-4" size={36}/> },
  { name: "Segurança", icon: <FaUserShield className="h-10 mb-4" size={36}/> },
];

const Categorias = () => {
    return(
          <section id="categorias" className="flex justify-center gap-4 flex-wrap relative categorias-mobile">
            {categories.map(({ name, icon }) => (
              <div key={name} className="flex flex-col items-center bg-white rounded-lg p-4 w-30 text-center shadow-lg hover:shadow-2xl hover:cursor-pointer categoria-card touch-target">
                <div className="categoria-icon">{icon}</div>
                <p className="text-sm text-black font-medium categoria-name">{name}</p>
              </div>
            ))}
        </section>
    );
}
export default Categorias;