// Cookie Consent Banner JavaScript
// Check if user has already made a choice
function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        // User hasn't made a choice yet, show the banner
        showCookieBanner();
    }
}

// Show the cookie consent banner
function showCookieBanner() {
    const banner = document.getElementById('cookie-consent');
    if (banner) {
        banner.classList.add('show');
    }
}

// Hide the cookie consent banner
function hideCookieBanner() {
    const banner = document.getElementById('cookie-consent');
    if (banner) {
        banner.classList.remove('show');
        // Add fade out animation
        banner.style.animation = 'slideDown 0.5s ease';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 500);
    }
}

// Handle accept button click
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    hideCookieBanner();
}

// Handle decline button click
function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    hideCookieBanner();
}

// Add slide down animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to buttons
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', acceptCookies);
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', declineCookies);
    }
    
    consent = null;

    // Check if we should show the banner
    checkCookieConsent();
});