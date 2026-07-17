// Intake content: the 20-question quiz, scoring/routing, the 7 wiring questions,
// and the 3 day-shape questions. Source of truth: the locked vault files
//   - menopause-proof-workday-audit.html  (quiz + scoring + tiebreaker)
//   - MPowered_Reset_Patterns_FINAL.md     (the 7 routing questions + tap labels)
//   - MPowered_Reset_Framing_FINAL.md      (the 3 day-shape questions)

// ── Patterns ────────────────────────────────────────────────────────────────

export type PatternId = 1 | 2 | 3 | 4;

export const PATTERN_NAME: Record<PatternId, string> = {
  1: "The Constant Pressure Pattern",
  2: "The Always-On Pattern",
  3: "The Mental Overload Pattern",
  4: "The Holding-It-Together Pattern",
};

// Used only on the tiebreaker screen.
export const PATTERN_DESCRIPTION: Record<PatternId, string> = {
  1: "The feeling of never getting a real break, always reacting, always behind.",
  2: "The feeling of never fully switching off, even when the day is done.",
  3: "The feeling that your brain hits a wall before the day is even over.",
  4: "The feeling of working hard to make sure no one sees how much this is costing you.",
};

// ── The 20-question quiz ──────────────────────────────────────────────────────
// Each answer scores: "Most of the time" = 2, "Sometimes" = 1, "Rarely or never" = 0.
// Section = which pattern the statement belongs to. Highest section total wins.

export interface QuizQuestion {
  text: string;
  section: PatternId;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Round 1
  { text: "My day goes from one thing to the next with no real break in between.", section: 1 },
  { text: "I check my phone for work in the evenings or on weekends.", section: 2 },
  { text: "Everything takes so much more effort than it used to, even the simple stuff.", section: 3 },
  { text: "I prepare way more than I used to, just to feel ready.", section: 4 },
  // Round 2
  { text: "I spend most of my day putting out fires instead of doing what I actually planned.", section: 1 },
  { text: "I check messages or email right before bed or first thing when I wake up.", section: 2 },
  { text: "I feel like I'm making decisions all day long.", section: 3 },
  { text: "I recheck my work because I don't trust my brain the way I used to.", section: 4 },
  // Round 3
  { text: "Even when nothing is wrong, my body still feels tense and on edge.", section: 1 },
  { text: "I can't fully switch off from work, even when the day is done.", section: 2 },
  { text: "By mid-afternoon my brain is done, even when the day wasn't that hard.", section: 3 },
  { text: "I worry that people are starting to notice my work isn't what it used to be.", section: 4 },
  // Round 4
  { text: "When a busy stretch ends, I crash.", section: 1 },
  { text: "I don't have a clear stopping point for my workday.", section: 2 },
  { text: "Moving from one type of task to another takes more out of me than it used to.", section: 3 },
  { text: "I work hard to make sure no one knows how much I am struggling.", section: 4 },
  // Round 5
  { text: "I always feel behind.", section: 1 },
  { text: "I feel tense, restless, or anxious even when I'm off.", section: 2 },
  { text: "Decisions that used to be easy now feel harder than they should.", section: 3 },
  { text: "By the end of the day I am exhausted from pretending everything is fine.", section: 4 },
];

export const QUIZ_FRAMING = "Since perimenopause or menopause, how true have each of these felt?";

export const QUIZ_OPTIONS = [
  { label: "Most of the time", points: 2 },
  { label: "Sometimes", points: 1 },
  { label: "Rarely or never", points: 0 },
] as const;

export interface QuizResult {
  scores: Record<PatternId, number>;
  winner: PatternId | null; // null when there is a tie
  tied: PatternId[];
  // The statements she scored highest (2 = "Most of the time"), as her own words.
  topStatements: string[];
}

/** Score the quiz. answers[i] is the points (0/1/2) for QUIZ_QUESTIONS[i]. */
export function scoreQuiz(answers: number[]): QuizResult {
  const scores: Record<PatternId, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  QUIZ_QUESTIONS.forEach((q, i) => {
    scores[q.section] += answers[i] ?? 0;
  });
  const max = Math.max(scores[1], scores[2], scores[3], scores[4]);
  const tied = ([1, 2, 3, 4] as PatternId[]).filter((s) => scores[s] === max);

  // Top statements = the ones she marked "Most of the time" (2 pts) in the winning
  // section first, then any other 2-pt statements, so her own strongest words lead.
  const top2 = QUIZ_QUESTIONS.filter((_, i) => answers[i] === 2);
  const topStatements = top2.map((q) => q.text);

  return {
    scores,
    winner: tied.length === 1 ? tied[0] : null,
    tied,
    topStatements,
  };
}

