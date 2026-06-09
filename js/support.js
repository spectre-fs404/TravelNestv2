document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. FAQ Accordion Logic ---
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      question.classList.toggle('active');
      const answer = question.nextElementSibling;

      if (question.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = "0";
      }
    });
  });

  // --- 2. Form Validation & LocalStorage Logic ---
  const form = document.getElementById('tn-support-form');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const msgInput = document.getElementById('user-message');
  const successMsg = document.getElementById('form-success-msg');
  const submitBtn = document.getElementById('submit-btn');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(inputElement, errorElementId, message) {
    const errorSpan = document.getElementById(errorElementId);
    inputElement.classList.add('input-error');
    errorSpan.textContent = message;
  }

  function clearError(inputElement, errorElementId) {
    const errorSpan = document.getElementById(errorElementId);
    inputElement.classList.remove('input-error');
    errorSpan.textContent = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (nameInput.value.trim() === '') {
      showError(nameInput, 'name-error', 'Please enter your name.');
      isValid = false;
    } else {
      clearError(nameInput, 'name-error');
    }

    if (emailInput.value.trim() === '') {
      showError(emailInput, 'email-error', 'Please enter an email address.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'email-error', 'Please enter a valid email.');
      isValid = false;
    } else {
      clearError(emailInput, 'email-error');
    }

    if (msgInput.value.trim() === '') {
      showError(msgInput, 'message-error', 'Please enter a message.');
      isValid = false;
    } else if (msgInput.value.trim().length < 10) {
      showError(msgInput, 'message-error', 'Message must be at least 10 characters.');
      isValid = false;
    } else {
      clearError(msgInput, 'message-error');
    }

    if (isValid) {
      const feedbackData = {
        id: Date.now(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: msgInput.value.trim(),
        date: new Date().toISOString()
      };

      let storedFeedbacks = JSON.parse(localStorage.getItem('tn_feedbacks')) || [];
      storedFeedbacks.push(feedbackData);
      localStorage.setItem('tn_feedbacks', JSON.stringify(storedFeedbacks));

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        
        successMsg.style.display = 'block';

        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 4000);
      }, 600);
    }
  });

  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener('input', (e) => {
      const errorId = e.target.id.split('-')[1] + '-error';
      clearError(e.target, errorId);
    });
  });
});