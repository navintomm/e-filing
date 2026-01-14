/**
 * Validators Index
 * 
 * Central export point for all validation schemas and functions
 */

// Basic Details
export * from './basic-details-validator';

// Party & Address
export * from './party-validator';

// Plaint Details
export * from './plaint-validator';

// Schedule Details
export * from './schedule-validator';

// Document Details
export * from './document-validator';

// Complete Suite
export * from './complete-suit-validator';

// Re-export commonly used types for convenience
export type {
    BasicDetailsFormData,
} from './basic-details-validator';

export type {
    AddressFormData,
    PartyFormData,
    PartyDetailsFormData,
} from './party-validator';

export type {
    CauseOfActionFormData,
    JurisdictionFormData,
    ChronologicalFactFormData,
    FactsOfCaseFormData,
    ReliefFormData,
    ValuationFormData,
    PlaintDetailsFormData,
} from './plaint-validator';

export type {
    MeasurementsFormData,
    BoundariesFormData,
    RegistrationDetailsFormData,
    ScheduleFormData,
    ScheduleDetailsFormData,
} from './schedule-validator';

export type {
    DocumentItemFormData,
    DocumentDetailsFormData,
} from './document-validator';

export type {
    IAFormData,
    JudgementFormData,
    CompleteDraftSuitFormData,
} from './complete-suit-validator';
