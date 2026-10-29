// Saved catalog: also works when opened as a local HTML file.
    const fallbackProducts = [
        {
            id: "c11.jpg",
            name: "Noir Essence",
            image: "images/c11.jpg",
            price: "$250",
            type: "Sandals",
            color: "Black"
        },
        {
            id: "c12.jpeg",
            name: "Rouge Signature",
            image: "images/c12.jpeg",
            price: "$320",
            type: "Sandals",
            color: "Black / Gold"
        },
        {
            id: "c13.jpeg",
            name: "Pearl Grace",
            image: "images/c13.jpeg",
            price: "$280",
            type: "Sandals",
            color: "Black"
        },
        {
            id: "c14.jpeg",
            name: "Velvet Rise",
            image: "images/c14.jpeg",
            price: "$295",
            type: "Sandals",
            color: "Black / Red"
        },
        {
            id: "c15.jpeg",
            name: "Gilded Strap",
            image: "images/c15.jpeg",
            price: "$265",
            type: "Pumps",
            color: "Black / Gold"
        },
        {
            id: "c16.jpeg",
            name: "Crystal Arch",
            image: "images/c16.jpeg",
            price: "$340",
            type: "Pumps",
            color: "Pink"
        },
        {
            id: "c17.jpeg",
            name: "Midnight Ballet",
            image: "images/c17.jpeg",
            price: "$310",
            type: "Pumps",
            color: "Black / Gold"
        },
        {
            id: "c18.jpeg",
            name: "Shadowheart",
            image: "images/c18.jpeg",
            price: "$355",
            type: "Sandals",
            color: "Red"
        },
        {
            id: "c19.jpeg",
            name: "Glass Rose",
            image: "images/c19.jpeg",
            price: "$375",
            type: "Sandals",
            color: "Nude"
        },
        {
            id: "c120.jpeg",
            name: "Spikes Heels",
            image: "images/c120.jpeg",
            price: "$290",
            type: "Slingbacks",
            color: "Black"
        },
        {
            id: "121.jpeg",
            name: "Batbite Marys",
            image: "images/121.jpeg",
            price: "$270",
            type: "Sandals",
            color: "Black"
        },
        {
            id: "122.jpeg",
            name: "Crimson Rose",
            image: "images/122.jpeg",
            price: "$305",
            type: "Boots",
            color: "Black"
        }
    ];

    const categories = {
        "c11.jpg": ["Sandals", "Black"],
        "c12.jpeg": ["Sandals", "Black / Gold"],
        "c13.jpeg": ["Sandals", "Black"],
        "c14.jpeg": ["Sandals", "Black / Red"],
        "c15.jpeg": ["Pumps", "Black / Gold"],
        "c16.jpeg": ["Pumps", "Pink"],
        "c17.jpeg": ["Pumps", "Black / Gold"],
        "c18.jpeg": ["Sandals", "Red"],
        "c19.jpeg": ["Sandals", "Nude"],
        "c120.jpeg": ["Slingbacks", "Black"],
        "121.jpeg": ["Sandals", "Black"],
        "122.jpeg": ["Boots", "Black"]
    };

    const typeSelect = document.querySelector('#pair-type');
    const colorSelect = document.querySelector('#pair-color');
    const modelSelect = document.querySelector('#pair-model');
    const sizeSelect = document.querySelector('#pair-size');
    const preview = document.querySelector('#pair-image');
    const statusText = document.querySelector('#pair-status');
    const summary = document.querySelector('#pair-summary');
    const form = document.querySelector('#pair-form');

    let products = fallbackProducts;
    let sourceNote = '';

    function fillOptions(select, values, label) {
        select.replaceChildren(new Option(label, ''));

        values.forEach(value => {
            select.add(new Option(value, value));
        });
    }

    function clearSummary() {
        summary.hidden = true;
        summary.textContent = '';
    }

    function showPair() {
        clearSummary();

        const product = products.find(item => item.id === modelSelect.value);

        document.querySelector('#save-pair').disabled = !product;

        if (!product) {
            preview.hidden = true;
            preview.removeAttribute('src');

            document.querySelector('#pair-name').textContent = 'No matching models';
            document.querySelector('#pair-price').textContent = '';
            document.querySelector('#pair-details').textContent = '';

            statusText.textContent =
                'Try another style or color, or reset the filters.';

            return;
        }

        preview.hidden = false;
        preview.src = product.image;
        preview.alt = product.name;

        document.querySelector('#pair-name').textContent = product.name;
        document.querySelector('#pair-price').textContent = product.price;
        document.querySelector('#pair-details').textContent =
            product.type + ' · ' + product.color;

        statusText.textContent =
            product.name +
            (sizeSelect.value
                ? ' · Preferred size: EU ' + sizeSelect.value
                : ' · Choose your size.') +
            sourceNote;
    }

    function applyFilters() {
        const previous = modelSelect.value;

        const matches = products.filter(product =>
            (!typeSelect.value || product.type === typeSelect.value) &&
            (!colorSelect.value || product.color === colorSelect.value)
        );

        modelSelect.replaceChildren();

        matches.forEach(product => {
            modelSelect.add(new Option(product.name, product.id));
        });

        modelSelect.disabled = matches.length === 0;

        if (matches.some(product => product.id === previous)) {
            modelSelect.value = previous;
        }

        showPair();
    }

    function chooseProduct(id) {
        const product = products.find(item => item.id === id);

        if (!product) return;

        typeSelect.value = product.type;
        colorSelect.value = product.color;

        applyFilters();

        modelSelect.value = product.id;
        showPair();
    }

    function initializeCatalog() {
        const selected = modelSelect.value;

        fillOptions(
            typeSelect,
            [...new Set(products.map(product => product.type))],
            'All styles'
        );

        fillOptions(
            colorSelect,
            [...new Set(products.map(product => product.color))],
            'All colors'
        );

        applyFilters();

        const requested = new URLSearchParams(location.search).get('product');
        chooseProduct(requested || selected);
    }

    // Through Live Server or GitHub Pages, refresh models from Shop.
    async function refreshCatalog() {
        if (location.protocol === 'file:') {
            sourceNote =
                ' · Saved catalog preview; use Live Server for current Shop data.';

            showPair();
            return;
        }

        try {
            const response = await fetch('shop.html');

            if (!response.ok) {
                throw new Error('Shop unavailable');
            }

            const shop = new DOMParser().parseFromString(
                await response.text(),
                'text/html'
            );

            const current = [...shop.querySelectorAll('.product-card')]
                .map(card => {
                    const image = card.querySelector('img')?.getAttribute('src');
                    const name = card.querySelector('h3')?.textContent.trim();

                    if (!image || !name) return null;

                    const id = decodeURIComponent(image.split('/').pop());

                    const [type, color] =
                        categories[id] || ['Other', 'Not specified'];

                    return {
                        id,
                        name,
                        type,
                        color,
                        image: new URL(
                            image,
                            response.url || location.href
                        ).href,
                        price: card.querySelector('.price .now')
                            ?.textContent.trim() || ''
                    };
                })
                .filter(Boolean);

            if (!current.length) {
                throw new Error('Empty catalog');
            }

            products = current;
            initializeCatalog();

        } catch (error) {
            sourceNote =
                ' · Shop could not refresh; showing the saved catalog.';

            showPair();
        }
    }

    typeSelect.addEventListener('change', applyFilters);
    colorSelect.addEventListener('change', applyFilters);
    modelSelect.addEventListener('change', showPair);
    sizeSelect.addEventListener('change', showPair);

    form.addEventListener('input', clearSummary);

    form.addEventListener('submit', event => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const product = products.find(item => item.id === modelSelect.value);

        if (!product) return;

        const notes = document.querySelector('#pair-notes').value.trim();
        const occasion = document.querySelector('#occasion').checked;

        summary.textContent =
            product.name + ' · ' +
            product.color + ' · EU ' +
            sizeSelect.value + ' · ' +
            product.price +
            (occasion ? ' · Special occasion' : '') +
            (notes ? '. Notes: ' + notes : '') +
            '. Preview only; no order has been placed.';

        summary.hidden = false;
    });

    document.querySelector('#reset-pair').addEventListener('click', () => {
        form.reset();
        typeSelect.value = '';
        colorSelect.value = '';
        applyFilters();
    });

    document.querySelectorAll('[data-choose]').forEach(link => {
        link.addEventListener('click', () => {
            chooseProduct(link.dataset.choose);
        });
    });

    initializeCatalog();
    refreshCatalog();

const selectionSection = document.querySelector('#customize');
    const lookbookSection = document
        .querySelector('#soleaCarousel')
        ?.closest('section');

    if (selectionSection && lookbookSection) {
        lookbookSection.before(selectionSection);

        selectionSection.classList.remove('py-5', 'border-top');
        selectionSection.classList.add('pt-3', 'pb-5');
    }