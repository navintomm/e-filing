/**
 * Complete Suit Validation
 * 
 * Master validator that validates entire draft across all 6 steps
 * Used before document generation to ensure all required data is present and valid
 */

import { z } from 'zod';
import { basicDetailsSchema } from './basic-details-validator';
import { partyDetailsSchema, validateNoDuplicateParties } from './party-validator';
import { plaintDetailsSchema, validateValuationMatchesRelief, validateChronologicalOrder } from './plaint-validator';
import { scheduleDetailsSchema, validatePropertyCaseHasSchedule } from './schedule-validator';
import { documentDetailsSchema, validateTotalPagesMatch, validateUniqueMarkings } from './document-validator';
import type { DraftSuitData, ValidationError } from '@/types/suit';

/**
 * Interlocutory Application Schema
 */
export const interlocutoryApplicationSchema = z.object({
    id: z.string().min(1, "IA ID is required"),

    iaNumber: z.string()
        .regex(/^IA \d+\/\d{4}$/, "IA number format must be 'IA 1/2025'"),

    title: z.string()
        .min(10, "Title must be at least 10 characters")
        .max(200, "Title is too long"),

    purpose: z.string()
        .min(20, "Purpose must be detailed (minimum 20 characters)")
        .max(1000, "Purpose is too long"),

    grounds: z.array(z.string().min(10, "Each ground must be detailed"))
        .min(1, "At least one ground is required")
        .max(20, "Too many grounds"),

    reliefRequested: z.string()
        .min(20, "Relief must be detailed (minimum 20 characters)")
        .max(2000, "Relief is too long"),

    urgency: z.enum(['urgent', 'normal']),

    facts: z.string()
        .min(50, "Facts must be detailed (minimum 50 characters)")
        .max(5000, "Facts are too long"),

    affidavitRequired: z.boolean(),

    order: z.number().int().min(1)
});

/**
 * IA Details Schema
 */
export const iaDetailsSchema = z.object({
    applications: z.array(interlocutoryApplicationSchema)
        .max(20, "Too many interlocutory applications")
});

/**
 * Judgement Schema
 */
export const judgementSchema = z.object({
    id: z.string().min(1, "Judgement ID is required"),

    caseName: z.string()
        .min(5, "Case name is required")
        .max(300, "Case name is too long"),

    citation: z.string()
        .min(5, "Citation is required")
        .max(200, "Citation is too long"),

    court: z.string()
        .min(3, "Court name is required")
        .max(200, "Court name is too long"),

    year: z.number()
        .int("Year must be a whole number")
        .min(1950, "Year must be 1950 or later")
        .max(new Date().getFullYear(), "Year cannot be in the future"),

    relevantParagraphs: z.string()
        .max(5000, "Relevant paragraphs text is too long")
        .optional(),

    fileUrl: z.string()
        .url("Invalid file URL")
        .optional(),

    order: z.number().int().min(1)
});

/**
 * Judgement Details Schema
 */
export const judgementDetailsSchema = z.object({
    judgements: z.array(judgementSchema)
        .max(50, "Too many judgements")
});

/**
 * Complete Draft Suit Data Schema
 */
export const completeDraftSuitSchema = z.object({
    basicDetails: basicDetailsSchema,
    partyDetails: partyDetailsSchema,
    plaintDetails: plaintDetailsSchema,
    scheduleDetails: scheduleDetailsSchema,
    documentDetails: documentDetailsSchema,
    iaDetails: iaDetailsSchema,
    judgementDetails: judgementDetailsSchema
});

/**
 * Type inference
 */
export type IAFormData = z.infer<typeof interlocutoryApplicationSchema>;
export type JudgementFormData = z.infer<typeof judgementSchema>;
export type CompleteDraftSuitFormData = z.infer<typeof completeDraftSuitSchema>;

/**
 * Validate complete draft suit data
 */
export function validateCompleteDraft(data: unknown) {
    return completeDraftSuitSchema.safeParse(data);
}

/**
 * Comprehensive validation with business rules
 * Returns detailed validation results for each step
 */
