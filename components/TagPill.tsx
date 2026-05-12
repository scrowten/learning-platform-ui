export function TagPill({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-400">
      #{tag}
    </span>
  );
}
