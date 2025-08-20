import { useState } from "react";
import { Link } from "react-router-dom";

const jobs = [
  { id: 1, title: "Tecnologia", path: "/trabalhos/tecnologia" },
  { id: 2, title: "Garçom", path: "/trabalhos/garcom" },
  { id: 3, title: "Mecânica", path: "/trabalhos/mecanica" },
  { id: 4, title: "Aulas", path: "/trabalhos/aulas" },
  { id: 5, title: "Reparos", path: "/trabalhos/reparos" },
  { id: 6, title: "Pintura", path: "/trabalhos/pintura" },
  { id: 7, title: "Fotógrafo", path: "/trabalhos/fotografo" },
  { id: 8, title: "Chaveiro", path: "/trabalhos/chaveiro" },
  { id: 9, title: "Babá", path: "/trabalhos/baba" },
  { id: 10, title: "Jardinagem", path: "/trabalhos/jardinagem" },
  { id: 11, title: "Eletricista", path: "/trabalhos/eletricista" },
  { id: 12, title: "Pedreiro", path: "/trabalhos/pedreiro" },
  { id: 13, title: "Motorista", path: "/trabalhos/motorista" },
  { id: 14, title: "Designer", path: "/trabalhos/designer" },
  { id: 15, title: "Encanador", path: "/trabalhos/encanador" },
];

const List = ({ items = jobs }) => {
  const INITIAL_COUNT = 12;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const loadMore = () => setVisibleCount((prev) => prev + 12);
  const showLess = () => setVisibleCount(INITIAL_COUNT);

  return (
    <div className="flex flex-col items-center w-full">
      {/* GRID */}
      <section className="mx-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 px-12 w-full mt-8">        {items.slice(0, visibleCount).map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className="flex items-center justify-center 
                       bg-[#0f5888] aspect-square
                       rounded-xl shadow-md 
                       hover:scale-105 hover:shadow-lg 
                       transition-transform duration-300 cursor-pointer"
        >
          <p className="text-white font-semibold text-center px-2">
            {item.title}
          </p>
        </Link>
      ))}
      </section>

      {/* BOTÕES VER MAIS / VER MENOS */}
      <div className="mt-6 flex gap-4">
        {visibleCount < items.length && (
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-[#0f5888] text-white font-semibold rounded-lg shadow hover:bg-[#0c446b] transition-colors duration-300"
          >
            Ver mais
          </button>
        )}

        {visibleCount > INITIAL_COUNT && (
          <button
            onClick={showLess}
            className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-400 transition-colors duration-300"
          >
            Ver menos
          </button>
        )}
      </div>
    </div>
  );
};

export default List;
