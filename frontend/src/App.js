// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css";

// const LANGUAGES = [
//   { code: "hi", label: "Hindi" },
//   { code: "te", label: "Telugu" },
//   { code: "ur", label: "Urdu" },
//   { code: "fr", label: "French" },
//   { code: "de", label: "German" },
//   { code: "es", label: "Spanish" },
//   { code: "ar", label: "Arabic" },
//   { code: "zh-CN", label: "Chinese (Simplified)" },
//   { code: "ja", label: "Japanese" },
//   { code: "ko", label: "Korean" },
//   { code: "ru", label: "Russian" },
//   { code: "it", label: "Italian" },
//   { code: "pt", label: "Portuguese" },
//   { code: "bn", label: "Bengali" },
//   { code: "ta", label: "Tamil" },
//   { code: "gu", label: "Gujarati" },
//   { code: "mr", label: "Marathi" },
//   { code: "ml", label: "Malayalam" },
//   { code: "kn", label: "Kannada" },
// ];

// function App() {
//   const [audioFile, setAudioFile] = useState(null);
//   const [originalText, setOriginalText] = useState("");
//   const [targetLang, setTargetLang] = useState("hi");
//   const [translatedText, setTranslatedText] = useState("");
//   const [loadingStt, setLoadingStt] = useState(false);
//   const [loadingTranslate, setLoadingTranslate] = useState(false);
//   const [error, setError] = useState("");
//   const [history, setHistory] = useState([]);

//   const handleAudioChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setAudioFile(e.target.files[0]);
//       setError("");
//     }
//   };

//   const handleUploadAudio = async () => {
//     if (!audioFile) {
//       setError("Please select an English audio file first.");
//       return;
//     }

//     try {
//       setError("");
//       setOriginalText("");
//       setTranslatedText("");
//       setLoadingStt(true);

//       const formData = new FormData();
//       formData.append("audio", audioFile);

//       const res = await axios.post("http://localhost:5000/api/stt", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setOriginalText(res.data.text || "");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to transcribe audio. Please try again.");
//     } finally {
//       setLoadingStt(false);
//     }
//   };

//   const handleTranslate = async () => {
//     if (!originalText.trim()) {
//       setError("No text to translate. Speak or type some English first.");
//       return;
//     }

//     try {
//       setError("");
//       setTranslatedText("");
//       setLoadingTranslate(true);

//       const res = await axios.post("http://localhost:5000/api/translate", {
//         text: originalText,
//         targetLang,
//       });

//       setTranslatedText(res.data.translatedText || "");
//       fetchHistory(); // refresh history
//     } catch (err) {
//       console.error(err);
//       setError("Failed to translate text. Please try again.");
//     } finally {
//       setLoadingTranslate(false);
//     }
//   };

//   const handleSpeak = () => {
//     if (!translatedText.trim()) {
//       setError("Nothing to speak. Translate something first.");
//       return;
//     }

//     if (!("speechSynthesis" in window)) {
//       setError("Your browser does not support speech synthesis.");
//       return;
//     }

//     setError("");
//     const utterance = new SpeechSynthesisUtterance(translatedText);

//     // Very rough mapping based on target language
//     const langMap = {
//       hi: "hi-IN",
//       te: "te-IN",
//       ur: "ur-IN",
//       fr: "fr-FR",
//       de: "de-DE",
//       es: "es-ES",
//       ar: "ar-SA",
//       "zh-CN": "zh-CN",
//       ja: "ja-JP",
//       ko: "ko-KR",
//       ru: "ru-RU",
//       it: "it-IT",
//       pt: "pt-PT",
//       bn: "bn-IN",
//       ta: "ta-IN",
//       gu: "gu-IN",
//       mr: "mr-IN",
//       ml: "ml-IN",
//       kn: "kn-IN",
//     };

//     utterance.lang = langMap[targetLang] || "en-IN";
//     window.speechSynthesis.speak(utterance);
//   };

//   const fetchHistory = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/history");
//       setHistory(res.data || []);
//     } catch (err) {
//       console.error("Error fetching history:", err);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   return (
//     <div className="app">
//       <header className="app-header">
//         <div className="brand">
//           <span className="logo-circle">T</span>
//           <div>
//             <h1>Nishanth Voice Translator</h1>
//             <p>English speech → text → any language → speech</p>
//           </div>
//         </div>
//       </header>

