import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // if using react-router
import axios from "axios";

export default function ScheduleMessage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [dateSelection, setDateSelection] = useState("");
  const [timeSelection, setTimeSelection] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [textToSend, setTextToSend] = useState("");
  const [group, setGroup] = useState("")
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch groups on load
  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await axios.get(
          `https://api.groupme.com/v3/groups?token=${token}`
        );
        setGroups(res.data.response || []);
      } catch (err) {
        console.error("❌ Error fetching groups:", err.response?.data || err.message);
      }
    }
    fetchGroups();
  }, [token]);

  // Send message to selected group
  async function sendMessage() {
    if (!selectedGroup) {
      alert("⚠️ Please select a group");
      return;
    }
    if (!message) {
      alert("⚠️ Please type a message");
      return;
    }

    const url = `https://api.groupme.com/v3/groups/${selectedGroup.id}/messages?token=${token}`;
    const payload = {
      message: {
        text: message,
        source_guid: crypto.randomUUID() // unique ID
      }
    };

    try {
      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("✅ Message sent:", res.data);
      alert("✅ Message sent successfully!");
      setMessage(""); // clear input
    } catch (err) {
      console.error("❌ Error sending message:", err.response?.data || err.message);
    }
  }


  const groupInfo = [
    { group_id: "1", group_name: "Test Group 1" },
    { group_id: "2", group_name: "Test Group 2" },
  ];

  const postCall = () => {
    setStatus("Sending...");
    setTimeout(() => setStatus("✅ Scheduled"), 1000); // mock
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "16px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          backgroundColor: "#007acc",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Left: Brand */}
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>MyApp</div>

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
            display: "none",
          }}
          className="hamburger"
        >
          ☰
        </button>

        {/* Nav Links */}
        <div
          style={{ display: menuOpen ? "flex" : "" }}
          className="nav-links"
        >
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
            About
          </Link>
          <Link
            to="/contact"
            style={{ color: "white", textDecoration: "none" }}
          >
            Contact
          </Link>
        </div>
      </nav>

      {/* Status Banner */}
      <p style={{ margin: 0, textAlign: "right", fontWeight: 500 }}>
        Status: {status}
      </p>

      <h1
        style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: 600,
          marginBottom: "24px",
        }}
      >
        📅 Schedule Your Message
      </h1>

      {/* DATE & TIME */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontWeight: 500, marginBottom: "6px" }}>
          Date
        </label>
        <input
          type="date"
          onChange={(e) => setDateSelection(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontWeight: 500, marginBottom: "6px" }}>
          Time
        </label>
        <input
          type="time"
          onChange={(e) => setTimeSelection(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      {/* CONFIRMATION */}
      <div style={{ marginBottom: "20px", fontSize: "15px", color: "#555" }}>
        {dateSelection && timeSelection ? (
          <p style={{ color: "#28a745", fontWeight: 500 }}>
            ✅ Your text will be sent at <br /> {dateSelection} {timeSelection}
          </p>
        ) : (
          <p style={{ color: "#d9534f", fontWeight: 500 }}>
            ‼️ Please provide a scheduled DATE and TIME
          </p>
        )}
      </div>

      {/* GROUP SELECTION */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontWeight: 500, marginBottom: "6px" }}>
          Select Group
        </label>
        <select
          value={selectedGroup ? selectedGroup.group_id : ""}
          onChange={(e) =>
            setSelectedGroup(
              groupInfo.find((g) => g.group_id === e.target.value) || null
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="">-- Select a group --</option>
          {groupInfo.map((group) => (
            <option key={group.group_id} value={group.group_id}>
              {group.group_name}
            </option>
          ))}
        </select>

        {selectedGroup && (
          <div style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>
            ✅ Selected: <strong>{selectedGroup.group_name}</strong> (ID:{" "}
            {selectedGroup.group_id})
          </div>
        )}
      </div>

      {/* MESSAGE BOX */}
      <div style={{ marginBottom: "20px" }}>
        <textarea
          onChange={(e) => setTextToSend(e.target.value)}
          value={textToSend}
          style={{
            width: "100%",
            height: "120px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "16px",
            resize: "none",
            fontSize: "16px",
            lineHeight: 1.4,
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
            outline: "none",
            background: "#f9f9f9",
          }}
          placeholder="Type your message..."
        ></textarea>
      </div>

      {/* iMessage-style preview */}
      {textToSend && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              background: "#007aff",
              color: "white",
              borderRadius: "20px",
              padding: "12px 16px",
              display: "inline-block",
              maxWidth: "75%",
              wordWrap: "break-word",
              fontSize: "15px",
            }}
          >
            {textToSend}
          </p>
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        onClick={postCall}
        style={{
          width: "100%",
          padding: "14px",
          border: "none",
          borderRadius: "12px",
          background: "#007aff",
          color: "white",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
        onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
      >
        🚀 Schedule Message
      </button>

      {/* Embedded CSS for navbar responsiveness */}
      <style>{`
        .nav-links {
          display: flex;
          gap: 20px;
        }
        .hamburger {
          display: none !important;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none;
            flex-direction: column;
            background-color: #007acc;
            position: absolute;
            top: 50px;
            right: 10px;
            padding: 10px;
            border-radius: 6px;
            gap: 10px;
          }
          .hamburger {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}