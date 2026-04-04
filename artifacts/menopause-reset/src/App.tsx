import { useState } from "react";
import IntroScreen from "@/screens/IntroScreen";
import PatternScreen from "@/screens/PatternScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import ResultsScreen from "@/screens/ResultsScreen";
import FollowUpScreen from "@/screens/FollowUpScreen";
import {
  callOpenAI,
  buildSystemPrompt,
  buildUserMessage,
  buildFollowUpUserMessage,
  type ConversationMessage,
} from "@/lib/openai";
import { type ParsedResult } from "@/lib/parseResult";

type Screen =
  | "intro"
  | "pattern"
  | "followup"
  | "loading"
  | "results";

function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [pattern, setPattern] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState("");

  const handleStart = () => setScreen("pattern");

  const handlePatternSubmit = async (selectedPattern: string, submittedAnswers: string[]) => {
    setPattern(selectedPattern);
    setAnswers(submittedAnswers);
    setScreen("loading");
    setError(null);
    setResult(null);
    setFollowUpQuestion("");

    const userMsg = buildUserMessage(selectedPattern, submittedAnswers);
    const systemMsg = buildSystemPrompt();

    const history: ConversationMessage[] = [
      { role: "system", content: systemMsg },
      { role: "user", content: userMsg },
    ];

    try {
      const response = await callOpenAI("", history);
      setConversationHistory([...history, { role: "assistant", content: JSON.stringify(response) }]);

      if (response.mode === "follow_up" && response.follow_up_question) {
        setFollowUpQuestion(response.follow_up_question);
        setScreen("followup");
        return;
      }

      setResult(response);
      setScreen("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setScreen("results");
    }
  };

  const handleFollowUpSubmit = async (followUpAnswer: string) => {
    setScreen("loading");
    setError(null);

    const userMsg = buildFollowUpUserMessage(
      pattern,
      answers,
      followUpQuestion,
      followUpAnswer
    );

    const systemMsg = buildSystemPrompt(
      "This is the final pass. Do not ask another follow-up question. Return the final output now."
    );

    const history: ConversationMessage[] = [
      { role: "system", content: systemMsg },
      { role: "user", content: userMsg },
    ];

    try {
      const response = await callOpenAI("", history);
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
      {
        role: "user",
        content: `Please adjust my reset based on this additional context: ${feedback}`,
      },
    ];

    try {
      const response = await callOpenAI("", adjustHistory);
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
    setFollowUpQuestion("");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5efea" }}>
      {screen === "intro" && <IntroScreen onStart={handleStart} />}
      {screen === "pattern" && <PatternScreen onSubmit={handlePatternSubmit} />}
      {screen === "followup" && (
        <FollowUpScreen
          question={followUpQuestion}
          onSubmit={handleFollowUpSubmit}
        />
      )}
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