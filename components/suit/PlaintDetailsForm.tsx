/**
 * Plaint Details Form Component
 * 
 * Main form for Step 2: Plaint Details section.
 * Combines all plaint-related inputs:
 * - Cause of Action
 * - Jurisdiction
 * - Facts of Case (simplified)
 * - Relief Sought (simplified)
 * - Valuation
 * 
 * Integrates with PartyManager to complete Step 2.
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updatePlaintDetails, goToNextStep, goToPreviousStep } from '@/store/suit-draft-slice';
import { selectPlaintDetails } from '@/store/selectors';
import { CauseOfActionForm } from './CauseOfActionForm';
import { JurisdictionForm } from './JurisdictionForm';

export interface PlaintDetailsFormProps {
  onBack?: () => void;
}

export function PlaintDetailsForm({ onBack }: PlaintDetailsFormProps) {
  const dispatch = useAppDispatch();
  const existingData = useAppSelector(selectPlaintDetails);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: existingData ? JSON.parse(JSON.stringify(existingData)) : {
      causeOfAction: {
        dateOfCause: '',
        placeOfCause: '',
        description: ''
      },
      jurisdiction: {
        territorialJurisdiction: '',
        pecuniaryJurisdiction: '',
        subjectMatterJurisdiction: ''
      },
      factsOfCase: {
        summary: ''
      },
      reliefSought: [
        {
          id: crypto.randomUUID(),
          type: 'declaration',
          description: '',
          order: 1
        }
      ],
      valuation: {
        propertyValue: 0,
        reliefValue: 0,
        courtFee: 0
      }
    }
  });

  const onSubmit = (data: any) => {
    dispatch(updatePlaintDetails(data.plaintDetails));
    dispatch(goToNextStep());
  };

  // Auto-save on changes
  useEffect(() => {
    const subscription = watch((data: any) => {
      if (data.plaintDetails) {
        dispatch(updatePlaintDetails(data.plaintDetails));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  return (
    <div className="plaint-details-form">
      <div className="form-header">
        <h2>Plaint Details</h2>
        <p className="form-description">
          Provide comprehensive details about the case including cause of action, jurisdiction, facts, relief, and valuation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-content">
        {/* Cause of Action */}
        <CauseOfActionForm register={register} errors={errors} watch={watch} />

        {/* Jurisdiction */}
        <JurisdictionForm register={register} errors={errors} />

        {/* Facts of Case (Simplified) */}
        <div className="form-section">
          <h3 className="section-title">Facts of the Case</h3>
          <p className="section-description">
            Provide a chronological summary of all relevant facts leading to this suit.
          </p>

          <div className="form-group">
            <label htmlFor="factsSummary" className="form-label required">
              Summary of Facts
            </label>
            <textarea
              id="factsSummary"
              {...register('plaintDetails.factsOfCase.summary')}
              className={`form-textarea ${(errors as any).plaintDetails?.factsOfCase?.summary ? 'error' : ''}`}
              rows={8}
              placeholder="Provide a detailed chronological account of all facts relevant to this case..."
            />
            {(errors as any).plaintDetails?.factsOfCase?.summary && (
              <span className="error-message">
                {(errors as any).plaintDetails.factsOfCase.summary.message as string}
              </span>
            )}
            <span className="help-text">
              Minimum 100 characters. Present facts chronologically and objectively.
            </span>
          </div>
        </div>

        {/* Relief Sought (Simplified) */}
        <div className="form-section">
          <h3 className="section-title">Relief Sought</h3>
          <p className="section-description">
            Specify what you are asking the court to grant.
          </p>

          <div className="form-group">
            <label htmlFor="reliefType" className="form-label required">
              Type of Relief
            </label>
            <select
              id="reliefType"
              {...register('plaintDetails.reliefSought.0.type')}
              className="form-select"
            >
              <option value="declaration">Declaration</option>
              <option value="injunction">Injunction</option>
              <option value="specific_performance">Specific Performance</option>
              <option value="damages">Damages</option>
              <option value="possession">Possession</option>
              <option value="partition">Partition</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reliefDescription" className="form-label required">
              Description of Relief
            </label>
            <textarea
              id="reliefDescription"
              {...register('plaintDetails.reliefSought.0.description')}
              className={`form-textarea ${(errors as any).plaintDetails?.reliefSought?.[0]?.description ? 'error' : ''}`}
              rows={5}
              placeholder="Describe the specific relief you are seeking from the court..."
            />
            {(errors as any).plaintDetails?.reliefSought?.[0]?.description && (
              <span className="error-message">
                {(errors as any).plaintDetails.reliefSought[0].description.message as string}
              </span>
            )}
            <span className="help-text">
              Be specific about what you want the court to order or declare.
            </span>
          </div>
        </div>

        {/* Valuation (Simplified) */}
        <div className="form-section">
          <h3 className="section-title">Suit Valuation</h3>
          <p className="section-description">
            Provide the monetary valuation for court fee calculation.
          </p>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="propertyValue" className="form-label required">
                Property/Subject Matter Value (₹)
              </label>
              <input
                type="number"
                id="propertyValue"
                {...register('plaintDetails.valuation.propertyValue', { valueAsNumber: true })}
                className="form-input"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <span className="help-text">Market value of property or subject matter</span>
            </div>

            <div className="form-group">
              <label htmlFor="reliefValue" className="form-label required">
                Relief Value (₹)
              </label>
              <input
                type="number"
                id="reliefValue"
                {...register('plaintDetails.valuation.reliefValue', { valueAsNumber: true })}
                className="form-input"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <span className="help-text">Monetary value of the relief sought</span>
            </div>

            <div className="form-group">
              <label htmlFor="courtFee" className="form-label">
                Court Fee (₹)
              </label>
              <input
                type="number"
                id="courtFee"
                {...register('plaintDetails.valuation.courtFee', { valueAsNumber: true })}
                className="form-input"
                min="0"
                step="0.01"
                placeholder="Auto-calculated"
              />
              <span className="help-text">Leave blank for auto-calculation</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                dispatch(goToPreviousStep());
              }
            }}
          >
            ← Back to Parties
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid}
          >
            Next: Schedules →
          </button>
        </div>
      </form>

      <style jsx>{`
        .plaint-details-form {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .form-header {
          background: white;
          padding: 2rem;
          border-radius: 8px 8px 0 0;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .form-header h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .form-description {
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .form-content {
          background: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .form-section {
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .section-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .form-group:last-child {
          margin-bottom: 0;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        
        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }
        
        .form-label.required::after {
          content: '*';
          color: #ef4444;
          margin-left: 0.25rem;
        }
        
        .form-input,
        .form-select,
        .form-textarea {
          padding: 0.625rem 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.2s;
          font-family: inherit;
        }
        
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 0.75rem;
        }
        
        .help-text {
          color: #6b7280;
          font-size: 0.75rem;
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding-top: 2rem;
          border-top: 2px solid #e5e7eb;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
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
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
