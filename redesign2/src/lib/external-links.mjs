// Rehype plugin: links in Markdown that go to another site open in a new tab.

/** @param {any} node */
function visit(node) {
  if (node.type === "element" && node.tagName === "a" && /^https?:\/\//.test(String(node.properties?.href ?? ""))) {
    node.properties.target = "_blank";
    node.properties.rel = ["noopener"];
  }
  for (const child of node.children ?? []) visit(child);
}

export default function externalLinks() {
  return visit;
}
