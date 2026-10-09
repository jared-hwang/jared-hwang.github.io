// Minimal frontmatter reader/editor for the admin.
//
// Frontmatter is split into "blocks": a top-level `key:` line plus any
// indented lines under it (e.g. a `tags:` list). Comments and anything the
// admin doesn't manage are kept as-is, so editing a field never disturbs the
// rest of the file.

const KEY_RE = /^([A-Za-z_][\w-]*):(.*)$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Parse a markdown file into { blocks, body }. */
export function parseDoc(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error("File has no frontmatter (expected it to start with ---)");
  const blocks = [];
  for (const line of match[1].split(/\r?\n/)) {
    const key = line.match(KEY_RE);
    const last = blocks[blocks.length - 1];
    if (key) blocks.push({ key: key[1], lines: [line] });
    else if (last?.key && /^\s+\S/.test(line)) last.lines.push(line);
    else blocks.push({ key: null, lines: [line] });
  }
  return { blocks, body: match[2].replace(/^\n+/, "") };
}

export function serializeDoc(doc) {
  const fm = doc.blocks.flatMap((b) => b.lines).join("\n");
  return `---\n${fm}\n---\n\n${doc.body.trim()}\n`;
}

/** All keyed values as a plain object (complex nested values are skipped). */
export function docData(doc) {
  const data = {};
  for (const block of doc.blocks) {
    if (!block.key) continue;
    const value = blockValue(block);
    if (value !== undefined) data[block.key] = value;
  }
  return data;
}

/** Set a key, replacing its block; empty / false / [] removes the key. */
export function setValue(doc, key, value) {
  const index = doc.blocks.findIndex((b) => b.key === key);
  const empty = value === undefined || value === "" || value === false || (Array.isArray(value) && value.length === 0);
  if (empty) {
    if (index !== -1) doc.blocks.splice(index, 1);
    return;
  }
  // Unchanged value: keep the original line(s) so quoting/formatting stays as written.
  if (index !== -1 && JSON.stringify(blockValue(doc.blocks[index])) === JSON.stringify(value)) return;
  const block = { key, lines: [`${key}: ${yamlValue(value)}`] };
  if (index !== -1) doc.blocks[index] = block;
  else doc.blocks.push(block);
}

/** Build a brand-new file from fields (empty ones are left out). */
export function newDoc(fields, body = "") {
  const doc = { blocks: [], body };
  for (const [key, value] of Object.entries(fields)) setValue(doc, key, value);
  return serializeDoc(doc);
}

export function yamlValue(v) {
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return `[${v.map((x) => JSON.stringify(x)).join(", ")}]`;
  if (DATE_RE.test(v)) return v;
  return JSON.stringify(v); // JSON strings are valid YAML double-quoted strings
}

// ─── Value parsing ────────────────────────────────────────────────────────

function blockValue(block) {
  const rest = block.lines[0].match(KEY_RE)[2].trim();
  const more = block.lines.slice(1);
  if (rest === "" && more.length) {
    // Block list of plain scalars ("  - item"); anything more nested is skipped.
    const items = more.map((l) => l.match(/^\s+-\s+(.*)$/));
    if (items.every((m) => m && !KEY_RE.test(m[1]))) return items.map((m) => parseScalar(m[1]));
    return undefined;
  }
  if (rest.startsWith("[") && rest.endsWith("]")) return splitInline(rest.slice(1, -1)).map(parseScalar);
  return parseScalar(rest);
}

function parseScalar(raw) {
  const s = raw.trim();
  if (s.length >= 2 && s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
    return s.slice(1, -1).replace(/\\(["\\/nt])/g, (_, c) => ({ n: "\n", t: "\t" })[c] ?? c);
  }
  if (s === "true") return true;
  if (s === "false") return false;
  return s;
}

/** Split "a, 'b, c', d" on top-level commas, respecting quotes. */
function splitInline(s) {
  const parts = [];
  let current = "";
  let quote = null;
  for (const ch of s) {
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === "'" || ch === '"') {
      quote = ch;
    } else if (ch === ",") {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current);
  return parts.map((p) => p.trim()).filter(Boolean);
}
