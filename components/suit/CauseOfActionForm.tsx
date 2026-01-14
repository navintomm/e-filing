/**
 * Cause of Action Form Component
 * 
 * Captures the cause of action details:
 * - Date when cause arose
 * - Place where cause arose
 * - Detailed description of the cause
 * 
 * Part of Plaint Details (Step 2).
 */

'use client';

import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';

interface CauseOfActionFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
}

export function CauseOfActionForm({ register, errors, watch }: CauseOfActionFormProps) {
  const dateOfCause = watch('plaintDetails.causeOfAction.dateOfCause');

  return (
    <div className="cause-form">
      <h3 className="section-title">Cause of Action</h3>
      <p className="section-description">
        Provide details about when and where the cause of action arose.
      </p>

      <div className="form-grid">
        {/* Date of Cause */}
        <div className="form-group">
          <label htmlFor="dateOfCause" className="form-label required">
            Date of Cause
          </label>
          <input
            type="date"
            id="dateOfCause"
            {...register('plaintDetails.causeOfAction.dateOfCause')}
            className={`form-input ${(errors as any)?.plaintDetails?.causeOfAction?.dateOfCause ? 'error' : ''}`}
            max={new Date().toISOString().split('T')[0]}
          />
          {(errors as any)?.plaintDetails?.causeOfAction?.dateOfCause && (
            <span className="error-message">
              {(errors as any).plaintDetails.causeOfAction.dateOfCause.message as string}
            </span>
          )}
          <span className="help-text">When did the cause of action arise?</span>
        </div>

        {/* Place of Cause */}
        <div className="form-group">
          <label htmlFor="placeOfCause" className="form-label required">
            Place of Cause
          </label>
          <input
            type="text"
            id="placeOfCause"
            {...register('plaintDetails.causeOfAction.placeOfCause')}
            className={`form-input ${(errors as any)?.plaintDetails?.causeOfAction?.placeOfCause ? 'error' : ''}`}
            placeholder="e.g., Ernakulam, Kerala"
          />
          {(errors as any)?.plaintDetails?.causeOfAction?.placeOfCause && (
            <span className="error-message">
              {(errors as any).plaintDetails.causeOfAction.placeOfCause.message as string}
            </span>
          )}
          <span className="help-text">Where did the cause of action arise?</span>
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="causeDescription" className="form-label required">
          Description of Cause of Action
        </label>
        <textarea
          id="causeDescription"
          {...register('plaintDetails.causeOfAction.description')}
          className={`form-textarea ${(errors as any)?.plaintDetails?.causeOfAction?.description ? 'error' : ''}`}
          rows={6}
          placeholder="Describe in detail the circumstances that gave rise to this legal action..."
        />
        {(errors as any)?.plaintDetails?.causeOfAction?.description && (
          <span className="error-message">
            {(errors as any).plaintDetails.causeOfAction.description.message as string}
          </span>
        )}
        <span className="help-text">Minimum 100 characters. Be specific and factual.</span>
      </div>

      <style jsx>{`
        .cause-form {
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
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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
        .form-textarea {
          padding: 0.625rem 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.2s;
          font-family: inherit;
        }
        
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-input.error,
        .form-textarea.error {
          border-color: #ef4444;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .error-message::before {
          content: '⚠';
        }
        
        .help-text {
          color: #6b7280;
          font-size: 0.75rem;
        }
        
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
