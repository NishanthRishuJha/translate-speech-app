// const User = require("./models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const auth = require("./middleware/auth");


// const multer = require("multer");
// const upload = multer({ dest: "uploads/" }); // files stored in /uploads
// const express = require("express");
// const cors = require("cors");

// const fs = require("fs");
// const axios = require("axios");

// const mongoose = require("mongoose");
// require("dotenv").config();

// const Translation = require("./models/Translation");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ---- MongoDB Connection ----
// const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/translate_speech_app";

// mongoose
//   .connect(mongoUri)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// // ---- Routes ----

// app.get("/", (req, res) => {
//   res.json({ message: "Backend running successfully 🚀" });
// });


// // Register
// app.post("/api/auth/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password required" });

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ error: "Email already in use" });

//     const passwordHash = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, passwordHash });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
//     res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// // Login
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: "Email and password required" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
//     res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });





// // Dummy translate endpoint + save to DB
// // Real translate endpoint using MyMemory API + save to DB
// app.post("/api/translate", async (req, res) => {
//   try {
//     const { text, targetLang } = req.body;

//     if (!text || !targetLang) {
//       return res.status(400).json({ error: "text and targetLang are required" });
//     }

//     const sourceLang = "en"; // we assume English for now (later dynamic from STT)

//     const url = "https://api.mymemory.translated.net/get";
//     const params = {
//       q: text,
//       langpair: `${sourceLang}|${targetLang}`
//     };

//     const response = await require("axios").get(url, { params });
//     const translatedText =
//       response.data?.responseData?.translatedText ||
//       `Could not translate: ${text}`;

//     // Save in DB
//     const doc = await Translation.create({
//       originalText: text,
//       translatedText,
//       targetLang,
//     });

//     res.json({
//       translatedText: doc.translatedText,
//       id: doc._id,
//       createdAt: doc.createdAt,
//     });

//   } catch (err) {
//     console.error("Error in /api/translate:", err.message);
//     res.status(500).json({ error: "Server error in translate endpoint" });
//   }
// });

// // Dummy Speech-to-Text endpoint
// // Real Speech-to-Text endpoint using AssemblyAI
// app.post("/api/stt", upload.single("audio"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No audio file uploaded" });
//     }

//     const apiKey = process.env.ASSEMBLYAI_API_KEY;
//     if (!apiKey) {
//       return res.status(500).json({ error: "AssemblyAI API key not configured" });
//     }

//     const filePath = req.file.path;

//     // 1) Upload the audio file to AssemblyAI
//     const uploadResponse = await axios({
//       method: "post",
//       url: "https://api.assemblyai.com/v2/upload",
//       headers: {
//         "authorization": apiKey,
//         "transfer-encoding": "chunked",
//       },
//       data: fs.createReadStream(filePath),
//     });

//     const uploadUrl = uploadResponse.data.upload_url;

//     // 2) Create a transcription job
//     const transcriptResponse = await axios({
//       method: "post",
//       url: "https://api.assemblyai.com/v2/transcript",
//       headers: {
//         "authorization": apiKey,
//         "content-type": "application/json",
//       },
//       data: {
//         audio_url: uploadUrl,
//         // You can set language hints here if needed, e.g.:
//          language_detection: true
//         // language_code: "en",  // or "hi", "te" etc. if your audio is not English
//       },
//     });

//     const transcriptId = transcriptResponse.data.id;

//     // 3) Poll AssemblyAI until transcription is completed
//     let transcription = "";
//     while (true) {
//       const pollingResponse = await axios({
//         method: "get",
//         url: `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
//         headers: {
//           authorization: apiKey,
//         },
//       });

//       const status = pollingResponse.data.status;

//       if (status === "completed") {
//         transcription = pollingResponse.data.text;
//         break;
//       } else if (status === "error") {
//         console.error("AssemblyAI error:", pollingResponse.data.error);
//         return res
//           .status(500)
//           .json({ error: "AssemblyAI transcription failed", detail: pollingResponse.data.error });
//       }

//       // Wait 1 second before next poll
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }

//     res.json({
//       text: transcription,
//     });
//   } catch (err) {
//     console.error("Error in /api/stt:", err.message);
//     res.status(500).json({ error: "Error while processing speech-to-text" });
//   }
// });

