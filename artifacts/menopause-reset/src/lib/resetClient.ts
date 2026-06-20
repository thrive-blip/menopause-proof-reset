// Client-side glue: assemble the collected answers into the server payload,
// call the stateless /api/reset engine, and expose the selection helpers the
// report uses. Nothing is persisted; this all lives in React state for the session.

import {
  WIRING_QUESTIONS,
  PATTERN_NAME,
  type PatternId,
  type WiringKey,
} from "@/content/intake";
import { WIRING_CONTENT, type WiringContent } from "@/content/wiring";

// Section order for the wiring pages + the engine taps object.
export const WIRING_ORDER: WiringKey[] = [
  "energy",
  "opportunities",
  "decisions",
  "offTrack",
  "processing",
  "emotions",
  "stress",
];

// Her chosen archetype for each wiring section (e.g. { energy: "Steady Engine", ... }).
export type WiringChoice = Record<WiringKey, string>;

export interface DayShape {
  role: string;
  workday: string;
  hardest: string;
}

// What the server returns (mirrors the api-server ResetOutput).
export interface ResetStage1 {
  what_im_seeing: string;
  the_mismatch: string;
  what_its_costing: string[];
  stop: string;
  shift: string;
  protect: string;
  three_moves: string[];
  start_here_first: string;
  what_to_notice: string;
}

export interface ResetOutput {
  mode: "final" | "scope" | "safety";
  pattern_used: string | null;
  what_you_told_me: string;
  where_your_friction_is_coming_from: string | null;
  reset_stage_1: ResetStage1 | null;
  where_you_go_from_here: string | null;
}

export interface ResetSession {
  name: string;
  patternId: PatternId;
  topStatements: string[];
  wiringChoice: WiringChoice;
  dayShape: DayShape;
}

/** Look up the engine tap label for a section's chosen archetype. */
function tapFor(section: WiringKey, archetype: string): string {
  const q = WIRING_QUESTIONS.find((w) => w.key === section);
  const opt = q?.options.find((o) => o.archetype === archetype);
  return opt?.tap ?? archetype;
}

/** The 7 wiring write-ups, in section order, for rendering the report pages. */
export function wiringForReport(choice: WiringChoice): { section: WiringKey; content: WiringContent }[] {
  return WIRING_ORDER.map((section) => ({
    section,
    content: WIRING_CONTENT[choice[section]],
  }));
}

/** Build the exact payload the server engine expects. */
export function buildPayload(session: ResetSession) {
  const taps = {
    energy: tapFor("energy", session.wiringChoice.energy),
    opportunities: tapFor("opportunities", session.wiringChoice.opportunities),
    decisions: tapFor("decisions", session.wiringChoice.decisions),
    offTrack: tapFor("offTrack", session.wiringChoice.offTrack),
    processing: tapFor("processing", session.wiringChoice.processing),
    emotions: tapFor("emotions", session.wiringChoice.emotions),
    stress: tapFor("stress", session.wiringChoice.stress),
  };
  const actionRewrites = WIRING_ORDER.map(
    (section) => WIRING_CONTENT[session.wiringChoice[section]].actionRewrite,
  );
  return {
    name: session.name,
    pattern: PATTERN_NAME[session.patternId],
    topStatements: session.topStatements,
    taps,
    dayShape: session.dayShape,
    actionRewrites,
  };
}

/** Call the engine. Throws on transport/server error. */
export async function generateReset(session: ResetSession): Promise<ResetOutput> {
  const res = await fetch("/api/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildPayload(session)),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { error?: string })?.error;
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return data as ResetOutput;
}
