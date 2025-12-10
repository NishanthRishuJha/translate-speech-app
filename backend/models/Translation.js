const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalText: { type: String, required: true },
    translatedText: { type: String, required: true },
    targetLang: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Translation", translationSchema);
