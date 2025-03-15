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
      const response = await fetch(`http://localhost:3000/api/books/${bookId}/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: "borrowed" })
      });
  
      if (!response.ok) throw new Error("Error al prestar libro");
      return true;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error desconocido");
      return false;
    }
  };
  
  const handleReturnBook = async (bookId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/books/${bookId}/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: "available" })
      });
  
      if (!response.ok) throw new Error("Error al devolver libro");
      return true;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error desconocido");
      return false;
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