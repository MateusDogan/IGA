const customCursor = document.getElementById('custom-cursor');

if (customCursor) {
    let mouseX = 0;
    let mouseY = 0;
    let rAF; // To store the requestAnimationFrame ID

    // Function to update cursor position, called by requestAnimationFrame
    function updateCursorPosition() {
        customCursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        rAF = null; // Clear the rAF ID after the update
    }

    // --- Mouse Movement (Optimized with requestAnimationFrame) ---
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Request animation frame only if one isn't already pending
        if (!rAF) {
            rAF = requestAnimationFrame(updateCursorPosition);
        }
    });

    // --- Hide/Show on Document Leave/Enter ---
    // Keep these if you want the cursor to hide when leaving the browser window
    document.documentElement.addEventListener('mouseleave', () => {
        customCursor.style.visibility = 'hidden';
        // If an rAF is pending, cancel it to prevent updates while hidden
        if (rAF) {
            cancelAnimationFrame(rAF);
            rAF = null;
        }
    });

    document.documentElement.addEventListener('mouseenter', () => {
        customCursor.style.visibility = 'visible';
    });

    const clickableObjects = document.querySelectorAll('.clickable-object, a, button, input[type="button"], input[type="submit"], input[type="reset"]'); // Add other elements as needed

    clickableObjects.forEach(obj => {
        obj.addEventListener('pointerenter', () => {
            customCursor.classList.add('is-enlarged');
        });
        obj.addEventListener('pointerleave', () => {
            customCursor.classList.remove('is-enlarged');
        });
    });

    // --- Handle Click Animation ---
    document.addEventListener('mousedown', () => {
        customCursor.classList.add('is-clicked');
    });

    document.addEventListener('mouseup', () => {
        customCursor.classList.remove('is-clicked');
    });

} else {
    console.error("Error: Custom cursor element not found. Make sure <div id='custom-cursor'> is in your HTML.");
}