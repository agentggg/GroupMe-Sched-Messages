// App.js
import  {useState} from "react";
import { LoginContext } from "./LoginContext"
import { Routes, Route } from "react-router-dom";
import ScheduleMessage from "./ScheduleMessage";
import Messages from "./Messages";
import Login from "./Login";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <LoginContext.Provider value={{authenticated, setAuthenticated}}>
      <Routes>
      <Route 
          path="/Login" 
          element={
            authenticated ? <Messages /> : <Login />
          }
        />  
        <Route 
          path="/" 
          element={
            authenticated ? <ScheduleMessage /> : <Login />
          } />
          </Routes>
    </LoginContext.Provider>

  );
}