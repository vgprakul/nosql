function overlapScore(a = [], b = []) {
  const sa = new Set(a);
  const sb = new Set(b);

  let score = 0;

  for (const x of sa) {
    if (sb.has(x)) score += 1;
  }

  return score;
}

function curatedBoost(movie) {
  return movie.featured ? 40 : 0;
}

export function contentBasedRecommendations(currentMovie, movies, limit = 10) {

  return movies
    .filter(m => m.id !== currentMovie.id)
    .map(m => {

      const genreScore = overlapScore(currentMovie.genre, m.genre) * 3;
      const moodScore = overlapScore(currentMovie.mood, m.mood) * 4;
      const tagScore = overlapScore(currentMovie.tags, m.tags) * 5;

      const score =
        curatedBoost(m) +
        genreScore +
        moodScore +
        tagScore;

      return { ...m, score };
    })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function collaborativeRecommendations(userRatings, allRatings, movies, limit = 10) {

  if (!userRatings?.length) return [];

  const myMovies = new Set(userRatings.map(r => r.movie_id));

  const similarity = {};

  for (const r of allRatings) {
    if (myMovies.has(r.movie_id)) {
      similarity[r.user_id] = (similarity[r.user_id] || 0) + r.rating;
    }
  }

  const scores = {};

  for (const r of allRatings) {

    if (myMovies.has(r.movie_id)) continue;

    const sim = similarity[r.user_id] || 0;

    if (sim > 0) {
      scores[r.movie_id] =
        (scores[r.movie_id] || 0) + sim * r.rating;
    }
  }

  return movies
    .filter(m => scores[m.id])
    .map(m => ({ ...m, score: scores[m.id] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function hybridRecommendations(seedMovie, movies, userRatings, allRatings, limit = 12) {

  const content = contentBasedRecommendations(seedMovie, movies, 30);
  const collab = collaborativeRecommendations(userRatings, allRatings, movies, 30);

  const map = new Map();

  content.forEach((m, i) => {
    map.set(m.id, { ...m, hybridScore: 120 - i * 3 });
  });

  collab.forEach((m, i) => {
    const existing = map.get(m.id);

    if (existing) {
      existing.hybridScore += 120 - i * 3;
    } else {
      map.set(m.id, { ...m, hybridScore: 120 - i * 3 });
    }
  });

  return [...map.values()]
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, limit);
}