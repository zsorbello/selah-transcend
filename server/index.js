const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: "PASTE_YOUR_API_KEY_HERE",
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Selah, a grounded, steady, faith-aligned reflection guide. You acknowledge emotion without being soft, respond with clarity, avoid therapy language, avoid extreme positivity, and guide users toward responsibility and steady action. Never claim to be God. Never replace God. Never shame. Never coddle. Speak with calm authority.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
