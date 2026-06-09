document.addEventListener('DOMContentLoaded', () => {
  // Elements Selection Mapping
  const budgetForm = document.getElementById('tn-budget-form');
  const destinationInput = document.getElementById('tn-destination');
  const destinationsPool = document.getElementById('destinations-pool');
  const txtTotalCost = document.getElementById('txt-total-cost');
  const badgeBudgetTier = document.getElementById('badge-budget-tier');
  const badgeSafetyIndex = document.getElementById('badge-safety-index');
  const saveBtn = document.getElementById('tn-save-btn');
  const trackerBar = document.getElementById('tracker-bar');
  const progressText = document.getElementById('progress-text');
  const formAlert = document.getElementById('form-alert');
  
  // Stored Drawer Elements
  const viewSavedBtn = document.getElementById('tn-view-saved-btn');
  const savedDrawer = document.getElementById('saved-plans-drawer');
  const closeDrawer = document.getElementById('close-drawer');
  const drawerItemsContainer = document.getElementById('saved-items-container');

  let localDestinationsData = [];
  let computedActiveTrip = null;

  // 1. Fetch JSON Data & Safely Map to Datalist Pool Option Nodes
  fetch('../data/destinations.json')
    .then(res => {
      if (!res.ok) throw new Error("Network path verification failed.");
      return res.json();
    })
    .then(data => {
      localDestinationsData = data;
      data.forEach(dest => {
        const option = document.createElement('option');
        option.value = dest.name;
        option.textContent = `${dest.country} (${dest.continent})`;
        destinationsPool.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Critical tracking crash mapping destinations:", err);
      formAlert.textContent = "Error mapping database tracking rows";
    });

  // Helper Array Parser: Safely strips financial limits from pricing tags
  function calculateAvgMetrics(costString) {
    if (!costString) return 0;
    const values = costString.match(/\d+/g);
    if (!values) return 0;
    if (values.length === 1) return parseInt(values[0], 10);
    return (parseInt(values[0], 10) + parseInt(values[1], 10)) / 2;
  }

  // Pure High Fidelity Counter Animation Script Rule
  function triggerCounterAnimate(elementTarget, initialValue, targetedValue, timelineSpan) {
    let trackingStartTime = null;
    const mechanicalStep = (currentTimeStamp) => {
      if (!trackingStartTime) trackingStartTime = currentTimeStamp;
      const progressDelta = Math.min((currentTimeStamp - trackingStartTime) / timelineSpan, 1);
      elementTarget.innerHTML = Math.floor(progressDelta * (targetedValue - initialValue) + initialValue).toLocaleString();
      if (progressDelta < 1) {
        window.requestAnimationFrame(mechanicalStep);
      }
    };
    window.requestAnimationFrame(mechanicalStep);
  }

  // 2. Realtime Progress Tracking Visualizer Toggles
  budgetForm.addEventListener('input', () => {
    let completedFieldsCount = 0;
    if (destinationInput.value.trim() !== '') completedFieldsCount++;
    if (document.getElementById('tn-days').value !== '') completedFieldsCount++;
    if (document.getElementById('tn-daily-budget').value !== '') completedFieldsCount++;

    if (completedFieldsCount === 1) {
      trackerBar.style.width = '50%';
      progressText.textContent = "Step 2: Enter specific trip scheduling metrics";
      formAlert.textContent = "Form incomplete";
      formAlert.style.background = "rgba(255, 165, 2, 0.1)";
      formAlert.style.color = "var(--tn-clr-mod)";
    } else if (completedFieldsCount === 3) {
      trackerBar.style.width = '75%';
      progressText.textContent = "Step 3: Ready to run analytics engine checks";
      formAlert.textContent = "Ready to analyze";
      formAlert.style.background = "rgba(46, 213, 115, 0.1)";
      formAlert.style.color = "var(--tn-clr-lux)";
    }
  });

  // 3. Central Computation Engine Logic Form Hooks
  budgetForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const targetQuery = destinationInput.value.trim();
    const timelineDays = parseInt(document.getElementById('tn-days').value, 10);
    const intentDailyAllocation = parseInt(document.getElementById('tn-daily-budget').value, 10);

    // Cross-match against mapped object keys
    const matchNode = localDestinationsData.find(d => d.name.toLowerCase() === targetQuery.toLowerCase());

    if (!matchNode) {
      alert("Selected target destination does not match standard track pools. Please pick an autocomplete value.");
      return;
    }

    // Process Average Overhead Multipliers
    const parsedAccommodationCost = calculateAvgMetrics(matchNode.costs.accommodation);
    const parsedFoodCost = calculateAvgMetrics(matchNode.costs.food);
    const parsedTransitCost = calculateAvgMetrics(matchNode.costs.transport);
    
    const trueLocationDailyAverage = parsedAccommodationCost + parsedFoodCost + parsedTransitCost;
    const finalCalculatedBaseCost = trueLocationDailyAverage * timelineDays;
    const totalUserIntentBudget = intentDailyAllocation * timelineDays;

    // Evaluate Discrepancy Margin Percentage Delays
    const budgetingRatioCoefficient = totalUserIntentBudget / finalCalculatedBaseCost;
    let assignmentTierClass = "status-moderate";
    let tierStringValue = "Moderate";
    let calculatedSafetyText = "Stable";

    if (budgetingRatioCoefficient < 0.85) {
      assignmentTierClass = "status-low";
      tierStringValue = "Low Budget";
      calculatedSafetyText = "High Risk Margin";
    } else if (budgetingRatioCoefficient > 1.4) {
      assignmentTierClass = "status-luxury";
      tierStringValue = "Luxury Scale";
      calculatedSafetyText = "Surplus Margin Secure";
    }

    // Update Output Metrics To Target Container Interfaces
    badgeBudgetTier.className = `status-pill ${assignmentTierClass}`;
    badgeBudgetTier.textContent = tierStringValue;
    
    badgeSafetyIndex.textContent = calculatedSafetyText;
    badgeSafetyIndex.className = `status-pill ${budgetingRatioCoefficient < 0.85 ? 'status-low' : 'status-luxury'}`;

    triggerCounterAnimate(txtTotalCost, 0, finalCalculatedBaseCost, 900);

    // Track active configuration dataset map instance
    computedActiveTrip = {
      id: Date.now(),
      destination: matchNode.name,
      days: timelineDays,
      allocatedDaily: intentDailyAllocation
      // Notice we are NO LONGER keeping total cost, country, or tier flags in this object!
    };

    saveBtn.disabled = false;
    trackerBar.style.width = '100%';
    progressText.textContent = "Analysis Complete! Data validated against system indexes.";
  });

  // 4. Storing Datasets & Synchronization with Local Storage Maps
  saveBtn.addEventListener('click', () => {
    if (!computedActiveTrip) return;

    let preloadedHistoryLogs = JSON.parse(localStorage.getItem('tn_saved_budgets')) || [];
    
    // Push our minimized, lightweight object to local storage
    preloadedHistoryLogs.push(computedActiveTrip);
    localStorage.setItem('tn_saved_budgets', JSON.stringify(preloadedHistoryLogs));

    saveBtn.textContent = "Configuration Stored!";
    saveBtn.classList.replace('tn-btn-success', 'tn-btn-primary');
    saveBtn.disabled = true;

    setTimeout(() => {
      saveBtn.textContent = "Save Configuration";
      saveBtn.classList.replace('tn-btn-primary', 'tn-btn-success');
    }, 2500);
    
    renderSavedDrawerLogs();
  });

  // 5. Drawer View Operations & Lifecycle Render Trackers
  function renderSavedDrawerLogs() {
    const historicalLogs = JSON.parse(localStorage.getItem('tn_saved_budgets')) || [];
    drawerItemsContainer.innerHTML = '';

    if (historicalLogs.length === 0) {
      drawerItemsContainer.innerHTML = `<p class="empty-log-text">No custom configurations stored in local storage yet.</p>`;
      return;
    }

    historicalLogs.forEach(item => {
      // DYNAMIC REBUILDER: Find the location data again using only the saved name
      const matchNode = localDestinationsData.find(d => d.name.toLowerCase() === item.destination.toLowerCase());
      
      let displayCountry = "Unknown";
      let displayTotal = 0;
      let displayTier = "Unknown";
      let displayTierClass = "status-pending";

      // Re-calculate the heavy variables on the fly so we don't have to save them
      if (matchNode) {
        displayCountry = matchNode.country;
        
        const accommodation = calculateAvgMetrics(matchNode.costs.accommodation);
        const food = calculateAvgMetrics(matchNode.costs.food);
        const transport = calculateAvgMetrics(matchNode.costs.transport);
        
        displayTotal = (accommodation + food + transport) * item.days;
        const ratio = (item.allocatedDaily * item.days) / displayTotal;

        displayTierClass = "status-moderate";
        displayTier = "Moderate";
        
        if (ratio < 0.85) {
          displayTierClass = "status-low";
          displayTier = "Low Budget";
        } else if (ratio > 1.4) {
          displayTierClass = "status-luxury";
          displayTier = "Luxury Scale";
        }
      }

      const cardNode = document.createElement('div');
      cardNode.className = 'log-item-card';
      
      // Inject the dynamically rebuilt values into the exact same UI as before
      cardNode.innerHTML = `
        <h5>${item.destination}, ${displayCountry}</h5>
        <p><strong>Duration:</strong> ${item.days} days @ $${item.allocatedDaily}/day</p>
        <p><strong>System Estimated Cost:</strong> $${displayTotal.toLocaleString()}</p>
        <div class="status-pill ${displayTierClass}" style="margin-top:10px; font-size:0.8rem; padding:6px 12px;">${displayTier}</div>
        <button class="delete-log-btn" data-id="${item.id}">Remove</button>
      `;
      drawerItemsContainer.appendChild(cardNode);
    });

    // Append Functional Sub-Hooks to Deletion Buttons
    document.querySelectorAll('.delete-log-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetingId = parseInt(e.target.getAttribute('data-id'), 10);
        let activeLogs = JSON.parse(localStorage.getItem('tn_saved_budgets')) || [];
        activeLogs = activeLogs.filter(log => log.id !== targetingId);
        localStorage.setItem('tn_saved_budgets', JSON.stringify(activeLogs));
        renderSavedDrawerLogs();
      });
    });
  }

  // Open/Close Drawer Interfaces View State Transitions
  viewSavedBtn.addEventListener('click', () => {
    renderSavedDrawerLogs();
    savedDrawer.classList.remove('hidden');
  });
  closeDrawer.addEventListener('click', () => savedDrawer.classList.add('hidden'));

  // Form Field Reset Event Hooks
  document.getElementById('tn-clear-btn').addEventListener('click', () => {
    budgetForm.reset();
    txtTotalCost.textContent = '0';
    badgeBudgetTier.className = 'status-pill status-pending';
    badgeBudgetTier.textContent = 'Pending';
    badgeSafetyIndex.textContent = '--';
    badgeSafetyIndex.className = 'status-pill status-neutral';
    trackerBar.style.width = '25%';
    progressText.textContent = "Step 1: Define your destination targets";
    formAlert.textContent = "Awaiting input data";
    saveBtn.disabled = true;
    computedActiveTrip = null;
  });

  // Visual Utility Hero Scroll Assist Anchor Click Action
  document.getElementById('scroll-to-form').addEventListener('click', () => {
    budgetForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});