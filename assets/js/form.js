/**
 * form.js — Floating labels, validation, loading/success states
 * Mcmoren Multiservices Limited
 */

const form = (() => {
  // 1. Private variables
  const REQUIRED_MSG = 'This field is required.';
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[\d\s\+\-\(\)]{7,20}$/;

  // 2. DOM cache
  let elForms;

  function cacheDom() {
    elForms = document.querySelectorAll('.js-enquiry-form');
  }

  // 3. Bind events
  function bindEvents() {
    elForms.forEach((formEl) => {
      initFloatingLabels(formEl);
      formEl.addEventListener('submit', (e) => handleSubmit(e, formEl));

      // Live validation on blur
      const inputs = formEl.querySelectorAll('.form__input, .form__select, .form__textarea');
      inputs.forEach((input) => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
          // Clear error on input
          if (input.classList.contains('form__input--error') ||
              input.classList.contains('form__select--error') ||
              input.classList.contains('form__textarea--error')) {
            clearError(input);
          }
        });
      });
    });
  }

  // 4. Handlers

  /* --- Floating Labels --- */
  function initFloatingLabels(formEl) {
    const groups = formEl.querySelectorAll('.form__group');

    groups.forEach((group) => {
      const input = group.querySelector('.form__input, .form__select, .form__textarea');
      const label = group.querySelector('.form__label');
      if (!input || !label) return;

      // Check initial state (e.g. browser autofill)
      if (input.value) label.classList.add('form__label--floating');

      input.addEventListener('focus', () => {
        label.classList.add('form__label--floating');
      });

      input.addEventListener('blur', () => {
        if (!input.value) label.classList.remove('form__label--floating');
      });

      // Select doesn't fire input event properly on initial value
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
          if (input.value) label.classList.add('form__label--floating');
          else label.classList.remove('form__label--floating');
        });
      }
    });
  }

  /* --- Validation --- */
  function validateField(input) {
    const isRequired = input.hasAttribute('required');
    const type = input.dataset.validate || input.type;
    const value = input.value.trim();

    if (isRequired && !value) {
      showError(input, REQUIRED_MSG);
      return false;
    }

    if (value && type === 'email' && !EMAIL_REGEX.test(value)) {
      showError(input, 'Please enter a valid email address.');
      return false;
    }

    if (value && type === 'tel' && !PHONE_REGEX.test(value)) {
      showError(input, 'Please enter a valid phone number.');
      return false;
    }

    clearError(input);
    return true;
  }

  function showError(input, msg) {
    clearError(input);
    const errorClass = getErrorClass(input);
    input.classList.add(errorClass);

    const errorEl = document.createElement('span');
    errorEl.className = 'form__error-msg';
    errorEl.textContent = msg;
    input.parentElement.appendChild(errorEl);
  }

  function clearError(input) {
    const errorClass = getErrorClass(input);
    input.classList.remove(errorClass);
    const existingError = input.parentElement.querySelector('.form__error-msg');
    if (existingError) existingError.remove();
  }

  function getErrorClass(input) {
    if (input.tagName === 'SELECT') return 'form__select--error';
    if (input.tagName === 'TEXTAREA') return 'form__textarea--error';
    return 'form__input--error';
  }

  function validateForm(formEl) {
    const inputs = formEl.querySelectorAll('.form__input, .form__select, .form__textarea');
    let allValid = true;

    inputs.forEach((input) => {
      if (!validateField(input)) allValid = false;
    });

    return allValid;
  }

  /* --- Submission --- */
  async function handleSubmit(e, formEl) {
    e.preventDefault();

    if (!validateForm(formEl)) return;

    // Loading state
    const submitBtn = formEl.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('btn--loading');
    submitBtn.innerHTML = `<span class="btn__spinner"></span> Sending…`;
    submitBtn.disabled = true;

    try {
      const formData = new FormData(formEl);
      const response = await fetch(formEl.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showSuccess(formEl);
        formEl.reset();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Form submission failed.');
      }
    } catch (err) {
      console.error('Form Error:', err);
      alert('Oops! There was a problem submitting your form. Please try again.');
      submitBtn.classList.remove('btn--loading');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  function showSuccess(formEl) {
    // Hide form fields
    const fields = formEl.querySelector('.js-form-fields');
    if (fields) fields.style.display = 'none';

    // Show success
    const successEl = formEl.querySelector('.form__success');
    if (successEl) successEl.classList.add('form__success--visible');
  }

  // 5. Init
  function init() {
    cacheDom();
    bindEvents();
  }

  return { init };
})();

export default form;
