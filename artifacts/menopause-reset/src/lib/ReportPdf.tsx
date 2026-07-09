// Real vector PDF of the reset report, built with @react-pdf/renderer.
// One-click download, true page breaks, full-bleed teal pages. Fonts are the
// built-in serif/sans for now; brand fonts (Fraunces/Inter) get registered next.
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { type ReactElement } from "react";
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

// Body + labels use Inter (Adrienne's brand sans), registered from the bundled
// variable TTF in public/ — this is the spacious, open look. Do NOT use the
// built-in Helvetica: it renders BLANK glyphs in @react-pdf v4 (proven). Bold is a
// second family off the same file. Headings stay in the built-in serif (Times).
Font.register({ family: "Inter", fonts: [{ src: asset("InterVariable.ttf"), fontWeight: 400 }] });
Font.register({ family: "InterBold", fonts: [{ src: asset("InterVariable.ttf"), fontWeight: 700 }] });
Font.registerHyphenationCallback((word) => [word]); // keep whole words; no line-end hyphenation

const SERIF = "Times-Roman";
const SERIF_B = "Times-Bold";
const SANS = "Inter";
const SANS_B = "InterBold";

const s = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 54, paddingHorizontal: 46, backgroundColor: "#fff", fontFamily: SANS, color: BRAND.ink },
  teal: { backgroundColor: BRAND.teal, color: "#fff", fontFamily: SANS, alignItems: "center", justifyContent: "center", padding: 56 },
  eyebrow: { fontFamily: SANS, color: BRAND.rose, fontSize: 8, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 7 },
  heading: { fontFamily: SERIF_B, color: BRAND.teal, fontSize: 21, marginBottom: 4 },
  tagline: { fontFamily: SERIF, color: BRAND.rose, fontSize: 11, fontStyle: "italic", marginBottom: 6 },
  rule: { width: 42, height: 2.5, backgroundColor: BRAND.gold, borderRadius: 2, marginTop: 10, marginBottom: 15 },
  body: { fontSize: 10.5, lineHeight: 1.6, marginBottom: 9, color: BRAND.ink },
  bodyCompact: { fontSize: 9.5, lineHeight: 1.5, marginBottom: 6, color: BRAND.ink },
  bulletRow: { flexDirection: "row", marginBottom: 4 },
  bulletDot: { color: BRAND.rose, fontSize: 10.5, marginRight: 7 },
  bulletText: { fontSize: 10.5, lineHeight: 1.55, flex: 1, color: BRAND.ink },
  subLabel: { fontFamily: SANS_B, color: BRAND.teal, fontSize: 8.5, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 5 },
  box: { backgroundColor: BRAND.mist, borderRadius: 8, padding: 14, marginTop: 10, marginBottom: 6 },
  boxLabel: { fontFamily: SANS_B, color: BRAND.gold, fontSize: 8, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 },
  sig: { width: 118, height: 42, marginTop: 10, marginBottom: 3 },
  sigName: { fontSize: 9.5, color: BRAND.muted },
});

