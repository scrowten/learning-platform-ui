import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, BookOpen, GitBranch, Zap } from "lucide-react";
import { getModule, getModuleContent, getModuleNotebooks } from "@/lib/api";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { TagPill } from "@/components/TagPill";
import { MarkdownContent } from "@/components/MarkdownContent";

const CATEGORY_LABELS: Record<string, string> = {
  prerequisites: "Prerequisites",
  "ml-fundamentals": "ML Fundamentals",
  "deep-learning": "Deep Learning",
  "llms-genai": "LLMs & GenAI",
  mlops: "MLOps",
};

export default async function ModulePage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "overview" } = await searchParams;

  let module;
  try {
    module = await getModule(id);
  } catch {
    notFound();
  }

  const [overviewMd, conceptsMd, cheatsheetMd, notebooks] = await Promise.all([
    tab === "overview" ? getModuleContent(id, "readme") : Promise.resolve(""),
    tab === "theory" ? getModuleContent(id, "concepts") : Promise.resolve(""),
    tab === "cheatsheet" ? getModuleContent(id, "cheatsheet") : Promise.resolve(""),
    tab === "notebooks" ? getModuleNotebooks(id) : Promise.resolve([]),
  ]);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "theory", label: "Theory" },
    { key: "cheatsheet", label: "Cheatsheet" },
    { key: "notebooks", label: "Notebooks" },
    { key: "sota", label: "SOTA" },
  ];

  const categoryLabel = module.category ? (CATEGORY_LABELS[module.category] ?? module.category) : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-zinc-500 mb-6">
        <Link href="/" className="hover:text-white">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/domains/${module.domain_id}`} className="hover:text-white capitalize">
          {module.domain_id}
        </Link>
        {categoryLabel && (
          <>
            <span className="mx-2">/</span>
            <span>{categoryLabel}</span>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-zinc-300">{module.title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
        {/* Main content */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-white">{module.title}</h1>
            <DifficultyBadge difficulty={module.difficulty} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-zinc-800 mb-8 overflow-x-auto">
            {tabs.map(({ key, label }) => (
              <Link
                key={key}
                href={`/modules/${id}?tab=${key}`}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  tab === key
                    ? "border-white text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Tab content */}
          {tab === "overview" && (
            overviewMd
              ? <MarkdownContent content={overviewMd} />
              : <p className="text-zinc-500">No overview available.</p>
          )}
          {tab === "theory" && (
            conceptsMd
              ? <MarkdownContent content={conceptsMd} />
              : <p className="text-zinc-500">No theory document available.</p>
          )}
          {tab === "cheatsheet" && (
            cheatsheetMd
              ? <MarkdownContent content={cheatsheetMd} />
              : <p className="text-zinc-500">No cheatsheet available.</p>
          )}
          {tab === "notebooks" && (
            <div>
              {Array.isArray(notebooks) && notebooks.length > 0 ? (
                <ul className="space-y-3">
                  {notebooks.map((nb) => (
                    <li key={nb.filename} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-zinc-400" />
                        <span className="text-white text-sm">{nb.name.replace(/_/g, " ")}</span>
                      </div>
                      <a
                        href={`https://github.com/scrowten/learning-platform/blob/main/${nb.git_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        View on GitHub →
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-zinc-500">No notebooks available for this module.</p>
              )}
            </div>
          )}
          {tab === "sota" && (
            <div>
              {module.sota_topics.length > 0 ? (
                <ul className="space-y-2">
                  {module.sota_topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-zinc-300">
                      <Zap size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-zinc-500">No SOTA topics listed.</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="mt-10 lg:mt-0 space-y-6">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-4 text-sm">
            {module.estimated_hours && (
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock size={14} />
                <span>{module.estimated_hours} hours estimated</span>
              </div>
            )}
            {module.last_reviewed && (
              <div className="text-zinc-500">Last reviewed: {module.last_reviewed}</div>
            )}
          </div>

          {module.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {module.tags.map((tag) => <TagPill key={tag} tag={tag} />)}
              </div>
            </div>
          )}

          {module.prerequisites && module.prerequisites.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1">
                <GitBranch size={12} /> Prerequisites
              </h3>
              <ul className="space-y-1">
                {module.prerequisites.map((prereqId) => (
                  <li key={prereqId}>
                    <Link
                      href={`/modules/${prereqId}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
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
