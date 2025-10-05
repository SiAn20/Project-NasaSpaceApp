import WeatherHome from "./pages/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherExplorer from "./pages/WheaterExplorer";
import { useState } from "react";

function App() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<WeatherHome />} />
          <Route path="/explorar" element={<WeatherExplorer />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