export function validateCompleteDraftWithBusinessRules(
    data: Partial<DraftSuitData>
): {
    isValid: boolean;
    errors: ValidationError[];
    warnings: string[];
    stepValidation: Record<number, { isValid: boolean; errors: ValidationError[] }>;
} {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];
    const stepValidation: Record<number, { isValid: boolean; errors: ValidationError[] }> = {};

    // Step 1: Basic Details
    const step1Result = basicDetailsSchema.safeParse(data.basicDetails);
    stepValidation[1] = {
        isValid: step1Result.success,
        errors: step1Result.success ? [] : step1Result.error.issues.map(err => ({
            field: `basicDetails.${err.path.join('.')}`,
            message: err.message
        }))
    };
    errors.push(...stepValidation[1].errors);

    // Step 2: Party & Plaint Details
    const step2PartyResult = partyDetailsSchema.safeParse(data.partyDetails);
    const step2PlaintResult = plaintDetailsSchema.safeParse(data.plaintDetails);

    const step2Errors: ValidationError[] = [];
    if (!step2PartyResult.success) {
        step2Errors.push(...step2PartyResult.error.issues.map(err => ({
            field: `partyDetails.${err.path.join('.')}`,
            message: err.message
        })));
    }
    if (!step2PlaintResult.success) {
        step2Errors.push(...step2PlaintResult.error.issues.map(err => ({
            field: `plaintDetails.${err.path.join('.')}`,
            message: err.message
        })));
    }

    // Business rule: No duplicate parties
    if (data.partyDetails) {
        const duplicateCheck = validateNoDuplicateParties(
            data.partyDetails.plaintiffs || [],
            data.partyDetails.defendants || []
        );
        if (!duplicateCheck.isValid) {
            step2Errors.push(...duplicateCheck.errors.map(err => ({
                field: 'partyDetails',
                message: err
            })));
        }
    }

    // Business rule: Valuation matches relief
    if (data.plaintDetails) {
        const valuationCheck = validateValuationMatchesRelief(
            data.plaintDetails.reliefSought || [],
            data.plaintDetails.valuation
        );
        if (!valuationCheck.isValid) {
            step2Errors.push(...valuationCheck.errors.map(err => ({
                field: 'plaintDetails.valuation',
                message: err
            })));
        }

        // Business rule: Chronological order
        if (data.plaintDetails.factsOfCase) {
            const chronologyCheck = validateChronologicalOrder(
                data.plaintDetails.factsOfCase.chronology || []
            );
            if (!chronologyCheck.isValid) {
                warnings.push(...chronologyCheck.errors);
            }
        }
    }

    stepValidation[2] = {
        isValid: step2Errors.length === 0,
        errors: step2Errors
    };
    errors.push(...step2Errors);

    // Step 3: Schedule Details (Optional, but if present must be valid)
    if (data.scheduleDetails && data.scheduleDetails.schedules && data.scheduleDetails.schedules.length > 0) {
        const step3Result = scheduleDetailsSchema.safeParse(data.scheduleDetails);
        stepValidation[3] = {
            isValid: step3Result.success,
            errors: step3Result.success ? [] : step3Result.error.issues.map(err => ({
                field: `scheduleDetails.${err.path.join('.')}`,
                message: err.message
            }))
        };
        errors.push(...stepValidation[3].errors);

        // Business rule: Property case should have schedule
        if (data.basicDetails) {
            const propertyCheck = validatePropertyCaseHasSchedule(
                data.basicDetails.caseType || '',
                data.scheduleDetails.schedules || []
            );
            if (propertyCheck.warning) {
                warnings.push(propertyCheck.warning);
            }
        }
    } else {
        stepValidation[3] = { isValid: true, errors: [] };
    }

    // Step 4: Document Details
    const step4Result = documentDetailsSchema.safeParse(data.documentDetails);
    const step4Errors: ValidationError[] = [];

    if (!step4Result.success) {
        step4Errors.push(...step4Result.error.issues.map(err => ({
            field: `documentDetails.${err.path.join('.')}`,
            message: err.message
        })));
    }

    // Business rule: Total pages matches
    if (data.documentDetails) {
        const totalPagesCheck = validateTotalPagesMatch(
            data.documentDetails.documents || [],
            data.documentDetails.totalPages || 0
        );
        if (!totalPagesCheck.isValid) {
            step4Errors.push(...totalPagesCheck.errors.map(err => ({
                field: 'documentDetails.totalPages',
                message: err
            })));
        }

        // Business rule: Unique markings
        const markingsCheck = validateUniqueMarkings(
            data.documentDetails.documents || []
        );
        if (!markingsCheck.isValid) {
            step4Errors.push(...markingsCheck.errors.map(err => ({
                field: 'documentDetails.documents',
                message: err
            })));
        }
    }

    stepValidation[4] = {
        isValid: step4Errors.length === 0,
        errors: step4Errors
    };
    errors.push(...step4Errors);

    // Step 5: IA Details (Optional)
    if (data.iaDetails && data.iaDetails.applications && data.iaDetails.applications.length > 0) {
        const step5Result = iaDetailsSchema.safeParse(data.iaDetails);
        stepValidation[5] = {
            isValid: step5Result.success,
            errors: step5Result.success ? [] : step5Result.error.issues.map(err => ({
                field: `iaDetails.${err.path.join('.')}`,
                message: err.message
            }))
        };
        errors.push(...stepValidation[5].errors);
    } else {
        stepValidation[5] = { isValid: true, errors: [] };
    }

    // Step 6: Judgement Details (Optional)
    if (data.judgementDetails && data.judgementDetails.judgements && data.judgementDetails.judgements.length > 0) {
        const step6Result = judgementDetailsSchema.safeParse(data.judgementDetails);
        stepValidation[6] = {
            isValid: step6Result.success,
            errors: step6Result.success ? [] : step6Result.error.issues.map(err => ({
                field: `judgementDetails.${err.path.join('.')}`,
                message: err.message
            }))
        };
        errors.push(...stepValidation[6].errors);
    } else {
        stepValidation[6] = { isValid: true, errors: [] };
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stepValidation
    };
}

