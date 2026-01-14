/**
 * Local Storage Persistence for Draft Suit System
 * 
 * Persists draft state to localStorage for recovery on browser refresh.
 * Complements Firestore auto-save with immediate local backup.
 */

import { Middleware } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { DraftSuitData } from '@/types/suit';

const STORAGE_KEY = 'draft_suit_state';

/**
 * Save state to localStorage
 */
function saveToLocalStorage(state: RootState): void {
    try {
        const { currentDraft, currentStep } = state.suitDraft;

        if (currentDraft) {
            const dataToSave = {
                currentDraft,
                currentStep,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        }
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

/**
 * Load state from localStorage
 */
export function loadFromLocalStorage(): {
    currentDraft: DraftSuitData | null;
    currentStep: number;
} | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return null;
        }

        const parsed = JSON.parse(saved);

        // Convert ISO strings back to Date objects
        if (parsed.currentDraft) {
            parsed.currentDraft.metadata.createdAt = new Date(parsed.currentDraft.metadata.createdAt);
            parsed.currentDraft.metadata.updatedAt = new Date(parsed.currentDraft.metadata.updatedAt);

            // Convert other date fields
            if (parsed.currentDraft.plaintDetails?.causeOfAction?.dateOfCause) {
                parsed.currentDraft.plaintDetails.causeOfAction.dateOfCause =
                    new Date(parsed.currentDraft.plaintDetails.causeOfAction.dateOfCause);
            }

            if (parsed.currentDraft.plaintDetails?.factsOfCase?.chronology) {
                parsed.currentDraft.plaintDetails.factsOfCase.chronology.forEach((fact: any) => {
                    fact.date = new Date(fact.date);
                });
            }

            if (parsed.currentDraft.documentDetails?.documents) {
                parsed.currentDraft.documentDetails.documents.forEach((doc: any) => {
                    if (doc.date) {
                        doc.date = new Date(doc.date);
                    }
                });
            }
        }

        return {
            currentDraft: parsed.currentDraft,
            currentStep: parsed.currentStep
        };
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return null;
    }
}

/**
 * Clear localStorage
 */
export function clearLocalStorage(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear localStorage:', error);
    }
}

/**
 * Persistence middleware
 */
export const persistenceMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: any) => {
    const result = next(action);

    // Save to localStorage after every state change
    const state = store.getState() as RootState;
    saveToLocalStorage(state);

    return result;
};
