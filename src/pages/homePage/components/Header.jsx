import { Link } from "react-router-dom";
import logo from '../../../assets/iWork_logo.png';
import iWork from '../../../assets/iWork_escrito.png';

const Header = () => {
    return (
        <header className='flex text-x1 justify-between'>
            <a className='flex' href="./">
                <img className='h-14 m-auto ml-4' src={logo} alt="icon iWork" />
                <img className='h-10 m-auto ml-4' src={iWork} alt="word iWork" />
            </a>
            <div className='flex m-4'>
                <p className='mr-2'>Já tem uma conta?</p>
                <Link to="/login" id='btnEntrar' className='font-[800] mr-8 hover:underline' href="">Entrar</Link>
                <p className='mr-2'>Não tem?</p>
                <Link to="/register" id='btnEntrar' className='font-[800] mr-8 hover:underline' href="">Cadastre-se</Link>
            </div>
        </header>
    );
}

export default Header;