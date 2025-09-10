import { useState, useRef } from "react";
import { FiPlus, FiMapPin, FiClock, FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function PublicarServicoPage() {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [urgencia, setUrgencia] = useState("normal");
  const [requisitos, setRequisitos] = useState([""]);
  const [imagens, setImagens] = useState([]);
  const [visualizarImagem, setVisualizarImagem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const inputFileRef = useRef(null);
  const carouselRef = useRef(null);

  const handleImagemChange = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagens((prev) => [...prev, ...previewUrls]);
  };

  const handleRemoveImagem = (index) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const abrirSeletorArquivos = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const adicionarRequisito = () => {
    setRequisitos([...requisitos, ""]);
  };

  const removerRequisito = (index) => {
    if (requisitos.length > 1) {
      setRequisitos(requisitos.filter((_, i) => i !== index));
    }
  };

  const atualizarRequisito = (index, valor) => {
    const novosRequisitos = [...requisitos];
    novosRequisitos[index] = valor;
    setRequisitos(novosRequisitos);
  };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Filtrar requisitos vazios
        const requisitosFiltrados = requisitos.filter(req => req.trim() !== "");

        // Aqui você pode enviar os dados para o backend depois
        console.log("Serviço publicado:", { 
          titulo, 
          categoria, 
          descricao, 
          localizacao,
          prazo,
          urgencia,
          requisitos: requisitosFiltrados,
          imagens 
        });

        // Exibir o popup
        setShowPopup(true);

        // Zerar os campos
        setTitulo("");
        setCategoria("");
        setDescricao("");
        setLocalizacao("");
        setPrazo("");
        setUrgencia("normal");
        setRequisitos([""]);
        setImagens([]);

        // Fechar automaticamente após 3 segundos
        setTimeout(() => setShowPopup(false), 3000);
    };


  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📢 Publicar Serviço
          </h1>
          <p className="text-gray-600 text-lg">
            Crie um anúncio atrativo para encontrar o profissional ideal
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Título */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título do serviço"
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Selecione a categoria</option>
              <option value="limpeza">🧹 Limpeza</option>
              <option value="organizacao">📦 Organização</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva detalhadamente o serviço que você precisa..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              required
            ></textarea>
          </div>

          {/* Localização e Prazo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Localização */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                <FiMapPin className="inline h-4 w-4 mr-1" />
                Localização
              </label>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Ex: Centro, São Paulo - SP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Prazo */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                <FiClock className="inline h-4 w-4 mr-1" />
                Prazo
              </label>
              <input
                type="date"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Urgência */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              <FiAlertCircle className="inline h-4 w-4 mr-1" />
              Urgência
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="normal"
                  checked={urgencia === "normal"}
                  onChange={(e) => setUrgencia(e.target.value)}
                  className="mr-2"
                />
                <span className="flex items-center gap-1">
                  <FiCheckCircle className="h-4 w-4 text-green-500" />
                  Normal
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="alta"
                  checked={urgencia === "alta"}
                  onChange={(e) => setUrgencia(e.target.value)}
                  className="mr-2"
                />
                <span className="flex items-center gap-1">
                  <FiAlertCircle className="h-4 w-4 text-red-500" />
                  Alta
                </span>
              </label>
            </div>
          </div>

          {/* Upload de Imagens com preview em carrossel */}
          <div>
              <div className="flex justify-between items-center mb-4">
                  <label className="block text-lg font-medium text-gray-700">Imagens do serviço</label>

                  {/* Botão estilizado */}
                  <button
                      type="button"
                      onClick={abrirSeletorArquivos}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition-colors"
                  >
                      <FiPlus className="h-4 w-4" />
                      Adicionar imagens
                  </button>
              </div>

            {/* Input escondido */}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={inputFileRef}
              onChange={handleImagemChange}
              className="hidden"
            />

            {/* Carrossel */}
            {imagens.length > 0 && (
              <div className="relative mt-4">
                {/* Botão esquerda */}
                <button
                  type="button"
                  onClick={() => scrollCarousel("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow-md p-2 hover:bg-gray-200 z-10"
                >
                  <IoChevronBack className="text-xl" />
                </button>

                {/* Área de scroll */}
                <div
                  ref={carouselRef}
                  className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-10"
                >
                  {imagens.map((img, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img
                        src={img}
                        alt={`preview-${index}`}
                        onClick={() => setVisualizarImagem(img)} // abre modal
                        className="w-60 h-60 object-cover rounded border shadow-lg hover:shadow-blue-700"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImagem(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs opacity-80 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Botão direita */}
                <button
                  type="button"
                  onClick={() => scrollCarousel("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow-md p-2 hover:bg-gray-200"
                >
                  <IoChevronForward className="text-xl" />
                </button>
              </div>
            )}
          </div>

          {/* Botão de Publicar */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full py-4 bg-[#317e38] text-white font-semibold rounded-lg shadow hover:bg-[#3a6341] transition-colors text-lg"
            >
              Publicar Serviço
            </button>
          </div>
        </form>
        {/* Modal de visualização */}
        {visualizarImagem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[2px] z-50">
            <div className="relative">
              <img
                src={visualizarImagem}
                alt="Visualização"
                className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
              />
              {/* Botão fechar */}
              <button
                onClick={() => setVisualizarImagem(null)}
                className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Popup de Sucesso */}
          {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] z-50">
                  <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">
                      <div className="text-6xl mb-4">✅</div>
                      <h2 className="text-2xl font-bold text-green-600 mb-2">Serviço publicado!</h2>
                      <p className="text-gray-700 mb-6">Seu anúncio agora está disponível na plataforma e profissionais podem entrar em contato.</p>
                      <button
                      onClick={() => setShowPopup(false)}
                      className="px-6 py-3 bg-[#317e38] text-white rounded-lg hover:bg-[#3a6341] transition-colors font-medium"
                      >
                      Fechar
                      </button>
                  </div>
              </div>)}
        </div>
      </div>
    </div>
  );
}

export default PublicarServicoPage;
