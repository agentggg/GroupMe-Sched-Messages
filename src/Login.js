import { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "./LoginContext";
import { API_BASE_URL } from "./api";

export default function Login() {
  const { setAuthenticated } = useContext(LoginContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const highlights = [
    "Plan messages ahead without losing the natural feel of your chats.",
    "Keep important reminders, updates, and check-ins on schedule.",
    "Pick up where you left off with a clean, focused workspace.",
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login_verification`, {
        username,
        password,
      });

      if (!response.data.token) {
        setError("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("username", response.data.username);
      localStorage.setItem("first_name", response.data.first_name || "");
      localStorage.setItem("last_name", response.data.last_name || "");
      setAuthenticated(true);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "We couldn't sign you in right now. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-intro">
          <p className="eyebrow">GroupMe Scheduler</p>
          <h1 className="auth-title">Stay ahead of every GroupMe message.</h1>
          <p className="auth-subtitle">
            Schedule posts for the right moment, keep your groups informed, and
            come back to a calmer inbox.
          </p>
          <div className="auth-highlights">
            {highlights.map((item) => (
              <p key={item} className="auth-highlight-card">
                {item}
              </p>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-form-copy">
            <h2>Sign in</h2>
            <p>Use your GroupMe credentials to get to your scheduled messages.</p>
          </div>
          <input
            type="text"
            placeholder="GroupMe username"
            className="text-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="text-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
