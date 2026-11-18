(() => {
    const currency = document.getElementById('shop-currency');
    const status = document.getElementById('shop-rate-status');
    const priceLabels = Array.from(
        document.querySelectorAll('#product-grid .price :is(.now, .was), #price-filter option'),
        element => ({ element, usd: element.textContent })
    );
    const tenge = new Intl.NumberFormat(['kk-KZ', 'ru-KZ'], {
        maximumFractionDigits: 0
    });
    const rateNumber = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 4 });
    const rateDate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' });
    const rateUrl = 'https://api.frankfurter.dev/v2/rate/USD/KZT';
    let rateRequest;

    async function fetchRate() {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch(rateUrl, { signal: controller.signal });
            if (!response.ok) throw new Error('Exchange rate request failed.');

            const quote = await response.json();
            if (quote.base !== 'USD' || quote.quote !== 'KZT'
                || !Number.isFinite(quote.rate) || quote.rate <= 0
                || !/^\d{4}-\d{2}-\d{2}$/.test(quote.date) || !Number.isFinite(Date.parse(quote.date))) {
                throw new Error('Invalid exchange rate response.');
            }

            return quote;
        } finally {
            clearTimeout(timeout);
        }
    }

    function getRate() {
        rateRequest ??= fetchRate().catch(error => {
            rateRequest = undefined;
            throw error;
        });
        return rateRequest;
    }

    function showPrices(rate) {
        for (const { element, usd } of priceLabels) {
            element.textContent = rate === null
                ? usd
                : usd.replace(/\$(\d[\d,]*(?:\.\d+)?)/g, (_, amount) =>
                    tenge.format(Number(amount.replaceAll(',', '')) * rate) + '\u00a0₸');
        }
    }

    async function updateCurrency() {
        if (currency.value === 'USD') {
            showPrices(null);
            status.textContent = '';
            return;
        }

        status.textContent = 'Loading the USD to KZT rate…';

        try {
            const quote = await getRate();
            if (currency.value !== 'KZT') return;

            showPrices(quote.rate);
            const source = document.createElement('a');
            source.href = 'https://frankfurter.dev/';
            source.textContent = 'Frankfurter';
            const date = rateDate.format(new Date(quote.date));
            status.replaceChildren(`Approximate prices · 1 USD ≈ ${rateNumber.format(quote.rate)} ₸ · ${date} · `, source);
        } catch {
            if (currency.value !== 'KZT') return;

            currency.value = 'USD';
            showPrices(null);
            status.textContent = 'The exchange rate is unavailable. Prices are shown in USD. Select KZT to try again.';
        }
    }

    currency.addEventListener('change', updateCurrency);
    updateCurrency();
})();
