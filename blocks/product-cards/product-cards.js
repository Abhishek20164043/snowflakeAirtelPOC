/**
 * product-cards — Grid of product cards. First card can be featured (dark).
 *
 * Authoring rows:
 *   1. Header — cells: label, headline, subhead, view-all-link
 *   2..N. Card — cells: image, tag-style (featured|red|black|lavender),
 *                       tag-text, title, description, price, price-suffix,
 *                       cta-link (wrap <strong><a> primary or <em><strong><a> accent)
 */

function txt(c) { return c ? c.textContent.trim() : ''; }
function html(c) { return c ? c.innerHTML : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const head = rows[0];
  const headCells = [...head.children];
  const label = txt(headCells[0]);
  const headline = txt(headCells[1]);
  const subhead = txt(headCells[2]);
  const viewAllCell = headCells[3];

  const wrap = document.createElement('div');
  wrap.className = 'product-cards-wrap';

  const inner = document.createElement('div');
  inner.className = 'product-cards-inner';

  const header = document.createElement('div');
  header.className = 'pc-header';
  header.innerHTML = `
    <div class="pc-header-left">
      ${label ? `<p class="pc-label">${label}</p>` : ''}
      ${headline ? `<h2 class="pc-heading">${headline}</h2>` : ''}
      ${subhead ? `<p class="pc-subhead">${subhead}</p>` : ''}
    </div>
    <div class="pc-view-all"></div>
  `;
  if (viewAllCell && viewAllCell.querySelector('a')) {
    const a = viewAllCell.querySelector('a');
    a.classList.add('pc-view-all-link');
    header.querySelector('.pc-view-all').append(a);
  }

  const grid = document.createElement('div');
  grid.className = 'pc-grid';

  rows.slice(1).forEach((row) => {
    const c = [...row.children];
    const variant = txt(c[1]).toLowerCase();
    const tagText = txt(c[2]);
    const title = txt(c[3]);
    const desc = txt(c[4]);
    const price = txt(c[5]);
    const priceSuffix = txt(c[6]);
    const ctaCell = c[7];

    const card = document.createElement('div');
    card.className = 'product-card';
    if (variant === 'featured') card.classList.add('featured');

    const img = c[0]?.querySelector('img, picture');
    if (img) {
      const i = img.cloneNode(true);
      i.classList?.add('product-card-img');
      card.append(i);
    }

    const body = document.createElement('div');
    body.className = 'product-card-body';
    body.innerHTML = `
      ${tagText ? `<div class="product-card-tag"><span class="tag tag-${variant || 'lavender'}">${tagText}</span></div>` : ''}
      ${title ? `<h3 class="product-card-title">${title}</h3>` : ''}
      ${desc ? `<p class="product-card-desc">${desc}</p>` : ''}
      ${price ? `<div class="product-card-price">${price}${priceSuffix ? `<span>${priceSuffix}</span>` : ''}</div>` : ''}
      <div class="product-card-actions actions"></div>
    `;
    if (ctaCell) {
      const actions = body.querySelector('.product-card-actions');
      [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    }
    card.append(body);
    grid.append(card);
  });

  inner.append(header, grid);
  wrap.append(inner);
  block.replaceChildren(wrap);
}
