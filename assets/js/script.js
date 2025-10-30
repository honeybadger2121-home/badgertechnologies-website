// Mobile Navigation Toggle// Mobile Navigation Toggle

document.addEventListener('DOMContentLoaded', function() {document.addEventListener('DOMContentLoaded', function() {

    const navToggle = document.querySelector('.nav-toggle');    const navToggle = document.querySelector('.nav-toggle');

    const navMenu = document.querySelector('.nav-menu');    const navMenu = document.querySelector('.nav-menu');

    const navLinks = document.querySelectorAll('.nav-link');    const navLinks = document.querySelectorAll('.nav-link');



    // Toggle mobile menu (only if elements exist)    // Toggle mobile menu (only if elements exist)

    if (navToggle && navMenu) {    if (navToggle && navMenu) {

        navToggle.addEventListener('click', function() {        navToggle.addEventListener('click', function() {

            navMenu.classList.toggle('active');            navMenu.classList.toggle('active');

            navToggle.classList.toggle('active');            navToggle.classList.toggle('active');

        });        });

    }    }



    // Close mobile menu when clicking on a link (only if elements exist)    // Close mobile menu when clicking on a link (only if elements exist)

    if (navLinks.length > 0 && navMenu && navToggle) {    if (navLinks.length > 0 && navMenu && navToggle) {

        navLinks.forEach(link => {        navLinks.forEach(link => {

            link.addEventListener('click', function() {            link.addEventListener('click', function() {

                navMenu.classList.remove('active');                navMenu.classList.remove('active');

                navToggle.classList.remove('active');                navToggle.classList.remove('active');

            });            });

        });        });



        // Close mobile menu when clicking outside        // Close mobile menu when clicking outside

        document.addEventListener('click', function(e) {        document.addEventListener('click', function(e) {

            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {

                navMenu.classList.remove('active');                navMenu.classList.remove('active');

                navToggle.classList.remove('active');                navToggle.classList.remove('active');

            }            }

        });        });

    }    }

});});



// Smooth scrolling for navigation links// Smooth scrolling for navigation links

document.addEventListener('DOMContentLoaded', function() {document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    const anchorLinks = document.querySelectorAll('a[href^="#"]');    anchor.addEventListener('click', function (e) {

    if (anchorLinks.length > 0) {        e.preventDefault();

        anchorLinks.forEach(anchor => {        const target = document.querySelector(this.getAttribute('href'));

            anchor.addEventListener('click', function (e) {        if (target) {

                e.preventDefault();            target.scrollIntoView({

                const target = document.querySelector(this.getAttribute('href'));                behavior: 'smooth',

                if (target) {                block: 'start'

                    target.scrollIntoView({            });

                        behavior: 'smooth',        }

                        block: 'start'    });

                    });});

                }

            });// Navbar background change on scroll

        });window.addEventListener('scroll', function() {

    }    const navbar = document.querySelector('.navbar');

});    if (navbar) {

        if (window.scrollY > 50) {

// Navbar background change on scroll            navbar.style.background = 'rgba(255, 255, 255, 0.98)';

window.addEventListener('scroll', function() {            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';

    const navbar = document.querySelector('.navbar');        } else {

    if (navbar) {            navbar.style.background = 'rgba(255, 255, 255, 0.95)';

        if (window.scrollY > 50) {            navbar.style.boxShadow = 'none';

            navbar.style.background = 'rgba(255, 255, 255, 0.98)';        }

            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';    }

        } else {});

            navbar.style.background = 'rgba(255, 255, 255, 0.95)';

            navbar.style.boxShadow = 'none';// Contact form handling - Cloudflare Pages API submission

        }const contactForm = document.getElementById('contactForm');

    }if (contactForm) {

});    contactForm.addEventListener('submit', function(e) {

        // Validate form before submission

// Contact form handling - Cloudflare Pages API submission        if (!validateForm(this)) {

document.addEventListener('DOMContentLoaded', function() {            e.preventDefault();

    const contactForm = document.getElementById('contactForm');            showNotification('Please fill in all required fields correctly.', 'error');

    if (contactForm) {            return;

        contactForm.addEventListener('submit', function(e) {        }

            // Validate form before submission        

            if (!validateForm(this)) {        // Show loading state

                e.preventDefault();        const submitButton = this.querySelector('button[type="submit"]');

                showNotification('Please fill in all required fields correctly.', 'error');        const originalText = submitButton.textContent;

                return;        submitButton.textContent = 'Sending...';

            }        submitButton.disabled = true;

                    

            // Show loading state        // Submit to Cloudflare Pages API

            const submitButton = this.querySelector('button[type="submit"]');        // The action="/thank-you.html" will redirect after submission

            if (submitButton) {    });

                const originalText = submitButton.textContent;}

                submitButton.textContent = 'Sending...';

                submitButton.disabled = true;// Form validation function

            }function validateForm(form) {

                const requiredFields = form.querySelectorAll('[required]');

            // Submit to Cloudflare Pages API    let isValid = true;

            // The action="/thank-you.html" will redirect after submission    

        });    requiredFields.forEach(field => {

    }        const value = field.value.trim();

});        

        // Remove existing error styling

// Form validation function        field.classList.remove('error');

function validateForm(form) {        

    const requiredFields = form.querySelectorAll('[required]');        // Check if field is empty

    let isValid = true;        if (!value) {

                field.classList.add('error');

    requiredFields.forEach(field => {            isValid = false;

        const value = field.value.trim();            return;

                }

        // Remove existing error styling        

        field.classList.remove('error');        // Email validation

                if (field.type === 'email') {

        // Check if field is empty            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {            if (!emailRegex.test(value)) {

            field.classList.add('error');                field.classList.add('error');

            isValid = false;                isValid = false;

            return;            }

        }        }

            });

        // Email validation    

        if (field.type === 'email') {    return isValid;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;}

            if (!emailRegex.test(value)) {

                field.classList.add('error');// Notification system

                isValid = false;function showNotification(message, type = 'info') {

            }    // Remove existing notifications

        }    const existingNotifications = document.querySelectorAll('.notification');

    });    existingNotifications.forEach(notification => notification.remove());

        

    return isValid;    // Create notification element

}    const notification = document.createElement('div');

    notification.className = `notification notification-${type}`;

