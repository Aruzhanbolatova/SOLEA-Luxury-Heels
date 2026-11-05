/* Ardak Korabay | SE-2501 | Assignment 4
   Browser-only demo: passwords and form data are never saved or transmitted. */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Task 2: accessible FAQ buttons toggle a CSS grid transition.
    document.querySelectorAll('.solea-faq-toggle').forEach(function (button) {
        button.addEventListener('click', function () {
            const open = button.getAttribute('aria-expanded') !== 'true';
            const answer = document.getElementById(button.getAttribute('aria-controls'));
            button.setAttribute('aria-expanded', String(open));
            button.querySelector('span').textContent = open ? '−' : '+';
            answer.classList.toggle('is-open', open);
            answer.inert = !open;
        });
    });

    // Task 3: native dialog supplies focus containment and Escape support.
    const dialog = document.querySelector('.solea-dialog');
    const opener = document.querySelector('[data-open-circle]');
    if (dialog && opener) {
        opener.addEventListener('click', function () { dialog.showModal(); });
        dialog.querySelector('.solea-close').addEventListener('click', function () { dialog.close(); });
        dialog.addEventListener('click', function (event) {
            const rect = dialog.getBoundingClientRect();
            if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
        });
        dialog.addEventListener('close', function () { opener.focus(); });
    }

    // Task 1: show field-specific errors and focus the first invalid field.
    document.querySelectorAll('[data-solea-form]').forEach(function (form) {
        const fields = Array.from(form.querySelectorAll('[data-rule]'));
        const status = form.querySelector('.solea-form-status');
        let attempted = false;

        function validate(field) {
            const value = field.value.trim();
            let error = '';
            if (!value) error = 'Please complete this field.';
            else if (field.dataset.rule === 'name' && value.length < 2) error = 'Please enter at least 2 characters.';
            else if (field.dataset.rule === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email address, for example name@example.com.';
            else if (field.dataset.rule === 'password' && field.value.length < 8) error = 'Your password must contain at least 8 characters.';
            else if (field.dataset.rule === 'confirm' && field.value !== form.querySelector('[data-rule="password"]').value) error = 'Passwords do not match.';
            else if (field.dataset.rule === 'size' && !['35','36','37','38','39','40','41','42'].includes(value)) error = 'Please select your EU size.';
            else if (field.dataset.rule === 'length' && (!Number.isFinite(Number(value)) || Number(value) < 15 || Number(value) > 35 || field.validity.stepMismatch)) error = 'Enter a foot length from 15 to 35 cm, using at most one decimal place.';
            else if (field.dataset.rule === 'question' && value.length < 10) error = 'Please describe your question in at least 10 characters.';
            document.getElementById(field.id + '-error').textContent = error;
            field.setAttribute('aria-invalid', String(Boolean(error)));
            return !error;
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            attempted = true;
            const results = fields.map(validate);
            if (results.includes(false)) {
                status.textContent = 'Please correct the highlighted fields.';
                fields[results.indexOf(false)].focus();
                return;
            }
            status.textContent = 'All details are valid. This is a demo: no data was sent and no account was created.';
            form.reset();
            attempted = false;
            fields.forEach(function (field) { field.removeAttribute('aria-invalid'); });
        });
        fields.forEach(function (field) {
            field.addEventListener('input', function () {
                status.textContent = '';
                if (attempted) {
                    validate(field);
                    if (field.dataset.rule === 'password') validate(form.querySelector('[data-rule="confirm"]'));
                }
            });
        });
    });

    // Task 4: change the actual body background and the visible content surfaces.
    const shades = [{ name: 'IVORY', color: '#f8f6f1' }, { name: 'BLUSH', color: '#f2e2de' }, { name: 'SAND', color: '#e6daca' }];
    let shade = 0;
    document.querySelectorAll('[data-change-background]').forEach(function (button) {
        button.addEventListener('click', function () {
            shade = (shade + 1) % shades.length;
            document.body.style.backgroundColor = shades[shade].color;
            document.documentElement.style.setProperty('--solea-surface', shades[shade].color);
            button.textContent = 'CHANGE BACKGROUND · ' + shades[shade].name;
        });
    });

    // Task 5: Date uses the visitor's local timezone and updates every second.
    function updateClock() {
        const now = new Date();
        document.querySelectorAll('[data-live-clock]').forEach(function (clock) {
            clock.dateTime = now.toISOString();
            clock.textContent = now.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' });
        });
    }
    updateClock();
    window.setInterval(updateClock, 1000);
});


