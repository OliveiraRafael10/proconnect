import { useState, useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function PublicarServicoPage() {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagens, setImagens] = useState([]);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Aqui você pode enviar os dados para o backend depois
        console.log("Serviço publicado:", { titulo, categoria, descricao, imagens });

        // Exibir o popup
        setShowPopup(true);

        // Zerar os campos
        setTitulo("");
        setCategoria("");
        setDescricao("");
        setImagens([]);

        // Fechar automaticamente após 3 segundos
        setTimeout(() => setShowPopup(false), 3000);
    };


  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📢 Publicar Serviço</h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Título */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite o título do serviço"
            className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Categoria</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Selecione a categoria</option>
            <option value="design">🎨 Design</option>
            <option value="reformas">🔧 Reformas</option>
            <option value="aulas">📘 Aulas</option>
            <option value="tecnologia">💻 Tecnologia</option>
            <option value="outros">📌 Outros</option>
          </select>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o serviço..."
            rows="4"
            className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            required
          ></textarea>
        </div>

        {/* Upload de Imagens com preview em carrossel */}
        <div>
            <div className="flex justify-between">
                <label className="block text-3xl font-medium text-gray-700 mb-2">Imagens do serviço</label>

                {/* Botão estilizado */}
                <button
                    type="button"
                    onClick={abrirSeletorArquivos}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
                >
                    <FiPlus className="text-xl" />
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
                      className="w-60 h-60 object-cover rounded border shadow"
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
        <button
          type="submit"
          className="w-full py-3 bg-[#2f7fb1] text-white font-semibold rounded-lg shadow hover:bg-[#23668f] transition"
        >
          Publicar Serviço
        </button>
      </form>
       {/* Popup de Sucesso */}
        {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center animate-fadeIn">
                    <h2 className="text-xl font-semibold text-green-600">✅ Serviço publicado!</h2>
                    <p className="text-gray-700 mt-2">Seu anúncio agora está disponível na plataforma.</p>
                    <button
                    onClick={() => setShowPopup(false)}
                    className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                    Fechar
                    </button>
                </div>
            </div>)}
    </div>
  );
}

export default PublicarServicoPage;
