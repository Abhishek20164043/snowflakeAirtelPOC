/**
 * path-bank — "Pay & Bank" path. Image card + 6 quick-action cards.
 *
 * Authoring rows:
 *   1. Header — cells: eyebrow, headline (HTML), sub, cta link
 *   2. Image card — cells: image, tag, title, description, cta-text
 *   3..N. Quick action — cells: icon, title, sub
 */

function txt(c) { return c ? c.textContent.trim() : ''; }
function html(c) { return c ? c.innerHTML : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const head = [...rows[0].children];
  const eyebrow = txt(head[0]);
  const headline = html(head[1]);
  const sub = txt(head[2]);
  const headCta = head[3];

  const card = [...(rows[1]?.children || [])];
  const img = card[0]?.querySelector('img, picture');
  const tag = txt(card[1]);
  const title = txt(card[2]);
  const desc = txt(card[3]);
  const ctaText = txt(card[4]) || 'OPEN FREE ACCOUNT →';

  const wrap = document.createElement('div');
  wrap.className = 'path-bank-wrap';
  wrap.innerHTML = `
    <div class="pb-inner">
      <div class="pb-header">
        <div>
          <div class="pb-eyebrow"><span class="pb-dot" aria-hidden="true"></span>${eyebrow}</div>
          <h2 class="pb-title">${headline}</h2>
          <p class="pb-sub">${sub}</p>
        </div>
        <div class="pb-header-right actions"></div>
      </div>
      <div class="pb-layout">
        <div class="pb-card">
          <div class="pb-card-img-wrap"></div>
          <div class="pb-card-overlay">
            ${tag ? `<div class="pb-card-tag">${tag}</div>` : ''}
            <div class="pb-card-title">${title}</div>
            <p class="pb-card-desc">${desc}</p>
            <span class="pb-card-cta">${ctaText}</span>
          </div>
        </div>
        <div class="pb-quick"></div>
      </div>
    </div>
  `;

  if (img) wrap.querySelector('.pb-card-img-wrap').append(img.cloneNode(true));
  if (headCta) {
    const a = wrap.querySelector('.pb-header-right');
    [...headCta.childNodes].forEach((n) => a.append(n.cloneNode(true)));
  }

  const qa = wrap.querySelector('.pb-quick');
  rows.slice(2).forEach((row) => {
    const c = [...row.children];
    const icon = txt(c[0]);
    const aTitle = txt(c[1]);
    const aSub = txt(c[2]);
    const el = document.createElement('div');
    el.className = 'pb-quick-card';
    el.innerHTML = `
      <div class="pb-quick-icon" aria-hidden="true">${icon}</div>
      <div>
        <div class="pb-quick-title">${aTitle}</div>
        <div class="pb-quick-sub">${aSub}</div>
      </div>
    `;
    qa.append(el);
  });

  block.replaceChildren(wrap);
}
