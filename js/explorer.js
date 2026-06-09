document.addEventListener("DOMContentLoaded", () => {
    // API Configuration Endpoint
    const DATA_SOURCE_URL = "data/destinations.json";

    // Core Application Storage Array Buffers
    let destinationsRegistry = [];
    let activeWishlist = JSON.parse(localStorage.getItem("explorer_wishlist")) || [];
    // NEW: Array buffer for booked destinations
    let activeBookings = JSON.parse(localStorage.getItem("explorer_bookings")) || [];

    // DOM Target Nodes
    const gridDisplayContainer = document.getElementById("destinations-display-grid");
    const searchInputField = document.getElementById("dest-search-input");
    const continentFilterSelect = document.getElementById("dest-continent-filter");

    // Alert Banner Components
    const wishlistBanner = document.getElementById("wishlist-banner");
    const wishlistCounterNode = document.getElementById("wishlist-count");

    // Modal DOM Nodes
    const detailModalWindow = document.getElementById("destination-detail-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modalHeroBg = document.getElementById("modal-hero-bg");
    const modalDestTitle = document.getElementById("modal-dest-title");
    const modalDestLocation = document.getElementById("modal-dest-location");
    const modalDestStars = document.getElementById("modal-dest-stars");
    const modalDestDescription = document.getElementById("modal-dest-description");
    const modalDestAttractions = document.getElementById("modal-dest-attractions");
    const modalWishlistToggleBtn = document.getElementById("modal-wishlist-toggle-btn");

    // NEW: Select the Book Now button using its class
    const bookNowBtn = document.querySelector(".modal-primary-action-btn");

    // Modal Cost Cells
    const cellAccommodation = document.getElementById("cost-cell-accommodation");
    const cellFood = document.getElementById("cost-cell-food");
    const cellTransport = document.getElementById("cost-cell-transport");

    let targetedModalRecordId = null;

    // Initialize Component Engine Data Sequence
    async function fetchDestinationsData() {
        try {
            const response = await fetch(DATA_SOURCE_URL);
            if (!response.ok) throw new Error(`HTTP network error status: ${response.status}`);
            destinationsRegistry = await response.json();
            renderGridMatrix(destinationsRegistry);
            synchronizeWishlistStatusBanner();
        } catch (error) {
            console.error("Critical error processing payload compilation:", error);
            gridDisplayContainer.innerHTML = `
                <div class="explorer-empty-state">
                    <p>⚠️ Unable to process destination profiles at this moment. Please check connection paths.</p>
                </div>`;
        }
    }

    // Main Card Matrix Rendering Engine
    function renderGridMatrix(recordsList) {
        if (recordsList.length === 0) {
            gridDisplayContainer.innerHTML = `
                <div class="explorer-empty-state">
                    <p><i class="fa fa-search"></i> No matching records found for your current filter query rules.</p>
                </div>`;
            return;
        }

        gridDisplayContainer.innerHTML = recordsList.map(item => {
            const isSaved = activeWishlist.includes(item.name);
            return `
                <article class="destination-display-card" data-id="${item.id}">
                    <div class="card-media-wrapper">
                        <button class="card-wishlist-toggle ${isSaved ? 'is-active' : ''}" 
                                data-id="${item.id}" 
                                aria-label="Toggle structural saved tracking profile">
                            ${isSaved ? '<i class="fa fa-heart" id ="fafa-heart-submitted"></i>' : '<i class="fa fa-heart" id ="fafa-heart-not-submitted"></i>'}
                        </button>
                        <img src="${item.image}" alt="${item.name}, ${item.country}" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600'">
                    </div>
                    <div class="card-details-panel">
                        <div class="card-title-row">
                            <h3>${item.name}</h3>
                            <span class="card-rating-stars">${item.stars}</span>
                        </div>
                        <p class="card-location-text">${item.country} • <span style="opacity: 0.7;">${item.continent}</span></p>
                        <button class="card-trigger-overlay-btn" data-action="explore" data-id="${item.id}">
                            View Details
                        </button>
                    </div>
                </article>
            `;
        }).join('');
    }

    // Evaluation Processing Filters
    function evaluateSearchAndFilterExecution() {
        const queryTerm = searchInputField.value.trim().toLowerCase();
        const selectedContinent = continentFilterSelect.value;

        const evaluatedSubset = destinationsRegistry.filter(destination => {
            const matchesSearch = destination.name.toLowerCase().includes(queryTerm) ||
                destination.country.toLowerCase().includes(queryTerm);
            const matchesContinent = (selectedContinent === "all") || (destination.continent === selectedContinent);
            return matchesSearch && matchesContinent;
        });

        renderGridMatrix(evaluatedSubset);
    }

    // Wishlist Vector Array Modification Updates
    function alternateWishlistState(targetId) {
        const parseId = parseInt(targetId, 10);
        const matchingProfile = destinationsRegistry.find(item => item.id === parseId);
        if (!matchingProfile) return;

        const destinationName = matchingProfile.name;
        const searchIndex = activeWishlist.indexOf(destinationName);

        if (searchIndex > -1) {
            activeWishlist.splice(searchIndex, 1);
        } else {
            activeWishlist.push(destinationName);
        }

        localStorage.setItem("explorer_wishlist", JSON.stringify(activeWishlist));

        evaluateSearchAndFilterExecution();
        synchronizeWishlistStatusBanner();

        if (detailModalWindow.classList.contains("is-visible") && targetedModalRecordId === parseId) {
            updateModalWishlistButtonState(activeWishlist.includes(destinationName));
        }
    }

    // NEW: Bookings Vector Array Modification Updates
    function alternateBookingState(targetId) {
        const parseId = parseInt(targetId, 10);
        const matchingProfile = destinationsRegistry.find(item => item.id === parseId);
        if (!matchingProfile) return;

        const destinationName = matchingProfile.name;
        const searchIndex = activeBookings.indexOf(destinationName);

        // Toggle logic: adds if not booked, removes if already booked
        if (searchIndex > -1) {
            activeBookings.splice(searchIndex, 1);
        } else {
            activeBookings.push(destinationName);
        }

        // Save to local storage
        localStorage.setItem("explorer_bookings", JSON.stringify(activeBookings));

        // Update the button visually inside the modal
        if (detailModalWindow.classList.contains("is-visible") && targetedModalRecordId === parseId) {
            updateModalBookButtonState(activeBookings.includes(destinationName));
        }
    }

    // Sync State Indicator Banners
    function synchronizeWishlistStatusBanner() {
        const count = activeWishlist.length;
        if (count > 0) {
            wishlistCounterNode.textContent = count;
            wishlistBanner.style.display = "block";
        } else {
            wishlistBanner.style.display = "none";
        }
    }

    // Modal Open Orchestrator Routing
    function executeOpenModalDetails(recordId) {
        const targetId = parseInt(recordId, 10);
        const matchingProfile = destinationsRegistry.find(item => item.id === targetId);

        if (!matchingProfile) return;

        targetedModalRecordId = targetId;

        // Populate Static Copy Text Layers
        modalHeroBg.style.backgroundImage = `url('${matchingProfile.image}')`;
        modalDestTitle.textContent = matchingProfile.name;
        modalDestLocation.textContent = `${matchingProfile.country}, ${matchingProfile.continent}`;
        modalDestStars.textContent = matchingProfile.stars;
        modalDestDescription.textContent = matchingProfile.description;

        // Render List Array Vectors
        modalDestAttractions.innerHTML = matchingProfile.attractions.map(item => `<li>${item}</li>`).join('');

        // Populate Table Cells Matrix Content
        cellAccommodation.textContent = matchingProfile.costs.accommodation;
        cellFood.textContent = matchingProfile.costs.food;
        cellTransport.textContent = matchingProfile.costs.transport;

        // Verify button states using Name key lookup
        updateModalWishlistButtonState(activeWishlist.includes(matchingProfile.name));

        // NEW: Check if this destination is already in the bookings list
        updateModalBookButtonState(activeBookings.includes(matchingProfile.name));

        // Display Window Overlays
        detailModalWindow.classList.add("is-visible");
        detailModalWindow.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
    }

    function executeCloseModalDetails() {
        detailModalWindow.classList.remove("is-visible");
        detailModalWindow.setAttribute("aria-hidden", "true");
        targetedModalRecordId = null;

        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    }

    function updateModalWishlistButtonState(isActive) {
        if (isActive) {
            modalWishlistToggleBtn.classList.add("is-active");
            modalWishlistToggleBtn.innerHTML = `<span class="heart-icon"><i class="fa fa-heart" id="fafa-heart-submitted"></i></span> Saved in Wishlist`;
        } else {
            modalWishlistToggleBtn.classList.remove("is-active");
            modalWishlistToggleBtn.innerHTML = `<span class="heart-icon">🤍</span> Add to Wishlist`;
        }
    }

    // NEW: Visual state updater for the Book Now button
    function updateModalBookButtonState(isBooked) {
        if (!bookNowBtn) return;

        if (isBooked) {
            bookNowBtn.textContent = "✓ Booked";
            bookNowBtn.style.backgroundColor = "#28a745"; // Changes to a success green
            bookNowBtn.style.color = "#ffffff";
        } else {
            bookNowBtn.textContent = "Book Now";
            bookNowBtn.style.backgroundColor = ""; // Resets to your default CSS style
            bookNowBtn.style.color = "";
        }
    }

    // Global Interactive Click Delegation Elements Listener
    gridDisplayContainer.addEventListener("click", (e) => {
        const wishlistBtn = e.target.closest(".card-wishlist-toggle");
        if (wishlistBtn) {
            e.stopPropagation();
            alternateWishlistState(wishlistBtn.dataset.id);
            return;
        }

        const exploreBtn = e.target.closest(".card-trigger-overlay-btn");
        if (exploreBtn) {
            executeOpenModalDetails(exploreBtn.dataset.id);
        }
    });

    // Dynamic Filter Change Interception Points
    searchInputField.addEventListener("input", evaluateSearchAndFilterExecution);
    continentFilterSelect.addEventListener("change", evaluateSearchAndFilterExecution);

    // Modal Control Attachments
    closeModalBtn.addEventListener("click", executeCloseModalDetails);

    modalWishlistToggleBtn.addEventListener("click", () => {
        if (targetedModalRecordId) alternateWishlistState(targetedModalRecordId);
    });

    // NEW: Event listener for the Book Now button
    if (bookNowBtn) {
        bookNowBtn.addEventListener("click", () => {
            if (targetedModalRecordId) alternateBookingState(targetedModalRecordId);
        });
    }

    // Backplane Window Overlay Click Dismissals 
    detailModalWindow.addEventListener("click", (e) => {
        if (e.target === detailModalWindow) executeCloseModalDetails();
    });

    // Keyboard Key Interception Handlers
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && detailModalWindow.classList.contains("is-visible")) {
            executeCloseModalDetails();
        }
    });

    // Run Processing Engine Pipeline Tasks
    fetchDestinationsData();


});


