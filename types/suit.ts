/**
 * Complete TypeScript Type Definitions for Draft Suit System
 * 
 * This file contains all interfaces and types used throughout the suit drafting system.
 * These types ensure type safety and serve as documentation for data structures.
 */

// ============================================================================
// STEP 1: BASIC DETAILS
// ============================================================================

export type ApplicantStatus =
    | 'complainant'
    | 'petitioner'
    | 'plaintiff'
    | 'applicant'
    | 'defendant'
    | 'respondent'
    | 'opposite_party'
    | 'other';

export type VakalathType = 'vakalathnama' | 'memo';

export interface BasicDetails {
    /** Selected Kerala district */
    district: string;

    /** Court name (depends on selected district) */
    court: string;

    /** Type of case (OS, OP, CS, etc.) */
    caseType: string;

    /** Vakalathnama or Memo */
    vakalathType: VakalathType;

    /** Whether party signature is required (true for Vakalathnama) */
    partySignatureRequired: boolean;

    /** Role of the applicant */
    applicantStatus: ApplicantStatus;

    /** Year of the case */
    year: number;

    /** Optional case number (for reference during drafting) */
    caseNumber?: string;
}

// ============================================================================
// STEP 2: PARTY & PLAINT DETAILS
// ============================================================================

export type PartyRole = 'plaintiff' | 'defendant';

export type Parentage = 'son_of' | 'daughter_of' | 'wife_of' | 'husband_of' | 'other';

export interface Address {
    /** Building/House name or number */
    building: string;

    /** Street name */
    street: string;

    /** Locality/Area name */
    locality: string;

    /** District */
    district: string;

    /** State */
    state: string;

    /** Pincode */
    pincode: string;
}

export interface Party {
    /** Unique identifier */
    id: string;

    /** Full name of the party */
    name: string;

    /** Parentage type */
    parentageType: Parentage;

    /** Parent's name */
    parentName: string;

    /** Age */
    age: number;

    /** Occupation */
    occupation: string;

    /** Complete address */
    address: Address;

    /** Role in the case */
    role: PartyRole;

    /** Order number (1st plaintiff, 2nd plaintiff, etc.) */
    order: number;
}

export interface CauseOfAction {
    /** Date when cause of action arose */
    dateOfCause: Date;

    /** Place where cause of action arose */
    placeOfCause: string;

    /** Detailed description of the cause of action */
    description: string;
}

export interface Jurisdiction {
    /** Territorial jurisdiction explanation */
    territorialJurisdiction: string;

    /** Pecuniary jurisdiction explanation */
    pecuniaryJurisdiction: string;

    /** Subject matter jurisdiction explanation */
    subjectMatterJurisdiction: string;
}

export interface ChronologicalFact {
    /** Unique identifier */
    id: string;

    /** Date of the event */
    date: Date;

    /** Description of what happened */
    description: string;

    /** Order in the timeline */
    order: number;
}

export interface FactsOfCase {
    /** Chronological list of events */
    chronology: ChronologicalFact[];

    /** Summary of facts */
    summary: string;
}

export type ReliefType =
    | 'declaration'
    | 'injunction'
    | 'damages'
    | 'possession'
    | 'specific_performance'
    | 'other';

export interface Relief {
    /** Unique identifier */
    id: string;

    /** Type of relief */
    type: ReliefType;

    /** Detailed description of the relief sought */
    description: string;

    /** Order in the list of reliefs */
    order: number;
}

export interface Valuation {
    /** Market value of the subject matter */
    marketValue: number;

    /** Value of the relief sought */
    reliefValue: number;

    /** Explanation of court fee calculation */
    courtFeeCalculation: string;

    /** Calculated court fee amount */
    courtFee?: number;
}

export interface PlaintDetails {
    /** Cause of action details */
    causeOfAction: CauseOfAction;

    /** Jurisdiction details */
    jurisdiction: Jurisdiction;

    /** Facts of the case */
    factsOfCase: FactsOfCase;

    /** List of reliefs sought */
    reliefSought: Relief[];

    /** Valuation details */
    valuation: Valuation;
}

export interface PartyDetails {
    /** All plaintiffs */
    plaintiffs: Party[];

    /** All defendants */
    defendants: Party[];
}

// ============================================================================
// STEP 3: SCHEDULE DETAILS
// ============================================================================

export type ScheduleType = 'property' | 'movable' | 'document' | 'other';

export type AreaUnit = 'sqft' | 'sqm' | 'cent' | 'acre';

export interface Measurements {
    /** Area value */
    area: number;

