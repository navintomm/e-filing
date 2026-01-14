/**
 * Redux Selectors for Draft Suit System
 * 
 * Reusable selector functions for accessing specific parts of the state.
 * Promotes code reuse and makes components cleaner.
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Party, Schedule, DocumentItem, InterlocutoryApplication } from '@/types/suit';

// ============================================================================
// BASIC SELECTORS
// ============================================================================

/**
 * Get current draft
 */
export const selectCurrentDraft = (state: RootState) => state.suitDraft.currentDraft;

/**
 * Get current step
 */
export const selectCurrentStep = (state: RootState) => state.suitDraft.currentStep;

/**
 * Get validation errors
 */
export const selectValidationErrors = (state: RootState) => state.suitDraft.validationErrors;

/**
 * Get saving status
 */
export const selectIsSaving = (state: RootState) => state.suitDraft.isSaving;

/**
 * Get generating status
 */
export const selectIsGenerating = (state: RootState) => state.suitDraft.isGenerating;

/**
 * Get generation progress
 */
export const selectGenerationProgress = (state: RootState) => state.suitDraft.generationProgress;

/**
 * Get error
 */
export const selectError = (state: RootState) => state.suitDraft.error;

// ============================================================================
// DRAFT DATA SELECTORS
// ============================================================================

/**
 * Get basic details
 */
export const selectBasicDetails = createSelector(
    [selectCurrentDraft],
    (draft) => draft?.basicDetails
);

/**
 * Get party details
 */
export const selectPartyDetails = createSelector(
    [selectCurrentDraft],
    (draft) => draft?.partyDetails
);

/**
 * Get plaintiffs
 */
export const selectPlaintiffs = createSelector(
    [selectPartyDetails],
    (partyDetails) => partyDetails?.plaintiffs || []
);

/**
 * Get defendants
 */
export const selectDefendants = createSelector(
    [selectPartyDetails],
    (partyDetails) => partyDetails?.defendants || []
);

/**
 * Get total number of parties
 */
export const selectTotalParties = createSelector(
    [selectPlaintiffs, selectDefendants],
    (plaintiffs, defendants) => plaintiffs.length + defendants.length
);

/**
 * Get plaint details
 */
export const selectPlaintDetails = createSelector(
    [selectCurrentDraft],
    (draft) => draft?.plaintDetails
);

/**
 * Get schedule details
 */
export const selectScheduleDetails = createSelector(
    [selectCurrentDraft],
    (draft) => draft?.scheduleDetails
);

/**
 * Get schedules
 */
export const selectSchedules = createSelector(
    [selectScheduleDetails],
    (scheduleDetails) => scheduleDetails?.schedules || []
);

/**
 * Get document details
 */
export const selectDocumentDetails = createSelector(
    [selectCurrentDraft],
    (draft) => draft?.documentDetails
);

/**
 * Get documents
 */
export const selectDocuments = createSelector(
    [selectDocumentDetails],
    (documentDetails) => documentDetails?.documents || []
);

/**
 * Get total pages
 */
export const selectTotalPages = createSelector(
    [selectDocumentDetails],
    (documentDetails) => documentDetails?.totalPages || 0
);

/**
 * Get IA details
 */
export const selectIADetails = createSelector(
    [selectCurrentDraft],
    (draft) => draft?.iaDetails
);

/**
 * Get IAs
 */
export const selectIAs = createSelector(
    [selectIADetails],
    (iaDetails) => iaDetails?.applications || []
);

/**
 * Get judgement details
 */
export const selectJudgementDetails = createSelector(
    [selectCurrentDraft],
    (draft) => draft?.judgementDetails
);

/**
 * Get judgements
 */
export const selectJudgements = createSelector(
    [selectJudgementDetails],
    (judgementDetails) => judgementDetails?.judgements || []
);

/**
 * Get draft metadata
 */
export const selectMetadata = createSelector(
    [selectCurrentDraft],
    (draft) => draft?.metadata
);

