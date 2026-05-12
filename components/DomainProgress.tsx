"use client";

import { useEffect, useState } from "react";
import { readProgress } from "@/lib/progress";

export function DomainProgress({ moduleIds }: { moduleIds: string[] }) {
  const [completed, setCompleted] = useState(0);
  const [inProgress, setInProgress] = useState(0);

  useEffect(() => {
    const store = readProgress();
    let done = 0;
    let wip = 0;
    for (const id of moduleIds) {
      const s = store[id]?.status;
      if (s === "complete") done++;
      else if (s === "in-progress") wip++;
    }
    setCompleted(done);
    setInProgress(wip);
  }, [moduleIds]);

  const total = moduleIds.length;
  if (total === 0) return null;

  const completedPct = (completed / total) * 100;
  const inProgressPct = (inProgress / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: "var(--color-text-lo)" }}>
        <span>
          {completed} of {total} complete
          {inProgress > 0 && <span style={{ color: "#fbbf24" }}> · {inProgress} in progress</span>}
        </span>
        <span>{Math.round(completedPct)}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-surface-2)" }}>
        <div className="h-full flex">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${completedPct}%`, background: "#4ade80" }}
          />
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${inProgressPct}%`, background: "#fbbf24" }}
          />
        </div>
      </div>
    </div>
  );
}
