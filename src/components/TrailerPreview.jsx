import { useEffect, useState } from "react";
import { fetchMovieVideos } from "../services/tmdb";

export default function TrailerPreview({ movieId, active }) {
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadTrailer() {
      if (!active || !movieId) return;
      try {
        const videos = await fetchMovieVideos(movieId);
        const trailer =
          videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          videos.find((v) => v.site === "YouTube");
        if (!ignore && trailer) setTrailerKey(trailer.key);
      } catch (err) {
        console.error(err);
      }
    }

    loadTrailer();
    return () => {
      ignore = true;
    };
  }, [movieId, active]);

  if (!active || !trailerKey) return null;

  return (
    <div className="trailer-preview">
      <iframe
        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`}
        title="Trailer preview"
        allow="autoplay; encrypted-media"
      />
    </div>
  );
}