/**
 * trust-strip — Dark strip with N stat items separated by dividers.
 *
 * Authoring rows (one per stat):
 *   cell1: number — wrap suffix character(s) in <em> for red accent (e.g. "550<em>M+</em>")
 *   cell2: label
 */

function html(c) { return c ? c.innerHTML : ''; }
function txt(c) { return c ? c.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  const wrap = document.createElement('div');
  wrap.className = 'trust-strip-wrap';
  const inner = document.createElement('div');
  inner.className = 'ts-inner';

  rows.forEach((row, i) => {
    const c = [...row.children];
    const num = html(c[0]);
    const label = txt(c[1]);
    if (i > 0) {
      const d = document.createElement('div');
      d.className = 'ts-divider';
      d.setAttribute('aria-hidden', 'true');
      inner.append(d);
    }
    const item = document.createElement('div');
    item.className = 'ts-item';
    item.innerHTML = `
      <div class="ts-number">${num}</div>
      <div class="ts-label">${label}</div>
    `;
    inner.append(item);
  });

  wrap.append(inner);
  block.replaceChildren(wrap);
}
