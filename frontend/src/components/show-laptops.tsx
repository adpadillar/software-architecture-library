import React, { useState, useEffect, useMemo } from 'react';
import Popup from './popup';

interface Laptop {
  id: string;
  brand: string;
  model: string;
  state: "available" | "borrowed";
}

interface ShowLaptopsProps {
  searchCriteria: { category: string; query: string } | null;
}

export default function ShowLaptops({ searchCriteria }: ShowLaptopsProps) {
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/laptops');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setLaptops(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, []);

  const filteredLaptops = useMemo(() => {
    if (!searchCriteria || !searchCriteria.query) return laptops;

    const searchTerm = searchCriteria.query.toLowerCase();
    return laptops.filter((laptop) => {
      switch (searchCriteria.category) {
        case 'brand':
          return laptop.brand.toLowerCase().includes(searchTerm);
        case 'model':
          return laptop.model.toLowerCase().includes(searchTerm);
        default:
          return true;
      }
    });
  }, [laptops, searchCriteria]);

  const handleLaptopClick = (laptop: Laptop) => {
    setSelectedLaptop(laptop);
  };

  const handleClosePopup = () => {
    setSelectedLaptop(null);
  };

  const handleAction = () => {
    if (selectedLaptop) {
      alert(
        selectedLaptop.state === 'available'
          ? `Apartar laptop: ${selectedLaptop.brand} ${selectedLaptop.model}`
          : `Regresar laptop: ${selectedLaptop.brand} ${selectedLaptop.model}`
      );
      // Aquí puedes agregar la lógica para apartar o regresar la laptop
    }
    setSelectedLaptop(null);
  };

  if (loading) {
    return <p className="p-6">Cargando laptops...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">Error: {error}</p>;
  }

  return (
    <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Laptops disponibles</h1>
    <div className="grid grid-cols-5 gap-4">
      {filteredLaptops.map((laptop) => (
        <div
          key={laptop.id}
          onClick={() => handleLaptopClick(laptop)}
          className="bg-white rounded-lg shadow hover:shadow-xl p-4 transition transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
        >
          <h2 className="text-lg font-semibold mb-2">{laptop.brand}</h2>
          <p className="text-gray-700 mb-1">
            <strong>Modelo:</strong> {laptop.model}
          </p>
          <p className={`text-sm ${
            laptop.state === 'available' ? 'text-green-600' : 'text-red-600'
          }`}>
            {laptop.state === 'available' ? 'Disponible' : 'Prestada'}
          </p>
        </div>
      ))}
    </div>

    {/* Mostrar el popup si hay una laptop seleccionada */}
    {selectedLaptop && (
      <Popup
        resource={selectedLaptop}
        onClose={handleClosePopup}
        onAction={handleAction}
      />
    )}
  </div>
);
}