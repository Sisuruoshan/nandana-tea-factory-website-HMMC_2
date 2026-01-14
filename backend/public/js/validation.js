document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    const wholesaleForm = document.getElementById('wholesale-inquiry-form');

    const validateForm = (form) => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            // Reset previous errors
            input.style.borderColor = 'var(--border-color)';
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }

            // Check for empty fields
            if (input.value.trim() === '') {
                isValid = false;
                input.style.borderColor = '#ff6b6b';
                displayError(input, 'This field is required.');
            }

            // Check for valid email format
            if (input.type === 'email' && input.value.trim() !== '') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value)) {
                    isValid = false;
                    input.style.borderColor = '#ff6b6b';
                    displayError(input, 'Please enter a valid email address.');
                }
            }
        });

        return isValid;
    };

    const displayError = (inputElement, message) => {
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            if (!validateForm(contactForm)) {
                e.preventDefault(); // Stop submission if validation fails
            } // else allow native submit to Laravel
        });
    }

    if (wholesaleForm) {
        wholesaleForm.addEventListener('submit', function (e) {
            if (!validateForm(wholesaleForm)) {
                e.preventDefault(); // Stop submission if validation fails
            } // else allow native submit to Laravel
        });
    }
});