export function renderTooltipContent(text: string) {
  const lines = text.split(/\\n/);

  return lines.map((line, lineIdx) => (
    <span key={lineIdx}>
      {lineIdx > 0 && <br />}
      {renderLine(line)}
    </span>
  ));
}

export function renderLine(text: string) {
  const parts = text.split(/(`[^`]+`|\[.*?\]\(.*?\)|\*\*.*?\*\*)/);
  return parts.map((part, i) => {
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code key={i} className="bg-[var(--bg-primary)] px-1.5 py-0.5 rounded text-[var(--accent)] font-mono text-[10px] select-all break-all">
          {codeMatch[1]}
        </code>
      );
    }
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return <strong key={i} className="font-semibold text-[var(--text-primary)]">{boldMatch[1]}</strong>;
    }
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
          className="text-[var(--accent)] underline hover:opacity-80">
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
