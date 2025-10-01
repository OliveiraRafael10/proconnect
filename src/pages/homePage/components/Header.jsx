import { Link } from "react-router-dom";
import logo from '../../../assets/ProConnectIcon.png';

const Header = () => {
    return (
        <header className='flex text-xl justify-between items-center px-4 py-2' id='header'>
            <Link to="/" className='flex items-center'>
                <img className='h-14' src={logo} alt="Ícone ProConnect" />
                <p className='font-extrabold text-2xl ml-2 text-[#165277]'>ProConnect</p>
            </Link>
            <nav className='flex items-center space-x-4'>
                <span className='text-gray-600'>Já tem uma conta?</span>
                <Link 
                    to="/login" 
                    className='font-bold text-[#165277] hover:underline hover:text-blue-500 transition-colors'
                    aria-label="Fazer login na plataforma"
                >
                    Entrar
                </Link>
                <span className='text-gray-600'>Não tem?</span>
                <Link 
                    to="/register" 
                    className='font-bold text-[#165277] hover:underline hover:text-blue-500 transition-colors'
                    aria-label="Criar nova conta na plataforma"
                >
                    Cadastre-se
                </Link>
            </nav>
        </header>
    );
}

export default Header;