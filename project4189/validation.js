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
            } else {
                e.preventDefault();
                // Save inquiry to localStorage for admin review
                const formData = new FormData(contactForm);
                const inquiry = {
                    id: 'inq_' + Date.now(),
                    name: formData.get('name').trim(),
                    email: formData.get('email').trim(),
                    subject: formData.get('subject').trim(),
                    message: formData.get('message').trim(),
                    timestamp: new Date().toISOString(),
                    replied: false,
                    replyMessage: ''
                };
                const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
                inquiries.unshift(inquiry);
                localStorage.setItem('inquiries', JSON.stringify(inquiries));

                // Show confirmation and reset form
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }
        });
    }

    if (wholesaleForm) {
        wholesaleForm.addEventListener('submit', function (e) {
            if (!validateForm(wholesaleForm)) {
                e.preventDefault(); // Stop submission if validation fails
            } else {
                alert('Thank you for your wholesale inquiry!');
            }
        });
    }
});