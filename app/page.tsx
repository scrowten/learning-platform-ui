import Link from "next/link";
import { getDomains, getDomainModules } from "@/lib/api";
import type { Domain } from "@/lib/types";
import { ContinueLearning } from "@/components/ContinueLearning";

async function DomainCard({ domain }: { domain: Domain }) {
  let moduleCount = 0;
  try {
    const { total } = await getDomainModules(domain.id);
    moduleCount = total;
  } catch {
    // empty domain
  }

  const isEmpty = moduleCount === 0;

  const cardContent = (
    <>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl leading-none">{domain.icon}</span>
        <div>
          <h2
            className="font-semibold text-sm leading-snug"
            style={{ color: isEmpty ? "var(--color-text-md)" : domain.color }}
          >
            {domain.name}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-lo)" }}>
            {isEmpty ? "Coming soon" : `${moduleCount} module${moduleCount !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {domain.tags.map((tag) => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>
    </>
  );

  const baseClass =
    "block rounded-xl p-5 transition-all h-full";
  const baseStyle = {
    background: "var(--color-surface-1)",
    border: "1px solid var(--color-border)",
  };

  if (isEmpty) {
    return (
      <div className={baseClass} style={{ ...baseStyle, opacity: 0.45 }}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/domains/${domain.id}`}
      className={`${baseClass} domain-card`}
      style={baseStyle}
    >
      {cardContent}
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

  const moduleMap: Record<string, string> = {};
  counts.forEach((r) => {
    if (r.status === "fulfilled") {
      r.value.modules.forEach((m) => { moduleMap[m.id] = m.title; });
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-1.5">Learning Platform</h1>
        <p className="text-sm mb-5" style={{ color: "var(--color-text-md)" }}>
          Pick any domain, pick any module, learn at your own pace.
        </p>
        <div className="flex gap-5 text-sm" style={{ color: "var(--color-text-lo)" }}>
          <span><span className="text-white font-medium">{domains.length}</span> domains</span>
          <span><span className="text-white font-medium">{totalModules}</span> modules</span>
        </div>
      </div>

      <ContinueLearning moduleMap={moduleMap} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {domains.map((domain) => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>
    </div>
  );
}
