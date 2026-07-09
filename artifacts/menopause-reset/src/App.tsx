import { useState } from "react";
import IntroScreen from "@/screens/IntroScreen";
import QuizScreen from "@/screens/QuizScreen";
import PatternRevealScreen from "@/screens/PatternRevealScreen";
import WiringScreen from "@/screens/WiringScreen";
import DayShapeScreen from "@/screens/DayShapeScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import ReportScreen from "@/screens/ReportScreen";
import { generateReset, type WiringChoice, type DayShape, type ResetOutput, type ResetSession } from "@/lib/resetClient";
import type { PatternId } from "@/content/intake";
import { BRAND } from "@/components/flow";
import { DEMO_RESULT, DEMO_SESSION } from "@/lib/demoFixture";

type Screen = "intro" | "quiz" | "reveal" | "wiring" | "dayshape" | "loading" | "report" | "error";

function App() {
  // Keyless layout/PDF QA: /?demo renders a full sample report with no quiz or API call.
  const isDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("demo");
  const [screen, setScreen] = useState<Screen>("intro");
  const [patternId, setPatternId] = useState<PatternId | null>(null);
  const [topStatements, setTopStatements] = useState<string[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [wiringChoice, setWiringChoice] = useState<WiringChoice | null>(null);
  const [name, setName] = useState("");
  const [dayShape, setDayShape] = useState<DayShape | null>(null);
  const [result, setResult] = useState<ResetOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (n: string, day: DayShape) => {
    if (!patternId || !wiringChoice) return;
    setScreen("loading");
    setError(null);
    const session: ResetSession = { name: n, patternId, topStatements, wiringChoice, dayShape: day };
    try {
      const out = await generateReset(session);
      setResult(out);
      setScreen("report");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setScreen("error");
    }
  };

  const restart = () => {
    setScreen("intro");
    setPatternId(null); setTopStatements([]); setAnswers([]);
    setWiringChoice(null); setName(""); setDayShape(null); setResult(null); setError(null);
  };

  if (isDemo) {
    return <ReportScreen result={DEMO_RESULT} session={DEMO_SESSION} onRestart={() => { window.location.href = window.location.pathname; }} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      {screen === "intro" && <IntroScreen onStart={() => setScreen("quiz")} />}

      {screen === "quiz" && (
        <QuizScreen
          onComplete={(a, p, tops) => { setAnswers(a); setPatternId(p); setTopStatements(tops); setScreen("reveal"); }}
        />
      )}

      {screen === "reveal" && patternId && (
        <PatternRevealScreen patternId={patternId} onContinue={() => setScreen("wiring")} />
      )}

      {screen === "wiring" && (
        <WiringScreen
          onComplete={(c) => { setWiringChoice(c); setScreen("dayshape"); }}
          onBack={() => setScreen("reveal")}
        />
      )}

      {screen === "dayshape" && (
        <DayShapeScreen
          onComplete={(n, day) => { setName(n); setDayShape(day); run(n, day); }}
          onBack={() => setScreen("wiring")}
        />
      )}

      {screen === "loading" && <LoadingScreen />}

      {screen === "report" && result && patternId && wiringChoice && (
        <ReportScreen result={result} session={{ name, patternId, wiringChoice }} onRestart={restart} />
      )}

      {screen === "error" && (
        <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "#fff" }}>
          <div className="max-w-lg w-full space-y-6 text-center">
            <div className="rounded-2xl p-6" style={{ background: BRAND.mist, border: `1px solid ${BRAND.line}` }}>
              <p className="text-base" style={{ color: BRAND.ink, lineHeight: 1.7 }}>
                We had trouble creating your reset just now. Please wait a moment and try again. If it keeps happening, contact support@masteringmenopausemethod.com
              </p>
              {error && <p className="text-xs mt-3" style={{ color: BRAND.muted }}>Details: {error}</p>}
            </div>
            <button
              onClick={() => dayShape && run(name, dayShape)}
              className="w-full py-4 px-8 rounded-full text-white font-semibold text-base active:scale-95"
              style={{ background: BRAND.teal }}
            >
              Try again
            </button>
            <button onClick={restart} className="text-sm underline" style={{ color: BRAND.muted }}>Start over</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
