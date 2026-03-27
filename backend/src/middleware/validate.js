// src/middleware/validate.js
import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.parse(req.body);
        // Replace req.body with the parsed/coerced result (e.g. trimmed strings, defaults applied)
        req.body = result;
        next();
    } catch (e) {
        const firstError = e.errors?.[0];
        const message = firstError
            ? `${firstError.path.join('.')}: ${firstError.message}`
            : 'Validation failed';

        const err = new Error(message);
        err.statusCode = 400;
        err.details = e.errors;
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
            .enum(['user', 'admin', 'superadmin', 'attendee', 'organizer'])
            .optional()
            .default('attendee'),                       // FIX: default to 'attendee' not 'user'
        organizationName: z.string().min(1).max(150).optional(),
        organizationWebsite: z
            .string()
            .optional()
            .transform(val => val === '' ? undefined : val)  // FIX: empty string → undefined
            .pipe(z.string().url().optional()),
        organizationPhone: z.string().min(3).max(30).optional(),
        organizationDescription: z.string().max(500).optional()
        // FIX: removed .strict() — frontend may send extra fields during registration
    }),

    login: z.object({
        email: z.string().email('Invalid email format').trim(),
        password: z.string().min(1, 'Password is required')
        // FIX: removed .strict() — safer without it
    }),

    purchase: z.object({
        eventId: z
            .number({ invalid_type_error: 'eventId must be a number' })
            .int('eventId must be an integer')
            .positive('eventId must be a positive number')
    }).strict(),

    updateProfile: z.object({
        name: z.string().max(100).optional(),
        email: z.string().email('Invalid email format').trim().optional(),
        phone: z.string().max(30).optional(),
        // FIX: allow all profile fields the ProfilePage sends
        username: z.string().max(50).optional(),
        dob: z.string().optional(),
        gender: z.string().optional(),
        city: z.string().max(100).optional(),
        country: z.string().max(100).optional(),
        bio: z.string().max(280).optional(),
        website: z
            .string()
            .optional()
            .transform(val => val === '' ? undefined : val)
            .pipe(z.string().url().optional()),
        twitter: z.string().max(100).optional(),
        linkedin: z.string().max(200).optional(),
        avatar_url: z.string().optional()
        // FIX: removed .strict() — ProfilePage sends many fields
    }),

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