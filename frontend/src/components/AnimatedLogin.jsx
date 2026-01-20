import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./AnimatedLogin.css";
import API_BASE from "../config/api";

/**
 * AnimatedLogin
 * Props:
 *  - onAuth({ token, user })  // called on success
 */

export default function AnimatedLogin({ onAuth }) {
  const cardRef = useRef(null);
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 3D tilt on mouse move
  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = (y - cy) / cy;
    const ry = (x - cx) / cx;
    const maxDeg = 8;
    el.style.transform = `perspective(900px) rotateX(${-rx * maxDeg}deg) rotateY(${ry * maxDeg}deg) translateZ(8px)`;
    el.style.boxShadow = `${-ry * 30}px ${rx * 30}px 60px rgba(2,6,23,0.65)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
  };

  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleAuth = async () => {
    try {
      setError("");

      if (mode === "register" && !name.trim()) {
        setError("Please enter your name to register.");
        return;
      }

      if (!email.trim() || !password) {
        setError("Please enter email and password.");
        return;
      }

      setLoading(true);

      const url =
        mode === "register"
          ? `${API_BASE}/api/auth/register`
          : `${API_BASE}/api/auth/login`;

      const body =
        mode === "register"
          ? { name: name.trim(), email: email.trim(), password }
          : { email: email.trim(), password };

      const res = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.token && res.data?.user) {
        if (typeof onAuth === "function") {
          onAuth({ token: res.data.token, user: res.data.user });
        }
        clearFields();
      } else {
        setError("Unexpected server response.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err?.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-screen">
      <div className="al-bg">
        <div className="al-blob blob-1" />
        <div className="al-blob blob-2" />
        <div className="al-blob blob-3" />
      </div>

      <div className="al-container">
        <motion.div
          className="al-left"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
        >
          <h1 className="al-title">Nishanth Translate</h1>
          <p className="al-sub">English speech → Translate → Natural audio</p>

          <ul className="al-features">
            <li>● Upload or record English audio</li>
            <li>● Accurate transcription</li>
            <li>● Translate to multiple languages</li>
            <li>● Personal history per user</li>
          </ul>
        </motion.div>

        <motion.div
          className="al-card"
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <div className="al-card-inner">
            <div className="al-card-header">
              <div className="al-h1">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </div>

              <div className="al-mode-switch">
                <button
                  className={mode === "login" ? "active" : ""}
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
                <button
                  className={mode === "register" ? "active" : ""}
                  onClick={() => setMode("register")}
                >
                  Register
                </button>
              </div>
            </div>

            <div className="al-form">
              {mode === "register" && (
                <div className="al-field">
                  <label>Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}

              <div className="al-field">
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="al-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <div className="al-error">{error}</div>}

              <button onClick={handleAuth} disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
