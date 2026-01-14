/**
 * Document Validation Schema
 * 
 * Validates Step 4: Document Details including document list with markings and page counts
 */

import { z } from 'zod';

/**
 * Document Item Schema
 */
export const documentItemSchema = z.object({
    id: z.string()
        .min(1, "Document ID is required"),

    serialNumber: z.number()
        .int("Serial number must be a whole number")
        .min(1, "Serial number must be at least 1"),

    description: z.string()
        .min(10, "Document description must be detailed (minimum 10 characters)")
        .max(500, "Document description is too long"),

    documentType: z.enum(['original', 'certified_copy', 'xerox', 'affidavit'], {
        message: "Please select a valid document type"
    }),

    date: z.date({
        message: "Invalid date format"
    }).optional(),

    pageCount: z.number()
        .int("Page count must be a whole number")
        .min(1, "Page count must be at least 1")
        .max(10000, "Page count is too large")
        .optional(),

    isMarked: z.boolean(),

    markingLabel: z.string()
        .regex(/^EX-[A-Z]\d+$/, "Marking label must be in format EX-A1, EX-A2, etc.")
        .optional(),

    order: z.number()
        .int("Order must be a whole number")
        .min(1, "Order must be at least 1")
});

/**
 * Document Details Schema (collection)
 */
export const documentDetailsSchema = z.object({
    documents: z.array(documentItemSchema)
        .min(1, "At least one document is required")
        .max(100, "Too many documents"),

    totalPages: z.number()
        .int("Total pages must be a whole number")
        .nonnegative("Total pages cannot be negative")
});

/**
 * Conditional validation: If marked, must have marking label
 */
export const documentItemWithConditionalValidation = documentItemSchema.refine(
    (data) => {
        if (data.isMarked) {
            return data.markingLabel !== undefined && data.markingLabel.length > 0;
        }
        return true;
    },
    {
        message: "Marked documents must have a marking label",
        path: ['markingLabel']
    }
);

/**
 * Type inference
 */
export type DocumentItemFormData = z.infer<typeof documentItemSchema>;
export type DocumentDetailsFormData = z.infer<typeof documentDetailsSchema>;

/**
 * Validate a single document
 */
export function validateDocument(data: unknown) {
    return documentItemSchema.safeParse(data);
}

/**
 * Validate document with conditional rules
 */
export function validateDocumentConditional(data: unknown) {
    return documentItemWithConditionalValidation.safeParse(data);
}

/**
 * Validate document details (all documents)
 */
export function validateDocumentDetails(data: unknown) {
    return documentDetailsSchema.safeParse(data);
}

/**
 * Business Rule: Validate total pages matches sum of individual pages
 */
export function validateTotalPagesMatch(
    documents: DocumentItemFormData[],
    totalPages: number
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const calculatedTotal = documents.reduce((sum, doc) => {
        return sum + (doc.pageCount || 0);
    }, 0);

    if (calculatedTotal !== totalPages) {
        errors.push(`Total pages (${totalPages}) doesn't match sum of document pages (${calculatedTotal})`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Business Rule: Validate marking labels are unique
 */
export function validateUniqueMarkings(
    documents: DocumentItemFormData[]
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const markings = documents
        .filter(d => d.isMarked && d.markingLabel)
        .map(d => d.markingLabel);

    const uniqueMarkings = new Set(markings);

    if (markings.length !== uniqueMarkings.size) {
        errors.push("Document marking labels must be unique");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Business Rule: Validate serial numbers are sequential
 */
export function validateSequentialSerialNumbers(
    documents: DocumentItemFormData[]
): { isValid: boolean; warning?: string } {
    for (let i = 0; i < documents.length; i++) {
        if (documents[i].serialNumber !== i + 1) {
            return {
                isValid: true, // Not blocking, just a warning
                warning: 'Serial numbers are not sequential. This will be auto-corrected.'
            };
        }
    }

    return { isValid: true };
}

/**
 * Get validation error messages
 */
export function getDocumentErrors(data: unknown): Record<string, string> {
    const result = documentItemWithConditionalValidation.safeParse(data);

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
