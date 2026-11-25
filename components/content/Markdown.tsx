import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Plain text of a React node tree, for building heading anchors. */
function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Renders trusted-or-untrusted markdown safely (raw HTML is NOT rendered).
 * Used for blog posts and release notes stored in the database.
 */
export function Markdown({
  children,
  className,
  size = "lg",
}: {
  children: string;
  className?: string;
  size?: "sm" | "base" | "lg";
}) {
  const sizeClass = size === "lg" ? "prose-lg" : size === "sm" ? "prose-sm" : "prose-base";

  return (
    <div className={cn("prose prose-orbit max-w-none", sizeClass, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 id={slugify(textOf(children))} className="scroll-mt-24">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={slugify(textOf(children))} className="scroll-mt-24">
              {children}
            </h3>
          ),
          a:({ href = "", children }) =>
            href.startsWith("/") ? (
              <Link href={href}>{children}</Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
