import React, { useState } from 'react';

interface NavbarProps {
  activeView: "books" | "laptops"; // Estado activo
  setActiveView: (view: "books" | "laptops") => void; // Función para cambiar la vista
}

const Navbar = ({ activeView, setActiveView }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow px-20 flex items-center justify-between ">
        {/* Logo a la izquierda */}
        <div className="flex-shrink-0">
          <img 
            src="/bibliotec.svg" 
            alt="Biblioteca Logo" 
            className="h-32 w-32" 
          />
        </div>

        {/* Navegación en el centro */}
        <div className="flex space-x-6">
          <button 
            onClick={() => setActiveView("books")}
            className={`font-bold hover:text-gray-900 hover:text-3xl transition-all duration-300 cursor-pointer ${
              activeView === "books" ? "text-5xl text-blue-800" : "text-xl"
            }`}
          >
            Books
          </button>
          <button 
            onClick={() => setActiveView("laptops")}
            className={`font-bold hover:text-gray-900 hover:text-3xl transition-all duration-300 cursor-pointer ${
              activeView === "laptops" ? "text-5xl text-blue-800" : "text-xl"
            }`}
          >
            Laptops
          </button>
        </div>

        {/* Iconos a la derecha */}
        <div className="flex items-center space-x-4">
          {/* Icono de perfil */}
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </button>

          {/* Icono de hamburguesa */}
          <button 
            className='cursor-pointer'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Menú lateral */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 space-y-4">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          
          <div className="space-y-4 mt-8">
            <button className="w-full py-2 px-4 text-left text-lg font-medium hover:bg-gray-100 rounded-md transition-colors">
              Student
            </button>
            <button className="w-full py-2 px-4 text-left text-lg font-medium hover:bg-gray-100 rounded-md transition-colors">
              Teacher
            </button>
            <button className="w-full py-2 px-4 text-left text-lg font-medium hover:bg-gray-100 rounded-md transition-colors">
              Admin
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;