// Split copy into paragraphs; runs of "- " / "•" lines become a bullet list.
function Paras({ text, compact }: { text: string; compact?: boolean }) {
  const bodyStyle = compact ? s.bodyCompact : s.body;
  return (
    <>
      {text.split("\n\n").map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const nodes: ReactElement[] = [];
        let run: string[] = [];
        const flush = (key: string) => {
          if (!run.length) return;
          const items = run;
          run = [];
          nodes.push(
            <View key={key} style={{ marginBottom: 9 }}>
              {items.map((b, j) => (
                <View key={j} style={s.bulletRow}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>,
          );
        };
        lines.forEach((line, j) => {
          if (/^[-•]\s+/.test(line)) {
            run.push(line.replace(/^[-•]\s+/, ""));
          } else {
            flush(`b${i}-${j}`);
            nodes.push(<Text key={`p${i}-${j}`} style={bodyStyle}>{line}</Text>);
          }
        });
        flush(`bf${i}`);
        return <View key={i}>{nodes}</View>;
      })}
    </>
  );
}

// "In Your Own Words" is meant to read as a spacious, scannable list — one
// reflected statement per line — then a synthesis paragraph. The engine sometimes
// runs the statements together in one block, so put each sentence of the FIRST
// block on its own line; later blocks (the synthesis) stay as prose.
function airyStatements(text: string): string {
  const blocks = text.split(/\n\n+/);
  if (!blocks.length) return text;
  blocks[0] = blocks[0]
    .replace(/\s*\n\s*/g, " ")             // collapse any single newlines to spaces
    .replace(/([.!?])\s+(?=[A-Z"'])/g, "$1\n") // one statement per line
    .trim();
  return blocks.join("\n\n");
}

function Signature() {
  return (
    <View wrap={false}>
      <Text style={{ fontSize: 10.5, color: BRAND.ink, marginBottom: 4 }}>Talk soon,</Text>
      <Image style={s.sig} src={asset("signature.png")} />
      <Text style={s.sigName}>Dr. Adrienne, ND</Text>
    </View>
  );
}

function SectionHead({ eyebrow, title, tagline }: { eyebrow: string; title: string; tagline?: string }) {
  return (
    <View wrap={false}>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text style={s.heading}>{title}</Text>
      {tagline ? <Text style={s.tagline}>{tagline}</Text> : null}
      <View style={s.rule} />
    </View>
  );
}

function TealPage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Page size="A4" style={[s.teal]}>
      <Text style={{ fontFamily: SANS_B, color: BRAND.gold, fontSize: 9, letterSpacing: 2.4, textTransform: "uppercase", marginBottom: 14 }}>{eyebrow}</Text>
      <Text style={{ fontFamily: SERIF_B, color: "#fff", fontSize: 30, textAlign: "center", lineHeight: 1.2 }}>{title}</Text>
      <View style={{ width: 56, height: 2.5, backgroundColor: BRAND.gold, borderRadius: 2, marginTop: 20 }} />
    </Page>
  );
}

interface Props {
  result: ResetOutput;
  session: { name: string; patternId: PatternId; wiringChoice: WiringChoice };
}

export function ReportPdf({ result, session }: Props) {
  const reset = result.reset_stage_1!;
  const wiring = wiringForReport(session.wiringChoice);
  const pp = PATTERN_PAGE[session.patternId];
  const wTitle = (key: string) => WIRING_QUESTIONS.find((w) => w.key === key)?.title ?? "";
  const movesFrom = (ar: string) => {
    const idx = ar.indexOf("A couple of things to try:");
    const rest = idx >= 0 ? ar.slice(idx + "A couple of things to try:".length) : ar;
    return rest.split(/\n-\s+/).map((x) => x.trim()).filter(Boolean);
  };

  return (
    <Document title={`Your Reset - ${session.name}`} author="Dr. Adrienne Stein, ND">
      {/* Cover */}
      <Page size="A4" style={s.teal}>
        <View style={{ width: 74, height: 74, borderRadius: 999, borderWidth: 1.5, borderColor: BRAND.gold, alignItems: "center", justifyContent: "center", marginBottom: 34 }}>
          <Text style={{ fontFamily: SERIF_B, color: BRAND.gold, fontSize: 34 }}>M</Text>
        </View>
        <Text style={{ color: "#fff", fontSize: 9, letterSpacing: 2.4, textTransform: "uppercase", marginBottom: 22, opacity: 0.9 }}>A Personalized Working Profile</Text>
        <Text style={{ fontFamily: SERIF_B, color: "#fff", fontSize: 34, textAlign: "center", lineHeight: 1.15 }}>The Menopause-Proof{"\n"}Workday Reset</Text>
        <View style={{ width: 56, height: 2.5, backgroundColor: BRAND.gold, borderRadius: 2, marginVertical: 24 }} />
        <Text style={{ color: "#fff", fontSize: 11, marginBottom: 6, opacity: 0.9 }}>Prepared for</Text>
        <Text style={{ fontFamily: SERIF, color: "#fff", fontSize: 22, fontStyle: "italic" }}>{session.name}</Text>
        <Text style={{ color: "#fff", fontSize: 9, letterSpacing: 0.8, marginTop: 34, opacity: 0.85 }}>DR. ADRIENNE STEIN, ND</Text>
      </Page>

      {/* The Letter */}
      <Page size="A4" style={s.page}>
        <SectionHead eyebrow="A note to you" title="The Letter" />
        <Paras text={renderLetter(session.name).replace(/\n\nTalk soon,[\s\S]*$/, "")} compact />
        <Signature />
      </Page>

      {/* How to use */}
      <Page size="A4" style={s.page}>
        <SectionHead eyebrow="Before you begin" title="How to use this document" />
        <Paras text={HOW_TO_USE} />
      </Page>

      <TealPage eyebrow="A recap from your quiz" title="Your Workday Pattern" />

      {/* Pattern page */}
      <Page size="A4" style={s.page}>
        <SectionHead eyebrow="This is your pattern" title={PATTERN_NAME[session.patternId]} tagline={pp.tagline} />
        {pp.soundFamiliar.map((stanza, i) => (
          <View key={i} style={{ marginBottom: 8 }} wrap={false}>
            {stanza.map((line, j) => (
              <Text key={j} style={{ fontSize: 10.5, lineHeight: 1.5, color: BRAND.ink }}>{line}</Text>
            ))}
          </View>
        ))}
        <View style={[s.box, { borderLeftWidth: 2.5, borderLeftColor: BRAND.rose }]} wrap={false}>
          <Text style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 11, color: BRAND.ink }}>{pp.callout}</Text>
        </View>
        <Text style={{ fontFamily: SANS_B, color: BRAND.teal, fontSize: 10.5, marginTop: 6, marginBottom: 6 }}>Some women with this pattern also notice:</Text>
        {pp.alsoNotice.map((it, i) => (
          <View key={i} style={s.bulletRow}><Text style={s.bulletDot}>•</Text><Text style={s.bulletText}>{it}</Text></View>
        ))}
        <Text style={{ fontFamily: SANS_B, color: BRAND.teal, fontSize: 10.5, marginTop: 12, marginBottom: 6 }}>Why this is hitting harder now</Text>
        <View style={[s.box, { borderLeftWidth: 2.5, borderLeftColor: BRAND.teal }]}>
          {pp.whyNow.map((para, i) => (<Text key={i} style={[s.body, { marginBottom: 6 }]}>{para}</Text>))}
        </View>
      </Page>

      <TealPage eyebrow="What you told me" title="In Your Own Words" />

      {/* What You Told Me */}
      <Page size="A4" style={s.page}>
        <SectionHead eyebrow="What you told me" title="In Your Own Words" />
        <Paras text={airyStatements(result.what_you_told_me)} />
      </Page>

      <TealPage eyebrow="Part One" title="How You're Built to Work" />

      {/* Wiring sections */}
      {wiring.map(({ section, content }) => (
        <Page key={section} size="A4" style={s.page}>
          <SectionHead eyebrow={wTitle(section)} title={content.title} tagline={content.tagline} />
          <Paras text={content.body} />
          <View style={s.box}>
            <Text style={s.boxLabel}>Suggestions</Text>
            <Text style={[s.body, { marginBottom: 0 }]}>{content.suggestions}</Text>
          </View>
        </Page>
      ))}

      {/* Friction */}
      <Page size="A4" style={s.page}>
        <SectionHead eyebrow="The big picture" title="Where Your Friction Is Coming From" />
        <Paras text={result.where_your_friction_is_coming_from!} />
      </Page>

      <TealPage eyebrow="Part Two" title="Your Reset" />

      {/* Reset Step One */}
      <Page size="A4" style={s.page}>
        <SectionHead eyebrow="What to do tomorrow" title="Your Reset · Step One" />
        <View style={{ marginBottom: 12 }} wrap={false}><Text style={s.subLabel}>What I'm seeing</Text><Text style={s.body}>{reset.what_im_seeing}</Text></View>
        <View style={{ marginBottom: 12 }} wrap={false}><Text style={s.subLabel}>The mismatch</Text><Text style={s.body}>{reset.the_mismatch}</Text></View>
        <View wrap={false}>
          <Text style={s.subLabel}>What this is costing you right now</Text>
          {reset.what_its_costing.map((c, i) => (<View key={i} style={s.bulletRow}><Text style={s.bulletDot}>•</Text><Text style={s.bulletText}>{c}</Text></View>))}
        </View>
        {([["Stop", reset.stop], ["Shift", reset.shift], ["Protect", reset.protect]] as [string, string][]).map(([label, text]) => (
          <View key={label} style={{ marginTop: 10 }} wrap={false}><Text style={s.subLabel}>{label}</Text><Text style={s.body}>{text}</Text></View>
        ))}
        <View style={s.box} wrap={false}>
          <Text style={s.boxLabel}>Three moves for tomorrow</Text>
          {reset.three_moves.map((m, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 7 }}>
              <Text style={{ fontFamily: SANS_B, color: BRAND.teal, fontSize: 10.5, marginRight: 8 }}>{i + 1}.</Text>
              <Text style={s.bulletText}>{m}</Text>
            </View>
          ))}
        </View>
        <View style={{ marginTop: 10 }} wrap={false}><Text style={[s.subLabel, { color: BRAND.rose }]}>Start here first</Text><Text style={s.body}>{reset.start_here_first}</Text></View>
        <View wrap={false}><Text style={[s.subLabel, { color: BRAND.rose }]}>What to notice</Text><Text style={s.body}>{reset.what_to_notice}</Text></View>
      </Page>

      {/* Step Two */}
      <Page size="A4" style={s.page}>
        <SectionHead eyebrow="The coming weeks" title={STAGE2_INTRO_TITLE} />
        <Paras text={STAGE2_INTRO} />
        <Paras text={result.where_you_go_from_here!} />
      </Page>

      <TealPage eyebrow="Quick reference" title="Your Seven Shifts, At a Glance" />

      {/* Seven Shifts */}
      <Page size="A4" style={s.page}>
        <SectionHead eyebrow="Your quick-reference for the weeks ahead" title="Your Seven Shifts, At a Glance" />
        {wiring.map(({ section, content }) => (
          <View key={section} style={{ marginBottom: 14, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: BRAND.line }} wrap={false}>
            <Text style={{ fontFamily: SANS, color: BRAND.rose, fontSize: 7.5, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 3 }}>{wTitle(section)}</Text>
            <Text style={{ fontFamily: SERIF_B, color: BRAND.teal, fontSize: 14, marginBottom: 2 }}>{content.title}</Text>
            <Text style={{ fontFamily: SERIF, color: BRAND.muted, fontStyle: "italic", fontSize: 10, marginBottom: 6 }}>{content.tagline}</Text>
            {movesFrom(content.actionRewrite).map((m, i) => (
              <View key={i} style={s.bulletRow}><Text style={{ color: BRAND.gold, fontFamily: SANS_B, fontSize: 10.5, marginRight: 7 }}>›</Text><Text style={s.bulletText}>{m}</Text></View>
            ))}
          </View>
        ))}
        <Paras text={STAGE2_CLOSING_FRAME} />
      </Page>

      {/* Closing */}
      <Page size="A4" style={s.page}>
        <SectionHead eyebrow="One last thing" title="The Closing" />
        <Paras text={CLOSING.replace(/\n\nTalk soon,[\s\S]*$/, "")} />
        <Signature />
      </Page>
    </Document>
  );
}
