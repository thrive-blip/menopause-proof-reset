export interface ParsedResult {
  mode: "normal" | "scope" | "safety";
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

export function parseResult(content: string): ParsedResult {
  const raw = JSON.parse(content) as Partial<ParsedResult>;

  return {
    mode: (raw.mode as ParsedResult["mode"]) || "normal",
    what_i_see: raw.what_i_see || "",
    the_mismatch: raw.the_mismatch || "",
    what_this_is_costing: Array.isArray(raw.what_this_is_costing) ? raw.what_this_is_costing : [],
    your_reset: {
      stop: raw.your_reset?.stop || "",
      shift: raw.your_reset?.shift || "",
      protect: raw.your_reset?.protect || "",
    },
    three_moves: Array.isArray(raw.three_moves) ? raw.three_moves : [],
    start_here: raw.start_here || "",
    what_to_notice: raw.what_to_notice || "",
  };
}
