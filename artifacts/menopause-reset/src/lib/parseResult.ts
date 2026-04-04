export interface ParsedResult {
  mode: "follow_up" | "final" | "scope" | "safety";
  pattern_used: string;
  follow_up_question: string;
  what_i_see: string;
  the_mismatch: string;
  what_this_is_costing: string[];
  your_reset: {
    stop: string;
    shift: string;
    protect: string;
  };
  three_moves: string[];
  start_here: string;
  what_to_notice: string;
}

interface RawParsedResult {
  mode?: "follow_up" | "final" | "scope" | "safety";
  pattern_used?: string;
  follow_up_question?: string;
  final_output?: {
    what_im_seeing?: string;
    the_mismatch?: string;
    what_this_is_costing_you_right_now?: string[];
    your_reset?: {
      stop?: string;
      shift?: string;
      protect?: string;
    };
    your_3_moves_for_tomorrow?: string[];
    start_here_first?: string;
    what_to_notice?: string;
  } | null;
}

export function parseResult(content: string): ParsedResult {
  let raw: RawParsedResult = {};

  try {
    raw = JSON.parse(content) as RawParsedResult;
  } catch {
    raw = {};
  }

  const finalOutput = raw.final_output ?? null;

  const rawCosts = Array.isArray(finalOutput?.what_this_is_costing_you_right_now)
    ? finalOutput!.what_this_is_costing_you_right_now.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0
      )
    : [];

  const rawMoves = Array.isArray(finalOutput?.your_3_moves_for_tomorrow)
    ? finalOutput!.your_3_moves_for_tomorrow.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0
      )
    : [];

  let startHere =
    typeof finalOutput?.start_here_first === "string"
      ? finalOutput.start_here_first
      : "";

  if (!startHere && rawMoves.length > 3) {
    startHere = rawMoves[3];
  }

  return {
    mode:
      raw.mode === "follow_up" ||
      raw.mode === "final" ||
      raw.mode === "scope" ||
      raw.mode === "safety"
        ? raw.mode
        : "final",

    pattern_used:
      typeof raw.pattern_used === "string" ? raw.pattern_used : "",

    follow_up_question:
      typeof raw.follow_up_question === "string" ? raw.follow_up_question : "",

    what_i_see:
      typeof finalOutput?.what_im_seeing === "string"
        ? finalOutput.what_im_seeing
        : "",

    the_mismatch:
      typeof finalOutput?.the_mismatch === "string"
        ? finalOutput.the_mismatch
        : "",

    what_this_is_costing: rawCosts.slice(0, 3),

    your_reset: {
      stop:
        typeof finalOutput?.your_reset?.stop === "string"
          ? finalOutput.your_reset.stop
          : "",
      shift:
        typeof finalOutput?.your_reset?.shift === "string"
          ? finalOutput.your_reset.shift
          : "",
      protect:
        typeof finalOutput?.your_reset?.protect === "string"
          ? finalOutput.your_reset.protect
          : "",
    },

    three_moves: rawMoves.slice(0, 3),

    start_here: startHere,

    what_to_notice:
      typeof finalOutput?.what_to_notice === "string"
        ? finalOutput.what_to_notice
        : "",
  };
}