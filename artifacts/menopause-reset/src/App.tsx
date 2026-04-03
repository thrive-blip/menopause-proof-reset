import { useState } from "react";
import IntroScreen from "@/screens/IntroScreen";
import ApiKeyScreen from "@/screens/ApiKeyScreen";
import PatternScreen from "@/screens/PatternScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import ResultsScreen from "@/screens/ResultsScreen";
import { callOpenAI, buildSystemPrompt, buildUserMessage, type ConversationMessage } from "@/lib/openai";
import { type ParsedResult } from "@/lib/parseResult";

type Screen = "intro" | "apikey" | "pattern" | "loading" | "results";

function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [apiKey, setApiKey] = useState("");
  const [pattern, setPattern] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);

  const handleStart = () => setScreen("apikey");

  const handleApiKeyContinue = (key: string) => {
    setApiKey(key);
    setScreen("pattern");
  };

  const handlePatternSubmit = async (selectedPattern: string, submittedAnswers: string[]) => {
    setPattern(selectedPattern);
    setAnswers(submittedAnswers);
    setScreen("loading");
    setError(null);

    const userMsg = buildUserMessage(selectedPattern, submittedAnswers);
    const systemMsg = buildSystemPrompt();
    const history: ConversationMessage[] = [
      { role: "system", content: systemMsg },
      { role: "user", content: userMsg },
    ];

    try {
      const response = await callOpenAI(apiKey, history);
      setConversationHistory([...history, { role: "assistant", content: JSON.stringify(response) }]);
      setResult(response);
      setScreen("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setScreen("results");
    }
  };

  const handleAdjust = async (feedback: string) => {
    if (!result) return;
    setError(null);

    const adjustHistory: ConversationMessage[] = [
      ...conversationHistory,
      { role: "user", content: `Please adjust my reset based on this additional context: ${feedback}` },
    ];

    try {
      const response = await callOpenAI(apiKey, adjustHistory);
      setConversationHistory([...adjustHistory, { role: "assistant", content: JSON.stringify(response) }]);
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  const handleRetry = () => {
    setScreen("pattern");
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5efea" }}>
      {screen === "intro" && <IntroScreen onStart={handleStart} />}
      {screen === "apikey" && <ApiKeyScreen onContinue={handleApiKeyContinue} />}
      {screen === "pattern" && <PatternScreen onSubmit={handlePatternSubmit} onBack={() => setScreen("intro")} />}
      {screen === "loading" && <LoadingScreen />}
      {screen === "results" && (
        <ResultsScreen
          result={result}
          error={error}
          onRetry={handleRetry}
          onAdjust={handleAdjust}
        />
      )}
    </div>
  );
}

export default App;
