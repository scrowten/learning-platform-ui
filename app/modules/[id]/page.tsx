import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, BookOpen, GitBranch, Zap } from "lucide-react";
import { getDomains, getModule, getModuleContent, getModuleNotebooks } from "@/lib/api";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { TagPill } from "@/components/TagPill";
import { MarkdownContent } from "@/components/MarkdownContent";

const CATEGORY_LABELS: Record<string, string> = {
  prerequisites:    "Prerequisites",
  "ml-fundamentals":"ML Fundamentals",
  "deep-learning":  "Deep Learning",
  "llms-genai":     "LLMs & GenAI",
  mlops:            "MLOps",
};

const TABS = [
  { key: "overview",   label: "Overview" },
  { key: "theory",     label: "Theory" },
  { key: "cheatsheet", label: "Cheatsheet" },
  { key: "notebooks",  label: "Notebooks" },
  { key: "sota",       label: "SOTA" },
];

export default async function ModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "overview" } = await searchParams;

  let module;
  try { module = await getModule(id); }
  catch { notFound(); }

  const domains = await getDomains();
  const domain = domains.find((d) => d.id === module.domain_id);

  const [contentMd, notebooks] = await Promise.all([
    ["overview", "theory", "cheatsheet"].includes(tab)
      ? getModuleContent(id, tab === "overview" ? "readme" : tab)
      : Promise.resolve(""),
    tab === "notebooks" ? getModuleNotebooks(id) : Promise.resolve([]),
  ]);

  const categoryLabel = module.category ? (CATEGORY_LABELS[module.category] ?? module.category) : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs mb-6 flex flex-wrap items-center gap-1.5" style={{ color: "var(--color-text-lo)" }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/domains/${module.domain_id}`} className="hover:text-white transition-colors">
          {domain?.name ?? module.domain_id}
        </Link>
        {categoryLabel && <><span>/</span><span>{categoryLabel}</span></>}
        <span>/</span>
        <span style={{ color: "var(--color-text-md)" }}>{module.title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-10">
        {/* Main */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <h1 className="text-xl font-bold text-white">{module.title}</h1>
            <DifficultyBadge difficulty={module.difficulty} />
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b mb-8 overflow-x-auto" style={{ borderColor: "var(--color-border)" }}>
            {TABS.map(({ key, label }) => (
              <Link
                key={key}
                href={`/modules/${id}?tab=${key}`}
                className="px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px"
                style={{
                  borderColor: tab === key ? "white" : "transparent",
                  color: tab === key ? "white" : "var(--color-text-md)",
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[200px]">
            {["overview", "theory", "cheatsheet"].includes(tab) && (
              contentMd
                ? <MarkdownContent content={contentMd} />
                : <p style={{ color: "var(--color-text-lo)" }}>No {tab} document available for this module.</p>
            )}

            {tab === "notebooks" && (
              Array.isArray(notebooks) && notebooks.length > 0 ? (
                <ul className="space-y-2">
                  {notebooks.map((nb) => (
                    <li key={nb.filename}
                        className="flex items-center justify-between rounded-lg px-4 py-3"
                        style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border)" }}>
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} style={{ color: "var(--color-text-md)" }} />
                        <span className="text-sm text-white">{nb.name.replace(/_/g, " ")}</span>
                      </div>
                      <a
                        href={`https://github.com/scrowten/learning-platform/blob/main/${nb.git_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs transition-colors"
                        style={{ color: "#60a5fa" }}
                      >
                        View on GitHub →
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "var(--color-text-lo)" }}>No notebooks available for this module.</p>
              )
            )}

            {tab === "sota" && (
              module.sota_topics.length > 0 ? (
                <ul className="space-y-3">
                  {module.sota_topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2.5">
                      <Zap size={14} className="mt-0.5 shrink-0" style={{ color: "#fbbf24" }} />
                      <span className="text-sm" style={{ color: "var(--color-text-hi)" }}>{topic}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "var(--color-text-lo)" }}>No SOTA topics listed.</p>
              )
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="mt-10 lg:mt-0 space-y-5 text-sm">
          <div className="rounded-lg p-4 space-y-3"
               style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border)" }}>
            {module.estimated_hours && (
              <div className="flex items-center gap-2" style={{ color: "var(--color-text-md)" }}>
                <Clock size={13} />
                <span>{module.estimated_hours}h estimated</span>
              </div>
            )}
            {module.last_reviewed && (
              <div className="text-xs" style={{ color: "var(--color-text-lo)" }}>
                Last reviewed: {module.last_reviewed}
              </div>
            )}
          </div>

          {module.tags.length > 0 && (
            <div>
              <p className="section-label">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {module.tags.map((tag) => <TagPill key={tag} tag={tag} />)}
              </div>
            </div>
          )}

          {module.prerequisites && module.prerequisites.length > 0 && (
            <div>
              <p className="section-label flex items-center gap-1">
                <GitBranch size={11} /> Prerequisites
              </p>
              <ul className="space-y-1.5">
                {module.prerequisites.map((prereqId) => (
                  <li key={prereqId}>
                    <Link
                      href={`/modules/${prereqId}`}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "#60a5fa" }}
                    >
                      {prereqId}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
