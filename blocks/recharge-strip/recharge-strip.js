/**
 * recharge-strip — Dark "Quick Recharge" strip with tabs + input + CTA.
 *
 * Authoring rows:
 *   1. Heading
 *   2. Sub paragraph
 *   3. Tabs — pipe-delimited or one per cell; first tab is active
 *   4. Input placeholder text
 *   5. CTA button label
 */

function txt(c) { return c ? c.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  const heading = txt(rows[0]?.firstElementChild);
  const sub = txt(rows[1]?.firstElementChild);
  const tabsCell = rows[2]?.firstElementChild;
  const placeholder = txt(rows[3]?.firstElementChild) || 'Enter mobile number';
  const ctaLabel = txt(rows[4]?.firstElementChild) || 'PROCEED';

  const tabs = tabsCell
    ? [...tabsCell.children].filter((n) => n.tagName).map((n) => n.textContent.trim()).filter(Boolean)
      .concat(tabsCell.children.length ? [] : txt(tabsCell).split('|').map((s) => s.trim()).filter(Boolean))
    : [];
  const finalTabs = tabs.length ? tabs : txt(tabsCell).split('|').map((s) => s.trim()).filter(Boolean);

  const wrap = document.createElement('div');
  wrap.className = 'recharge-strip-wrap';

  wrap.innerHTML = `
    <div class="recharge-inner">
      <div class="recharge-text">
        ${heading ? `<h2>${heading}</h2>` : ''}
        ${sub ? `<p>${sub}</p>` : ''}
      </div>
      <div class="recharge-form">
        <div class="recharge-tabs" role="tablist">
          ${finalTabs.map((t, i) => `<div class="recharge-tab${i === 0 ? ' active' : ''}" role="tab">${t}</div>`).join('')}
        </div>
        <div class="recharge-form-row">
          <input class="recharge-input" type="tel" placeholder="${placeholder}" aria-label="${placeholder}">
          <button class="recharge-submit" type="button">${ctaLabel}</button>
        </div>
      </div>
    </div>
  `;

  block.replaceChildren(wrap);
}
