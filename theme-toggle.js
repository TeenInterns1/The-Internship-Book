/**
 * Theme Toggle Functionality - DISABLED
 * Website now permanently uses dark theme only
 */

// This file has been disabled - the website now only supports dark theme
// All theme toggle functionality has been removed

console.log('Theme toggle disabled - website uses dark theme only');

// Empty initialization to prevent errors if the script is still referenced
document.addEventListener('DOMContentLoaded', () => {
    // Force dark theme and remove any light theme remnants
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Remove any theme preference from localStorage
    localStorage.removeItem('theme');
    
    console.log('Dark theme enforced');
});
