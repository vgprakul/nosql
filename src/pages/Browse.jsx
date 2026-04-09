import { useEffect, useMemo, useState } from "react";
import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";
import { discoverMovies, fetchGenres, mapTmdbMovie, searchMovies } from "../services/tmdb";
import curatedMovies from "../data/curatedMovies";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function applyCurated(mappedMovies) {
  return mappedMovies.map((m) => {
    const curated = curatedMovies.find((c) => c.tmdbId === m.id);
    return curated ? { ...m, ...curated } : m;
  });
}

export default function Browse() {
  const { user } = useAuth();
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGenres().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    async function load() {
      let result = [];
      if (search.trim()) {
        result = await searchMovies(search.trim());
      } else {
        result = await discoverMovies({ genre: selectedGenre, country: selectedCountry });
      }

      const mapped = result.map(mapTmdbMovie);
      setMovies(applyCurated(mapped));
    }

    load().catch(console.error);
  }, [selectedGenre, selectedCountry, search]);

  async function addToWatchlist(movie) {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    const { error } = await supabase.from("watchlists").upsert(
      {
        user_id: user.id,
        movie_id: movie.id,
        title: movie.title,
        poster: movie.poster,
        year: movie.year,
      },
      { onConflict: "user_id,movie_id" }
    );

    if (error) alert(error.message);
    else alert("Added to watchlist");
  }

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const moodMatch = selectedMood ? movie.mood?.includes(selectedMood) : true;
      return moodMatch;
    });
  }, [movies, selectedMood]);

  const countries = ["US", "KR", "FR", "JP", "HK", "IN", "GB"];

  return (
    <section className="container section">
      <h2>Browse the Collection</h2>

      <FilterBar
        genres={genres}
        countries={countries}
        selectedGenre={selectedGenre}
        selectedMood={selectedMood}
        selectedCountry={selectedCountry}
        search={search}
        onGenreChange={setSelectedGenre}
        onMoodChange={setSelectedMood}
        onCountryChange={setSelectedCountry}
        onSearchChange={setSearch}
      />

      <div className="grid">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onAddWatchlist={addToWatchlist} />
        ))}
      </div>
    </section>
  );
}