import { Link } from "react-router-dom";
import { useState } from "react";
import TrailerPreview from "./TrailerPreview";

export default function MovieCard({ movie, onAddWatchlist }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="movie-media">
        {hovered ? (
          <TrailerPreview movieId={movie.tmdbId || movie.id} active={hovered} />
        ) : (
          <img src={movie.poster} alt={movie.title} className="movie-poster" />
        )}
      </div>

      <div className="movie-content">
        <h3>{movie.title}</h3>
        <p>{movie.year} • ★ {Number(movie.rating).toFixed(1)}</p>
        {movie.mood?.length > 0 && <p className="small">{movie.mood.join(", ")}</p>}
        {movie.curatorNote && <p className="curator-note">{movie.curatorNote}</p>}

        <div className="card-actions">
          <Link to={`/movie/${movie.id}`} className="btn">Open</Link>
          {onAddWatchlist && (
            <button className="btn ghost" onClick={() => onAddWatchlist(movie)}>
              + Watchlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}