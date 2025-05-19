import { GiLaptop } from "react-icons/gi"; // Tecnologia
import { LuHandPlatter } from "react-icons/lu"; // Garçom
import { FaFaucetDrip } from "react-icons/fa6"; // Reparos
import { ImBooks } from "react-icons/im"; //Aulas

const categories = [
  { name: "Tecnologia", icon: <GiLaptop className="h-10 mb-4" size={36}/>},
  { name: "Garçom", icon: <LuHandPlatter className="h-10 mb-4" size={36}/> },
  { name: "Reparos", icon: <FaFaucetDrip className="h-10 mb-4" size={36}/> },
  { name: "Aulas", icon: <ImBooks className="h-10 mb-4" size={36}/> },
];

const Categorias = () => {
    return(
          <section id="categorias" className="flex justify-center gap-4 flex-wrap relative">
            {categories.map(({ name, icon }) => (
              <div key={name} className="flex flex-col items-center bg-white rounded-lg p-4 w-30 text-center shadow-lg hover:shadow-2xl hover:cursor-pointer">
                {icon}
                <p className="text-sm text-black font-medium">{name}</p>
              </div>
            ))}
        </section>
    );
}
export default Categorias;