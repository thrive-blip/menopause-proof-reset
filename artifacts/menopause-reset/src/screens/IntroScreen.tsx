import { useState } from "react";
import { Eyebrow, PrimaryButton, BRAND } from "@/components/flow";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [showPrivacy, setShowPrivacy] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 fade-in" style={{ background: "#fff" }}>
      <div className="max-w-xl w-full text-center space-y-7">
        <div className="space-y-4">
          <Eyebrow>The Menopause-Proof Workday Reset</Eyebrow>
          <h1 className="font-display text-4xl md:text-5xl" style={{ color: BRAND.teal, fontWeight: 600, lineHeight: 1.1 }}>
            Why your workday suddenly feels so much harder
          </h1>
          <p className="text-base md:text-lg" style={{ color: BRAND.ink, lineHeight: 1.7 }}>
            A short set of questions, then a few about how you actually work. In about five minutes you will have a clear picture of the pattern behind your days, and a personalized reset you can start tomorrow.
          </p>
          <p className="text-sm" style={{ color: BRAND.muted }}>
            Made for women in business navigating perimenopause and menopause.
          </p>
        </div>

        <div className="max-w-xs mx-auto">
          <PrimaryButton onClick={onStart}>Begin the audit</PrimaryButton>
        </div>

        <div className="space-y-2">
          <p className="text-xs" style={{ color: BRAND.muted, lineHeight: 1.6 }}>
            Your answers are used only to create your reset. They are never stored, saved, or shared.
          </p>
          <button onClick={() => setShowPrivacy(!showPrivacy)} className="text-xs underline" style={{ color: BRAND.muted }}>
            Privacy notice
          </button>
        </div>

        {showPrivacy && (
          <div className="text-left text-xs rounded-xl p-4 space-y-3" style={{ background: BRAND.mist, color: BRAND.ink, lineHeight: 1.6 }}>
            <p className="font-semibold">Privacy notice</p>
            <p>This tool creates your reset in a single session. Your answers are sent securely to generate your personalized result, and are not stored, saved to any database, used for marketing, or shared with third parties.</p>
            <p>Nothing leaves your session once your reset is created. If you have any questions, contact support@masteringmenopausemethod.com</p>
          </div>
        )}
      </div>
    </div>
  );
}
