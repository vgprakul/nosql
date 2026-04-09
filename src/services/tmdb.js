const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/original";
const TMDB_POSTER = "https://image.tmdb.org/t/p/w500";

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER_TOKEN}`,
  "Content-Type": "application/json",
};

async function tmdbFetch(path) {
  const res = await fetch(`${TMDB_BASE}${path}`, { headers });
  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status}`);
  }
  return res.json();
}

export async function fetchPopularMovies() {
  const data = await tmdbFetch("/movie/popular?language=en-US&page=1");
  return data.results || [];
}

export async function fetchTopRatedMovies() {
  const data = await tmdbFetch("/movie/top_rated?language=en-US&page=1");
  return data.results || [];
}

export async function fetchNowPlayingMovies() {
  const data = await tmdbFetch("/movie/now_playing?language=en-US&page=1");
  return data.results || [];
}

export async function discoverMovies({ genre = "", country = "", year = "" } = {}) {
  const params = new URLSearchParams({
    language: "en-US",
    sort_by: "popularity.desc",
    page: "1",
  });

  if (genre) params.append("with_genres", genre);
  if (country) params.append("with_origin_country", country);
  if (year) params.append("primary_release_year", year);

  const data = await tmdbFetch(`/discover/movie?${params.toString()}`);
  return data.results || [];
}

export async function searchMovies(query) {
  if (!query) return [];
  const data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`);
  return data.results || [];
}

export async function fetchMovieDetails(id) {
  return tmdbFetch(`/movie/${id}?language=en-US`);
}

export async function fetchMovieVideos(id) {
  const data = await tmdbFetch(`/movie/${id}/videos?language=en-US`);
  return data.results || [];
}

export async function fetchGenres() {
  const data = await tmdbFetch("/genre/movie/list?language=en");
  return data.genres || [];
}

export function mapTmdbMovie(movie) {
  return {
    id: movie.id,
    tmdbId: movie.id,
    slug: String(movie.id),
    title: movie.title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    country: movie.original_language?.toUpperCase() || "N/A",
    language: movie.original_language || "N/A",
    genre: movie.genre_ids || [],
    mood: [],
    poster: movie.poster_path ? `${TMDB_POSTER}${movie.poster_path}` : "",
    backdrop: movie.backdrop_path ? `${TMDB_IMAGE}${movie.backdrop_path}` : "",
    synopsis: movie.overview || "No overview available.",
    curatorNote: "",
    featured: false,
    tags: [],
    rating: movie.vote_average || 0,
  };
}