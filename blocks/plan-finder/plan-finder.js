/**
 * plan-finder — Two-column Wi-Fi plan configurator.
 *   Left: section header + 2 step option groups
 *   Right: result panel with 3 recommended plans + CTA
 *
 * Authoring rows:
 *   1. Header — cells: label, headline (HTML allowed), subhead
 *   2. Step1 — cells: step-label, title, options (one per line, prefix "* " for selected, optional emoji prefix)
 *   3. Step2 — same shape
 *   4. Result header — cells: title, badge text
 *   5..N. Plan — cells: variant ("top-pick" or blank), icon, name, speed, price, price-suffix
 *   Last row: CTA — wrap link in <em><strong><a> for accent
 */

function txt(c) { return c ? c.textContent.trim() : ''; }
function html(c) { return c ? c.innerHTML : ''; }

function parseOptions(cell) {
  if (!cell) return [];
  const lines = (cell.innerHTML || '')
    .split(/<br\s*\/?>|\n/i)
    .map((s) => s.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);
  return lines.map((line) => {
    const selected = line.startsWith('*');
    const clean = line.replace(/^\*\s*/, '');
    const m = clean.match(/^(\p{Emoji}|\S+?)\s+(.*)$/u);
    const icon = m ? m[1] : '';
    const label = m ? m[2] : clean;
    return { icon, label, selected };
  });
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const head = [...rows[0].children];
  const label = txt(head[0]);
  const headline = html(head[1]);
  const subhead = txt(head[2]);

  const step1 = [...(rows[1]?.children || [])];
  const step1Label = txt(step1[0]);
  const step1Title = txt(step1[1]);
  const step1Opts = parseOptions(step1[2]);

  const step2 = [...(rows[2]?.children || [])];
  const step2Label = txt(step2[0]);
  const step2Title = txt(step2[1]);
  const step2Opts = parseOptions(step2[2]);

  const resHead = [...(rows[3]?.children || [])];
  const resTitle = txt(resHead[0]) || 'Recommended plans';
  const resBadge = txt(resHead[1]) || '';

  const planRows = rows.slice(4, -1);
  const lastRow = rows[rows.length - 1];
  const ctaCell = lastRow?.firstElementChild;

  const wrap = document.createElement('div');
  wrap.className = 'plan-finder-wrap';

  wrap.innerHTML = `
    <div class="pf-inner">
      <div class="pf-layout">
        <div class="pf-left">
          ${label ? `<p class="pf-label">${label}</p>` : ''}
          ${headline ? `<h2 class="pf-heading">${headline}</h2>` : ''}
          ${subhead ? `<p class="pf-subhead">${subhead}</p>` : ''}
          <div class="pf-steps">
            <div class="pf-step">
              <div class="pf-step-label">${step1Label}</div>
              <div class="pf-step-title">${step1Title}</div>
              <div class="pf-options">
                ${step1Opts.map((o) => `<div class="pf-option${o.selected ? ' selected' : ''}">${o.icon ? `<span class="pf-option-icon" aria-hidden="true">${o.icon}</span>` : ''}${o.label}</div>`).join('')}
              </div>
            </div>
            <div class="pf-step">
              <div class="pf-step-label">${step2Label}</div>
              <div class="pf-step-title">${step2Title}</div>
              <div class="pf-options">
                ${step2Opts.map((o) => `<div class="pf-option${o.selected ? ' selected' : ''}">${o.icon ? `<span class="pf-option-icon" aria-hidden="true">${o.icon}</span>` : ''}${o.label}</div>`).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="pf-right">
          <div class="pf-result">
            <div class="pf-result-head">
              <h3>${resTitle}</h3>
              ${resBadge ? `<span class="pf-result-badge">${resBadge}</span>` : ''}
            </div>
            <div class="pf-plans"></div>
            <div class="pf-result-cta actions"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const plansEl = wrap.querySelector('.pf-plans');
  planRows.forEach((row) => {
    const c = [...row.children];
    const variant = txt(c[0]).toLowerCase();
    const icon = txt(c[1]);
    const name = txt(c[2]);
    const speed = txt(c[3]);
    const price = txt(c[4]);
    const suffix = txt(c[5]) || '/mo';
    const plan = document.createElement('div');
    plan.className = `pf-plan${variant === 'top-pick' ? ' top-pick' : ''}`;
    plan.innerHTML = `
      <div class="pf-plan-icon" aria-hidden="true">${icon}</div>
      <div class="pf-plan-info">
        <div class="pf-plan-name">${name}</div>
        <div class="pf-plan-speed">${speed}</div>
      </div>
      <div class="pf-plan-price">${price}<sub>${suffix}</sub></div>
    `;
    plansEl.append(plan);
  });

  if (ctaCell) {
    const actions = wrap.querySelector('.pf-result-cta');
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
  }

  block.replaceChildren(wrap);
}
