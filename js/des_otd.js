// /////////////////////////////////////////
// destination of the day logic 
// /////////////////////////////////////////

// 1. The logic to calculate the destination based on the current date
function getDestinationOfTheDay(destinationsArray) {
    const today = new Date();
    // Calculate how many full days have passed since Jan 1, 1970
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    // Use the remainder to cycle through the array infinitely
    const index = daysSinceEpoch % destinationsArray.length;
    
    return destinationsArray[index];
}

// 2. Fetch the data and update the HTML once the page loads
document.addEventListener('DOMContentLoaded', () => {
    const BASE_PATH = window.location.pathname.includes('/pages/') ? '../' : './';
    const ASSET_BASE_PATH = window.location.pathname.includes('/pages/') ? '../' : '';
    function normalizeAssetUrl(url) {
        return url && url.startsWith('assets/') ? ASSET_BASE_PATH + url : url;
    }
    
    // Point this fetch to exactly where your JSON file is saved
    fetch(`${BASE_PATH}data/destinations.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not load the destinations JSON');
            }
            return response.json();
        })
        .then(data => {
            // Get today's destination from the fetched array
            const dailyDest = getDestinationOfTheDay(data);

            // Target your existing HTML elements and swap the data
            const imgElement = document.getElementById('daily-img');
            imgElement.src = normalizeAssetUrl(dailyDest.image);
            imgElement.alt = dailyDest.name; // For accessibility

            document.getElementById('daily-name').textContent = dailyDest.name;
            document.getElementById('daily-desc').textContent = dailyDest.description;
            document.getElementById('daily-stars').textContent = dailyDest.stars;
        })
        .catch(error => {
            console.error('Error fetching destination of the day:', error);
        });
});