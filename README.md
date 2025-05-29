# The Internship Book - Static Website

A beautiful, responsive website for "The Internship Book" - a multimedia guide created by teenagers, for teenagers about internships.

## 🚀 Live Demo

Visit the live website: [Your GitHub Pages URL will be here]

## ✨ Features

- **Responsive Design**: Works perfectly on all devices
- **Interactive Pre-order System**: Email-based interest collection
- **Smooth Animations**: GSAP-powered animations and transitions
- **Modern UI**: Clean, professional design with engaging visuals
- **Mobile Optimized**: Touch-friendly interactions

## 📁 Project Structure

```
├── index.html              # Main website
├── team.html               # Team page
├── script.js               # Main website functionality
├── preorder-system.js      # Pre-order modal system
├── preorder-styles.css     # Pre-order styling
├── page-transition.js      # Page transitions
├── qr-generator.html       # QR code example page
├── qr-generator.js         # QR code functionality
├── qr-code-styles.css      # QR page styling
├── styles*.css             # Various stylesheets
├── images/                 # Website images
├── logos/                  # Brand logos and favicon
└── content/                # QR code content pages
```

## 🎯 Pre-order System

The website includes a static pre-order system that:
- Collects customer interest via forms
- Stores data locally in browser
- Shows countdown to launch date (July 24, 2025)
- Provides beautiful confirmation messages

**Note**: This is a static demonstration. In production, you would connect this to:
- Email marketing service (Mailchimp, ConvertKit)
- Form handling service (Netlify Forms, Formspree)
- Payment processor (Stripe, PayPal, Instamojo)

## 📱 Package Options

1. **Digital Edition** - $25
   - Digital book access
   - All video content
   - Downloadable resources
   - Lifetime updates

2. **Print + Digital Bundle** - $45 (Most Popular)
   - Physical book
   - Digital access
   - All video content
   - Free shipping

3. **Premium Package** - $75
   - Signed first edition
   - Digital access
   - Exclusive merchandise
   - Virtual meet with authors

## 🛠️ GitHub Pages Deployment

### Option 1: Direct Upload
1. Upload all files to your GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Save and wait for deployment

### Option 2: GitHub Actions (Recommended)
1. The `.github/workflows/jekyll-gh-pages.yml` file is already included
2. Push your code to the main branch
3. GitHub Actions will automatically deploy

### Custom Domain (Optional)
1. Add a `CNAME` file with your domain name
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

## 🎨 Customization

### Update Package Pricing
Edit `preorder-system.js`:
```javascript
const packages = {
    digital: {
        name: 'Digital Edition',
        price: 25, // Change price here
        // ... other options
    }
};
```

### Change Colors
Update CSS custom properties in `styles-base.css`:
```css
:root {
    --primary-color: #F45D01;
    --secondary-color: #F5C125;
    /* ... other colors */
}
```

### Add Your Contact Email
In `preorder-system.js`, update the email in `createEmailNotification()`:
```javascript
const mailtoLink = `mailto:your-email@domain.com?subject=...`;
```

## 📊 Analytics Integration

Add your tracking codes to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🔧 Technical Details

- **Framework**: Vanilla HTML/CSS/JavaScript
- **Animations**: GSAP 3.12.2
- **Fonts**: Google Fonts (Inter)
- **Icons**: Unicode emojis
- **Browser Support**: Modern browsers (Chrome 60+, Firefox 60+, Safari 12+, Edge 79+)

## 📞 Support

- **Website Issues**: Create a GitHub issue
- **General Questions**: Contact the TeenInterns team
- **Book Inquiries**: support@teeninterns.com

## 📄 License

© 2025 TeenInterns. All rights reserved.

---

**Built with ❤️ by teens, for teens.**

*This website showcases the collaborative effort of 23 teenage contributors creating the ultimate internship guide.*
