import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ShowBooks from "./components/show-books";
import Navbar from "./components/navbar";
import SearchBar from "./components/serchbar";
import { useState } from 'react';
import ShowLaptops from "./components/show-laptops";

const queryClient = new QueryClient();

function App() {
  const [searchCriteria, setSearchCriteria] = useState<{ category: string; query: string } | null>(null);
  const [activeView, setActiveView] = useState<"books" | "laptops">("books");

  const handleSearch = (searchData: { category: string; query: string }) => {
    setSearchCriteria(searchData);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {/* Navbar con estado activeView y setActiveView */}
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      {/* Contenido principal */}
      <div className="p-6">
        <p className="font-extrabold text-2xl px-5 pt-5">
          {activeView === "books" ? "Busca el libro que quieras reservar" : "Busca la laptop que quieras reservar"}
        </p>
        {/* Pasar activeView a SearchBar */}
        <SearchBar onSearch={handleSearch} activeView={activeView} />

        {/* Renderizar condicionalmente ShowBooks o ShowLaptops */}
        {activeView === "books" ? (
          <ShowBooks searchCriteria={searchCriteria} />
        ) : (
          <ShowLaptops searchCriteria={searchCriteria} />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;