    /** Unit of measurement */
    unit: AreaUnit;

    /** Dimensions (e.g., "50ft x 100ft") */
    dimensions?: string;
}

export interface Boundaries {
    /** North boundary description */
    north: string;

    /** South boundary description */
    south: string;

    /** East boundary description */
    east: string;

    /** West boundary description */
    west: string;
}

export interface RegistrationDetails {
    /** Document number */
    documentNumber: string;

    /** Year of registration */
    year: number;

    /** Sub-Registrar Office */
    sro: string;
}

export interface Schedule {
    /** Unique identifier */
    id: string;

    /** Schedule name (A, B, C, etc.) */
    scheduleName: string;

    /** Type of schedule */
    scheduleType: ScheduleType;

    /** Detailed description */
    description: string;

    /** Measurements (for property) */
    measurements?: Measurements;

    /** Boundaries (for property) */
    boundaries?: Boundaries;

    /** Survey number */
    surveyNumber?: string;

    /** Registration details */
    registrationDetails?: RegistrationDetails;

    /** Order in the list */
    order: number;
}

export interface ScheduleDetails {
    /** List of all schedules */
    schedules: Schedule[];
}

// ============================================================================
// STEP 4: DOCUMENT DETAILS
// ============================================================================

export type DocumentType = 'original' | 'certified_copy' | 'xerox' | 'affidavit';

export interface DocumentItem {
    /** Unique identifier */
    id: string;

    /** Serial number in the document list */
    serialNumber: number;

    /** Description of the document */
    description: string;

    /** Type of document */
    documentType: DocumentType;

    /** Date of the document (if applicable) */
    date?: Date;

    /** Number of pages */
    pageCount?: number;

    /** Whether document is marked (e.g., EX-A1) */
    isMarked: boolean;

    /** Marking label (e.g., "EX-A1", "EX-A2") */
    markingLabel?: string;

    /** Order in the list */
    order: number;
}

export interface DocumentDetails {
    /** List of all documents */
    documents: DocumentItem[];

    /** Total page count (auto-calculated) */
    totalPages: number;
}

// ============================================================================
// STEP 5: INTERLOCUTORY APPLICATIONS
// ============================================================================

export type IAUrgency = 'urgent' | 'normal';

export interface InterlocutoryApplication {
    /** Unique identifier */
    id: string;

    /** IA number (e.g., "IA 1/2025") */
    iaNumber: string;

    /** Title of the IA */
    title: string;

    /** Purpose of the IA */
    purpose: string;

    /** Grounds/reasons for the IA */
    grounds: string[];

    /** Relief requested in the IA */
    reliefRequested: string;

    /** Urgency level */
    urgency: IAUrgency;

    /** Detailed facts (can reference main plaint facts) */
    facts: string;

    /** Whether affidavit is required */
    affidavitRequired: boolean;

    /** Order in the list */
    order: number;
}

export interface IADetails {
    /** List of all interlocutory applications */
    applications: InterlocutoryApplication[];
}

// ============================================================================
// STEP 6: JUDGEMENT DETAILS
// ============================================================================

export interface Judgement {
    /** Unique identifier */
    id: string;

    /** Name of the case */
    caseName: string;

    /** Citation */
    citation: string;

    /** Court that passed the judgement */
    court: string;

    /** Year of the judgement */
    year: number;

    /** Relevant paragraphs/points (optional) */
    relevantParagraphs?: string;

    /** File URL (Google Drive) */
    fileUrl?: string;

    /** Order in the list */
    order: number;
}

export interface JudgementDetails {
    /** List of all judgements */
    judgements: Judgement[];
}

// ============================================================================
// DOCUMENT GENERATION
// ============================================================================

export type DocumentStatus = 'pending' | 'generating' | 'ready' | 'error';

export type DocumentFormat = 'docx' | 'pdf' | 'html';

export interface GeneratedDocument {
    /** Unique identifier */
    id: string;

    /** Document name */
    name: string;

    /** Document type (vakalath, plaint, etc.) */
    type: string;

    /** HTML content */
    htmlContent?: string;

    /** DOCX buffer */
    docxBuffer?: Buffer;

    /** PDF buffer */
    pdfBuffer?: Buffer;

    /** Google Docs URL (for editing) */
    googleDocsUrl?: string;

    /** Google Drive file ID */
    googleDriveFileId?: string;

    /** Direct download URL */
    downloadUrl?: string;

    /** PDF Preview URL (Blob URL) */
    pdfUrl?: string;

    /** Generation status */
    status: DocumentStatus;

