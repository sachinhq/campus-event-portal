import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null
  });

  // APPLY DARK MODE CLASS
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  // FETCH EVENTS
  useEffect(() => {
    fetch("http://localhost:3001/api/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const submitEvent = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    if (form.image) data.append("image", form.image);

    await fetch("http://localhost:3001/api/events", {
      method: "POST",
      body: data
    });

    setShowCompose(false);
    setForm({ title: "", description: "", image: null });

    const res = await fetch("http://localhost:3001/api/events");
    setEvents(await res.json());
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await fetch(`http://localhost:3001/api/events/${id}`, { method: "DELETE" });
    setEvents(events.filter(e => e._id !== id));
  };

  return (
    <div className="app-bg">

      {/* HEADER */}
      <header className="topbar">
        <h1>Technocrats Institute Of Technology, Bhopal</h1>
        <p>Event Portal</p>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      {/* FEED */}
      <div className="feed">
        {events.map(event => (
          <div className="post" key={event._id}>

            <div className="post-header">
              <span className="college">TIT</span>
              <div>
                <span>{event.date}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteEvent(event._id)}
                >🗑</button>
              </div>
            </div>

            <div className="post-body">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>

            {event.image && (
              <div className="image-wrapper">
                <img
                  src={`http://localhost:3001/uploads/${event.image}`}
                  alt="event"
                  className="post-image"
                />
              </div>
            )}

          </div>
        ))}
      </div>

      {/* ADD BUTTON */}
      <button className="fab" onClick={() => setShowCompose(true)}>+</button>

      {/* COMPOSE */}
      {showCompose && (
        <div className="compose-overlay">
          <div className="compose-box">
            <div className="compose-header">
              <span>New Event</span>
              <button onClick={() => setShowCompose(false)}>✕</button>
            </div>

            <form className="compose-body" onSubmit={submitEvent}>
              <input
                name="title"
                placeholder="Event title"
                value={form.title}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Write event details..."
                value={form.description}
                onChange={handleChange}
                required
              />

              <input type="file" accept="image/*" onChange={handleImage} />

              <div className="compose-actions">
                <button type="submit">Post</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCompose(false)}
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
