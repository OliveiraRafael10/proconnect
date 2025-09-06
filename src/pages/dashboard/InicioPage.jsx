
import { useMemo } from "react";
import { FiMessageCircle, FiStar, FiPlusCircle, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function InicioPage() {
    const { usuario } = useAuth();

    const stats = useMemo(() => [
        {
            title: "Seus Serviços",
            value: "3",
            description: "serviços publicados",
            icon: FiPlusCircle,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Mensagens",
            value: "2",
            description: "novos contatos",
            icon: FiMessageCircle,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "Avaliações",
            value: "4.8",
            description: "média de avaliação",
            icon: FiStar,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50"
        },
        {
            title: "Visualizações",
            value: "127",
            description: "este mês",
            icon: FiTrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        }
    ], []);

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Bem-vindo(a), {usuario?.nome?.split(" ")[0] || "Usuário"}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                    Aqui está um resumo da sua atividade na plataforma
                </p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div 
                            key={index}
                            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </h3>
                            
                            <h4 className="text-lg font-semibold text-gray-700 mb-1">
                                {stat.title}
                            </h4>
                            
                            <p className="text-sm text-gray-600">
                                {stat.description}
                            </p>
                        </div>
                    );
                })}
            </section>

            {/* Seção de atividades recentes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Atividades Recentes</h2>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <FiMessageCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Nova mensagem recebida</p>
                            <p className="text-sm text-gray-600">João Silva está interessado no seu serviço de pedreiro</p>
                        </div>
                        <span className="text-sm text-gray-500">2h atrás</span>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <FiStar className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Nova avaliação recebida</p>
                            <p className="text-sm text-gray-600">Maria Santos avaliou seu trabalho com 5 estrelas</p>
                        </div>
                        <span className="text-sm text-gray-500">1 dia atrás</span>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiPlusCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Serviço publicado</p>
                            <p className="text-sm text-gray-600">Você publicou um novo serviço de eletricista</p>
                        </div>
                        <span className="text-sm text-gray-500">3 dias atrás</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioPage;