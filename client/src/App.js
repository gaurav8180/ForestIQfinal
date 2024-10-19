import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import GreenCover from "./components/GreenCover";
import TreeCount from "./components/TreeCount";
import TreeSpecies from "./components/TreeSpecie";
import OptimalPathing from "./components/OptimalPathing";
import WeatherData from "./components/HistoricalData";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/greencover" element={<GreenCover />} />
        <Route path="/treecount" element={<TreeCount />} />
        <Route path="/treespecies" element={<TreeSpecies />} />
        <Route path="/optimalpathing" element={<OptimalPathing />} />
        <Route path="/historicaldata" element={<WeatherData />} />
      </Routes>
    </Router>
  );
}

export default App;