"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function stripFrontmatter(md: string): string {
  return md.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {stripFrontmatter(content)}
      </ReactMarkdown>
    </div>
  );
}
