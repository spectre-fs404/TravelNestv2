// cursor animtion 
const cursor = document.getElementById('custom-cursor');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let posX = mouseX, posY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Find out what element the mouse is interacting with
    const target = e.target;

    if (!target) return;

    // 1. Check if hovering over text elements
    const isText = target.matches('h1, h2, h3, h4, h5, h6, p, a, span, strong, em,button');

    // 2. Check if hovering over an image
    const isImage = target.matches('img, svg, picture, .image-container');

    if (isText) {
        cursor.classList.add('is-hovering-text');
        cursor.classList.remove('is-hovering-image');
    } else if (isImage) {
        cursor.classList.add('is-hovering-image');
        cursor.classList.remove('is-hovering-text');
    } else {
        // Reset to default state if background or other containers
        cursor.classList.remove('is-hovering-text', 'is-hovering-image');
    }
});

// Smooth lerp (linear interpolation) animation loop
function animate() {
    posX += (mouseX - posX) * 0.15; // Lower = smoother/laggier, Higher = snappier
    posY += (mouseY - posY) * 0.15;

    cursor.style.left = posX + 'px';
    cursor.style.top = posY + 'px';

    requestAnimationFrame(animate);
}
animate();
// end of the cursor animation 


document.addEventListener("DOMContentLoaded", () => {
    // --- 0. MOBILE MENU TOGGLE ---
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const navbar = document.getElementById("navbar");
    const menuOverlay = document.getElementById("menu-overlay");

    if (menuToggle && navbar && menuOverlay) {

        // Wrap the toggle logic in a reusable function
        function toggleMobileMenu() {
            navbar.classList.toggle("open");
            menuToggle.classList.toggle("open");
            menuOverlay.classList.toggle("open"); // Toggles the blur overlay
            document.body.classList.toggle("no-scroll");
        }

        // Open/Close via hamburger
        menuToggle.addEventListener("click", toggleMobileMenu);

        // Close via clicking the blurred background
        menuOverlay.addEventListener("click", toggleMobileMenu);
    }

    // --- 1. HERO PARALLAX & RESIZING SCROLL SYSTEM ---
    const heroContainer = document.querySelector('.hero-container');
    const navBarContainer = document.querySelector('.nav-bar-container');
    const heroBanner = document.querySelector('.hero-banner');
    const textHero = document.querySelector('.text-container-hero');

    const handleScrollAnimation = () => {
        // PREVENT SCROLL ANIMATION ON MOBILE & TABLET DEVICES
        // Change this from 768 to 1024
        if (window.innerWidth <= 1024) {
            return;
        }



        const scrolled = window.scrollY;
        const maxScroll = window.innerHeight; // Matches 100vh
        const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1);

        let width, height, topPos, borderRadius, bgColor;

        if (progress <= 0.3) {
            // Phase 1: 0% to 30%
            const localP = progress / 0.3;
            width = (100 - (100 - 96) * localP) + 'vw';
            height = (100 - (100 - 80) * localP) + 'vh';
            topPos = (0 + (10 - 0) * localP) + 'px';
            borderRadius = (0 + (12 - 0) * localP) + 'px';
            bgColor = 'rgba(0, 0, 0, 1)';
        }
        else if (progress <= 0.6) {
            // Phase 2: 30% to 60%
            const localP = (progress - 0.3) / 0.3;
            width = (96 - (96 - 95) * localP) + 'vw';
            height = (80 - (80 - 40) * localP) + 'vh';
            topPos = (10 + (15 - 10) * localP) + 'px';
            borderRadius = (12 + (25 - 12) * localP) + 'px';
            bgColor = 'rgba(0, 0, 0, 1)';
        }
        else if (progress <= 0.8) {
            // Phase 3: 60% to 80%
            const localP = (progress - 0.6) / 0.2;
            width = '95vw';

            const startH = maxScroll * 0.4;
            const endH = 120;
            height = (startH - (startH - endH) * localP) + 'px';
            topPos = (15 + (18 - 15) * localP) + 'px';
            borderRadius = (25 + (35 - 25) * localP) + 'px';
            bgColor = 'rgba(0, 0, 0, 1)';
        }
        else {
            // Phase 4: 80% to 100%
            const localP = (progress - 0.8) / 0.2;
            width = '95vw';
            height = (120 - (120 - 50) * localP) + 'px';
            topPos = (18 + (20 - 18) * localP) + 'px';
            borderRadius = (35 + (40 - 35) * localP) + 'px';
            bgColor = `rgba(0, 0, 0, ${1 - localP})`;
        }

        if (heroContainer) {
            heroContainer.style.width = width;
            heroContainer.style.height = height;
            heroContainer.style.top = topPos;
            heroContainer.style.borderRadius = borderRadius;
            heroContainer.style.backgroundColor = bgColor;
        }

        if (navBarContainer) {
            const topN = (20 - 20 * progress) + 'px';
            const leftN = (20 - 20 * progress) + 'px';
            const rightN = (20 - 20 * progress) + 'px';
            const radiusN = (600 - 560 * progress) + 'px';

            const rG = Math.round(87 - 87 * progress);
            const alpha = 0.15 + (0.699 - 0.15) * progress;

            navBarContainer.style.top = topN;
            navBarContainer.style.left = leftN;
            navBarContainer.style.right = rightN;
            navBarContainer.style.borderRadius = radiusN;
            navBarContainer.style.background = `rgba(${rG}, ${rG}, ${rG}, ${alpha})`;
        }

        if (heroBanner) {
            let fadeP = (scrolled - 250) / (550 - 250);
            fadeP = Math.min(Math.max(fadeP, 0), 1);
            heroBanner.style.opacity = 1 - fadeP;
            heroBanner.style.pointerEvents = fadeP === 1 ? 'none' : 'auto';
        }

        if (textHero) {
            let textP = scrolled / 250;
            textP = Math.min(Math.max(textP, 0), 1);
            textHero.style.opacity = 1 - textP;
            textHero.style.transform = `translateY(${-20 * textP}px)`;
            textHero.style.pointerEvents = textP === 1 ? 'none' : 'auto';
        }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {

        // --- ADDED: MOBILE/TABLET STICKY BLACK MENU LOGIC ---
        // This adds the "scrolled" class when scrolling down, 
        // triggering the black capsule CSS we added earlier.
        if (window.innerWidth <= 1024 && navBarContainer) {
            if (window.scrollY > 20) {
                navBarContainer.classList.add('scrolled');
            } else {
                navBarContainer.classList.remove('scrolled');
            }
        }
        // ----------------------------------------------------

        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScrollAnimation();
                ticking = false;
            });
            ticking = true;
        }
    });


    // --- 2. INFINITE BACKGROUND HERO SLIDER ---
    const slides = document.querySelectorAll(".slide");
    const overlay = document.querySelector(".hero-banner .overlay");
    let index = 0;
    let firstRun = true;

    function nextSlide() {
        if (!overlay || slides.length === 0) return;
        overlay.style.opacity = 1;

        setTimeout(() => {
            slides[index].classList.remove("active");
            index = (index + 1) % slides.length;
            slides[index].classList.add("active");
            overlay.style.opacity = 0;

            if (firstRun) {
                clearInterval(auto);
                auto = setInterval(nextSlide, 6000);
                firstRun = false;
            }
        }, 400);
    }
    let auto = setInterval(nextSlide, 3500);



});


////////////////////////////////////
// menu hero and cursor animations
////////////////////////////////////



// /////////////////////////////////////////
// footer 
// /////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const messageEl = document.getElementById('newsletter-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevents the page from refreshing
        const email = emailInput.value.trim();

        if (email) {
            // Retrieve existing subscribers from localStorage, or start an empty array
            let subscribers = JSON.parse(localStorage.getItem('travelNestSubscribers')) || [];
            
            if (!subscribers.includes(email)) {
                // Add new email and save back to localStorage
                subscribers.push(email);
                localStorage.setItem('travelNestSubscribers', JSON.stringify(subscribers));
                
                // Show success message
                messageEl.textContent = "Thank you for subscribing!";
                messageEl.className = "newsletter-message msg-success";
                emailInput.value = ''; // Clear the input field
            } else {
                // Handle already subscribed emails
                messageEl.textContent = "You're already on our list!";
                messageEl.className = "newsletter-message msg-info";
            }
            
            // Optional: Clear the message after 4 seconds
            setTimeout(() => {
                messageEl.textContent = "";
                messageEl.className = "newsletter-message";
            }, 4000);
        }
    });
});


// end of the footer script 
