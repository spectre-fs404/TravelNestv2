window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const logo = document.querySelector('.logo');

  // 1. Show the logo (Starts almost immediately)
  setTimeout(() => {
    logo.style.opacity = '1';
  }, 300);

  // 2. Hide the logo (Happens after user sees it)
  setTimeout(() => {
    logo.style.opacity = '0';
  }, 1500); 

  // 3. Trigger the panel split (Happens after logo is gone)
  setTimeout(() => {
    loader.classList.add('loaded');
    
    // FIX: Re-enable scrolling on BOTH html and body tags
    document.documentElement.style.overflow = 'auto'; 
    document.body.style.overflow = 'auto';
    
    // Final cleanup: Remove loader from view after panels finish moving
    setTimeout(() => {
      loader.style.display = 'none';
    }, 800); // Matches your 0.8s CSS transition
  }, 2000); 
});