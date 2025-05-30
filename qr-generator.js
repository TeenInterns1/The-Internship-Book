/**
 * QR Code Generator for Teen Internship Book
 * 
 * This utility helps create QR codes for the various content pages
 * in the book. It relies on the qrcode.js library.
 */

class QRCodeGenerator {
    constructor() {
        this.baseUrl = window.location.origin;
        this.contentPages = [
            {
                title: "Finding Your First Internship",
                path: "https://teeninterns1.github.io/content/template.html",
                chapter: 3,
                description: "Step-by-step guide to landing your first internship"
            },
            {
                title: "Types of Internships Explained",
                path: "https://teeninterns1.github.io/content/template.html",
                chapter: 2,
                description: "Visual guide to different internship opportunities"
            },
            {
                title: "Resume Building Workshop",
                path: "https://teeninterns1.github.io/content/template.html",
                chapter: 4,
                description: "Create a standout resume even with limited experience"
            },
            {
                title: "Interview Preparation Guide",
                path: "https://teeninterns1.github.io/content/template.html",
                chapter: 5,
                description: "Ace your internship interviews with confidence"
            },
            {
                title: "Networking for Beginners",
                path: "https://teeninterns1.github.io/content/template.html",
                chapter: 6,
                description: "Build meaningful professional connections as a teenager"
            }
        ];
    }

    // Initialize QR code generator
    init() {
        // Check if we're on the QR code generation page
        if (document.getElementById('qr-generator-container')) {
            this.renderGeneratorInterface();
        }
        
        // Check if we need to display any inline QR codes
        this.renderInlineQRCodes();
    }

    // Render the QR code generator interface
    renderGeneratorInterface() {
        const container = document.getElementById('qr-generator-container');
        if (!container) return;
        
        // Create page selection dropdown
        const selectContainer = document.createElement('div');
        selectContainer.className = 'qr-generator-select';
        
        const label = document.createElement('label');
        label.setAttribute('for', 'content-page-select');
        label.textContent = 'Select content page:';
        
        const select = document.createElement('select');
        select.id = 'content-page-select';
        
        // Add options for each content page
        this.contentPages.forEach((page, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${page.title} (Chapter ${page.chapter})`;
            select.appendChild(option);
        });
        
        selectContainer.appendChild(label);
        selectContainer.appendChild(select);
        
        // Create QR code display area
        const qrDisplay = document.createElement('div');
        qrDisplay.className = 'qr-display';
        qrDisplay.id = 'qr-display';
        
        // Create info display
        const infoDisplay = document.createElement('div');
        infoDisplay.className = 'qr-info-display';
        
        const titleEl = document.createElement('h3');
        titleEl.id = 'qr-title';
        titleEl.textContent = this.contentPages[0].title;
        
        const urlEl = document.createElement('p');
        urlEl.id = 'qr-url';
        urlEl.className = 'qr-url';
        urlEl.textContent = this.baseUrl + this.contentPages[0].path;
        
        const descEl = document.createElement('p');
        descEl.id = 'qr-description';
        descEl.textContent = this.contentPages[0].description;
        
        const downloadLink = document.createElement('a');
        downloadLink.id = 'qr-download-link';
        downloadLink.href = '#';
        downloadLink.download = 'qr-code.png';
        
        const downloadBtn = document.createElement('button');
        
        downloadLink.appendChild(downloadBtn);
        
        infoDisplay.appendChild(titleEl);
        infoDisplay.appendChild(urlEl);
        infoDisplay.appendChild(descEl);
        infoDisplay.appendChild(downloadLink);
        
        // Add everything to container
        container.appendChild(selectContainer);
        container.appendChild(qrDisplay);
        container.appendChild(infoDisplay);
        
        // Generate initial QR code
        this.generateQRCode(0);
        
        // Setup event listeners
        select.addEventListener('change', (e) => {
            this.generateQRCode(parseInt(e.target.value));
        });
        
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.downloadQRCode();
        });
    }
    
    // Generate QR code for a specific content page
    generateQRCode(pageIndex) {
        const page = this.contentPages[pageIndex];
        const fullUrl = this.baseUrl + page.path;
        
        // Update info display
        document.getElementById('qr-title').textContent = page.title;
        document.getElementById('qr-url').textContent = fullUrl;
        document.getElementById('qr-description').textContent = page.description;
        
        // Clear existing QR code
        const display = document.getElementById('qr-display');
        display.innerHTML = '';
        
        // Generate new QR code
        if (window.QRCode) {
            new QRCode(display, {
                text: fullUrl,
                width: 256,
                height: 256,
                // colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            // Fallback if QR code library isn't available
            const message = document.createElement('p');
            message.textContent = 'QR Code generation requires the qrcode.js library.';
            display.appendChild(message);
        }
    }
    
    // Download QR code as image
    downloadQRCode() {
        const qrCanvas = document.querySelector('#qr-display canvas');
        const qrImage = document.querySelector('#qr-display img');
        const downloadLink = document.getElementById('qr-download-link');
        
        if (!qrCanvas && !qrImage) {
            alert('No QR code found to download');
            return;
        }
        
        const title = document.getElementById('qr-title').textContent;
        const fileName = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-qr.png';
        
        let imageUrl;
        
        if (qrCanvas) {
            // If canvas exists (which is what QRCode.js creates)
            imageUrl = qrCanvas.toDataURL('image/png');
        } else if (qrImage) {
            // If image exists
            imageUrl = qrImage.src;
        }
        
        if (imageUrl && downloadLink) {
            // Update the download link with the QR code data
            downloadLink.href = imageUrl;
            downloadLink.download = fileName;
            // The download will happen automatically when the link is clicked
        } else {
            alert('Unable to download QR code');
        }
    }
    
    // Render inline QR codes on the page
    renderInlineQRCodes() {
        const inlineContainers = document.querySelectorAll('[data-qr-page]');
        
        inlineContainers.forEach(container => {
            const pagePath = container.getAttribute('data-qr-page');
            const page = this.contentPages.find(p => p.path === pagePath);
            
            if (page) {
                // Generate a smaller inline QR code
                if (window.QRCode) {
                    container.innerHTML = '';
                    new QRCode(container, {
                        text: this.baseUrl + page.path,
                        width: 128,
                        height: 128,
                        // colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                    
                    // Add caption if requested
                    if (container.hasAttribute('data-qr-caption')) {
                        const caption = document.createElement('div');
                        caption.className = 'qr-caption';
                        caption.textContent = page.title;
                        container.appendChild(caption);
                    }
                }
            }
        });
    }
}

// Initialize QR code generator when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a page that uses QR codes
    if (document.getElementById('qr-generator-container') || document.querySelectorAll('[data-qr-page]').length > 0) {
        // Load QR code library if needed
        if (!window.QRCode) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
            script.onload = () => {
                const qrGenerator = new QRCodeGenerator();
                qrGenerator.init();
            };
            document.head.appendChild(script);
        } else {
            const qrGenerator = new QRCodeGenerator();
            qrGenerator.init();
        }
    }
});