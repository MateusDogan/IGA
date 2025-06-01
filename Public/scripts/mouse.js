// script.js

const customCursor = document.getElementById('custom-cursor');
const clickableObjects = document.querySelectorAll('.clickable-object'); // Get all clickable objects

if (customCursor) {
    // --- Initial State ---
    customCursor.style.opacity = '0';
    customCursor.style.visibility = 'hidden';

    // --- Mouse Movement ---
    document.addEventListener('mousemove', (e) => {
        if (customCursor.style.opacity === '0') {
            customCursor.style.opacity = '1';
            customCursor.style.visibility = 'visible';
        }
        customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });

    // --- Hide/Show on Document Leave/Enter ---
    document.documentElement.addEventListener('mouseleave', () => {
        customCursor.style.opacity = '0';
        customCursor.style.visibility = 'hidden';
    });

    document.documentElement.addEventListener('mouseenter', () => {
        customCursor.style.opacity = '1';
        customCursor.style.visibility = 'visible';
    });

    // --- NEW: Handle Cursor Enlargement on Clickable Objects ---

    let currentHoveredClickable = null; // To track the currently hovered clickable object

    document.documentElement.addEventListener('mouseover', (e) => {
        // Check if the target element (or any of its parents) is a clickable object
        const target = e.target.closest('.clickable-object');

        if (target && target !== currentHoveredClickable) {
            // Mouse entered a new clickable object
            customCursor.classList.add('is-enlarged');
            currentHoveredClickable = target; // Store the currently hovered object
        } else if (!target && currentHoveredClickable) {
            // Mouse left the previously hovered clickable object
            customCursor.classList.remove('is-enlarged');
            currentHoveredClickable = null; // Clear the tracked object
        }
    });

} else {
    console.error("Error: Custom cursor element not found. Make sure <div id='custom-cursor'> is in your HTML.");
}