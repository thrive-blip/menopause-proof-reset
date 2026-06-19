import { useEffect, useState } from "react";
import { BRAND } from "@/components/flow";

const MESSAGES = [
  "Reading how you work…",
  "Finding the pattern in your day…",
  "Putting the pieces together…",
  "Crafting your reset…",
  "Almost there…",
];

export default function LoadingScreen() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, MESSAGES.length - 1)), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fff" }}>
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full pulse-gentle" style={{ backgroundColor: BRAND.teal, opacity: 0.85 }} />
        </div>
        <p className="font-display text-xl" style={{ color: BRAND.teal, fontWeight: 500, minHeight: 28 }}>
          {MESSAGES[i]}
        </p>
        <p className="text-sm" style={{ color: BRAND.muted }}>
          This takes a few seconds. Hang tight, your reset is on its way.
        </p>
      </div>
    </div>
  );
}
