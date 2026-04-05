        // Bootstrap form validation
(() => {
  'use strict'
     bsCustomFileInput.init()
  // Fetch all forms with class 'needs-validation'
  const forms = document.querySelectorAll('.validate-form')

  // Loop over them and prevent submission if invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();
