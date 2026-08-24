(function () {
  const form = document.querySelector('[data-auth-form]');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const error = form.querySelector('.form-error');
    if (!form.checkValidity()) {
      form.reportValidity();
      error.textContent = 'Please complete all required fields.';
      return;
    }

    const role = new FormData(form).get('role');
    const nameField = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]').value;
    const name = nameField && nameField.value.trim() ? nameField.value.trim() : email.split('@')[0];
    localStorage.setItem('stacklySession', JSON.stringify({ name, email, role }));
    window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
  });
})();
