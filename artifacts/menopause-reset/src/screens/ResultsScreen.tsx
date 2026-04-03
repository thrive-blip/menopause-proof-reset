import { useState, useRef } from "react";
import { type ParsedResult } from "@/lib/parseResult";

interface ResultsScreenProps {
  result: ParsedResult | null;
  error: string | null;
  onRetry: () => void;
  onAdjust: (feedback: string) => Promise<void>;
}

function SectionCard({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 md:p-6"
      style={{
        backgroundColor: "#f8f8f8",
        border: `1px solid #e9e9eb`,
        borderLeft: accent ? "4px solid #4a476a" : "1px solid #e9e9eb",
      }}
    >
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#888" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ResultsScreen({
  result,
  error,
  onRetry,
  onAdjust,
}: ResultsScreenProps) {
  const [feedback, setFeedback] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  if (error && !result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full space-y-6 text-center">
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "#f8f8f8", border: "1px solid #e9e9eb" }}
          >
            <p className="text-base mb-2" style={{ color: "#2d2d2d" }}>
              We are having trouble connecting right now. Please wait a moment and try again. If the problem continues contact us at{" "}
              <a
                href="mailto:support@masteringmenopausemethod.com"
                style={{ color: "#4a476a" }}
                className="underline"
              >
                support@masteringmenopausemethod.com
              </a>
            </p>
            {error && (
              <p className="text-xs mt-3" style={{ color: "#888" }}>
                Error: {error}
              </p>
            )}
          </div>
          <button
            onClick={onRetry}
            className="w-full py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#4a476a" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  if (result.mode === "scope" || result.mode === "safety") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full space-y-6">
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "#f8f8f8",
              border: "1px solid #e9e9eb",
              borderLeft: "4px solid #4a476a",
            }}
          >
            <p className="text-base leading-relaxed" style={{ color: "#2d2d2d" }}>
              {result.what_i_see}
            </p>
          </div>
          <button
            onClick={onRetry}
            className="w-full py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#4a476a" }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const copyText = () => {
    const lines: string[] = [
      "THE MENOPAUSE-PROOF WORKDAY RESET",
      "",
      "WHAT I'M SEEING",
      result.what_i_see,
      "",
      "THE MISMATCH",
      result.the_mismatch,
      "",
      "WHAT THIS IS COSTING YOU RIGHT NOW",
      ...result.what_this_is_costing.map((item) => `• ${item}`),
      "",
      "YOUR RESET",
      `Stop: ${result.your_reset.stop}`,
      `Shift: ${result.your_reset.shift}`,
      `Protect: ${result.your_reset.protect}`,
      "",
      "YOUR 3 MOVES FOR TOMORROW",
      ...result.three_moves.map((move, i) => `${i + 1}. ${move}`),
      "",
      "START HERE FIRST",
      result.start_here,
      "",
      "WHAT TO NOTICE",
      result.what_to_notice,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleAdjust = async () => {
    if (!feedback.trim()) {
      setAdjustError("Please share what feels off before submitting.");
      return;
    }
    setAdjustError("");
    setAdjusting(true);
    try {
      await onAdjust(feedback);
      setFeedback("");
    } catch {
      setAdjustError("Something went wrong. Please try again.");
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-16 fade-in">
      <div className="max-w-lg mx-auto space-y-4" ref={resultRef}>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: "#4a476a" }}>
          Your Workday Reset
        </h2>

        <SectionCard title="What I'm seeing" accent>
          <p className="text-sm leading-relaxed" style={{ color: "#2d2d2d" }}>
            {result.what_i_see}
          </p>
        </SectionCard>

        <SectionCard title="The mismatch">
          <p className="text-sm leading-relaxed" style={{ color: "#2d2d2d" }}>
            {result.the_mismatch}
          </p>
        </SectionCard>

        <SectionCard title="What this is costing you right now">
          <ul className="space-y-2">
            {result.what_this_is_costing.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "#2d2d2d" }}>
                <span style={{ color: "#4a476a" }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Your reset" accent>
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#4a476a" }}>
                Stop
              </span>
              <p className="text-sm mt-1" style={{ color: "#2d2d2d" }}>
                {result.your_reset.stop}
              </p>
            </div>
            <div className="border-t" style={{ borderColor: "#e9e9eb" }} />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#4a476a" }}>
                Shift
              </span>
              <p className="text-sm mt-1" style={{ color: "#2d2d2d" }}>
                {result.your_reset.shift}
              </p>
            </div>
            <div className="border-t" style={{ borderColor: "#e9e9eb" }} />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#4a476a" }}>
                Protect
              </span>
              <p className="text-sm mt-1" style={{ color: "#2d2d2d" }}>
                {result.your_reset.protect}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Your 3 moves for tomorrow">
          <ol className="space-y-3">
            {result.three_moves.map((move, i) => (
              <li key={i} className="flex gap-3 text-sm" style={{ color: "#2d2d2d" }}>
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: "#4a476a" }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{move}</span>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title="Start here first" accent>
          <p
            className="text-base leading-relaxed font-medium"
            style={{ color: "#2d2d2d" }}
          >
            {result.start_here}
          </p>
        </SectionCard>

        <SectionCard title="What to notice">
          <p className="text-sm leading-relaxed" style={{ color: "#2d2d2d" }}>
            {result.what_to_notice}
          </p>
        </SectionCard>

        <p
          className="text-sm text-center pt-2 pb-4 italic"
          style={{ color: "#888" }}
        >
          You do not need to do all of this at once. Start with the first move.
        </p>

        <button
          onClick={copyText}
          className="w-full py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#4a476a" }}
        >
          {copied ? "Copied!" : "Copy My Reset"}
        </button>

        <div
          className="rounded-2xl p-6 mt-6 space-y-4"
          style={{ backgroundColor: "#f8f8f8", border: "1px solid #e9e9eb" }}
        >
          <h3 className="text-base font-semibold" style={{ color: "#4a476a" }}>
            Something feel off?
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "#2d2d2d" }}>
            If any part of this does not feel quite right for your situation — or if there is a real constraint in your day I should know about — tell me here and I will adjust.
          </p>
          <textarea
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              setAdjustError("");
            }}
            rows={4}
            placeholder="Share what feels off or what I'm missing..."
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none focus:ring-2"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e9e9eb",
              color: "#2d2d2d",
            }}
          />
          {adjustError && (
            <p className="text-sm" style={{ color: "#e63462" }}>
              {adjustError}
            </p>
          )}
          <button
            onClick={handleAdjust}
            disabled={adjusting}
            className="w-full py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ backgroundColor: "#e63462" }}
          >
            {adjusting ? "Adjusting…" : "Adjust My Reset"}
          </button>
        </div>
      </div>
    </div>
  );
}
