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
      setError(err.response?.data?.error || "Network error");
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div>
          <p className="eyebrow">GroupMe Scheduler</p>
          <h1 className="auth-title">Sign in to schedule messages</h1>
          <p className="auth-subtitle">
            This webview now uses the live backend contract, including the
            dynamic GroupMe groups endpoint.
          </p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="Username"
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
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="auth-help">
            <div>
              <span className="auth-help-label">Backend</span>
              <strong>{API_BASE_URL}</strong>
            </div>
            <div>
              <span className="auth-help-label">Experience</span>
              <strong>Desktop-first and responsive</strong>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