/* Ardak Korabay | Assignment 5 | About Us and Size Guide.
   Local interactions only: nothing is submitted to a server. */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Keyboard events: arrow keys move between header navigation links.
    const menu = document.querySelector('#main-header .navbar');
    if (menu) {
        const links = Array.from(menu.querySelectorAll('a[href]'));
        menu.addEventListener('keydown', function (event) {
            const index = links.indexOf(document.activeElement);
            if (index < 0) return;
            let target;
            switch (event.key) {
    case 'ArrowRight':
        target = (index + 1) % links.length;
        break;

    case 'ArrowLeft':
        target = (index - 1 + links.length) % links.length;
        break;

    case 'Home':
        target = 0;
        break;

    case 'End':
        target = links.length - 1;
        break;

    default:
        return;
}
            event.preventDefault();
            links[target].focus();
        });
    }

    // A reusable event-triggered animation, respecting reduced-motion settings.
    function celebrate(element) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        element.animate([
            { transform: 'translateY(8px)', opacity: 0.5 },
            { transform: 'translateY(0)', opacity: 1 }
        ], { duration: 350, easing: 'ease-out' });
    }

    // Sound is played only after a deliberate button click; repeated clicks never overlap.
    const sound = {
        context: null,
        oscillator: null,
        async play() {
            const AudioEngine = window.AudioContext || window.webkitAudioContext;
            if (!AudioEngine) throw new Error('Audio is not supported in this browser.');
            if (!this.context) this.context = new AudioEngine();
            await this.context.resume();
            if (this.oscillator) this.oscillator.stop();
            const oscillator = this.context.createOscillator();
            const gain = this.context.createGain();
            const now = this.context.currentTime;
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(660, now);
            oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.12);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
            oscillator.connect(gain);
            gain.connect(this.context.destination);
            this.oscillator = oscillator;
            oscillator.onended = () => {
                oscillator.disconnect(); gain.disconnect();
                if (this.oscillator === oscillator) this.oscillator = null;
            };
            oscillator.start(); oscillator.stop(now + 0.32);
        }
    };
    document.querySelectorAll('[data-play-chime]').forEach(function (button) {
        button.addEventListener('click', async function () {
            button.disabled = true;
            const status = button.parentElement.querySelector('[data-sound-status]');
            try {
                await sound.play();
                status.textContent = 'SOLEA chime played.';
            } catch (error) {
                status.textContent = 'Sound is unavailable. Please check your browser audio settings.';
            } finally {
                button.disabled = false;
            }
        });
    });

    // Attribute and content updates: Read More uses style.display and aria-expanded.
    const readMore = document.querySelector('[data-read-story]');
    if (readMore) {
        const story = document.getElementById('solea-extra-story');
        story.style.display = 'none';
        readMore.addEventListener('click', function () {
            const expanded = readMore.getAttribute('aria-expanded') !== 'true';
            story.style.display = expanded ? 'block' : 'none';
            readMore.setAttribute('aria-expanded', String(expanded));
            readMore.textContent = expanded ? 'READ LESS' : 'READ MORE';
            if (expanded) celebrate(story);
        });
    }

    // Object state + querySelectorAll + higher-order forEach + direct style updates.
    const rating = {
        value: 0,
        messages: ['Not selected', 'Needs improvement', 'Could be better', 'Good', 'Very good', 'Loved it'],
        select(value) {
            this.value = value;
            document.querySelectorAll('[data-rating]').forEach((button) => {
                const selected = Number(button.dataset.rating) <= this.value;
                button.style.color = selected ? '#926329' : '#777777';
                button.setAttribute('aria-pressed', String(Number(button.dataset.rating) === this.value));
            });
            const message = document.getElementById('solea-rating-message');
            message.textContent = this.value + ' / 5 — ' + this.messages[this.value];
            celebrate(message);
        }
    };
    document.querySelectorAll('[data-rating]').forEach(function (button) {
        button.addEventListener('click', function () { rating.select(Number(button.dataset.rating)); });
    });

    // Objects and methods hold the chart and recommendation logic.
    const fitGuide = {
        chart: [
            { eu: 35, cm: 22.5 }, { eu: 36, cm: 23 }, { eu: 37, cm: 23.5 }, { eu: 38, cm: 24 },
            { eu: 39, cm: 25 }, { eu: 40, cm: 25.5 }, { eu: 41, cm: 26 }, { eu: 42, cm: 26.5 }
        ],
        findSize(length) {
            // Explicit for loop demonstrates iteration over the array of objects.
            for (let i = 0; i < this.chart.length; i++) {
                if (length <= this.chart[i].cm) return this.chart[i].eu;
            }
            return null;
        },
        occasionTip(occasion) {
            switch (occasion) {
                case 'office': return 'For work, explore a stable heel and a secure fit.';
                case 'evening': return 'For an evening out, try both shoes and check comfort while walking.';
                case 'everyday': return 'For everyday wear, consider a lower heel and space around the toes.';
                default: return 'Try on both shoes before choosing your pair.';
            }
        }
    };

    // Multi-step form: state survives Next/Back because the inputs stay in the DOM.
    const form = document.getElementById('solea-fit-finder');
    if (form) {
        const panels = Array.from(form.querySelectorAll('[data-fit-step]'));
        const next = form.querySelector('[data-fit-next]');
        const back = form.querySelector('[data-fit-back]');
        const reset = form.querySelector('[data-fit-reset]');
        const length = document.getElementById('finder-length');
        const error = document.getElementById('finder-error');
        const result = document.getElementById('finder-result');
        const state = { step: 0 };

        function renderStep() {
            panels.forEach(function (panel, index) { panel.hidden = index !== state.step; });
            back.hidden = state.step === 0;
            next.hidden = state.step === panels.length - 1;
            reset.hidden = state.step !== panels.length - 1;
            next.textContent = state.step === 1 ? 'SHOW MY FIT' : 'NEXT';
            document.getElementById('finder-progress').textContent = 'STEP ' + (state.step + 1) + ' OF 3';
            const heading = panels[state.step].querySelector('h3');
            heading.focus();
            celebrate(panels[state.step]);
        }

        // Higher-order function: the callback decides how to render each new step.
        function moveTo(step, callback) {
            state.step = step;
            callback();
        }

        function advance() {
            if (state.step === 0) {
                const valid = length.value !== '' && Number(length.value) >= 22.5 && Number(length.value) <= 26.5 && !length.validity.stepMismatch;
                error.textContent = valid ? '' : 'Enter a length from 22.5 to 26.5 cm, using at most one decimal place.';
                length.setAttribute('aria-invalid', String(!valid));
                if (!valid) { length.focus(); return; }
            }
            if (state.step === 1) {
                const size = fitGuide.findSize(Number(length.value));
                const width = form.elements.width.value;
                const occasion = form.elements.occasion.value;
                result.textContent = 'Start with EU ' + size + '. ' + fitGuide.occasionTip(occasion) +
                    (width === 'wide' ? ' For a wider foot, ask about the fit of the specific style.' : ' Check that your heel stays secure.');
            }
            if (state.step < 2) moveTo(state.step + 1, renderStep);
        }
        next.addEventListener('click', advance);
        form.addEventListener('submit', function (event) { event.preventDefault(); advance(); });
        back.addEventListener('click', function () { if (state.step > 0) moveTo(state.step - 1, renderStep); });
        reset.addEventListener('click', function () {
            form.reset(); error.textContent = ''; result.textContent = '';
            length.removeAttribute('aria-invalid');
            moveTo(0, renderStep);
        });
        // Initial rendering does not steal focus when the page loads.
        panels.forEach(function (panel, index) { panel.hidden = index !== 0; });
        back.hidden = true; reset.hidden = true;
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
    }

    const links = Array.from(
        document.querySelectorAll('#main-header .navbar a[href]')
    );

    const index = links.indexOf(document.activeElement);

    // Стрелки работают, только когда выделена ссылка меню.
    if (index === -1) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex =
        (index + direction + links.length) % links.length;

    links[nextIndex].focus();
}, true);

function startClock() {
  function updateClock() {
    var clocks = document.querySelectorAll('.live-clock');

    var time = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    clocks.forEach(function (clock) {
      clock.textContent = 'Local time: ' + time;
    });
  }

  updateClock();
  setInterval(updateClock, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startClock);
} else {
  startClock();
}