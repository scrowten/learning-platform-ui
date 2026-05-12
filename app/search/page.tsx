import { getDomains, searchModules } from "@/lib/api";
import { ModuleCard } from "@/components/ModuleCard";

const inputCls = "w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1";
const inputStyle = {
  background: "var(--color-surface-1)",
  border: "1px solid var(--color-border)",
};

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
      <h1 className="text-xl font-bold text-white mb-6">Search</h1>

      <form method="GET" className="flex flex-wrap gap-2.5 mb-8">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search modules…"
          className={`${inputCls} flex-1 min-w-[180px]`}
          style={inputStyle}
        />
        <select name="domain" defaultValue={domain ?? ""}
                className={`${inputCls} w-auto`} style={inputStyle}>
          <option value="">All domains</option>
          {domains.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select name="difficulty" defaultValue={difficulty ?? ""}
                className={`${inputCls} w-auto`} style={inputStyle}>
          <option value="">All difficulties</option>
          {["beginner", "intermediate", "advanced", "research"].map((d) => (
            <option key={d} value={d} className="capitalize">{d}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{ background: "white", color: "#0e0e12" }}
        >
          Search
        </button>
      </form>

      {hasQuery ? (
        <div>
          <p className="text-xs mb-4" style={{ color: "var(--color-text-lo)" }}>
            {results.total} result{results.total !== 1 ? "s" : ""}
            {q ? ` for "${q}"` : ""}
          </p>
          {results.modules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.modules.map((m) => <ModuleCard key={m.id} module={m} />)}
            </div>
          ) : (
            <p style={{ color: "var(--color-text-lo)" }}>No modules found. Try a different search.</p>
          )}
        </div>
      ) : (
        <p style={{ color: "var(--color-text-lo)" }}>Enter a search term above to find modules.</p>
      )}
    </div>
  );
}
