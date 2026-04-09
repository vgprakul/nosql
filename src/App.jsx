import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MovieDetails from "./pages/MovieDetails";
import About from "./pages/About";
import Login from "./pages/Login";
import Watchlist from "./pages/Watchlist";
import Admin from "./pages/Admin";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}