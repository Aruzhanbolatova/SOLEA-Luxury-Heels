$(document).ready(function () {
  console.log("jQuery is ready!");

  // Responsive navigation shared by Aruzhan's Brands and Design pages.
  const menuButton = document.querySelector('.a3-page .menu-toggle');
  const pageNavigation = document.querySelector('.a3-page #page-navigation');
  if (menuButton && pageNavigation) {
    function closePageNavigation() {
      menuButton.setAttribute('aria-expanded', 'false');
      pageNavigation.classList.remove('is-open');
    }

    menuButton.addEventListener('click', function () {
      const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(isOpen));
      pageNavigation.classList.toggle('is-open', isOpen);
    });

    pageNavigation.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closePageNavigation();
        menuButton.focus();
      }
    });

    pageNavigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closePageNavigation);
    });
  }

  // Assignment 6: show how far the visitor has scrolled on Brands and Design.
  if ($('body').hasClass('a3-page')) {
    const $progress = $('<div class="a3-scroll-progress" role="progressbar" aria-label="Page scroll progress" aria-valuemin="0" aria-valuemax="100"><span></span></div>')
      .appendTo('body');

    function updateScrollProgress() {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = pageHeight > 0
        ? Math.min(100, Math.max(0, window.scrollY / pageHeight * 100))
        : 100;
      $progress.attr('aria-valuenow', Math.round(percent))
        .children('span')
        .css('width', percent + '%');
    }

    $(window).on('scroll resize load', updateScrollProgress);
    if (window.ResizeObserver) new ResizeObserver(updateScrollProgress).observe(document.body);
    updateScrollProgress();
  }

  // Brands: confirm a rating and discard any earlier notification timer.
  $(document).on('click', '.brand-rating-star', function () {
    const card = $(this).closest('.brand-card');
    const message = card.find('.card-title').text().trim() + ' · ' + card.find('.brand-rating-status').text();
    $('#rating-toast').stop(true, true).text(message).fadeIn(120).delay(2200).fadeOut(220);
  });

  // Brands: move the URL into src as each designer image enters the viewport.
  const photos = $('.brand-photo[data-src]');
  if (photos.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const image = $(entry.target);
        image.attr('src', image.attr('data-src')).removeAttr('data-src');
        observer.unobserve(entry.target);
      });
    });
    photos.each(function () { observer.observe(this); });
  } else {
    photos.each(function () {
      const image = $(this);
      image.attr('src', image.attr('data-src')).removeAttr('data-src');
    });
  }
});
