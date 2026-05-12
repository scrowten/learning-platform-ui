import { notFound } from "next/navigation";
import Link from "next/link";
import { getDomains, getDomainModules } from "@/lib/api";
import type { Module } from "@/lib/types";
import { ModuleCard } from "@/components/ModuleCard";

function groupByCategory(modules: Module[]): Record<string, Module[]> {
  return modules.reduce<Record<string, Module[]>>((acc, m) => {
    const key = m.category ?? "other";
    (acc[key] ??= []).push(m);
    return acc;
  }, {});
}

const CATEGORY_LABELS: Record<string, string> = {
  prerequisites:    "Prerequisites",
  "ml-fundamentals":"ML Fundamentals",
  "deep-learning":  "Deep Learning",
  "llms-genai":     "LLMs & GenAI",
  mlops:            "MLOps",
  other:            "Other",
};

export default async function DomainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const domains = await getDomains();
  const domain = domains.find((d) => d.id === id);
  if (!domain) notFound();

  const { modules } = await getDomainModules(id);
  const grouped = groupByCategory(modules);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <nav className="text-xs mb-7 flex items-center gap-1.5" style={{ color: "var(--color-text-lo)" }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span style={{ color: domain.color }}>{domain.name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl leading-none">{domain.icon}</span>
        <div>
          <h1 className="text-xl font-bold text-white">{domain.name}</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-lo)" }}>
            {modules.length} module{modules.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {modules.length === 0 ? (
        <p style={{ color: "var(--color-text-lo)" }}>No modules yet — coming soon.</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([category, mods]) => (
            <section key={category}>
              <p className="section-label">{CATEGORY_LABELS[category] ?? category}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mods.map((m) => <ModuleCard key={m.id} module={m} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
