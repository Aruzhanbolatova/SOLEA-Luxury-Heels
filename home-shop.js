document.addEventListener("DOMContentLoaded", function () {
    // TASK 2: FAQ accordion on Home
    document.querySelectorAll(".home-page .faq-item").forEach(function (item, index) {
        const oldQuestion = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        // Replace the existing div with a keyboard-accessible button.
        const button = document.createElement("button");
        button.type = "button";
        button.className = "faq-question";
        button.innerHTML = oldQuestion.innerHTML;
        oldQuestion.replaceWith(button);

        answer.id = "faq-answer-" + index;
        answer.inert = true;

        item.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", answer.id);

        button.addEventListener("click", function () {
            const isOpen = button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", String(!isOpen));
            item.classList.toggle("open", !isOpen);
            answer.inert = isOpen;

            answer.style.maxHeight = isOpen
                ? "0px"
                : answer.scrollHeight + "px";
        });
    });

    // Recalculate expanded answers when the screen size changes.
    window.addEventListener("resize", function () {
        document.querySelectorAll(".home-page .faq-item.open .faq-answer")
            .forEach(function (answer) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            });
    });

    // TASK 3: Popup form on Home
    const dialog = document.getElementById("subscription-dialog");

    if (dialog) {
        const openButton = document.getElementById("open-subscription");
        const closeButton = document.getElementById("close-subscription");

        openButton.addEventListener("click", function () {
            dialog.showModal();
        });

        closeButton.addEventListener("click", function () {
            dialog.close();
        });

        // Close when clicking outside the popup.
        dialog.addEventListener("click", function (event) {
            const rect = dialog.getBoundingClientRect();

            const outside =
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom;

            if (event.target === dialog && outside) {
                dialog.close();
            }
        });

        // Escape is supported automatically by the dialog element.
        dialog.addEventListener("close", function () {
            openButton.focus();
        });

        // TASK 1: Form validation
        const form = document.getElementById("subscription-form");
        const result = document.getElementById("subscription-result");

        const fields = {
            name: document.getElementById("club-name"),
            email: document.getElementById("club-email"),
            password: document.getElementById("club-password"),
            confirm: document.getElementById("club-confirm")
        };

        let submitted = false;

        function validateForm() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const errors = {
                name: "",
                email: "",
                password: "",
                confirm: ""
            };

            if (fields.name.value.trim() === "") {
                errors.name = "Please enter your full name.";
            }

            if (fields.email.value.trim() === "") {
                errors.email = "Please enter your email.";
            } else if (!emailPattern.test(fields.email.value.trim())) {
                errors.email = "Enter a valid email, for example name@example.com.";
            }

            if (fields.password.value.length < 8) {
                errors.password = "Password must contain at least 8 characters.";
            }

            if (fields.confirm.value === "") {
                errors.confirm = "Please confirm your password.";
            } else if (fields.confirm.value !== fields.password.value) {
                errors.confirm = "Passwords do not match.";
            }

            let firstInvalid = null;

            Object.keys(errors).forEach(function (name) {
                document.getElementById(name + "-error").textContent = errors[name];

                fields[name].setAttribute(
                    "aria-invalid",
                    String(errors[name] !== "")
                );

                if (errors[name] !== "" && firstInvalid === null) {
                    firstInvalid = fields[name];
                }
            });

            return firstInvalid;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            submitted = true;
            result.textContent = "";

            const invalidField = validateForm();

            if (invalidField) {
                invalidField.focus();
                return;
            }

            result.textContent =
                "Validation successful! Demo only: no account or subscription was created.";

            form.reset();
            submitted = false;
        });

        // Update errors as the user corrects their input.
        form.addEventListener("input", function () {
            result.textContent = "";

            if (submitted) {
                validateForm();
            }
        });
    }

    // TASK 4: Change background color on Shop
    const backgroundButton = document.getElementById("change-background");

    if (backgroundButton) {
        const colors = [
            { name: "Ivory", value: "#f8f6f2" },
            { name: "Blush", value: "#f3e3e5" },
            { name: "Sage", value: "#e4ebe1" },
            { name: "Sand", value: "#ede1cf" }
        ];

        let colorIndex = 0;

        backgroundButton.addEventListener("click", function () {
            colorIndex = (colorIndex + 1) % colors.length;

            document.body.style.backgroundColor = colors[colorIndex].value;

            document.getElementById("background-status").textContent =
                "Palette: " + colors[colorIndex].name;
        });
    }

    // TASK 5: Current date and time on Shop
    const clock = document.getElementById("shop-clock");

    if (clock) {
        function updateClock() {
            const now = new Date();

            clock.dateTime = now.toISOString();

            clock.textContent = now.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            });
        }

        updateClock();
        setInterval(updateClock, 1000);
    }
});