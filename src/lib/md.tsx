import type { ReactNode } from 'react';

// インライン記法：**強調** と [text](/articles/id/) のみサポートする最小限のパーサ。
function renderInline(text: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((\/articles\/[a-z0-9-]+\/)\)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) tokens.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      tokens.push(<strong key={key++}>{m[1]}</strong>);
    } else {
      tokens.push(
        <a key={key++} href={m[3]}>
          {m[2]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push(text.slice(last));
  return tokens;
}

export function extractHeadings(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.startsWith('## '))
    .map((b) => b.slice(3));
}

export function renderMarkdown(content: string): ReactNode[] {
  let h2Index = 0;
  return content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block, i) => {
      if (block.startsWith('## ')) {
        return (
          <h2 key={i} id={`sec-${h2Index++}`}>
            {block.slice(3)}
          </h2>
        );
      }
      return <p key={i}>{renderInline(block)}</p>;
    });
}
