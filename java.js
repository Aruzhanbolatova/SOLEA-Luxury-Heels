
document.addEventListener("DOMContentLoaded", function () {
    // ---- Product carousel ----
    document.querySelectorAll(".carousel-wrapper").forEach(function (wrapper) {
        var track = wrapper.querySelector(".carousel-track");
        var prevBtn = wrapper.querySelector(".carousel-btn.prev");
        var nextBtn = wrapper.querySelector(".carousel-btn.next");
        if (!track) return;

        function scrollByCard(direction) {
            var card = track.querySelector(".carousel-card");
            var amount = card ? card.offsetWidth + 25 : 260;
            track.scrollBy({ left: direction * amount, behavior: "smooth" });
        }

        if (prevBtn) prevBtn.addEventListener("click", function () { scrollByCard(-1); });
        if (nextBtn) nextBtn.addEventListener("click", function () { scrollByCard(1); });
    });

    // ---- FAQ accordion ----
    document.querySelectorAll(".faq-item").forEach(function (item) {
        var question = item.querySelector(".faq-question");
        if (!question) return;
        question.addEventListener("click", function () {
            var isOpen = item.classList.contains("open");
            item.parentElement.querySelectorAll(".faq-item").forEach(function (i) {
                i.classList.remove("open");
            });
            if (!isOpen) item.classList.add("open");
        });
    });

    // ---- Newsletter form (placeholder submit) ----
    var newsletterForm = document.querySelector(".newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Thanks for subscribing!");
            newsletterForm.reset();
        });
    }
});
// Shop: sort Bootstrap columns without breaking the card layout.
document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("product-grid");
    const select = document.getElementById("sort-select");
    const count = document.getElementById("product-count");

    // The same file is also loaded on Home.
    if (!grid || !select) return;

    const originalColumns = Array.from(grid.children);
    const buttons = document.querySelectorAll("[data-shop-sort]");

    function sortProducts(type) {
        const columns = [...originalColumns];

        columns.sort(function (columnA, columnB) {
            const a = columnA.querySelector(".product-card");
            const b = columnB.querySelector(".product-card");

            if (type === "price-asc") {
                return Number(a.dataset.price) - Number(b.dataset.price);
            }

            if (type === "price-desc") {
                return Number(b.dataset.price) - Number(a.dataset.price);
            }

            if (type === "name-asc") {
                return a.dataset.name.localeCompare(b.dataset.name);
            }

            if (type === "name-desc") {
                return b.dataset.name.localeCompare(a.dataset.name);
            }

            return 0;
        });

        grid.replaceChildren(...columns);
        select.value = type;

        buttons.forEach(function (button) {
            const active = button.dataset.shopSort === type;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    select.addEventListener("change", function () {
        sortProducts(select.value);
    });

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            sortProducts(button.dataset.shopSort);
        });
    });

    if (count) {
        count.textContent = originalColumns.length + " products";
    }
});