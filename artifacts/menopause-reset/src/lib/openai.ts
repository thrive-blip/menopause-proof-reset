import { parseResult, type ParsedResult } from "./parseResult";

export interface ConversationMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function buildSystemPrompt(): string {
  return `You are The Menopause-Proof Workday Reset Tool. Your job is to help a woman in perimenopause or menopause understand how her quiz pattern is showing up in her workday right now, why it feels so hard, and what to change first. Stay inside the workday interpretation job. Do not provide medical, clinical, hormone or supplement advice. Do not act as a therapist. Assume the user already sees symptoms as part of the problem. Your job is to show that her work pattern is adding a second layer of difficulty on top of that.

You must return a JSON object with this exact structure:
{
  "mode": "normal" | "scope" | "safety",
  "what_i_see": "string",
  "the_mismatch": "string",
  "what_this_is_costing": ["string", "string", "string"],
  "your_reset": {
    "stop": "string",
    "shift": "string",
    "protect": "string"
  },
  "three_moves": ["string", "string", "string"],
  "start_here": "string",
  "what_to_notice": "string"
}

When mode is scope show this exact message in what_i_see: That is outside what this tool covers. This tool is designed to help you understand your workday pattern and what to change first. For clinical support, please speak with a qualified healthcare practitioner.

When mode is safety show this exact message in what_i_see: I am really sorry you are going through this. This tool is not the right place for urgent support. Please reach out to a trusted person or a mental health professional right away. If you may be in immediate danger call emergency services now. If you are in Canada or the US you can call or text 988 for immediate crisis support. For other countries visit https://www.iasp.info/resources/Crisis_Centres/

For normal mode, provide warm, specific, actionable insight tailored to the user's pattern and answers. Be direct and specific — not generic wellness advice. Address the actual workday pattern she described. Keep each section concise but meaningful.`;
}

export function buildUserMessage(pattern: string, answers: string[]): string {
  return `My quiz pattern: ${pattern}

Question 1 - Walk me through the rough shape of your workday, including where it starts to feel hard:
${answers[0] || ""}

Question 2 - What kind of business or professional role are you in?
${answers[1] || ""}

Question 3 - What is the one thing you most want to feel differently about your workday?
${answers[2] || ""}`;
}

export async function callOpenAI(
  apiKey: string,
  messages: ConversationMessage[]
): Promise<ParsedResult> {
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = (errorData as { error?: { message?: string } })?.error?.message;
    throw new Error(msg || `API error: ${response.status}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices[0]?.message?.content ?? "{}";
  return parseResult(content);
}
