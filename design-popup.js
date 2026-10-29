// Aruzhan Bolatova: Assignment 5 multi-step form with callbacks.
(function () {
  const dialog = document.getElementById('contactDialog');
  const opener = document.getElementById('openContact');
  const form = document.getElementById('stylistForm');
  const status = document.getElementById('contactStatus');
  const steps = Array.from(form.querySelectorAll('[data-form-step]'));
  const back = document.getElementById('previousStep');
  const next = document.getElementById('nextStep');
  const finish = document.getElementById('finishRequest');
  const fields = ['stylistName', 'stylistEmail', 'stylistMessage'].map(function (id) {
    return document.getElementById(id);
  });
  let step = 0;

  function validStep(index) {
    const inputs = Array.from(steps[index].querySelectorAll('input, textarea'));
    return inputs.every(function (input) {
      input.setCustomValidity(input.value.trim() ? '' : 'Please complete this field.');
      return input.reportValidity();
    });
  }
  function updateReview() {
    const review = document.getElementById('requestReview');
    review.replaceChildren();
    ['Name', 'Email', 'Wishes'].forEach(function (label, index) {
      const term = document.createElement('dt');
      const value = document.createElement('dd');
      term.textContent = label;
      value.textContent = fields[index].value;
      review.append(term, value);
    });
  }
  function renderStep() {
    steps.forEach(function (panel, index) {
      panel.hidden = index !== step;
      panel.classList.toggle('a5-reveal', index === step);
    });
    back.hidden = step === 0;
    next.hidden = step === 2;
    finish.hidden = step !== 2;
    document.getElementById('stepStatus').textContent = 'Step ' + (step + 1) + ' of 3';
    if (step === 2) updateReview();
  }
  // A higher-order function: the callback renders the newly selected step.
  function changeStep(target, callback) {
    if (target < 0 || target >= steps.length) return;
    step = target;
    callback();
    if (dialog.open) {
      const firstInput = steps[step].querySelector('input, textarea');
      (firstInput || finish).focus();
    }
  }
  opener.addEventListener('click', function () {
    status.textContent = '';
    renderStep();
    dialog.showModal();
  });
  document.getElementById('closeContact').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () { opener.focus(); });
  dialog.addEventListener('click', function (event) {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  next.addEventListener('click', function () {
    if (validStep(step)) changeStep(step + 1, renderStep);
  });
  back.addEventListener('click', function () { changeStep(step - 1, renderStep); });
  fields.forEach(function (input) {
    input.addEventListener('input', function () {
      input.setCustomValidity('');
      status.textContent = '';
    });
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (step < 2) {
      if (validStep(step)) changeStep(step + 1, renderStep);
      return;
    }
    for (let i = 0; i < 2; i++) {
      changeStep(i, renderStep);
      if (!validStep(i)) return;
    }
    form.reset();
    changeStep(0, renderStep);
    status.textContent = 'Preview complete. No data was sent and no appointment was booked.';
  });
  renderStep();
})();
