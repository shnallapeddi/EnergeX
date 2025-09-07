import { useEffect, useState } from "react";
import api from "./lib/api"; // axios instance (Vite proxy forwards /api to http://localhost:8000)
// import "./App.css"; // keep if you had styling here

type Status = { kind: "success" | "error"; message: string } | null;

type Post = {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
};

export default function App() {
  // ----- Register -----
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // ----- Login -----
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // ----- Posts -----
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<Status>(null);

  // ----- Create post -----
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);

  // Restore token on first load
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);

  // Load posts when token appears/changes
  useEffect(() => {
    if (token) fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/register", {
        name,
        email: regEmail,
        password: regPassword,
      });
      setStatus({ kind: "success", message: `Registered: ${regEmail}` });
      setName(""); setRegEmail(""); setRegPassword("");
    } catch (err) {
      setStatus({ kind: "error", message: "Register failed" });
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post("/login", { email, password });
      setToken(data.token);
      localStorage.setItem("token", data.token);   // persist
      setStatus({ kind: "success", message: "Logged in" });
      await fetchPosts();
    } catch (err) {
      setStatus({ kind: "error", message: "Login failed" });
    }
  }

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
    setPosts([]);
    setStatus({ kind: "success", message: "Logged out" });
  }

  async function fetchPosts() {
    if (!token) return;
    // If you ever want to hit the Node cache instead:
    // const { data } = await api.get<Post[]>("http://localhost:4000/cache/posts");
    const { data } = await api.get<Post[]>("/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(data);
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!title.trim() || !content.trim()) return;

    try {
      setCreating(true);
      await api.post(
        "/posts",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setContent("");
      await fetchPosts(); // refresh list
    } catch (err) {
      console.error(err);
      setStatus({ kind: "error", message: "Failed to create post" });
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>EnergeX — AI</h1>
        <p>Register · Login · View posts (from your Lumen API)</p>
        {status && <div className={`status ${status.kind}`}>{status.message}</div>}
      </header>

      <main className="container">
        {/* Forms */}
        <div className="grid">
          <section className="card">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <input
                className="input"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="input"
                placeholder="Email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <input
                className="input"
                placeholder="Password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <button className="button" type="submit">Create account</button>
            </form>
          </section>

          <section className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Login</h2>
              {token && (
                <button className="button" onClick={handleLogout} type="button">
                  Logout
                </button>
              )}
            </div>
            <form onSubmit={handleLogin}>
              <input
                className="input"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="button" type="submit">Sign in</button>
            </form>
          </section>
        </div>

        {/* Create Post (only when logged in) */}
        {token && (
          <section className="card" style={{ maxWidth: 520, margin: "1rem auto" }}>
            <h2>Add a new post</h2>
            <form onSubmit={handleCreatePost}>
              <input
                className="input"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <textarea
                className="input"
                placeholder="Content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ marginBottom: 10 }}
              />
              <button className="button" type="submit" disabled={creating}>
                {creating ? "Publishing…" : "Publish"}
              </button>
            </form>
          </section>
        )}

        {/* Posts */}
        <section className="card posts" style={{ display: token ? "block" : "none" }}>
          <h2>Posts</h2>
          {posts.length === 0 ? (
            <div className="post-meta">No posts yet.</div>
          ) : (
            posts.map((p) => (
              <article key={p.id} className="post">
                <div className="post-title">{p.title}</div>
                <div>{p.content}</div>
                <div className="post-meta">
                  #{p.id} • user {p.user_id} • {new Date(p.created_at).toLocaleString()}
                </div>
              </article>
            ))
          )}
        </section>

        {!token && (
          <div className="post-meta" style={{ marginTop: 16 }}>
            (Login to load posts)
          </div>
        )}
      </main>
    </div>
  );
}

