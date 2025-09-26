import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Make sure API URL points to your Render backend
import loginBg from "../../assets/login-bg.jpeg";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    standard: "",
    stream: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.standard) {
      alert("Please select a standard.");
      return;
    }

    if ((form.standard === "11" || form.standard === "12") && !form.stream) {
      alert("Please select a stream for 11th or 12th standard.");
      return;
    }

    // For classes 5–10, set stream to "N/A" if empty
    const payload = {
      ...form,
      stream: form.standard === "11" || form.standard === "12" ? form.stream : "N/A",
    };

    try {
      const res = await api.post("/auth/register", payload);
      alert(res.data.msg || "Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <style>{`
        .register-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
          overflow: hidden;
        }
        .register-page::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: url(${loginBg}) no-repeat center/cover;
          filter: blur(6px); z-index: -2;
        }
        .register-page::after {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.35); z-index: -1;
        }
        .register-box {
          background: rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 18px;
          padding: 45px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
          width: 100%; max-width: 450px;
          text-align: center; color: #1f2937;
          animation: zoomIn 0.9s ease;
        }
        .register-box h2 { font-size: 2rem; margin-bottom: 20px; font-weight: bold; color: #111827; }
        .register-box form { display: flex; flex-direction: column; gap: 15px; }
        .register-box input, .register-box select {
          padding: 12px; border: none; border-radius: 10px;
          font-size: 1rem; outline: none; background: rgba(255,255,255,0.7);
          transition: all 0.3s ease;
        }
        .register-box input:focus, .register-box select:focus {
          background: rgba(255,255,255,0.9);
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
          transform: scale(1.02);
        }
        .register-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white; padding: 12px; border-radius: 12px;
          font-weight: bold; font-size: 1rem; border: none;
          cursor: pointer; transition: all 0.3s ease;
        }
        .register-btn:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        .login-link, .home-link {
          margin-top: 15px; font-size: 0.95rem;
        }
        .login-link span, .home-link span {
          color: #facc15; cursor: pointer; font-weight: 600;
        }
        .login-link span:hover, .home-link span:hover { text-decoration: underline; }
        @keyframes zoomIn { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>

      <div className="register-box">
        <h2>Create Account ✨</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <select name="standard" value={form.standard} onChange={handleChange} required>
            <option value="">Select Standard</option>
            {[5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}th</option>)}
          </select>
          {(form.standard === "11" || form.standard === "12") && (
            <select name="stream" value={form.stream} onChange={handleChange} required>
              <option value="">Select Stream</option>
              <option value="science">Science</option>
              <option value="arts">Arts</option>
              <option value="commerce">Commerce</option>
            </select>
          )}
          <button type="submit" className="register-btn">Register</button>
        </form>
        <p className="login-link">Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
        <p className="home-link">← <span onClick={() => navigate("/")}>Return Home</span></p>
      </div>
    </div>
  );
}

export default Register;