//       <main className="app-main">
//         {/* Left side: Input & Transcription */}
//         <section className="card">
//           <h2>1. Input English Audio</h2>
//           <p className="hint">
//             Upload a short English audio clip. The app will convert it to text.
//           </p>

//           <div className="field-row">
//             <input
//               type="file"
//               accept="audio/*"
//               onChange={handleAudioChange}
//             />
//             <button
//               onClick={handleUploadAudio}
//               disabled={loadingStt}
//               className="primary-btn"
//             >
//               {loadingStt ? "Transcribing..." : "Transcribe Audio"}
//             </button>
//           </div>

//           <label className="field-label">Original English Text</label>
//           <textarea
//             rows={6}
//             className="textarea"
//             value={originalText}
//             onChange={(e) => setOriginalText(e.target.value)}
//             placeholder="This will auto-fill after transcription, or you can type English text here..."
//           />
//         </section>

//         {/* Right side: Translation & TTS */}
//         <section className="card">
//           <h2>2. Translate & Listen</h2>

//           <div className="field-row">
//             <div className="field">
//               <label className="field-label">Translate from</label>
//               <div className="pill">English (fixed)</div>
//             </div>

//             <div className="field">
//               <label className="field-label">Translate to</label>
//               <select
//                 className="select"
//                 value={targetLang}
//                 onChange={(e) => setTargetLang(e.target.value)}
//               >
//                 {LANGUAGES.map((lang) => (
//                   <option key={lang.code} value={lang.code}>
//                     {lang.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <button
//             onClick={handleTranslate}
//             disabled={loadingTranslate}
//             className="primary-btn full-width"
//           >
//             {loadingTranslate ? "Translating..." : "Translate Text"}
//           </button>

//           <label className="field-label">Translated Text</label>
//           <textarea
//             rows={6}
//             className="textarea"
//             value={translatedText}
//             readOnly
//             placeholder="Translated text will appear here..."
//           />

//           <button onClick={handleSpeak} className="secondary-btn full-width">
//             🔊 Listen to Translation
//           </button>
//         </section>
//       </main>

//       {/* History */}
//       <section className="card history-card">
//         <div className="history-header">
//           <h2>3. Translation History</h2>
//           <p className="hint">Last 20 translations (stored in MongoDB)</p>
//         </div>
//         {history.length === 0 ? (
//           <p className="empty">No translations yet. Try translating something!</p>
//         ) : (
//           <div className="table-wrapper">
//             <table className="history-table">
//               <thead>
//                 <tr>
//                   <th>Time</th>
//                   <th>Original (EN)</th>
//                   <th>Target</th>
//                   <th>Translated</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {history.map((item) => (
//                   <tr key={item._id}>
//                     <td>{new Date(item.createdAt).toLocaleString()}</td>
//                     <td>{item.originalText}</td>
//                     <td>{item.targetLang}</td>
//                     <td>{item.translatedText}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>

//       {error && <div className="error-banner">{error}</div>}

//       <footer className="app-footer">
//         <span>Built by Nishanth • React · Node.js · MongoDB · AssemblyAI</span>
//       </footer>
//     </div>
//   );
// }

// export default App;


// frontend/src/App.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./App.css"; // keep your existing App.css for translator styles

// === config ===
const API_BASE_URL = "https://translate-speech-app.onrender.com"; // change when deployed

const LANGUAGES = [
  { code: "hi", label: "Hindi" },
  { code: "te", label: "Telugu" },
  { code: "ur", label: "Urdu" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "ar", label: "Arabic" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "ru", label: "Russian" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "bn", label: "Bengali" },
  { code: "ta", label: "Tamil" },
  { code: "gu", label: "Gujarati" },
  { code: "mr", label: "Marathi" },
  { code: "ml", label: "Malayalam" },
  { code: "kn", label: "Kannada" },
];

