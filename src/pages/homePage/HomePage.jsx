import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Categorias from "./components/Categorias";
import "./home.css";
//import FinalSection from "./components/EtapasServico";
import Footer from "./components/Footer";
import EtapasServico from "./components/EtapasServico";
import Filter from "./components/Filter";
import List from "./components/List";

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <Filter />
                <Categorias />
                <List/>
                <EtapasServico />
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;