/**
 * Document List Component
 * 
 * Displays the list of added documents in a table format.
 * Matches the format required for the "List of Documents" schedule in the draft.
 */

import { Edit2, Trash2, FileText, Calendar, Paperclip } from 'lucide-react';
import type { DocumentItem } from '@/types/suit';

interface DocumentListProps {
    documents: DocumentItem[];
    onEdit: (document: DocumentItem) => void;
    onDelete: (id: string) => void;
}

export function DocumentList({ documents, onEdit, onDelete }: DocumentListProps) {
    if (documents.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <p>No documents added yet.</p>
                <span className="empty-hint">Add the list of documents relied upon (e.g., Sale Deed, Tax Receipt).</span>
            </div>
        );
    }

    // Helper to format date
    const formatDate = (date?: Date | string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Helper to get type label
    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'original': return 'Original';
            case 'certified_copy': return 'Certified Copy';
            case 'xerox': return 'Photocopy';
            case 'affidavit': return 'Affidavit';
            default: return type.replace('_', ' ');
        }
    };

    return (
        <div className="document-list-container">
            <table className="document-table">
                <thead>
                    <tr>
                        <th className="w-16">Sl No</th>
                        <th>Description of Document</th>
                        <th className="w-32">Date</th>
                        <th className="w-32">Type</th>
                        <th className="w-24">Marking</th>
                        <th className="w-24">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc, index) => (
                        <tr key={doc.id}>
                            <td className="text-center">{index + 1}</td>
                            <td>
                                <div className="description-cell">
                                    <span className="doc-desc">{doc.description}</span>
                                    {doc.pageCount && (
                                        <span className="doc-meta">{doc.pageCount} pages</span>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    <span>{formatDate(doc.date)}</span>
                                </div>
                            </td>
                            <td>
                                <span className={`type-badge ${doc.documentType}`}>
                                    {getTypeLabel(doc.documentType)}
                                </span>
                            </td>
                            <td className="text-center">
                                {doc.isMarked ? (
                                    <span className="marking-badge">
                                        {doc.markingLabel || `EX-A${index + 1}`}
                                    </span>
                                ) : (
                                    <span className="text-slate-400 text-sm">-</span>
                                )}
                            </td>
                            <td>
                                <div className="actions-cell">
                                    <button
                                        onClick={() => onEdit(doc)}
                                        className="action-btn edit"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(doc.id)}
                                        className="action-btn delete"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                .document-list-container {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    background: #f9fafb;
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
                }

                .document-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.875rem;
                }

                .document-table th {
                    background: #f9fafb;
                    padding: 0.75rem 1rem;
                    text-align: left;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .document-table th.text-center {
                    text-align: center;
                }

                .document-table td {
                    padding: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                    color: #1f2937;
                    vertical-align: top;
                }

                .document-table tr:last-child td {
                    border-bottom: none;
                }
                
                .document-table td.text-center {
                    text-align: center;
                }

                .description-cell {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .doc-desc {
                    font-weight: 500;
                    color: #111827;
                }

                .doc-meta {
                    font-size: 0.75rem;
                    color: #6b7280;
                }

                .type-badge {
                    display: inline-block;
                    padding: 0.125rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    text-transform: capitalize;
                }

                .type-badge.original { background: #dcfce7; color: #166534; }
                .type-badge.certified_copy { background: #dbeafe; color: #1e40af; }
                .type-badge.xerox { background: #f3f4f6; color: #374151; }
                .type-badge.affidavit { background: #fef9c3; color: #854d0e; }

                .marking-badge {
                    background: #f3e8ff;
                    color: #6b21a8;
                    padding: 0.125rem 0.5rem;
                    border-radius: 9999px;
                    font-weight: 600;
                    font-size: 0.75rem;
                }
                
                .actions-cell {
                    display: flex;
                    justify-content: center;
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
                }

                .action-btn.edit { color: #6b7280; }
                .action-btn.edit:hover { color: #2563eb; background: #dbeafe; }

                .action-btn.delete { color: #6b7280; }
                .action-btn.delete:hover { color: #dc2626; background: #fee2e2; }
                
                .w-16 { width: 4rem; }
                .w-24 { width: 6rem; }
                .w-32 { width: 8rem; }
            `}</style>
        </div>
    );
}
