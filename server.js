// Main Server File for The Internship Book
// This is the entry point for your Node.js application

const app = require('./backend/server');

// The server setup is in backend/server.js
// This file just starts the application

const PORT = process.env.PORT || 3000;

console.log('🚀 Starting The Internship Book server...');

if (require.main === module) {
    // Only start the server if this file is run directly
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
        console.log(`🌐 Visit: http://localhost:${PORT}`);
        console.log(`📚 The Internship Book - Pre-order System Active`);
    });
}

module.exports = app;
