import { useState } from "react";

interface ApiKeyScreenProps {
  onContinue: (key: string) => void;
}

export default function ApiKeyScreen({ onContinue }: ApiKeyScreenProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!key.trim()) {
      setError("Please enter your OpenAI API key to continue.");
      return;
    }
    if (!key.trim().startsWith("sk-")) {
      setError("That doesn't look like a valid OpenAI API key. It should start with 'sk-'.");
      return;
    }
    onContinue(key.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 fade-in">
      <div className="max-w-lg w-full space-y-8">
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: "#4a476a" }}>
            One quick setup step
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#2d2d2d" }}>
            This tool uses OpenAI to generate your personalised reset. Enter your OpenAI API key below to get started. Your key is used only in this session and never stored.
          </p>
        </div>

        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ backgroundColor: "#f8f8f8", border: "1px solid #e9e9eb" }}
        >
          <label
            htmlFor="api-key"
            className="block text-sm font-medium"
            style={{ color: "#4a476a" }}
          >
            OpenAI API Key
          </label>
          <input
            id="api-key"
            type="password"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
            placeholder="sk-..."
            className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e9e9eb",
              color: "#2d2d2d",
              fontFamily: "monospace",
            }}
          />
          {error && (
            <p className="text-sm" style={{ color: "#e63462" }}>
              {error}
            </p>
          )}
          <p className="text-xs" style={{ color: "#888" }}>
            Your API key is stored only in memory and is never saved or sent anywhere other than OpenAI.
          </p>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#4a476a" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
