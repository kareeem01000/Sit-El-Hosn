document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('active');
            // Toggle icon class (change burger to 'X')
            const icon = menuToggle.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Optional: Prevent body scroll when menu is open
                // body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Optional: Restore body scroll
                // body.style.overflow = '';
            }
        });

        // Close mobile menu when a link is clicked
        const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Optional: Restore body scroll
                // body.style.overflow = '';
            });
        });

        // Optional: Close menu if clicked outside
        document.addEventListener('click', (event) => {
            if (mobileMenu.classList.contains('active') &&
                !mobileMenu.contains(event.target) &&
                !menuToggle.contains(event.target)) {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // body.style.overflow = ''; // Restore scroll
            }
        });
    }


    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Clear previous statuses and errors
            clearErrors();
            formStatus.textContent = '';
            formStatus.className = 'form-status'; // Reset class and hide

            // Get form elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            let isValid = true;

            // Validate Name
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'يرجى إدخال الاسم.');
                isValid = false;
            }

            // Validate Email
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'يرجى إدخال البريد الإلكتروني.');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'يرجى إدخال بريد إلكتروني صحيح.');
                isValid = false;
            }

            // Validate Message
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'يرجى إدخال رسالتك.');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) { // Example: minimum length
                 showError(messageInput, 'الرسالة قصيرة جداً، يرجى كتابة 10 أحرف على الأقل.');
                 isValid = false;
            }


            // If form is valid
            if (isValid) {
                console.log('Form is valid. Submitting (simulation)...');
                // In a real application, you would send the data to a server here
                // using fetch() or XMLHttpRequest. Example:
                /*
                const formData = new FormData(contactForm);
                fetch('/your-server-endpoint', { // Replace with your actual endpoint
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json()) // Or response.text()
                .then(data => {
                    console.log('Success:', data);
                    showFormStatus('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('Error:', error);
                    showFormStatus('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
                });
                */

                // Simulate successful submission for demo purposes
                showFormStatus('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
                contactForm.reset(); // Clear the form fields

                // Optionally hide the status message after a few seconds
                setTimeout(() => {
                    formStatus.classList.remove('visible');
                    // Wait for transition before clearing text
                     setTimeout(() => {
                         formStatus.textContent = '';
                         formStatus.className = 'form-status';
                     }, 400); // Match CSS transition duration
                }, 5000);

            } else {
                 console.log('Form is invalid.');
                 showFormStatus('يرجى تصحيح الأخطاء المميزة في النموذج.', 'error');
            }
        });
    }

    // Helper function to show form status message
    function showFormStatus(message, type) {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = `form-status ${type} visible`; // Add type and visible class
        }
    }


    // Helper function to show error message below an input
    function showError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        if (!formGroup) return; // Exit if structure is not as expected
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
        inputElement.classList.add('error'); // Add error class for styling input border
         inputElement.setAttribute('aria-invalid', 'true'); // Accessibility
         inputElement.setAttribute('aria-describedby', errorElement.id || ''); // Link error msg
    }

    // Helper function to clear all error messages and styles
    function clearErrors() {
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.textContent = '');

        const errorInputs = contactForm.querySelectorAll('.error');
        errorInputs.forEach(el => {
             el.classList.remove('error');
             el.removeAttribute('aria-invalid');
             el.removeAttribute('aria-describedby');
        });
    }

    // Helper function for basic email validation using a robust regex
    function isValidEmail(email) {
        // More comprehensive regex
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return regex.test(email);
    }


    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) { // Check if browser supports it
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Stop observing once the element is visible to prevent re-animation
                    observerInstance.unobserve(entry.target);
                }
                // Optional: Remove 'visible' class if element scrolls out of view (if you want re-animation)
                // else {
                //     entry.target.classList.remove('visible');
                // }
            });
        }, {
            threshold: 0.15 // Trigger when 15% of the element is visible
            // rootMargin: '0px 0px -50px 0px' // Optional: Trigger a bit sooner/later
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers: just make elements visible
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
    }


    // --- Smooth Scroll for Navbar Links ---
    // Note: CSS `scroll-behavior: smooth;` is generally preferred and simpler.
    // This JS provides more control (e.g., for header offset) if needed.
    // Uncomment this section if you need the JS-based smooth scroll.
    /*
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const header = document.querySelector('.header'); // Get the header element
    const headerHeight = header ? header.offsetHeight : 70; // Get header height or fallback

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href'); // e.g., "#about"

            // Check if it's a valid internal link
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault(); // Prevent default anchor jump ONLY for internal links
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    // Calculate the scroll position considering the sticky header height
                    const offsetPosition = window.pageYOffset + elementPosition - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open (already handled in menu toggle section, but good practice here too)
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                       mobileMenu.classList.remove('active');
                       const icon = menuToggle.querySelector('i');
                       icon.classList.remove('fa-times');
                       icon.classList.add('fa-bars');
                       // body.style.overflow = ''; // Restore scroll
                    }
                }
            }
            // If it's not an internal link (e.g., href="external.html"), let the default behavior happen.
        });
    });
    */

}); // End DOMContentLoaded