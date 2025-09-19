// LoginPage.js
import  { useState, useContext } from "react";
import { LoginContext } from "./LoginContext";
import axios from 'axios'

export default function Login() {
  const { setAuthenticated } = useContext(LoginContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); 
  }
 
    const login_request = async() => {
        try{
        const response = await axios.post("https://raw-agentofgod.pythonanywhere.com/login_verification",{
        // const response = await axios.post("http://127.0.0.1:8000/login_verification",{
            username:username,
            password:password
        })
        setLoading(false)
        if (!response.data.token){
            setError("Login failed. Please try again")
            setLoading(false)
        }else{
            setAuthenticated(true)
            localStorage.setItem('username', response.data.username);
        }
        }catch(err){
            console.log('error')
            setError('Network Error')
            setLoading(false)
        }
    }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to continue</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="username"
            placeholder="username"
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading} onClick={login_request}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={styles.footer}>
          <a href="/forgot-password" style={styles.link}>
            Forgot Password?
          </a>
          <a href="/signup" style={styles.link}>
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "1rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
  },
  title: {
    margin: "0 0 0.5rem",
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    margin: "0 0 1.5rem",
    color: "#666",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem 1rem",
    border: "1px solid #ddd",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    outline: "none",
    transition: "0.2s",
  },
  button: {
    padding: "0.9rem 1rem",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: "bold",
    background: "#667eea",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
  },
  buttonHover: {
    background: "#5a67d8",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
  footer: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
  },
  link: {
    fontSize: "0.9rem",
    color: "#667eea",
    textDecoration: "none",
  },
};