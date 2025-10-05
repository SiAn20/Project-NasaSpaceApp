import WeatherHome from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherExplorer from "./pages/WheaterExplorer";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<WeatherHome />} />
        <Route path="/explorar" element={<WeatherExplorer />} />
      </Routes>
    </Router>
  );
}

export default App;
