/**
 * Schedule Validation Schema
 * 
 * Validates Step 3: Schedule Details including property schedules with boundaries and measurements
 */

import { z } from 'zod';

/**
 * Measurements Schema
 */
export const measurementsSchema = z.object({
    area: z.number()
        .nonnegative("Area cannot be negative")
        .max(999999, "Area value is too large"),

    unit: z.enum(['sqft', 'sqm', 'cent', 'acre'], {
        message: "Please select a valid unit"
    }),

    dimensions: z.string()
        .max(100, "Dimensions text is too long")
        .optional()
});

/**
 * Boundaries Schema
 */
export const boundariesSchema = z.object({
    north: z.string()
        .min(3, "North boundary description is required")
        .max(500, "North boundary description is too long"),

    south: z.string()
        .min(3, "South boundary description is required")
        .max(500, "South boundary description is too long"),

    east: z.string()
        .min(3, "East boundary description is required")
        .max(500, "East boundary description is too long"),

    west: z.string()
        .min(3, "West boundary description is required")
        .max(500, "West boundary description is too long")
});

/**
 * Registration Details Schema
 */
export const registrationDetailsSchema = z.object({
    documentNumber: z.string()
        .min(1, "Document number is required")
        .max(100, "Document number is too long"),

    year: z.number()
        .int("Year must be a whole number")
        .min(1900, "Year must be 1900 or later")
        .max(new Date().getFullYear(), "Year cannot be in the future"),

    sro: z.string()
        .min(3, "Sub-Registrar Office name is required")
        .max(200, "SRO name is too long")
});

/**
 * Schedule Schema
 */
export const scheduleSchema = z.object({
    id: z.string()
        .min(1, "Schedule ID is required"),

    scheduleName: z.string()
        .length(1, "Schedule name must be a single letter")
        .regex(/^[A-Z]$/, "Schedule name must be a capital letter (A-Z)"),

    scheduleType: z.enum(['property', 'movable', 'document', 'other'], {
        message: "Please select a valid schedule type"
    }),

    description: z.string()
        .min(50, "Description must be detailed (minimum 50 characters)")
        .max(3000, "Description is too long"),

    measurements: measurementsSchema.optional(),

    boundaries: boundariesSchema.optional(),

    surveyNumber: z.string()
        .max(100, "Survey number is too long")
        .optional(),

    registrationDetails: registrationDetailsSchema.optional(),

    order: z.number()
        .int("Order must be a whole number")
        .min(1, "Order must be at least 1")
});

/**
 * Schedule Details Schema (collection)
 */
export const scheduleDetailsSchema = z.object({
    schedules: z.array(scheduleSchema)
        .max(26, "Cannot have more than 26 schedules (A-Z)")
});

/**
 * Conditional Schedule Schema - Property requires boundaries and measurements
 */
export const scheduleWithConditionalValidation = scheduleSchema.refine(
    (data) => {
        if (data.scheduleType === 'property') {
            return data.boundaries !== undefined && data.measurements !== undefined;
        }
        return true;
    },
    {
        message: "Immovable property schedules must have both boundaries and measurements",
        path: ['scheduleType']
    }
);

/**
 * Type inference
 */
export type MeasurementsFormData = z.infer<typeof measurementsSchema>;
export type BoundariesFormData = z.infer<typeof boundariesSchema>;
export type RegistrationDetailsFormData = z.infer<typeof registrationDetailsSchema>;
export type ScheduleFormData = z.infer<typeof scheduleSchema>;
export type ScheduleDetailsFormData = z.infer<typeof scheduleDetailsSchema>;

/**
 * Validate a single schedule
 */
export function validateSchedule(data: unknown) {
    return scheduleSchema.safeParse(data);
}

/**
 * Validate schedule with conditional rules
 */
export function validateScheduleConditional(data: unknown) {
    return scheduleWithConditionalValidation.safeParse(data);
}

/**
 * Validate schedule details (all schedules)
 */
export function validateScheduleDetails(data: unknown) {
    return scheduleDetailsSchema.safeParse(data);
}

/**
 * Business Rule: Property case should have at least one schedule
 */
export function validatePropertyCaseHasSchedule(
    caseType: string,
    schedules: ScheduleFormData[]
): { isValid: boolean; warning?: string } {
    const propertyCaseTypes = ['OS', 'OP'];

    if (propertyCaseTypes.includes(caseType) && schedules.length === 0) {
        return {
            isValid: true, // Not blocking, just a warning
            warning: 'Property cases (OS/OP) typically require at least one schedule'
        };
    }

    return { isValid: true };
}

/**
 * Business Rule: Validate schedule names are unique
 */
export function validateUniqueScheduleNames(
    schedules: ScheduleFormData[]
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const names = schedules.map(s => s.scheduleName);
    const uniqueNames = new Set(names);

    if (names.length !== uniqueNames.size) {
        errors.push("Schedule names must be unique");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Get validation error messages
 */
export function getScheduleErrors(data: unknown): Record<string, string> {
    const result = scheduleWithConditionalValidation.safeParse(data);

    if (result.success) {
        return {};
    }

    const errors: Record<string, string> = {};

    result.error.issues.forEach((err) => {
        const field = err.path.join('.');
        errors[field] = err.message;
    });

    return errors;
}