// ===== AnimatedLogin component (embedded) =====
function AnimatedLogin({ onAuth, apiBaseUrl }) {
  // inject necessary CSS only once
  useInjectLoginStyles();

  const API = apiBaseUrl || API_BASE_URL;
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
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top; // y position within element
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = (y - cy) / cy;
    const ry = (x - cx) / cx;
    const maxDeg = 8;
    el.style.transform = `perspective(900px) rotateX(${ -rx * maxDeg }deg) rotateY(${ ry * maxDeg }deg) translateZ(8px)`;
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
      const url = mode === "register" ? `${API}/api/auth/register` : `${API}/api/auth/login`;
      const body = mode === "register" ? { name: name.trim(), email: email.trim(), password } : { email: email.trim(), password };

      const res = await axios.post(url, body, { headers: { "Content-Type": "application/json" } });

      if (res.data?.token && res.data?.user) {
        if (typeof onAuth === "function") onAuth({ token: res.data.token, user: res.data.user });
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
            <li>● Accurate transcription (AssemblyAI)</li>
            <li>● Translate to hundreds of languages</li>
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
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="al-card-inner">
            <div className="al-card-header">
              <div className="al-brand">
                <div className="al-logo">T</div>
                <div>
                  <div className="al-h1">{mode === "login" ? "Welcome Back" : "Create Account"}</div>
                  <div className="al-muted">Sign in to your translator dashboard</div>
                </div>
              </div>

              <div className="al-mode-switch">
                <button
                  className={`al-mode-btn ${mode === "login" ? "active" : ""}`}
                  onClick={() => { setMode("login"); setError(""); }}
                >
                  Login
                </button>
                <button
                  className={`al-mode-btn ${mode === "register" ? "active" : ""}`}
                  onClick={() => { setMode("register"); setError(""); }}
                >
                  Register
                </button>
              </div>
            </div>

            <div className="al-form">
              {mode === "register" && (
                <div className="al-field">
                  <label>Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                </div>
              )}

              <div className="al-field">
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
              </div>

              <div className="al-field">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>

              {error && <div className="al-error">{error}</div>}

              <div className="al-actions">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="al-primary"
                  onClick={handleAuth}
                  disabled={loading}
                >
                  {loading ? (mode === "register" ? "Creating..." : "Signing in...") : (mode === "register" ? "Create account" : "Login")}
                </motion.button>

                <button
                  className="al-secondary"
                  onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                >
                  {mode === "login" ? "Create" : "Sign in"}
                </button>
              </div>

              <div className="al-or">or continue with</div>
              <div className="al-socials">
                <button className="al-social">Google</button>
                <button className="al-social">GitHub</button>
                <button className="al-social">Demo</button>
              </div>

              <div className="al-legal">By continuing you agree to demo terms. No payments are taken.</div>
            </div>
          </div>

          <div className="al-card-shine" />
        </motion.div>
      </div>
    </div>
  );
}