/** After a tiebreaker pick, restrict topStatements to lead with the chosen pattern. */
export function topStatementsForPattern(answers: number[], pattern: PatternId): string[] {
  const inPattern = QUIZ_QUESTIONS.filter((q, i) => answers[i] === 2 && q.section === pattern).map((q) => q.text);
  const others = QUIZ_QUESTIONS.filter((q, i) => answers[i] === 2 && q.section !== pattern).map((q) => q.text);
  return [...inPattern, ...others];
}

// ── The 7 wiring questions (quick-select A/B/C) ───────────────────────────────
// `tap` is the label handed to the writing engine. `archetype` keys the matching
// wiring write-up and action-rewrite in the report content.

export type WiringKey =
  | "energy"
  | "opportunities"
  | "decisions"
  | "offTrack"
  | "processing"
  | "emotions"
  | "stress";

export interface WiringOption {
  letter: "A" | "B" | "C";
  archetype: string;
  label: string; // what she reads on screen
  tap: string; // what the engine receives
}

export interface WiringQuestion {
  key: WiringKey;
  title: string;
  prompt: string;
  helper?: string;
  options: WiringOption[];
}

export const WIRING_QUESTIONS: WiringQuestion[] = [
  {
    key: "energy",
    title: "Your Energy",
    prompt:
      "Think back to a stretch when your energy was strong, a season or a year when you felt like yourself. How did your energy tend to work back then?",
    helper:
      "You may be running on empty right now. That's the hormone shifts, not your true baseline. Don't answer from how today feels.",
    options: [
      { letter: "A", archetype: "Steady Engine", label: "Steady and even. I could keep a consistent pace through the day, without big highs or hard crashes.", tap: "Steady Engine (steady, even pace; energy runs on interest)" },
      { letter: "B", archetype: "Wave Worker", label: "In sprints. I got a lot done in a strong burst, then felt depleted or unmotivated until the next one.", tap: "Wave Worker (energy comes in waves; big bursts then needs real recovery)" },
      { letter: "C", archetype: "Outside-In Worker", label: "It depended on my surroundings. The right space and people gave me energy; the wrong ones drained me, no matter the task.", tap: "Outside-In Worker (energy comes from the surroundings, the people and the space)" },
    ],
  },
  {
    key: "opportunities",
    title: "Your Opportunities",
    prompt: "Across your working life, when you felt most like yourself, you've always found it easiest to start working on something when...",
    options: [
      { letter: "A", archetype: "Responder", label: "It's already outlined for me. The task is clearly shaped and handed over, and I can get going on it.", tap: "Responder (starts fast when work is already shaped; stalls inventing it from nothing)" },
      { letter: "B", archetype: "Initiator", label: "I come up with my own idea. I'd rather start something of my own than work from someone else's plan.", tap: "Initiator (starts best from her own ideas; all-day reacting wears her down)" },
      { letter: "C", archetype: "Collaborator", label: "I'm starting it with other people. I do best thinking it through with someone, not alone at a blank page.", tap: "Collaborator (starts best with other people; stalls alone at a blank page)" },
    ],
  },
  {
    key: "decisions",
    title: "Your Decisions",
    prompt: "Across your working life, when you've got a real decision to make, you reach a good answer best when...",
    options: [
      { letter: "A", archetype: "Sleeper", label: "I give it time. I need to sit with it, sleep on it, and let the right answer appear.", tap: "Sleeper (decides best by giving it time, sleeping on it)" },
      { letter: "B", archetype: "Gut-Knower", label: "I go with my gut. My first instinct is usually right, and I get into trouble when I overthink it.", tap: "Gut-Knower (first instinct usually right; overthinking ties her in knots)" },
      { letter: "C", archetype: "Talker", label: "I talk it out. I don't know what I think until I say it out loud to someone.", tap: "Talker (reaches clarity out loud, not silently in her head)" },
    ],
  },
  {
    key: "offTrack",
    title: "Your Off-Track Signal",
    prompt:
      "When work doesn't suit your strengths or how you work best, there's usually one feeling that shows up first. Across your working life, which one is most often yours?",
    options: [
      { letter: "A", archetype: "Frustration", label: "Frustration. I feel stuck, like I'm pushing hard and nothing's moving.", tap: "Frustration signal (feels stuck, pushing hard, nothing moving)" },
      { letter: "B", archetype: "Resentment", label: "Resentment. I start feeling like I'm working hard for too little, giving more than I'm getting back.", tap: "Resentment signal (feels she gives more than she gets back, unseen)" },
      { letter: "C", archetype: "Flatness", label: "Flatness. No spark, going through the motions, more tired than the task warrants.", tap: "Flatness signal (goes flat, more tired than the task warrants)" },
    ],
  },
  {
    key: "processing",
    title: "Your Focus",
    prompt: "Think about a time you did your best, clearest thinking, even years ago. What were the conditions around you?",
    options: [
      { letter: "A", archetype: "Deep Diver", label: "Deep quiet and a real block of uninterrupted time. I need to drop in without being pulled out.", tap: "Deep Diver (focus works in deep, uninterrupted blocks; fractured time falls apart)" },
      { letter: "B", archetype: "Open-Door Thinker", label: "A bit of life around me. I focus better with some background hum or people nearby than in total silence.", tap: "Open-Door Thinker (focuses better with a little life around her; total isolation stalls her)" },
      { letter: "C", archetype: "Mover", label: "Moving. My best thinking happens when my body's in motion, on a walk, on my feet, not pinned to a chair.", tap: "Mover (thinks best when her body moves; sitting still fades focus)" },
    ],
  },
  {
    key: "emotions",
    title: "Your Emotions",
    prompt: "Across your working life, before things started shifting, what was most true for you when a strong feeling came up?",
    helper:
      "Hormones can completely change how you handle emotions right now, so don't answer from how the last while has felt.",
    options: [
      { letter: "A", archetype: "Wave Rider", label: "My feelings came and went in waves. I felt things intensely, but they moved through and passed.", tap: "Wave Rider (feelings move in waves; acting at the peak is the trouble)" },
      { letter: "B", archetype: "Steady One", label: "I stayed pretty even. I didn't swing much, and sometimes I lost track of what I was feeling.", tap: "Steady One (runs fairly even; can lose track of feelings until they pile up)" },
      { letter: "C", archetype: "Holder", label: "I held it together through the day, then felt it all later, on my own.", tap: "Holder (holds feelings down through the day, pays for it later all at once)" },
    ],
  },
  {
    key: "stress",
    title: "Your Stress Response",
    prompt: "Across your working life, not just the last while, when stress builds at work, what has been most true for you?",
    options: [
      { letter: "A", archetype: "Sponge", label: "I pick up other people's stress. I take on the tension around me without realizing it's not mine.", tap: "Sponge (absorbs other people's stress as her own)" },
      { letter: "B", archetype: "Rusher", label: "I speed up. I rush and treat everything as urgent, like it all has to be done right now.", tap: "Rusher (speeds up under stress, treats everything as urgent)" },
      { letter: "C", archetype: "Freeze", label: "I freeze. I go quiet and still, and the stress settles into my body.", tap: "The Freeze (goes still and quiet under stress; it lodges in the body)" },
    ],
  },
];

