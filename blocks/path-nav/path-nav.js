/**
 * path-nav — Dark anchor nav bar with icon + label links (first is active).
 *
 * Authoring rows (one per link):
 *   cell1: icon
 *   cell2: label
 *   cell3: href (link or text)
 */

function txt(c) { return c ? c.textContent.trim() : ''; }

function hrefOf(cell) {
  if (!cell) return '#';
  const a = cell.querySelector('a');
  if (a) return a.getAttribute('href');
  return txt(cell) || '#';
}

export default async function decorate(block) {
  const rows = [...block.children];

  const wrap = document.createElement('div');
  wrap.className = 'path-nav-wrap';
  const inner = document.createElement('div');
  inner.className = 'pn-inner';

  rows.forEach((row, i) => {
    const c = [...row.children];
    const a = document.createElement('a');
    a.className = `pn-link${i === 0 ? ' active' : ''}`;
    a.href = hrefOf(c[2]);
    a.innerHTML = `<span class="pn-icon" aria-hidden="true">${txt(c[0])}</span>${txt(c[1])}`;
    inner.append(a);
  });

  wrap.append(inner);
  block.replaceChildren(wrap);
}
