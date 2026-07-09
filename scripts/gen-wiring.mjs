// One-time generator: reads the locked vault copy and emits byte-exact wiring content
// into the client. Run locally only (the vault is not part of the deploy).
//   node scripts/gen-wiring.mjs
import { readFileSync, writeFileSync } from "node:fs";

const VAULT =
  "/Users/adriennestein/Library/CloudStorage/GoogleDrive-thrive@thrivemenopause.com/My Drive/Strategic Profits/02 Funnel/Reset Assets";
const PATTERNS_FILE = `${VAULT}/MPowered_Reset_Patterns_FINAL.md`;
const STAGE2_FILE = `${VAULT}/MPowered_Reset_Stage2_Action_Rewrites.md`;
const OUT = new URL("../artifacts/menopause-reset/src/content/wiring.ts", import.meta.url);

const CANON = {
  "steady engine": "Steady Engine",
  "wave worker": "Wave Worker",
  "outside-in worker": "Outside-In Worker",
  responder: "Responder",
  initiator: "Initiator",
  collaborator: "Collaborator",
  sleeper: "Sleeper",
  "gut-knower": "Gut-Knower",
  talker: "Talker",
  frustration: "Frustration",
  resentment: "Resentment",
  flatness: "Flatness",
  "deep diver": "Deep Diver",
  "open-door thinker": "Open-Door Thinker",
  mover: "Mover",
  "wave rider": "Wave Rider",
  "steady one": "Steady One",
  holder: "Holder",
  sponge: "Sponge",
  rusher: "Rusher",
  freeze: "Freeze",
};

function canon(raw) {
  const k = raw
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/\s+signal$/, "")
    .trim();
  return CANON[k] || null;
}

function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/(^|[\s-])([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

function collapse(s) {
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

// ── Parse Patterns_FINAL.md → { archetype: {title, tagline, body, suggestions} } ──
function parsePatterns() {
  const text = readFileSync(PATTERNS_FILE, "utf8");
  const out = {};
  // Split on level-3 headers.
  const chunks = text.split(/\n### /).slice(1);
  for (const chunk of chunks) {
    const nl = chunk.indexOf("\n");
    const header = chunk.slice(0, nl).trim();
    if (/^QUESTION/i.test(header)) continue;
    const key = canon(header);
    if (!key) continue;
    let rest = chunk.slice(nl + 1);
    // Cut at the next section/divider that belongs to other content.
    const cut = rest.search(/\n(?:---|## |### )/);
    if (cut !== -1) rest = rest.slice(0, cut);
    // Split body vs suggestions on the bold Suggestions subheading.
    const sugIdx = rest.indexOf("**Suggestions**");
    let bodyPart = sugIdx === -1 ? rest : rest.slice(0, sugIdx);
    let sugPart = sugIdx === -1 ? "" : rest.slice(sugIdx + "**Suggestions**".length);
    // First italic line under the header is the tagline.
    const lines = bodyPart.split("\n");
    let tagline = "";
    const bodyLines = [];
    let taglineTaken = false;
    for (const line of lines) {
      const t = line.trim();
      if (!taglineTaken && t.startsWith("*") && t.endsWith("*") && t.length > 2) {
        tagline = t.replace(/^\*+/, "").replace(/\*+$/, "").trim();
        taglineTaken = true;
        continue;
      }
      bodyLines.push(line);
    }
    out[key] = {
      title: titleCase(header),
      tagline,
      body: collapse(bodyLines.join("\n")),
      suggestions: collapse(sugPart),
    };
  }
  return out;
}

// ── Parse Stage2 file → { archetype: actionRewrite } ──
function parseStage2() {
  const text = readFileSync(STAGE2_FILE, "utf8");
  // Limit to the action-rewrites section.
  const start = text.indexOf("## THE 21 ACTION-REWRITES");
  const end = text.indexOf("## THE CLOSING FRAME");
  const body = text.slice(start === -1 ? 0 : start, end === -1 ? text.length : end);
  const lines = body.split("\n");
  const out = {};
  let curKey = null;
  let buf = [];
  const flush = () => {
    if (curKey) out[curKey] = collapse(buf.join("\n"));
    buf = [];
  };
  const startRe = /^\*\*[^*]+\*\*\s+\*\(([^)]+)\)\*\s*$/;
  for (const line of lines) {
    const m = line.match(startRe);
    if (m) {
      flush();
      curKey = canon(m[1]);
      continue;
    }
    if (/^### /.test(line) || /^## /.test(line) || /^---\s*$/.test(line)) {
      flush();
      curKey = null;
      continue;
    }
    if (curKey) buf.push(line);
  }
  flush();
  return out;
}

const patterns = parsePatterns();
const stage2 = parseStage2();

const keys = Object.keys(CANON).map((k) => CANON[k]);
const missing = [];
const result = {};
for (const key of keys) {
  const p = patterns[key];
  const a = stage2[key];
  if (!p) missing.push(`pattern:${key}`);
  if (!a) missing.push(`rewrite:${key}`);
  result[key] = {
    archetype: key,
    title: p?.title ?? "",
    tagline: p?.tagline ?? "",
    body: p?.body ?? "",
    suggestions: p?.suggestions ?? "",
    actionRewrite: a ?? "",
  };
}

const header = `// AUTO-GENERATED from the vault locked copy. Do not edit by hand.
// Regenerate with: node scripts/gen-wiring.mjs
// Sources: MPowered_Reset_Patterns_FINAL.md (write-ups + Suggestions),
//          MPowered_Reset_Stage2_Action_Rewrites.md (action-rewrites).

export interface WiringContent {
  archetype: string;
  title: string;
  tagline: string;
  body: string;
  suggestions: string;
  actionRewrite: string;
}

export const WIRING_CONTENT: Record<string, WiringContent> = ${JSON.stringify(result, null, 2)};
`;

writeFileSync(OUT, header, "utf8");

console.log("Wrote", OUT.pathname);
console.log("Archetypes:", keys.length);
console.log("Missing:", missing.length ? missing.join(", ") : "none");
for (const key of keys) {
  const r = result[key];
  console.log(
    `  ${key.padEnd(20)} body:${String(r.body.length).padStart(4)}  sugg:${String(r.suggestions.length).padStart(4)}  rewrite:${String(r.actionRewrite.length).padStart(4)}`,
  );
}
