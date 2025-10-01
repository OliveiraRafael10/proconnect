import '../mobile-responsive.css';

/**
 * Componente Footer com links de navegação e informações legais
 * Inclui melhorias de acessibilidade e estrutura semântica
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-[#36759c] text-white footer-mobile">
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Links de Navegação */}
                <nav className="flex flex-wrap justify-center gap-6 mb-4 footer-nav" role="navigation" aria-label="Links do rodapé">
                    <a 
                        href="#about" 
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#36759c] rounded footer-link touch-target"
                        aria-label="Saiba mais sobre a ProConnect"
                    >
                        Sobre nós
                    </a>
                    <a 
                        href="#contact" 
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#36759c] rounded footer-link touch-target"
                        aria-label="Entre em contato conosco"
                    >
                        Contate-nos
                    </a>
                    <a 
                        href="#terms" 
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#36759c] rounded footer-link touch-target"
                        aria-label="Leia nossos termos de uso"
                    >
                        Termos de uso
                    </a>
                    <a 
                        href="#privacy" 
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#36759c] rounded footer-link touch-target"
                        aria-label="Leia nossa política de privacidade"
                    >
                        Política de privacidade
                    </a>
                </nav>
                
                {/* Copyright */}
                <div className="text-center text-sm border-t border-blue-400 pt-4 footer-copyright">
                    <p>
                        Copyright © {currentYear} ProConnect. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;