import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import React, { useState } from "react";
import Popup from './popup';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  state: "available" | "borrowed";
}

interface ShowBooksProps {
  searchCriteria: { category: string; query: string } | null;
}

export default function ShowBooks({ searchCriteria }: ShowBooksProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const queryClient = useQueryClient();

  // Obtener la lista de libros
  const { data, error, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: api.books.get,
  });

  // Función para prestar un libro (POST /loans/books)
  const handleBorrowBook = async (bookId: string) => {
    try {
      // 1. Verificar disponibilidad en el frontend
      const book = data?.find(b => b.id === bookId);
      if (!book || book.state !== 'available') {
        alert("El libro no está disponible");
        return false;
      }
  
      // 2. Realizar préstamo
      const response = await fetch('http://localhost:3000/api/loans/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token') // Si usas autenticación
        },
        body: JSON.stringify({
          bookId: bookId,
          userId: "user-001",
          userType: "student"
        }),
      });
  
      // 3. Manejar respuesta
      if (response.status === 400) {
        const error = await response.json();
        alert(error.message);
        return false;
      }
  
      if (!response.ok) throw new Error("Error en el servidor");
  
      return true;
  
    } catch (error) {
      console.error("Error en préstamo:", error);
      alert("Error al comunicarse con el servidor");
      return false;
    }
  };

  // Función para devolver un libro (POST /resources/:id/return)
  const handleReturnBook = async (bookId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/resources/${bookId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al devolver el libro');
      }

      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Propagar el error
    }
  };

  // Función para manejar la acción en el popup
  const handleAction = async () => {
    if (selectedBook) {
      try {
        let success = false;

        if (selectedBook.state === 'available') {
          success = await handleBorrowBook(selectedBook.id);
          alert('¡Libro prestado con éxito! 📖✅');
        } else {
          success = await handleReturnBook(selectedBook.id);
          alert('¡Libro devuelto con éxito! 📖🔄');
        }

        if (success) {
          setSelectedBook(null);
          queryClient.invalidateQueries({ queryKey: ["books"] }); // Actualizar lista
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error desconocido');
      }
    }
  };

  if (isLoading) return <p className="p-6">Cargando libros...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error.message}</p>;

  const filteredBooks = data?.filter((book: Book) => {
    if (!searchCriteria?.query) return true;
    const searchTerm = searchCriteria.query.toLowerCase();
    
    switch (searchCriteria.category) {
      case "titulo": return book.title.toLowerCase().includes(searchTerm);
      case "autor": return book.author.toLowerCase().includes(searchTerm);
      case "genero": return book.genre.toLowerCase().includes(searchTerm);
      default: return true;
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Libros disponibles</h1>
      <div className="grid grid-cols-5 gap-4">
        {filteredBooks?.map((book: Book) => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="bg-white rounded-lg shadow hover:shadow-xl p-4 transition transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
          >
            <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
            <p className="text-gray-700 mb-1"><strong>Autor:</strong> {book.author}</p>
            <p className="text-gray-500 mb-1"><strong>Género:</strong> {book.genre}</p>
            <p className={`text-sm ${book.state === 'available' ? 'text-green-600' : 'text-red-600'}`}>
              {book.state === 'available' ? 'Disponible' : 'Prestado'}
            </p>
          </div>
        ))}
      </div>

      {selectedBook && (
        <Popup
          resource={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}