import React from 'react';

interface PopupProps {
  resource: {
    id: string;
    title?: string;
    author?: string;
    genre?: string;
    brand?: string;
    model?: string;
    state: "available" | "borrowed";
  };
  onClose: () => void; // Función para cerrar el popup
  onAction: () => void; // Función para realizar la acción (Apartar o Regresar)
}

const Popup = ({ resource, onClose, onAction }: PopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(63, 63, 63, 0.60)' }}>
      <div className="bg-white rounded-lg p-6 w-96">
        {/* Título del recurso */}
        <h2 className="text-3xl font-bold mb-4">
          {resource.title || `${resource.brand} ${resource.model}`}
        </h2>

        {/* Información adicional del recurso */}
        {resource.author && (
          <p className="text-gray-700 mb-2 text-xl">
            <strong>Autor:</strong> {resource.author}
          </p>
        )}
        {resource.genre && (
          <p className="text-gray-700 mb-2 text-xl">
            <strong>Género:</strong> {resource.genre}
          </p>
        )}
        {resource.brand && (
          <p className="text-gray-700 mb-2 text-xl">
            <strong>Marca:</strong> {resource.brand}
          </p>
        )}
        {resource.model && (
          <p className="text-gray-700 mb-2 text-xl">
            <strong>Modelo:</strong> {resource.model}
          </p>
        )}

        {/* Estado del recurso */}
        <p className={`text-sm mb-4 ${
          resource.state === 'available' ? 'text-green-600 font-bold text-xl' : 'text-yellow-600 text-xl'
        }`}>
          {resource.state === 'available' ? 'Disponible' : 'Prestado'}
        </p>

        {/* Botón de acción (Apartar o Regresar) */}
        <div className="flex justify-center">
          <button
            onClick={onAction}
            className={`px-4 py-2 rounded-md text-white transition ${
              resource.state === 'available' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            {resource.state === 'available' ? 'Apartar' : 'Regresar'}
          </button>
        </div>

        {/* Botón para cerrar el popup */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 text-white rounded-md p-2 hover:bg-gray-600 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Popup;