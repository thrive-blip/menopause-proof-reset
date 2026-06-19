import { PATTERN_NAME, type PatternId } from "@/content/intake";
import { PATTERN_PAGE } from "@/content/patterns";
import { Page, Eyebrow, GoldRule, PrimaryButton, BRAND } from "@/components/flow";

interface PatternRevealScreenProps {
  patternId: PatternId;
  onContinue: () => void;
}

export default function PatternRevealScreen({ patternId, onContinue }: PatternRevealScreenProps) {
  const paragraphs = PATTERN_PAGE[patternId].split("\n\n");
  return (
    <Page>
      <Eyebrow>This is your pattern</Eyebrow>
      <h2 className="font-display text-3xl md:text-4xl mb-1" style={{ color: BRAND.teal, fontWeight: 600, lineHeight: 1.12 }}>
        {PATTERN_NAME[patternId]}
      </h2>
      <GoldRule />
      <div className="space-y-4 mb-8">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-base" style={{ color: BRAND.ink, lineHeight: 1.7 }}>
            {p}
          </p>
        ))}
      </div>
      <PrimaryButton onClick={onContinue}>Continue to your reset</PrimaryButton>
      <p className="text-sm text-center mt-4" style={{ color: BRAND.muted }}>
        A few quick questions next, so your reset fits how you actually work.
      </p>
    </Page>
  );
}