// inject CSS for AnimatedLogin once
function useInjectLoginStyles() {
  useEffect(() => {
    if (document.getElementById("animated-login-styles")) return;
    const css = `
    /* --- injected AnimatedLogin styles --- */
    .al-screen { min-height: 100vh; display: grid; place-items: center; background: linear-gradient(180deg,#071026 0%, #071a2d 100%); font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #eef2ff; padding: 40px 20px; position: relative; overflow: hidden; }
    .al-bg { position: absolute; inset: -10%; z-index: 0; pointer-events: none; }
    .al-blob { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.18; }
    .blob-1 { width: 520px; height: 520px; right: -8%; top: -6%; background: linear-gradient(135deg,#06b6d4,#22c55e); transform: rotate(15deg); }
    .blob-2 { width: 360px; height: 360px; left: -6%; bottom: -12%; background: linear-gradient(135deg,#7c3aed,#06b6d4); opacity: 0.12; }
    .blob-3 { width: 220px; height: 220px; right: 16%; bottom: 8%; background: linear-gradient(135deg,#f97316,#ef4444); opacity:0.08; }
    .al-container { width: 100%; max-width: 1100px; display: grid; grid-template-columns: 1fr 420px; gap: 28px; align-items: center; z-index: 2; position: relative; }
    .al-left { padding: 20px; }
    .al-title { font-size: 28px; margin: 0 0 6px; font-weight: 700; color: #f8fafc; }
    .al-sub { color: #9ca3af; margin: 0 0 16px; }
    .al-features { margin: 8px 0 0; color: #d1fae5; opacity: 0.95; line-height: 1.9; font-size: 15px; }
    .al-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 18px; z-index: 3; transform-origin: center; transition: transform 0.12s ease; position: relative; overflow: hidden; }
    .al-card-inner { position: relative; z-index: 2; }
    .al-card-header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom: 12px; }
    .al-brand { display:flex; gap:12px; align-items:center; }
    .al-logo { width:54px; height:54px; border-radius: 12px; background: linear-gradient(135deg,#22c55e,#06b6d4); display:flex; align-items:center; justify-content:center; color:#02131f; font-weight:700; font-size:20px; }
    .al-h1 { font-weight:700; font-size: 16px; color: #ffffff; }
    .al-muted { color: #9ca3af; font-size: 13px; }
    .al-mode-switch { display:flex; gap:6px; }
    .al-mode-btn { padding:6px 10px; border-radius: 10px; border: none; background: transparent; color: #9ca3af; cursor: pointer; font-size: 13px; }
    .al-mode-btn.active { background: rgba(255,255,255,0.06); color: #fff; }
    .al-form { margin-top: 6px; display:flex; flex-direction:column; gap: 12px; }
    .al-field label { display:block; color: #cbd5f5; font-size: 13px; margin-bottom: 6px; }
    .al-field input { width:100%; padding: 12px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.45); color: #fff; outline: none; font-size: 14px; }
    .al-field input::placeholder { color: #8b98a9; }
    .al-error { padding:8px 10px; border-radius:8px; background: rgba(248,113,113,0.08); color:#fecaca; font-size:13px; }
    .al-actions { display:flex; gap:10px; margin-top:6px; }
    .al-primary { flex:1; padding:12px 14px; border-radius:10px; background: linear-gradient(90deg,#06b6d4,#22c55e); color:#02131f; font-weight:700; border:none; cursor:pointer; }
    .al-primary:disabled { opacity: 0.6; cursor:not-allowed; transform:none; }
    .al-secondary { padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,0.06); background: transparent; color:#fff; cursor:pointer; }
    .al-or { text-align:center; color:#9ca3af; margin-top:6px; font-size:13px; }
    .al-socials { display:flex; gap:8px; justify-content:center; margin-top:8px; }
    .al-social { padding:8px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color:#fff; cursor:pointer; }
    .al-legal { margin-top:8px; font-size:12px; color:#9ca3af; text-align:center; }
    .al-card-shine { position:absolute; inset: -40%; transform: rotate(25deg) translateY(-10%); background: linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 100%); filter: blur(28px); opacity: 0.18; pointer-events: none; }
    @media (max-width:900px) { .al-container { grid-template-columns: 1fr; } .al-left { order: 2; padding-top: 10px; } .al-card { order: 1; } .blob-1 { display:none; } }
    /* --- end injected styles --- */
    `;
    const style = document.createElement("style");
    style.id = "animated-login-styles";
    style.innerHTML = css;
    document.head.appendChild(style);
  }, []);
}

