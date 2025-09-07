import React from "react";
import api, { setAuthToken } from "./lib/api";

/** ---------- Types ---------- */
type Post = {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at?: string;
};

type LoginResponse = {
  token?: string;
  [k: string]: any; // tolerate extra fields
};

type RegisterResponse = {
  message?: string;
  user?: any;
  [k: string]: any;
};

/** ---------- Helpers ---------- */
function errMsg(e: any): string {
  const r = e?.response;
  return (
    r?.data?.message ||
    r?.data?.error ||
    e?.message ||
    "Something went wrong"
  );
}

function normalizePosts(payload: any): Post[] {
  // Be resilient to different shapes
  if (Array.isArray(payload)) return payload as Post[];
  if (Array.isArray(payload?.data)) return payload.data as Post[];
  if (Array.isArray(payload?.posts)) return payload.posts as Post[];
  return [];
}

/** ---------- Component ---------- */
export default function App() {
  // auth
  const [loggedIn, setLoggedIn] = React.useState<boolean>(
    !!localStorage.getItem("token")
  );

  // register
  const [name, setName] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  thepass: {
  }
  const [regPassword, setRegPassword] = React.useState("");
  const [regStatus, setRegStatus] = React.useState<string | null>(null);

  // login
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginStatus, setLoginStatus] = React.useState<string | null>(null);

  // posts
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [postsMsg, setPostsMsg] = React.useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = React.useState(false);

  // create post
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [createStatus, setCreateStatus] = React.useState<string | null>(null);

  /** Load posts (safe/no crash even if response is odd) */
  const loadPosts = React.useCallback(async () => {
    setLoadingPosts(true);
    setPostsMsg(null);
    try {
      const res = await api.get("/posts");
      const list = normalizePosts(res.data);
      setPosts(list);
      if (!Array.isArray(list)) {
        setPostsMsg("Unexpected /posts response.");
      } else if (list.length === 0) {
        setPostsMsg("No posts yet.");
      }
    } catch (e: any) {
      // Most likely 401 when not logged in
      if (e?.response?.status === 401) {
        setPosts([]);
        setPostsMsg("Login to load posts");
      } else {
        setPosts([]);
        setPostsMsg(errMsg(e));
      }
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  React.useEffect(() => {
    // Try to load posts on first paint; if protected it will show “Login to load posts”
    loadPosts();
  }, [loadPosts]);

  /** Register */
  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegStatus(null);
    try {
      const body = { name, email: regEmail, password: regPassword };
      const res = await api.post<RegisterResponse>("/register", body);
      setRegStatus(res.data?.message || "Registered");
    } catch (e) {
      setRegStatus(errMsg(e));
    }
  }

  /** Login */
  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginStatus(null);
    try {
      const res = await api.post<LoginResponse>("/login", { email, password });
      const token = res.data?.token;
      if (!token) {
        setLoginStatus("Login succeeded but token missing in response.");
        return;
      }
      setAuthToken(token); // stores in localStorage + sets axios header
      setLoggedIn(true);
      setLoginStatus("Logged in");
      // Refresh posts now that we’re authenticated
      loadPosts();
    } catch (e) {
      setLoginStatus(errMsg(e));
    }
  }

  /** Logout */
  function onLogout() {
    setAuthToken(undefined);
    setLoggedIn(false);
    setLoginStatus("Logged out");
    setPosts([]);
    setPostsMsg("Login to load posts");
  }

  /** Create post */
  async function onCreatePost(e: React.FormEvent) {
    e.preventDefault();
    setCreateStatus(null);
    try {
      const res = await api.post<Post>("/posts", { title, content });
      // Optimistically prepend the new post
      const created = res.data as any;
      const newPost: Post =
        typeof created === "object" && created
          ? (created as Post)
          : { id: Date.now(), title, content, user_id: 0 };

      setPosts((prev) => [newPost, ...prev]);
      setTitle("");
      setContent("");
      setCreateStatus("Published");
    } catch (e) {
      setCreateStatus(errMsg(e));
    }
  }

  /** ---------- UI ---------- */
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
      <header style={{ textAlign: "center", padding: "32px 16px" }}>
        <h1 style={{ fontSize: 40, margin: 0 }}>EnergeX — AI</h1>
        <div style={{ color: "#6b7280", marginTop: 6 }}>
          Register · Login · View posts (from your Lumen API)
        </div>
      </header>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "0 16px 48px" }}>
        {/* Register */}
        <section
          style={{
            borderRadius: 12,
            boxShadow: "0 6px 22px rgba(0,0,0,0.06)",
            padding: 20,
            marginBottom: 24,
            background: "white",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Register</h3>
          {regStatus && (
            <div style={{ color: regStatus.includes("Registered") ? "green" : "crimson", marginBottom: 8 }}>
              {regStatus}
            </div>
          )}
          <form onSubmit={onRegister}>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Email"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Password"
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              style={inputStyle}
            />
            <button style={btnStyle}>Create account</button>
          </form>
        </section>

        {/* Login */}
        <section
          style={{
            borderRadius: 12,
            boxShadow: "0 6px 22px rgba(0,0,0,0.06)",
            padding: 20,
            marginBottom: 24,
            background: "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ marginTop: 0 }}>Login</h3>
            {loggedIn && (
              <button onClick={onLogout} style={smallBtnStyle}>
                Logout
              </button>
            )}
          </div>
          {loginStatus && (
            <div
              style={{
                color:
                  loginStatus === "Logged in" || loginStatus === "Logged out"
                    ? "#2563eb"
                    : "crimson",
                marginBottom: 8,
              }}
            >
              {loginStatus}
            </div>
          )}
          {!loggedIn && (
            <form onSubmit={onLogin}>
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              <button style={btnStyle}>Sign in</button>
            </form>
          )}
        </section>

        {/* Create post */}
        <section
          style={{
            borderRadius: 12,
            boxShadow: "0 6px 22px rgba(0,0,0,0.06)",
            padding: 20,
            marginBottom: 24,
            background: "white",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Add a new post</h3>
          {createStatus && (
            <div
              style={{
                marginBottom: 8,
                color: createStatus === "Published" ? "green" : "crimson",
              }}
            >
              {createStatus}
            </div>
          )}
          {!loggedIn ? (
            <div style={{ color: "#6b7280" }}>Login to publish.</div>
          ) : (
            <form onSubmit={onCreatePost}>
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <button style={btnStyle}>Publish</button>
            </form>
          )}
        </section>

        {/* Posts */}
        <section
          style={{
            borderRadius: 12,
            boxShadow: "0 6px 22px rgba(0,0,0,0.06)",
            padding: 20,
            marginBottom: 24,
            background: "white",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Posts</h3>

          {loadingPosts ? (
            <div className="post-meta" style={{ color: "#6b7280" }}>
              Loading…
            </div>
          ) : Array.isArray(posts) && posts.length > 0 ? (
            posts.map((p) => (
              <article
                key={p.id}
                className="post"
                style={{ padding: "12px 0", borderBottom: "1px solid #eee" }}
              >
                <div className="post-title" style={{ fontWeight: 600 }}>
                  {p.title}
                </div>
                <div style={{ marginTop: 6 }}>{p.content}</div>
                <div className="post-meta" style={{ color: "#6b7280", marginTop: 8 }}>
                  #{p.id} · user {p.user_id}
                  {p.created_at ? ` · ${new Date(p.created_at).toLocaleString()}` : ""}
                </div>
              </article>
            ))
          ) : (
            <div className="post-meta" style={{ color: "#6b7280" }}>
              {postsMsg ?? "No posts yet."}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/** ---------- Tiny inline styles ---------- */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  outline: "none",
  marginBottom: 10,
  fontSize: 14,
};

const btnStyle: React.CSSProperties = {
  background: "#0ea5e9",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 600,
};

const smallBtnStyle: React.CSSProperties = {
  ...btnStyle,
  padding: "6px 10px",
  fontSize: 13,
};
