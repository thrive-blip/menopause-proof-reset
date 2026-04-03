import { useState } from "react";

const PATTERNS = [
  "The Constant Pressure Pattern",
  "The Always-On Pattern",
  "The Mental Overload Pattern",
  "The Holding-It-Together Pattern",
];

const QUESTIONS = [
  "Walk me through the rough shape of your workday, including where it starts to feel hard.",
  "What kind of business or professional role are you in?",
  "What is the one thing you most want to feel differently about your workday?",
];

interface PatternScreenProps {
  onSubmit: (pattern: string, answers: string[]) => void;
  onBack: () => void;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm transition-opacity duration-200 hover:opacity-70"
      style={{ color: "#4a476a" }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </button>
  );
}

export default function PatternScreen({ onSubmit, onBack }: PatternScreenProps) {
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
      setError("Please share something before continuing.");
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
    if (step === "pattern") {
      onBack();
    } else if (step === 0) {
      setStep("pattern");
    } else {
      setStep((step as number) - 1);
    }
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
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
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

        {step === "pattern" && (
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
        )}

        {typeof step === "number" && (
          <div className="space-y-6 fade-in" key={step}>
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{ backgroundColor: "#f8f8f8", border: "1px solid #e9e9eb" }}
            >
              <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "#888" }}>
                Question {(step as number) + 1} of {QUESTIONS.length}
              </p>
              <p className="text-base font-medium leading-snug" style={{ color: "#4a476a" }}>
                {QUESTIONS[step as number]}
              </p>
              <textarea
                value={answers[step as number]}
                onChange={(e) => updateAnswer(step as number, e.target.value)}
                rows={5}
                placeholder="Take your time..."
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
              style={{ backgroundColor: (step as number) === QUESTIONS.length - 1 ? "#e63462" : "#4a476a" }}
            >
              {(step as number) === QUESTIONS.length - 1 ? "Show Me My Reset" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
