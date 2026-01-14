/**
 * Party List Component
 * 
 * Displays list of parties (plaintiffs or defendants).
 * 
 * Features:
 * - Party cards showing key information
 * - Auto-numbering (1st, 2nd, 3rd Plaintiff)
 * - Edit and Delete actions
 * - Empty state
 * - Responsive design
 * 
 * Note: Drag-and-drop temporarily disabled due to package installation issues.
 * Will be re-enabled once @dnd-kit packages are successfully installed.
 */

'use client';

import { useAppDispatch } from '@/store/hooks';
import { removeParty } from '@/store/suit-draft-slice';
import type { Party } from '@/types/suit';

interface PartyListProps {
  parties: Party[];
  role: 'plaintiff' | 'defendant';
  onEdit: (party: Party) => void;
}

function PartyCard({ party, index, role, onEdit, onDelete }: {
  party: Party;
  index: number;
  role: 'plaintiff' | 'defendant';
  onEdit: (party: Party) => void;
  onDelete: (party: Party) => void;
}) {
  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + 'st';
    if (j === 2 && k !== 12) return num + 'nd';
    if (j === 3 && k !== 13) return num + 'rd';
    return num + 'th';
  };

  return (
    <div className="party-card">
      {/* Party Info */}
      <div className="party-info">
        <div className="party-header">
          <span className="party-number">
            {getOrdinalSuffix(index + 1)} {role === 'plaintiff' ? 'Plaintiff' : 'Defendant'}
          </span>
          <div className="party-actions">
            <button
              type="button"
              className="action-btn edit"
              onClick={() => onEdit(party)}
              title="Edit"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              type="button"
              className="action-btn delete"
              onClick={() => onDelete(party)}
              title="Delete"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <h4 className="party-name">{party.name}</h4>
        <div className="party-details">
          <span className="detail-item">
            {party.parentageType.replace('_', ' ')} {party.parentName}
          </span>
          <span className="detail-separator">•</span>
          <span className="detail-item">Age: {party.age}</span>
          <span className="detail-separator">•</span>
          <span className="detail-item">{party.occupation}</span>
        </div>
        <p className="party-address">
          {party.address.locality}, {party.address.district}
        </p>
      </div>

      <style jsx>{`
        .party-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s;
        }
        
        .party-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }
        
        .party-info {
          flex: 1;
        }
        
        .party-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .party-number {
          font-size: 0.75rem;
          font-weight: 600;
          color: #3b82f6;
          text-transform: capitalize;
        }
        
        .party-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .action-btn {
          width: 2rem;
          height: 2rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .action-btn svg {
          width: 1.125rem;
          height: 1.125rem;
        }
        
        .action-btn.edit {
          background: #eff6ff;
          color: #3b82f6;
        }
        
        .action-btn.edit:hover {
          background: #dbeafe;
        }
        
        .action-btn.delete {
          background: #fef2f2;
          color: #ef4444;
        }
        
        .action-btn.delete:hover {
          background: #fee2e2;
        }
        
        .party-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .party-details {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .detail-item {
          font-size: 0.875rem;
          color: #6b7280;
          text-transform: capitalize;
        }
        
        .detail-separator {
          color: #d1d5db;
        }
        
        .party-address {
          font-size: 0.875rem;
          color: #9ca3af;
        }
        
        @media (max-width: 640px) {
          .party-card {
            flex-direction: column;
          }
          
          .party-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          
          .detail-separator {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export function PartyList({ parties, role, onEdit }: PartyListProps) {
  const dispatch = useAppDispatch();

  const handleDelete = (party: Party) => {
    if (confirm(`Are you sure you want to remove ${party.name}?`)) {
      dispatch(removeParty({ id: party.id, role }));
    }
  };

  if (parties.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="empty-text">
          No {role}s added yet
        </p>
        <p className="empty-subtext">
          Click "Add {role === 'plaintiff' ? 'Plaintiff' : 'Defendant'}" to get started
        </p>

        <style jsx>{`
          .empty-state {
            padding: 3rem 2rem;
            text-align: center;
            background: #f9fafb;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
          }
          
          .empty-icon {
            width: 4rem;
            height: 4rem;
            color: #9ca3af;
            margin: 0 auto 1rem;
          }
          
          .empty-text {
            font-size: 1.125rem;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 0.5rem;
          }
          
          .empty-subtext {
            font-size: 0.875rem;
            color: #9ca3af;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="party-list">
      <div className="drag-drop-notice">
        <svg className="info-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>Drag-and-drop reordering temporarily unavailable. Edit party details to change order.</span>
      </div>

      {parties.map((party, index) => (
        <PartyCard
          key={party.id}
          party={party}
          index={index}
          role={role}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}

      <style jsx>{`
        .party-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .drag-drop-notice {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 6px;
          color: #92400e;
          font-size: 0.875rem;
        }
        
        .info-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
