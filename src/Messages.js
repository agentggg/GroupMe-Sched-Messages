import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    group_id: "",
    group_name: "",
    message: "",
    date: "",
    time: "",
    sent: false,
    username: "",
  });

  const apiUrl = "https://raw-agentofgod.pythonanywhere.com"; // backend URL

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await axios.get(`${apiUrl}/scheduled_messages_list`);
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const startEdit = (msg) => {
    setEditing(msg.id);
    setFormData(msg);
  };

  async function updateMessage(e) {
    e.preventDefault();
    try {
      const res = await axios.put(`${apiUrl}/scheduled_messages_update`, formData);
      console.log("✅ Updated:", res.data);
      setEditing(null);
      fetchMessages();
    } catch (err) {
      console.error("❌ Error updating:", err.response?.data || err.message);
    }
  }

  async function deleteMessage(id) {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(`${apiUrl}/scheduled_messages_delete/${id}/`);
      fetchMessages();
    } catch (err) {
      console.error("❌ Error deleting:", err.response?.data || err.message);
    }
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "24px",
          color: "#222",
          textAlign: "center",
        }}
      >
        📩 Scheduled Messages
      </h2>

      {messages.length === 0 && (
        <p style={{ textAlign: "center", color: "#777" }}>No scheduled messages yet.</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
            transition: "all 0.2s ease",
          }}
        >
          {editing === msg.id ? (
            <form onSubmit={updateMessage} style={{ display: "grid", gap: "12px" }}>
              <input type="hidden" name="id" value={formData.id} />

              <input
                name="group_name"
                value={formData.group_name}
                onChange={handleChange}
                placeholder="Group Name"
                style={inputStyle}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                style={{ ...inputStyle, height: "80px", resize: "none" }}
              />
              <div className="message-form-row" style={{ display: "flex", gap: "12px" }}>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  name="sent"
                  checked={formData.sent}
                  onChange={handleChange}
                />
                <span style={{ fontSize: "14px", color: "#444" }}>Mark as Sent</span>
              </label>

              <div className="message-buttons" style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={buttonPrimary}>
                  💾 Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  style={buttonSecondary}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 style={{ margin: "0 0 6px", color: "#007acc" }}>{msg.group_name}</h3>
              <p style={{ margin: "0 0 8px", fontSize: "15px", color: "#333" }}>
                {msg.message}
              </p>
              <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#666" }}>
                📅 {msg.date} ⏰ {msg.time}
              </p>
              <p style={{ fontSize: "14px", color: msg.sent ? "#28a745" : "#d9534f" }}>
                Sent: {msg.sent ? "✅ Yes" : "❌ No"}
              </p>

              <div className="message-buttons" style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button onClick={() => startEdit(msg)} style={buttonPrimary}>
                  ✏️ Edit
                </button>
                <button onClick={() => deleteMessage(msg.id)} style={buttonDanger}>
                  🗑️ Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* 🔹 Responsive CSS */}
      <style>{`
        @media (max-width: 600px) {
          .message-form-row {
            flex-direction: column;
          }
          .message-buttons {
            flex-direction: column;
          }
          .message-buttons button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

// 🔹 Shared styles
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px",
  outline: "none",
  transition: "border 0.2s",
};

const buttonPrimary = {
  flex: 1,
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#007aff",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const buttonSecondary = {
  flex: 1,
  padding: "10px 14px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  background: "#f5f5f5",
  color: "#333",
  cursor: "pointer",
};

const buttonDanger = {
  flex: 1,
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#d9534f",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};