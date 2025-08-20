import { useState } from "react";

const Filter = ({ onFilterChange }) => {
    const [selected, setSelected] = useState(null); 
    const handleClick = (filter) => {
        if (selected === filter) {
            setSelected(null);
            onFilterChange(null);
        } else {
            setSelected(filter);
            onFilterChange(filter);
        }
    };

    return (
        <div className="flex justify-center my-10 gap-4 max-w-2xl mx-auto">
            {["Serviço", "Prestador"].map((filter) => (
                <button
                    key={filter}
                    onClick={() => handleClick(filter)}
                    className={`flex-1 py-4 rounded-xl font-bold text-xl transition-all duration-300
        ${selected === filter
                            ? "bg-[#0a5483] text-white shadow-lg scale-105"
                            : "bg-white text-gray border border-gray-200 hover:bg-gray-100 hover:scale-105 hover:shadow-md"
                        }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

export default Filter;
