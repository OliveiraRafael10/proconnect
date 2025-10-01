import Input from "../ui/Input";
import Button from "../ui/Button";
import { IoSearchOutline } from "react-icons/io5";
import trabalhador from "../../../assets/trabalhador.png"

const HeroSection = () => {
    return (
            <section className="py-16 relative overflow-hidden" style={{
                background: 'radial-gradient(ellipse 80% 60% at center center, rgba(54, 117, 156, 0.6) 0%, rgba(54, 117, 156, 0.8) 30%, rgba(54, 117, 156, 0.9) 60%, #36759c 90%, #36759c 100%)'
            }}>
                
                <div className="flex flex-col max-w-7xl mx-auto min-h-60 relative px-2">
                    <div className="ml-8 md:ml-16 lg:ml-20">
                        <h2 className="text-3xl md:text-3xl lg:text-5xl text-white font-bold mb-4 leading-tight">
                            Encontre profissionais, Divulgue seus serviços!
                        </h2>
                        <p className="text-white mb-8 text-lg md:text-xl max-w-6xl">
                            Busque profissionais para realizar seus serviços e aproveite as oportunidades de emprego!
                        </p>
                    </div>
                    <div className="w-full max-w-2xl h-14 mt-8 flex items-center gap-3 bg-white p-2 rounded-lg shadow-lg mx-auto">
                        <Input 
                            placeholder="O que você precisa? Ex: designer gráfico, eletricista, professor..."
                            className="border-0 focus:ring-0 text-base"
                        />
                        <Button 
                            variant="search"
                            size="lg"
                            className="px-6 py-3"
                        >
                            <IoSearchOutline className="mr-2" size={20} />
                            Buscar
                        </Button>
                    </div>
                </div>
            </section>
    );
}

export default HeroSection;