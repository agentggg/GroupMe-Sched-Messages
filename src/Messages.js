import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { API_BASE_URL } from "./api";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageStatus, setPageStatus] = useState("");
  const [username] = useState(localStorage.getItem("username") || "");
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

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const query = username ? `?username=${encodeURIComponent(username)}` : "";
      const response = await axios.get(
        `${API_BASE_URL}/scheduled_messages_list${query}`
      );
      setMessages(Array.isArray(response.data) ? response.data : []);
      setPageStatus("");
    } catch (err) {
      setPageStatus("Unable to load scheduled messages.");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const startEdit = (msg) => {
    setEditing(msg.id);
    setFormData({
      id: msg.id,
      group_id: msg.group_id || "",
      group_name: msg.group_name || "",
      message: msg.message || "",
      date: msg.date || "",
      time: msg.time || "",
      sent: Boolean(msg.sent),
      username: msg.username_value || msg.username || username,
    });
  };

  async function updateMessage(e) {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/scheduled_messages_update`, formData);
      setEditing(null);
      setPageStatus("Message updated.");
      fetchMessages();
    } catch (err) {
      setPageStatus(err.response?.data?.error || "Unable to update message.");
    }
  }

  async function deleteMessage(id) {
    if (!window.confirm("Delete this message?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/scheduled_messages_delete/${id}`);
      setPageStatus("Message deleted.");
      fetchMessages();
    } catch (err) {
      setPageStatus(err.response?.data?.error || "Unable to delete message.");
    }
  }

  return (
    <div className="app-shell">
      <nav className="topbar">
        <div>
          <p className="eyebrow">Tech & Faith</p>
          <h1 className="topbar-title">Scheduled messages</h1>
        </div>
        <div className="topbar-actions">
          <Link to="/" className="nav-link">
            Scheduler
          </Link>
          {username === "agentofgod" && (
            <Link to="/messages" className="nav-link active-link">
              Messages
            </Link>
          )}
          <Logout />
        </div>
      </nav>

      <main className="panel-stack">
        <section className="panel panel-emphasis">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Queue</p>
              <h2>Review and edit scheduled deliveries</h2>
            </div>
            <span className="status-pill">
              {loading ? "Loading..." : `${messages.length} message(s)`}
            </span>
          </div>

          {pageStatus && <p className="page-status">{pageStatus}</p>}

          {!loading && messages.length === 0 && (
            <p className="placeholder-text">No scheduled messages yet.</p>
          )}

          <div className="message-list">
            {messages.map((msg) => (
              <article key={msg.id} className="message-card">
                {editing === msg.id ? (
                  <form onSubmit={updateMessage} className="edit-form">
                    <input type="hidden" name="id" value={formData.id} />

                    <input
                      name="group_id"
                      value={formData.group_id}
                      onChange={handleChange}
                      placeholder="Group ID"
                      className="text-input"
                    />
                    <input
                      name="group_name"
                      value={formData.group_name}
                      onChange={handleChange}
                      placeholder="Group Name"
                      className="text-input"
                    />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Message"
                      className="text-input text-area compact-text-area"
                    />
                    <div className="form-grid two-up">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="text-input"
                      />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="text-input"
                      />
                    </div>

                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        name="sent"
                        checked={formData.sent}
                        onChange={handleChange}
                      />
                      <span>Mark as Sent</span>
                    </label>

                    <div className="button-row">
                      <button type="submit" className="primary-button">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="secondary-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="message-card-header">
                      <div>
                        <h3>{msg.group_name}</h3>
                        <p className="meta-text">Group ID: {msg.group_id}</p>
                      </div>
                      <span
                        className={`approval-chip ${
                          msg.sent ? "is-sent" : "is-pending"
                        }`}
                      >
                        {msg.sent ? "Sent" : msg.approval_status || "Pending"}
                      </span>
                    </div>

                    <p className="message-body">{msg.message}</p>

                    <div className="summary-list message-meta-grid">
                      <div>
                        <span>Scheduled</span>
                        <strong>
                          {msg.date} at {msg.time}
                        </strong>
                      </div>
                      <div>
                        <span>Created by</span>
                        <strong>
                          {msg.first_name} {msg.last_name}
                        </strong>
                      </div>
                    </div>

                    <div className="button-row">
                      <button
                        onClick={() => startEdit(msg)}
                        className="primary-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="danger-button"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
