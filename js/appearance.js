// Theme toggle functionality
(function() {
    const switcher = document.getElementById('appearance-switcher');
    if (!switcher) return;
    
    // Get stored theme or default to auto
    function getStoredTheme() {
        return localStorage.getItem('theme') || 'auto';
    }
    
    // Set theme and update UI
    function setTheme(theme) {
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    
    // Initialize theme on page load
    function initTheme() {
        const theme = getStoredTheme();
        setTheme(theme);
    }
    
    // Toggle between light and dark
    function toggleTheme() {
        const currentTheme = getStoredTheme();
        const isDark = document.documentElement.classList.contains('dark');
        
        if (currentTheme === 'auto') {
            // If auto, switch to opposite of current state
            setTheme(isDark ? 'light' : 'dark');
        } else if (currentTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }
    
    // Add click event listener
    switcher.addEventListener('click', toggleTheme);
    
    // Initialize on page load
    initTheme();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
        if (getStoredTheme() === 'auto') {
            initTheme();
        }
    });
})();
