import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Categorias from "./components/Categorias";
import "./home.css";
import FinalSection from "./components/FinalSection";
import Footer from "./components/Footer";

const HomePage = () => {
    return (
        <>
            <Header />
            <HeroSection />
            <Categorias />
            <FinalSection />
            <Footer />
        </>
    );
}

export default HomePage;