/**
 * Check if specific step is valid
 */
export function validateStep(
    stepNumber: number,
    data: Partial<DraftSuitData>
): { isValid: boolean; errors: ValidationError[] } {
    const stepValidators: Record<number, () => { isValid: boolean; errors: ValidationError[] }> = {
        1: () => {
            const result = basicDetailsSchema.safeParse(data.basicDetails);
            return {
                isValid: result.success,
                errors: result.success ? [] : result.error.issues.map(err => ({
                    field: `basicDetails.${err.path.join('.')}`,
                    message: err.message
                }))
            };
        },
        2: () => {
            const partyResult = partyDetailsSchema.safeParse(data.partyDetails);
            const plaintResult = plaintDetailsSchema.safeParse(data.plaintDetails);
            const errors: ValidationError[] = [];

            if (!partyResult.success) {
                errors.push(...partyResult.error.issues.map(err => ({
                    field: `partyDetails.${err.path.join('.')}`,
                    message: err.message
                })));
            }
            if (!plaintResult.success) {
                errors.push(...plaintResult.error.issues.map(err => ({
                    field: `plaintDetails.${err.path.join('.')}`,
                    message: err.message
                })));
            }

            return { isValid: errors.length === 0, errors };
        },
        3: () => {
            if (!data.scheduleDetails || !data.scheduleDetails.schedules || data.scheduleDetails.schedules.length === 0) {
                return { isValid: true, errors: [] }; // Optional
            }
            const result = scheduleDetailsSchema.safeParse(data.scheduleDetails);
            return {
                isValid: result.success,
                errors: result.success ? [] : result.error.issues.map(err => ({
                    field: `scheduleDetails.${err.path.join('.')}`,
                    message: err.message
                }))
            };
        },
        4: () => {
            const result = documentDetailsSchema.safeParse(data.documentDetails);
            return {
                isValid: result.success,
                errors: result.success ? [] : result.error.issues.map(err => ({
                    field: `documentDetails.${err.path.join('.')}`,
                    message: err.message
                }))
            };
        },
        5: () => {
            if (!data.iaDetails || !data.iaDetails.applications || data.iaDetails.applications.length === 0) {
                return { isValid: true, errors: [] }; // Optional
            }
            const result = iaDetailsSchema.safeParse(data.iaDetails);
            return {
                isValid: result.success,
                errors: result.success ? [] : result.error.issues.map(err => ({
                    field: `iaDetails.${err.path.join('.')}`,
                    message: err.message
                }))
            };
        },
        6: () => {
            if (!data.judgementDetails || !data.judgementDetails.judgements || data.judgementDetails.judgements.length === 0) {
                return { isValid: true, errors: [] }; // Optional
            }
            const result = judgementDetailsSchema.safeParse(data.judgementDetails);
            return {
                isValid: result.success,
                errors: result.success ? [] : result.error.issues.map(err => ({
                    field: `judgementDetails.${err.path.join('.')}`,
                    message: err.message
                }))
            };
        }
    };

    const validator = stepValidators[stepNumber];
    return validator ? validator() : { isValid: false, errors: [{ field: 'step', message: 'Invalid step number' }] };
}

/**
 * Check if can proceed to next step
 */
export function canProceedToNextStep(
    currentStep: number,
    data: Partial<DraftSuitData>
): boolean {
    const validation = validateStep(currentStep, data);
    return validation.isValid;
}

/**
 * Check if can generate documents (all required steps valid)
 */
export function canGenerateDocuments(data: Partial<DraftSuitData>): boolean {
    const requiredSteps = [1, 2, 4]; // Steps 3, 5, 6 are optional

    return requiredSteps.every(step => {
        const validation = validateStep(step, data);
        return validation.isValid;
    });
}
