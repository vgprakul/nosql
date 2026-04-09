import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { user } = useAuth();
  const [tmdbId, setTmdbId] = useState("");
  const [mood, setMood] = useState("");
  const [curatorNote, setCuratorNote] = useState("");
  const [tags, setTags] = useState("");
  const [items, setItems] = useState([]);

  async function load() {
    const { data } = await supabase.from("curations").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveCuration(e) {
    e.preventDefault();

    const payload = {
      tmdb_id: Number(tmdbId),
      mood: mood.split(",").map((x) => x.trim()).filter(Boolean),
      curator_note: curatorNote,
      tags: tags.split(",").map((x) => x.trim()).filter(Boolean),
      featured: true,
      created_by: user?.id || null,
    };

    const { error } = await supabase.from("curations").insert(payload);

    if (error) alert(error.message);
    else {
      setTmdbId("");
      setMood("");
      setCuratorNote("");
      setTags("");
      load();
    }
  }

  if (!user) return <div className="container section">Please log in.</div>;

  return (
    <section className="container section">
      <h2>Admin Curation Panel</h2>

      <form className="admin-form" onSubmit={saveCuration}>
        <input value={tmdbId} onChange={(e) => setTmdbId(e.target.value)} placeholder="TMDB Movie ID" />
        <input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="Moods (comma separated)" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" />
        <textarea
          value={curatorNote}
          onChange={(e) => setCuratorNote(e.target.value)}
          placeholder="Curator note"
        />
        <button className="btn" type="submit">Save Curation</button>
      </form>

      <div className="admin-list">
        {items.map((item) => (
          <div key={item.id} className="admin-item">
            <p><strong>TMDB ID:</strong> {item.tmdb_id}</p>
            <p><strong>Moods:</strong> {(item.mood || []).join(", ")}</p>
            <p><strong>Tags:</strong> {(item.tags || []).join(", ")}</p>
            <p><strong>Note:</strong> {item.curator_note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}