    /** When the document was generated */
    generatedAt?: Date;

    /** Error message if generation failed */
    error?: string;
}

export type GeneratorFunction = (data: DraftSuitData) => Promise<string>;

export interface GenerationPipeline {
    /** Step number in generation sequence */
    step: number;

    /** Name of the document */
    documentName: string;

    /** Template identifier */
    template: string;

    /** Data sources needed */
    dataSource: string[];

    /** Generator function */
    generator: GeneratorFunction;

    /** Output format */
    outputFormat: 'docx' | 'pdf' | 'both';
}

// ============================================================================
// COMPLETE DRAFT SUIT DATA
// ============================================================================

export interface DraftSuitMetadata {
    /** Unique draft identifier */
    draftId: string;

    /** When the draft was created */
    createdAt: Date;

    /** When the draft was last updated */
    updatedAt: Date;

    /** Current step (1-9) */
    currentStep: number;

    /** List of completed steps */
    completedSteps: number[];

    /** Whether all steps are complete */
    isComplete: boolean;

    /** Generated documents */
    generatedDocuments?: GeneratedDocument[];

    /** User ID (advocate) */
    userId?: string;

    /** Draft name/title */
    draftName?: string;
}

export interface DraftSuitData {
    // Step 1: Basic Details
    basicDetails: BasicDetails;

    // Step 2: Party & Plaint Details
    partyDetails: PartyDetails;
    plaintDetails: PlaintDetails;

    // Step 3: Schedule Details
    scheduleDetails: ScheduleDetails;

    // Step 4: Document Details
    documentDetails: DocumentDetails;

    // Step 5: IA Details
    iaDetails: IADetails;

    // Step 6: Judgement Details
    judgementDetails: JudgementDetails;

    // System metadata
    metadata: DraftSuitMetadata;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationError {
    /** Field that has the error */
    field: string;

    /** Error message */
    message: string;

    /** Error code (for i18n) */
    code?: string;
}

export interface StepValidationResult {
    /** Whether the step is valid */
    isValid: boolean;

    /** List of errors */
    errors: ValidationError[];
}

// ============================================================================
// UI STATE
// ============================================================================

export interface SuitDraftUIState {
    /** Current draft being worked on */
    currentDraft: DraftSuitData | null;

    /** Current active step */
    currentStep: number;

    /** Validation errors for each step */
    validationErrors: Record<number, ValidationError[]>;

    /** Whether draft is being saved */
    isSaving: boolean;

    /** Whether documents are being generated */
    isGenerating: boolean;

    /** Generation progress (0-100) */
    generationProgress: number;

    /** Error message (if any) */
    error: string | null;
}

// ============================================================================
// KERALA SPECIFIC DATA
// ============================================================================

export interface Court {
    /** District name */
    district: string;

    /** Court name */
    name: string;

    /** Court type (District, Munsiff, etc.) */
    type: string;
}

export interface CaseTypeInfo {
    /** Case type code (OS, OP, etc.) */
    code: string;

    /** Full name */
    name: string;

    /** Description */
    description?: string;
}

// ============================================================================
// GOOGLE INTEGRATION
// ============================================================================

export interface GoogleDriveFolder {
    /** Folder ID in Google Drive */
    folderId: string;

    /** Folder name */
    name: string;

    /** Parent folder ID */
    parentId?: string;
}

export interface DownloadOptions {
    /** Format to download */
    format: 'pdf' | 'docx' | 'both';

    /** How to package files */
    packaging: 'individual' | 'zip_all' | 'zip_by_category';

    /** Metadata options */
    metadata: {
        /** Include timestamp in filename */
        includeTimestamp: boolean;

        /** Include JSON summary of inputs */
        includeSummary: boolean;
    };
}

// ============================================================================
// TEMPLATE SYSTEM
// ============================================================================

export interface TemplateData {
    /** All data needed for template rendering */
    [key: string]: any;
}

export interface TemplateSpecification {
    /** Template identifier */
    templateId: string;

    /** Template file path */
    templatePath: string;

    /** Required data fields */
    requiredFields: string[];

    /** Optional data fields */
    optionalFields?: string[];
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type StepStatus = 'not_started' | 'in_progress' | 'completed';

export interface StepInfo {
    /** Step number */
    number: StepNumber;

    /** Step name */
    name: string;

    /** Step description */
    description: string;

    /** Whether step is required */
    required: boolean;

    /** Current status */
    status: StepStatus;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
    // Re-export all types for convenience
    DraftSuitData as default
};
