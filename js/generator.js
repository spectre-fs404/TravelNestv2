document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tn-generator-form');
    const typeSelect = document.getElementById('travel-type');
    const budgetSelect = document.getElementById('budget-range');

    const resultContainer = document.getElementById('result-container');
    const destinationDisplay = document.getElementById('destination-display');
    const resultStatusText = document.getElementById('result-status');

    const btnSurprise = document.getElementById('btn-surprise-again');
    const btnSave = document.getElementById('btn-save-wishlist');

    let destinationsPool = [];
    let currentDestination = null;
    const ASSET_BASE_PATH = window.location.pathname.includes('/pages/') ? '../' : '';
    function normalizeAssetUrl(url) {
        return url && url.startsWith('assets/') ? ASSET_BASE_PATH + url : url;
    }

    // 1. Fetch JSON Data
    fetch('../data/destinations.json')
        .then(res => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then(data => {
            destinationsPool = data;
        })
        .catch(err => {
            console.error("Failed to load destinations:", err);
            resultStatusText.textContent = "Error loading destination database.";
        });

    // 2. Generate Logic
    function generateDestination() {
        const selectedType = typeSelect.value;
        const selectedBudget = budgetSelect.value;

        // Filter the pool based on dropdowns
        let filteredList = destinationsPool.filter(dest => {
            const matchType = selectedType === 'any' || dest.travelType === selectedType;
            const matchBudget = selectedBudget === 'any' || dest.budgetRange === selectedBudget;
            return matchType && matchBudget;
        });

        if (filteredList.length === 0) {
            // Fallback if combination doesn't exist in DB
            resultContainer.style.display = 'flex';
            destinationDisplay.style.display = 'none';
            btnSave.style.display = 'none';
            resultStatusText.textContent = "No exact matches found for that combo. Try changing the filters!";
            return;
        }

        // Pick a random destination from the filtered list
        const randomIndex = Math.floor(Math.random() * filteredList.length);
        currentDestination = filteredList[randomIndex];

        renderResult(currentDestination);
    }

    // 3. Render Output & Trigger Animation
    function renderResult(dest) {
        resultContainer.style.display = 'flex';
        destinationDisplay.style.display = 'block';
        btnSave.style.display = 'inline-flex';

        // Reset save button state
        btnSave.textContent = "Save to Wishlist";
        btnSave.disabled = false;
        btnSave.classList.replace('tn-btn-primary', 'tn-btn-success');
        resultStatusText.textContent = "We found the perfect spot for you!";

        // Populate UI Data
        document.getElementById('dest-img').src = normalizeAssetUrl(dest.image);
        document.getElementById('dest-name').textContent = dest.name;
        document.getElementById('dest-stars').textContent = dest.stars;
        document.getElementById('dest-location').textContent = `${dest.country}, ${dest.continent}`;
        document.getElementById('dest-desc').textContent = dest.description;
        document.getElementById('dest-type').textContent = dest.travelType;
        document.getElementById('dest-budget').textContent = `${dest.budgetRange} budget`;

        // Re-trigger CSS animation
        destinationDisplay.classList.remove('fade-in-pop');
        void destinationDisplay.offsetWidth; // Trigger reflow to restart animation
        destinationDisplay.classList.add('fade-in-pop');
    }

    // 4. Form Submit Event
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (destinationsPool.length === 0) return; // Wait for JSON to load
        generateDestination();
    });

    // 5. Surprise Me Again Button Event
    btnSurprise.addEventListener('click', () => {
        // Add quick spin animation to the button
        btnSurprise.classList.remove('spin-dice');
        void btnSurprise.offsetWidth;
        btnSurprise.classList.add('spin-dice');

        generateDestination();
    });

    // 6. Save to Wishlist (LocalStorage)
    btnSave.addEventListener('click', () => {
        if (!currentDestination) return;

        // Connect to your pre-existing wishlist key
        let wishlist = JSON.parse(localStorage.getItem('explorer_wishlist')) || [];
        const destName = currentDestination.name;

        // Check if the destination is already saved 
        // (Using .includes since your other explorer arrays look like arrays of strings)
        const alreadySaved = wishlist.includes(destName);

        if (!alreadySaved) {
            // Push just the name string to match your existing data structure
            wishlist.push(destName);
            localStorage.setItem('explorer_wishlist', JSON.stringify(wishlist));
        }

        // UI Feedback
        btnSave.textContent = "Saved to Wishlist! ✓";
        btnSave.classList.replace('tn-btn-success', 'tn-btn-primary');
        btnSave.disabled = true;
    });
});