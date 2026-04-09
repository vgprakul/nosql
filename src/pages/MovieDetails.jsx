import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { mapTmdbMovie } from "../services/tmdb";
import curatedMovies from "../data/curatedMovies";
import { contentBasedRecommendations, hybridRecommendations } from "../utils/recommendations";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const API = "https://api.themoviedb.org/3";

export default function MovieDetails() {

  const { id } = useParams();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [pool, setPool] = useState([]);

  const [allRatings, setAllRatings] = useState([]);
  const [myRatings, setMyRatings] = useState([]);

  useEffect(() => {

    async function load() {

      const movieRes = await fetch(`${API}/movie/${id}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER_TOKEN}`
        }
      });

      const movieData = await movieRes.json();

      const popularRes = await fetch(`${API}/movie/popular?page=1`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER_TOKEN}`
        }
      });

      const popularData = await popularRes.json();

      const mappedMovie = mapTmdbMovie(movieData);

      const curated = curatedMovies.find(c => c.tmdbId === movieData.id);

      const finalMovie = curated
        ? { ...mappedMovie, ...curated }
        : mappedMovie;

      const mappedPool = popularData.results.map(m => {

        const mapped = mapTmdbMovie(m);

        const cur = curatedMovies.find(c => c.tmdbId === m.id);

        return cur ? { ...mapped, ...cur } : mapped;
      });

      setMovie(finalMovie);
      setPool(mappedPool);

      const { data } = await supabase.from("ratings").select("*");
      setAllRatings(data || []);

      if (user) {
        const { data: my } = await supabase
          .from("ratings")
          .select("*")
          .eq("user_id", user.id);

        setMyRatings(my || []);
      }
    }

    load();

  }, [id, user]);

  const moreLikeThis = useMemo(() => {
    if (!movie) return [];
    return contentBasedRecommendations(movie, pool, 8);
  }, [movie, pool]);

  const hybrid = useMemo(() => {
    if (!movie) return [];
    return hybridRecommendations(movie, pool, myRatings, allRatings, 8);
  }, [movie, pool, myRatings, allRatings]);

  if (!movie) return <div className="container section">Loading...</div>;

  return (
    <section className="container section details">

      <div className="details-layout">

        <img src={movie.poster} className="details-poster" />

        <div>
          <h1>{movie.title}</h1>

          <p>{movie.synopsis}</p>

          {movie.curatorNote && (
            <div className="curator-box">
              <h3>Why we picked this</h3>
              <p>{movie.curatorNote}</p>
            </div>
          )}

        </div>

      </div>

      <div className="section">
        <h2>More like this</h2>

        <div className="grid">
          {moreLikeThis.map(m => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Hybrid recommendations</h2>

        <div className="grid">
          {hybrid.map(m => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </div>

    </section>
  );
}