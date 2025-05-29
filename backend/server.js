// Backend Server Implementation for Instamojo Payment Gateway
// Node.js Express server with Instamojo integration

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://checkout.razorpay.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.instamojo.com", "https://test.instamojo.com"]
        }
    }
}));

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 15 * 60 // 15 minutes in seconds
    }
});
app.use('/api/', limiter);

// Instamojo Configuration
const INSTAMOJO_CONFIG = {
    apiKey: process.env.INSTAMOJO_API_KEY,
    authToken: process.env.INSTAMOJO_AUTH_TOKEN,
    baseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://api.instamojo.com/v2/' 
        : 'https://test.instamojo.com/v2/',
    salt: process.env.INSTAMOJO_SALT || 'your_salt_here'
};

// Email Configuration
const emailTransporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// In-memory storage (replace with database in production)
let orders = [];
let paymentRequests = [];

// Utility Functions
function generateOrderId() {
    return 'TIB_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function validateInstamojoWebhook(payload, mac) {
    const expectedMac = crypto
        .createHmac('sha1', INSTAMOJO_CONFIG.salt)
        .update(payload)
        .digest('hex');
    return mac === expectedMac;
}

async function sendEmail(to, subject, html) {
    try {
        await emailTransporter.sendMail({
            from: process.env.FROM_EMAIL || 'noreply@teeninterns.com',
            to,
            subject,
            html
        });
        console.log('Email sent successfully to:', to);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// API Routes

// Create Payment Request
app.post('/api/create-payment-request', async (req, res) => {
    try {
        const { orderData, paymentData } = req.body;
        
        // Validate required fields
        if (!orderData || !paymentData) {
            return res.status(400).json({
                success: false,
                message: 'Missing required data'
            });
        }

        // Generate unique order ID
        const orderId = generateOrderId();
        orderData.orderId = orderId;

        // Prepare Instamojo payment request
        const instamojoPayload = {
            purpose: `${paymentData.purpose} - Order #${orderId}`,
            amount: paymentData.amount,
            phone: paymentData.phone,
            buyer_name: paymentData.buyer_name,
            redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success?order_id=${orderId}`,
            send_email: true,
            webhook: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/webhook`,
            send_sms: true,
            email: paymentData.email,
            allow_repeated_payments: false
        };

        // Make request to Instamojo API
        const response = await axios.post(
            `${INSTAMOJO_CONFIG.baseUrl}payment-requests/`,
            instamojoPayload,
            {
                headers: {
                    'X-Api-Key': INSTAMOJO_CONFIG.apiKey,
                    'X-Auth-Token': INSTAMOJO_CONFIG.authToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        if (response.data.success) {
            // Store order and payment request data
            orders.push({
                ...orderData,
                status: 'pending',
                createdAt: new Date().toISOString()
            });

            paymentRequests.push({
                orderId,
                paymentRequestId: response.data.payment_request.id,
                status: 'created',
                createdAt: new Date().toISOString()
            });

            res.json({
                success: true,
                payment_request: response.data.payment_request,
                orderId
            });
        } else {
            throw new Error(response.data.message || 'Payment request creation failed');
        }

    } catch (error) {
        console.error('Error creating payment request:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || error.message || 'Internal server error'
        });
    }
});

// Webhook handler for Instamojo
app.post('/api/webhook', express.raw({ type: 'application/x-www-form-urlencoded' }), (req, res) => {
    try {
        const mac = req.get('X-Razorpay-Signature') || req.body.mac;
        const payload = req.body.toString();

        // For development, skip signature validation
        if (process.env.NODE_ENV !== 'production') {
            console.log('Development mode: Skipping webhook signature validation');
        } else {
            // Validate webhook signature in production
            if (!validateInstamojoWebhook(payload, mac)) {
                return res.status(400).json({ error: 'Invalid signature' });
            }
        }

        const data = new URLSearchParams(payload);
        const paymentId = data.get('payment_id');
        const paymentRequestId = data.get('payment_request_id');
        const status = data.get('status');

        console.log('Webhook received:', { paymentId, paymentRequestId, status });

        // Find the corresponding order
        const paymentRequest = paymentRequests.find(pr => pr.paymentRequestId === paymentRequestId);
        if (!paymentRequest) {
            console.log('Payment request not found:', paymentRequestId);
            return res.status(404).json({ error: 'Payment request not found' });
        }

        // Update order status
        const orderIndex = orders.findIndex(order => order.orderId === paymentRequest.orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = status === 'Credit' ? 'completed' : 'failed';
            orders[orderIndex].paymentId = paymentId;
            orders[orderIndex].updatedAt = new Date().toISOString();

            // Send confirmation email if payment successful
            if (status === 'Credit') {
                sendConfirmationEmail(orders[orderIndex])
                    .catch(error => console.error('Error sending confirmation email:', error));
            }
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Get Payment Status
app.get('/api/payment-status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = orders.find(o => o.orderId === orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order: {
                orderId: order.orderId,
                status: order.status,
                package: order.package.name,
                total: order.total,
                customer: {
                    name: `${order.customer.firstName} ${order.customer.lastName}`,
                    email: order.customer.email
                },
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }
        });

    } catch (error) {
        console.error('Error getting payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Send Confirmation Email Function
async function sendConfirmationEmail(order) {
    const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Order Confirmation - The Internship Book</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #F45D01, #EE6C4D); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 0.9em; color: #666; }
                .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; }
                .btn { background: #F45D01; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
                .features { list-style: none; padding: 0; }
                .features li { padding: 8px 0; border-bottom: 1px solid #eee; }
                .features li:before { content: "✅ "; margin-right: 8px; }
                .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #F45D01; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Order Confirmed!</h1>
                    <p>Thank you for pre-ordering The Internship Book</p>
                </div>
                
                <div class="content">
                    <h2>Hi ${order.customer.firstName}!</h2>
                    
                    <p>We're thrilled to confirm your pre-order for <strong>The Internship Book</strong>. You're now part of an exclusive group of early supporters who believe in empowering teenagers through authentic guidance!</p>
                    
                    <div class="order-details">
                        <h3>📦 Order Details</h3>
                        <div class="detail-row">
                            <span><strong>Order ID:</strong></span>
                            <span>${order.orderId}</span>
                        </div>
                        <div class="detail-row">
                            <span><strong>Package:</strong></span>
                            <span>${order.package.name}</span>
                        </div>
                        <div class="detail-row">
                            <span><strong>Total Amount:</strong></span>
                            <span>₹${(order.total / 100).toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span><strong>Payment Status:</strong></span>
                            <span style="color: #28a745; font-weight: bold;">✅ Confirmed</span>
                        </div>
                        ${order.paymentId ? `
                        <div class="detail-row">
                            <span><strong>Payment ID:</strong></span>
                            <span>${order.paymentId}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <h3>🎁 What You Get:</h3>
                    <ul class="features">
                        ${order.package.features.map(feature => `<li>${feature.replace(/📱|🎥|📝|🔄|📖|📦|💯|🎁|🤝|🎯/g, '').trim()}</li>`).join('')}
                    </ul>
                    
                    <div class="highlight">
                        <h3>📅 What Happens Next?</h3>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li><strong>Now:</strong> Your order is confirmed and being processed</li>
                            <li><strong>July 2025:</strong> We'll send you updates as we approach the launch date</li>
                            <li><strong>July 24, 2025:</strong> The book launches and you receive access!</li>
                            ${order.package.requiresShipping ? '<li><strong>Shipping:</strong> Your physical book will be shipped on launch day</li>' : ''}
                        </ul>
                    </div>
                    
                    <h3>💚 Making an Impact</h3>
                    <p>Your purchase is already making a difference! The profits from your order will help fund internships for teenagers who can't afford them. You'll receive updates on how your contribution is creating opportunities for others.</p>
                    
                    <p>We can't wait to share this incredible journey with you. Get ready for something truly special!</p>
                    
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="btn">Visit Our Website</a>
                </div>
                
                <div class="footer">
                    <p><strong>Questions?</strong> Reply to this email or contact us at support@teeninterns.com</p>
                    <p>Follow our journey: <a href="#" style="color: #F45D01;">Instagram</a> | <a href="#" style="color: #F45D01;">LinkedIn</a> | <a href="#" style="color: #F45D01;">Twitter</a></p>
                    <p>&copy; 2025 TeenInterns. Made with ❤️ by teens, for teens.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail(
        order.customer.email,
        `Order Confirmed: The Internship Book - Order #${order.orderId}`,
        emailTemplate
    );
}

// Manual Email Send Endpoint
app.post('/api/send-confirmation', async (req, res) => {
    try {
        const { paymentId, orderId } = req.body;
        
        let order;
        if (paymentId) {
            order = orders.find(o => o.paymentId === paymentId);
        } else if (orderId) {
            order = orders.find(o => o.orderId === orderId);
        }
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const emailSent = await sendConfirmationEmail(order);

        res.json({
            success: emailSent,
            message: emailSent ? 'Confirmation email sent successfully' : 'Failed to send email'
        });

    } catch (error) {
        console.error('Error sending confirmation email:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending email'
        });
    }
});

// Get All Orders (Admin endpoint - add authentication in production)
app.get('/api/admin/orders', (req, res) => {
    // TODO: Add authentication middleware in production
    res.json({
        success: true,
        count: orders.length,
        orders: orders.map(order => ({
            ...order,
            customer: {
                ...order.customer,
                // Mask sensitive data
                phone: order.customer.phone ? 'XXXXX' + order.customer.phone.slice(-5) : null
            }
        }))
    });
});

// Get Order Statistics
app.get('/api/admin/stats', (req, res) => {
    const stats = {
        totalOrders: orders.length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        failedOrders: orders.filter(o => o.status === 'failed').length,
        totalRevenue: orders
            .filter(o => o.status === 'completed')
            .reduce((sum, order) => sum + order.total, 0),
        packageBreakdown: {
            digital: orders.filter(o => o.package.name.includes('Digital')).length,
            bundle: orders.filter(o => o.package.name.includes('Bundle')).length,
            premium: orders.filter(o => o.package.name.includes('Premium')).length
        }
    };

    res.json({
        success: true,
        stats
    });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test endpoint for development
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        orders: orders.length,
        instamojo_configured: !!(INSTAMOJO_CONFIG.apiKey && INSTAMOJO_CONFIG.authToken)
    });
});

// Serve the main website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Serve team page
app.get('/team', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'team.html'));
});

// Payment success page
app.get('/payment-success', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Handle all other routes by serving index.html (for SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error.message
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

module.exports = app;
