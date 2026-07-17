import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import {
  GENERATION_SYSTEM_PROMPT,
  SCRUB_SYSTEM_PROMPT,
  buildGenerationUserMessage,
  parseEngineJson,
  detectVoiceTells,
  type ResetInput,
  type ResetOutput,
} from "../lib/resetEngine";

const router = Router();

// The model that ships. Tested on Sonnet; do not silently downgrade.
const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 8000;

function isValidInput(b: unknown): b is ResetInput {
  if (typeof b !== "object" || b === null) return false;
  const x = b as Record<string, unknown>;
  return (
    typeof x.name === "string" &&
    typeof x.pattern === "string" &&
    x.pattern.length > 0 &&
    Array.isArray(x.topStatements) &&
    typeof x.taps === "object" &&
    x.taps !== null &&
    typeof x.dayShape === "object" &&
    x.dayShape !== null &&
    Array.isArray(x.actionRewrites)
  );
}

async function callModel(
  client: Anthropic,
  system: string,
  userContent: string,
): Promise<string> {
  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system,
    messages: [{ role: "user", content: userContent }],
  });
  return resp.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

// This route fires 1-2 Claude API calls per request and is publicly
// reachable, so it needs a per-IP cap independent of the $37 checkout -
// otherwise scripted abuse can run up the Anthropic bill or exhaust
// capacity for real customers. 5 per hour comfortably covers someone
// retrying after a mistake or sharing a connection with a colleague.
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again in a while." },
});

router.post("/reset", resetLimiter, async (req, res) => {
  try {
    const input = req.body;

    if (!isValidInput(input)) {
      return res.status(400).json({
        error: "Missing or invalid input. Expected name, pattern, topStatements, taps, dayShape, actionRewrites.",
      });
    }

    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (!apiKey) {
      return res.status(500).json({
        error: "ANTHROPIC_API_KEY is not configured on the server.",
      });
    }

    const client = new Anthropic({ apiKey });

    // CALL 1 — generation
    const genUserMessage = buildGenerationUserMessage(input);
    const genRaw = await callModel(client, GENERATION_SYSTEM_PROMPT, genUserMessage);
    let result: ResetOutput | null = parseEngineJson(genRaw);

    if (!result) {
      return res.status(502).json({
        error: "The writing engine returned malformed output. Please try again.",
      });
    }

    // CALL 2 — voice scrub, only when the detector flags a final output
    if (result.mode === "final" && detectVoiceTells(result, input.name)) {
      try {
        const scrubRaw = await callModel(client, SCRUB_SYSTEM_PROMPT, JSON.stringify(result));
        const scrubbed = parseEngineJson(scrubRaw);
        // Only accept the scrub if it returned a valid final output; otherwise keep the original.
        if (scrubbed && scrubbed.mode === "final") {
          result = scrubbed;
        }
      } catch {
        // Scrub is best-effort. If it fails, return the (still valid) generation output.
      }
    }

    // Nothing is stored. The result is returned and forgotten.
    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return res.status(500).json({ error: message });
  }
});

export default router;
