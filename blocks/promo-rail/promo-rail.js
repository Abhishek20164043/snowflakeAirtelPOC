/**
 * promo-rail — Row of compact promo pills (icon + title + sub + link).
 *
 * Authoring rows (one row per pill):
 *   cell1: icon emoji/text
 *   cell2: title
 *   cell3: sub
 *   cell4: link href (or text containing <a>)
 */

function txt(c) { return c ? c.textContent.trim() : ''; }

function getHref(cell) {
  if (!cell) return '#';
  const a = cell.querySelector('a');
  if (a) return a.getAttribute('href');
  return txt(cell) || '#';
}

export default async function decorate(block) {
  const rows = [...block.children];
  const wrap = document.createElement('div');
  wrap.className = 'promo-rail-wrap';
  const inner = document.createElement('div');
  inner.className = 'promo-rail-inner';

  rows.forEach((row) => {
    const cells = [...row.children];
    const icon = txt(cells[0]);
    const title = txt(cells[1]);
    const sub = txt(cells[2]);
    const href = getHref(cells[3]);

    const pill = document.createElement('a');
    pill.className = 'promo-pill';
    pill.href = href;
    pill.innerHTML = `
      <div class="promo-pill-icon" aria-hidden="true">${icon}</div>
      <div class="promo-pill-text">
        <div class="promo-pill-title">${title}</div>
        <div class="promo-pill-sub">${sub}</div>
      </div>
      <span class="promo-pill-arrow" aria-hidden="true">&rsaquo;</span>
    `;
    inner.append(pill);
  });

  wrap.append(inner);
  block.replaceChildren(wrap);
}
