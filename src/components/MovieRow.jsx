import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies, onAddWatchlist }) {
  if (!movies?.length) return null;

  return (
    <section className="container section">
      <h2>{title}</h2>
      <div className="row-scroll">
        {movies.map((movie) => (
          <div key={movie.id} className="row-item">
            <MovieCard movie={movie} onAddWatchlist={onAddWatchlist} />
          </div>
        ))}
      </div>
    </section>
  );
}