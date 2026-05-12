import { getDomains, searchModules } from "@/lib/api";
import { ModuleCard } from "@/components/ModuleCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; domain?: string; difficulty?: string }>;
}) {
  const { q = "", domain, difficulty } = await searchParams;

  const [domains, results] = await Promise.all([
    getDomains(),
    q || domain || difficulty
      ? searchModules({ q, domain, difficulty })
      : Promise.resolve({ modules: [], total: 0, page: 1, limit: 20 }),
  ]);

  const hasQuery = !!(q || domain || difficulty);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Search</h1>

      <form method="GET" className="flex flex-wrap gap-3 mb-8">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search modules..."
          className="flex-1 min-w-[200px] rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
        />
        <select
          name="domain"
          defaultValue={domain ?? ""}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
        >
          <option value="">All domains</option>
          {domains.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          name="difficulty"
          defaultValue={difficulty ?? ""}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
        >
          <option value="">All difficulties</option>
          {["beginner", "intermediate", "advanced", "research"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          Search
        </button>
      </form>

      {hasQuery && (
        <div>
          <p className="text-sm text-zinc-500 mb-4">
            {results.total} result{results.total !== 1 ? "s" : ""}{q ? ` for "${q}"` : ""}
          </p>
          {results.modules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.modules.map((m) => (
                <ModuleCard key={m.id} module={m} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">No modules found. Try a different search.</p>
          )}
        </div>
      )}

      {!hasQuery && (
        <p className="text-zinc-500">Enter a search term to find modules.</p>
      )}
    </div>
  );
}
