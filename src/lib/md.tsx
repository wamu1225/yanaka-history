import type { ReactNode } from 'react';

export function renderMarkdown(content: string): ReactNode[] {
  return content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block, i) => {
      if (block.startsWith('## ')) {
        return <h2 key={i}>{block.slice(3)}</h2>;
      }
      return <p key={i}>{block}</p>;
    });
}
