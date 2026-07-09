// Keyless demo report, rendered only via ?demo in the URL. Long, representative
// content so we can QA page breaks, bullet lists, and block spacing in the PDF
// without the quiz flow or an API key. Not shipped in the real flow.
import type { PatternId } from "@/content/intake";
import type { ResetOutput, WiringChoice } from "@/lib/resetClient";

export const DEMO_SESSION: { name: string; patternId: PatternId; wiringChoice: WiringChoice } = {
  name: "Sample",
  patternId: 3,
  wiringChoice: {
    energy: "Steady Engine",
    opportunities: "Responder",
    decisions: "Sleeper",
    offTrack: "Frustration",
    processing: "Deep Diver",
    emotions: "Wave Rider",
    stress: "Freezer",
  },
};

export const DEMO_RESULT: ResetOutput = {
  mode: "final",
  pattern_used: "The Mental Overload Pattern",
  what_you_told_me: `You told me your day starts before it starts, checking messages at 6:30, before the house is even up.
You told me your mornings are back-to-back client calls, one rolling into the next with no gap to think.
You told me you save your own real work for after 3pm, and by then there's nothing left to do it with.
You told me the small decisions pile up all morning, and each one takes more than it should.
You told me you read the same line three times and still lose it.
You told me the end of the day is the inbox, and you dread it, worn out in a way the calls alone don't explain.

Read those back to back. They're one shape, not six problems.

Your day spends your sharpest hours, the morning, on other people's calls and questions, and saves your own work for the hours when your brain is already empty. The juggling is the fuel that runs out, and you're asking the most of yourself at the exact point you have the least to give.

That's why the afternoon feels like a wall, why simple things stop you cold, why the 5pm inbox lands like a threat. It isn't the amount of work. It's that the work you care about keeps landing in the wrong hours, on a brain that's already spent.`,
  where_your_friction_is_coming_from: `Put your seven ways of working side by side and one picture appears. You're built to work steadily, on what holds your interest, in deep uninterrupted blocks. You start best from something already shaped, you decide best when you're given time, and under pressure you go still and pull inward. That's a coherent design, and a strong one.

Now hold it against your actual day, which asks for the opposite on nearly every count. Constant switching where you need deep blocks. Snap decisions where you need time. Blank pages where you need something shaped to react to. A pace that never lets your steady engine settle into anything. Any one of these, on its own, you could absorb. They are all happening at once, all day.

That is the friction: seven small mismatches, stacked into one heavy one. Every hour spent working across the grain of how you're built costs more than it should, and right now most of your hours are spent that way.

In perimenopause and menopause, as estrogen shifts, your brain holds a little less at once and your nervous system takes longer to settle. So the strain of running against your own design, the kind you could once absorb without noticing, now surfaces as the afternoon wall, the fog, and the wired-but-empty end of the day.`,
  reset_stage_1: {
    what_im_seeing: `Your morning is where your sharpest thinking lives, and right now it is being spent on everyone else's small decisions before you reach anything of your own. By the time you get to the work that matters, the fuel is gone.`,
    the_mismatch: `You are built for deep, unbroken focus, but your day is built out of interruptions. Every switch back and forth costs you more than it used to, and the bill comes due by mid-afternoon.`,
    what_its_costing: [
      "A mid-afternoon wall that wipes out the rest of the day",
      "Rereading and rechecking work you used to trust the first time",
      "A low, all-day sense of being behind before you have even started",
      "Ending most days too fried to have much left for your own life",
    ],
    stop: `Stop opening your inbox first thing. The moment you do, the day's small decisions take the exact hours your brain is sharpest, and you never get them back.`,
    shift: `Move your one hardest thinking task to the first 45 minutes of your day, before the messages start, when your brain still has room to hold it.`,
    protect: `Protect one unbroken block, even 30 minutes, with the door shut and notifications off. Guard it like a meeting you cannot move.`,
    three_moves: [
      "Tomorrow, do not open email until you have spent 30 minutes on your most important task.",
      "Put your phone in another room for that first block.",
      "Batch the small decisions into one window later in the day, instead of letting them trickle in all morning.",
    ],
    start_here_first: `Start with protecting the morning block, because it is the one change that gives the other two somewhere to live. If your best hours are already gone, there is nothing left to shift or protect.`,
    what_to_notice: `Around day two or three, notice whether the afternoon wall arrives a little later, or hits a little softer. That is the sign your brain is getting its fuel back.`,
  },
  where_you_go_from_here: `Each of your seven is a place the overload has been costing you more than it should. You do not need all seven, and not this week.

Start with your focus. Your day gets chopped into fragments, and you are built to think in deep, unbroken blocks. That is the mismatch costing you the most, so one change there buys back the most. This week, protect one real morning block before the messages start.

Once that feels steadier, come back for the rest, in this order:
- Decisions: you do best sleeping on things, so on anything that can wait, give yourself till tomorrow instead of deciding on the spot.
- Starts: when something needs building from nothing, get an old version or a rough outline in front of you first, so you are reacting, not summoning.
- Off-track signal: when the frustration starts to grind, treat it as information that something is misaligned, not a reason to push harder.
- Emotions: let a strong feeling move through before you act on it, so you are not sending or deciding at the peak.
- Stress: when you feel yourself brace and go still, move it out with a few slow breaths or a short walk, so it does not lodge in your body.

Pick the next one when you are ready. One change you keep beats a list you drop by Friday.`,
};
