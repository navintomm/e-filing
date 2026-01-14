/**
 * Basic Details Validation Schema
 * 
 * Validates Step 1: Basic Details including district, court, case type, etc.
 */

import { z } from 'zod';

/**
 * Basic Details Schema
 */
export const basicDetailsSchema = z.object({
    district: z.string()
        .min(1, "District is required")
        .max(100, "District name is too long"),

    court: z.string()
        .min(1, "Court is required")
        .max(200, "Court name is too long"),

    caseType: z.string()
        .min(1, "Case type is required")
        .max(10, "Invalid case type"),

    vakalathType: z.enum(['vakalathnama', 'memo'], {
        message: "Please select Vakalathnama or Memo"
    }),

    partySignatureRequired: z.boolean({
        message: "Party signature preference is required"
    }),

    applicantStatus: z.enum([
        'complainant',
        'petitioner',
        'plaintiff',
        'applicant',
        'defendant',
        'respondent',
        'opposite_party',
        'other'
    ], {
        message: "Please select a valid applicant status"
    }),

    year: z.number()
        .int("Year must be a whole number")
        .min(2000, "Year must be 2000 or later")
        .max(2100, "Year is too far in the future")
        .default(() => new Date().getFullYear()),

    caseNumber: z.string()
        .optional()
        .refine(
            (val) => !val || /^\d+$/.test(val),
            "Case number must contain only digits"
        )
});

/**
 * Type inference for BasicDetailsFormData
 */
export type BasicDetailsFormData = z.infer<typeof basicDetailsSchema>;

/**
 * Validate basic details
 */
export function validateBasicDetails(data: unknown) {
    return basicDetailsSchema.safeParse(data);
}

/**
 * Conditional validation: Party signature required if Vakalathnama
 */
export function validatePartySignatureConditional(data: {
    vakalathType: string;
    partySignatureRequired: boolean;
}): boolean {
    if (data.vakalathType === 'vakalathnama') {
        // For Vakalathnama, the field must be explicitly set (true or false)
        return typeof data.partySignatureRequired === 'boolean';
    }
    return true; // For Memo, it doesn't matter
}

/**
 * Get validation error messages in user-friendly format
 */
export function getBasicDetailsErrors(data: unknown): Record<string, string> {
    const result = basicDetailsSchema.safeParse(data);

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
