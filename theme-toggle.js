/**
 * Theme Toggle Functionality
 * Handles dark/light theme switching with system preference detection and logo switching
 */

class ThemeManager {
    constructor() {
        this.themeKey = 'teeninterns-theme';
        this.themes = {
            LIGHT: 'light',
            DARK: 'dark',
            AUTO: 'auto'
        };
        
        // Logo paths
        this.logos = {
            LIGHT: 'logos/title.png',
            DARK: 'logos/TEENINTERNS_WHITE_TRANSPARENT.png'
        };
        
        this.init();
    }
    
    init() {
        // Create theme toggle button
        this.createThemeToggle();
        
        // Set initial theme
        this.setInitialTheme();
        
        // Listen for system theme changes
        this.watchSystemTheme();
        
        // Update theme toggle icon
        this.updateToggleIcon();
        
        // Update logos
        this.updateLogos();
    }
    
    createThemeToggle() {
        // Check if toggle already exists
        if (document.querySelector('.theme-toggle')) return;
        
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <span class="theme-toggle-icon light-icon">🌙</span>
            <span class="theme-toggle-icon dark-icon">☀️</span>
        `;
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.setAttribute('title', 'Toggle dark/light theme');
        
        // Add click event
        themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Add keyboard support
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Add to page
        document.body.appendChild(themeToggle);
    }
    
    getStoredTheme() {
        return localStorage.getItem(this.themeKey);
    }
    
    setStoredTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
    }
    
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? this.themes.DARK 
            : this.themes.LIGHT;
    }
    
    getCurrentTheme() {
        const stored = this.getStoredTheme();
        if (stored && stored !== this.themes.AUTO) {
            return stored;
        }
        return this.getSystemTheme();
    }
    
    setInitialTheme() {
        const storedTheme = this.getStoredTheme();
        
        if (storedTheme) {
            this.applyTheme(storedTheme);
        } else {
            // First visit - default to light theme
            this.setStoredTheme(this.themes.LIGHT);
            this.applyTheme(this.themes.LIGHT);
        }
    }
    
    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === this.themes.AUTO) {
            // Remove data-theme to let CSS handle system preference
            root.removeAttribute('data-theme');
        } else {
            // Set explicit theme
            root.setAttribute('data-theme', theme);
        }
        
        this.updateToggleIcon(theme);
        this.updateLogos();
        this.announceThemeChange(theme);
    }
    
    updateLogos() {
        const currentTheme = this.getCurrentTheme();
        const isDark = currentTheme === this.themes.DARK;
        const logoSrc = isDark ? this.logos.DARK : this.logos.LIGHT;
        
        // Update all logo images
        const logoSelectors = [
            '.logo-img',
            '.footer-logo-img', 
            '.hero-logo',
            '.impact-logo',
            '.cta-logo'
        ];
        
        logoSelectors.forEach(selector => {
            const logos = document.querySelectorAll(selector);
            logos.forEach(logo => {
                if (logo.tagName === 'IMG') {
                    logo.src = logoSrc;
                }
            });
        });
        
        // Handle relative paths for content folder
        if (window.location.pathname.includes('/content/')) {
            const relativeSrc = '../' + logoSrc;
            logoSelectors.forEach(selector => {
                const logos = document.querySelectorAll(selector);
                logos.forEach(logo => {
                    if (logo.tagName === 'IMG') {
                        logo.src = relativeSrc;
                    }
                });
            });
        }
    }
    
    toggleTheme() {
        const currentTheme = this.getStoredTheme() || this.themes.AUTO;
        let newTheme;
        
        switch (currentTheme) {
            case this.themes.LIGHT:
                newTheme = this.themes.DARK;
                break;
            case this.themes.DARK:
                newTheme = this.themes.AUTO;
                break;
            case this.themes.AUTO:
            default:
                // Toggle from auto to the opposite of current system preference
                newTheme = this.getSystemTheme() === this.themes.DARK 
                    ? this.themes.LIGHT 
                    : this.themes.DARK;
                break;
        }
        
        this.setStoredTheme(newTheme);
        this.applyTheme(newTheme);
        
        // Add a subtle animation feedback
        this.animateToggle();
    }
    
    updateToggleIcon(theme = null) {
        const toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;
        
        const currentTheme = theme || this.getCurrentTheme();
        const isCurrentlyDark = currentTheme === this.themes.DARK;
        
        // Update aria-label for accessibility
        toggle.setAttribute('aria-label', 
            isCurrentlyDark ? 'Switch to light theme' : 'Switch to dark theme'
        );
        
        // Update title
        const storedTheme = this.getStoredTheme();
        let titleText = 'Toggle dark/light theme';
        if (storedTheme === this.themes.AUTO) {
            titleText += ' (auto)';
        }
        toggle.setAttribute('title', titleText);
    }
    
    animateToggle() {
        const toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;
        
        toggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            toggle.style.transform = '';
        }, 150);
    }
    
    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', () => {
            // Only update if user is using auto theme
            if (this.getStoredTheme() === this.themes.AUTO) {
                this.applyTheme(this.themes.AUTO);
            }
        });
    }
    
    announceThemeChange(theme) {
        // Create accessible announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        let message;
        switch (theme) {
            case this.themes.LIGHT:
                message = 'Switched to light theme';
                break;
            case this.themes.DARK:
                message = 'Switched to dark theme';
                break;
            case this.themes.AUTO:
                message = 'Switched to auto theme (follows system preference)';
                break;
            default:
                message = 'Theme changed';
        }
        
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }
    
    // Public method to get current theme state
    getThemeState() {
        return {
            stored: this.getStoredTheme(),
            current: this.getCurrentTheme(),
            system: this.getSystemTheme()
        };
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Also expose as global for debugging
window.ThemeManager = ThemeManager;
