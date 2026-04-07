import { useState } from "react";

const PATTERNS = [
  "The Constant Pressure Pattern",
  "The Always-On Pattern",
  "The Mental Overload Pattern",
  "The Holding-It-Together Pattern",
];

const QUESTIONS = [
  "Walk me through what your workday looks like in detail — when it starts, what fills it, and when it ends. The more specific you are, the better.",
  "What kind of business or professional role are you in? The more specific you are, the better.",
  "What’s making your workday feel hardest right now? The more specific you are, the better.",
];

const PLACEHOLDERS = [
  "Take your time... Walk me through what your day actually looks like — what time it starts, what fills most of it (client calls, content, emails, admin, team, planning), and roughly how long you work. The more specific you are about what your day actually contains, the more useful your reset will be.",
  `Take your time... Be as specific as you can — for example: "I'm a consultant with a small team of four. We do brand strategy and messaging for wellness businesses." Or: "I'm a coach and I run a small online education company. I have a VA and I create courses and run group programs." Or: "I'm a therapist in private practice. I see clients four days a week and run a small group program for newly divorced women."`,
  "Take your time... What is actually happening when your workday feels hardest? Name the specific moment, task, or part of the day — not just the feeling. The more concrete you can be, the sharper your reset.",
];

interface PatternScreenProps {
  onSubmit: (pattern: string, answers: string[]) => void;
}

export default function PatternScreen({ onSubmit }: PatternScreenProps) {
  const [step, setStep] = useState<"pattern" | number>("pattern");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [error, setError] = useState("");

  const handlePatternContinue = () => {
    if (!selectedPattern) {
      setError("Please select your pattern to continue.");
      return;
    }
    setError("");
    setStep(0);
  };

  const handleAnswerNext = (index: number) => {
    if (!answers[index].trim()) {
      setError("Please answer this question before moving on.");
      return;
    }
    setError("");
    if (index < QUESTIONS.length - 1) {
      setStep(index + 1);
    } else {
      onSubmit(selectedPattern, answers);
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "pattern") return;
    if (step === 0) {
      setStep("pattern");
      return;
    }
    setStep((step as number) - 1);
  };

  const updateAnswer = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
    setError("");
  };

  const progressSteps = QUESTIONS.length + 1;
  const currentStep = step === "pattern" ? 0 : (step as number) + 1;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 fade-in">
      <div className="max-w-lg w-full space-y-6">
        {typeof step === "number" ? (
          <>
            <div className="flex items-center gap-4 mb-2">
              <button
                type="button"
                onClick={handleBack}
                className="text-sm font-medium transition-opacity hover:opacity-80 shrink-0"
                style={{ color: "#4a476a" }}
              >
                ← Back
              </button>

              <div className="flex gap-2 flex-1">
                {Array.from({ length: progressSteps }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i <= currentStep ? "#4a476a" : "#e9e9eb",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6 fade-in" key={step}>
              <div
                className="rounded-2xl p-6 space-y-4"
                style={{ backgroundColor: "#f8f8f8", border: "1px solid #e9e9eb" }}
              >
                <p
                  className="text-sm font-medium uppercase tracking-wide"
                  style={{ color: "#888" }}
                >
                  Question {(step as number) + 1} of {QUESTIONS.length}
                </p>

                <p
                  className="text-base font-medium leading-snug"
                  style={{ color: "#4a476a" }}
                >
                  {QUESTIONS[step as number]}
                </p>

                <textarea
                  value={answers[step as number]}
                  onChange={(e) => updateAnswer(step as number, e.target.value)}
                  rows={5}
                  placeholder={PLACEHOLDERS[step as number]}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none focus:ring-2"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e9e9eb",
                    color: "#2d2d2d",
                  }}
                />

                {error && (
                  <p className="text-sm" style={{ color: "#e63462" }}>
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleAnswerNext(step as number)}
                className="w-full py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor:
                    (step as number) === QUESTIONS.length - 1 ? "#e63462" : "#4a476a",
                }}
              >
                {(step as number) === QUESTIONS.length - 1
                  ? "Show Me My Reset"
                  : "Next"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-2 mb-2">
              {Array.from({ length: progressSteps }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i <= currentStep ? "#4a476a" : "#e9e9eb",
                  }}
                />
              ))}
            </div>

            <div className="space-y-6 fade-in">
              <div
                className="rounded-2xl p-6 space-y-4"
                style={{ backgroundColor: "#f8f8f8", border: "1px solid #e9e9eb" }}
              >
                <label
                  className="block text-base font-medium"
                  style={{ color: "#4a476a" }}
                >
                  The quiz identified you as:
                </label>

                <select
                  value={selectedPattern}
                  onChange={(e) => {
                    setSelectedPattern(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e9e9eb",
                    color: selectedPattern ? "#2d2d2d" : "#888",
                  }}
                >
                  <option value="" disabled>
                    Select your pattern...
                  </option>
                  {PATTERNS.map((p) => (
                    <option key={p} value={p} style={{ color: "#2d2d2d" }}>
                      {p}
                    </option>
                  ))}
                </select>

                {error && (
                  <p className="text-sm" style={{ color: "#e63462" }}>
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={handlePatternContinue}
                className="w-full py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#4a476a" }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}