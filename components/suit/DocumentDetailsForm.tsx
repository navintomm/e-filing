/**
 * Document Details Form (Manager)
 * 
 * Step 4 of the Draft Suit System.
 * Manages the list of documents relied upon by the plaintiff.
 */

'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    addDocument,
    updateDocument,
    removeDocument,
    goToNextStep,
    goToPreviousStep
} from '@/store/suit-draft-slice';
import { selectDocuments } from '@/store/selectors';
import { validateDocumentDetails } from '@/lib/validators';
import { DocumentList } from './DocumentList';
import { DocumentForm } from './DocumentForm';
import type { DocumentItem } from '@/types/suit';
import { Plus } from 'lucide-react';

export function DocumentDetailsForm() {
    const dispatch = useAppDispatch();
    const documentsRaw = useAppSelector(selectDocuments);

    // Ensure safe array access
    const documents = (documentsRaw || []) as DocumentItem[];

    const [showForm, setShowForm] = useState(false);
    const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(null);

    // Calculate next marking index (e.g., if 3 marked docs exist, next is 4 -> EX-A4)
    const nextMarkingIndex = documents.filter(d => d.isMarked).length + 1;

    const handleAddDocument = () => {
        setEditingDocument(null);
        setShowForm(true);
    };

    const handleEditDocument = (doc: DocumentItem) => {
        setEditingDocument(doc);
        setShowForm(true);
    };

    const handleDeleteDocument = (id: string) => {
        if (confirm('Are you sure you want to remove this document?')) {
            dispatch(removeDocument(id));
        }
    };

    const handleSaveDocument = (docData: DocumentItem) => {
        if (editingDocument) {
            dispatch(updateDocument({ id: editingDocument.id, document: docData }));
        } else {
            dispatch(addDocument(docData));
        }
        setShowForm(false);
        setEditingDocument(null);
    };

    const handleNext = () => {
        // Validation: At least one document is typically expected, but technically optional?
        // Validator `validateDocumentDetails` requires min(1).
        const validation = validateDocumentDetails({ documents, totalPages: 0 }); // totalPages checked internally by slice logic usually

        if (!validation.success) {
            // Show error if needed, but since it's a list, usually empty list is the only blocking error
            const error = validation.error.issues.find(i => i.path.includes('documents'));
            if (error) {
                alert(error.message); // Simple alert for list-level validation
                return;
            }
        }

        dispatch(goToNextStep());
    };

    return (
        <div className="document-manager">
            <div className="manager-header">
                <h2>List of Documents</h2>
                <p className="manager-description">
                    Add all documents that you are producing nicely with the plaint.
                    These will be marked as Exhibits (e.g., Ex. A1, A2).
                </p>
            </div>

            <div className="manager-content">
                <div className="section-header">
                    <div className="section-title-group">
                        <h3 className="section-title">Documents Relied Upon</h3>
                        <span className="count-badge">{documents.length}</span>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAddDocument}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Document
                    </button>
                </div>

                <DocumentList
                    documents={documents}
                    onEdit={handleEditDocument}
                    onDelete={handleDeleteDocument}
                />
            </div>

            <div className="manager-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => dispatch(goToPreviousStep())}
                >
                    ← Back to Schedules
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                >
                    Next: Interlocutory Applications →
                </button>
            </div>

            <DocumentForm
                isOpen={showForm}
                document={editingDocument || undefined}
                onSave={handleSaveDocument}
                onCancel={() => setShowForm(false)}
                nextMarkingIndex={nextMarkingIndex}
            />

            <style jsx>{`
                .document-manager {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                
                .manager-header {
                    background: white;
                    padding: 2rem;
                    border-radius: 8px 8px 0 0;
                    border-bottom: 1px solid #e5e7eb;
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
                    min-height: 400px;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                
                .section-title-group {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .section-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #374151;
                }
                
                .count-badge {
                    background: #f0fdf4;
                    color: #15803d;
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                }
                
                .manager-footer {
                    background: white;
                    padding: 2rem;
                    border-radius: 0 0 8px 8px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
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
                }

                .btn-sm {
                    padding: 0.5rem 1rem;
                }
                
                .btn-primary {
                    background: #2563eb;
                    color: white;
                }
                
                .btn-primary:hover {
                    background: #1d4ed8;
                }
                
                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .btn-secondary:hover {
                    background: #e5e7eb;
                }
            `}</style>
        </div>
    );
}
