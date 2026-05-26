/**
 * recommendations — Grid of image cards with overlay text + small CTA chip.
 *
 * Authoring rows:
 *   1. Header — cells: label, headline, view-all link
 *   2..N. Card — cells: image, title, sub, cta text (e.g. "GET STARTED →")
 */

function txt(c) { return c ? c.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const head = [...rows[0].children];
  const label = txt(head[0]);
  const headline = txt(head[1]);
  const viewAllCell = head[2];

  const wrap = document.createElement('div');
  wrap.className = 'recommendations-wrap';
  wrap.innerHTML = `
    <div class="rec-inner">
      <div class="rec-header">
        <div>
          ${label ? `<p class="rec-label">${label}</p>` : ''}
          ${headline ? `<h2 class="rec-heading">${headline}</h2>` : ''}
        </div>
        <div class="rec-view-all"></div>
      </div>
      <div class="rec-grid"></div>
    </div>
  `;
  if (viewAllCell && viewAllCell.querySelector('a')) {
    const a = viewAllCell.querySelector('a');
    a.classList.add('rec-view-all-link');
    wrap.querySelector('.rec-view-all').append(a);
  }

  const grid = wrap.querySelector('.rec-grid');
  rows.slice(1).forEach((row) => {
    const c = [...row.children];
    const img = c[0]?.querySelector('img, picture');
    const title = txt(c[1]);
    const sub = txt(c[2]);
    const cta = txt(c[3]);
    const card = document.createElement('div');
    card.className = 'rec-card';
    if (img) card.append(img.cloneNode(true));
    const overlay = document.createElement('div');
    overlay.className = 'rec-card-overlay';
    overlay.innerHTML = `
      ${title ? `<div class="rec-card-title">${title}</div>` : ''}
      ${sub ? `<div class="rec-card-sub">${sub}</div>` : ''}
      ${cta ? `<span class="rec-card-cta">${cta}</span>` : ''}
    `;
    card.append(overlay);
    grid.append(card);
  });

  block.replaceChildren(wrap);
}
