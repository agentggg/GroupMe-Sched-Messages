// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import ScheduleMessage from "./ScheduleMessage";
import Messages from "./Messages";
// import Contact from "./Contact";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ScheduleMessage />} />
      <Route path="/messages" element={<Messages />} />
      {/* <Route path="/contact" element={<Contact />} /> */}
    </Routes>
  );
}