import { PATTERN_NAME, WIRING_QUESTIONS, type PatternId } from "@/content/intake";
import { PATTERN_PAGE } from "@/content/patterns";
import {
  renderLetter,
  HOW_TO_USE,
  STAGE2_INTRO,
  STAGE2_INTRO_TITLE,
  STAGE2_CLOSING_FRAME,
  CLOSING,
} from "@/content/framing";
import { wiringForReport, type ResetOutput, type WiringChoice } from "@/lib/resetClient";
import { BRAND } from "@/components/flow";

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

interface ReportSession {
  name: string;
  patternId: PatternId;
  wiringChoice: WiringChoice;
}

interface ReportScreenProps {
  result: ResetOutput;
  session: ReportSession;
  onRestart: () => void;
}

function paras(text: string) {
  return text.split("\n\n").map((p, i) => (
    <p key={i} style={{ color: BRAND.ink, lineHeight: 1.75, marginBottom: 14, fontSize: 16.5 }}>
      {p}
    </p>
  ));
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: BRAND.rose, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 12, fontWeight: 500, marginBottom: 10 }}>
      {children}
    </p>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display" style={{ color: BRAND.teal, fontWeight: 600, fontSize: 30, lineHeight: 1.15, margin: "0 0 6px" }}>
      {children}
    </h2>
  );
}

function Rule() {
  return <div style={{ width: 60, height: 3, background: BRAND.gold, borderRadius: 2, margin: "16px 0 22px" }} />;
}

function Section({ children, breakBefore }: { children: React.ReactNode; breakBefore?: boolean }) {
  return <section className={`rpt-section${breakBefore ? " rpt-break" : ""}`} style={{ marginBottom: 56 }}>{children}</section>;
}

function Signature() {
  return (
    <div style={{ marginTop: 18 }}>
      <p style={{ color: BRAND.ink, marginBottom: 6 }}>Talk soon,</p>
      <img src={asset("signature.png")} alt="Adrienne" style={{ height: 60, display: "block", marginBottom: 4 }} />
      <p style={{ color: BRAND.muted, fontSize: 14 }}>Dr. Adrienne Stein, ND</p>
    </div>
  );
}

function Divider({ src, label }: { src: string; label: string }) {
  return (
    <div className="rpt-divider rpt-break" style={{ position: "relative", margin: "0 0 56px", borderRadius: 12, overflow: "hidden" }}>
      <img src={asset(src)} alt="" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,110,86,0.45)" }} />
      <p className="font-display" style={{ position: "absolute", left: 28, bottom: 22, color: "#fff", fontSize: 26, fontWeight: 600 }}>
        {label}
      </p>
    </div>
  );
}

const printCss = `
.rpt-doc { max-width: 720px; margin: 0 auto; padding: 32px 24px 80px; background: #fff; }
@media print {
  .rpt-break { break-before: page; page-break-before: always; }
  .rpt-section { break-inside: avoid; page-break-inside: avoid; }
  .rpt-cover { break-after: page; page-break-after: always; }
  .rpt-doc { max-width: none; padding: 0; }
}
`;

