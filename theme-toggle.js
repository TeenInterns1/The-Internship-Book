// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    
    // Update toggle text for mobile
    function updateToggleText(theme) {
        const toggleText = document.querySelector('.toggle-text');
        if (toggleText) {
            toggleText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }
    
    // Initialize toggle text
    updateToggleText(savedTheme);
    
    // Theme toggle function
    function toggleTheme() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleText(newTheme);
        
        // Add smooth transition class
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Remove transition after animation completes
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }
    
    // Add event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Keyboard accessibility
    document.addEventListener('keydown', function(e) {
        // Toggle theme with Ctrl/Cmd + D
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });
});
