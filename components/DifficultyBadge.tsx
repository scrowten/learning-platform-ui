const COLORS: Record<string, string> = {
  beginner: "bg-emerald-900 text-emerald-300",
  intermediate: "bg-blue-900 text-blue-300",
  advanced: "bg-purple-900 text-purple-300",
  research: "bg-rose-900 text-rose-300",
};

export function DifficultyBadge({ difficulty }: { difficulty: string | null }) {
  if (!difficulty) return null;
  const cls = COLORS[difficulty] ?? "bg-zinc-800 text-zinc-300";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {difficulty}
    </span>
  );
}
