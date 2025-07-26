import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Categorias from "./components/Categorias";
import "./home.css";
import FinalSection from "./components/FinalSection";
import Footer from "./components/Footer";

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <Categorias />
                <FinalSection />
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;