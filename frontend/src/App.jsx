import WeatherHome from "./pages/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherExplorer from "./pages/WheaterExplorer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherHome />} />
        <Route path="/explorar" element={<WeatherExplorer />} />
      </Routes>
    </Router>
  );
}

export default App;