// // Get translation history (latest first)
// app.get("/api/history", async (req, res) => {
//   try {
//     const history = await Translation.find().sort({ createdAt: -1 }).limit(20);
//     res.json(history);
//   } catch (err) {
//     console.error("Error in /api/history:", err.message);
//     res.status(500).json({ error: "Server error while fetching history" });
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () =>
//   console.log(`Server running at http://localhost:${PORT}`)
// );




// server.js (final)

require("dotenv").config();

const User = require("./models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth");

const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // files stored in /uploads
const express = require("express");
const cors = require("cors");

const fs = require("fs");
const axios = require("axios");

const mongoose = require("mongoose");

const Translation = require("./models/Translation");

const app = express();
app.use(cors({
  origin: "https://translate-speech-app.vercel.app",
  credentials: true
}));
app.use(express.json());

// ---- MongoDB Connection ----
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/translate_speech_app";

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ---- Routes ----

app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully 🚀" });
});

// ----------------- AUTH ROUTES -----------------

// Register
// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password required" });
    }

    // 2️⃣ Normalize email (CRITICAL)
    const emailNormalized = email.trim().toLowerCase();

    // 3️⃣ Check existing user
    const existing = await User.findOne({ email: emailNormalized });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // 4️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 5️⃣ Create user
    const user = await User.create({
      name: name.trim(),
      email: emailNormalized,
      passwordHash
    });

    // 6️⃣ Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    // 7️⃣ Send response
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});


// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const emailNormalized = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailNormalized });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});


// ----------------- TRANSLATE (protected) -----------------

// Protected translate endpoint — user must be logged in (auth middleware)
app.post("/api/translate", auth, async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: "text and targetLang are required" });
    }

    // Use MyMemory (or your current translator)
    const sourceLang = "en";
    const url = "https://api.mymemory.translated.net/get";
    const params = { q: text, langpair: `${sourceLang}|${targetLang}` };

    const response = await axios.get(url, { params });
    const translatedText =
      response.data?.responseData?.translatedText || `Could not translate: ${text}`;

    // Save the translation tied to the logged-in user
    const doc = await Translation.create({
      userId: req.userId,           // <-- important: tie to this user
      originalText: text,
      translatedText,
      targetLang,
    });

    res.json({
      translatedText: doc.translatedText,
      id: doc._id,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    console.error("Error in /api/translate:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Server error in translate endpoint" });
  }
});

// ----------------- STT (AssemblyAI) - public -----------------

// Real Speech-to-Text endpoint using AssemblyAI
app.post("/api/stt", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "AssemblyAI API key not configured" });
    }

    const filePath = req.file.path;

    // 1) Upload the audio file to AssemblyAI
    const uploadResponse = await axios({
      method: "post",
      url: "https://api.assemblyai.com/v2/upload",
      headers: {
        authorization: apiKey,
        "transfer-encoding": "chunked",
      },
      data: fs.createReadStream(filePath),
    });

    const uploadUrl = uploadResponse.data.upload_url;

    // 2) Create a transcription job (language detection enabled by default)
    const transcriptResponse = await axios({
      method: "post",
      url: "https://api.assemblyai.com/v2/transcript",
      headers: {
        authorization: apiKey,
        "content-type": "application/json",
      },
      data: {
        audio_url: uploadUrl,
        language_detection: true,
        // you can set language_code: "en" if you want to force English
      },
    });

    const transcriptId = transcriptResponse.data.id;

    // 3) Poll AssemblyAI until transcription is completed
    let transcription = "";
    while (true) {
      const pollingResponse = await axios({
        method: "get",
        url: `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        headers: {
          authorization: apiKey,
        },
      });

      const status = pollingResponse.data.status;

      if (status === "completed") {
        transcription = pollingResponse.data.text;
        break;
      } else if (status === "error") {
        console.error("AssemblyAI error:", pollingResponse.data.error);
        return res.status(500).json({
          error: "AssemblyAI transcription failed",
          detail: pollingResponse.data.error,
        });
      }

      // Wait 1 second before next poll
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    res.json({
      text: transcription,
    });
  } catch (err) {
    console.error("Error in /api/stt:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Error while processing speech-to-text" });
  }
});

// ----------------- HISTORY (protected) -----------------

// Get logged-in user's translation history (latest first)
app.get("/api/history", auth, async (req, res) => {
  try {
    const history = await Translation.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    console.error("Error in /api/history:", err?.message || err);
    res.status(500).json({ error: "Server error while fetching history" });
  }
});

// ----------------- Start server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at ${PORT}`)
);
