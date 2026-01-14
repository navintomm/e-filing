/**
 * Plaint Details Validation Schema
 * 
 * Validates Step 2: Plaint Details including cause of action, jurisdiction, facts, relief, and valuation
 */

import { z } from 'zod';

/**
 * Cause of Action Schema
 */
export const causeOfActionSchema = z.object({
    dateOfCause: z.date({
        message: "Date of cause of action is required"
    })
        .max(new Date(), "Cause of action cannot be in the future"),

    placeOfCause: z.string()
        .min(3, "Place of cause is required")
        .max(200, "Place name is too long"),

    description: z.string()
        .min(100, "Description must be at least 100 characters for detailed explanation")
        .max(5000, "Description is too long (max 5000 characters)")
});

/**
 * Jurisdiction Schema
 */
export const jurisdictionSchema = z.object({
    territorialJurisdiction: z.string()
        .min(50, "Territorial jurisdiction must be detailed (minimum 50 characters)")
        .max(2000, "Territorial jurisdiction is too long"),

    pecuniaryJurisdiction: z.string()
        .min(50, "Pecuniary jurisdiction must be detailed (minimum 50 characters)")
        .max(2000, "Pecuniary jurisdiction is too long"),

    subjectMatterJurisdiction: z.string()
        .min(50, "Subject matter jurisdiction must be detailed (minimum 50 characters)")
        .max(2000, "Subject matter jurisdiction is too long")
});

/**
 * Chronological Fact Schema
 */
export const chronologicalFactSchema = z.object({
    id: z.string()
        .min(1, "Fact ID is required"),

    date: z.date({
        message: "Date is required for chronological fact"
    }),

    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description is too long (max 1000 characters)"),

    order: z.number()
        .int("Order must be a whole number")
        .min(1, "Order must be at least 1")
});

/**
 * Facts of Case Schema
 */
export const factsOfCaseSchema = z.object({
    chronology: z.array(chronologicalFactSchema)
        .min(1, "At least one chronological fact is required")
        .max(100, "Too many chronological facts"),

    summary: z.string()
        .min(100, "Summary must be at least 100 characters")
        .max(3000, "Summary is too long (max 3000 characters)")
});

/**
 * Relief Schema
 */
export const reliefSchema = z.object({
    id: z.string()
        .min(1, "Relief ID is required"),

    reliefType: z.enum(['monetary', 'injunction', 'specific_performance', 'declaratory', 'other'], {
        message: "Please select a valid relief type"
    }),

    description: z.string()
        .min(20, "Relief description must be detailed (minimum 20 characters)")
        .max(2000, "Relief description is too long"),

    order: z.number()
        .int("Order must be a whole number")
        .min(1, "Order must be at least 1")
});

/**
 * Valuation Schema
 */
export const valuationSchema = z.object({
    marketValue: z.number()
        .nonnegative("Market value cannot be negative")
        .max(999999999999, "Market value is too large"),

    reliefValue: z.number()
        .nonnegative("Relief value cannot be negative")
        .max(999999999999, "Relief value is too large"),

    courtFeeCalculation: z.string()
        .min(20, "Please explain how court fee was calculated (minimum 20 characters)")
        .max(1000, "Court fee calculation explanation is too long"),

    courtFee: z.number()
        .nonnegative("Court fee cannot be negative")
        .optional()
});

/**
 * Complete Plaint Details Schema
 */
export const plaintDetailsSchema = z.object({
    causeOfAction: causeOfActionSchema,
    jurisdiction: jurisdictionSchema,
    factsOfCase: factsOfCaseSchema,
    reliefSought: z.array(reliefSchema)
        .min(1, "At least one relief is required")
        .max(20, "Too many reliefs"),
    valuation: valuationSchema
});

/**
 * Type inference
 */
export type CauseOfActionFormData = z.infer<typeof causeOfActionSchema>;
export type JurisdictionFormData = z.infer<typeof jurisdictionSchema>;
export type ChronologicalFactFormData = z.infer<typeof chronologicalFactSchema>;
export type FactsOfCaseFormData = z.infer<typeof factsOfCaseSchema>;
export type ReliefFormData = z.infer<typeof reliefSchema>;
export type ValuationFormData = z.infer<typeof valuationSchema>;
export type PlaintDetailsFormData = z.infer<typeof plaintDetailsSchema>;

/**
 * Validate plaint details
 */
export function validatePlaintDetails(data: unknown) {
    return plaintDetailsSchema.safeParse(data);
}

/**
 * Business Rule: Validate that valuation matches relief type
 */
export function validateValuationMatchesRelief(
    reliefs: ReliefFormData[],
    valuation: ValuationFormData
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const hasDamages = reliefs.some(r => r.reliefType === 'monetary');

    if (hasDamages && valuation.reliefValue === 0) {
        errors.push("Relief value must be specified when seeking damages");
    }

    const hasPropertyRelief = reliefs.some(r =>
        r.reliefType === 'specific_performance' || r.reliefType === 'declaratory'
    );

    if (hasPropertyRelief && valuation.marketValue === 0) {
        errors.push("Market value should be specified for property-related reliefs");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Business Rule: Chronological facts should be in date order
 */
export function validateChronologicalOrder(
    facts: ChronologicalFactFormData[]
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (let i = 1; i < facts.length; i++) {
        const prevDate = new Date(facts[i - 1].date);
        const currentDate = new Date(facts[i].date);

        if (currentDate < prevDate) {
            errors.push(`Fact ${i + 1} has an earlier date than fact ${i}. Please sort chronologically.`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Get validation error messages
 */
export function getPlaintDetailsErrors(data: unknown): Record<string, string> {
    const result = plaintDetailsSchema.safeParse(data);

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
