import { FcSms } from "react-icons/fc"; // -> balão de conversa com pontinhos
import { FcSearch } from "react-icons/fc";// -> lupa de pesquisa
import { FcVoicePresentation } from "react-icons/fc";// -> Fale com o profissional
import { FaRegHandshake } from "react-icons/fa";// -> Aperto de mão
import { FcAdvertising } from "react-icons/fc";// -> Corneta de alerta

const steps = [
  { text: "Busque o serviço", icon: <FcSearch className="w-8 h-8 mb-2"/> },
  { text: "Fale com o profissional", icon: <FcVoicePresentation className="w-8 h-8 mb-2"/> },
  { text: "Contrate", icon: <FaRegHandshake className="w-8 h-8 mb-2"/> },
  { text: "Avalie depois", icon: <FcSms className="w-8 h-8 mb-2"/> },
];

const ComoFuncionaSection = () => {
    return (
        <section className="py-12 px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Como funciona</h2>
            <div className="flex justify-center gap-10 flex-wrap text-sm text-gray-700">
                {steps.map(({ text, icon }) => (
                    <div key={text} className="flex items-center gap-4">
                        {icon}
                        <p className="text-ls text-gray-700">{text}</p>
                    </div>
                ))}
            </div>
            <div className=" bg-white shadow-lg rounded-lg py-4 flex justify-center gap-2">
                <FcAdvertising className="" size={40}/>
                <span className="mt-1 text-lg font-semibold">É profissional?</span>
                <span className="mt-1 text-lg">Cadastre-se agora e encontre novos clientes.</span>
            </div>
        </section>
    );
}

export default ComoFuncionaSection;