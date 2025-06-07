/**
 * Theme Toggle Functionality
 * Provides dark/light theme switching capability
 */

class ThemeToggle {
    constructor() {
        this.init();
    }

    init() {
        // Get all theme toggle buttons (desktop and mobile)
        this.themeToggles = document.querySelectorAll('.theme-toggle');
        
        if (this.themeToggles.length === 0) return;

        // Get theme from HTML data attribute first, then localStorage, then default to dark
        const htmlTheme = document.documentElement.getAttribute('data-theme');
        const savedTheme = localStorage.getItem('theme');
        this.currentTheme = htmlTheme || savedTheme || 'dark';
        
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Add event listeners to all theme toggles
        this.themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });

        // Listen for system theme changes
        this.watchSystemTheme();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateIcons(theme);
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Update current theme
        this.currentTheme = theme;
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }

    updateIcons(theme) {
        // Update icons for all theme toggle buttons
        this.themeToggles.forEach(toggle => {
            const lightIcon = toggle.querySelector('.light-icon');
            const darkIcon = toggle.querySelector('.dark-icon');
            const toggleText = toggle.querySelector('.toggle-text');
            
            if (lightIcon && darkIcon) {
                if (theme === 'dark') {
                    // In dark mode, show sun icon (to switch to light)
                    lightIcon.style.display = 'none';
                    darkIcon.style.display = 'inline';
                    if (toggleText) toggleText.textContent = 'Light Mode';
                } else {
                    // In light mode, show moon icon (to switch to dark)
                    lightIcon.style.display = 'inline';
                    darkIcon.style.display = 'none';
                    if (toggleText) toggleText.textContent = 'Dark Mode';
                }
            }
        });
        
        // Debug log
        console.log(`Theme updated to: ${theme}`);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Add a subtle animation feedback to all toggle buttons
        this.themeToggles.forEach(toggle => {
            toggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggle.style.transform = '';
            }, 150);
        });
    }

    watchSystemTheme() {
        // Listen for system theme preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to set theme programmatically
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }
}

// Enhanced CSS for dark theme support
const darkThemeStyles = `
    [data-theme="dark"] {
        --text-color: var(--pure-white);
        --text-secondary: #e5e7eb;
        --bg-color: #1a1a1a;
        --bg-secondary: #262626;
        --bg-alt-color: #333333;
        --border-color: #444444;
        --shadow-color: rgba(0, 0, 0, 0.3);
        --shadow-color-hover: rgba(0, 0, 0, 0.4);
        --subtitle-color: #d1d5db;
    }
    
    [data-theme="light"] {
        --text-color: var(--pure-black);
        --text-secondary: var(--pure-black);
        --bg-color: var(--light-grey);
        --bg-secondary: var(--pure-white);
        --bg-alt-color: #f0f9ff;
        --border-color: #e5e7eb;
        --shadow-color: rgba(0, 154, 148, 0.1);
        --shadow-color-hover: rgba(0, 154, 148, 0.15);
        --subtitle-color: var(--dark-grey);
    }

    [data-theme="dark"] h1,
    [data-theme="dark"] h2,
    [data-theme="dark"] h3,
    [data-theme="dark"] h4,
    [data-theme="dark"] h5,
    [data-theme="dark"] h6,
    [data-theme="dark"] p,
    [data-theme="dark"] span,
    [data-theme="dark"] div,
    [data-theme="dark"] .hero-title,
    [data-theme="dark"] .hero-subtitle,
    [data-theme="dark"] .hero-description,
    [data-theme="dark"] .section-title,
    [data-theme="dark"] .section-subtitle,
    [data-theme="dark"] .timeline-content h3,
    [data-theme="dark"] .timeline-content p,
    [data-theme="dark"] .award-item h4 {
        color: var(--pure-white) !important;
    }
    
    [data-theme="light"] h1,
    [data-theme="light"] h2,
    [data-theme="light"] h3,
    [data-theme="light"] h4,
    [data-theme="light"] h5,
    [data-theme="light"] h6,
    [data-theme="light"] p,
    [data-theme="light"] span,
    [data-theme="light"] div,
    [data-theme="light"] .hero-title,
    [data-theme="light"] .hero-subtitle,
    [data-theme="light"] .hero-description,
    [data-theme="light"] .section-title,
    [data-theme="light"] .section-subtitle,
    [data-theme="light"] .timeline-content h3,
    [data-theme="light"] .timeline-content p,
    [data-theme="light"] .award-item h4 {
        color: var(--pure-black) !important;
    }

    [data-theme="dark"] .left-sidebar {
        background: rgba(26, 26, 26, 0.95);
        border-color: var(--border-color);
    }
    
    [data-theme="light"] .left-sidebar {
        background: rgba(255, 255, 255, 0.95);
        border-color: var(--border-color);
    }

    [data-theme="dark"] .sidebar-link {
        color: var(--pure-white);
    }
    
    [data-theme="light"] .sidebar-link {
        color: var(--pure-black);
    }

    [data-theme="dark"] .sidebar-toggle {
        color: var(--pure-white);
    }
    
    [data-theme="light"] .sidebar-toggle {
        color: var(--pure-black);
    }

    [data-theme="dark"] .timeline-section {
        background: var(--bg-secondary);
    }
    
    [data-theme="light"] .timeline-section {
        background: var(--bg-secondary);
    }

    [data-theme="dark"] .logo-img,
    [data-theme="dark"] .footer-logo-img,
    [data-theme="dark"] .hero-logo,
    [data-theme="dark"] .impact-logo,
    [data-theme="dark"] .cta-logo {
        filter: brightness(1.1) contrast(1.1);
    }
    
    [data-theme="light"] .logo-img,
    [data-theme="light"] .footer-logo-img,
    [data-theme="light"] .hero-logo,
    [data-theme="light"] .impact-logo,
    [data-theme="light"] .cta-logo {
        filter: none;
    }
`;

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add dark theme styles to document head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = darkThemeStyles;
    document.head.appendChild(styleSheet);
    
    // Initialize theme toggle
    window.themeToggle = new ThemeToggle();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeToggle;
}