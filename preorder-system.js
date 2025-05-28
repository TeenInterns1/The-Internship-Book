// Pre-order System for The Internship Book
// Comprehensive payment gateway integration for Indian market

// Package configurations
const packages = {
    digital: {
        name: 'Digital Edition',
        price: 1999,
        originalPrice: 2499,
        shipping: 0,
        requiresShipping: false,
        features: [
            '📱 Digital book access',
            '🎥 All video content',
            '📝 Downloadable resources',
            '🔄 Lifetime updates'
        ]
    },
    bundle: {
        name: 'Print + Digital Bundle',
        price: 3499,
        originalPrice: 4499,
        shipping: 0,
        requiresShipping: true,
        features: [
            '📖 Physical book',
            '📱 Digital access',
            '🎥 All video content',
            '📦 Free shipping',
            '💯 First-edition benefits'
        ]
    },
    premium: {
        name: 'Premium Package',
        price: 5999,
        originalPrice: 7499,
        shipping: 0,
        requiresShipping: true,
        features: [
            '📖 Signed first edition',
            '📱 Digital access',
            '🎁 Exclusive merchandise',
            '🤝 Virtual meet with authors',
            '🎯 Private community access'
        ]
    }
};

let selectedPackage = null;

// Initialize pre-order system
function initPreorderSystem() {
    loadRazorpayScript();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    setupPreorderButtons();
    setupFormValidation();
}

// Setup pre-order buttons
function setupPreorderButtons() {
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.price-card');
            const packageType = card.dataset.package;
            openPreorderModal(packageType);
        });
    });
}

// Open pre-order modal
function openPreorderModal(packageType) {
    selectedPackage = packages[packageType];
    
    // Create modal if it doesn't exist
    if (!document.getElementById('preorderModal')) {
        createPreorderModal();
    }
    
    const modal = document.getElementById('preorderModal');
    const modalTitle = document.getElementById('modalTitle');
    const selectedPackageDiv = document.getElementById('selectedPackage');
    const packageName = document.getElementById('packageName');
    const packagePrice = document.getElementById('packagePrice');
    const originalPrice = document.getElementById('originalPrice');
    const totalPrice = document.getElementById('totalPrice');
    const shippingSection = document.getElementById('shippingSection');
    const featuresContainer = document.getElementById('packageFeatures');
    
    // Update modal content
    modalTitle.textContent = `Pre-order ${selectedPackage.name}`;
    selectedPackageDiv.innerHTML = `
        <div class="package-info">
            <h4>${selectedPackage.name}</h4>
            <div class="package-pricing">
                <span class="current-price">₹${selectedPackage.price.toLocaleString()}</span>
                <span class="original-price">₹${selectedPackage.originalPrice.toLocaleString()}</span>
            </div>
        </div>
    `;
    
    // Update features
    featuresContainer.innerHTML = selectedPackage.features.map(feature => 
        `<li>${feature}</li>`
    ).join('');
    
    packageName.textContent = selectedPackage.name;
    packagePrice.textContent = `₹${selectedPackage.price.toLocaleString()}`;
    totalPrice.textContent = `₹${(selectedPackage.price + selectedPackage.shipping).toLocaleString()}`;
    
    // Show/hide shipping section
    if (selectedPackage.requiresShipping) {
        shippingSection.style.display = 'block';
        setShippingFieldsRequired(true);
    } else {
        shippingSection.style.display = 'none';
        setShippingFieldsRequired(false);
    }
    
    // Show modal with animation
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (window.gsap) {
        gsap.fromTo(modal.querySelector('.modal-content'), 
            {scale: 0.5, opacity: 0, y: 50},
            {scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)'}
        );
    }
}

// Close pre-order modal
function closePreorderModal() {
    const modal = document.getElementById('preorderModal');
    document.body.style.overflow = '';
    
    if (window.gsap) {
        gsap.to(modal.querySelector('.modal-content'), {
            scale: 0.5,
            opacity: 0,
            y: 50,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                modal.classList.remove('active');
                document.getElementById('preorderForm').reset();
            }
        });
    } else {
        modal.classList.remove('active');
        document.getElementById('preorderForm').reset();
    }
}