// Notification system    notification.innerHTML = `

function showNotification(message, type = 'info') {        <div class="notification-content">

    // Remove existing notifications            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>

    const existingNotifications = document.querySelectorAll('.notification');            <span>${message}</span>

    existingNotifications.forEach(notification => notification.remove());            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">

                    <i class="fas fa-times"></i>

    // Create notification element            </button>

    const notification = document.createElement('div');        </div>

    notification.className = `notification notification-${type}`;    `;

        

    let icon = 'info-circle';    // Add notification styles

    if (type === 'success') icon = 'check-circle';    if (!document.querySelector('#notificationStyles')) {

    if (type === 'error') icon = 'exclamation-circle';        const style = document.createElement('style');

            style.id = 'notificationStyles';

    notification.innerHTML = `        style.textContent = `

        <div class="notification-content">            .notification {

            <i class="fas fa-${icon}"></i>                position: fixed;

            <span>${message}</span>                top: 90px;

            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">                right: 20px;

                <i class="fas fa-times"></i>                z-index: 1001;

            </button>                max-width: 400px;

        </div>                border-radius: 10px;

    `;                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

                    animation: slideIn 0.3s ease;

    // Add notification styles            }

    if (!document.querySelector('#notificationStyles')) {            

        const style = document.createElement('style');            .notification-success {

        style.id = 'notificationStyles';                background: #10b981;

        style.textContent = `                color: white;

            .notification {            }

                position: fixed;            

                top: 90px;            .notification-info {

                right: 20px;                background: #2563eb;

                z-index: 1001;                color: white;

                max-width: 400px;            }

                border-radius: 10px;            

                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);            .notification-content {

                animation: slideIn 0.3s ease;                display: flex;

            }                align-items: center;

                            padding: 1rem 1.5rem;

            .notification-success {                gap: 0.75rem;

                background: #10b981;            }

                color: white;            

            }            .notification-close {

                            background: none;

            .notification-info {                border: none;

                background: #2563eb;                color: white;

                color: white;                cursor: pointer;

            }                margin-left: auto;

                            opacity: 0.8;

            .notification-error {                transition: opacity 0.2s ease;

                background: #ef4444;            }

                color: white;            

            }            .notification-close:hover {

                            opacity: 1;

            .notification-content {            }

                display: flex;            

                align-items: center;            @keyframes slideIn {

                padding: 1rem 1.5rem;                from {

                gap: 0.75rem;                    transform: translateX(100%);

            }                    opacity: 0;

                            }

            .notification-close {                to {

                background: none;                    transform: translateX(0);

                border: none;                    opacity: 1;

                color: white;                }

                cursor: pointer;            }

                margin-left: auto;        `;

                opacity: 0.8;        document.head.appendChild(style);

                transition: opacity 0.2s ease;    }

            }    

                // Add to page

            .notification-close:hover {    document.body.appendChild(notification);

                opacity: 1;    

            }    // Auto remove after 5 seconds

                setTimeout(() => {

            @keyframes slideIn {        if (notification.parentElement) {

                from {            notification.style.animation = 'slideOut 0.3s ease forwards';

                    transform: translateX(100%);            setTimeout(() => notification.remove(), 300);

                    opacity: 0;        }

                }    }, 5000);

                to {}

                    transform: translateX(0);

                    opacity: 1;// Intersection Observer for animations

                }const observerOptions = {

            }    threshold: 0.1,

                rootMargin: '0px 0px -50px 0px'

            @keyframes slideOut {};

                from {

                    transform: translateX(0);const observer = new IntersectionObserver(function(entries) {

                    opacity: 1;    entries.forEach(entry => {

                }        if (entry.isIntersecting) {

                to {            entry.target.classList.add('animate-in');

                    transform: translateX(100%);        }

                    opacity: 0;    });

                }}, observerOptions);

            }

        `;// Observe elements for animation

        document.head.appendChild(style);document.addEventListener('DOMContentLoaded', function() {

    }    const elementsToAnimate = document.querySelectorAll('.service-card, .solution-card, .feature-card, .stat-item');

        elementsToAnimate.forEach(element => {

    // Add to page        observer.observe(element);

    document.body.appendChild(notification);    });

    });

    // Auto remove after 5 seconds

    setTimeout(() => {// Add animation styles

        if (notification.parentElement) {const animationStyles = document.createElement('style');

            notification.style.animation = 'slideOut 0.3s ease forwards';animationStyles.textContent = `

            setTimeout(() => notification.remove(), 300);    .service-card,

        }    .solution-card,

    }, 5000);    .feature-card,

}    .stat-item {

        opacity: 0;

// Intersection Observer for animations        transform: translateY(30px);

document.addEventListener('DOMContentLoaded', function() {        transition: all 0.6s ease;

    const observerOptions = {    }

        threshold: 0.1,    

        rootMargin: '0px 0px -50px 0px'    .service-card.animate-in,

    };    .solution-card.animate-in,

    .feature-card.animate-in,

    const observer = new IntersectionObserver(function(entries) {    .stat-item.animate-in {

        entries.forEach(entry => {        opacity: 1;

            if (entry.isIntersecting) {        transform: translateY(0);

                entry.target.classList.add('animate-in');    }

            }    

        });    @keyframes slideOut {

    }, observerOptions);        from {

            transform: translateX(0);

    // Observe elements for animation            opacity: 1;

    const elementsToAnimate = document.querySelectorAll('.service-card, .solution-card, .feature-card, .stat-item');        }

    if (elementsToAnimate.length > 0) {        to {

        elementsToAnimate.forEach(element => {            transform: translateX(100%);

            observer.observe(element);            opacity: 0;

        });        }

    }    }

    `;

    // Add animation stylesdocument.head.appendChild(animationStyles);

    if (!document.querySelector('#animationStyles')) {

        const animationStyles = document.createElement('style');// Stats counter animation

        animationStyles.id = 'animationStyles';function animateCounter(element, target, duration = 2000) {

        animationStyles.textContent = `    const start = 0;

            .service-card,    const increment = target / (duration / 16);

            .solution-card,    let current = start;

            .feature-card,    

            .stat-item {    const timer = setInterval(() => {

                opacity: 0;        current += increment;

                transform: translateY(30px);        if (current >= target) {

                transition: all 0.6s ease;            current = target;

            }            clearInterval(timer);

                    }

            .service-card.animate-in,        

            .solution-card.animate-in,        // Format numbers

            .feature-card.animate-in,        let displayValue = Math.floor(current);

            .stat-item.animate-in {        if (element.textContent.includes('%')) {

                opacity: 1;            displayValue += '%';

                transform: translateY(0);        } else if (element.textContent.includes('+')) {

            }            displayValue += '+';

        `;        }

        document.head.appendChild(animationStyles);        

    }        element.textContent = displayValue;

});    }, 16);

}

// Stats counter animation

function animateCounter(element, target, duration = 2000) {// Trigger counter animations when stats section comes into view

    const start = 0;const statsObserver = new IntersectionObserver(function(entries) {

    const increment = target / (duration / 16);    entries.forEach(entry => {

    let current = start;        if (entry.isIntersecting) {

                const statNumbers = entry.target.querySelectorAll('.stat-number');

    const timer = setInterval(() => {            statNumbers.forEach(statNumber => {

        current += increment;                const text = statNumber.textContent;

        if (current >= target) {                const number = parseInt(text.replace(/[^0-9]/g, ''));

            current = target;                if (number > 0) {

            clearInterval(timer);                    statNumber.textContent = '0';

        }                    animateCounter(statNumber, number);

                        }

        // Format numbers            });

        let displayValue = Math.floor(current);            statsObserver.unobserve(entry.target);

        if (element.textContent.includes('%')) {        }

            displayValue += '%';    });

        } else if (element.textContent.includes('+')) {}, { threshold: 0.5 });

            displayValue += '+';

        }document.addEventListener('DOMContentLoaded', function() {

            const statsSection = document.querySelector('.stats');

        element.textContent = displayValue;    if (statsSection) {

    }, 16);        statsObserver.observe(statsSection);

}    }

});

// Trigger counter animations when stats section comes into view

document.addEventListener('DOMContentLoaded', function() {// Form validation

    const statsObserver = new IntersectionObserver(function(entries) {function validateForm(form) {

        entries.forEach(entry => {    const requiredFields = form.querySelectorAll('[required]');

            if (entry.isIntersecting) {    let isValid = true;

                const statNumbers = entry.target.querySelectorAll('.stat-number');    

                statNumbers.forEach(statNumber => {    requiredFields.forEach(field => {

                    const text = statNumber.textContent;        const value = field.value.trim();

                    const number = parseInt(text.replace(/[^0-9]/g, ''));        

                    if (number > 0) {        // Remove existing error styling

                        statNumber.textContent = '0';        field.classList.remove('error');

                        animateCounter(statNumber, number);        

                    }        // Check if field is empty

                });        if (!value) {

                statsObserver.unobserve(entry.target);            field.classList.add('error');

            }            isValid = false;

        });            return;

    }, { threshold: 0.5 });        }

        

    const statsSection = document.querySelector('.stats');        // Email validation

    if (statsSection) {        if (field.type === 'email') {

        statsObserver.observe(statsSection);            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    }            if (!emailRegex.test(value)) {

});                field.classList.add('error');

                isValid = false;

// Add form error styling            }

document.addEventListener('DOMContentLoaded', function() {        }

    if (!document.querySelector('#formStyles')) {    });

        const formStyles = document.createElement('style');    

        formStyles.id = 'formStyles';    return isValid;

        formStyles.textContent = `}

            .form-group input.error,

            .form-group select.error,// Add error styling for form validation

            .form-group textarea.error {const formStyles = document.createElement('style');

                border-color: #ef4444;formStyles.textContent = `

                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);    .form-group input.error,

            }    .form-group select.error,

        `;    .form-group textarea.error {

        document.head.appendChild(formStyles);        border-color: #ef4444;

    }        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);

});    }

`;

console.log('Badger Technologies website loaded successfully!');document.head.appendChild(formStyles);

// Add error notification styling
const errorNotificationStyle = document.createElement('style');
errorNotificationStyle.textContent = `
    .notification-error {
        background: #ef4444;
        color: white;
    }
`;
document.head.appendChild(errorNotificationStyle);

// Update notification function to handle error type
const originalShowNotification = showNotification;
showNotification = function(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
};

console.log('Badger Technologies website loaded successfully!');
