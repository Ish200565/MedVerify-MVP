/**
 * chatbot.route.js
 * Mount this in your main app.js / server.js as:
 *   app.use("/api/chatbot", require("./routes/chatbot.route"));
 */

const express = require("express");
const router  = express.Router();
const { getReply } = require("../chatbot/chatbotEngine"); // adjust path if needed

/**
 * POST /api/chatbot/ask
 * Body: { message: string, history: Array<{role, content}> }
 * Returns: { reply: string }
 */
router.post("/ask", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    const reply = getReply(message.trim());
    return res.json({ reply });

  } catch (err) {
    console.error("Chatbot error:", err);
    return res.status(500).json({
      reply: "Sorry, something went wrong on my end. Please try again.",
    });
  }
});

module.exports = router;
