/**
 * Redux Slice for Draft Suit System
 * 
 * Manages all state for the multi-step suit drafting workflow including:
 * - Current draft data (all 6 steps)
 * - Current step navigation
 * - Validation errors
 * - Auto-save status
 * - Document generation status
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
    DraftSuitData,
    BasicDetails,
    Party,
    PlaintDetails,
    Schedule,
    DocumentItem,
    InterlocutoryApplication,
    Judgement,
    GeneratedDocument,
    ValidationError,
    SuitDraftUIState,
    StepNumber
} from '@/types/suit';

// Initial state
const initialState: SuitDraftUIState = {
    currentDraft: null,
    currentStep: 1,
    validationErrors: {},
    isSaving: false,
    isGenerating: false,
    generationProgress: 0,
    error: null
};

// Create the slice
const suitDraftSlice = createSlice({
    name: 'suitDraft',
    initialState,
    reducers: {
        // ========================================================================
        // DRAFT MANAGEMENT
        // ========================================================================

        /**
         * Start a new draft
         */
        startNewDraft: (state) => {
            const now = new Date().toISOString();
            const draftId = `draft_${Date.now()}`;

            state.currentDraft = {
                basicDetails: {} as BasicDetails,
                partyDetails: {
                    plaintiffs: [],
                    defendants: []
                },
                plaintDetails: {} as PlaintDetails,
                scheduleDetails: {
                    schedules: []
                },
                documentDetails: {
                    documents: [],
                    totalPages: 0
                },
                iaDetails: {
                    applications: []
                },
                judgementDetails: {
                    judgements: []
                },
                metadata: {
                    draftId,
                    createdAt: new Date(now),
                    updatedAt: new Date(now),
                    currentStep: 1,
                    completedSteps: [],
                    isComplete: false
                }
            };

            state.currentStep = 1;
            state.validationErrors = {};
            state.error = null;
        },

        /**
         * Load an existing draft
         */
        loadDraft: (state, action: PayloadAction<DraftSuitData>) => {
            state.currentDraft = action.payload;
            state.currentStep = action.payload.metadata.currentStep;
            state.validationErrors = {};
            state.error = null;
        },

        /**
         * Clear current draft
         */
        clearDraft: (state) => {
            state.currentDraft = null;
            state.currentStep = 1;
            state.validationErrors = {};
            state.error = null;
        },

        // ========================================================================
        // STEP 1: BASIC DETAILS
        // ========================================================================

        /**
         * Update basic details (Step 1)
         */
        updateBasicDetails: (state, action: PayloadAction<BasicDetails>) => {
            if (state.currentDraft) {
                state.currentDraft.basicDetails = action.payload;
                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        // ========================================================================
        // STEP 2: PARTY & PLAINT DETAILS
        // ========================================================================

        /**
         * Add a party (plaintiff or defendant)
         */
        addParty: (state, action: PayloadAction<Party>) => {
            if (state.currentDraft) {
                const { role } = action.payload;
                if (role === 'plaintiff') {
                    state.currentDraft.partyDetails.plaintiffs.push(action.payload);
                } else {
                    state.currentDraft.partyDetails.defendants.push(action.payload);
                }
                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Update a party
         */
        updateParty: (state, action: PayloadAction<{ id: string; party: Party }>) => {
            if (state.currentDraft) {
                const { id, party } = action.payload;
                const { role } = party;

                if (role === 'plaintiff') {
                    const index = state.currentDraft.partyDetails.plaintiffs.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.currentDraft.partyDetails.plaintiffs[index] = party;
                    }
                } else {
                    const index = state.currentDraft.partyDetails.defendants.findIndex(p => p.id === id);
                    if (index !== -1) {
                        state.currentDraft.partyDetails.defendants[index] = party;
                    }
                }
                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Remove a party
         */
        removeParty: (state, action: PayloadAction<{ id: string; role: 'plaintiff' | 'defendant' }>) => {
            if (state.currentDraft) {
                const { id, role } = action.payload;

                if (role === 'plaintiff') {
                    state.currentDraft.partyDetails.plaintiffs =
                        state.currentDraft.partyDetails.plaintiffs.filter(p => p.id !== id);
                } else {
                    state.currentDraft.partyDetails.defendants =
                        state.currentDraft.partyDetails.defendants.filter(p => p.id !== id);
                }
                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Reorder parties (for drag-and-drop)
         */
        reorderParties: (state, action: PayloadAction<{
            role: 'plaintiff' | 'defendant';
            startIndex: number;
            endIndex: number
        }>) => {
            if (state.currentDraft) {
                const { role, startIndex, endIndex } = action.payload;
                const parties = role === 'plaintiff'
                    ? state.currentDraft.partyDetails.plaintiffs
                    : state.currentDraft.partyDetails.defendants;

                const [removed] = parties.splice(startIndex, 1);
                parties.splice(endIndex, 0, removed);

                // Re-assign order numbers
                parties.forEach((party, index) => {
                    party.order = index + 1;
                });

                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Update plaint details
         */
        updatePlaintDetails: (state, action: PayloadAction<PlaintDetails>) => {
            if (state.currentDraft) {
                state.currentDraft.plaintDetails = action.payload;
                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        // ========================================================================
        // STEP 3: SCHEDULE DETAILS
        // ========================================================================

        /**
         * Add a schedule
         */
        addSchedule: (state, action: PayloadAction<Schedule>) => {
            if (state.currentDraft) {
                state.currentDraft.scheduleDetails.schedules.push(action.payload);

                // Auto-assign letters (A, B, C...)
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
                state.currentDraft.scheduleDetails.schedules.forEach((schedule, index) => {
                    schedule.scheduleName = letters[index];
                    schedule.order = index + 1;
                });

                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Update a schedule
         */
        updateSchedule: (state, action: PayloadAction<{ id: string; schedule: Schedule }>) => {
            if (state.currentDraft) {
                const { id, schedule } = action.payload;
                const index = state.currentDraft.scheduleDetails.schedules.findIndex(s => s.id === id);
                if (index !== -1) {
                    state.currentDraft.scheduleDetails.schedules[index] = schedule;
                }
                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Remove a schedule
         */
        removeSchedule: (state, action: PayloadAction<string>) => {
            if (state.currentDraft) {
                state.currentDraft.scheduleDetails.schedules =
                    state.currentDraft.scheduleDetails.schedules.filter(s => s.id !== action.payload);

                // Re-assign letters
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
                state.currentDraft.scheduleDetails.schedules.forEach((schedule, index) => {
                    schedule.scheduleName = letters[index];
                    schedule.order = index + 1;
                });

                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        // ========================================================================
        // STEP 4: DOCUMENT DETAILS
        // ========================================================================

        /**
         * Add a document
         */
        addDocument: (state, action: PayloadAction<DocumentItem>) => {
            if (state.currentDraft) {
                state.currentDraft.documentDetails.documents.push(action.payload);

                // Auto-number documents and Exhibits
                let markedCount = 0;
                state.currentDraft.documentDetails.documents.forEach((doc, index) => {
                    doc.serialNumber = index + 1;
                    doc.order = index + 1;
                    if (doc.isMarked) {
                        markedCount++;
                        doc.markingLabel = `EX-A${markedCount}`;
                    } else {
                        doc.markingLabel = undefined;
                    }
                });

                // Auto-calculate total pages
                state.currentDraft.documentDetails.totalPages =
                    state.currentDraft.documentDetails.documents.reduce(
                        (sum, doc) => sum + (doc.pageCount || 0),
                        0
                    );

                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Update a document
         */
        updateDocument: (state, action: PayloadAction<{ id: string; document: DocumentItem }>) => {
            if (state.currentDraft) {
                const { id, document } = action.payload;
                const index = state.currentDraft.documentDetails.documents.findIndex(d => d.id === id);
                if (index !== -1) {
                    state.currentDraft.documentDetails.documents[index] = document;

                    // Auto-number documents and Exhibits
                    let markedCount = 0;
                    state.currentDraft.documentDetails.documents.forEach((doc, idx) => {
                        doc.serialNumber = idx + 1;
                        doc.order = idx + 1;
                        if (doc.isMarked) {
                            markedCount++;
                            doc.markingLabel = `EX-A${markedCount}`;
                        } else {
                            doc.markingLabel = undefined;
                        }
                    });

                    // Recalculate total pages
                    state.currentDraft.documentDetails.totalPages =
                        state.currentDraft.documentDetails.documents.reduce(
                            (sum, doc) => sum + (doc.pageCount || 0),
                            0
                        );
                }
                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Remove a document
         */
        removeDocument: (state, action: PayloadAction<string>) => {
            if (state.currentDraft) {
                state.currentDraft.documentDetails.documents =
                    state.currentDraft.documentDetails.documents.filter(d => d.id !== action.payload);

                // Re-number documents
                let markedCount = 0;
                state.currentDraft.documentDetails.documents.forEach((doc, index) => {
                    doc.serialNumber = index + 1;
                    doc.order = index + 1;
                    if (doc.isMarked) {
                        markedCount++;
                        doc.markingLabel = `EX-A${markedCount}`;
                    } else {
                        doc.markingLabel = undefined;
                    }
                });

                // Recalculate total pages
                state.currentDraft.documentDetails.totalPages =
                    state.currentDraft.documentDetails.documents.reduce(
                        (sum, doc) => sum + (doc.pageCount || 0),
                        0
                    );

                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Reorder documents (for drag-and-drop)
         */
        reorderDocuments: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
            if (state.currentDraft) {
                const { startIndex, endIndex } = action.payload;
                const documents = state.currentDraft.documentDetails.documents;

                const [removed] = documents.splice(startIndex, 1);
                documents.splice(endIndex, 0, removed);

                // Re-number documents
                let markedCount = 0;
                documents.forEach((doc, index) => {
                    doc.serialNumber = index + 1;
                    doc.order = index + 1;
                    if (doc.isMarked) {
                        markedCount++;
                        doc.markingLabel = `EX-A${markedCount}`;
                    } else {
                        doc.markingLabel = undefined;
                    }
                });

                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        // ========================================================================
        // STEP 5: INTERLOCUTORY APPLICATIONS
        // ========================================================================

        /**
         * Add an IA
         */
        addIA: (state, action: PayloadAction<InterlocutoryApplication>) => {
            if (state.currentDraft) {
                state.currentDraft.iaDetails.applications.push(action.payload);

                // Auto-generate IA numbers
                const year = state.currentDraft.basicDetails.year || new Date().getFullYear();
                state.currentDraft.iaDetails.applications.forEach((ia, index) => {
                    ia.iaNumber = `IA ${index + 1}/${year}`;
                    ia.order = index + 1;
                });

                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Update an IA
         */
        updateIA: (state, action: PayloadAction<{ id: string; ia: InterlocutoryApplication }>) => {
            if (state.currentDraft) {
                const { id, ia } = action.payload;
                const index = state.currentDraft.iaDetails.applications.findIndex(a => a.id === id);
                if (index !== -1) {
                    state.currentDraft.iaDetails.applications[index] = ia;
                }
                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Remove an IA
         */
        removeIA: (state, action: PayloadAction<string>) => {
            if (state.currentDraft) {
                state.currentDraft.iaDetails.applications =
                    state.currentDraft.iaDetails.applications.filter(a => a.id !== action.payload);

                // Re-number IAs
                const year = state.currentDraft.basicDetails.year || new Date().getFullYear();
                state.currentDraft.iaDetails.applications.forEach((ia, index) => {
                    ia.iaNumber = `IA ${index + 1}/${year}`;
                    ia.order = index + 1;
                });

                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        // ========================================================================
        // STEP 6: JUDGEMENTS
        // ========================================================================

        /**
         * Add a judgement
         */
        addJudgement: (state, action: PayloadAction<Judgement>) => {
            if (state.currentDraft) {
                state.currentDraft.judgementDetails.judgements.push(action.payload);

                // Auto-assign order
                state.currentDraft.judgementDetails.judgements.forEach((j, index) => {
                    j.order = index + 1;
                });

                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Update a judgement
         */
        updateJudgement: (state, action: PayloadAction<{ id: string; judgement: Judgement }>) => {
            if (state.currentDraft) {
                const { id, judgement } = action.payload;
                const index = state.currentDraft.judgementDetails.judgements.findIndex(j => j.id === id);
                if (index !== -1) {
                    state.currentDraft.judgementDetails.judgements[index] = judgement;
                }
                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Remove a judgement
         */
        removeJudgement: (state, action: PayloadAction<string>) => {
            if (state.currentDraft) {
                state.currentDraft.judgementDetails.judgements =
                    state.currentDraft.judgementDetails.judgements.filter(j => j.id !== action.payload);

                // Re-assign order
                state.currentDraft.judgementDetails.judgements.forEach((j, index) => {
                    j.order = index + 1;
                });

                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        // ========================================================================
        // NAVIGATION
        // ========================================================================

        /**
         * Go to next step
         */
        goToNextStep: (state) => {
            if (state.currentStep < 9 && state.currentDraft) {
                state.currentStep = (state.currentStep + 1) as StepNumber;
                state.currentDraft.metadata.currentStep = state.currentStep;

                // Mark previous step as completed
                if (!state.currentDraft.metadata.completedSteps.includes(state.currentStep - 1)) {
                    state.currentDraft.metadata.completedSteps.push(state.currentStep - 1);
                }
            }
        },

        /**
         * Go to previous step
         */
        goToPreviousStep: (state) => {
            if (state.currentStep > 1 && state.currentDraft) {
                state.currentStep = (state.currentStep - 1) as StepNumber;
                state.currentDraft.metadata.currentStep = state.currentStep;
            }
        },

        /**
         * Go to specific step
         */
        goToStep: (state, action: PayloadAction<StepNumber>) => {
            if (state.currentDraft) {
                state.currentStep = action.payload;
                state.currentDraft.metadata.currentStep = action.payload;
            }
        },

        // ========================================================================
        // VALIDATION
        // ========================================================================

        /**
         * Set validation errors for a step
         */
        setValidationErrors: (state, action: PayloadAction<{ step: number; errors: ValidationError[] }>) => {
            const { step, errors } = action.payload;
            state.validationErrors[step] = errors;
        },

        /**
         * Clear validation errors for a step
         */
        clearValidationErrors: (state, action: PayloadAction<number>) => {
            delete state.validationErrors[action.payload];
        },

        // ========================================================================
        // DOCUMENT GENERATION
        // ========================================================================

        /**
         * Start document generation
         */
        startGeneration: (state) => {
            state.isGenerating = true;
            state.generationProgress = 0;
            state.error = null;
        },

        /**
         * Update generation progress
         */
        updateGenerationProgress: (state, action: PayloadAction<number>) => {
            state.generationProgress = action.payload;
        },

        /**
         * Set generated documents
         */
        setGeneratedDocuments: (state, action: PayloadAction<GeneratedDocument[]>) => {
            if (state.currentDraft) {
                state.currentDraft.metadata.generatedDocuments = action.payload;
                state.currentDraft.metadata.isComplete = true;
                state.isGenerating = false;
                state.generationProgress = 100;
            }
        },

        /**
         * Generation error
         */
        generationError: (state, action: PayloadAction<string>) => {
            state.isGenerating = false;
            state.generationProgress = 0;
            state.error = action.payload;
        },

        // ========================================================================
        // AUTO-SAVE
        // ========================================================================

        /**
         * Start saving
         */
        startSaving: (state) => {
            state.isSaving = true;
        },

        /**
         * Saving complete
         */
        savingComplete: (state) => {
            state.isSaving = false;
            if (state.currentDraft) {
                state.currentDraft.metadata.updatedAt = new Date();
            }
        },

        /**
         * Saving error
         */
        savingError: (state, action: PayloadAction<string>) => {
            state.isSaving = false;
            state.error = action.payload;
        }
    }
});

// Export actions
export const {
    // Draft management
    startNewDraft,
    loadDraft,
    clearDraft,

    // Step 1
    updateBasicDetails,

    // Step 2
    addParty,
    updateParty,
    removeParty,
    reorderParties,
    updatePlaintDetails,

    // Step 3
    addSchedule,
    updateSchedule,
    removeSchedule,

    // Step 4
    addDocument,
    updateDocument,
    removeDocument,
    reorderDocuments,

    // Step 5
    addIA,
    updateIA,
    removeIA,

    // Step 6
    addJudgement,
    updateJudgement,
    removeJudgement,

    // Navigation
    goToNextStep,
    goToPreviousStep,
    goToStep,

    // Validation
    setValidationErrors,
    clearValidationErrors,

    // Generation
    startGeneration,
    updateGenerationProgress,
    setGeneratedDocuments,
    generationError,

    // Auto-save
    startSaving,
    savingComplete,
    savingError
} = suitDraftSlice.actions;

// Export reducer
export default suitDraftSlice.reducer;
