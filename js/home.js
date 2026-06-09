

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


    // --- 3. CONSOLIDATED SCROLL REVEAL (DESTINATION OF THE DAY) ---
    const destinationSection = document.querySelector('.Destination-otd');

    if (destinationSection) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-scroll');
                    entry.target.classList.add('reveal-active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        revealObserver.observe(destinationSection);
    }

    // --- 4. DESTINATION CARD EXPANSION TRIGGER ---
    const destinationCard = document.querySelector('.destination-card-wrapper');

    if (destinationCard) {
        const expansionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Opens the card when it comes into view and keeps it open
                    entry.target.classList.add('expanded');
                    expansionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5 // Waits until card is 50% into view
        });

        expansionObserver.observe(destinationCard);
    }
// --- 5. POPULAR DESTINATIONS: INFINITE HOVER SLIDER ---
    const sliderContainer = document.querySelector('.pop-d-img-slider-container');
    let sliderPos = 0;
    let sliderSpeed = 1;
    let isHovered = false; // Controls desktop pause
    let isDragging = false; // NEW: Controls mobile touch pause
    
    // NEW: Variables to track finger movement
    let touchStartX = 0;
    let touchCurrentX = 0;

    if (sliderContainer) {
        // Desktop hover logic (Unchanged)
        sliderContainer.addEventListener('mouseenter', () => { isHovered = true; });
        sliderContainer.addEventListener('mouseleave', () => { isHovered = false; });

        // --- NEW: MOBILE TOUCH LOGIC ---
        sliderContainer.addEventListener('touchstart', (e) => {
            isDragging = true; // Pause the auto-scroll
            touchStartX = e.touches[0].clientX; // Record where the finger landed
        }, { passive: true });

        sliderContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            touchCurrentX = e.touches[0].clientX;
            const diffX = touchStartX - touchCurrentX; // How far did they swipe?
            
            sliderPos -= diffX; // Move slider with the finger
            touchStartX = touchCurrentX; // Reset for the next frame of movement

            // FIX: If the user swipes RIGHT (backwards), we need to pull 
            // the last card to the front so they don't see empty space.
            if (sliderPos > 0) {
                const lastCard = sliderContainer.lastElementChild;
                if (lastCard) {
                    const cardWidth = lastCard.offsetWidth + 30; // 30px gap
                    sliderPos -= cardWidth;
                    sliderContainer.insertBefore(lastCard, sliderContainer.firstElementChild);
                }
            }

            sliderContainer.style.transform = `translateX(${sliderPos}px)`;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', () => {
            isDragging = false; // Resume auto-scroll when finger lifts
        });
        // -------------------------------

        const autoSlide = () => {
            // Only auto-slide if mouse is NOT hovering AND finger is NOT dragging
            if (!isHovered && !isDragging) {
                sliderPos -= sliderSpeed;

                const firstCard = sliderContainer.firstElementChild;
                if (firstCard) {
                    const cardWidth = firstCard.offsetWidth + 30; // 30 is the gap

                    // Handle wrapping when auto-sliding LEFT
                    if (Math.abs(sliderPos) >= cardWidth && sliderPos < 0) {
                        sliderPos += cardWidth;
                        sliderContainer.appendChild(firstCard);
                    }
                }
                sliderContainer.style.transform = `translateX(${sliderPos}px)`;
            }
            requestAnimationFrame(autoSlide);
        };
        autoSlide();
    }

    // --- 6. INTERSECTION BACKGROUND FADE FOR SECTION 3 (ABOUT US) ---
    const wrapper = document.querySelector('.page-content-wrapper');
    const aboutSection = document.querySelector('.about-us');

    if (wrapper && aboutSection) {
        // intentionally left blank: no scroll-triggered background behavior for the About Us section
    }


// destination of the day logic

//moved up to seperate js file

// end of the destination of the day logic