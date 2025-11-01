import { Link } from "react-router-dom";
import { FiSearch, FiClock, FiShield, FiUser } from "react-icons/fi";
import { FcAdvertising } from "react-icons/fc";
import Pessoa from "../../../assets/Pessoa.png";
import '../mobile-responsive.css';

/**
 * Seção dedicada para profissionais se cadastrarem
 * Destaca os benefícios de usar a plataforma como prestador de serviços
 */
const ProfissionalSection = () => {
    return (
        <div className="bg-[#36759c] p-10 w-full mx-auto mb-16 px-4 profissional-mobile">
            {/* Banner de Chamada */}
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg py-4 flex justify-center items-center gap-2 mb-8 profissional-banner">
                <FcAdvertising className="text-4xl" />
                <span className="text-lg font-semibold text-gray-800">É profissional?</span>
                <span className="text-lg text-gray-600">Cadastre-se agora e encontre novos clientes.</span>
            </div>

            {/* Conteúdo Principal */}
            <div className="max-w-7xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-lg profissional-content">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Conteúdo Texto */}
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-950 leading-tight profissional-title">
                            Aumente sua clientela e gerencie seu negócio aqui!
                        </h2>
                        
                        <div className="space-y-4">
                            {/* Visibilidade */}
                            <div className="flex items-start space-x-4 profissional-feature">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#36759c] rounded-lg flex items-center justify-center profissional-feature-icon touch-target">
                                    <FiSearch className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900 text-lg profissional-feature-title">Visibilidade</h3>
                                    <p className="text-blue-700 profissional-feature-text">Seja encontrado por diversos clientes.</p>
                                </div>
                            </div>

                            {/* Flexibilidade */}
                            <div className="flex items-start space-x-4 profissional-feature">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#36759c] rounded-lg flex items-center justify-center profissional-feature-icon touch-target">
                                    <FiClock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900 text-lg profissional-feature-title">Flexibilidade</h3>
                                    <p className="text-blue-700 profissional-feature-text">Trabalhe nos seus próprios termos.</p>
                                </div>
                            </div>

                            {/* Pagamento Seguro */}
                            <div className="flex items-start space-x-4 profissional-feature">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#36759c] rounded-lg flex items-center justify-center profissional-feature-icon touch-target">
                                    <FiShield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900 text-lg profissional-feature-title">Pagamento Seguro</h3>
                                    <p className="text-blue-700 profissional-feature-text">Receba de forma rápida e segura.</p>
                                </div>
                            </div>
                        </div>

                        {/* Botão CTA */}
                        <div className="pt-4">
                            <Link 
                                to="/register" 
                                className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg profissional-cta touch-target"
                                aria-label="Cadastrar-se como profissional na plataforma"
                            >
                                Cadastre-se agora
                            </Link>
                        </div>
                    </div>

                    {/* Ilustração */}
                    <div className="flex justify-center lg:justify-end profissional-image">
                        <div className="relative">
                            <div className="flex items-center justify-center">
                                <img src={Pessoa} alt="Pessoa" className="w-70 h-60"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfissionalSection;
