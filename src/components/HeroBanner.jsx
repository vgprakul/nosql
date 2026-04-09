import { Link } from "react-router-dom";

export default function HeroBanner({ movie }) {
  if (!movie) return null;

  return (
    <section
      className="hero-banner"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.25)), url(${movie.backdrop || movie.poster})`,
      }}
    >
      <div className="hero-content container">
        <p className="eyebrow">Featured tonight</p>
        <h1>{movie.title}</h1>
        <p className="hero-meta">
          {movie.year} • {movie.language?.toUpperCase()} • ★ {Number(movie.rating).toFixed(1)}
        </p>
        <p className="hero-description">{movie.synopsis}</p>
        {movie.curatorNote && (
          <p className="hero-curator"><strong>Curator note:</strong> {movie.curatorNote}</p>
        )}
        <div className="hero-actions">
          <Link to={`/movie/${movie.id}`} className="btn">View Details</Link>
          <Link to="/browse" className="btn ghost">Browse Collection</Link>
        </div>
      </div>
    </section>
  );
}