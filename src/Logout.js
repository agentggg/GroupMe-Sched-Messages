// Logout.js
import { useContext } from "react";
import { LoginContext } from "./LoginContext";

export default function Logout() {
  const { setAuthenticated } = useContext(LoginContext);

  const handleLogout = () => {
    // Clear auth state (and any tokens if needed)
    setAuthenticated(false);

    // Redirect to login page (default: /login)
  };

  return (
    <button onClick={handleLogout} style={styles.button}>
      Logout
    </button>
  );
}

const styles = {
  button: { 
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "6px",
    background: "#e53e3e",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
};