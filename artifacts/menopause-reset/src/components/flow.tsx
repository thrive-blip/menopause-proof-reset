// Shared, brand-styled building blocks for the flow. Teal/rose/gold on white,
// Fraunces display + Inter body. Back button + progress are first-class so every
// step has proper navigation.
import type { ReactNode } from "react";

export const BRAND = {
  teal: "#15938f",
  tealDeep: "#0f6e56",
  rose: "#b5706a",
  gold: "#d99a2b",
  ink: "#2a2a30",
  muted: "#6b6a70",
  line: "#e8e6e2",
  mist: "#eef7f3",
};

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-14" style={{ background: "#ffffff" }}>
      <div className="w-full max-w-xl fade-in">{children}</div>
    </div>
  );
}

export function StepHeader({
  onBack,
  step,
  total,
  showBack = true,
}: {
  onBack: () => void;
  step: number;
  total: number;
  showBack?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 mb-6" style={{ minHeight: 24 }}>
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium shrink-0 transition-opacity hover:opacity-70"
          style={{ color: BRAND.rose }}
        >
          ← Back
        </button>
      ) : (
        <span className="text-sm shrink-0" style={{ visibility: "hidden" }}>
          ← Back
        </span>
      )}
      <div className="flex gap-1.5 flex-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= step ? BRAND.teal : BRAND.line }}
          />
        ))}
      </div>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-xs font-medium uppercase mb-3"
      style={{ color: BRAND.rose, letterSpacing: "0.18em" }}
    >
      {children}
    </p>
  );
}

export function Display({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display ${className}`} style={{ color: BRAND.teal, fontWeight: 600, lineHeight: 1.12 }}>
      {children}
    </h2>
  );
}

export function GoldRule() {
  return <div style={{ width: 60, height: 3, background: BRAND.gold, borderRadius: 2, margin: "18px 0" }} />;
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
      style={{ backgroundColor: BRAND.teal }}
    >
      {children}
    </button>
  );
}

export function OptionButton({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl px-5 py-4 text-base transition-all duration-150"
      style={{
        backgroundColor: selected ? BRAND.teal : "#ffffff",
        color: selected ? "#ffffff" : BRAND.ink,
        border: `1.5px solid ${selected ? BRAND.teal : "rgba(21,147,143,0.35)"}`,
        lineHeight: 1.45,
      }}
    >
      {children}
    </button>
  );
}

export function QuestionCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#ffffff", border: `1px solid ${BRAND.line}` }}
    >
      {children}
    </div>
  );
}