export default function ReportScreen({ result, session, onRestart }: ReportScreenProps) {
  if (result.mode === "scope" || result.mode === "safety") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "#fff" }}>
        <div className="w-full max-w-lg space-y-6">
          <div className="rounded-2xl p-6" style={{ background: BRAND.mist, border: `1px solid ${BRAND.line}` }}>
            {result.what_you_told_me.split("\n").filter((l) => l.trim()).map((l, i) => (
              <p key={i} className="text-base" style={{ color: BRAND.ink, lineHeight: 1.7, marginBottom: 10 }}>{l}</p>
            ))}
          </div>
          <button onClick={onRestart} className="w-full py-4 px-8 rounded-full text-white font-semibold text-base active:scale-95" style={{ background: BRAND.teal }}>
            Start over
          </button>
        </div>
      </div>
    );
  }

  const reset = result.reset_stage_1!;
  const wiring = wiringForReport(session.wiringChoice);

  const DownloadBar = ({ top }: { top?: boolean }) => (
    <div className="no-print" style={{ textAlign: "center", margin: top ? "0 0 32px" : "48px 0 0" }}>
      <button
        onClick={() => window.print()}
        className="py-3.5 px-9 rounded-full text-white font-semibold text-base active:scale-95 transition-all hover:opacity-90"
        style={{ background: BRAND.teal }}
      >
        ↓ Download your reset (PDF)
      </button>
      <p style={{ color: BRAND.muted, fontSize: 13, marginTop: 10 }}>
        Opens your print dialog. Choose "Save as PDF" to keep it. Your answers are never stored.
      </p>
    </div>
  );

  return (
    <div style={{ background: "#fff" }} className="min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: printCss }} />
      <div className="rpt-doc fade-in">
        <DownloadBar top />

        <div className="rpt-cover" style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 56, minHeight: 460 }}>
          <img src={asset("cover-photo.jpg")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,110,86,0.55), rgba(15,110,86,0.82))" }} />
          <div style={{ position: "relative", padding: "56px 40px", color: "#fff", minHeight: 460, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <p style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12.5, opacity: 0.9, marginBottom: 22 }}>
                A Personalized Working Profile
              </p>
              <h1 className="font-display" style={{ fontSize: 42, fontWeight: 600, lineHeight: 1.12, margin: 0 }}>
                The Menopause-Proof<br />Workday Reset
              </h1>
              <div style={{ width: 64, height: 3, background: BRAND.gold, borderRadius: 2, margin: "24px 0" }} />
              <p style={{ fontSize: 18 }}>Prepared for</p>
              <p className="font-display" style={{ fontSize: 30, fontWeight: 500, fontStyle: "italic" }}>{session.name}</p>
            </div>
            <p style={{ fontSize: 14, letterSpacing: "0.06em" }}>Dr. Adrienne Stein, ND</p>
          </div>
        </div>

        <Section breakBefore><Eyebrow>A note to you</Eyebrow><Heading>The Letter</Heading><Rule />{paras(renderLetter(session.name).replace(/\n\nTalk soon,[\s\S]*$/, ""))}<Signature /></Section>

        <Section breakBefore><Eyebrow>Before you begin</Eyebrow><Heading>How to use this</Heading><Rule />{paras(HOW_TO_USE)}</Section>

        <Divider src="divider-a.jpg" label="How you're built to work" />

        {(() => {
          const pp = PATTERN_PAGE[session.patternId];
          return (
            <Section breakBefore>
              <Eyebrow>This is your pattern</Eyebrow>
              <Heading>{PATTERN_NAME[session.patternId]}</Heading>
              <p style={{ color: BRAND.rose, fontStyle: "italic", fontSize: 16, marginBottom: 8 }}>{pp.tagline}</p>
              <Rule />
              {pp.soundFamiliar.map((stanza, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  {stanza.map((line, j) => (
                    <p key={j} style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16.5, margin: 0 }}>{line}</p>
                  ))}
                </div>
              ))}
              <div style={{ background: BRAND.mist, borderLeft: `3px solid ${BRAND.rose}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", fontStyle: "italic", color: BRAND.ink, fontSize: 16.5, margin: "16px 0" }}>{pp.callout}</div>
              <p style={{ color: BRAND.teal, fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Some women with this pattern also notice:</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
                {pp.alsoNotice.map((it, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, marginBottom: 6, color: BRAND.ink, fontSize: 16 }}><span style={{ color: BRAND.rose }}>•</span><span>{it}</span></li>
                ))}
              </ul>
              <p style={{ color: BRAND.teal, fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Why this is hitting harder now</p>
              <div style={{ background: "#f6f3ec", borderLeft: `3px solid ${BRAND.teal}`, borderRadius: "0 8px 8px 0", padding: "16px 20px" }}>
                {pp.whyNow.map((para, i) => (
                  <p key={i} style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16, marginBottom: i === pp.whyNow.length - 1 ? 0 : 10 }}>{para}</p>
                ))}
              </div>
            </Section>
          );
        })()}

        <Section breakBefore><Eyebrow>In your own words</Eyebrow><Heading>What you told me</Heading><Rule />{paras(result.what_you_told_me)}</Section>

        {wiring.map(({ section, content }) => {
          const title = WIRING_QUESTIONS.find((w) => w.key === section)?.title ?? "";
          return (
            <Section key={section} breakBefore>
              <Eyebrow>{title}</Eyebrow>
              <Heading>{content.title}</Heading>
              <p style={{ color: BRAND.rose, fontStyle: "italic", fontSize: 16, marginBottom: 8 }}>{content.tagline}</p>
              <Rule />
              {paras(content.body)}
              <div style={{ background: BRAND.mist, borderRadius: 12, padding: "18px 22px", marginTop: 18 }}>
                <p style={{ color: BRAND.gold, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Suggestions</p>
                <p style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16 }}>{content.suggestions}</p>
              </div>
            </Section>
          );
        })}

        <Section breakBefore><Eyebrow>The mismatch</Eyebrow><Heading>Where your friction is coming from</Heading><Rule />{paras(result.where_your_friction_is_coming_from!)}</Section>

        <Divider src="divider-b.jpg" label="Your reset" />

        <Section breakBefore>
          <Eyebrow>What to do tomorrow</Eyebrow><Heading>Your reset, stage one</Heading><Rule />
          {[["Stop", reset.stop], ["Shift", reset.shift], ["Protect", reset.protect]].map(([label, text]) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <p style={{ color: BRAND.teal, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>{label}</p>
              <p style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16 }}>{text}</p>
            </div>
          ))}
          <div style={{ background: BRAND.mist, borderRadius: 12, padding: "20px 24px", margin: "20px 0" }}>
            <p style={{ color: BRAND.teal, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12.5, fontWeight: 600, marginBottom: 12 }}>Three moves for tomorrow</p>
            <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
              {reset.three_moves.map((m, i) => (
                <li key={i} style={{ display: "flex", gap: 12, marginBottom: 12, color: BRAND.ink, lineHeight: 1.65, fontSize: 16 }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 999, background: BRAND.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>{i + 1}</span>
                  <span>{m}</span>
                </li>
              ))}
            </ol>
          </div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: BRAND.rose, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>Start here first</p>
            <p style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16, fontWeight: 500 }}>{reset.start_here_first}</p>
          </div>
          <div>
            <p style={{ color: BRAND.rose, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>What to notice</p>
            <p style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16 }}>{reset.what_to_notice}</p>
          </div>
        </Section>

        <Section breakBefore>
          <Eyebrow>The long game</Eyebrow><Heading>{STAGE2_INTRO_TITLE}</Heading><Rule />
          {paras(STAGE2_INTRO)}
          <div style={{ marginTop: 8 }}>{paras(result.where_you_go_from_here!)}</div>
          <div style={{ marginTop: 8 }}>{paras(STAGE2_CLOSING_FRAME)}</div>
        </Section>

        <Section breakBefore><Eyebrow>One last thing</Eyebrow><Heading>The closing</Heading><Rule />{paras(CLOSING.replace(/\n\nTalk soon,[\s\S]*$/, ""))}<Signature /></Section>

        <DownloadBar />
        <p className="no-print" style={{ textAlign: "center", marginTop: 18 }}>
          <button onClick={onRestart} style={{ color: BRAND.muted, fontSize: 14, textDecoration: "underline" }}>Start over</button>
        </p>
      </div>
    </div>
  );
}
