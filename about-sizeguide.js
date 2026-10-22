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
