import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
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
        <form onSubmit={handleRegister} className="login-box">
          <h2>Create Account</h2>
          <p>Sign up to get started with Smart Service Center</p>

          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input 
            type="email" 
            placeholder="Email" 
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
            minLength={6}
          />

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}

