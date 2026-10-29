// Aruzhan Bolatova | Assignment 5: independent ratings for each designer.
(function () {
  document.querySelectorAll('.brand-card').forEach(function (card) {
    const body = card.querySelector('.card-body');
    const name = card.querySelector('.card-title').textContent.trim();
    const section = document.createElement('div');
    section.className = 'brand-rating';
    const group = document.createElement('div');
    group.className = 'brand-rating-stars';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Rate ' + name);
    const status = document.createElement('p');
    status.className = 'brand-rating-status';
    status.setAttribute('role', 'status');
    status.textContent = 'Your rating: not selected';
    const buttons = [];
    const rating = {
      value: 0,
      set: function (value) {
        this.value = value;
        buttons.forEach(function (button, index) {
          const filled = index < value;
          button.textContent = filled ? '★' : '☆';
          button.classList.toggle('is-filled', filled);
          button.setAttribute('aria-pressed', String(index + 1 === value));
        });
        status.textContent = 'Your rating: ' + value + '/5';
      }
    };
    for (let score = 1; score <= 5; score++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'brand-rating-star';
      button.textContent = '☆';
      button.setAttribute('aria-label', 'Rate ' + name + ' ' + score + ' out of 5');
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', function () { rating.set(score); });
      buttons.push(button);
      group.append(button);
    }
    const note = document.createElement('small');
    note.textContent = 'Personal preview · resets on reload';
    section.append(group, status, note);
    body.insertBefore(section, body.querySelector('a'));
  });
})();
