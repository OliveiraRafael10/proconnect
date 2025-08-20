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
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                        Encontre <span className="text-black">profissionais</span>
                    </h2>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                        Divulgue <span className="text-black">seus serviços!</span>
                    </h2>
                </div>
                </div>
            </section>
    );
}

export default HeroSection;