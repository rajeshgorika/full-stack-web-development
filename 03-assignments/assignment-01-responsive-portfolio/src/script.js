// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});
