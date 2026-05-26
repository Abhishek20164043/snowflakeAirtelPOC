/**
 * path-home — "Connect at home" path section. Hero plan card + 3 mini plan cards.
 *
 * Authoring rows:
 *   1. Header — cells: eyebrow, headline (HTML allowed for <em>), sub, cta link
 *   2. Hero card — cells: image, tag, title (HTML), description, price, price-suffix,
 *                  note, ctas (primary <strong><a>, secondary <em><a>)
 *   3..5. Mini plan card — cells: variant (recommended|blank), badge-text, speed,
 *                          title, features (one per line), price, price-suffix, cta href
 */

function txt(c) { return c ? c.textContent.trim() : ''; }
function html(c) { return c ? c.innerHTML : ''; }
function lines(c) {
  if (!c) return [];
  return (c.innerHTML || '')
    .split(/<br\s*\/?>|\n/i)
    .map((s) => s.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const head = [...rows[0].children];
  const eyebrow = txt(head[0]);
  const headline = html(head[1]);
  const sub = txt(head[2]);
  const headCta = head[3];

  const hero = [...(rows[1]?.children || [])];
  const heroImg = hero[0]?.querySelector('img, picture');
  const heroTag = txt(hero[1]);
  const heroTitle = html(hero[2]);
  const heroDesc = txt(hero[3]);
  const heroPrice = txt(hero[4]);
  const heroSuffix = txt(hero[5]);
  const heroNote = txt(hero[6]);
  const heroCtas = hero[7];

  const wrap = document.createElement('div');
  wrap.className = 'path-home-wrap';
  wrap.innerHTML = `
    <div class="ph-inner">
      <div class="ph-header">
        <div class="ph-header-left">
          <div class="ph-eyebrow">
            <span class="ph-dot" aria-hidden="true"></span>${eyebrow}
          </div>
          <h2 class="ph-title">${headline}</h2>
          <p class="ph-sub">${sub}</p>
        </div>
        <div class="ph-header-right actions"></div>
      </div>
      <div class="ph-layout">
        <div class="ph-main-card">
          <div class="ph-main-card-img-wrap"></div>
          <div class="ph-main-card-body">
            <div>
              ${heroTag ? `<div class="ph-main-card-tag">${heroTag}</div>` : ''}
              <div class="ph-main-card-title">${heroTitle}</div>
              <p class="ph-main-card-desc">${heroDesc}</p>
            </div>
            <div>
              <div class="ph-main-card-price">${heroPrice}<sub>${heroSuffix}</sub></div>
              <div class="ph-main-card-note">${heroNote}</div>
              <div class="ph-main-card-actions actions"></div>
            </div>
          </div>
        </div>
        <div class="ph-plan-cards"></div>
      </div>
    </div>
  `;

  if (heroImg) wrap.querySelector('.ph-main-card-img-wrap').append(heroImg.cloneNode(true));
  if (headCta) {
    const a = wrap.querySelector('.ph-header-right');
    [...headCta.childNodes].forEach((n) => a.append(n.cloneNode(true)));
  }
  if (heroCtas) {
    const a = wrap.querySelector('.ph-main-card-actions');
    [...heroCtas.childNodes].forEach((n) => a.append(n.cloneNode(true)));
  }

  const planRows = rows.slice(2);
  const grid = wrap.querySelector('.ph-plan-cards');
  planRows.forEach((row) => {
    const c = [...row.children];
    const variant = txt(c[0]).toLowerCase();
    const badge = txt(c[1]);
    const speed = txt(c[2]);
    const title = txt(c[3]);
    const features = lines(c[4]);
    const price = txt(c[5]);
    const suffix = txt(c[6]) || '/mo';
    const ctaHref = (c[7]?.querySelector('a') || {}).href || txt(c[7]) || '#';
    const card = document.createElement('div');
    card.className = `ph-plan-card${variant === 'recommended' ? ' recommended' : ''}`;
    card.innerHTML = `
      ${variant === 'recommended' && badge ? `<div class="ph-plan-badge">${badge}</div>` : ''}
      <div class="ph-plan-speed">${speed}</div>
      <div class="ph-plan-title">${title}</div>
      <ul class="ph-plan-features">${features.map((f) => `<li>${f}</li>`).join('')}</ul>
      <div class="ph-plan-price">${price}<sub>${suffix}</sub></div>
      <a class="ph-plan-cta" href="${ctaHref}">GET STARTED</a>
    `;
    grid.append(card);
  });

  block.replaceChildren(wrap);
}
