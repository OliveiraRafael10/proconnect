import Input from "../ui/Input";
import Button from "../ui/Button";
import { IoSearchOutline } from "react-icons/io5";
import trabalhador from "../../../assets/trabalhador.png";
import '../mobile-responsive.css';

const HeroSection = () => {
    return (
            <section className="py-16 relative overflow-hidden" style={{
                background: 'radial-gradient(ellipse 80% 60% at center center, rgba(54, 117, 156, 0.6) 0%, rgba(54, 117, 156, 0.8) 30%, rgba(54, 117, 156, 0.9) 60%, #36759c 90%, #36759c 100%)'
            }}>
                
                <div className="flex flex-col max-w-7xl mx-auto min-h-60 relative px-2 hero-mobile">
                    <div className="ml-8 md:ml-16 lg:ml-20 hero-content">
                        <h2 className="text-3xl md:text-3xl lg:text-5xl text-white font-bold mb-4 leading-tight hero-title">
                            Encontre profissionais, Divulgue seus serviços!
                        </h2>
                        <p className="text-white mb-8 text-lg md:text-xl max-w-6xl hero-subtitle">
                            Busque profissionais para realizar seus serviços e aproveite as oportunidades de emprego!
                        </p>
                    </div>
                    <div className="w-full max-w-2xl h-14 mt-8 flex items-center gap-3 bg-white p-2 rounded-lg shadow-lg mx-auto hero-search-container">
                        <Input 
                            placeholder="O que você precisa? Ex: designer gráfico, eletricista, professor..."
                            className="border-0 focus:ring-0 text-base hero-search-input"
                        />
                        <Button 
                            variant="search"
                            size="lg"
                            className="px-6 py-3 hero-search-button touch-target"
                        >
                            <IoSearchOutline className="mr-2" size={20} />
                            <span className="mobile-hidden">Buscar</span>
                        </Button>
                    </div>
                </div>
            </section>
    );
}

export default HeroSection;