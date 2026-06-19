import { useRef } from "react";
import { PATTERN_NAME, type PatternId } from "@/content/intake";
import { PATTERN_PAGE } from "@/content/patterns";
import { Page, Eyebrow, GoldRule, PrimaryButton, BRAND } from "@/components/flow";
import { downloadPdf } from "@/lib/downloadPdf";

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
  const contentRef = useRef<HTMLDivElement>(null);

  const download = () => {
    if (contentRef.current) downloadPdf(contentRef.current, `My Pattern - ${PATTERN_NAME[patternId]}.pdf`);
  };

  return (
    <Page>
      <div ref={contentRef}>
        <Eyebrow>Your result</Eyebrow>
        <h2 className="font-display text-3xl md:text-4xl mb-2" style={{ color: BRAND.teal, fontWeight: 600, lineHeight: 1.12 }}>
          {PATTERN_NAME[patternId]}
        </h2>
        <p className="italic" style={{ color: BRAND.rose, fontSize: 16, lineHeight: 1.6 }}>
          {p.tagline}
        </p>
        <GoldRule />

        <SectionHead>Sound familiar?</SectionHead>
        <div className="mb-6">
          {p.soundFamiliar.map((stanza, i) => (
            <div key={i} className="pdf-keep" style={{ marginBottom: 16 }}>
              {stanza.map((line, j) => (
                <p key={j} style={{ color: BRAND.ink, fontSize: 16.5, lineHeight: 1.7, margin: 0 }}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div
          className="italic pdf-keep"
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

        <div className="pdf-keep">
          <SectionHead>Some women with this pattern also notice:</SectionHead>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
            {p.alsoNotice.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: 12, marginBottom: 8, color: BRAND.ink, fontSize: 16.5, lineHeight: 1.6 }}>
                <span style={{ color: BRAND.rose, flexShrink: 0 }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pdf-keep">
          <SectionHead>Why this is hitting harder now</SectionHead>
          <div
            style={{
              background: "#f6f3ec",
              borderLeft: `3px solid ${BRAND.teal}`,
              borderRadius: "0 8px 8px 0",
              padding: "18px 22px",
            }}
          >
            {p.whyNow.map((para, i) => (
              <p key={i} style={{ color: BRAND.ink, fontSize: 16, lineHeight: 1.7, marginBottom: i === p.whyNow.length - 1 ? 0 : 12 }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="no-print" style={{ marginTop: 72 }}>
        <div style={{ marginBottom: 22 }}>
          <p style={{ color: BRAND.rose, fontWeight: 700, fontSize: 21, letterSpacing: "0.01em", marginBottom: 6 }}>
            STEP 1 · Download your pattern
          </p>
          <p style={{ color: BRAND.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            Save it now. You won't be able to come back to this page later.
          </p>
          <button
            onClick={download}
            className="w-full py-3.5 rounded-full font-semibold text-base"
            style={{ background: "transparent", color: BRAND.teal, border: `1.5px solid ${BRAND.teal}` }}
          >
            ↓ Download your pattern (PDF)
          </button>
        </div>

        <div>
          <p style={{ color: BRAND.rose, fontWeight: 700, fontSize: 21, letterSpacing: "0.01em", marginBottom: 6 }}>
            STEP 2 · Build your reset
          </p>
          <p style={{ color: BRAND.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            Once you've saved your pattern, it's time to build your reset.
          </p>
          <PrimaryButton onClick={onContinue}>Build my reset</PrimaryButton>
        </div>
      </div>
    </Page>
  );
}
