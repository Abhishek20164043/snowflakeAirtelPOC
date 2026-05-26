/**
 * path-business — "For Business" path. Stat stack + 2×2 solution cards.
 *
 * Authoring rows:
 *   1. Header — cells: eyebrow, headline (HTML), sub, cta link
 *   2..4. Stat — cells: icon, number, label  (label cell empty signals end of stats)
 *   Then solution rows — cells: icon, title, description, link-text
 *
 * The block uses the heuristic: rows with exactly 3 cells starting at row 2 are stats
 * until we hit a row with 4 cells (solution).
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

  const stats = [];
  const solutions = [];
  for (let i = 1; i < rows.length; i += 1) {
    const c = [...rows[i].children];
    if (c.length <= 3) stats.push(c);
    else solutions.push(c);
  }

  const wrap = document.createElement('div');
  wrap.className = 'path-business-wrap';
  wrap.innerHTML = `
    <div class="pbiz-inner">
      <div class="pbiz-header">
        <div>
          <div class="pbiz-eyebrow"><span class="pbiz-dot" aria-hidden="true"></span>${eyebrow}</div>
          <h2 class="pbiz-title">${headline}</h2>
          <p class="pbiz-sub">${sub}</p>
        </div>
        <div class="pbiz-header-right actions"></div>
      </div>
      <div class="pbiz-layout">
        <div class="pbiz-stats"></div>
        <div class="pbiz-solutions"></div>
      </div>
    </div>
  `;

  if (headCta) {
    const a = wrap.querySelector('.pbiz-header-right');
    [...headCta.childNodes].forEach((n) => a.append(n.cloneNode(true)));
  }

  const statEl = wrap.querySelector('.pbiz-stats');
  stats.forEach((c) => {
    const el = document.createElement('div');
    el.className = 'pbiz-stat';
    el.innerHTML = `
      <div class="pbiz-stat-icon" aria-hidden="true">${txt(c[0])}</div>
      <div>
        <div class="pbiz-stat-num">${txt(c[1])}</div>
        <div class="pbiz-stat-label">${txt(c[2])}</div>
      </div>
    `;
    statEl.append(el);
  });

  const solEl = wrap.querySelector('.pbiz-solutions');
  solutions.forEach((c) => {
    const el = document.createElement('div');
    el.className = 'pbiz-sol';
    el.innerHTML = `
      <div class="pbiz-sol-icon" aria-hidden="true">${txt(c[0])}</div>
      <div class="pbiz-sol-title">${txt(c[1])}</div>
      <p class="pbiz-sol-desc">${txt(c[2])}</p>
      <span class="pbiz-sol-link">${txt(c[3])}</span>
    `;
    solEl.append(el);
  });

  block.replaceChildren(wrap);
}
