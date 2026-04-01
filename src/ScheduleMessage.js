import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { API_BASE_URL } from "./api";

export default function ScheduleMessage() {
  const [status, setStatus] = useState("Ready");
  const [dateSelection, setDateSelection] = useState("");
  const [timeSelection, setTimeSelection] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [textToSend, setTextToSend] = useState("");
  const [username, setUsername] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsError, setGroupsError] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchGroups() {
      setGroupsLoading(true);
      setGroupsError("");

      try {
        const response = await axios.get(`${API_BASE_URL}/groupme_groups`);
        if (active) {
          setGroups(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (active) {
          setGroupsError("Unable to load GroupMe groups.");
        }
      } finally {
        if (active) {
          setGroupsLoading(false);
        }
      }
    }

    fetchGroups();
    return () => {
      active = false;
    };
  }, []);

  const selectedGroup = useMemo(
    () => groups.find((group) => group.group_id === selectedGroupId) || null,
    [groups, selectedGroupId]
  );

  async function sendMessage() {
    if (!selectedGroup) {
      setStatus("Please select a group.");
      return;
    }
    if (!textToSend.trim()) {
      setStatus("Please type a message.");
      return;
    }
    if (!dateSelection || !timeSelection) {
      setStatus("Please provide both a date and time.");
      return;
    }
    if (!username) {
      setStatus("Missing username. Please log in again.");
      return;
    }

    setStatus("Scheduling message...");

    try {
      const response = await axios.post(`${API_BASE_URL}/scheduled_messages_list`, {
        message: textToSend.trim(),
        username,
        group_id: selectedGroup.group_id,
        group_name: selectedGroup.group_name,
        date: dateSelection,
        time: timeSelection,
      });

      if (typeof response.data.id === "number") {
        setStatus("Message scheduled successfully.");
        setTextToSend("");
        return;
      }

      setStatus("Unexpected response from backend.");
    } catch (err) {
      setStatus(err.response?.data?.error || "Failed to schedule message.");
    }
  }

  return (
    <div className="app-shell">
      <nav className="topbar">
        <div>
          <p className="eyebrow">Tech & Faith</p>
          <h1 className="topbar-title">Schedule GroupMe messages</h1>
        </div>
        <div className="topbar-actions">
          <Link to="/" className="nav-link active-link">
            Scheduler
          </Link>
          {username === "agentofgod" && (
            <Link to="/messages" className="nav-link">
              Messages
            </Link>
          )}
          <Logout />
        </div>
      </nav>

      <main className="content-grid">
        <section className="panel panel-emphasis">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Create</p>
              <h2>Schedule a new delivery</h2>
            </div>
            <span className="status-pill">{status}</span>
          </div>

          <div className="form-grid two-up">
            <label className="field">
              <span>Date</span>
              <input
                type="date"
                value={dateSelection}
                onChange={(e) => setDateSelection(e.target.value)}
                className="text-input"
              />
            </label>

            <label className="field">
              <span>Time</span>
              <input
                type="time"
                value={timeSelection}
                onChange={(e) => setTimeSelection(e.target.value)}
                className="text-input"
              />
            </label>
          </div>

          <label className="field">
            <span>Select Group</span>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="text-input"
              disabled={groupsLoading}
            >
              <option value="">
                {groupsLoading ? "Loading groups..." : "-- Select a group --"}
              </option>
              {groups.map((group) => (
                <option key={group.group_id} value={group.group_id}>
                  {group.group_name}
                </option>
              ))}
            </select>
          </label>

          {groupsError && <p className="form-error">{groupsError}</p>}

          <label className="field">
            <span>Message</span>
            <textarea
              onChange={(e) => setTextToSend(e.target.value)}
              value={textToSend}
              className="text-input text-area"
              placeholder="Type your message..."
            />
          </label>

          <button onClick={sendMessage} className="primary-button">
            Schedule Message
          </button>
        </section>

        <aside className="side-column">
          <section className="panel">
            <p className="eyebrow">Preview</p>
            <h3>Delivery summary</h3>
            <div className="summary-list">
              <div>
                <span>Signed in as</span>
                <strong>{username || "Unknown user"}</strong>
              </div>
              <div>
                <span>Selected group</span>
                <strong>{selectedGroup?.group_name || "None selected"}</strong>
              </div>
              <div>
                <span>Scheduled for</span>
                <strong>
                  {dateSelection && timeSelection
                    ? `${dateSelection} at ${timeSelection}`
                    : "Choose a date and time"}
                </strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <p className="eyebrow">Message</p>
            <h3>Bubble preview</h3>
            <div className="message-preview-shell">
              {textToSend ? (
                <p className="message-bubble">{textToSend}</p>
              ) : (
                <p className="placeholder-text">
                  Your message preview will appear here as you type.
                </p>
              )}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
