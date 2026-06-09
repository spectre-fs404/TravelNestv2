document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('custom-cursor');
    
    if (!cursor) return;

    // 1. Smoothly track cursor coordinates
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // 2. Scale cursor on interactive text elements
    const textElements = document.querySelectorAll('a, button, .navbar ul li, h1, h2, h3, h4');
    textElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('is-hovering-text'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering-text'));
    });

    // 3. Shift blend mode context on images
    const imageElements = document.querySelectorAll('img, .img-box');
    imageElements.forEach(img => {
        img.addEventListener('mouseenter', () => cursor.classList.add('is-hovering-image'));
        img.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering-image'));
    });
});

