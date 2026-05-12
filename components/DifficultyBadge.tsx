const STYLES: Record<string, { bg: string; text: string; border: string }> = {
  beginner:     { bg: "#0d2e1a", text: "#4ade80", border: "#166534" },
  intermediate: { bg: "#0d1e3a", text: "#60a5fa", border: "#1d4ed8" },
  advanced:     { bg: "#1e0d3a", text: "#c084fc", border: "#7e22ce" },
  research:     { bg: "#2e0d1a", text: "#f87171", border: "#991b1b" },
};

export function DifficultyBadge({ difficulty }: { difficulty: string | null }) {
  if (!difficulty) return null;
  const s = STYLES[difficulty] ?? { bg: "var(--color-surface-2)", text: "var(--color-text-md)", border: "var(--color-border)" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {difficulty}
    </span>
  );
}
