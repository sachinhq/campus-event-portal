import React, { useEffect, useState } from "react";
import Auth from "./Auth";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  // 🔹 LOAD USER FROM LOCALSTORAGE
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token && role) {
      setUser({ token, role, name });
    }
  }, []);

  // 🔹 FETCH EVENTS (ALWAYS CALLED)
  useEffect(() => {
    fetch("http://localhost:3001/api/events")
      .then(res => res.json())
      .then(data => setEvents(data.reverse()));
  }, []);

  // 🔹 LOGOUT
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // 🔐 CONDITIONAL RENDERING (AFTER HOOKS)
  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
    <div className="app-bg">
      {/* TOP BAR */}
      <header className="topbar">
        <div>
          <h1>Technocrats Institute of Technology</h1>
          <p>CampusBuzz</p>
        </div>

        <div className="role-badge" onClick={logout}>
          {user.role === "admin" ? "👨‍💼 Admin" : "🎓 Student"} ⎋
        </div>
      </header>

      {/* FEED */}
      <div className="feed">
        {events.map(event => (
          <div className="post" key={event._id}>
            <div className="post-header">
              <span className="college">TIT</span>
              <span>{event.date}</span>
            </div>

            {event.image && (
              <div className="image-wrapper">
                <img
                  src={`http://localhost:3001/uploads/${event.image}`}
                  alt="event"
                />
              </div>
            )}

            <div className="post-body">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ADMIN ONLY */}
      {user.role === "admin" && (
        <button className="fab">+</button>
      )}
    </div>
  );
}

export default App;