/**
 * Get generated documents
 */
export const selectGeneratedDocuments = createSelector(
    [selectMetadata],
    (metadata) => metadata?.generatedDocuments || []
);

// ============================================================================
// COMPUTED SELECTORS
// ============================================================================

/**
 * Check if draft exists
 */
export const selectHasDraft = createSelector(
    [selectCurrentDraft],
    (draft) => draft !== null
);

/**
 * Check if a specific step is completed
 */
export const selectIsStepCompleted = (step: number) =>
    createSelector(
        [selectMetadata],
        (metadata) => metadata?.completedSteps.includes(step) || false
    );

/**
 * Check if all required steps are completed
 */
export const selectAreAllStepsCompleted = createSelector(
    [selectMetadata],
    (metadata) => {
        if (!metadata) return false;
        // Steps 1, 2, 4 are required; 3, 5, 6 are optional
        const requiredSteps = [1, 2, 4];
        return requiredSteps.every(step => metadata.completedSteps.includes(step));
    }
);

/**
 * Check if draft is complete (all documents generated)
 */
export const selectIsDraftComplete = createSelector(
    [selectMetadata],
    (metadata) => metadata?.isComplete || false
);

/**
 * Get validation errors for current step
 */
export const selectCurrentStepErrors = createSelector(
    [selectValidationErrors, selectCurrentStep],
    (errors, currentStep) => errors[currentStep] || []
);

/**
 * Check if current step has errors
 */
export const selectCurrentStepHasErrors = createSelector(
    [selectCurrentStepErrors],
    (errors) => errors.length > 0
);

/**
 * Get draft age (time since last update)
 */
export const selectDraftAge = createSelector(
    [selectMetadata],
    (metadata) => {
        if (!metadata) return null;
        const now = new Date();
        const updated = metadata.updatedAt;
        const diffMs = now.getTime() - updated.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        return diffMins;
    }
);

/**
 * Get case reference string (for display)
 */
export const selectCaseReference = createSelector(
    [selectBasicDetails],
    (basicDetails) => {
        if (!basicDetails) return 'New Draft';
        const { caseType, caseNumber, year } = basicDetails;
        if (caseNumber && year) {
            return `${caseType || 'Unknown'} ${caseNumber}/${year}`;
        }
        if (caseType) {
            return `${caseType} Draft`;
        }
        return 'New Draft';
    }
);

/**
 * Get percentage of steps completed
 */
export const selectProgressPercentage = createSelector(
    [selectMetadata],
    (metadata) => {
        if (!metadata) return 0;
        const totalSteps = 6; // Steps 1-6 (data entry)
        const completed = metadata.completedSteps.length;
        return Math.round((completed / totalSteps) * 100);
    }
);

// ============================================================================
// SPECIFIC ITEM SELECTORS
// ============================================================================

/**
 * Get a specific party by ID
 */
export const selectPartyById = (id: string) =>
    createSelector(
        [selectPlaintiffs, selectDefendants],
        (plaintiffs, defendants) => {
            return [...plaintiffs, ...defendants].find(p => p.id === id);
        }
    );

/**
 * Get a specific schedule by ID
 */
export const selectScheduleById = (id: string) =>
    createSelector(
        [selectSchedules],
        (schedules) => schedules.find(s => s.id === id)
    );

/**
 * Get a specific document by ID
 */
export const selectDocumentById = (id: string) =>
    createSelector(
        [selectDocuments],
        (documents) => documents.find(d => d.id === id)
    );

/**
 * Get a specific IA by ID
 */
export const selectIAById = (id: string) =>
    createSelector(
        [selectIAs],
        (ias) => ias.find(ia => ia.id === id)
    );

/**
 * Get a specific judgement by ID
 */
export const selectJudgementById = (id: string) =>
    createSelector(
        [selectJudgements],
        (judgements) => judgements.find(j => j.id === id)
    );
