import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import loginBg from "../../assets/login-bg.jpeg";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(res.data.msg);

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-page::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url(${loginBg}) no-repeat center center/cover;
          filter: blur(6px);
          z-index: -2;
        }
        .login-page::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.35);
          z-index: -1;
        }

        .login-box {
          background: rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 18px;
          padding: 45px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
          width: 100%;
          max-width: 420px;
          text-align: center;
          color: #1f2937;
          animation: zoomIn 0.9s ease;
        }
        .login-box h2 {
          font-size: 2rem;
          margin-bottom: 25px;
          font-weight: bold;
          color: #111827;
        }

        .login-box input {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          outline: none;
          margin: 10px 0;
          background: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }
        .login-box input:focus {
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
          transform: scale(1.02);
        }

        .login-btn {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 12px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }
        .login-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        .login-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        .return-home {
          margin-top: 20px;
          font-size: 0.95rem;
          color: #f9fafb;
          cursor: pointer;
          user-select: none;
        }
        .return-home:hover {
          text-decoration: underline;
          color: #facc15;
        }

        .register-prompt {
          margin-top: 15px;
          font-size: 0.95rem;
          color: #1e40af;
          cursor: pointer;
          user-select: none;
          font-weight: 600;
        }
        .register-prompt:hover {
          text-decoration: underline;
          color: #2563eb;
        }

        @keyframes zoomIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="login-box">
        <h2>Welcome Back 👋</h2>
        {React.createElement(
          "form",
          { onSubmit: handleSubmit },
          React.createElement("input", {
            type: "email",
            name: "email",
            placeholder: "Enter your email",
            value: formData.email,
            onChange: handleChange,
            required: true,
          }),
          React.createElement("input", {
            type: "password",
            name: "password",
            placeholder: "Enter your password",
            value: formData.password,
            onChange: handleChange,
            required: true,
          }),
          React.createElement(
            "button",
            { type: "submit", className: "login-btn", disabled: loading },
            loading ? "Logging in..." : "Login"
          )
        )}

        <div
          className="register-prompt"
          onClick={() => navigate("/register")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/register")}
        >
          Don't have an account? Register
        </div>

        <div
          className="return-home"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/")}
        >
          ← Return Home
        </div>
      </div>
    </div>
  );
}

export default Login;
