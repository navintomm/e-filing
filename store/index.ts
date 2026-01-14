/**
 * Redux Store Configuration for Draft Suit System
 * 
 * Configures the Redux store with:
 * - Suit draft slice
 * - Auto-save middleware (Firestore)
 * - Persistence middleware (localStorage)
 * - DevTools integration
 */

import { configureStore } from '@reduxjs/toolkit';
import suitDraftReducer from './suit-draft-slice';
import { autoSaveMiddleware } from './auto-save-middleware';
import { persistenceMiddleware, loadFromLocalStorage } from './persistence-middleware';

/**
 * Create and configure the Redux store
 */
export const store = configureStore({
    reducer: {
        suitDraft: suitDraftReducer,
        // Add other reducers here as needed
        // auth: authReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for serialization check
                ignoredActions: [
                    'suitDraft/loadDraft',
                    'suitDraft/updatePlaintDetails',
                    'suitDraft/savingComplete'
                ],
                // Ignore these paths in the state
                ignoredPaths: [
                    'suitDraft.currentDraft.metadata.createdAt',
                    'suitDraft.currentDraft.metadata.updatedAt',
                    'suitDraft.currentDraft.plaintDetails.causeOfAction.dateOfCause',
                    'suitDraft.currentDraft.plaintDetails.factsOfCase.chronology'
                ]
            }
        })
            .concat(persistenceMiddleware) // First: Persist to localStorage
            .concat(autoSaveMiddleware),   // Second: Auto-save to Firestore

    devTools: process.env.NODE_ENV !== 'production'
});

/**
 * Load persisted state from localStorage on init
 */
export function initializeStore() {
    const persisted = loadFromLocalStorage();

    if (persisted && persisted.currentDraft) {
        // Dispatch action to load the draft
        store.dispatch({
            type: 'suitDraft/loadDraft',
            payload: persisted.currentDraft
        });

        // Set the current step - ALWAYS FORCE STEP 1
        // We restore the data, but force the user to start from the beginning
        // This prevents auto-scrolling to the bottom of the page on load
        store.dispatch({
            type: 'suitDraft/goToStep',
            payload: 1
        });

        console.log('✅ Restored draft from localStorage');
    }
}

// Initialize store on first import
if (typeof window !== 'undefined') {
    initializeStore();
}

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
