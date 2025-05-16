import Header from "../components/Header";
import trabalhador from "../assets/trabalhador.png";

const Apresentacao = () => {
    return (
        <>
            <Header />
            <div className="h-60" id="first-div">
                <hr className="mx-auto w-full border-t-4 translate-y-40 absolute"/>
                <img className="h-80 absolute translate-y-12" src={trabalhador} alt="imagem trabalhador" />
                <div className="absolute top-40 right-6">
                    <div className="flex mb-12">
                        <p className="text-2xl font-bold text-amber-50">Encontre</p>
                        <p className="text-2xl font-bold ml-1.5">profissionais!</p>
                    </div>
                    <div className="flex">
                        <p className="text-2xl font-bold text-amber-50">Divulgue</p>
                        <p className="text-2xl font-bold ml-1.5">seus serviços!</p>
                    </div>
                </div>
            </div>
            <div className="w-full h-full" id="centro">
                <h1 className="font-bold text-2xl ml-100 translate-y-30">
                 Principais serviços pedidos
                </h1>
            </div>
        </>
    );
}

export default Apresentacao;