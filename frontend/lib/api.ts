interface Book {
  id: string;
  title: string;
  state: "available" | "borrowed";
  author: string;
  genre: string;
}

const BASE_URL = "http://localhost:3000/api";

export const api = {
  books: {
    get: async () => {
      const response = await fetch(`${BASE_URL}/books`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as unknown as Book[];
    },
    create: async ({
      author,
      genre,
      title,
    }: {
      title: string;
      author: string;
      genre: string;
    }) => {
      const response = await fetch(`${BASE_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, genre }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as unknown as Book;
    },
  },
  // keep adding more resources here //
};
