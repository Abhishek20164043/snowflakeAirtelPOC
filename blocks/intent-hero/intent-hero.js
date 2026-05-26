/**
 * intent-hero — Dark gradient hero with eyebrow, headline, sub, and 4 colored intent path cards.
 *
 * Authoring rows:
 *   1. Eyebrow
 *   2. Headline (HTML allowed)
 *   3. Sub paragraph
 *   4..N. Path card — cells: variant (home|mobile|bank|biz), icon, title, description, link-text, href
 */

function txt(c) { return c ? c.textContent.trim() : ''; }
function html(c) { return c ? c.innerHTML : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrow = txt(rows[0]?.firstElementChild);
  const headline = html(rows[1]?.firstElementChild);
  const sub = html(rows[2]?.firstElementChild);
  const pathRows = rows.slice(3);

  const wrap = document.createElement('div');
  wrap.className = 'intent-hero-wrap';
  wrap.innerHTML = `
    <div class="ih-inner">
      ${eyebrow ? `<p class="ih-eyebrow">${eyebrow}</p>` : ''}
      ${headline ? `<h1 class="ih-headline">${headline}</h1>` : ''}
      ${sub ? `<div class="ih-sub">${sub}</div>` : ''}
      <div class="ih-paths" role="navigation" aria-label="Intent paths"></div>
    </div>
  `;

  const paths = wrap.querySelector('.ih-paths');
  pathRows.forEach((row) => {
    const c = [...row.children];
    const variant = (txt(c[0]) || 'home').toLowerCase();
    const icon = txt(c[1]);
    const title = txt(c[2]);
    const desc = txt(c[3]);
    const linkText = txt(c[4]) || 'View →';
    const linkA = c[5]?.querySelector('a');
    const href = linkA ? linkA.getAttribute('href') : (txt(c[5]) || '#');

    const a = document.createElement('a');
    a.className = `intent-path ${variant}`;
    a.href = href;
    a.innerHTML = `
      <div class="intent-path-icon" aria-hidden="true">${icon}</div>
      <div class="intent-path-title">${title}</div>
      <p class="intent-path-desc">${desc}</p>
      <div class="intent-path-arrow">${linkText}</div>
    `;
    paths.append(a);
  });

  block.replaceChildren(wrap);
}
