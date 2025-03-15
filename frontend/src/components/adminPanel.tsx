import React, { useState } from 'react';

const AdminPanel = () => {
  const [selectedOption, setSelectedOption] = useState<'book' | 'laptop'>('book');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Validar campos obligatorios
    if (selectedOption === 'book' && (!data.title || !data.author || !data.genre)) {
      alert('Por favor completa todos los campos del libro');
      return;
    }
    if (selectedOption === 'laptop' && (!data.brand || !data.model)) {
      alert('Por favor completa todos los campos de la laptop');
      return;
    }

    try {
      // Definir el endpoint según la selección
      const endpoint = selectedOption === 'book' ? 'http://localhost:3000/api/books' : 'http://localhost:3000/api/laptops';

      // Realizar la solicitud POST
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Enviar los datos del formulario
      });

      // Manejar la respuesta
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el servidor');
      }

      const result = await response.json();
      alert(`${selectedOption === 'book' ? 'Libro' : 'Laptop'} registrado con éxito!`);
      e.currentTarget.reset(); // Limpiar el formulario
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Hubo un error al conectar con el servidor');
    }
  };

  return (
    <div className='px-80'>
      <div className="bg-white rounded-lg shadow hover:shadow-2xl p-4 transition transform hover:-translate-y-1">
        <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Selecciona el tipo de registro:
          </label>
          <select
            id="type"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value as 'book' | 'laptop')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="book">Libro</option>
            <option value="laptop">Laptop</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedOption === 'book' ? (
            <>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                  Autor
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                  Género
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Marca
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                  Modelo
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;