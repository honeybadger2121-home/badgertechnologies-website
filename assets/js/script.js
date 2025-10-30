// Badger Technologies - Minimal Safe JavaScript
console.log('Badger Technologies script loading...');

// Safe DOM ready wrapper
function safeReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            try { fn(); } catch(e) { console.log('DOM ready error:', e.message); }
        });
    } else {
        try { fn(); } catch(e) { console.log('Immediate execution error:', e.message); }
    }
}

// Mobile navigation - only if elements exist
safeReady(function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
});

// Basic form validation
function validateForm(form) {
    if (!form) return false;
    
    const required = form.querySelectorAll('[required]');
    let valid = true;
    
    if (required) {
        required.forEach(function(field) {
            if (!field.value || !field.value.trim()) {
                valid = false;
                field.style.borderColor = '#ef4444';
            } else {
                field.style.borderColor = '';
            }
        });
    }
    
    return valid;
}

console.log('Badger Technologies website loaded successfully!');
