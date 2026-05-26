/**
 * business-grid — Intro column + 2×2 cards for enterprise solutions.
 *
 * Authoring rows:
 *   1. Intro — cells: label, headline, description, primary-cta (wrap <strong><a>)
 *   2..N. Card — cells: icon, title, description, link-text-with-arrow
 */

function txt(c) { return c ? c.textContent.trim() : ''; }
function html(c) { return c ? c.innerHTML : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const intro = [...rows[0].children];
  const label = txt(intro[0]);
  const headline = txt(intro[1]);
  const desc = html(intro[2]);
  const ctaCell = intro[3];

  const wrap = document.createElement('div');
  wrap.className = 'business-grid-wrap';
  wrap.innerHTML = `
    <div class="bg-inner">
      <div class="bg-layout">
        <div class="bg-intro">
          ${label ? `<p class="bg-label">${label}</p>` : ''}
          ${headline ? `<h2 class="bg-heading">${headline}</h2>` : ''}
          ${desc ? `<div class="bg-desc">${desc}</div>` : ''}
          <div class="bg-cta actions"></div>
        </div>
        <div class="bg-cards"></div>
      </div>
    </div>
  `;
  if (ctaCell) {
    const actions = wrap.querySelector('.bg-cta');
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
  }

  const cards = wrap.querySelector('.bg-cards');
  rows.slice(1).forEach((row) => {
    const c = [...row.children];
    const icon = txt(c[0]);
    const title = txt(c[1]);
    const cdesc = txt(c[2]);
    const link = txt(c[3]);
    const card = document.createElement('div');
    card.className = 'biz-card';
    card.innerHTML = `
      <div class="biz-card-icon" aria-hidden="true">${icon}</div>
      <div class="biz-card-title">${title}</div>
      <p class="biz-card-desc">${cdesc}</p>
      <span class="biz-card-link">${link}</span>
    `;
    cards.append(card);
  });

  block.replaceChildren(wrap);
}
