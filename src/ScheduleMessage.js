import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // only Link, no Router

export default function ScheduleMessage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [dateSelection, setDateSelection] = useState("");
  const [timeSelection, setTimeSelection] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [textToSend, setTextToSend] = useState("");
  const [groups, setGroups] = useState([]) 
  const token = process.env.REACT_APP_GROUPME_ID;
  /*
  this is a useEffect that will run once the page is loaded
  this will make an API call to the backend to get all the groupmes 
  that the demo account is associated with
  when the group is retrieved, it is retreived as an object
  I just need the group name so I can pass it down as a value in 
  the dropdown
  */
  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await axios.get(
          `https://api.groupme.com/v3/groups?token=${token}`
        );
        // the line above makes the API call to group server
        const formattedGroups = res.data.response.map((eachItem) => ({
        group_id: eachItem.group_id,
        group_name: eachItem.name,
      }));
      // this takes the response, and loop through each iteration
      // and then saves only 2 of the many values.
      // it saves the group_id and the group_name
        setGroups(formattedGroups)
        // the useState value that will be passed down
      } catch (err) {
        console.error("❌ Error fetching groups:", err.response?.data || err.message);
      }
      // error handling
    }
    fetchGroups();
  }, [token]); // this useEffect will run everytime the token is changed

  // Send message to selected group


  /*
  This is the function that we will use to send the message to be
  scheduled. I am using Django/python/Node as a backend to sched text messag
  */
  async function sendMessage() {

    if (!selectedGroup) {
      setStatus("⚠️ Please select a group");
      return;
      // this forces the user to always select a group, or else it will send an alert
    }
    if (textToSend.length === 0) {
      setStatus("⚠️ Please type a message");
      return;
    }

    // this forces the user to always place a message, or else it will send an alert
    const url = `https://raw-agentofgod.pythonanywhere.com/scheduled_messages_list` // this is the base URL
    // const url = `https://api.groupme.com/v3/groups/${selectedGroup.id}/messages?token=${token}`;
    const payload = {
        message: textToSend,
        username: 1,
        group_id: selectedGroup['group_id'],
        group_name: selectedGroup['group_name'],
        date: dateSelection,
        time: timeSelection
    };
    // this is the payload from the frontend that we will send to the backend

    try {
      const res = await axios.post(url, payload)
      if (typeof(res.data.id) == "number"){
        setStatus('Successfully Scheudled Message')
        alert("Successfully Scheudled Message")
        textToSend("")
      }
      else{
        setStatus('Failed to schedule')
      }
    } catch (err) {
      setStatus('Failed to schedule')
      console.error("❌ Error sending message:", err.response?.data || err.message);
    }
  }

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
          <Link to="/messages" style={{ color: "white", textDecoration: "none" }}>
            Messages
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
              groups.find((g) => g.group_id === e.target.value) || null
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
          {groups.map((group) => {
    return (<option key={group.group_id} value={group.group_id}>
              {group.group_name}
            </option>);
          
})}
        </select>

        {selectedGroup && (
          <div style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>
            ✅ Selected: <strong>{selectedGroup.group_name}</strong>        
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
        onClick={()=>sendMessage()}
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