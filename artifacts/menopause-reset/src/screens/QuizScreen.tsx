import { useState } from "react";
import {
  QUIZ_QUESTIONS,
  QUIZ_OPTIONS,
  QUIZ_FRAMING,
  PATTERN_NAME,
  PATTERN_DESCRIPTION,
  scoreQuiz,
  topStatementsForPattern,
  type PatternId,
} from "@/content/intake";
import { Page, StepHeader, Eyebrow, OptionButton, QuestionCard, BRAND } from "@/components/flow";

interface QuizScreenProps {
  onComplete: (answers: number[], pattern: PatternId, topStatements: string[]) => void;
}

export default function QuizScreen({ onComplete }: QuizScreenProps) {
  const total = QUIZ_QUESTIONS.length;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [pending, setPending] = useState<number | null>(null);
  const [tie, setTie] = useState<PatternId[] | null>(null);

  const finish = (finalAnswers: number[]) => {
    const result = scoreQuiz(finalAnswers);
    if (result.winner) {
      onComplete(finalAnswers, result.winner, result.topStatements);
    } else {
      setTie(result.tied);
    }
  };

  const select = (points: number) => {
    setPending(points);
    setTimeout(() => {
      const next = [...answers];
      next[current] = points;
      setAnswers(next);
      setPending(null);
      if (current < total - 1) {
        setCurrent(current + 1);
      } else {
        finish(next);
      }
    }, 240);
  };

  const back = () => {
    if (tie) {
      setTie(null);
      return;
    }
    if (current > 0) setCurrent(current - 1);
  };

  if (tie) {
    return (
      <Page>
        <StepHeader onBack={back} step={total} total={total} />
        <Eyebrow>One more question</Eyebrow>
        <p className="font-display text-2xl mb-6" style={{ color: BRAND.teal, fontWeight: 600 }}>
          Which one has felt most constant since perimenopause or menopause began?
        </p>
        <div className="flex flex-col gap-2.5">
          {tie.map((p) => (
            <OptionButton key={p} selected={false} onClick={() => onComplete(answers, p, topStatementsForPattern(answers, p))}>
              <span className="font-medium">{PATTERN_NAME[p]}</span>
              <span className="block text-sm mt-1" style={{ opacity: 0.8 }}>
                {PATTERN_DESCRIPTION[p]}
              </span>
            </OptionButton>
          ))}
        </div>
      </Page>
    );
  }

  const q = QUIZ_QUESTIONS[current];
  const selectedPts = pending ?? answers[current];

  return (
    <Page>
      <StepHeader onBack={back} step={current} total={total} showBack={current > 0} />
      <p className="text-sm mb-1" style={{ color: BRAND.muted }}>
        Question {current + 1} of {total}
      </p>
      <p className="text-sm italic mb-5" style={{ color: BRAND.rose }}>
        {QUIZ_FRAMING}
      </p>
      <QuestionCard>
        <p className="text-xl mb-6" style={{ color: BRAND.ink, lineHeight: 1.4 }}>
          {q.text}
        </p>
        <div className="flex flex-col gap-2.5">
          {QUIZ_OPTIONS.map((opt) => (
            <OptionButton key={opt.points} selected={selectedPts === opt.points} onClick={() => select(opt.points)}>
              {opt.label}
            </OptionButton>
          ))}
        </div>
      </QuestionCard>
    </Page>
  );
}
