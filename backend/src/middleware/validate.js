// src/middleware/validate.js
import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (e) {
        // Improved error formatting: return first validation error message
        const firstError = e.errors?.[0];
        const message = firstError
            ? `${firstError.path.join('.')}: ${firstError.message}`
            : 'Validation failed';

        const err = new Error(message);
        err.statusCode = 400;
        err.details = e.errors; // optional: for more detailed frontend feedback
        next(err);
    }
};

export const schemas = {
    register: z.object({
        name: z.string().min(1, 'Name is required').max(100).optional(),
        email: z.string().email('Invalid email format').trim(),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(128, 'Password is too long')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            ),
        role: z
            .enum(['user', 'admin', 'superadmin', 'attendee', 'organizer'], {
                required_error: 'Role is required',
                invalid_type_error: 'Role must be one of: user, admin, superadmin, attendee, organizer'
            })
            .optional()
            .default('user'),
        organizationName: z.string().min(1).max(150).optional(),
        organizationWebsite: z.string().url().optional(),
        organizationPhone: z.string().min(3).max(30).optional(),
        organizationDescription: z.string().max(500).optional()
    }).strict(), // prevent unknown fields

    login: z.object({
        email: z.string().email('Invalid email format').trim(),
        password: z.string().min(1, 'Password is required')
    }).strict(),

    purchase: z.object({
        eventId: z
            .number({ invalid_type_error: 'eventId must be a number' })
            .int('eventId must be an integer')
            .positive('eventId must be a positive number')
    }).strict(),

    updateProfile: z.object({
        name: z.string().max(100).optional(),
        email: z.string().email('Invalid email format').trim().optional(),
        phone: z.string().max(30).optional()
    }).strict(),

    changePassword: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(128, 'Password is too long')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            )
    }).strict()
};
