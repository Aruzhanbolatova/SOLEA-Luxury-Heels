document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('main-header');
  if (!header) return;
  const toggle = header.querySelector('.menu-toggle');
  const menu = header.querySelector('#page-navigation');
  if (!toggle || !menu) return;

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
