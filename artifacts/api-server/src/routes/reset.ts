import { Router } from "express";

const router = Router();

router.post("/reset", async (req, res) => {
  try {
    const { messages } = req.body as {
      messages?: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Missing or invalid messages array.",
      });
    }

    const apiKey = process.env["OPENAI_API_KEY"];

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured on the server.",
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg =
        (data as { error?: { message?: string } })?.error?.message ||
        `OpenAI API error: ${response.status}`;
      return res.status(response.status).json({ error: msg });
    }

    return res.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return res.status(500).json({ error: message });
  }
});

export default router;