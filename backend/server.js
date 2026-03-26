// server.js
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION - Server will crash:');
    console.error(err);
    console.error(err.stack);
    // Optional: process.exit(1); // force crash to see it clearly
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED PROMISE REJECTION:');
    console.error(reason);
    console.error(reason?.stack);
});

import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Hardened EMS Backend LIVE on http://localhost:${PORT}`);
    console.log('✅ WAL mode active • Atomic purchases • Idempotent • Offline QR tickets');
});