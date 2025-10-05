import { useState } from "react";
import WeatherHome from "./pages/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherExplorer from "./pages/WheaterExplorer";
import Navbar from "./components/Navbar";

function App() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<WeatherHome />} />
          <Route path="/explorar" element={<WeatherExplorer />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
