/**
 * Party Validation Schema
 * 
 * Validates parties (plaintiffs and defendants) including addresses
 */

import { z } from 'zod';

/**
 * Address Schema
 */
export const addressSchema = z.object({
    building: z.string()
        .min(1, "Building/House name is required")
        .max(200, "Building name is too long"),

    street: z.string()
        .min(1, "Street name is required")
        .max(200, "Street name is too long"),

    locality: z.string()
        .min(1, "Locality is required")
        .max(200, "Locality is too long"),

    district: z.string()
        .min(1, "District is required")
        .max(100, "District name is too long"),

    state: z.string()
        .min(1, "State is required")
        .max(100, "State name is too long")
        .default("Kerala"),

    pincode: z.string()
        .length(6, "Pincode must be exactly 6 digits")
        .regex(/^\d{6}$/, "Pincode must contain only digits")
});

/**
 * Party Schema
 */
export const partySchema = z.object({
    id: z.string()
        .uuid("Invalid party ID format")
        .or(z.string().min(1, "Party ID is required")),

    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(200, "Name is too long")
        .regex(/^[a-zA-Z\s.]+$/, "Name can only contain letters, spaces, and dots"),

    parentageType: z.enum(['son_of', 'daughter_of', 'wife_of', 'husband_of', 'other'], {
        message: "Please select parentage type"
    }),

    parentName: z.string()
        .min(3, "Parent name is required and must be at least 3 characters")
        .max(200, "Parent name is too long"),

    age: z.number()
        .int("Age must be a whole number")
        .min(1, "Age must be at least 1")
        .max(150, "Invalid age"),

    occupation: z.string()
        .min(2, "Occupation is required")
        .max(100, "Occupation is too long"),

    address: addressSchema,

    role: z.enum(['plaintiff', 'defendant'], {
        message: "Role must be plaintiff or defendant"
    }),

    order: z.number()
        .int("Order must be a whole number")
        .min(1, "Order must be at least 1")
});

/**
 * Party Details Schema (collection of parties)
 */
export const partyDetailsSchema = z.object({
    plaintiffs: z.array(partySchema)
        .min(1, "At least one plaintiff is required")
        .max(50, "Too many plaintiffs"),

    defendants: z.array(partySchema)
        .min(1, "At least one defendant is required")
        .max(50, "Too many defendants")
});

/**
 * Type inference
 */
export type AddressFormData = z.infer<typeof addressSchema>;
export type PartyFormData = z.infer<typeof partySchema>;
export type PartyDetailsFormData = z.infer<typeof partyDetailsSchema>;

/**
 * Validate a single party
 */
export function validateParty(data: unknown) {
    return partySchema.safeParse(data);
}

/**
 * Validate party details (all parties)
 */
export function validatePartyDetails(data: unknown) {
    return partyDetailsSchema.safeParse(data);
}

/**
 * Business Rule: Check for duplicate parties
 * A person cannot be both plaintiff and defendant
 */
export function validateNoDuplicateParties(
    plaintiffs: PartyFormData[],
    defendants: PartyFormData[]
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    plaintiffs.forEach(plaintiff => {
        const isDuplicate = defendants.some(defendant => {
            // Check if names match (case-insensitive) and age is similar (±2 years)
            const nameMatch = plaintiff.name.toLowerCase().trim() === defendant.name.toLowerCase().trim();
            const ageMatch = Math.abs(plaintiff.age - defendant.age) <= 2;

            return nameMatch && ageMatch;
        });

        if (isDuplicate) {
            errors.push(`${plaintiff.name} appears as both plaintiff and defendant`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Get validation error messages
 */
export function getPartyErrors(data: unknown): Record<string, string> {
    const result = partySchema.safeParse(data);

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

/**
 * Get party details errors
 */
export function getPartyDetailsErrors(data: unknown): Record<string, string> {
    const result = partyDetailsSchema.safeParse(data);

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
