import { useState } from "react";
import { WIRING_QUESTIONS } from "@/content/intake";
import type { WiringChoice } from "@/lib/resetClient";
import { Page, StepHeader, Eyebrow, OptionButton, QuestionCard, BRAND } from "@/components/flow";

interface WiringScreenProps {
  onComplete: (choice: WiringChoice) => void;
  onBack: () => void;
}

export default function WiringScreen({ onComplete, onBack }: WiringScreenProps) {
  const total = WIRING_QUESTIONS.length;
  const [current, setCurrent] = useState(0);
  const [choice, setChoice] = useState<Partial<WiringChoice>>({});
  const [pending, setPending] = useState<string | null>(null);

  const q = WIRING_QUESTIONS[current];

  const select = (archetype: string) => {
    setPending(archetype);
    setTimeout(() => {
      const next = { ...choice, [q.key]: archetype };
      setChoice(next);
      setPending(null);
      if (current < total - 1) {
        setCurrent(current + 1);
      } else {
        onComplete(next as WiringChoice);
      }
    }, 220);
  };

  const back = () => {
    if (current === 0) onBack();
    else setCurrent(current - 1);
  };

  const selected = pending ?? choice[q.key];

  return (
    <Page>
      <StepHeader onBack={back} step={current} total={total} />
      <Eyebrow>{q.title}</Eyebrow>
      <p className="text-lg mb-2" style={{ color: BRAND.ink, lineHeight: 1.45 }}>
        {q.prompt}
      </p>
      {q.helper && (
        <p className="text-sm italic mb-5" style={{ color: BRAND.rose, lineHeight: 1.6 }}>
          {q.helper}
        </p>
      )}
      <QuestionCard>
        <div className="flex flex-col gap-2.5">
          {q.options.map((opt) => (
            <OptionButton key={opt.letter} selected={selected === opt.archetype} onClick={() => select(opt.archetype)}>
              {opt.label}
            </OptionButton>
          ))}
        </div>
      </QuestionCard>
    </Page>
  );
}
