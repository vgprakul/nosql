import { useEffect, useMemo, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import curatedMovies from "../data/curatedMovies";
import { mapTmdbMovie } from "../services/tmdb";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { hybridRecommendations } from "../utils/recommendations";

const API = "https://api.themoviedb.org/3";

async function fetchManyMovies(endpoint, pages = 4) {
  const requests = [];

  for (let i = 1; i <= pages; i++) {
    requests.push(
      fetch(`${API}${endpoint}?page=${i}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER_TOKEN}`
        }
      }).then(r => r.json())
    );
  }

  const results = await Promise.all(requests);
  return results.flatMap(r => r.results);
}

function mergeCurated(tmdbMovies) {
  return tmdbMovies.map(m => {
    const curated = curatedMovies.find(c => c.tmdbId === m.id);
    const mapped = mapTmdbMovie(m);

    return curated
      ? {
          ...mapped,
          ...curated,
          id: mapped.id,
          tmdbId: mapped.tmdbId
        }
      : mapped;
  });
}

export default function Home() {
  const { user } = useAuth();

  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);

  const [allRatings, setAllRatings] = useState([]);
  const [myRatings, setMyRatings] = useState([]);

  useEffect(() => {
    async function load() {
      const [popularRaw, topRaw, nowRaw] = await Promise.all([
        fetchManyMovies("/movie/popular", 5),
        fetchManyMovies("/movie/top_rated", 3),
        fetchManyMovies("/movie/now_playing", 2)
      ]);

      setPopular(mergeCurated(popularRaw));
      setTopRated(mergeCurated(topRaw));
      setNowPlaying(mergeCurated(nowRaw));

      const { data: ratings } = await supabase.from("ratings").select("*");
      setAllRatings(ratings || []);

      if (user) {
        const { data: my } = await supabase
          .from("ratings")
          .select("*")
          .eq("user_id", user.id);

        setMyRatings(my || []);
      }
    }

    load();
  }, [user]);

  async function addToWatchlist(movie) {
    if (!user) {
      alert("Please login first");
      return;
    }

    await supabase.from("watchlists").upsert({
      user_id: user.id,
      movie_id: movie.id,
      title: movie.title,
      poster: movie.poster,
      year: movie.year
    }, { onConflict: "user_id,movie_id" });

    alert("Added to watchlist");
  }

  const combinedPool = useMemo(() => {
    const map = new Map();

    [...popular, ...topRated, ...nowPlaying].forEach(m =>
      map.set(m.id, m)
    );

    return [...map.values()];
  }, [popular, topRated, nowPlaying]);

  const heroMovie = useMemo(() => {
    return combinedPool.find(m => m.featured) || combinedPool[0];
  }, [combinedPool]);

  const recommended = useMemo(() => {
    if (!combinedPool.length) return [];
    return hybridRecommendations(heroMovie, combinedPool, myRatings, allRatings, 12);
  }, [combinedPool, heroMovie, myRatings, allRatings]);

  return (
    <>
      <HeroBanner movie={heroMovie} />

      <MovieRow
        title="Curator Picks"
        movies={combinedPool.filter(m => m.featured)}
        onAddWatchlist={addToWatchlist}
      />

      <MovieRow
        title="Trending Now"
        movies={popular.slice(0, 20)}
        onAddWatchlist={addToWatchlist}
      />

      <MovieRow
        title="Top Rated"
        movies={topRated.slice(0, 20)}
        onAddWatchlist={addToWatchlist}
      />

      <MovieRow
        title="Recommended For You"
        movies={recommended}
        onAddWatchlist={addToWatchlist}
      />
    </>
  );
}