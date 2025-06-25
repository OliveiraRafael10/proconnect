
function InicioPage() {
    const user = JSON.parse(localStorage.getItem("usuarioLogado"));

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Bem-vindo(a), {user?.nome?.split(" ")[0] || "Usuário"} !</h1>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2">Seus Serviços</h2>
                <p className="text-sm text-gray-600">Você publicou 3 serviços recentemente.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2">Mensagens</h2>
                <p className="text-sm text-gray-600">2 novos contatos aguardando resposta.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2">Avaliações</h2>
                <p className="text-sm text-gray-600">Sua média de avaliação é 4.8.</p>
            </div>
            </section>
        </>
    );
}

export default InicioPage;