// ===== main App =====
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);

  const isAuthenticated = !!token && !!user;

  const handleAuth = ({ token: t, user: u }) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  return (
    <div className="root">
      {!isAuthenticated ? (
        <AnimatedLogin onAuth={handleAuth} apiBaseUrl={API_BASE_URL} />
      ) : (
        <TranslatorScreen token={token} user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

// ===== TranslatorScreen (same behavior as your earlier code, with small fixes) =====
function TranslatorScreen({ token, user, onLogout }) {
  // core states
  const [audioFile, setAudioFile] = useState(null);
  const [originalText, setOriginalText] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [translatedText, setTranslatedText] = useState("");
  const [history, setHistory] = useState([]);

  // loading / error states
  const [loadingStt, setLoadingStt] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [error, setError] = useState("");

  // TTS audio url (if any)


  // handle file selection
  const handleAudioChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setError("");
    }
  };

  // upload to /api/stt
  const handleUploadAudio = async () => {
    if (!audioFile) {
      setError("Please select an audio file first.");
      return;
    }

    try {
      setError("");
      setOriginalText("");
      setTranslatedText("");
      setLoadingStt(true);

      const formData = new FormData();
      formData.append("audio", audioFile);

      const res = await axios.post(`${API_BASE_URL}/api/stt`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOriginalText(res.data.text || "");
    } catch (err) {
      console.error(err);
      setError("Failed to transcribe audio. Try a short clean English clip.");
    } finally {
      setLoadingStt(false);
    }
  };

  // translate (protected)
  const handleTranslate = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setError("Please login first to use translation.");
      return;
    }
    if (!originalText.trim()) {
      setError("No text to translate. Speak or type some English first.");
      return;
    }

    try {
      setError("");
      setLoadingTranslate(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/translate`,
        { text: originalText, targetLang },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      setTranslatedText(res.data.translatedText || "");
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Translation failed");
    } finally {
      setLoadingTranslate(false);
    }
  };

  // browser TTS
  const handleSpeak = () => {
    if (!translatedText.trim()) {
      setError("Nothing to speak. Translate something first.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      setError("Your browser does not support speech synthesis.");
      return;
    }

    setError("");
    const utterance = new SpeechSynthesisUtterance(translatedText);

    const langMap = {
      hi: "hi-IN",
      te: "te-IN",
      ur: "ur-IN",
      fr: "fr-FR",
      de: "de-DE",
      es: "es-ES",
      ar: "ar-SA",
      "zh-CN": "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
      ru: "ru-RU",
      it: "it-IT",
      pt: "pt-PT",
      bn: "bn-IN",
      ta: "ta-IN",
      gu: "gu-IN",
      mr: "mr-IN",
      ml: "ml-IN",
      kn: "kn-IN",
    };

    utterance.lang = langMap[targetLang] || "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  // fetch user-specific history
  const fetchHistory = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setHistory([]);
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/api/history`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setHistory(res.data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setHistory([]);
    }
  };

  // refresh history after login / token changes
  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("token")]);

  return (
    <div className="translator-root">
      <header className="app-header translator-header">
        <div className="brand">
          <span className="logo-circle">T</span>
          <div>
            <h1>Nishanth Voice Translator</h1>
            <p className="muted">Welcome, {user?.name}</p>
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <div className="small muted">Signed in: {user?.email}</div>
          <button className="secondary-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="app-main">
        {/* Left: Input & STT */}
        <section className="card">
          <h2>1. Input English Audio</h2>
          <p className="hint">Upload a short English audio clip or type directly below.</p>

          <div className="field-row">
            <input type="file" accept="audio/*" onChange={handleAudioChange} />
            <button onClick={handleUploadAudio} disabled={loadingStt} className="primary-btn">
              {loadingStt ? "Transcribing..." : "Transcribe Audio"}
            </button>
          </div>

          <label className="field-label">Original English Text</label>
          <textarea rows={6} className="textarea" value={originalText} onChange={(e) => setOriginalText(e.target.value)} placeholder="This will auto-fill after transcription, or you can type English text here..." />
        </section>

        {/* Right: Translate & Listen */}
        <section className="card">
          <h2>2. Translate & Listen</h2>

          <div className="field-row">
            <div className="field">
              <label className="field-label">Translate from</label>
              <div className="pill">English (fixed)</div>
            </div>

            <div className="field">
              <label className="field-label">Translate to</label>
              <select className="select" value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={handleTranslate} disabled={loadingTranslate} className="primary-btn full-width">
            {loadingTranslate ? "Translating..." : "Translate Text"}
          </button>

          <label className="field-label">Translated Text</label>
          <textarea rows={6} className="textarea" value={translatedText} readOnly placeholder="Translated text will appear here..." />

          <button onClick={handleSpeak} className="secondary-btn full-width" style={{ marginTop: 10 }}>
            🔊 Listen to Translation (Browser Voice)
          </button>

          {/* {ttsAudioUrl && <audio controls autoPlay style={{ marginTop: 8, width: "100%" }} src={ttsAudioUrl} />} */}
        </section>
      </main>

      {/* History */}
      <section className="card history-card">
        <div className="history-header">
          <h2>3. Translation History</h2>
          <p className="hint">Your last translations (saved to MongoDB)</p>
        </div>

        {history.length === 0 ? (
          <p className="empty">No translations yet. Try translating something!</p>
        ) : (
          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Original (EN)</th>
                  <th>Target</th>
                  <th>Translated</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id}>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td style={{ maxWidth: 300, wordBreak: "break-word" }}>{item.originalText}</td>
                    <td>{item.targetLang}</td>
                    <td style={{ maxWidth: 400, wordBreak: "break-word" }}>{item.translatedText}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {error && <div className="error-banner">{error}</div>}

      <footer className="app-footer">
        <span>Built by Nishanth • React · Node.js · MongoDB · AssemblyAI</span>
      </footer>
    </div>
  );
}

export default App;
