/**
 * hero — Airtel home dark hero with side image, headline, sub, CTAs.
 *
 * Authoring rows:
 *   1. Side image (picture)
 *   2. Eyebrow tag text (e.g. "India's First Ever")
 *   3. Headline — use <span> or line breaks for the red-coloured emphasis
 *   4. Sub paragraph
 *   5. CTAs — primary <strong><a>, secondary <em><a>
 */

function cellHTML(cell) { return cell ? cell.innerHTML : ''; }
function cellText(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const imgCell = rows[0]?.firstElementChild;
  const eyebrow = cellText(rows[1]?.firstElementChild);
  const headline = cellHTML(rows[2]?.firstElementChild);
  const sub = cellHTML(rows[3]?.firstElementChild);
  const ctaCell = rows[4]?.firstElementChild;

  const wrap = document.createElement('div');
  wrap.className = 'hero-wrap';

  wrap.innerHTML = `
    <div class="hero-bg" aria-hidden="true"></div>
    <svg class="hero-wave" viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <path d="M50 350 C50 200 150 80 250 120 C350 160 380 280 320 330 C280 360 200 365 140 340 C80 315 60 270 80 240 C100 210 150 200 190 215" stroke="#E40000" stroke-width="12" stroke-linecap="round" fill="none"></path>
      <path d="M80 330 C80 210 160 110 240 140 C320 170 340 270 290 315 C260 335 195 342 148 323" stroke="#E40000" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.5"></path>
    </svg>
    <div class="hero-image-panel" aria-hidden="true"></div>
    <div class="hero-inner">
      <div class="hero-content">
        ${eyebrow ? `<div class="hero-tag"><span class="hero-tag-dot" aria-hidden="true"></span>${eyebrow}</div>` : ''}
        <h1 class="hero-headline">${headline}</h1>
        ${sub ? `<div class="hero-sub">${sub}</div>` : ''}
        <div class="hero-ctas actions"></div>
      </div>
    </div>
  `;

  if (imgCell && imgCell.querySelector('img, picture')) {
    const panel = wrap.querySelector('.hero-image-panel');
    panel.append(imgCell.querySelector('img, picture').cloneNode(true));
  }

  if (ctaCell) {
    const actions = wrap.querySelector('.hero-ctas');
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
  }

  block.replaceChildren(wrap);
}
