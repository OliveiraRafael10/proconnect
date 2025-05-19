import Header from "../../components/Header";
import HeroSection from "./components/HeroSection";
import Categorias from "./components/Categorias";
import "./apresentacao.css";
import ComoFuncionaSection from "./components/ComoFuncionaSection";
import Footer from "./components/Footer";

const Apresentacao = () => {
    return (
        <>
            <Header />
            <HeroSection />
            <Categorias />
            <ComoFuncionaSection />
            <Footer />
        </>
    );
}

export default Apresentacao;