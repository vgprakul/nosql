export default function FilterBar({
  genres,
  countries,
  selectedGenre,
  selectedMood,
  selectedCountry,
  search,
  onGenreChange,
  onMoodChange,
  onCountryChange,
  onSearchChange,
}) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search title..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select value={selectedGenre} onChange={(e) => onGenreChange(e.target.value)}>
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>

      <select value={selectedMood} onChange={(e) => onMoodChange(e.target.value)}>
        <option value="">All Moods</option>
        <option value="Melancholic">Melancholic</option>
        <option value="Passionate">Passionate</option>
        <option value="Elegant">Elegant</option>
        <option value="Stylish">Stylish</option>
        <option value="Slow Cinema">Slow Cinema</option>
        <option value="Reflective">Reflective</option>
      </select>

      <select value={selectedCountry} onChange={(e) => onCountryChange(e.target.value)}>
        <option value="">All Countries</option>
        {countries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}