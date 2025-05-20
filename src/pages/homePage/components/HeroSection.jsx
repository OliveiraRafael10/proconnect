import Input from "../ui/Input";
import Button from "../ui/Button";
import trabalhador from "../../../assets/trabalhador.png"

const HeroSection = () => {
    return (
            <section className="bg-[#36759c] py-16 text-center relative overflow-hidden">
                <hr className="w-full border-t-3 translate-y-11 absolute"/>
                <div className="flex max-w-5xl mx-auto h-40">
                    <img src={trabalhador} alt="Homem sentado" className="absolute left-60 bottom-0 w-100 md:w-120" />
                    <div className="w-240 h-12 mt-30 flex items-center gap-2 bg-white p-2 rounded shadow mx-auto">
                        <Input />
                        <Button />
                    </div>
                    <div className="absolute right-10">
                        <h2 className="text-3xl md:text-4xl text-white font-bold mb-2">Encontre profissionais</h2>
                        <h2 className="text-3xl md:text-4xl text-white font-bold mb-6">Divulgue seus serviços!</h2>
                    </div>
                </div>
            </section>
    );
}

export default HeroSection;