// ── The 3 day-shape questions (free text) ─────────────────────────────────────

export interface DayShapeQuestion {
  key: "role" | "workday" | "hardest";
  prompt: string;
  helper: string;
  placeholder: string;
}

export const DAY_SHAPE_QUESTIONS: DayShapeQuestion[] = [
  {
    key: "role",
    prompt: "What do you do?",
    helper: "Your role or title, and the kind of work it is.",
    placeholder:
      "I'm an HR director and manage a team of 12 inside a mid-size company.\nI'm a coach and run two online programs and a membership, plus about five 1:1 clients a week.",
  },
  {
    key: "workday",
    prompt: "What does your workday look like?",
    helper:
      "Start from when your day begins. Give as much detail as you can about how your days normally flow, what sort of responsibilities you have, and how your day ends.",
    placeholder:
      "My day starts around 7am. I'm checking emails before the house is awake, then getting my kids ready and off to school. I'm back online between 9 and 12, usually filled with back-to-back meetings.\n\nAfternoons are supposed to be for strategy work, but I'm usually putting out fires that came up in the morning meetings, bouncing between that, answering emails, and trying to get a few tasks done on the bigger projects I was supposed to be working on.\n\nWhen the kids get home I'm meant to be done by 5, so that's when I switch to dinner and family time. But Slack keeps coming in, so I'm often answering messages until 6 or 7, and sometimes still clearing emails as late as 9pm.",
  },
  {
    key: "hardest",
    prompt: "What's the hardest part of your day, and what's happening then?",
    helper: "The moment it feels heaviest, and what you're doing when it hits.",
    placeholder:
      "Around 2pm, right after lunch, when I've got a proposal to write and no bandwidth left. My brain goes foggy, I reread the same paragraph five times, and I end up doing something low-stakes instead just to feel like I'm making progress.",
  },
];
