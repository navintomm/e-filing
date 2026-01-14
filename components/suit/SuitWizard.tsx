/**
 * Suit Wizard Component
 * 
 * Main orchestrator for the 9-step Draft Suit workflow.
 * Handles:
 * - Step rendering
 * - Navigation between steps
 * - Validation guards
 * - Progress tracking
 * - Auto-save indicator
 * 
 * Steps:
 * 1. Basic Details
 * 2. Party & Plaint Details (TODO)
 * 3. Schedule Details (TODO)
 * 4. Document Details (TODO)
 * 5. Interlocutory Applications (TODO)
 * 6. Upload Judgements (TODO)
 * 7. Generate Documents (TODO)
 * 8. Preview & Edit (TODO)
 * 9. Download (TODO)
 */

'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  startNewDraft,
  goToNextStep,
  goToPreviousStep,
  goToStep
} from '@/store/suit-draft-slice';
import {
  selectCurrentStep,
  selectCurrentDraft,
  selectIsSaving,
  selectHasDraft,
  selectCaseReference
} from '@/store/selectors';
import { canProceedToNextStep } from '@/lib/validators';
import { StepIndicator } from './StepIndicator';
import { BasicDetailsForm } from './BasicDetailsForm';
import { PartyManager } from './PartyManager';
import { ScheduleDetailsForm } from './ScheduleDetailsForm';
import { DocumentDetailsForm } from './DocumentDetailsForm';
import { IADetailsForm } from './IADetailsForm';
import { JudgementDetailsForm } from './JudgementDetailsForm';
import { GenerateDocuments } from './GenerateDocuments';
import { PreviewEdit } from './PreviewEdit';
import { DownloadForm } from './DownloadForm';

// function PlaceholderStep removed

export function SuitWizard() {
  // Hydration fix: only show dynamic content after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const dispatch = useAppDispatch();

  const hasDraft = useAppSelector(selectHasDraft);
  const isSaving = useAppSelector(selectIsSaving);
  const caseReference = useAppSelector(selectCaseReference);
  const currentDraft = useAppSelector(selectCurrentDraft);
  const currentStepFromStore = useAppSelector(selectCurrentStep);
  // During SSR show step 1, after mount use store (which is forced to 1)
  const currentStep = mounted ? currentStepFromStore : 1;

  // Initialize draft on mount; store already forces step 1
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!hasDraft) {
      dispatch(startNewDraft());
    } else {
      dispatch(goToStep(1));
    }
  }, [hasDraft, dispatch]);

  // Check if can proceed to next step (only if draft exists)
  const canProceed = currentDraft && currentDraft.basicDetails && currentDraft.partyDetails
    ? canProceedToNextStep(currentStep, currentDraft)
    : false;

  // Render current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetailsForm />;
      case 2:
        return <PartyManager />;
      case 3:
        return <ScheduleDetailsForm />;
      case 4:
        return <DocumentDetailsForm />;
      case 5:
        return <IADetailsForm />;
      case 6:
        return <JudgementDetailsForm />;
      case 7:
        return <GenerateDocuments />;
      case 8:
        return <PreviewEdit />;
      case 9:
        return <DownloadForm />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="suit-wizard">
      {/* Header */}
      <div className="wizard-header">
        <div className="wizard-header-content">
          <h1 className="wizard-title">Draft Suit System</h1>
          <div className="wizard-meta">
            <span className="case-ref">{mounted ? (caseReference || 'New Draft') : 'New Draft'}</span>
            {isSaving && (
              <span className="saving-indicator">
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="wizard-content">
        <div className="wizard-container">
          {/* Step Indicator */}
          <aside className="wizard-sidebar">
            <StepIndicator />
          </aside>

          {/* Step Content */}
          <main className="wizard-main">
            <div className="step-content">
              {renderStep()}
            </div>

            {/* Global navigation hidden as all steps handle internal navigation */}
            {false && (
              <div className="wizard-navigation">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => dispatch(goToPreviousStep())}
                >
                  ← Back
                </button>

                {currentStep < 9 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => dispatch(goToNextStep())}
                    disabled={!canProceed}
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx>{`
        .suit-wizard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        
        .wizard-header {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        
        .wizard-header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .wizard-title {
          font-size: 1.875rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .wizard-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .case-ref {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border-radius: 6px;
        }
        
        .saving-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #3b82f6;
          font-weight: 600;
        }
        
        .spinner {
          width: 1rem;
          height: 1rem;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .wizard-content {
          padding: 0 2rem;
        }
        
        .wizard-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          align-items: stretch; /* ensure children stretch vertically */
          min-height: 100vh; /* fill viewport */
        }
        
        .wizard-sidebar {
          position: sticky;
          top: 2rem;
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
          overflow-x: hidden;
          height: 100%; /* fill container height */
        }
        
        .wizard-main {
          min-height: 600px;
          height: 100%;
        }
        
        .step-content {
          margin-bottom: 2rem;
        }
        
        .wizard-navigation {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transform: translateY(-1px);
        }
        
        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        @media (max-width: 1024px) {
          .wizard-container {
            grid-template-columns: 1fr;
          }
          
          .wizard-sidebar {
            position: static;
          }
        }
        
        @media (max-width: 640px) {
          .suit-wizard {
            padding: 1rem 0;
          }
          
          .wizard-header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .wizard-content {
            padding: 0 1rem;
          }
          
          .wizard-navigation {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
