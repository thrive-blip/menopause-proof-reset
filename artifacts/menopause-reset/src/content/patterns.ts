// "This Is Your Pattern" reveal copy. RESTORED from Adrienne's finalized Netlify
// quiz (menopause-proof-workday-audit.html result screens) — her approved wording,
// not the earlier draft reformat. One shows on the reveal, chosen by quiz result.
import type { PatternId } from "./intake";

export interface PatternPage {
  tagline: string;
  soundFamiliar: string[][]; // stanzas of short lines
  callout: string;
  alsoNotice: string[];
  whyNow: string[];
}

export const PATTERN_PAGE: Record<PatternId, PatternPage> = {
  1: {
    tagline:
      "Perimenopause and menopause changes how your body responds to pressure. Your workday is still running like it hasn't.",
    soundFamiliar: [
      [
        "Maybe you spend most of your day putting out fires.",
        "Or you are managing so many things at once that nothing gets your full attention.",
        "You jump from one thing to the next.",
        "By the end of the day, you have not touched what you actually planned.",
      ],
      ["You are always reacting.", "Always behind."],
      [
        "Even when nothing is technically wrong, your body still feels like it is bracing for the next thing.",
        "Calm has started to feel unfamiliar.",
        "And when the busy stretch finally ends? You do not feel relief.",
        "You crash.",
      ],
    ],
    callout: "What you are feeling is real.",
    alsoNotice: [
      "An afternoon crash that wipes out the rest of the day",
      "Finding themselves more reactive than usual, with others or just internally",
      "That wired-but-exhausted feeling at night",
      "Waking up already behind",
    ],
    whyNow: [
      "The same pace that may have felt manageable a few years ago is landing differently now.",
      "Not because you are doing anything wrong. Because your biology is responding differently now.",
      "In perimenopause and menopause, your nervous system becomes more sensitive to stress. Continuous pressure that once felt normal may now feel like too much.",
    ],
  },
  2: {
    tagline:
      "Perimenopause and menopause changes how your body winds down. Your workday is still running like it hasn't.",
    soundFamiliar: [
      [
        "Even when the workday is technically over, part of you is still on.",
        "Still waiting. Still listening for what might come next.",
      ],
      [
        "Maybe it is the phone.",
        "Or maybe the phone is just the most visible sign of something bigger.",
      ],
      [
        "Either way, you are checking in before bed and first thing when you wake up.",
        "A message after hours. A notification as you are trying to wind down.",
        "Someone reaching out when you are finally off.",
      ],
      ["Each one feels small. But your nervous system never fully gets the signal that the day is over."],
      [
        "You can be sitting with people you love and still not fully be there.",
        "Work does not end when you close the laptop. It just gets quieter.",
      ],
    ],
    callout: "What you are feeling is real.",
    alsoNotice: [
      "Waking in the night with their mind already running",
      "Never feeling fully rested",
      "A low hum of anxiety, even on days off",
      "Feeling like they are always on call",
    ],
    whyNow: [
      "The same pace that once felt manageable is landing differently now.",
      "Not because you are doing anything wrong. Because your body needs a clearer signal that the day is over.",
      "In perimenopause and menopause, as progesterone drops, your nervous system loses some of its natural calming support. Without a true off-switch, your body can stay on alert far longer than it should.",
    ],
  },
  3: {
    tagline:
      "Perimenopause and menopause changes how much your brain can carry. Your workday is still running like it hasn't.",
    soundFamiliar: [
      [
        "Before you have done a single real thing, your brain is already full.",
        "Messages, decisions, tasks. They start before you are ready.",
      ],
      ["You make decisions all day. Small ones. Big ones.", "Ones that should not require this much effort."],
      ["By mid-afternoon, your brain just stops. Not tired. Done."],
      [
        "You sit in front of something simple and nothing comes.",
        "You read the same sentence three times.",
        "You blank on something you just talked about.",
      ],
      ["And then the thought shows up:", "What is wrong with me?"],
      ["Nothing is wrong with you.", "Your brain is overloaded."],
    ],
    callout: "What you are feeling is real.",
    alsoNotice: [
      "Brain fog when they need to be sharp",
      "Gaps where information used to be",
      "Blanking mid-sentence",
      "A quiet fear they are losing their edge",
    ],
    whyNow: [
      "The same workload is landing differently now.",
      "Not because you are less capable. Because the same cognitive load is draining you faster.",
      "Estrogen helps your brain manage memory and focus. As it shifts in perimenopause and menopause, your brain has less capacity to handle the same load and tips into overload faster than it used to.",
      "What once felt normal may now exhaust your brain before the real work even begins.",
    ],
  },
  4: {
    tagline:
      "Perimenopause and menopause changes how much your body can carry quietly. Your workday is still running like it hasn't.",
    soundFamiliar: [
      [
        "You prepare more than you used to for things that once felt easy.",
        "You recheck your work. You think twice before committing to things that once felt straightforward.",
      ],
      ["Not because you do not care. Because you are not sure you can deliver the way you used to."],
      ["You hold it together in meetings. You show up. You perform.", "And then you pay for it later."],
      ["Most people around you have no idea how much effort this now takes."],
    ],
    callout: "What you are feeling is real.",
    alsoNotice: [
      'Exhaustion after being "on"',
      "A wave of dread after taking on something new",
      "Sudden confidence drops",
      "Feeling unlike themselves professionally",
    ],
    whyNow: [
      "The same expectations are landing differently now.",
      "Not because you are failing. Because the energy it takes to compensate now costs more.",
      "In perimenopause and menopause, your nervous system has less capacity to absorb hidden stress. Masking, pushing through, and overpreparing now drain far more energy than they used to.",
      "And because that effort is invisible, it can be hard to understand why you feel so depleted.",
    ],
  },
};
