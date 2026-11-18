(() => {
    const sessionKey = 'solea-club-active-profile';
    const invite = document.getElementById('club-invite-copy');
    const signedOutInvite = invite?.textContent;

    function updateClubLinks() {
        let signedIn = false;
        try {
            signedIn = Boolean(sessionStorage.getItem(sessionKey));
        } catch {
            // Keep the public club links when browser storage is unavailable.
        }

        document.querySelectorAll('[data-club-account]').forEach(link => {
            link.textContent = signedIn ? 'My profile' : link.dataset.clubAccount;
        });
        document.querySelectorAll('[data-club-guest]').forEach(link => {
            link.hidden = signedIn;
        });

        if (invite) {
            invite.textContent = signedIn
                ? 'Find your welcome code in your profile.'
                : signedOutInvite;
        }
    }

    updateClubLinks();
    window.addEventListener('pageshow', updateClubLinks);

    const account = document.getElementById('club-account');
    if (!account) return;

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
        const signInView = new URLSearchParams(location.search).get('view') === 'sign-in';
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

        updateClubLinks();
        if (moveFocus) title.focus();
    }

    async function restoreAccount() {
        const email = sessionStorage.getItem(sessionKey);
        const member = email ? await useProfiles('readonly', store => store.get(email)) : null;
        if (email && !member) sessionStorage.removeItem(sessionKey);
        renderAccount(member);
    }

    async function submit(event) {
        event.preventDefault();
        if (busy) return;

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
        history.replaceState(null, '', 'club.html?view=sign-in');
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
        if (event.persisted && database) restoreAccount().catch(showStorageError);
    });

    initialize();
})();
