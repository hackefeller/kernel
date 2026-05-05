import * as yaml from "yaml";

const FRONTMATTER_DELIMITER = "---";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pruneUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    const items = value.map((item) => pruneUndefined(item)).filter((item) => item !== undefined);
    return items.length > 0 ? items : undefined;
  }
  if (value && typeof value === "object") {
    const entries: [string, unknown][] = [];
    for (const [key, entry] of Object.entries(value)) {
      const pruned = pruneUndefined(entry);
      if (pruned !== undefined) {
        entries.push([key, pruned]);
      }
    }
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }
  if (value === undefined || value === null) {
    return undefined;
  }
  return value;
}

export function serializeFrontmatter(frontmatter: Record<string, unknown>, body: string): string {
  const content = pruneUndefined(frontmatter);
  const frontmatterBlock = content ? yaml.stringify(content).trim() : "";
  return frontmatterBlock
    ? `${FRONTMATTER_DELIMITER}\n${frontmatterBlock}\n${FRONTMATTER_DELIMITER}\n\n${body.trim()}\n`
    : `${body.trim()}\n`;
}

export function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const empty: Record<string, unknown> = {};

  if (!content.startsWith(FRONTMATTER_DELIMITER)) {
    return { frontmatter: empty, body: content };
  }

  const end = content.indexOf(`\n${FRONTMATTER_DELIMITER}`, FRONTMATTER_DELIMITER.length);
  if (end === -1) {
    return { frontmatter: empty, body: content };
  }

  const raw = content.slice(FRONTMATTER_DELIMITER.length, end).trim();
  const body = content.slice(end + FRONTMATTER_DELIMITER.length + 1).trimStart();

  const parsed = yaml.parse(raw);
  if (!isRecord(parsed)) {
    return { frontmatter: empty, body };
  }

  return { frontmatter: parsed, body };
}
