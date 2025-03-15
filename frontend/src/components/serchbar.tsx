import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchData: { category: string; query: string }) => void;
  activeView: "books" | "laptops"; // Vista activa
}

const SearchBar = ({ onSearch, activeView }: SearchBarProps) => {
  const [category, setCategory] = useState(activeView === "books" ? "titulo" : "brand");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ category, query });
    }
    console.log(`Buscando por ${category}: ${query}`);
  };

  // Opciones del dropdown según la vista activa
  const dropdownOptions = activeView === "books" ? [
    { value: "titulo", label: "Título" },
    { value: "autor", label: "Autor" },
    { value: "genero", label: "Género" },
  ] : [
    { value: "brand", label: "Marca" },
    { value: "model", label: "Modelo" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4 p-6">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-md p-2"
      >
        {dropdownOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Buscar por ${dropdownOptions.find((opt) => opt.value === category)?.label || "..."}`}
        className="border border-gray-300 rounded-md p-2 flex-1"
      />
      
      <button
        type="submit"
        className="bg-blue-700 text-white rounded-md p-2 hover:bg-blue-800 transition"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;