import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import studyVideo from "../videos/study.mp4"; // ✅ import video correctly

const Homepage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="homepage">
      <style>{`
        .homepage {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 28px;
          transition: background 0.4s ease, box-shadow 0.4s ease;
        }
        .navbar.transparent {
          background: transparent;
          box-shadow: none;
        }
        .navbar.scrolled {
          background: rgba(37, 99, 235, 0.9);
          backdrop-filter: blur(6px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .logo:hover {
          color: #facc15;
        }

        .nav-actions {
          margin-right: 201px; /* ✅ Pushes login button to the right */
        }

        .login-btn {
          background: white;
          color: #2563eb;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }
        .login-btn:hover {
          background: #f3f4f6;
          transform: scale(1.05);
        }

        /* Hero with Video */
        .hero {
          position: relative;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
        }
        .hero video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
          filter: brightness(65%);
        }
        .hero-content {
          animation: fadeIn 2s ease-in-out;
          padding: 20px;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 20px;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
          animation: slideIn 1.5s ease-in-out;
        }
        .hero-subtext {
          font-size: 1.2rem;
          max-width: 700px;
          margin: 0 auto;
          animation: fadeInUp 2s ease;
        }

        /* Info Section (Zig-Zag) */
        .info {
          background: white;
          padding: 80px 20px;
          text-align: center;
        }
        .info h3 {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 60px;
        }
        .zigzag-container {
          display: flex;
          flex-direction: column;
          gap: 50px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .zigzag-card {
          display: flex;
          align-items: center;
          background: #f9fafb;
          padding: 30px;
          border-radius: 18px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .zigzag-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 25px rgba(0,0,0,0.15);
        }
        .zigzag-card.reverse {
          flex-direction: row-reverse;
        }
        .zigzag-text {
          flex: 1;
          text-align: left;
        }
        .zigzag-card h4 {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: #2563eb;
        }
        .zigzag-card p {
          font-size: 1rem;
          color: #374151;
          line-height: 1.6;
        }

        /* Footer */
        .footer {
          background: linear-gradient(to right, #2563eb, #4338ca);
          color: white;
          text-align: center;
          padding: 20px;
          margin-top: auto;
          font-size: 0.9rem;
        }
      `}</style>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? "scrolled" : "transparent"}`}>
        <h1 className="logo" onClick={() => navigate("/")}>
          🌉 Bridge Learn
        </h1>
        <div className="nav-actions">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </nav>

      {/* Hero with Background Video */}
      <header className="hero">
        <video autoPlay loop muted playsInline>
          <source src={studyVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h2 className="hero-title">Bridging the Education Gap 🌍</h2>
          <p className="hero-subtext">
            Bridge Learn empowers rural students by providing affordable,
            personalized tutoring, offline content, and access to expert teachers.
            Our mission is to make quality education accessible to every student,
            no matter where they live.
          </p>
        </div>
      </header>

      {/* Info Section (Zig-Zag Cards) */}
      <section className="info">
        <h3>Why Choose Bridge Learn?</h3>
        <div className="zigzag-container">
          <div className="zigzag-card">
            <div className="zigzag-text">
              <h4>🎯 Personalized Tutoring</h4>
              <p>
                Customized learning paths tailored to each student’s progress,
                strengths, and weaknesses.
              </p>
            </div>
          </div>

          <div className="zigzag-card reverse">
            <div className="zigzag-text">
              <h4>📶 Offline Access</h4>
              <p>
                Downloadable lessons and quizzes ensure learning continues even
                in low-connectivity areas.
              </p>
            </div>
          </div>

          <div className="zigzag-card">
            <div className="zigzag-text">
              <h4>🎥 Expert Video Lessons</h4>
              <p>
                Pre-recorded lessons from subject experts, accessible anytime on
                mobile devices.
              </p>
            </div>
          </div>

          <div className="zigzag-card reverse">
            <div className="zigzag-text">
              <h4>🤝 Volunteer Tutors</h4>
              <p>
                Connects rural students with urban volunteers and retired teachers
                through video and chat-based support.
              </p>
            </div>
          </div>

          <div className="zigzag-card">
            <div className="zigzag-text">
              <h4>📊 Progress Tracking</h4>
              <p>
                Real-time analytics help students track their growth and motivate
                continuous improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Bridge Learn. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Homepage;
