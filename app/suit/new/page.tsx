/**
 * Draft Suit Page
 * 
 * Main entry point for the Draft Suit System.
 * Renders the SuitWizard with Redux Provider.
 */

'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { SuitWizard } from '@/components/suit';

export default function DraftSuitPage() {
    return (
        <Provider store={store}>
            <SuitWizard />
        </Provider>
    );
}
