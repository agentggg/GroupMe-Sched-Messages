import { useContext } from "react";
import { LoginContext } from "./LoginContext";

export default function Logout() {
  const { setAuthenticated } = useContext(LoginContext);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    setAuthenticated(false);
  };

  return (
    <button onClick={handleLogout} className="secondary-button logout-button">
      Logout
    </button>
  );
}
