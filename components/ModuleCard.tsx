import Link from "next/link";
import { Clock, GitBranch } from "lucide-react";
import type { Module } from "@/lib/types";
import { DifficultyBadge } from "./DifficultyBadge";
import { TagPill } from "./TagPill";

export function ModuleCard({ module }: { module: Module }) {
  return (
    <Link
      href={`/modules/${module.id}`}
      className="block rounded-lg border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-white group-hover:text-zinc-100 leading-snug">
          {module.title}
        </h3>
        <DifficultyBadge difficulty={module.difficulty} />
      </div>

      {module.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {module.tags.slice(0, 5).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-zinc-500">
        {module.estimated_hours && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {module.estimated_hours}h
          </span>
        )}
        {module.prerequisites && module.prerequisites.length > 0 && (
          <span className="flex items-center gap-1">
            <GitBranch size={12} />
            {module.prerequisites.length} prereq{module.prerequisites.length !== 1 ? "s" : ""}
          </span>
        )}
        {module.last_reviewed && (
          <span>Updated {module.last_reviewed}</span>
        )}
      </div>
    </Link>
  );
}
