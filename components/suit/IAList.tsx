/**
 * IA List Component
 * 
 * Displays the list of Interlocutory Applications in a card-based format.
 * Shows key details like IA number, title, urgency, and affidavit requirements.
 */

import { Edit2, Trash2, AlertCircle, FileText, Zap } from 'lucide-react';
import type { InterlocutoryApplication } from '@/types/suit';

interface IAListProps {
    applications: InterlocutoryApplication[];
    onEdit: (ia: InterlocutoryApplication) => void;
    onDelete: (id: string) => void;
}

export function IAList({ applications, onEdit, onDelete }: IAListProps) {
    if (applications.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <p>No interlocutory applications added yet.</p>
                <span className="empty-hint">
                    Add urgent applications like injunctions or interim reliefs that need to be filed with the suit.
                </span>
            </div>
        );
    }

    return (
        <div className="ia-grid">
            {applications.map((ia) => (
                <div key={ia.id} className="ia-card">
                    <div className="ia-header">
                        <div className="ia-number-section">
                            <span className="ia-number">{ia.iaNumber}</span>
                            {ia.urgency === 'urgent' && (
                                <span className="urgency-badge urgent">
                                    <Zap className="w-3 h-3" />
                                    Urgent
                                </span>
                            )}
                        </div>
                        <div className="ia-actions">
                            <button
                                onClick={() => onEdit(ia)}
                                className="action-btn edit"
                                title="Edit"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(ia.id)}
                                className="action-btn delete"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <h4 className="ia-title">{ia.title}</h4>

                    <div className="ia-purpose">
                        <strong>Purpose:</strong>
                        <p>{ia.purpose}</p>
                    </div>

                    <div className="ia-meta">
                        <div className="meta-item">
                            <strong>Grounds:</strong>
                            <span>{ia.grounds.length} ground(s)</span>
                        </div>
                        {ia.affidavitRequired && (
                            <div className="affidavit-badge">
                                <AlertCircle className="w-3 h-3" />
                                Affidavit Required
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <style jsx>{`
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 2rem;
                    background: #f9fafb;
                    border-radius: 8px;
                    border: 2px dashed #e5e7eb;
                    text-align: center;
                    color: #6b7280;
                }

                .empty-icon {
                    background: #e5e7eb;
                    padding: 1rem;
                    border-radius: 50%;
                    margin-bottom: 1rem;
                }

                .empty-hint {
                    font-size: 0.875rem;
                    color: #9ca3af;
                    margin-top: 0.5rem;
                    max-width: 500px;
                }

                .ia-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }

                .ia-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 1.5rem;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .ia-card:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
                }

                .ia-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #f3f4f6;
                }

                .ia-number-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .ia-number {
                    font-weight: 700;
                    color: #1f2937;
                    font-size: 0.875rem;
                    font-family: 'Courier New', monospace;
                }

                .urgency-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.125rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .urgency-badge.urgent {
                    background: #fef3c7;
                    color: #92400e;
                }

                .ia-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .action-btn {
                    padding: 0.25rem;
                    border-radius: 4px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6b7280;
                }

                .action-btn.edit:hover {
                    color: #2563eb;
                    background: #dbeafe;
                }

                .action-btn.delete:hover {
                    color: #dc2626;
                    background: #fee2e2;
                }

                .ia-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #111827;
                    margin: 0;
                    line-height: 1.4;
                }

                .ia-purpose {
                    font-size: 0.875rem;
                    color: #4b5563;
                }

                .ia-purpose strong {
                    display: block;
                    margin-bottom: 0.25rem;
                    color: #374151;
                }

                .ia-purpose p {
                    margin: 0;
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .ia-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 0.75rem;
                    border-top: 1px solid #f3f4f6;
                    font-size: 0.75rem;
                }

                .meta-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.125rem;
                }

                .meta-item strong {
                    color: #6b7280;
                    font-weight: 500;
                }

                .meta-item span {
                    color: #1f2937;
                    font-weight: 600;
                }

                .affidavit-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    background: #fef2f2;
                    color: #991b1b;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .ia-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