// Create pre-order modal dynamically
function createPreorderModal() {
    const modalHTML = `
    <div class="preorder-modal" id="preorderModal">
        <div class="modal-overlay" onclick="closePreorderModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closePreorderModal()">&times;</button>
            
            <div class="modal-header">
                <h2 id="modalTitle">Complete Your Pre-order</h2>
                <div class="selected-package" id="selectedPackage"></div>
            </div>
            
            <form class="preorder-form" id="preorderForm">
                <div class="form-section">
                    <h3>📦 Package Details</h3>
                    <ul class="package-features" id="packageFeatures"></ul>
                </div>
                
                <div class="form-section">
                    <h3>👤 Personal Information</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">First Name *</label>
                            <input type="text" id="firstName" name="firstName" required>
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name *</label>
                            <input type="text" id="lastName" name="lastName" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" pattern="[0-9]{10}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="studentStatus">Are you currently a student?</label>
                        <select id="studentStatus" name="studentStatus">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="recent_graduate">Recent Graduate</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-section" id="shippingSection">
                    <h3>🚚 Shipping Address</h3>
                    <div class="form-group">
                        <label for="address">Street Address *</label>
                        <input type="text" id="address" name="address">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City *</label>
                            <input type="text" id="city" name="city">
                        </div>
                        <div class="form-group">
                            <label for="state">State *</label>
                            <select id="state" name="state">
                                <option value="">Select State</option>
                                <option value="AN">Andaman and Nicobar Islands</option>
                                <option value="AP">Andhra Pradesh</option>
                                <option value="AR">Arunachal Pradesh</option>
                                <option value="AS">Assam</option>
                                <option value="BR">Bihar</option>
                                <option value="CH">Chandigarh</option>
                                <option value="CT">Chhattisgarh</option>
                                <option value="DN">Dadra and Nagar Haveli</option>
                                <option value="DD">Daman and Diu</option>
                                <option value="DL">Delhi</option>
                                <option value="GA">Goa</option>
                                <option value="GJ">Gujarat</option>
                                <option value="HR">Haryana</option>
                                <option value="HP">Himachal Pradesh</option>
                                <option value="JK">Jammu and Kashmir</option>
                                <option value="JH">Jharkhand</option>
                                <option value="KA">Karnataka</option>
                                <option value="KL">Kerala</option>
                                <option value="LD">Lakshadweep</option>
                                <option value="MP">Madhya Pradesh</option>
                                <option value="MH">Maharashtra</option>
                                <option value="MN">Manipur</option>
                                <option value="ML">Meghalaya</option>
                                <option value="MZ">Mizoram</option>
                                <option value="NL">Nagaland</option>
                                <option value="OR">Odisha</option>
                                <option value="PY">Puducherry</option>
                                <option value="PB">Punjab</option>
                                <option value="RJ">Rajasthan</option>
                                <option value="SK">Sikkim</option>
                                <option value="TN">Tamil Nadu</option>
                                <option value="TG">Telangana</option>
                                <option value="TR">Tripura</option>
                                <option value="UP">Uttar Pradesh</option>
                                <option value="UT">Uttarakhand</option>
                                <option value="WB">West Bengal</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="pincode">Pincode *</label>
                        <input type="text" id="pincode" name="pincode" pattern="[0-9]{6}">
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>💰 Order Summary</h3>
                    <div class="order-summary">
                        <div class="summary-item">
                            <span id="packageName"></span>
                            <span id="packagePrice"></span>
                        </div>
                        <div class="summary-item" id="originalPriceRow">
                            <span>Original Price</span>
                            <span id="originalPrice"></span>
                        </div>
                        <div class="summary-item discount">
                            <span>Early Bird Discount</span>
                            <span id="discountAmount" class="discount-text">-₹500</span>
                        </div>
                        <div class="summary-item">
                            <span>Shipping</span>
                            <span id="shippingCost">Free</span>
                        </div>
                        <div class="summary-item total">
                            <span>Total</span>
                            <span id="totalPrice"></span>
                        </div>
                    </div>
                </div>
                
                <div class="payment-section">
                    <h3>💳 Payment Method</h3>
                    <div class="payment-options">
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="razorpay" checked>
                            <span class="payment-label">
                                <div class="payment-info">
                                    <strong>Secure Payment via Razorpay</strong>
                                    <small>Credit/Debit Card, UPI, Net Banking, Wallets</small>
                                </div>
                            </span>
                        </label>
                    </div>
                    
                    <div class="security-badges">
                        <div class="security-item">
                            <span>🔒</span>
                            <span>256-bit SSL Encryption</span>
                        </div>
                        <div class="security-item">
                            <span>💳</span>
                            <span>PCI DSS Compliant</span>
                        </div>
                        <div class="security-item">
                            <span>🛡️</span>
                            <span>Secure Payment Gateway</span>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closePreorderModal()">Cancel</button>
                    <button type="submit" class="btn-primary">
                        <span class="btn-text">Complete Pre-order</span>
                        <span class="btn-amount">₹${selectedPackage?.price.toLocaleString() || '0'}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupFormHandlers();
}

// Set shipping fields required status
function setShippingFieldsRequired(required) {
    const fields = ['address', 'city', 'state', 'pincode'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.required = required;
        }
    });
}

// Setup form validation and handlers
function setupFormValidation() {
    // Phone number validation
    document.addEventListener('input', function(e) {
        if (e.target.id === 'phone') {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 10);
        }
        
        if (e.target.id === 'pincode') {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 6);
        }
    });
}

// Setup form handlers
function setupFormHandlers() {
    document.getElementById('preorderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Collect form data
        const formData = new FormData(this);
        const orderData = {
            package: selectedPackage,
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                studentStatus: formData.get('studentStatus')
            },
            shipping: selectedPackage.requiresShipping ? {
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                pincode: formData.get('pincode')
            } : null,
            paymentMethod: formData.get('paymentMethod'),
            total: selectedPackage.price + selectedPackage.shipping,
            orderDate: new Date().toISOString()
        };
        
        // Initialize payment
        initializePayment(orderData);
    });
}

// Validate form
function validateForm() {
    const form = document.getElementById('preorderForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ff4757';
            isValid = false;
        } else {
            field.style.borderColor = '#e1e1e1';
        }
    });
    
    // Validate email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        email.style.borderColor = '#ff4757';
        isValid = false;
    }
    
    // Validate phone
    const phone = document.getElementById('phone');
    if (phone.value.length !== 10) {
        phone.style.borderColor = '#ff4757';
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please fill all required fields correctly', 'error');
    }
    
    return isValid;
}

// Initialize payment with Razorpay
function initializePayment(orderData) {
    // Show loading
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
    submitBtn.disabled = true;
    
    // Generate order ID (in production, this should come from backend)
    const orderId = generateOrderId();
    
    const options = {
        key: 'rzp_test_your_key_here', // Replace with actual Razorpay key
        amount: orderData.total * 100, // Amount in paise
        currency: 'INR',
        name: 'The Internship Book',
        description: orderData.package.name,
        image: 'logos/title.png',
        order_id: orderId,
        handler: function(response) {
            handlePaymentSuccess(response, orderData);
        },
        prefill: {
            name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
            email: orderData.customer.email,
            contact: orderData.customer.phone
        },
        notes: {
            package: orderData.package.name,
            student_status: orderData.customer.studentStatus,
            shipping_required: orderData.package.requiresShipping.toString()
        },
        theme: {
            color: '#F45D01'
        },
        modal: {
            ondismiss: function() {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    };
    
    try {
        const rzp = new Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error('Error initializing payment:', error);
        showNotification('Payment system error. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle successful payment
function handlePaymentSuccess(response, orderData) {
    const fullOrderData = {
        ...orderData,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        status: 'paid'
    };
    
    // Submit order to backend
    submitOrder(fullOrderData);
    
    // Show success message
    showSuccessMessage(fullOrderData);
    closePreorderModal();
}

// Submit order to backend
async function submitOrder(orderData) {
    try {
        // Replace with your actual backend endpoint
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Order submitted successfully:', result);
            
            // Send confirmation email
            sendConfirmationEmail(orderData);
            
            // Track conversion (for analytics)
            trackConversion(orderData);
        } else {
            throw new Error('Failed to submit order');
        }
    } catch (error) {
        console.error('Error submitting order:', error);
        
        // Store order locally as backup
        localStorage.setItem('pendingOrder_' + Date.now(), JSON.stringify(orderData));
        
        showNotification('Order saved locally. We will process it shortly.', 'warning');
    }
}

// Generate order ID
function generateOrderId() {
    return 'TIB_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Show success message
function showSuccessMessage(orderData) {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-overlay"></div>
        <div class="success-content">
            <div class="success-header">
                <div class="success-icon">🎉</div>
                <h2>Pre-order Successful!</h2>
                <p>Thank you ${orderData.customer.firstName} for pre-ordering The Internship Book!</p>
            </div>
            
            <div class="success-details">
                <div class="detail-item">
                    <strong>Order ID:</strong> ${orderData.orderId}
                </div>
                <div class="detail-item">
                    <strong>Package:</strong> ${orderData.package.name}
                </div>
                <div class="detail-item">
                    <strong>Total:</strong> ₹${orderData.total.toLocaleString()}
                </div>
                <div class="detail-item">
                    <strong>Email:</strong> ${orderData.customer.email}
                </div>
            </div>
            
            <div class="success-actions">
                <p>📧 Confirmation email sent to ${orderData.customer.email}</p>
                <p>📱 You'll receive updates about the book launch</p>
                <p>🎁 Early bird benefits will be activated closer to launch</p>
            </div>
            
            <button class="success-btn" onclick="this.closest('.success-modal').remove()">
                Continue Exploring
            </button>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (successModal.parentElement) {
            successModal.remove();
        }
    }, 10000);
}

// Send confirmation email
function sendConfirmationEmail(orderData) {
    // Implementation depends on your email service (SendGrid, Mailgun, etc.)
    console.log('Sending confirmation email to:', orderData.customer.email);
    
    // Example implementation with a simple API call
    fetch('/api/send-confirmation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to: orderData.customer.email,
            orderData: orderData
        })
    }).catch(error => {
        console.error('Error sending confirmation email:', error);
    });
}

// Track conversion for analytics
function trackConversion(orderData) {
    // Google Analytics conversion tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            transaction_id: orderData.orderId,
            value: orderData.total,
            currency: 'INR',
            items: [{
                item_id: orderData.package.name.toLowerCase().replace(/\s+/g, '_'),
                item_name: orderData.package.name,
                category: 'book_preorder',
                quantity: 1,
                price: orderData.total
            }]
        });
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
            value: orderData.total,
            currency: 'INR'
        });
    }
}

// Real-time countdown timer
function updateCountdown() {
    const launchDate = new Date('2025-07-24T00:00:00+05:30').getTime(); // IST
    const now = new Date().getTime();
    const distance = launchDate - now;
    
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (daysElement) daysElement.textContent = days;
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
    } else {
        // Launch date reached
        if (daysElement) daysElement.textContent = '0';
        if (hoursElement) hoursElement.textContent = '00';
        if (minutesElement) minutesElement.textContent = '00';
        if (secondsElement) secondsElement.textContent = '00';
        
        // Update pre-order buttons to "Order Now"
        document.querySelectorAll('.order-btn').forEach(btn => {
            btn.textContent = btn.textContent.replace('Pre-order', 'Order');
        });
    }
}

// Load Razorpay script
function loadRazorpayScript() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initPreorderSystem();
});

// Export for use in other files
window.PreorderSystem = {
    openPreorderModal,
    closePreorderModal,
    initPreorderSystem
};
