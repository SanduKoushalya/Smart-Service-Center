import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("http://localhost:5000/api/user", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching user:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to load user data");
        setLoading(false);
      }
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleServiceClick = (service) => {
    // Placeholder for future functionality
    console.log(`Clicked: ${service}`);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleLogout} className="btn-primary">Go to Login</button>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Top Header with Profile Info */}
        <div className="top-section">
          <div className="profile-info">
            <div className="profile-avatar">
              {getInitials(user.name)}
            </div>
            <div className="profile-details">
              <h2>{user.name || "User"}</h2>
              <p className="profile-email">{user.email}</p>
              <p className="profile-member">Member since {user.memberSince ? new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"}</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="notification-bell" onClick={() => handleServiceClick("Notification")}>
              <span className="bell-icon">🔔</span>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </div>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          <div 
            className="service-card booking-card" 
            onClick={() => handleServiceClick("Booking a service")}
          >
            <div className="card-icon">📅</div>
            <h3>Booking a Service</h3>
            <p>Schedule your vehicle service appointment</p>
            <div className="card-arrow">→</div>
          </div>

          <div 
            className="service-card technician-card" 
            onClick={() => handleServiceClick("Contact Technician")}
          >
            <div className="card-icon">👨‍🔧</div>
            <h3>Contact Technician</h3>
            <p>Get in touch with our expert technicians</p>
            <div className="card-arrow">→</div>
          </div>

          <div 
            className="service-card parts-card" 
            onClick={() => handleServiceClick("Buy Vehicle parts")}
          >
            <div className="card-icon">🔧</div>
            <h3>Buy Vehicle Parts</h3>
            <p>Browse and purchase genuine vehicle parts</p>
            <div className="card-arrow">→</div>
          </div>

          <div 
            className="service-card notification-card" 
            onClick={() => handleServiceClick("Notification")}
          >
            <div className="card-icon">🔔</div>
            <h3>Notifications</h3>
            <p>View your service updates and alerts</p>
            {notificationCount > 0 && (
              <span className="card-badge">{notificationCount} new</span>
            )}
            <div className="card-arrow">→</div>
          </div>

          <div 
            className="service-card history-card" 
            onClick={() => handleServiceClick("Service history")}
          >
            <div className="card-icon">📋</div>
            <h3>Service History</h3>
            <p>View your past service records</p>
            <div className="card-arrow">→</div>
          </div>

          <div 
            className="service-card help-card" 
            onClick={() => handleServiceClick("Contact & help")}
          >
            <div className="card-icon">💬</div>
            <h3>Contact & Help</h3>
            <p>Get support and assistance</p>
            <div className="card-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  );
}
