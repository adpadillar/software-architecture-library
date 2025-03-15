import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ShowBooks from "./components/show-books";
import Navbar from "./components/navbar";
import SearchBar from "./components/serchbar";
import { useState } from 'react';
import ShowLaptops from "./components/show-laptops";
import AdminPanel from "./components/adminPanel";

const queryClient = new QueryClient();

function App() {
  const [searchCriteria, setSearchCriteria] = useState<{ category: string; query: string } | null>(null);
  const [activeView, setActiveView] = useState<"books" | "laptops">("books");
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSearch = (searchData: { category: string; query: string }) => {
    setSearchCriteria(searchData);
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <div className="p-6">
        <button
          onClick={toggleAdminMode}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isAdminMode ? "Salir de modo admin" : "Entrar a modo admin"}
        </button>

        {!isAdminMode ? (
          <>
            <p className="font-extrabold text-2xl px-5 pt-5">
              {activeView === "books" ? "Busca el libro que quieras reservar" : "Busca la laptop que quieras reservar"}
            </p>
            <SearchBar onSearch={handleSearch} activeView={activeView} />
            {activeView === "books" ? (
              <ShowBooks searchCriteria={searchCriteria} />
            ) : (
              <ShowLaptops searchCriteria={searchCriteria} />
            )}
          </>
        ) : (
          <AdminPanel />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;