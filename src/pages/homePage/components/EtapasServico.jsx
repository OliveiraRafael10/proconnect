import { FaRegHandshake } from "react-icons/fa";// -> Aperto de mão
import { FcAdvertising, FcSms, FcSearch, FcVoicePresentation } from "react-icons/fc"; // -> Corneta, balão de conversa, lupa de pesquisa, boneco com balão de conversa


const EtapasServico = () => {
  const etapas = [
    {
      titulo: "Busque o serviço",
      icone: <FcSearch className="w-10 h-10 mb-4"/>,
      descricao: "Encontre rapidamente profissionais e serviços de acordo com sua necessidade e categoria.",
    },
    {
      titulo: "Fale com o profissional",
      icone: <FcVoicePresentation className="w-10 h-10 mb-4"/>,
      descricao: "Converse diretamente com o prestador de serviço para alinhar detalhes, preços e disponibilidade.",
    },
    {
      titulo: "Contrate",
      icone: <FaRegHandshake className="w-10 h-10 mb-4"/>,
      descricao: "Após negociar, contrate o profissional com segurança e tenha controle do processo na plataforma.",
    },
    {
      titulo: "Avalie depois",
      icone: <FcSms className="w-10 h-10 mb-4"/>,
      descricao: "Após o serviço realizado, avalie o profissional com base na sua experiência e ajude outros usuários.",
    },
  ];

  return (
    <div className="bg-[#f9f9ef] m-10 py-10 px-4">
      <div className="w-280 m-auto bg-white shadow-lg rounded-lg py-4 flex justify-center gap-2">
          <FcAdvertising className="" size={40}/>
          <span className="mt-1 text-lg font-semibold">É profissional?</span>
          <span className="mt-1 text-lg">Cadastre-se agora e encontre novos clientes.</span>
      </div>

      <h2 className="text-center text-4xl text-[#19506e] font-bold m-10">COMO FUNCIONA</h2>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {etapas.map((etapa, index) => (
          <div key={index} className="flex flex-col items-center bg-white shadow-md p-10 rounded-lg">
            <div className="text-4xl mb-2">{etapa.icone}</div>
            <h3 className="text-lg font-semibold text-[#19506e] mb-4">{etapa.titulo}</h3>
            <p className="text-sm text-gray-600">{etapa.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EtapasServico;