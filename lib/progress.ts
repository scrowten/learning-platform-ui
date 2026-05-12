export type ProgressStatus = "not-started" | "in-progress" | "complete";

export interface ModuleProgress {
  status: ProgressStatus;
  startedAt?: string;
  completedAt?: string;
}

type ProgressStore = Record<string, ModuleProgress>;

const KEY = "lp:progress";

export function readProgress(): ProgressStore {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function writeProgress(store: ProgressStore): void {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function getModuleProgress(moduleId: string): ModuleProgress {
  return readProgress()[moduleId] ?? { status: "not-started" };
}

export function setModuleStatus(moduleId: string, status: ProgressStatus): void {
  const store = readProgress();
  const now = new Date().toISOString();
  const existing = store[moduleId] ?? {};
  store[moduleId] = {
    ...existing,
    status,
    ...(status === "in-progress" && !existing.startedAt ? { startedAt: now } : {}),
    ...(status === "complete" ? { completedAt: now, startedAt: existing.startedAt ?? now } : {}),
    ...(status === "not-started" ? { startedAt: undefined, completedAt: undefined } : {}),
  };
  writeProgress(store);
}

export function exportProgress(): void {
  const data = JSON.stringify(readProgress(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lp-progress-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProgress(json: string): void {
  const parsed = JSON.parse(json);
  if (typeof parsed !== "object" || parsed === null) throw new Error("Invalid progress file");
  writeProgress(parsed as ProgressStore);
}
