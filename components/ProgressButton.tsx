"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Circle, PlayCircle } from "lucide-react";
import { getModuleProgress, setModuleStatus, type ProgressStatus } from "@/lib/progress";

const NEXT: Record<ProgressStatus, ProgressStatus> = {
  "not-started": "in-progress",
  "in-progress": "complete",
  "complete":    "not-started",
};

const CONFIG: Record<ProgressStatus, { label: string; icon: React.ReactNode; color: string; border: string }> = {
  "not-started": {
    label: "Mark as started",
    icon: <Circle size={14} />,
    color: "var(--color-text-md)",
    border: "var(--color-border-hi)",
  },
  "in-progress": {
    label: "In progress",
    icon: <PlayCircle size={14} />,
    color: "#fbbf24",
    border: "#92400e",
  },
  "complete": {
    label: "Completed",
    icon: <CheckCircle size={14} />,
    color: "#4ade80",
    border: "#166534",
  },
};

export function ProgressButton({ moduleId }: { moduleId: string }) {
  const [status, setStatus] = useState<ProgressStatus>("not-started");

  useEffect(() => {
    setStatus(getModuleProgress(moduleId).status);
  }, [moduleId]);

  function cycle() {
    const next = NEXT[status];
    setModuleStatus(moduleId, next);
    setStatus(next);
  }

  const cfg = CONFIG[status];

  return (
    <button
      type="button"
      onClick={cycle}
      className="w-full flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg cursor-pointer"
      style={{
        color: cfg.color,
        background: "var(--color-surface-2)",
        border: `1px solid ${cfg.border}`,
      }}
    >
      {cfg.icon}
      {cfg.label}
    </button>
  );
}
