/**
 * path-mobile — "Mobile plans" path. Filter sidebar + 6 plan cards grid.
 *
 * Authoring rows:
 *   1. Header — cells: eyebrow, headline (HTML), sub, cta link
 *   2. Filter — cells: title, group1-label, group1-options (one per line, prefix * for active),
 *                       group2-label, group2-options, group3-label, group3-options
 *   3. Existing-customer card — cells: title, sub, placeholder, cta label
 *   4..N. Plan — cells: variant (popular|blank), badge, validity, data, data-suffix,
 *                       features (one per line), price, price-suffix, cta-label
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
function chips(c) {
  return lines(c).map((l) => {
    const active = l.startsWith('*');
    return { label: l.replace(/^\*\s*/, ''), active };
  });
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const head = [...rows[0].children];
  const eyebrow = txt(head[0]);
  const headline = html(head[1]);
  const sub = txt(head[2]);
  const headCta = head[3];

  const f = [...(rows[1]?.children || [])];
  const filterTitle = txt(f[0]) || 'Filter by your needs';
  const g1L = txt(f[1]);
  const g1O = chips(f[2]);
  const g2L = txt(f[3]);
  const g2O = chips(f[4]);
  const g3L = txt(f[5]);
  const g3O = chips(f[6]);

  const ec = [...(rows[2]?.children || [])];
  const ecTitle = txt(ec[0]);
  const ecSub = txt(ec[1]);
  const ecPlaceholder = txt(ec[2]) || 'Enter mobile number';
  const ecCta = txt(ec[3]) || 'RECHARGE NOW';

  const wrap = document.createElement('div');
  wrap.className = 'path-mobile-wrap';
  wrap.innerHTML = `
    <div class="pm-inner">
      <div class="pm-header">
        <div>
          <div class="pm-eyebrow"><span class="pm-dot" aria-hidden="true"></span>${eyebrow}</div>
          <h2 class="pm-title">${headline}</h2>
          <p class="pm-sub">${sub}</p>
        </div>
        <div class="pm-header-right actions"></div>
      </div>
      <div class="pm-layout">
        <div class="pm-sidebar">
          <div class="pm-sidebar-prompt">
            <div class="pm-sidebar-title">${filterTitle}</div>
            <div class="pm-filter-group">
              <div class="pm-filter-label">${g1L}</div>
              <div class="pm-chips">${g1O.map((o) => `<div class="pm-chip${o.active ? ' active' : ''}">${o.label}</div>`).join('')}</div>
            </div>
            <div class="pm-filter-group">
              <div class="pm-filter-label">${g2L}</div>
              <div class="pm-chips">${g2O.map((o) => `<div class="pm-chip${o.active ? ' active' : ''}">${o.label}</div>`).join('')}</div>
            </div>
            <div class="pm-filter-group">
              <div class="pm-filter-label">${g3L}</div>
              <div class="pm-chips">${g3O.map((o) => `<div class="pm-chip${o.active ? ' active' : ''}">${o.label}</div>`).join('')}</div>
            </div>
          </div>
          <div class="pm-existing">
            <div class="pm-existing-title">${ecTitle}</div>
            <p class="pm-existing-sub">${ecSub}</p>
            <input class="pm-existing-input" type="tel" placeholder="${ecPlaceholder}" aria-label="${ecPlaceholder}">
            <button class="pm-existing-cta" type="button">${ecCta}</button>
          </div>
        </div>
        <div class="pm-plans"></div>
      </div>
    </div>
  `;

  if (headCta) {
    const a = wrap.querySelector('.pm-header-right');
    [...headCta.childNodes].forEach((n) => a.append(n.cloneNode(true)));
  }

  const planRows = rows.slice(3);
  const grid = wrap.querySelector('.pm-plans');
  planRows.forEach((row) => {
    const c = [...row.children];
    const variant = txt(c[0]).toLowerCase();
    const badge = txt(c[1]);
    const validity = txt(c[2]);
    const data = txt(c[3]);
    const dataSuffix = txt(c[4]);
    const features = lines(c[5]);
    const price = txt(c[6]);
    const suffix = txt(c[7]) || '/mo';
    const ctaLabel = txt(c[8]) || 'RECHARGE';
    const card = document.createElement('div');
    card.className = `pm-plan-card${variant === 'popular' ? ' popular' : ''}`;
    card.innerHTML = `
      ${variant === 'popular' && badge ? `<div class="pm-plan-badge">${badge}</div>` : ''}
      <div class="pm-plan-validity">${validity}</div>
      <div class="pm-plan-data">${data}${dataSuffix ? `<span> ${dataSuffix}</span>` : ''}</div>
      <ul class="pm-plan-features">${features.map((f) => `<li>${f}</li>`).join('')}</ul>
      <div class="pm-plan-price">${price}<sub>${suffix}</sub></div>
      <a class="pm-plan-cta" href="#">${ctaLabel}</a>
    `;
    grid.append(card);
  });

  block.replaceChildren(wrap);
}
