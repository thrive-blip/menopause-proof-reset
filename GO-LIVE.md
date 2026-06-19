# Go Live — The Menopause-Proof Workday Reset

Hi Adrienne. The app is fully built, re-themed to your brand, and committed. This is everything
you need to take it live, in plain English. There are only three real steps, and two small fixes
that genuinely need you (I could not do them from my side).

---

## What's built and done
- The whole experience: intro → 20-question quiz → your pattern reveal → 7 wiring questions →
  3 day-shape questions (and your name) → your personalized report, with a back button and a
  progress bar on every step.
- The engine: the two-call Claude Sonnet brain (generate → check → scrub) wired into the server,
  with your locked copy, the scope/safety guardrails, and nothing stored.
- Re-themed to your real brand: teal Fraunces headlines, rose, gold, Inter, white pages. The old
  pink/hot-pink is gone. None of your navigation was removed.
- The report doubles as your branded PDF: duotone cover + dividers, your cleaned real signature,
  one section per page. The "Download your reset (PDF)" button opens the print dialog → "Save as PDF"
  (no email, so no risk of a mistyped address).
- Everything compiles cleanly (typechecked), and the engine was confirmed to reach Anthropic correctly.

## Your 3 steps to go live

**1. Get the code into Replit.** It's committed on the `main` branch here on your Desktop. From your
   normal terminal (the one where Replit git already works), run:
   `git push`
   (or use Replit's Git pane to sync). I couldn't push from my side because it needs your Replit login.

**2. Fix the API key (important).** The key currently saved in Doppler/Replit is an *OpenAI* key
   (it starts with `sk-proj-`). This app uses *Claude (Anthropic)*. You need an Anthropic key, which
   starts with `sk-ant-`:
   - Get one at console.anthropic.com (you may need to add a little billing; each woman's report
     costs about 1–2 cents).
   - In Replit, open the **Secrets** panel and set `ANTHROPIC_API_KEY` to that `sk-ant-...` value.
   - Until this is done, the report step will error (everything before it works fine).

**3. Run, preview, deploy.** Press **Run** in Replit to see it live and click through the screens
   (this is the visual check I couldn't do locally because of a Google-Drive/sandbox quirk on my end,
   it has nothing to do with the app). When you're happy, press **Deploy**, and paste the deployed
   link wherever your funnel/Circle lesson points.

## Two things still optional / yours
- A nicer signature is already done (your real one, cleaned), in `public/signature.png`.
- If you ever want the photos on the cover/dividers swapped, they live in
  `artifacts/menopause-reset/public/` (`cover-photo.jpg`, `divider-a.jpg`, `divider-b.jpg`).

## Honest notes
- I could not press Run/Deploy in Replit or push to it (no access to your Replit login from here),
  and I could not live-test the AI because the saved key is an OpenAI key, not Anthropic. Those are
  the only gaps, and both are the small steps above.
- Everything else (all code, copy, theme, signature, PDF design) is finished and verified by compile.

— Built for you by Claude. Enjoy your day with your daughter.
