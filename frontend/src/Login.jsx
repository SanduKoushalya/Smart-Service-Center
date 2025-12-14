import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left">
        <h1 className="title">Smart Service Center</h1>
        <h2>Your Vehicle, <span className="highlight">Our Priority</span></h2>
        <p>Book services, track repairs, and get expert care for your vehicle — all in one place.</p>

        <ul className="features">
          <li>🚗 Easy service booking</li>
          <li>🛠️ Trusted technicians</li>
          <li>🔧 Quality parts & service</li>
        </ul>
      </div>

      <div className="right">
        <form onSubmit={handleLogin} className="login-box">
          <h2>Welcome back</h2>
          <p>Enter your credentials to access your dashboard</p>

          <input 
            type="email" 
            placeholder="Email or Username" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p>Don't have an account? <Link to="/register">Create account</Link></p>
        </form>
      </div>
    </div>
  );
}
