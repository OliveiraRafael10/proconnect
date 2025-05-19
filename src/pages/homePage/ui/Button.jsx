import { IoSearchOutline } from "react-icons/io5";


const Button = () => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    return (
      <button className={(baseClasses)}><IoSearchOutline className="mr-1" size={30} /></button>
    );
}

export default Button;
