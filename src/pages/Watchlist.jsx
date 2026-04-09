import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";

export default function Watchlist() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data, error } = await supabase
        .from("watchlists")
        .select("*")
        .eq("user_id", user.id);

      if (!error) {
        setMovies(
          (data || []).map((m) => ({
            id: m.movie_id,
            tmdbId: m.movie_id,
            title: m.title,
            poster: m.poster,
            year: m.year,
            rating: 0,
            mood: [],
            tags: [],
            synopsis: "",
          }))
        );
      }
    }
    load();
  }, [user]);

  if (!user) {
    return <div className="container section">Please log in to view your watchlist.</div>;
  }

  return (
    <section className="container section">
      <h2>My Watchlist</h2>
      <div className="grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}