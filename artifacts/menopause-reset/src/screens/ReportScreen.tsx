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
import { useRef, useState, type ReactNode } from "react";
import { wiringForReport, type ResetOutput, type WiringChoice } from "@/lib/resetClient";
import { BRAND } from "@/components/flow";
import { pdf } from "@react-pdf/renderer";
import { ReportPdf } from "@/lib/ReportPdf";

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

// One A4 page is ~1018 CSS px tall at the captured width. Cover + dividers fill a page.
const PAGE_H = 1010;
const TEAL_BG = `linear-gradient(160deg, ${BRAND.teal} 0%, ${BRAND.tealDeep} 100%)`;

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

// Render copy into paragraphs, turning runs of "- " / "•" lines into a real
// stacked bullet list (html2pdf renders a plain <p> as one run-on line otherwise).
const isBullet = (l: string) => /^[-•]\s+/.test(l.trim());

function paras(text: string) {
  return text.split("\n\n").map((block, i) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const nodes: ReactNode[] = [];
    let run: string[] = [];
    const flush = () => {
      if (!run.length) return;
      const items = run;
      run = [];
      nodes.push(
        <ul key={`u${nodes.length}`} className="pdf-keep" style={{ listStyle: "none", padding: 0, margin: "4px 0 14px" }}>
          {items.map((b, j) => (
            <li key={j} style={{ display: "flex", gap: 10, marginBottom: 6, color: BRAND.ink, lineHeight: 1.7, fontSize: 16.5 }}>
              <span style={{ color: BRAND.rose, flexShrink: 0 }}>•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>,
      );
    };
    lines.forEach((line) => {
      if (isBullet(line)) {
        run.push(line.replace(/^[-•]\s+/, ""));
      } else {
        flush();
        nodes.push(
          <p key={`p${nodes.length}`} className="pdf-keep" style={{ color: BRAND.ink, lineHeight: 1.75, marginBottom: 14, fontSize: 16.5 }}>
            {line}
          </p>,
        );
      }
    });
    flush();
    return <div key={i}>{nodes}</div>;
  });
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p style={{ color: BRAND.rose, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 12, fontWeight: 500, marginBottom: 10 }}>
      {children}
    </p>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display" style={{ color: BRAND.teal, fontWeight: 600, fontSize: 30, lineHeight: 1.15, margin: "0 0 6px" }}>
      {children}
    </h2>
  );
}

function SubLabel({ children, color = BRAND.teal }: { children: ReactNode; color?: string }) {
  return (
    <p style={{ color, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 12.5, fontWeight: 600, margin: "0 0 6px" }}>
      {children}
    </p>
  );
}

function Rule() {
  return <div style={{ width: 60, height: 3, background: BRAND.gold, borderRadius: 2, margin: "16px 0 22px" }} />;
}

function Section({ children, breakBefore }: { children: ReactNode; breakBefore?: boolean }) {
  return (
    <section className={`rpt-section${breakBefore ? " rpt-break" : ""}`} style={{ padding: "48px 44px 56px" }}>
      {children}
    </section>
  );
}

function Signature() {
  return (
    <div style={{ marginTop: 18 }}>
      <p style={{ color: BRAND.ink, marginBottom: 6 }}>Talk soon,</p>
      <img src={asset("signature.png")} alt="Adrienne" style={{ height: 60, display: "block", marginBottom: 4 }} />
      <p style={{ color: BRAND.muted, fontSize: 14 }}>Dr. Adrienne, ND</p>
    </div>
  );
}

// Full-page designed cover, teal bleeding to the page edges. No photo.
function Cover({ name }: { name: string }) {
  return (
    <div
      className="rpt-cover"
      style={{
        minHeight: PAGE_H,
        background: TEAL_BG,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 56px",
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: 999,
          border: `2px solid ${BRAND.gold}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 42,
        }}
      >
        <span className="font-display" style={{ fontSize: 44, color: BRAND.gold, fontWeight: 500, lineHeight: 1 }}>M</span>
      </div>
      <p style={{ letterSpacing: "0.26em", textTransform: "uppercase", fontSize: 12.5, opacity: 0.85, marginBottom: 30 }}>
        A Personalized Working Profile
      </p>
      <h1 className="font-display" style={{ fontSize: 50, fontWeight: 600, lineHeight: 1.1, margin: 0 }}>
        The Menopause-Proof<br />Workday Reset
      </h1>
      <div style={{ width: 70, height: 3, background: BRAND.gold, borderRadius: 2, margin: "34px 0" }} />
      <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 8 }}>Prepared for</p>
      <p className="font-display" style={{ fontSize: 32, fontWeight: 500, fontStyle: "italic", margin: 0 }}>{name}</p>
      <p style={{ fontSize: 13.5, letterSpacing: "0.08em", marginTop: 52, opacity: 0.85 }}>DR. ADRIENNE STEIN, ND</p>
    </div>
  );
}

// Full-page designed part divider, teal, no photo.
function PartDivider({ part, title }: { part: string; title: string }) {
  return (
    <div
      className="rpt-section rpt-break rpt-divider"
      style={{
        minHeight: PAGE_H,
        background: TEAL_BG,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 56px",
      }}
    >
      <p style={{ letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 13, color: BRAND.gold, fontWeight: 600, marginBottom: 26 }}>
        {part}
      </p>
      <h2 className="font-display" style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.18, margin: 0 }}>{title}</h2>
      <div style={{ width: 70, height: 3, background: BRAND.gold, borderRadius: 2, marginTop: 34 }} />
    </div>
  );
}

// Pull the two concrete moves out of an action-rewrite block for the quick-reference chart.
function movesFromRewrite(ar: string): string[] {
  const marker = "A couple of things to try:";
  const idx = ar.indexOf(marker);
  const rest = idx >= 0 ? ar.slice(idx + marker.length) : ar;
  return rest
    .split(/\n-\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const printCss = `
.rpt-doc { max-width: 720px; margin: 0 auto; background: #fff; }
@media print {
  @page { size: A4; margin: 0; }
  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .no-print { display: none !important; }
  .rpt-doc { max-width: none !important; width: 100% !important; margin: 0 !important; }
  .rpt-break { break-before: page; page-break-before: always; }
  .pdf-keep { break-inside: avoid; page-break-inside: avoid; }
  /* full-bleed teal pages fill the sheet edge to edge */
  .rpt-cover, .rpt-divider { min-height: 100vh !important; break-inside: avoid; }
  .rpt-cover { break-after: page; }
}
`;

export default function ReportScreen({ result, session, onRestart }: ReportScreenProps) {
  const docRef = useRef<HTMLDivElement>(null);
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
  const [saving, setSaving] = useState(false);

  const savePdf = async () => {
    setSaving(true);
    try {
      const blob = await pdf(<ReportPdf result={result} session={session} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Your Reset - ${session.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      console.error("PDF generation failed", e);
      alert("Sorry, the PDF could not be generated just now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const DownloadBar = ({ top }: { top?: boolean }) => (
    <div className="no-print" data-html2canvas-ignore="true" style={{ textAlign: "center", padding: top ? "32px 24px 0" : "0 24px 40px" }}>
      <button
        onClick={savePdf}
        disabled={saving}
        className="py-3.5 px-9 rounded-full text-white font-semibold text-base active:scale-95 transition-all hover:opacity-90"
        style={{ background: BRAND.teal, opacity: saving ? 0.7 : 1 }}
      >
        {saving ? "Preparing your PDF…" : "↓ Download your reset (PDF)"}
      </button>
      <p style={{ color: BRAND.muted, fontSize: 13, marginTop: 10 }}>
        Saves straight to your device. Your answers are never stored.
      </p>
    </div>
  );

  return (
    <div style={{ background: "#fff" }} className="min-h-screen fade-in">
      <style dangerouslySetInnerHTML={{ __html: printCss }} />
      <div ref={docRef} className="rpt-doc">
        <DownloadBar top />

        <Cover name={session.name} />

        <Section breakBefore>
          <Eyebrow>A note to you</Eyebrow>
          <Heading>The Letter</Heading>
          <Rule />
          {paras(renderLetter(session.name).replace(/\n\nTalk soon,[\s\S]*$/, ""))}
          <Signature />
        </Section>

        <Section breakBefore>
          <Eyebrow>Before you begin</Eyebrow>
          <Heading>How to use this document</Heading>
          <Rule />
          {paras(HOW_TO_USE)}
        </Section>

        {(() => {
          const pp = PATTERN_PAGE[session.patternId];
          return (
            <Section breakBefore>
              <Eyebrow>This is your pattern</Eyebrow>
              <Heading>{PATTERN_NAME[session.patternId]}</Heading>
              <p style={{ color: BRAND.rose, fontStyle: "italic", fontSize: 16, marginBottom: 8 }}>{pp.tagline}</p>
              <Rule />
              {pp.soundFamiliar.map((stanza, i) => (
                <div key={i} className="pdf-keep" style={{ marginBottom: 14 }}>
                  {stanza.map((line, j) => (
                    <p key={j} style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16.5, margin: 0 }}>{line}</p>
                  ))}
                </div>
              ))}
              <div className="pdf-keep" style={{ background: BRAND.mist, borderLeft: `3px solid ${BRAND.rose}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", fontStyle: "italic", color: BRAND.ink, fontSize: 16.5, margin: "16px 0" }}>{pp.callout}</div>
              <p className="pdf-keep" style={{ color: BRAND.teal, fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Some women with this pattern also notice:</p>
              <ul className="pdf-keep" style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
                {pp.alsoNotice.map((it, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, marginBottom: 6, color: BRAND.ink, fontSize: 16 }}><span style={{ color: BRAND.rose }}>•</span><span>{it}</span></li>
                ))}
              </ul>
              <p style={{ color: BRAND.teal, fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Why this is hitting harder now</p>
              <div className="pdf-keep" style={{ background: BRAND.mist, borderLeft: `3px solid ${BRAND.teal}`, borderRadius: "0 8px 8px 0", padding: "16px 20px" }}>
                {pp.whyNow.map((para, i) => (
                  <p key={i} style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16, marginBottom: i === pp.whyNow.length - 1 ? 0 : 10 }}>{para}</p>
                ))}
              </div>
            </Section>
          );
        })()}

        <Section breakBefore>
          <Eyebrow>In your own words</Eyebrow>
          <Heading>What You Told Me</Heading>
          <Rule />
          {paras(result.what_you_told_me)}
        </Section>

        <PartDivider part="Part One" title="How You're Built to Work" />

        {wiring.map(({ section, content }) => {
          const title = WIRING_QUESTIONS.find((w) => w.key === section)?.title ?? "";
          return (
            <Section key={section} breakBefore>
              <Eyebrow>{title}</Eyebrow>
              <Heading>{content.title}</Heading>
              <p style={{ color: BRAND.rose, fontStyle: "italic", fontSize: 16, marginBottom: 8 }}>{content.tagline}</p>
              <Rule />
              {paras(content.body)}
              <div className="pdf-keep" style={{ background: BRAND.mist, borderRadius: 12, padding: "18px 22px", marginTop: 18 }}>
                <p style={{ color: BRAND.gold, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Suggestions</p>
                <p style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16 }}>{content.suggestions}</p>
              </div>
            </Section>
          );
        })}

        <Section breakBefore>
          <Eyebrow>The big picture</Eyebrow>
          <Heading>Where Your Friction Is Coming From</Heading>
          <Rule />
          {paras(result.where_your_friction_is_coming_from!)}
        </Section>

        <PartDivider part="Part Two" title="Your Reset" />

        <Section breakBefore>
          <Eyebrow>What to do tomorrow</Eyebrow>
          <Heading>Your Reset · Step One</Heading>
          <Rule />

          <div className="pdf-keep" style={{ marginBottom: 18 }}>
            <SubLabel>What I'm seeing</SubLabel>
            <p style={{ color: BRAND.ink, lineHeight: 1.75, fontSize: 16.5 }}>{reset.what_im_seeing}</p>
          </div>

          <div className="pdf-keep" style={{ marginBottom: 18 }}>
            <SubLabel>The mismatch</SubLabel>
            <p style={{ color: BRAND.ink, lineHeight: 1.75, fontSize: 16.5 }}>{reset.the_mismatch}</p>
          </div>

          <div className="pdf-keep" style={{ marginBottom: 20 }}>
            <SubLabel>What this is costing you right now</SubLabel>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {reset.what_its_costing.map((c, i) => (
                <li key={i} style={{ display: "flex", gap: 10, marginBottom: 8, color: BRAND.ink, fontSize: 16, lineHeight: 1.65 }}>
                  <span style={{ color: BRAND.rose }}>•</span><span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pdf-keep" style={{ marginBottom: 4 }}>
            {[["Stop", reset.stop], ["Shift", reset.shift], ["Protect", reset.protect]].map(([label, text]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <SubLabel>{label}</SubLabel>
                <p style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16 }}>{text}</p>
              </div>
            ))}
          </div>

          <div className="pdf-keep" style={{ background: BRAND.mist, borderRadius: 12, padding: "20px 24px", margin: "20px 0" }}>
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

          <div className="pdf-keep" style={{ marginBottom: 16 }}>
            <SubLabel color={BRAND.rose}>Start here first</SubLabel>
            <p style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16, fontWeight: 500 }}>{reset.start_here_first}</p>
          </div>
          <div className="pdf-keep">
            <SubLabel color={BRAND.rose}>What to notice</SubLabel>
            <p style={{ color: BRAND.ink, lineHeight: 1.7, fontSize: 16 }}>{reset.what_to_notice}</p>
          </div>
        </Section>

        <Section breakBefore>
          <Eyebrow>The coming weeks</Eyebrow>
          <Heading>{STAGE2_INTRO_TITLE}</Heading>
          <Rule />
          {paras(STAGE2_INTRO)}
          <div style={{ marginTop: 8 }}>{paras(result.where_you_go_from_here!)}</div>
        </Section>

        <Section breakBefore>
          <Eyebrow>Your quick-reference for the weeks ahead</Eyebrow>
          <Heading>Your Seven Shifts, At a Glance</Heading>
          <Rule />
          {wiring.map(({ section, content }) => {
            const title = WIRING_QUESTIONS.find((w) => w.key === section)?.title ?? "";
            const moves = movesFromRewrite(content.actionRewrite);
            return (
              <div key={section} className="pdf-keep" style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${BRAND.line}` }}>
                <p style={{ color: BRAND.rose, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>{title}</p>
                <p className="font-display" style={{ color: BRAND.teal, fontWeight: 600, fontSize: 21, margin: "0 0 4px" }}>{content.title}</p>
                <p style={{ color: BRAND.muted, fontStyle: "italic", fontSize: 15, margin: "0 0 10px" }}>{content.tagline}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {moves.map((m, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, marginBottom: 7, color: BRAND.ink, fontSize: 15.5, lineHeight: 1.6 }}>
                      <span style={{ color: BRAND.gold, fontWeight: 700 }}>›</span><span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="pdf-keep" style={{ marginTop: 8 }}>{paras(STAGE2_CLOSING_FRAME)}</div>
        </Section>

        <Section breakBefore>
          <Eyebrow>One last thing</Eyebrow>
          <Heading>The Closing</Heading>
          <Rule />
          {paras(CLOSING.replace(/\n\nTalk soon,[\s\S]*$/, ""))}
          <Signature />
        </Section>

        <DownloadBar />
        <p className="no-print" data-html2canvas-ignore="true" style={{ textAlign: "center", paddingBottom: 28 }}>
          <button onClick={onRestart} style={{ color: BRAND.muted, fontSize: 14, textDecoration: "underline" }}>Start over</button>
        </p>
      </div>
    </div>
  );
}
