/**
 * Party Manager Component
 * 
 * Main component for Step 2: Party & Plaint Details (Party section).
 * Manages both plaintiffs and defendants lists.
 * 
 * Features:
 * - Add plaintiff/defendant buttons
 * - Separate lists for plaintiffs and defendants
 * - Edit/delete parties
 * - Drag-drop reordering
 * - Validation (at least 1 of each required)
 * - Navigation buttons
 */

'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addParty, updateParty, goToNextStep, goToPreviousStep } from '@/store/suit-draft-slice';
import { selectPlaintiffs, selectDefendants } from '@/store/selectors';
import { validatePartyDetails } from '@/lib/validators';
import { PartyForm } from './PartyForm';
import { PartyList } from './PartyList';
import { PlaintDetailsForm } from './PlaintDetailsForm';
import type { Party } from '@/types/suit';

export function PartyManager() {
  const dispatch = useAppDispatch();
  const plaintiffs = useAppSelector(selectPlaintiffs);
  const defendants = useAppSelector(selectDefendants);

  const [showForm, setShowForm] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [formRole, setFormRole] = useState<'plaintiff' | 'defendant'>('plaintiff');
  const [stepPhase, setStepPhase] = useState<'parties' | 'plaint'>('parties');

  // Check if can proceed
  const hasPlaintiff = plaintiffs.length > 0;
  const hasDefendant = defendants.length > 0;
  const canProceed = hasPlaintiff && hasDefendant;

  const handleAddParty = (role: 'plaintiff' | 'defendant') => {
    setFormRole(role);
    setEditingParty(null);
    setShowForm(true);
  };

  const handleEditParty = (party: Party) => {
    setFormRole(party.role);
    setEditingParty(party);
    setShowForm(true);
  };

  const handleSaveParty = (party: Party) => {
    if (editingParty) {
      // Update existing party
      dispatch(updateParty({ id: editingParty.id, party }));
    } else {
      // Add new party
      dispatch(addParty(party));
    }
    setShowForm(false);
    setEditingParty(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingParty(null);
  };

  const handleNext = () => {
    // Validation before proceeding to plaint phase
    const validation = validatePartyDetails({ plaintiffs, defendants });
    if (validation.success) {
      setStepPhase('plaint');
    }
  };

  if (stepPhase === 'plaint') {
    return <PlaintDetailsForm onBack={() => setStepPhase('parties')} />;
  }

  return (
    <div className="party-manager">
      <div className="manager-header">
        <h2>Party Details</h2>
        <p className="manager-description">
          Add plaintiffs and defendants with their full details. You can reorder them by dragging.
        </p>
      </div>

      <div className="manager-content">
        {/* Plaintiffs Section */}
        <section className="party-section">
          <div className="section-header">
            <div className="section-title-group">
              <h3 className="section-title">Plaintiffs</h3>
              <span className="party-count">{plaintiffs.length}</span>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleAddParty('plaintiff')}
            >
              <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Plaintiff
            </button>
          </div>

          {!hasPlaintiff && (
            <div className="requirement-notice">
              <svg className="notice-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              At least one plaintiff is required to proceed
            </div>
          )}

          <PartyList
            parties={plaintiffs}
            role="plaintiff"
            onEdit={handleEditParty}
          />
        </section>

        {/* Defendants Section */}
        <section className="party-section">
          <div className="section-header">
            <div className="section-title-group">
              <h3 className="section-title">Defendants</h3>
              <span className="party-count">{defendants.length}</span>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleAddParty('defendant')}
            >
              <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Defendant
            </button>
          </div>

          {!hasDefendant && (
            <div className="requirement-notice">
              <svg className="notice-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              At least one defendant is required to proceed
            </div>
          )}

          <PartyList
            parties={defendants}
            role="defendant"
            onEdit={handleEditParty}
          />
        </section>
      </div>

      {/* Navigation */}
      <div className="manager-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => dispatch(goToPreviousStep())}
        >
          ← Back to Basic Details
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!canProceed}
        >
          Next: Plaint Details →
        </button>
      </div>

      {/* Party Form Modal */}
      <PartyForm
        party={editingParty || undefined}
        role={formRole}
        onSave={handleSaveParty}
        onCancel={handleCancel}
        isOpen={showForm}
      />

      <style jsx>{`
        .party-manager {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .manager-header {
          background: white;
          padding: 2rem;
          border-radius: 8px 8px 0 0;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .manager-header h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .manager-description {
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .manager-content {
          background: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        
        .party-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .section-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #374151;
        }
        
        .party-count {
          background: #3b82f6;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          min-width: 1.75rem;
          text-align: center;
        }
        
        .requirement-notice {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 6px;
          color: #92400e;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .notice-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }
        
        .manager-footer {
          background: white;
          padding: 2rem;
          border-radius: 0 0 8px 8px;
          border-top: 2px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          gap: 1rem;
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
        
        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
        }
        
        .btn-icon {
          width: 1rem;
          height: 1rem;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
        
        @media (max-width: 640px) {
          .manager-header,
          .manager-content,
          .manager-footer {
            padding: 1rem;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .manager-footer {
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
