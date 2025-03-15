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

  const handleSearch = (searchData: { category: string; query: string }) => {
    setSearchCriteria(searchData);
  };

  return (
    <QueryClientProvider client={queryClient}>
        <Navbar activeView={activeView} setActiveView={setActiveView} />
        <AdminPanel></AdminPanel>
    </QueryClientProvider>
  );
}

export default App;