import { useState } from "react";

interface FollowUpScreenProps {
  question: string;
  onSubmit: (answer: string) => void;
}

export default function FollowUpScreen({
  question,
  onSubmit,
}: FollowUpScreenProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!answer.trim()) {
      setError("Please answer this question before moving on.");
      return;
    }
    setError("");
    onSubmit(answer);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 fade-in">
      <div className="max-w-lg w-full space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex gap-2 flex-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i <= 4 ? "#4a476a" : "#e9e9eb",
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ backgroundColor: "#f8f8f8", border: "1px solid #e9e9eb" }}
        >
          <p
            className="text-sm font-medium uppercase tracking-wide"
            style={{ color: "#888" }}
          >
            One quick clarifying question
          </p>

          <p
            className="text-base font-medium leading-snug"
            style={{ color: "#4a476a" }}
          >
            {question}
          </p>

          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError("");
            }}
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
          onClick={handleSubmit}
          className="w-full py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#e63462" }}
        >
          Finish My Reset
        </button>
      </div>
    </div>
  );
}
