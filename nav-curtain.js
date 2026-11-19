document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('main-header');
  if (!header) return;
  const toggle = header.querySelector('.menu-toggle');
  const menu = header.querySelector('#page-navigation');
  if (!toggle || !menu) return;

  if (!header.querySelector('.solea-header-actions')) {
    const actions = document.createElement('nav');
    actions.className = 'solea-header-actions';
    actions.setAttribute('aria-label', 'Quick links');
    actions.innerHTML = `
      <a href="shop.html#collection-query" aria-label="Search the collection" title="Search">
        <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="13.5" cy="13.5" r="9.5"></circle><path d="m21 21 8 8"></path></svg>
      </a>
      <a href="index.html?club=sign-in" aria-label="Account" title="Account">
        <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="9" r="6"></circle><path d="M4.5 28v-3.2A9.5 9.5 0 0 1 14 15.3h4a9.5 9.5 0 0 1 9.5 9.5V28z"></path></svg>
      </a>
      <a href="shop.html#product-grid" aria-label="Shopping bag and collection" title="Shopping bag">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 10h22l2 19H3z"></path><path d="M11 12V8a5 5 0 0 1 10 0v4"></path></svg>
      </a>`;
    header.insertBefore(actions, toggle);
  }

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    if (open) menu.removeAttribute('inert');
    else menu.setAttribute('inert', '');
  }

  setOpen(false);
  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  });
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('click', function (event) {
    if (!header.contains(event.target)) setOpen(false);
  });
});
