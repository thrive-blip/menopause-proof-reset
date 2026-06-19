import { BRAND } from "@/components/flow";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fff" }}>
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full pulse-gentle" style={{ backgroundColor: BRAND.teal, opacity: 0.85 }} />
        </div>
        <p className="font-display text-xl" style={{ color: BRAND.teal, fontWeight: 500 }}>
          Building your reset…
        </p>
        <p className="text-sm" style={{ color: BRAND.muted }}>
          Reading how you work, and what would help most. This takes a few seconds.
        </p>
      </div>
    </div>
  );
}
