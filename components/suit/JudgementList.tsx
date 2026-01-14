/**
 * Judgement List Component
 * 
 * Displays the list of precedents/case law cited in support of the suit.
 * Shows case names, citations, courts, and years in a structured format.
 */

import { Edit2, Trash2, Scale, ExternalLink } from 'lucide-react';
import type { Judgement } from '@/types/suit';

interface JudgementListProps {
    judgements: Judgement[];
    onEdit: (judgement: Judgement) => void;
    onDelete: (id: string) => void;
}

export function JudgementList({ judgements, onEdit, onDelete }: JudgementListProps) {
    if (judgements.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <Scale className="w-8 h-8 text-slate-400" />
                </div>
                <p>No precedents added yet.</p>
                <span className="empty-hint">
                    Add relevant case law and precedents that support your legal arguments.
                </span>
            </div>
        );
    }

    return (
        <div className="judgement-list">
            {judgements.map((judgement, index) => (
                <div key={judgement.id} className="judgement-card">
                    <div className="judgement-header">
                        <div className="judgement-number">
                            <Scale className="w-4 h-4" />
                            <span>#{index + 1}</span>
                        </div>
                        <div className="judgement-actions">
                            <button
                                onClick={() => onEdit(judgement)}
                                className="action-btn edit"
                                title="Edit"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(judgement.id)}
                                className="action-btn delete"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <h4 className="case-name">{judgement.caseName}</h4>

                    <div className="citation-row">
                        <span className="citation-label">Citation:</span>
                        <span className="citation-text">{judgement.citation}</span>
                    </div>

                    <div className="judgement-meta">
                        <div className="meta-item">
                            <span className="meta-label">Court:</span>
                            <span className="meta-value">{judgement.court}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Year:</span>
                            <span className="meta-value">{judgement.year}</span>
                        </div>
                    </div>

                    {judgement.relevantParagraphs && (
                        <div className="relevant-paras">
                            <strong>Relevant Points:</strong>
                            <p>{judgement.relevantParagraphs}</p>
                        </div>
                    )}

                    {judgement.fileUrl && (
                        <a
                            href={judgement.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link"
                        >
                            <ExternalLink className="w-3 h-3" />
                            View Full Text
                        </a>
                    )}
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

                .judgement-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .judgement-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-left: 4px solid #3b82f6;
                    border-radius: 8px;
                    padding: 1.5rem;
                    transition: all 0.2s;
                }

                .judgement-card:hover {
                    border-left-color: #2563eb;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
                }

                .judgement-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .judgement-number {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #6b7280;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .judgement-actions {
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

                .case-name {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 0.75rem 0;
                    line-height: 1.4;
                }

                .citation-row {
                    display: flex;
                    gap: 0.5rem;
                    padding: 0.75rem;
                    background: #f9fafb;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                }

                .citation-label {
                    font-weight: 600;
                    color: #6b7280;
                }

                .citation-text {
                    font-family: 'Courier New', monospace;
                    color: #1f2937;
                    font-weight: 500;
                }

                .judgement-meta {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                }

                .meta-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.125rem;
                }

                .meta-label {
                    color: #6b7280;
                    font-size: 0.75rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.025em;
                }

                .meta-value {
                    color: #1f2937;
                    font-weight: 600;
                }

                .relevant-paras {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #f3f4f6;
                    font-size: 0.875rem;
                }

                .relevant-paras strong {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #374151;
                }

                .relevant-paras p {
                    margin: 0;
                    color: #4b5563;
                    line-height: 1.6;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .file-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                    margin-top: 1rem;
                    padding: 0.375rem 0.75rem;
                    background: #eff6ff;
                    color: #2563eb;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .file-link:hover {
                    background: #dbeafe;
                    color: #1d4ed8;
                }

                @media (max-width: 640px) {
                    .judgement-meta {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
