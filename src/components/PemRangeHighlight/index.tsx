import React from "react";
import CodeBlock from "@theme/CodeBlock";

type Range = {
  from: number; // inclusive, 0-based
  to: number;   // exclusive, 0-based
  className?: string;
};

type Props = {
  pem: string;
  ranges: Range[];
  language?: string; // keep "text" for PEM
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PemRangeHighlight({
  pem,
  ranges,
  language = "text",
}: Props) {
  // Normalize CRLF to LF to keep offsets stable
  const normalized = pem.replace(/\r\n/g, "\n");
  const len = normalized.length;

  const cleaned = ranges
    .map((r) => {
      const from = clamp(r.from, 0, len);
      const to = clamp(r.to, 0, len);
      return {
        from: Math.min(from, to),
        to: Math.max(from, to),
        className: r.className ?? "pemRangeHighlightA",
      };
    })
    .filter((r) => r.to > r.from)
    .sort((a, b) => (a.from - b.from) || (a.to - b.to));

  // Prevent overlaps by clipping later ranges
  const nonOverlapping: typeof cleaned = [];
  let cursor = 0;
  for (const r of cleaned) {
    const from = Math.max(r.from, cursor);
    const to = Math.max(from, r.to);
    if (to > from) {
      nonOverlapping.push({ ...r, from, to });
      cursor = to;
    }
  }

  const segments: React.ReactNode[] = [];
  let pos = 0;

  for (let i = 0; i < nonOverlapping.length; i++) {
    const r = nonOverlapping[i];

    if (pos < r.from) {
      segments.push(
        <span key={`t-${i}-${pos}`}>{normalized.slice(pos, r.from)}</span>
      );
    }

    segments.push(
      <span
        key={`h-${i}-${r.from}`}
        className={`pemRangeHighlight ${r.className}`.trim()}
      >
        {normalized.slice(r.from, r.to)}
      </span>
    );

    pos = r.to;
  }

  if (pos < len) {
    segments.push(<span key={`t-end-${pos}`}>{normalized.slice(pos)}</span>);
  }

  return (
    <CodeBlock language={language}>
      {/* This wrapper is the important part: it preserves newlines */}
      <code className="pemCodePreserve">{segments}</code>
    </CodeBlock>
  );
}
