"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayCircle, Download, Upload } from "lucide-react";
import { readProgress, exportProgress, importProgress } from "@/lib/progress";

interface Props {
  moduleMap: Record<string, string>; // id → title
}

export function ContinueLearning({ moduleMap }: Props) {
  const [lastInProgress, setLastInProgress] = useState<{ id: string; title: string } | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const store = readProgress();
    let done = 0;
    let candidate: { id: string; title: string; startedAt: string } | null = null;

    for (const [id, p] of Object.entries(store)) {
      if (p.status === "complete") done++;
      if (p.status === "in-progress" && moduleMap[id]) {
        if (!candidate || (p.startedAt ?? "") > (candidate.startedAt ?? "")) {
          candidate = { id, title: moduleMap[id], startedAt: p.startedAt ?? "" };
        }
      }
    }
    setCompletedCount(done);
    setLastInProgress(candidate ? { id: candidate.id, title: candidate.title } : null);
  }, [moduleMap]);

  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        importProgress(text);
        window.location.reload();
      } catch {
        alert("Invalid progress file.");
      }
    };
    input.click();
  }

  if (!lastInProgress && completedCount === 0) return null;

  return (
    <div className="mb-10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4"
         style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border)" }}>
      <div className="flex items-center gap-3">
        {lastInProgress ? (
          <>
            <PlayCircle size={16} style={{ color: "#fbbf24" }} className="shrink-0" />
            <div>
              <p className="text-xs" style={{ color: "var(--color-text-lo)" }}>Continue learning</p>
              <Link href={`/modules/${lastInProgress.id}`}
                    className="text-sm font-medium text-white hover:underline">
                {lastInProgress.title}
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm" style={{ color: "var(--color-text-md)" }}>
            <span className="text-white font-medium">{completedCount}</span> module{completedCount !== 1 ? "s" : ""} completed
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={exportProgress}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                style={{ color: "var(--color-text-md)", background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <Download size={12} /> Export
        </button>
        <button type="button" onClick={handleImport}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                style={{ color: "var(--color-text-md)", background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <Upload size={12} /> Import
        </button>
      </div>
    </div>
  );
}
