"use client";

import { useState, FormEvent, useEffect } from "react";
import styles from "./page.module.css";

interface Entry {
  username: string;
  movie: string;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [movie, setMovie] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<Entry[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch recent entries on load and after each submission
  const fetchRecent = async () => {
    try {
      const res = await fetch(`${apiUrl}/recent`);
      const data = await res.json();
      if (data.success) setRecent(data.entries);
    } catch {}
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, movie }),
      });
      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        fetchRecent(); // Refresh the list
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.wrapper}>

        {/* ── Form card ── */}
        <div className={styles.card}>
          <div className={styles.icon}>🎬</div>
          <h1 className={styles.title}>Movie Favorites</h1>
          <p className={styles.subtitle}>Tell us your all-time favorite film</p>

          {submitted ? (
            <div className={styles.success}>
              <span className={styles.checkmark}>✓</span>
              <p>
                Thanks, <strong>{username}</strong>!<br />
                <em>{movie}</em> has been saved.
              </p>
              <button
                className={styles.resetBtn}
                onClick={() => { setSubmitted(false); setUsername(""); setMovie(""); }}
              >
                Submit another
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.label} htmlFor="username">Your name</label>
              <input
                id="username"
                className={styles.input}
                type="text"
                placeholder="e.g. Alex"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label className={styles.label} htmlFor="movie">Favorite movie</label>
              <input
                id="movie"
                className={styles.input}
                type="text"
                placeholder="e.g. Inception"
                value={movie}
                onChange={(e) => setMovie(e.target.value)}
                required
              />

              {error && <p className={styles.error}>{error}</p>}

              <button className={styles.submitBtn} type="submit" disabled={loading}>
                {loading ? "Saving…" : "Submit"}
              </button>
            </form>
          )}
        </div>

        {/* ── Recent picks ── */}
        {recent.length > 0 && (
          <div className={styles.recentCard}>
            <h2 className={styles.recentTitle}>
              <span className={styles.recentIcon}>🍿</span> Recently Added
            </h2>
            <ul className={styles.recentList}>
              {recent.map((entry, i) => (
                <li key={i} className={styles.recentItem}>
                  <span className={styles.recentRank}>{i + 1}</span>
                  <div className={styles.recentInfo}>
                    <span className={styles.recentMovie}>{entry.movie}</span>
                    <span className={styles.recentUser}>by {entry.username}</span>
                  </div>
                  <span className={styles.recentFilm}>🎞</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </main>
  );
}
