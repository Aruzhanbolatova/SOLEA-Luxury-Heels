const brandCards = [
        ...document.querySelectorAll('[data-brand-category]')
    ];

    const filterButtons = [
        ...document.querySelectorAll('[data-filter]')
    ];

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            brandCards.forEach(card => {
                card.hidden =
                    filter !== 'all' &&
                    card.dataset.brandCategory !== filter;
            });

            filterButtons.forEach(item => {
                const active = item === button;
                item.classList.toggle('active', active);
                item.setAttribute('aria-pressed', String(active));
            });

            const visibleCount = brandCards.filter(card => !card.hidden).length;

            document.querySelector('#brand-count').textContent =
                visibleCount + ' designers';
        });
    });