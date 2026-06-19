import { PATTERN_NAME, type PatternId } from "@/content/intake";
import { PATTERN_PAGE } from "@/content/patterns";
import { Page, Eyebrow, GoldRule, PrimaryButton, BRAND } from "@/components/flow";

interface PatternRevealScreenProps {
  patternId: PatternId;
  onContinue: () => void;
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-semibold mb-3" style={{ color: BRAND.teal, fontSize: 17 }}>
      {children}
    </p>
  );
}

export default function PatternRevealScreen({ patternId, onContinue }: PatternRevealScreenProps) {
  const p = PATTERN_PAGE[patternId];
  return (
    <Page>
      <Eyebrow>Your result</Eyebrow>
      <h2
        className="font-display text-3xl md:text-4xl mb-2"
        style={{ color: BRAND.teal, fontWeight: 600, lineHeight: 1.12 }}
      >
        {PATTERN_NAME[patternId]}
      </h2>
      <p className="italic" style={{ color: BRAND.rose, fontSize: 16, lineHeight: 1.6 }}>
        {p.tagline}
      </p>
      <GoldRule />

      <SectionHead>Sound familiar?</SectionHead>
      <div className="mb-6">
        {p.soundFamiliar.map((stanza, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            {stanza.map((line, j) => (
              <p key={j} style={{ color: BRAND.ink, fontSize: 16.5, lineHeight: 1.7, margin: 0 }}>
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div
        className="italic"
        style={{
          background: BRAND.mist,
          borderLeft: `3px solid ${BRAND.rose}`,
          borderRadius: "0 8px 8px 0",
          padding: "14px 18px",
          color: BRAND.ink,
          fontSize: 17,
          marginBottom: 24,
        }}
      >
        {p.callout}
      </div>

      <SectionHead>Some women with this pattern also notice:</SectionHead>
      <ul className="mb-7" style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
        {p.alsoNotice.map((item, i) => (
          <li key={i} style={{ display: "flex", gap: 12, marginBottom: 8, color: BRAND.ink, fontSize: 16.5, lineHeight: 1.6 }}>
            <span style={{ color: BRAND.rose, flexShrink: 0 }}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <SectionHead>Why this is hitting harder now</SectionHead>
      <div
        style={{
          background: "#f6f3ec",
          borderLeft: `3px solid ${BRAND.teal}`,
          borderRadius: "0 8px 8px 0",
          padding: "18px 22px",
          marginBottom: 32,
        }}
      >
        {p.whyNow.map((para, i) => (
          <p key={i} style={{ color: BRAND.ink, fontSize: 16, lineHeight: 1.7, marginBottom: i === p.whyNow.length - 1 ? 0 : 12 }}>
            {para}
          </p>
        ))}
      </div>

      <div className="no-print">
        <PrimaryButton onClick={onContinue}>Continue to your reset</PrimaryButton>
        <button
          onClick={() => window.print()}
          className="w-full mt-3 py-3 rounded-full font-medium text-base"
          style={{ background: "transparent", color: BRAND.teal, border: `1.5px solid ${BRAND.teal}` }}
        >
          ↓ Download this page
        </button>
        <p className="text-sm text-center mt-4" style={{ color: BRAND.muted }}>
          A few quick questions next, so your reset fits how you actually work.
        </p>
      </div>
    </Page>
  );
}
