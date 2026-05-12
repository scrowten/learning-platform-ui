import Link from "next/link";
import { getDomains, getDomainModules } from "@/lib/api";
import type { Domain } from "@/lib/types";

async function DomainCard({ domain }: { domain: Domain }) {
  let moduleCount = 0;
  try {
    const { total } = await getDomainModules(domain.id);
    moduleCount = total;
  } catch {
    // empty domain
  }

  const isEmpty = moduleCount === 0;
  const inner = (
    <div
      className={`rounded-xl border p-6 transition-all h-full ${
        isEmpty
          ? "border-zinc-800 bg-zinc-900/40 opacity-60"
          : "border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800/60 group"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{domain.icon}</span>
        <div>
          <h2
            className="font-semibold leading-snug"
            style={{ color: isEmpty ? "#71717a" : domain.color }}
          >
            {domain.name}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isEmpty ? "Coming soon" : `${moduleCount} module${moduleCount !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {domain.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  return isEmpty ? (
    <div className="cursor-default">{inner}</div>
  ) : (
    <Link href={`/domains/${domain.id}`} className="block h-full">
      {inner}
    </Link>
  );
}

export default async function HomePage() {
  const domains = await getDomains();

  const counts = await Promise.allSettled(domains.map((d) => getDomainModules(d.id)));
  const totalModules = counts.reduce(
    (sum, r) => sum + (r.status === "fulfilled" ? r.value.total : 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Learning Platform</h1>
        <p className="text-zinc-400 mb-6">
          Pick any domain, pick any module, learn at your own pace.
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <span>
            <span className="text-white font-medium">{domains.length}</span> domains
          </span>
          <span>
            <span className="text-white font-medium">{totalModules}</span> modules
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>
    </div>
  );
}
