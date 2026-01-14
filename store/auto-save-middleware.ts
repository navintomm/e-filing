/**
 * Auto-Save Middleware for Draft Suit System
 * 
 * Automatically saves draft to Firestore every 30 seconds when changes are detected.
 * Debounces saves to avoid excessive writes.
 */

import { Middleware } from '@reduxjs/toolkit';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { RootState } from './index';
import { startSaving, savingComplete, savingError } from './suit-draft-slice';

// Debounce timer
let saveTimer: NodeType | null = null;
const SAVE_DELAY = 30000; // 30 seconds

// Actions that should trigger auto-save
const SAVE_TRIGGERS = [
    'suitDraft/updateBasicDetails',
    'suitDraft/addParty',
    'suitDraft/updateParty',
    'suitDraft/removeParty',
    'suitDraft/reorderParties',
    'suitDraft/updatePlaintDetails',
    'suitDraft/addSchedule',
    'suitDraft/updateSchedule',
    'suitDraft/removeSchedule',
    'suitDraft/addDocument',
    'suitDraft/updateDocument',
    'suitDraft/removeDocument',
    'suitDraft/reorderDocuments',
    'suitDraft/addIA',
    'suitDraft/updateIA',
    'suitDraft/removeIA',
    'suitDraft/addJudgement',
    'suitDraft/updateJudgement',
    'suitDraft/removeJudgement',
    'suitDraft/goToNextStep',
    'suitDraft/goToPreviousStep',
    'suitDraft/goToStep'
];

/**
 * Save draft to Firestore
 */
async function saveDraftToFirestore(state: RootState, userId: string): Promise<void> {
    const { currentDraft } = state.suitDraft;

    if (!currentDraft) {
        throw new Error('No draft to save');
    }

    const draftRef = doc(db, 'users', userId, 'draftSuits', currentDraft.metadata.draftId);

    // Prepare data for Firestore (convert Dates to Timestamps)
    const draftData = {
        ...currentDraft,
        metadata: {
            ...currentDraft.metadata,
            updatedAt: serverTimestamp()
        }
    };

    await setDoc(draftRef, draftData, { merge: true });
}

/**
 * Auto-save middleware
 */
export const autoSaveMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: any) => {
    // Pass action to next middleware/reducer
    const result = next(action);

    // Check if this action should trigger auto-save
    if (SAVE_TRIGGERS.includes(action.type)) {
        // Clear existing timer
        if (saveTimer) {
            clearTimeout(saveTimer);
        }

        // Set new timer for debounced save
        saveTimer = setTimeout(async () => {
            const state = store.getState() as RootState;

            // Get current user ID (you'll need to implement this based on your auth setup)
            const userId = state.auth?.user?.uid; // Adjust based on your auth state

            if (!userId) {
                console.warn('Cannot auto-save: No user logged in');
                return;
            }

            // Dispatch saving start
            store.dispatch(startSaving());

            try {
                await saveDraftToFirestore(state, userId);
                store.dispatch(savingComplete());
                console.log('✅ Draft auto-saved');
            } catch (error) {
                console.error('❌ Auto-save failed:', error);
                store.dispatch(savingError((error as Error).message));
            }
        }, SAVE_DELAY);
    }

    return result;
};

/**
 * Manual save function (for "Save Draft" button)
 */
export async function saveManually(store: any): Promise<void> {
    const state = store.getState() as RootState;
    const userId = state.auth?.user?.uid; // Adjust based on your auth state

    if (!userId) {
        throw new Error('No user logged in');
    }

    store.dispatch(startSaving());

    try {
        await saveDraftToFirestore(state, userId);
        store.dispatch(savingComplete());
    } catch (error) {
        store.dispatch(savingError((error as Error).message));
        throw error;
    }
}
