// Aruzhan Bolatova: Assignment 5 thumbnail gallery.
(function () {
  const image = document.getElementById('inspirationImage');
  const caption = document.getElementById('inspirationCaption');
  const thumbnails = document.getElementById('inspirationThumbnails');
  if (!image || !caption || !thumbnails) return;

  // Reuse actual images and names from the existing lookbook.
  const photos = Array.from(document.querySelectorAll('#soleaCarousel .carousel-item img'))
    .map(function (photo) { return { src: photo.getAttribute('src'), name: photo.alt }; });
  const gallery = {
    selected: 0,
    select: function (index) {
      this.selected = index;
      image.src = photos[index].src;
      image.alt = photos[index].name;
      caption.textContent = photos[index].name;
      thumbnails.querySelectorAll('button').forEach(function (button, i) {
        button.setAttribute('aria-pressed', String(i === index));
      });
      image.classList.remove('a5-reveal');
      void image.offsetWidth;
      image.classList.add('a5-reveal');
    }
  };
  for (let i = 0; i < photos.length; i++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'a5-thumbnail';
    button.setAttribute('aria-label', 'Show ' + photos[i].name);
    const thumbnail = document.createElement('img');
    thumbnail.src = photos[i].src;
    thumbnail.alt = '';
    thumbnail.loading = 'lazy';
    button.append(thumbnail);
    button.addEventListener('click', function () { gallery.select(i); });
    thumbnails.append(button);
  }
  if (photos.length) gallery.select(0);
})();
