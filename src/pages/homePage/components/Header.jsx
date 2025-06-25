import { Link } from "react-router-dom";
import logo from '../../../assets/lance-facil-icon.png';

const Header = () => {
    return (
        <header className='flex text-x1 justify-between'>
            <a className='flex' href="./">
                <img className='h-14 m-auto' src={logo} alt="icon lance facil" />
                <p className='font-[800] -mx-7 m-3 text-2xl '>LanceFácil</p>
            </a>
            <div className='flex m-4'>
                <p className='mr-2'>Já tem uma conta?</p>
                <Link to="/login" id='btnEntrar' className='font-[800] mr-8' href="">Entrar</Link>
                <p className='mr-2'>Não tem?</p>
                <Link to="/register" id='btnEntrar' className='font-[800] mr-8' href="">Cadastre-se</Link>
            </div>
        </header>
    );
}

export default Header;