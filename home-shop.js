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
            const emailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

            const errors = {
                name: "",
                email: "",
                password: "",
                confirm: ""
            };

            if (fields.name.value.trim() === "") {
                errors.name = "Please enter your full name.";
            }

           const email = fields.email.value.trim();
const localPart = email.split("@")[0];

if (email === "") {
    errors.email = "Please enter your email.";
} else if (
    !emailPattern.test(email) ||
    email.length > 254 ||
    localPart.length > 64 ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..")
) {
    errors.email = "Enter a valid email, for example name@gmail.com.";
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

            submitted = false;

// jQuery (home-shop-jquery.js) shows the spinner and the toast.
$(form).trigger("validated");
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
document.addEventListener("DOMContentLoaded", function () {
    // Restart the animation when an interaction occurs.
    function animateElement(element) {
        element.classList.remove("a5-enter");
        void element.offsetWidth;
        element.classList.add("a5-enter");
    }

    // 1. HOME: READ MORE
    const readMoreButton = document.querySelector("#read-more-button");
    const extraStory = document.querySelector("#extra-story");

    if (readMoreButton && extraStory) {
        readMoreButton.addEventListener("click", function () {
            const isOpen =
                readMoreButton.getAttribute("aria-expanded") === "true";

            extraStory.style.display = isOpen ? "none" : "block";
            readMoreButton.textContent = isOpen ? "Read more" : "Read less";
            readMoreButton.setAttribute("aria-expanded", String(!isOpen));

            if (!isOpen) {
                animateElement(extraStory);
            }
        });
    }

    // 2. BOTH PAGES: KEYBOARD NAVIGATION
    const navigation = document.querySelector("#main-header .navbar");

    if (navigation) {
        navigation.addEventListener("keydown", function (event) {
            if (
                event.key !== "ArrowRight" &&
                event.key !== "ArrowLeft"
            ) {
                return;
            }

            // Include only links currently visible in the menu.
            const links = Array.from(
                navigation.querySelectorAll("a[href]")
            ).filter(function (link) {
                return link.getClientRects().length > 0;
            });

            const currentIndex = links.indexOf(document.activeElement);

            if (currentIndex === -1) {
                return;
            }

            event.preventDefault();

            const direction = event.key === "ArrowRight" ? 1 : -1;
            const nextIndex =
                (currentIndex + direction + links.length) % links.length;

            links[nextIndex].focus();
        });
    }

    // 3. HOME: MULTI-STEP FORM, OBJECTS, ARRAYS AND CALLBACKS
    const styleForm = document.querySelector("#style-form");

    if (styleForm) {
        const steps = Array.from(
            styleForm.querySelectorAll(".a5-step")
        );

        const occasion = document.querySelector("#style-occasion");
        const preference = document.querySelector("#style-preference");
        const nextButton = document.querySelector("#finder-next");
        const backButton = document.querySelector("#finder-back");
        const restartButton = document.querySelector("#finder-restart");
        const progress = document.querySelector("#finder-progress");
        const error = document.querySelector("#finder-error");
        const result = document.querySelector("#style-result");
        const tipsList = document.querySelector("#style-tips");

        let currentStep = 0;

        // Object containing data and a method.
        const stylist = {
            occasions: {
                everyday: "everyday wear",
                evening: "an evening event",
                celebration: "a celebration"
            },

            styles: {
                classic: {
                    title: "Classic Elegance",
                    tips: [
                        "Explore timeless pumps.",
                        "Choose neutral shades.",
                        "Pair with tailored pieces."
                    ]
                },

                bold: {
                    title: "Bold Statement",
                    tips: [
                        "Explore statement platforms.",
                        "Try a rich accent color.",
                        "Keep accessories simple."
                    ]
                },

                romantic: {
                    title: "Romantic Details",
                    tips: [
                        "Explore delicate straps.",
                        "Try soft blush or pearl tones.",
                        "Pair with flowing fabrics."
                    ]
                }
            },

            getRecommendation: function (occasionKey, styleKey) {
                const selectedStyle = this.styles[styleKey];

                return {
                    message:
                        selectedStyle.title + " for " +
                        this.occasions[occasionKey] + ".",
                    tips: selectedStyle.tips
                };
            }
        };

        function showRecommendation() {
            const recommendation = stylist.getRecommendation(
                occasion.value,
                preference.value
            );

            result.textContent = recommendation.message;
            tipsList.replaceChildren();

            // Array + for loop + creating DOM elements.
            for (let i = 0; i < recommendation.tips.length; i++) {
                const item = document.createElement("li");
                item.textContent = recommendation.tips[i];
                tipsList.append(item);
            }
        }

        function renderStep(index) {
            steps.forEach(function (step, stepIndex) {
                step.hidden = stepIndex !== index;
            });

            progress.textContent = "Step " + (index + 1) + " of 3";
            backButton.hidden = index === 0;
            nextButton.hidden = index === 2;
            restartButton.hidden = index !== 2;

            nextButton.textContent =
                index === 1 ? "Show my style" : "Next";

            error.textContent = "";

            animateElement(steps[index]);
        }

        // Higher-order function: accepts another function as a callback.
        function changeStep(index, callback) {
            currentStep = index;
            callback(currentStep);
            steps[currentStep].querySelector("h3").focus();
        }

        function moveNext() {
            if (currentStep === 0 && occasion.value === "") {
                error.textContent = "Please choose an occasion.";
                occasion.focus();
                return;
            }

            if (currentStep === 1 && preference.value === "") {
                error.textContent = "Please choose a style.";
                preference.focus();
                return;
            }

            if (currentStep === 1) {
                showRecommendation();
            }

            if (currentStep < 2) {
                changeStep(currentStep + 1, renderStep);
            }
        }

        nextButton.addEventListener("click", moveNext);

        backButton.addEventListener("click", function () {
            if (currentStep > 0) {
                changeStep(currentStep - 1, renderStep);
            }
        });

        restartButton.addEventListener("click", function () {
            styleForm.reset();
            result.textContent = "";
            tipsList.replaceChildren();
            changeStep(0, renderStep);
        });

        styleForm.addEventListener("submit", function (event) {
            event.preventDefault();
            moveNext();
        });

        renderStep(0);
    }

    // 4. SHOP: PRICE FILTER WITH SWITCH
    const priceFilter = document.querySelector("#price-filter");
    const grid = document.querySelector("#product-grid");

    if (priceFilter && grid) {
        // Supports cards directly in the grid or inside Bootstrap columns.
        const products = Array.from(grid.children).map(function (column) {
            const card = column.matches(".product-card")
                ? column
                : column.querySelector(".product-card");

            return {
                column: column,
                card: card,
                price: card ? Number(card.dataset.price) : NaN
            };
        }).filter(function (product) {
            return product.card !== null;
        });

        function matchesPrice(price, selectedRange) {
            switch (selectedRange) {
                case "under250":
                    return price < 250;

                case "250to300":
                    return price >= 250 && price <= 300;

                case "over300":
                    return price > 300;

                default:
                    return true;
            }
        }

        function filterProducts() {
            const query = document.getElementById("collection-query").value.trim().toLowerCase();
            let visibleCount = 0;

            products.forEach(function (product) {
                const visible = matchesPrice(
                    product.price,
                    priceFilter.value
                ) && product.card.dataset.name.toLowerCase().includes(query);

                product.column.hidden = !visible;

                if (visible) {
                    visibleCount++;
                }
            });

            const count = document.querySelector("#product-count");

            if (count) {
                count.textContent =
                    visibleCount + " of " + products.length + " products";
            }

            document.querySelector("#filter-message").textContent =
                visibleCount === 0
                    ? "No products match these filters."
                    : "";

            animateElement(grid);
        }

        const search = $('#collection-query');
        const suggestions = $('#model-options');
        function updateSuggestions() {
          suggestions.empty();
          const query = search.val().trim();
          if (!query) return;
          $('#product-grid .product-card').filter(function () {
            return !this.closest('[hidden]');
          }).slice(0, 6).each(function () {
            $('<button>', { type: 'button', text: this.dataset.name }).appendTo(suggestions);
          });
        }
        search.on('input', function () {
          filterProducts();
          updateSuggestions();
        });
        suggestions.on('click', 'button', function () {
          search.val($(this).text()).trigger('input').trigger('focus');
          suggestions.empty();
        });
        $('.collection-search').on('focusout', function (event) {
          if (!this.contains(event.relatedTarget)) suggestions.empty();
        });
        search.on('keydown', function (event) {
          if (event.key === 'Escape') suggestions.empty();
          if (event.key === 'ArrowDown' && suggestions.children().length) {
            event.preventDefault();
            suggestions.children().first().trigger('focus');
          }
        });

        priceFilter.addEventListener("change", filterProducts);
        filterProducts();
    }

    // Roll one digit into view at a time when the collection is on screen.
    const total = document.getElementById('designer-total');
    if (total && window.jQuery && 'IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const target = Number(total.textContent);
        const reel = $('<span>', { class: 'designer-count-reel' });
        for (let digit = 0; digit <= target; digit++) {
            $('<span>').text(digit).appendTo(reel);
        }
        $(total).empty().append(reel);
        const animation = $({ position: 0 });
        const observer = new IntersectionObserver(function (entries) {
            const entry = entries[entries.length - 1];
            if (entry.intersectionRatio >= 0.75) {
                animation.stop().animate({ position: target }, {
                    duration: 2200,
                    easing: 'swing',
                    step: function (position) {
                        reel.css('transform', 'translateY(-' + position + 'em)');
                    }
                });
            } else if (!entry.isIntersecting) {
                animation.stop();
                animation[0].position = 0;
                reel.css('transform', 'translateY(0)');
            }
        }, { threshold: [0, 0.75] });
        observer.observe(total);
    }

    // 5. HOME: SOUND ON BUTTON CLICK
    const soundButton = document.querySelector("#play-chime");

    if (soundButton) {
        const soundStatus = document.querySelector("#sound-status");
        let audioContext;

        soundButton.addEventListener("click", async function () {
            if (soundButton.disabled) {
                return;
            }

            soundButton.disabled = true;
            soundStatus.textContent = "Playing…";

            try {
                if (!audioContext) {
                    audioContext = new window.AudioContext();
                }

                await audioContext.resume();

                const oscillator = audioContext.createOscillator();
                const volume = audioContext.createGain();
                const start = audioContext.currentTime;

                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(660, start);
                oscillator.frequency.setValueAtTime(880, start + 0.15);

                volume.gain.setValueAtTime(0, start);
                volume.gain.linearRampToValueAtTime(0.12, start + 0.02);
                volume.gain.exponentialRampToValueAtTime(
                    0.001,
                    start + 0.4
                );

                oscillator.connect(volume);
                volume.connect(audioContext.destination);

                oscillator.onended = function () {
                    oscillator.disconnect();
                    volume.disconnect();
                    soundButton.disabled = false;
                    soundStatus.textContent = "Chime played.";
                };

                oscillator.start(start);
                oscillator.stop(start + 0.45);
            } catch (error) {
                soundButton.disabled = false;
                soundStatus.textContent =
                    "Sound is unavailable in this browser.";
            }
        });
    }
});
// Assignment 6: jQuery features for the Home and Shop pages.
$(document).ready(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- TASK 7: toast notification ----------
  const $toast = $('<div>', { id: 'solea-toast', role: 'status', 'aria-live': 'polite' })
    .hide()
    .appendTo('body');

  function showToast(message) {
    $toast.stop(true, true).text(message).fadeIn(200).delay(2500).fadeOut(400);
  }

  // ---------- TASK 4: scroll progress bar ----------
  const $progress = $('<div id="scroll-progress" aria-hidden="true"><span></span></div>')
    .prependTo('body');

  function updateProgress() {
    const scrollable = $(document).height() - $(window).height();
    const percent = scrollable > 0 ? ($(window).scrollTop() / scrollable) * 100 : 0;
    $progress.children().css('width', percent + '%');
  }

  $(window).on('scroll resize', updateProgress);
  updateProgress();

  // ---------- TASK 9: lazy loading (Home) ----------
  const $lazyImages = $('img.lazy-img[data-src]');

  function loadVisibleImages() {
    const viewportBottom = $(window).scrollTop() + $(window).height() + 200;

    $lazyImages.filter('[data-src]').each(function () {
      const $img = $(this);

      if ($img.offset().top < viewportBottom) {
        $img.one('load', function () { $img.addClass('lazy-loaded'); });
        $img.attr('src', $img.attr('data-src')).removeAttr('data-src');
      }
    });
  }

  if ($lazyImages.length) {
    $(window).on('scroll resize', loadVisibleImages);
    loadVisibleImages();
  }

  // ---------- TASK 5: animated number counter (Home) ----------
  const $stats = $('#stats');

  if ($stats.length) {
    let counted = false;

    function startCounters() {
      counted = true;

      $('.stat-number').each(function () {
        const $number = $(this);
        const target = Number($number.attr('data-target'));

        if (reduceMotion) {
          $number.text(target.toLocaleString('en-US'));
          return;
        }

        $({ value: 0 }).animate({ value: target }, {
          duration: 2000,
          easing: 'swing',
          step: function (now) {
            $number.text(Math.floor(now).toLocaleString('en-US'));
          },
          complete: function () {
            $number.text(target.toLocaleString('en-US'));
          }
        });
      });
    }

    function checkStats() {
      const visibleBottom = $(window).scrollTop() + $(window).height();

      if (!counted && visibleBottom > $stats.offset().top + 80) {
        startCounters();
      }
    }

    $(window).on('scroll resize', checkStats);
    checkStats();
  }

  // ---------- TASK 6: spinner on submit (Home subscription form) ----------
  $('#subscription-form').on('validated', function () {
    const $form = $(this);
    const $button = $form.find('button[type="submit"]');
    const originalText = $button.text();

    $button
      .prop('disabled', true)
      .html('<span class="solea-spinner" aria-hidden="true"></span>Please wait…');

    // Simulated server call.
    setTimeout(function () {
      $button.prop('disabled', false).text(originalText);
      $form[0].reset();
      $('#subscription-result').text('Welcome to the SOLEA Club! Demo only: nothing was saved.');
      showToast('Successfully subscribed to the SOLEA Club!');
    }, 2000);
  });

  // ---------- TASK 8: copy to clipboard (Home promo code) ----------
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      const $temp = $('<textarea>').val(text).css({ position: 'fixed', opacity: 0 }).appendTo('body');
      $temp[0].select();
      const ok = document.execCommand('copy');
      $temp.remove();
      ok ? resolve() : reject();
    });
  }

  function confirmCopy($button) {
    const $icon = $button.find('.copy-icon');
    const $tooltip = $button.siblings('.copy-tooltip');

    $icon.text('✓');
    $button.addClass('copied');
    $tooltip.stop(true, true).fadeIn(150).delay(1600).fadeOut(200, function () {
      $icon.text('⧉');
      $button.removeClass('copied');
    });
    showToast('Promo code copied!');
  }

  $('.copy-btn').on('click', function () {
    const $button = $(this);
    const text = $($button.data('target')).text().trim();

    copyText(text).then(function () {
      confirmCopy($button);
    }).catch(function () {
      showToast('Copy failed. Select the code and press Ctrl+C.');
    });
  });

  // Also react when the code is copied manually (Ctrl+C / right-click).
  $('#promo-code').on('copy', function () {
    confirmCopy($('.copy-btn'));
  });

  // ---------- TASK 3: search highlighting (Shop) ----------
  const $search = $('#collection-query');

  if ($search.length) {
    const $titles = $('#product-grid .card-title');

    $titles.each(function () {
      $(this).data('original', $(this).text());
    });

    function highlightMatches() {
      const query = $search.val().trim();
      const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      $titles.each(function () {
        const $title = $(this);
        const original = $title.data('original');

        if (query === '') {
          $title.text(original);
        } else {
          $title.html(original.replace(new RegExp('(' + safeQuery + ')', 'gi'), '<mark>$1</mark>'));
        }
      });
    }

    $search.on('input', highlightMatches);
  }

  // ---------- TASK 7: toast on Shop ----------
  $('#change-background').on('click', function () {
    showToast('Background color changed');
  });

  $('#price-filter, #sort-select').on('change', function () {
    showToast('Product list updated');
  });
});
