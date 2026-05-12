"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Strip YAML frontmatter from markdown
function stripFrontmatter(md: string): string {
  return md.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

export function MarkdownContent({ content }: { content: string }) {
  const clean = stripFrontmatter(content);
  return (
    <div className="prose prose-invert prose-zinc max-w-none prose-code:before:content-none prose-code:after:content-none prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{clean}</ReactMarkdown>
    </div>
  );
}
