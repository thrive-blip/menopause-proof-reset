import { useState } from "react";
import { DAY_SHAPE_QUESTIONS } from "@/content/intake";
import type { DayShape } from "@/lib/resetClient";
import { Page, StepHeader, Eyebrow, PrimaryButton, QuestionCard, BRAND } from "@/components/flow";

interface DayShapeScreenProps {
  onComplete: (name: string, dayShape: DayShape) => void;
  onBack: () => void;
}

const inputStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: `1px solid ${BRAND.line}`,
  color: BRAND.ink,
};

export default function DayShapeScreen({ onComplete, onBack }: DayShapeScreenProps) {
  const total = 4; // name + 3 day-shape questions
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [day, setDay] = useState<DayShape>({ role: "", workday: "", hardest: "" });
  const [error, setError] = useState("");

  const back = () => {
    setError("");
    if (step === 0) onBack();
    else setStep(step - 1);
  };

  const next = () => {
    if (step === 0) {
      if (!name.trim()) return setError("Please tell me your name so I can prepare this for you.");
    } else {
      const key = DAY_SHAPE_QUESTIONS[step - 1].key;
      if (!day[key].trim()) return setError("Please answer this before moving on.");
    }
    setError("");
    if (step < total - 1) setStep(step + 1);
    else onComplete(name.trim(), day);
  };

  return (
    <Page>
      <StepHeader onBack={back} step={step} total={total} />
      {step === 0 ? (
        <>
          <Eyebrow>Almost there</Eyebrow>
          <p className="text-lg mb-5" style={{ color: BRAND.ink, lineHeight: 1.45 }}>
            First, what should I call you? Your reset will be prepared for you by name.
          </p>
          <QuestionCard>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Your first name"
              className="w-full px-4 py-3 rounded-xl text-base outline-none focus:ring-2"
              style={inputStyle}
            />
            {error && <p className="text-sm mt-3" style={{ color: BRAND.rose }}>{error}</p>}
          </QuestionCard>
        </>
      ) : (
        (() => {
          const q = DAY_SHAPE_QUESTIONS[step - 1];
          return (
            <>
              <Eyebrow>Your day, in your words</Eyebrow>
              <p className="text-lg mb-1" style={{ color: BRAND.ink, lineHeight: 1.45 }}>{q.prompt}</p>
              <p className="text-sm mb-5" style={{ color: BRAND.muted, lineHeight: 1.6 }}>{q.helper}</p>
              <QuestionCard>
                <textarea
                  value={day[q.key]}
                  onChange={(e) => { setDay({ ...day, [q.key]: e.target.value }); setError(""); }}
                  rows={6}
                  placeholder={q.placeholder}
                  className="w-full px-4 py-3 rounded-xl text-base outline-none resize-none focus:ring-2"
                  style={inputStyle}
                />
                {error && <p className="text-sm mt-3" style={{ color: BRAND.rose }}>{error}</p>}
              </QuestionCard>
            </>
          );
        })()
      )}
      <div className="mt-6">
        <PrimaryButton onClick={next}>{step === total - 1 ? "Create my reset" : "Next"}</PrimaryButton>
      </div>
    </Page>
  );
}
