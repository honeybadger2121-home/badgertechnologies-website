document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-links');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(menu.classList.contains('open')));
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    document.querySelectorAll('form[data-validate="true"]').forEach(form => {
        form.addEventListener('submit', (event) => {
            const required = form.querySelectorAll('[required]');
            let valid = true;

            required.forEach(field => {
                field.classList.remove('input-error');
                if (!field.value.trim()) {
                    field.classList.add('input-error');
                    valid = false;
                }
            });

            const email = form.querySelector('input[type="email"]');
            if (email && email.value.trim()) {
                const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!pattern.test(email.value.trim())) {
                    email.classList.add('input-error');
                    valid = false;
                }
            }

            if (!valid) {
                event.preventDefault();
                alert('Please complete the required fields before sending your request.');
            }
        });
    });
});
