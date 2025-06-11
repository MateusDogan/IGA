window.addEventListener('load', function() {
            // 1. Force scroll to the top of the page immediately on load
            // This ensures the hero section is always in view on a full refresh.
            window.scrollTo(0, 0);

            // 2. Clear the hash from the URL if it exists
            // This prevents the browser from trying to scroll to a specific section
            // based on the URL hash if the user explicitly clicked an anchor before refreshing.
            if (window.location.hash) {
                history.replaceState("", document.title, window.location.pathname + window.location.search);
                // Using replaceState is generally preferred here because it doesn't
                // add an extra entry to the browser history, making the back button behave as expected.
            }
        });

        // Optional: Smooth scroll for internal links (improves user experience)
        // Keep this separate as it handles clicks, not page loads.
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault(); // Prevent default hash behavior

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });