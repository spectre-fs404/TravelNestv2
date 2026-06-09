document.addEventListener('DOMContentLoaded', () => {
    // 1. Replaced local files with reliable online ambient sound placeholders
    const audioFiles = {
        beach: new Audio('../../assets/audio/beach.mp3'),
        forest: new Audio('../../assets/audio/forest.mp3'),
        city: new Audio('../../assets/audio/city.mp3'),
        hills: new Audio('../../assets/audio/hills.mp3')
    };

    Object.values(audioFiles).forEach(audio => { audio.loop = true; audio.volume = 0.5; });
    let currentAudio = null;

    const wrapper = document.getElementById('mood-page-wrapper');
    const pills = document.querySelectorAll('.mood-pill');
    const audioStatus = document.getElementById('audio-status');
    const vibeText = document.getElementById('current-vibe-text');

    const videoElement = document.getElementById('destination-video');
    const destTitle = document.getElementById('destination-title');
    const destLocation = document.getElementById('destination-location');
    const slider = document.getElementById('mood-slider');

    const btnVisited = document.getElementById('btn-visited');
    const btnPlanned = document.getElementById('btn-planned');

    let allDestinations = [];
    let currentDestination = null;

    // 2. FIXED FETCH PATH: Changed backslash (\) to forward slash (/)
    fetch('/data/destinations.json')
        .then(res => {
            if (!res.ok) throw new Error("Failed to load JSON");
            return res.json();
        })
        .then(data => {
            allDestinations = data;
            setMood('beach'); // Initialize default mood
        })
        .catch(err => console.error("Error fetching destinations:", err));

    pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const mood = e.currentTarget.getAttribute('data-mood');
            pills.forEach(p => p.classList.remove('active'));
            e.currentTarget.classList.add('active');
            setMood(mood);
        });
    });

    function setMood(mood) {
        wrapper.className = `tn-cinematic-window vibe-${mood}`;
        vibeText.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);

        if (currentAudio) currentAudio.pause();
        currentAudio = audioFiles[mood];

        currentAudio.play().then(() => {
            audioStatus.classList.add('playing');
            audioStatus.querySelector('span').innerHTML = `<i class="fa-solid fa-volume-high"></i> Playing`;
        }).catch(() => {
            audioStatus.classList.remove('playing');
            audioStatus.querySelector('span').innerHTML = `<i class="fa-solid fa-volume-xmark"></i> Click to Play`;
        });

        const filtered = allDestinations.filter(d => d.mood && d.mood.toLowerCase() === mood);

        if (filtered.length > 0) {
            loadDestination(filtered[0]);
            buildSlider(filtered);
        }
    }

    function loadDestination(dest) {
        currentDestination = dest;
        const globalBgVideo = document.getElementById('global-bg-video');

        // Smooth text swap
        destTitle.style.opacity = 0;
        setTimeout(() => {
            destTitle.textContent = dest.name;
            destLocation.textContent = dest.country || "Unknown Location";
            destTitle.style.opacity = 1;
        }, 200);

        // Smooth video swap
        videoElement.style.opacity = 0;
        if (globalBgVideo) globalBgVideo.style.opacity = 0;

        setTimeout(() => {
            if (dest.video) {
                // 1. Update and force-play main cinematic window video
                videoElement.src = dest.video;
                videoElement.style.opacity = 1;
                videoElement.play().catch(e => console.log("Playback blocked:", e));

                // 2. Update and force-play full page blurred background video
                if (globalBgVideo) {
                    globalBgVideo.src = dest.video;
                    globalBgVideo.style.opacity = 0.4;
                    globalBgVideo.play().catch(e => console.log("Playback blocked:", e));
                }
            }
        }, 400);

        resetButtons();
    }

    function buildSlider(destinations) {
        slider.innerHTML = '';
        destinations.forEach(dest => {
            const card = document.createElement('div');
            card.className = 'slider-card';
            card.style.backgroundImage = `url(${dest.image || ''})`;
            card.innerHTML = `<h4>${dest.name}</h4>`;

            card.addEventListener('click', () => loadDestination(dest));
            slider.appendChild(card);
        });
    }

    function resetButtons() {
        if (!currentDestination) return;
        let visited = JSON.parse(localStorage.getItem('explorer_visited')) || [];
        let wishlist = JSON.parse(localStorage.getItem('explorer_wishlist')) || [];

        if (visited.includes(currentDestination.name)) {
            btnVisited.innerHTML = "<i class='fa-solid fa-check-double'></i> Visited";
            btnVisited.style.background = "var(--vibe-accent)";
            btnVisited.style.color = "#000";
        } else {
            btnVisited.innerHTML = "<i class='fa-solid fa-check'></i> Mark Visited";
            btnVisited.style.background = "rgba(255, 255, 255, 0.1)";
            btnVisited.style.color = "#fff";
        }

        if (wishlist.includes(currentDestination.name)) {
            btnPlanned.innerHTML = "<i class='fa-solid fa-bookmark'></i> Saved";
            btnPlanned.style.borderColor = "var(--vibe-accent)";
            btnPlanned.style.color = "var(--vibe-accent)";
        } else {
            btnPlanned.innerHTML = "<i class='fa-regular fa-bookmark'></i> Wishlist";
            btnPlanned.style.borderColor = "rgba(255,255,255,0.2)";
            btnPlanned.style.color = "#fff";
        }
    }

    btnVisited.addEventListener('click', () => {
        let visited = JSON.parse(localStorage.getItem('explorer_visited')) || [];
        if (!visited.includes(currentDestination.name)) {
            visited.push(currentDestination.name);
            localStorage.setItem('explorer_visited', JSON.stringify(visited));
            resetButtons();
        }
    });

    btnPlanned.addEventListener('click', () => {
        let wishlist = JSON.parse(localStorage.getItem('explorer_wishlist')) || [];
        if (!wishlist.includes(currentDestination.name)) {
            wishlist.push(currentDestination.name);
            localStorage.setItem('explorer_wishlist', JSON.stringify(wishlist));
            resetButtons();
        }
    });

    // Toggle audio on click
    audioStatus.addEventListener('click', () => {
        if (currentAudio.paused) {
            currentAudio.play();
            audioStatus.classList.add('playing');
            audioStatus.querySelector('span').innerHTML = `<i class="fa-solid fa-volume-high"></i> Playing`;
        } else {
            currentAudio.pause();
            audioStatus.classList.remove('playing');
            audioStatus.querySelector('span').innerHTML = `<i class="fa-solid fa-volume-xmark"></i> Paused`;
        }
    });


    // --- NAVBAR AUTO-HIDE ON SCROLL ---
    const navbar = document.querySelector('.nav-bar-container');
    const moodSection = document.getElementById('mood-page-wrapper');

    if (navbar && moodSection) {
        const observerOptions = {
            root: null, // uses the browser viewport
            threshold: 0.1 // triggers when 10% of the mood section is visible
        };

        const navbarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Hide navbar when mood section enters the screen
                    navbar.classList.add('navbar-hidden');
                } else {
                    // Show navbar when scrolling away/up
                    navbar.classList.remove('navbar-hidden');
                }
            });
        }, observerOptions);

        navbarObserver.observe(moodSection);
    }
});