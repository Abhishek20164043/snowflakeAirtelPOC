/**
 * floating-recharge — Sticky utility bar with quick recharge tabs + input + CTA + help.
 *
 * Authoring rows:
 *   1. Label (e.g. "Quick Recharge")
 *   2. Tabs — one per cell (first is active) OR pipe-delimited single cell
 *   3. Input placeholder
 *   4. CTA label
 *   5. Help line (HTML allowed for inline link)
 */

function txt(c) { return c ? c.textContent.trim() : ''; }
function html(c) { return c ? c.innerHTML : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  const label = txt(rows[0]?.firstElementChild) || 'Quick Recharge';
  const tabsCell = rows[1]?.firstElementChild;
  const placeholder = txt(rows[2]?.firstElementChild) || 'Enter number';
  const ctaLabel = txt(rows[3]?.firstElementChild) || 'PROCEED';
  const help = html(rows[4]?.firstElementChild);

  let tabs = tabsCell && tabsCell.children.length
    ? [...tabsCell.children].map((n) => n.textContent.trim()).filter(Boolean)
    : (tabsCell ? txt(tabsCell).split('|').map((s) => s.trim()).filter(Boolean) : []);

  if (!tabs.length) tabs = ['Mobile', 'DTH', 'Broadband', 'Postpaid'];

  const wrap = document.createElement('div');
  wrap.className = 'floating-recharge-wrap';
  wrap.innerHTML = `
    <div class="fr-inner">
      <span class="fr-label">${label}</span>
      <div class="fr-tabs" role="tablist">
        ${tabs.map((t, i) => `<div class="fr-tab${i === 0 ? ' active' : ''}" role="tab">${t}</div>`).join('')}
      </div>
      <div class="fr-input-row">
        <input class="fr-input" type="tel" placeholder="${placeholder}" aria-label="${placeholder}">
        <button class="fr-submit" type="button">${ctaLabel}</button>
      </div>
      <span class="fr-spacer" aria-hidden="true"></span>
      ${help ? `<span class="fr-help">${help}</span>` : ''}
    </div>
  `;

  block.replaceChildren(wrap);
}
