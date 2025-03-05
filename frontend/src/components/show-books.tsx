import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export default function ShowBooks() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: api.books.get,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Books</h1>
      <ul>
        {data?.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
