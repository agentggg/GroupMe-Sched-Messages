import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import ScheduleMessage from "./ScheduleMessage";
import Messages from "./Messages";
import Login from "./Login";
import "./App.css";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("username")) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <LoginContext.Provider value={{ authenticated, setAuthenticated }}>
      <Routes>
        <Route
          path="/Login"
          element={authenticated ? <Messages /> : <Login />}
        />
        <Route
          path="/"
          element={authenticated ? <ScheduleMessage /> : <Login />}
        />
        <Route
          path="/messages"
          element={authenticated ? <Messages /> : <Login />}
        />
      </Routes>
    </LoginContext.Provider>
  );
}
