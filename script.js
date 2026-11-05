$(document).ready(function () {
  console.log("jQuery is ready!");

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
  }
});
