export interface FinalOutput {
  what_im_seeing: string;
  the_mismatch: string;
  what_this_is_costing_you_right_now: string[];
  your_reset: {
    stop: string;
    shift: string;
    protect: string;
  };
  your_3_moves_for_tomorrow: string[];
  start_here_first: string;
  what_to_notice: string;
}

export interface ParsedResult {
  mode: "follow_up" | "final" | "scope" | "safety";
  pattern_used: string;
  follow_up_question: string;
  final_output: FinalOutput | null;
}

export function parseResult(content: string): ParsedResult {
  const raw = JSON.parse(content) as Record<string, unknown>;

  console.log("Raw API response:", raw);

  const mode = (raw.mode as ParsedResult["mode"]) || "final";

  const rawFinal = raw.final_output as Record<string, unknown> | null | undefined;
  const rawReset = rawFinal?.your_reset as Record<string, unknown> | undefined;

  const final_output: FinalOutput | null =
    rawFinal
      ? {
          what_im_seeing: (rawFinal.what_im_seeing as string) || "",
          the_mismatch: (rawFinal.the_mismatch as string) || "",
          what_this_is_costing_you_right_now: Array.isArray(rawFinal.what_this_is_costing_you_right_now)
            ? (rawFinal.what_this_is_costing_you_right_now as string[])
            : [],
          your_reset: {
            stop: (rawReset?.stop as string) || "",
            shift: (rawReset?.shift as string) || "",
            protect: (rawReset?.protect as string) || "",
          },
          your_3_moves_for_tomorrow: Array.isArray(rawFinal.your_3_moves_for_tomorrow)
            ? (rawFinal.your_3_moves_for_tomorrow as string[])
            : [],
          start_here_first: (rawFinal.start_here_first as string) || "",
          what_to_notice: (rawFinal.what_to_notice as string) || "",
        }
      : null;

  return {
    mode,
    pattern_used: (raw.pattern_used as string) || "",
    follow_up_question: (raw.follow_up_question as string) || "",
    final_output,
  };
}
