import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

function App() {
  const [health, setHealth] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Appel /health
    fetch(`${BACKEND_URL}/health`)
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setError("Impossible de joindre le backend"));

    // Appel /api/message
    fetch(`${BACKEND_URL}/api/message`)
      .then((r) => r.json())
      .then(setMessage)
      .catch(() => {});
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 TPCI — App Full Stack</h1>

      <div style={styles.card}>
        <h2>Backend /health</h2>
        {error && <p style={styles.error}>{error}</p>}
        {health ? (
          <pre style={styles.pre}>{JSON.stringify(health, null, 2)}</pre>
        ) : (
          !error && <p>Chargement...</p>
        )}
      </div>

      <div style={styles.card}>
        <h2>Backend /api/message</h2>
        {message ? (
          <p style={styles.msg}>{message.message}</p>
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "monospace",
    maxWidth: 600,
    margin: "60px auto",
    padding: "0 20px",
  },
  title: { color: "#0ea5e9", marginBottom: 32 },
  card: {
    background: "#0f172a",
    color: "#e2e8f0",
    borderRadius: 12,
    padding: "24px",
    marginBottom: 20,
    border: "1px solid #1e293b",
  },
  pre: { background: "#1e293b", padding: 12, borderRadius: 8, fontSize: 13 },
  msg: { fontSize: 18, color: "#34d399" },
  error: { color: "#f87171" },
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);