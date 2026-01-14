import { z } from "zod";

export const partySchema = z.object({
    id: z.string().optional(),
    role: z.string().min(1, "Status is required"), // This is the party status (Petitioner, Plaintiff, etc.)
    name: z.string().min(1, "Name is required"),
    age: z.string(),
    fatherOrHusbandName: z.string(),
    address: z.string(),
    pincode: z.string().optional(),
    mobile: z.string(),
    email: z.string().email().or(z.literal("")),
});

export const actSchema = z.object({
    id: z.string().optional(),
    actName: z.string().min(1, "Act is required"),
    section: z.string().min(1, "Section is required"),
});

export const applicationSchema = z.object({
    id: z.string().optional(),
    type: z.string().min(1, "Type is required"),
    classification: z.string().optional(),
    act: z.string().optional(),
    section: z.string().optional(),
    prayer: z.string().optional(),
    fileName: z.string().optional(),
    petitioner: z.string().optional(),
    respondent: z.string().optional(),
});

export const vakalathFormSchema = z.object({
    // Basic Details
    documentType: z.string().min(1, "Document Type is required"), // Renamed from filingType
    courtName: z.string().min(1, "Court Name is required"),
    caseType: z.string().min(1, "Case Type is required"),
    caseNumber: z.string(), // Optional
    year: z.string().min(4, "Year is required").regex(/^\d{4}$/, "Year must be a 4-digit number"),
    district: z.string().min(1, "District is required"),
    witnesses: z.string().min(1, "At least one witness is required"),
    includeDocket: z.boolean().default(false), // Option to include docket page

    // Logic for signature handled in form, but validated here
    partySignature: z.enum(["Yes", "No", "Not Required"]),

    // Arrays
    parties: z.array(partySchema).default([]),
    acts: z.array(actSchema).default([]),
    applications: z.array(applicationSchema).default([]),

    // Advocate Details
    advocateName: z.string().min(1, "Advocate Name is required"),
    enrollmentNumber: z.string().min(1, "Enrollment Number is required"),
    advocateAddress: z.string().min(1, "Advocate Address is required"),
    advocateMobile: z.string().min(10, "Phone number required").regex(/^\d{10}$/, "Invalid phone number"),
});

export type VakalathFormValues = z.infer<typeof vakalathFormSchema>;
export type Party = z.infer<typeof partySchema>;
