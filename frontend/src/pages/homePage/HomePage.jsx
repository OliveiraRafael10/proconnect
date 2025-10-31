import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Categorias from "./components/Categorias";
import PrincipaisServicos from "./components/PrincipaisServicos";
import ProfissionalSection from "./components/ProfissionalSection";
import Footer from "./components/Footer";
import EtapasServico from "./components/EtapasServico";
import "./home.css";

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <Categorias />
                <PrincipaisServicos />
                <ProfissionalSection />
                <EtapasServico />
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;