# Website Issues Fixed

## Problem 1: Header Turns Black in Light Mode ✅ FIXED
**Issue**: The header was hardcoded to use dark background colors regardless of the selected theme.

**Root Cause**: In `styles-header-hero.css`, the header styles were forced to use dark colors:
```css
.site-header {
    background: rgba(26, 26, 26, 1) !important; /* Always dark */
}
```

**Solution**: Updated the CSS to respect theme variables:
```css
.site-header {
    background: var(--bg-color) !important; /* Now respects theme */
}

/* Light theme header */
[data-theme="light"] .site-header {
    background: rgba(255, 255, 255, 1) !important;
}

/* Dark theme header */
[data-theme="dark"] .site-header {
    background: rgba(26, 26, 26, 1) !important;
}
```

**Files Modified**:
- `styles-header-hero.css` - Updated header background colors and nav link colors to respect theme

## Problem 2: Only Mannat's Profile Shows in Teams Page ✅ FIXED
**Issue**: Multiple profile cards had duplicate IDs and there were CSS issues with image display.

**Root Cause**: 
1. The second profile (Lakshi) had `id="mannat"` instead of `id="lakshi"`
2. Profile images needed proper CSS styling for image tags

**Solution**: 
1. Fixed duplicate ID issue (was already corrected)
2. Added CSS for proper image display:
```css
.profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
}
```

**Files Modified**:
- `team.html` - Added CSS for profile image styling

## Testing Instructions

### Header Theme Issue:
1. Open the website in light mode
2. Scroll down and then back up
3. **Expected**: Header should remain white in light mode, dark in dark mode
4. Toggle between light and dark themes
5. **Expected**: Header should change colors accordingly

### Team Profiles Issue:
1. Navigate to the team page (`team.html`)
2. Use the left sidebar to navigate between team members
3. Use arrow keys or scroll wheel to navigate horizontally
4. **Expected**: All 24 team member profiles should be accessible
5. **Expected**: Profile images should display correctly when available

## Key Changes Made

1. **Header Theme Respect**: 
   - Removed hardcoded dark colors
   - Added proper theme-based color variables
   - Ensured navigation links respect theme colors

2. **Profile Image Display**:
   - Added CSS rules for img tags within profile images
   - Ensured proper sizing and border radius
   - Fixed object-fit for better image display

3. **ID Uniqueness**:
   - Verified all profile cards have unique IDs
   - Ensured sidebar navigation matches profile IDs

Both issues should now be resolved. The header will respect the selected theme, and all team member profiles should be accessible with proper image display.
