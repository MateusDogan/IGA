document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    let lastScrollTop = 0;
    const scrollThreshold = 50; // Adjust this value (px) to control sensitivity

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                const isScrollingDown = currentScroll > lastScrollTop;

                // Hide header immediately on scroll down (if past a small threshold)
                if (isScrollingDown && currentScroll > 10) { // 10px buffer to prevent accidental triggers
                    header.classList.add('header-hide');
                } 
                // Show header when scrolling up
                else {
                    header.classList.remove('header-hide');
                }

                // Toggle solid background after hero (100vh)
                if (currentScroll > window.innerHeight) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }

                lastScrollTop = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
});