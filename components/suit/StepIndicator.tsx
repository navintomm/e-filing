/**
 * Step Indicator Component
 * 
 * Displays progress through the 9-step Draft Suit wizard.
 * Shows current step, completed steps, and upcoming steps.
 * 
 * Visual design inspired by Kerala e-Filing system.
 */

'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentStep, selectMetadata } from '@/store/selectors';

export interface StepConfig {
  id: number;
  name: string;
  shortName: string;
  description: string;
  required: boolean;
}

export const WIZARD_STEPS: StepConfig[] = [
  {
    id: 1,
    name: "Basic Details",
    shortName: "Basic",
    description: "District, Court, Case Type",
    required: true
  },
  {
    id: 2,
    name: "Party & Plaint Details",
    shortName: "Parties",
    description: "Plaintiffs, Defendants, Facts, Relief",
    required: true
  },
  {
    id: 3,
    name: "Schedule Details",
    shortName: "Schedules",
    description: "Property, Boundaries, Measurements",
    required: false
  },
  {
    id: 4,
    name: "Document Details",
    shortName: "Documents",
    description: "Supporting Documents List",
    required: true
  },
  {
    id: 5,
    name: "Interlocutory Applications",
    shortName: "IAs",
    description: "IAs with Grounds",
    required: false
  },
  {
    id: 6,
    name: "Upload Judgements",
    shortName: "Judgements",
    description: "Reference Case Laws",
    required: false
  },
  {
    id: 7,
    name: "Generate Documents",
    shortName: "Generate",
    description: "12+ Court Documents",
    required: true
  },
  {
    id: 8,
    name: "Preview & Edit",
    shortName: "Preview",
    description: "Google Docs Integration",
    required: true
  },
  {
    id: 9,
    name: "Download",
    shortName: "Download",
    description: "PDF + DOCX Files",
    required: true
  }
];

export function StepIndicator() {
  const [mounted, setMounted] = React.useState(false);

  // Hydration fix: Handle client-only state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentStepFromStore = useAppSelector(selectCurrentStep);
  const metadata = useAppSelector(selectMetadata);

  // Use default values during SSR/initial render to match server
  const currentStep = mounted ? currentStepFromStore : 1;
  // Show completed steps only after the user has moved past step 1
  const completedSteps = mounted && currentStep > 1 ? (metadata?.completedSteps || []) : [];

  const currentStepRef = React.useRef<HTMLDivElement>(null);

  // Reset sidebar scroll position on mount - target the actual scrollable parent (.wizard-sidebar)
  React.useEffect(() => {
    const resetScroll = () => {
      // The wizard-sidebar (aside element) is the actual scrollable container
      const sidebar = document.querySelector('.wizard-sidebar');
      if (sidebar) {
        sidebar.scrollTop = 0;
        // Force scroll to top with a small delay to override browser scroll restoration
        setTimeout(() => {
          if (sidebar) {
            sidebar.scrollTop = 0;
          }
        }, 50);
      }
    };

    // Use requestAnimationFrame to ensure the container is rendered
    requestAnimationFrame(resetScroll);
  }, []);

  return (
    <div className="step-indicator">
      <div className="step-indicator-header">
        <h3 className="step-indicator-title">Draft Suit Progress</h3>
        <span className="step-counter">
          Step {currentStep} of {WIZARD_STEPS.length}
        </span>
      </div>

      <div className="steps-container">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isUpcoming = step.id > currentStep;
          const isAccessible = step.id <= currentStep + 1;

          return (
            <div key={step.id} className="step-wrapper" ref={isCurrent ? currentStepRef : null}>
              <div
                className={`
                  step-item
                  ${isCurrent ? 'current' : ''}
                  ${isCompleted ? 'completed' : ''}
                  ${isUpcoming ? 'upcoming' : ''}
                  ${!step.required ? 'optional' : ''}
                `}
              >
                {/* Step Number/Icon */}
                <div className="step-icon">
                  {isCompleted ? (
                    <svg className="icon-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="step-number">{step.id}</span>
                  )}
                </div>

                {/* Step Info */}
                <div className="step-info">
                  <div className="step-name">
                    {step.name}
                    {!step.required && <span className="optional-badge">Optional</span>}
                  </div>
                  <div className="step-description">{step.description}</div>
                </div>
              </div>

              {/* Connector Line */}
              {index < WIZARD_STEPS.length - 1 && (
                <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .step-indicator {
          display: block;
          width: 100%;
          box-sizing: border-box;
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        
        .step-indicator-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .step-indicator-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }
        
        .step-counter {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 600;
        }
        
        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overscroll-behavior: contain;
        }
        
        .step-wrapper {
          position: relative;
        }
        
        .step-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border-radius: 6px;
          transition: all 0.2s;
          cursor: default;
          position: relative;
        }
        
        .step-item.current {
          background: #eff6ff;
          border: 2px solid #3b82f6;
          padding: 0.75rem 0.875rem;
        }
        
        .step-item.completed {
          background: #f0fdf4;
          border: 1px solid #22c55e;
        }
        
        .step-item.upcoming {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        }
        
        .step-icon {
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          transition: all 0.2s;
        }
        
        .step-item.current .step-icon {
          background: #3b82f6;
          color: white;
        }
        
        .step-item.completed .step-icon {
          background: #22c55e;
          color: white;
        }
        
        .step-item.upcoming .step-icon {
          background: #e5e7eb;
          color: #9ca3af;
        }
        
        .icon-check {
          width: 1.5rem;
          height: 1.5rem;
        }
        
        .step-number {
          font-size: 1.125rem;
        }
        
        .step-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }
        
        .step-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .step-item.current .step-name {
          color: #3b82f6;
        }
        
        .step-item.upcoming .step-name {
          color: #6b7280;
        }
        
        .optional-badge {
          font-size: 0.625rem;
          font-weight: 500;
          background: #fef3c7;
          color: #92400e;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
        }
        
        .step-description {
          font-size: 0.75rem;
          color: #6b7280;
          line-height: 1.2;
        }
        
        .step-item.current .step-description {
          color: #2563eb;
        }
        
        .step-connector {
          width: 2px;
          height: 1rem;
          background: #e5e7eb;
          margin-left: calc(1rem + 1.25rem - 1px);
          transition: background 0.2s;
        }
        
        .step-connector.completed {
          background: #22c55e;
        }
        
        @media (max-width: 768px) {
          .step-indicator {
            padding: 1rem;
          }
          
          .step-indicator-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .step-item {
            padding: 0.75rem;
          }
          
          .step-icon {
            width: 2rem;
            height: 2rem;
          }
          
          .step-name {
            font-size: 0.8125rem;
          }
          
          .step-description {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
