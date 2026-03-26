// src/app.js
import express from 'express';          // ← must import express
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import plannerRoutes from './routes/plannerRoutes.js';


dotenv.config();

const app = express();                  // ← must create the app instance here

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
            .split(',')
            .map((o) => o.trim()),
        credentials: true
    })
);

// Your routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/users', userRoutes); // alias for frontend plural routes
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/planners', plannerRoutes);

// Global error handler (this is probably line ~7 or later)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const response = {
        error: {
            message: err.message || 'Server error',
            code: err.code || 'SERVER_ERROR'
        }
    };

    if (process.env.NODE_ENV !== 'production' && err.details) {
        response.error.details = err.details;
    }

    res.status(statusCode).json(response);
});

// Optional 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

export default app;                     // ← must export it so server.js can import it
