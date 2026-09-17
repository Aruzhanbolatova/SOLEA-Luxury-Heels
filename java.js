// ============================================================
// HOME PAGE ONLY — carousel + FAQ accordion
// Loaded only by index.html, doesn't affect other pages.
// ============================================================

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