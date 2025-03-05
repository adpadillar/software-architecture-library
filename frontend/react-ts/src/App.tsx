import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ShowBooks from "./components/show-books";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <p className="font-extrabold text-5xl">Hello world</p>
      <ShowBooks />
    </QueryClientProvider>
  );
}

export default App;
