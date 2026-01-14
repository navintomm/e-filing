/**
 * Jurisdiction Form Component
 * 
 * Captures the three types of jurisdiction:
 * 1. Territorial Jurisdiction - Geographic authority
 * 2. Pecuniary Jurisdiction - Monetary authority  
 * 3. Subject Matter Jurisdiction - Legal authority
 * 
 * Part of Plaint Details (Step 2).
 */

'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface JurisdictionFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function JurisdictionForm({ register, errors }: JurisdictionFormProps) {
  return (
    <div className="jurisdiction-form">
      <h3 className="section-title">Jurisdiction</h3>
      <p className="section-description">
        Explain why this court has jurisdiction over this matter.
      </p>

      <div className="form-group">
        <label htmlFor="territorialJurisdiction" className="form-label required">
          <span className="label-title">Territorial Jurisdiction</span>
          <span className="label-subtitle">Why this court has geographic authority</span>
        </label>
        <textarea
          id="territorialJurisdiction"
          {...register('plaintDetails.jurisdiction.territorialJurisdiction')}
          className={`form-textarea ${(errors as any)?.plaintDetails?.jurisdiction?.territorialJurisdiction ? 'error' : ''}`}
          rows={4}
          placeholder="e.g., The cause of action arose within the territorial limits of this court..."
        />
        {(errors as any)?.plaintDetails?.jurisdiction?.territorialJurisdiction && (
          <span className="error-message">
            {(errors as any).plaintDetails.jurisdiction.territorialJurisdiction.message as string}
          </span>
        )}
        <span className="help-text">
          Explain the geographic connection (e.g., where cause arose, where parties reside, where property is located)
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="pecuniaryJurisdiction" className="form-label required">
          <span className="label-title">Pecuniary Jurisdiction</span>
          <span className="label-subtitle">Why this court has monetary authority</span>
        </label>
        <textarea
          id="pecuniaryJurisdiction"
          {...register('plaintDetails.jurisdiction.pecuniaryJurisdiction')}
          className={`form-textarea ${(errors as any)?.plaintDetails?.jurisdiction?.pecuniaryJurisdiction ? 'error' : ''}`}
          rows={4}
          placeholder="e.g., The suit valuation is within the pecuniary limits of this court..."
        />
        {(errors as any)?.plaintDetails?.jurisdiction?.pecuniaryJurisdiction && (
          <span className="error-message">
            {(errors as any).plaintDetails.jurisdiction.pecuniaryJurisdiction.message as string}
          </span>
        )}
        <span className="help-text">
          Explain why the monetary value falls within this court's jurisdiction
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="subjectMatterJurisdiction" className="form-label required">
          <span className="label-title">Subject Matter Jurisdiction</span>
          <span className="label-subtitle">Why this court has legal authority over this type of case</span>
        </label>
        <textarea
          id="subjectMatterJurisdiction"
          {...register('plaintDetails.jurisdiction.subjectMatterJurisdiction')}
          className={`form-textarea ${(errors as any)?.plaintDetails?.jurisdiction?.subjectMatterJurisdiction ? 'error' : ''}`}
          rows={4}
          placeholder="e.g., This court has jurisdiction to try civil suits of this nature under..."
        />
        {(errors as any)?.plaintDetails?.jurisdiction?.subjectMatterJurisdiction && (
          <span className="error-message">
            {(errors as any).plaintDetails.jurisdiction.subjectMatterJurisdiction.message as string}
          </span>
        )}
        <span className="help-text">
          Cite relevant laws/sections that give this court authority over this type of matter
        </span>
      </div>

      <style jsx>{`
        .jurisdiction-form {
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
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
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .label-title {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }
        
        .form-label.required .label-title::after {
          content: '*';
          color: #ef4444;
          margin-left: 0.25rem;
        }
        
        .label-subtitle {
          font-weight: 400;
          color: #6b7280;
          font-size: 0.75rem;
          font-style: italic;
        }
        
        .form-textarea {
          padding: 0.625rem 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.2s;
          font-family: inherit;
          resize: vertical;
          min-height: 100px;
        }
        
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-textarea.error {
          border-color: #ef4444;
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
      `}</style>
    </div>
  );
}
