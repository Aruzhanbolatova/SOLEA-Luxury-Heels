(() => {
    const dialog = document.getElementById('club-account');
    if (!dialog) return;

    const sessionKey = 'solea-club-active-profile';
    const joinButton = document.querySelector('[data-club-open="register"]');
    const signInButton = document.querySelector('[data-club-open="sign-in"]');
    const signedOutLabel = joinButton.textContent;
    const invite = document.getElementById('club-invite-copy');
    const signedOutInvite = invite.textContent;

    function updateInvitation() {
        let signedIn = false;
        try {
            signedIn = Boolean(sessionStorage.getItem(sessionKey));
        } catch {
            // Keep the guest invitation when browser storage is unavailable.
        }

        joinButton.textContent = signedIn ? 'My profile' : signedOutLabel;
        signInButton.hidden = signedIn;
        invite.textContent = signedIn
            ? 'Find your welcome code in your profile.'
            : signedOutInvite;
    }

    updateInvitation();

    const storeName = 'profiles';
    const iterations = 600_000;
    const title = document.getElementById('club-title');
    const intro = document.getElementById('club-intro');
    const registerForm = document.getElementById('club-register');
    const signInForm = document.getElementById('club-sign-in');
    const profile = document.getElementById('club-profile');
    const profileName = document.getElementById('club-profile-name');
    const profileEmail = document.getElementById('club-profile-email');
    const storageStatus = document.getElementById('club-storage-status');
    const demoNote = document.getElementById('club-demo-note');
    const formError = document.getElementById('club-form-error');
    const copyStatus = document.getElementById('club-copy-status');
    let database;
    let currentView = 'register';
    let currentMember = null;
    let opener = null;
    let ready = false;
    let busy = false;

    function openProfiles() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('solea-club', 1);
            request.onupgradeneeded = () => {
                request.result.createObjectStore(storeName, { keyPath: 'email' });
            };
            request.onsuccess = () => {
                const connection = request.result;
                connection.onversionchange = () => connection.close();
                resolve(connection);
            };
            request.onerror = () => reject(request.error);
        });
    }

    function useProfiles(mode, action) {
        return new Promise((resolve, reject) => {
            const transaction = database.transaction(storeName, mode);
            const request = action(transaction.objectStore(storeName));
            transaction.oncomplete = () => resolve(request.result);
            transaction.onabort = () => reject(transaction.error);
        });
    }

    async function passwordVerifier(password, salt, rounds) {
        const encoded = new TextEncoder().encode(password);
        const key = await crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({
            name: 'PBKDF2',
            hash: 'SHA-256',
            salt,
            iterations: rounds
        }, key, 256);
        return new Uint8Array(bits);
    }

    async function createProfile(name, email, password) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const verifier = await passwordVerifier(password, salt, iterations);
        const member = { name, email, salt, verifier, iterations };
        await useProfiles('readwrite', store => store.add(member));
        return member;
    }

    async function signIn(email, password) {
        const member = await useProfiles('readonly', store => store.get(email));
        if (!member) return null;

        const verifier = await passwordVerifier(password, member.salt, member.iterations);
        const difference = verifier.reduce((result, byte, index) =>
            result | (byte ^ member.verifier[index]), 0);

        return difference === 0 ? member : null;
    }

    function renderAccount(member, moveFocus = false) {
        currentMember = member;
        const signInView = currentView === 'sign-in';
        const signedIn = Boolean(member);

        registerForm.hidden = signedIn || signInView;
        signInForm.hidden = signedIn || !signInView;
        profile.hidden = !signedIn;
        intro.hidden = signedIn;
        demoNote.hidden = signedIn;
        storageStatus.hidden = true;
        formError.textContent = '';
        copyStatus.textContent = '';
        profileName.textContent = member?.name ?? '';
        profileEmail.textContent = member?.email ?? '';

        if (member) {
            const firstName = member.name.split(/\s+/, 1)[0];
            title.textContent = 'Welcome, ' + firstName;
        } else {
            title.textContent = signInView ? 'Welcome back' : 'Become a member';
            intro.textContent = signInView
                ? 'Sign in to view your profile and welcome code.'
                : 'Create your profile to unlock your welcome code.';
        }

        updateInvitation();
        if (moveFocus && dialog.open) title.focus();
    }

    async function restoreAccount() {
        const email = sessionStorage.getItem(sessionKey);
        const member = email ? await useProfiles('readonly', store => store.get(email)) : null;
        if (email && !member) sessionStorage.removeItem(sessionKey);
        ready = true;
        renderAccount(member, true);
    }

    function openClub(trigger) {
        if (dialog.open) return;

        opener = trigger;
        if (!busy) {
            currentView = trigger.dataset.clubOpen;
            if (ready) renderAccount(currentMember);
        }

        dialog.showModal();
        title.focus();
    }

    joinButton.addEventListener('click', () => openClub(joinButton));
    signInButton.addEventListener('click', () => openClub(signInButton));
    dialog.querySelector('.club-dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const { left, right, top, bottom } = dialog.getBoundingClientRect();
        const outside = event.clientX < left || event.clientX > right
            || event.clientY < top || event.clientY > bottom;
        if (outside) dialog.close();
    });
    dialog.addEventListener('close', () => {
        if (dialog.open) return;
        registerForm.reset();
        signInForm.reset();
        const returnTo = opener && !opener.hidden ? opener : joinButton;
        returnTo.focus({ preventScroll: true });
        opener = null;
    });

    dialog.querySelectorAll('[data-club-view]').forEach(button => {
        button.addEventListener('click', () => {
            if (busy) return;
            currentView = button.dataset.clubView;
            registerForm.reset();
            signInForm.reset();
            renderAccount(currentMember, true);
        });
    });

    async function submit(event) {
        event.preventDefault();
        if (busy || !dialog.open) return;

        const form = event.currentTarget;
        const isRegistration = form === registerForm;
        const nameInput = form.querySelector('#register-name');
        const email = form.querySelector('input[type="email"]').value.trim().toLowerCase();
        const password = form.querySelector('input[type="password"]').value;
        const confirmation = form.querySelector('#register-confirm');
        const name = nameInput?.value.trim();
        formError.textContent = '';

        if (isRegistration && !name) {
            formError.textContent = 'Enter your full name.';
            nameInput.focus();
            return;
        }
        if (isRegistration && password !== confirmation.value) {
            formError.textContent = 'The passwords don’t match.';
            confirmation.focus();
            return;
        }

        const fieldset = form.querySelector('fieldset');
        const button = form.querySelector('button[type="submit"]');
        const buttonLabel = button.textContent;
        busy = true;
        fieldset.disabled = true;
        form.setAttribute('aria-busy', 'true');
        button.textContent = isRegistration ? 'Creating profile…' : 'Signing in…';

        try {
            const member = isRegistration
                ? await createProfile(name, email, password)
                : await signIn(email, password);

            if (!member) {
                formError.textContent = 'Check your email and password, or create a profile in this browser.';
                return;
            }

            sessionStorage.setItem(sessionKey, member.email);
            form.reset();
            renderAccount(member, true);
        } catch (error) {
            formError.textContent = error?.name === 'ConstraintError'
                ? 'A profile already exists for this email. Sign in to continue.'
                : 'Your profile could not be opened. Check your browser storage and try again.';
        } finally {
            button.textContent = buttonLabel;
            form.removeAttribute('aria-busy');
            fieldset.disabled = false;
            busy = false;
        }
    }

    registerForm.addEventListener('submit', submit);
    signInForm.addEventListener('submit', submit);

    document.getElementById('club-sign-out').addEventListener('click', () => {
        sessionStorage.removeItem(sessionKey);
        currentView = 'sign-in';
        renderAccount(null, true);
    });

    document.getElementById('copy-promo').addEventListener('click', async () => {
        copyStatus.textContent = '';
        try {
            await navigator.clipboard.writeText(document.getElementById('promo-code').textContent);
            copyStatus.textContent = 'Code copied.';
        } catch {
            copyStatus.textContent = 'Select the code to copy it manually.';
        }
    });

    function showStorageError() {
        ready = false;
        renderAccount(null);
        registerForm.hidden = true;
        signInForm.hidden = true;
        profile.hidden = true;
        demoNote.hidden = true;
        storageStatus.hidden = false;
        storageStatus.textContent = 'Profile storage is unavailable. Enable browser storage and reload.';
    }

    async function initialize() {
        storageStatus.hidden = false;
        if (!window.isSecureContext || !window.crypto?.subtle || !window.indexedDB) {
            storageStatus.textContent = 'Open SOLEA Club over HTTPS or through a local web server.';
            return;
        }

        try {
            database = await openProfiles();
            await restoreAccount();
        } catch {
            showStorageError();
        }
    }

    window.addEventListener('pageshow', event => {
        if (event.persisted && database && !busy) restoreAccount().catch(showStorageError);
    });

    initialize();

    const url = new URL(location.href);
    const requestedView = url.searchParams.get('club');
    if (requestedView === 'register' || requestedView === 'sign-in') {
        url.searchParams.delete('club');
        history.replaceState(history.state, '', url);
        openClub(requestedView === 'sign-in' ? signInButton : joinButton);
    }
})();
