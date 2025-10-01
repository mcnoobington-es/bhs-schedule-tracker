const hamburger = document.getElementById('hamburger');
const wrapper = document.getElementById('wrapper');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        // Toggle active class on hamburger (for animation)
        hamburger.classList.toggle('active');
        
        // Toggle active class on wrapper (to show/hide menu)
        wrapper.classList.toggle('active');
    });

    // Close menu when clicking a link
    const menuLinks = wrapper.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            wrapper.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = wrapper.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger && wrapper.classList.contains('active')) {
            hamburger.classList.remove('active');
            wrapper.classList.remove('active');
        }
    });
}