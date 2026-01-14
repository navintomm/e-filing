/**
 * Document Form Component
 * 
 * Modal form for adding/editing a document in the suit.
 * Supports file details, description, and exhibit marking.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { documentItemSchema, type DocumentItemFormData } from '@/lib/validators';
import { X, HelpCircle } from 'lucide-react';
import type { DocumentItem } from '@/types/suit';
import { useEffect, useState } from 'react';

interface DocumentFormProps {
    isOpen: boolean;
    document?: DocumentItem;
    onSave: (data: DocumentItem) => void;
    onCancel: () => void;
    nextMarkingIndex: number; // For predicting EX-A{n}
}

export function DocumentForm({
    isOpen,
    document,
    onSave,
    onCancel,
    nextMarkingIndex
}: DocumentFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm<DocumentItemFormData>({
        resolver: zodResolver(documentItemSchema) as any,
        defaultValues: document ? JSON.parse(JSON.stringify(document)) : {
            description: '',
            documentType: 'original',
            pageCount: 1,
            isMarked: true,
            markingLabel: undefined,
            id: crypto.randomUUID(), // Initialize ID
            serialNumber: 1, // Initialize valid serial
            order: 1 // Initialize valid order
        }
    });

    // Watch exhibit marking status
    const isMarked = watch('isMarked');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset({
                id: document?.id || crypto.randomUUID(),
                serialNumber: document?.serialNumber || 1, // Validator requires min(1)
                order: document?.order || 1, // Validator requires min(1)
                description: document?.description || '',
                documentType: (document?.documentType as any) || 'original',
                date: document?.date ? new Date(document.date) : undefined,
                pageCount: document?.pageCount || 1,
                isMarked: document ? document.isMarked : true,
                markingLabel: document?.markingLabel
            });
        }
    }, [isOpen, document, reset]);

    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (data: DocumentItemFormData) => {
        // Hide modal immediately
        setSubmitted(true);
        // Save the document
        onSave(data as DocumentItem);
        // Close modal after saving
        onCancel();
    };

    if (!isOpen || submitted) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">
                        {document ? 'Edit Document' : 'Add Document'}
                    </h3>
                    <button onClick={onCancel} className="close-btn">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
                    {/* Hidden fields for validation */}
                    <input type="hidden" {...register('id')} />
                    <input type="hidden" {...register('serialNumber', { valueAsNumber: true })} />
                    <input type="hidden" {...register('order', { valueAsNumber: true })} />

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label required">
                            Description of Document
                        </label>
                        <textarea
                            id="description"
                            {...register('description')}
                            className={`form-input textarea ${errors.description ? 'error' : ''}`}
                            placeholder="e.g., Sale Deed No. 1234/2020 of SRO Ernakulam"
                            rows={3}
                        />
                        {errors.description && (
                            <span className="error-message">{errors.description.message}</span>
                        )}
                        <span className="help-text">
                            Provide clear details including date and parties involved if applicable.
                        </span>
                    </div>

                    <div className="form-grid">
                        {/* Date */}
                        <div className="form-group">
                            <label htmlFor="date" className="form-label">
                                Document Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                {...register('date', { valueAsDate: true })}
                                className={`form-input ${errors.date ? 'error' : ''}`}
                            />
                            {errors.date && (
                                <span className="error-message">{errors.date.message}</span>
                            )}
                        </div>

                        {/* Type */}
                        <div className="form-group">
                            <label htmlFor="documentType" className="form-label required">
                                Type
                            </label>
                            <select
                                id="documentType"
                                {...register('documentType')}
                                className={`form-input ${errors.documentType ? 'error' : ''}`}
                            >
                                <option value="original">Original</option>
                                <option value="certified_copy">Certified Copy</option>
                                <option value="xerox">Photocopy (Xerox)</option>
                                <option value="affidavit">Affidavit</option>
                            </select>
                            {errors.documentType && (
                                <span className="error-message">{errors.documentType.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-grid">
                        {/* Pages */}
                        <div className="form-group">
                            <label htmlFor="pageCount" className="form-label">
                                Number of Pages
                            </label>
                            <input
                                type="number"
                                id="pageCount"
                                {...register('pageCount', { valueAsNumber: true })}
                                className={`form-input ${errors.pageCount ? 'error' : ''}`}
                                min={1}
                            />
                            {errors.pageCount && (
                                <span className="error-message">{errors.pageCount.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Marking Section */}
                    <div className="marking-section">
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="isMarked"
                                {...register('isMarked')}
                                className="form-checkbox"
                            />
                            <label htmlFor="isMarked" className="checkbox-label">
                                Mark this document as an Exhibit
                            </label>
                        </div>

                        {isMarked && (
                            <div className="marking-info">
                                <span className="info-icon">i</span>
                                <span className="info-text">
                                    {document?.markingLabel
                                        ? `Currently marked as ${document.markingLabel}`
                                        : `Will be automatically marked as EX-A${nextMarkingIndex}`
                                    }
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        // NOTE: Disabled usage removed to allow validation feedback on click
                        >
                            {document ? 'Update Document' : 'Add Document'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50;
                    padding: 1rem;
                }

                .modal-content {
                    background: white;
                    border-radius: 8px;
                    width: 100%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                }

                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1f2937;
                }

                .close-btn {
                    padding: 0.5rem;
                    border-radius: 4px;
                    color: #6b7280;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .close-btn:hover {
                    background: #f3f4f6;
                    color: #1f2937;
                }

                .modal-body {
                    padding: 1.5rem;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
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

                .form-input {
                    padding: 0.625rem 0.875rem;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                    width: 100%;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .form-input.error {
                    border-color: #ef4444;
                }

                .textarea {
                    resize: vertical;
                    min-height: 80px;
                }

                .error-message {
                    color: #ef4444;
                    font-size: 0.75rem;
                }

                .help-text {
                    color: #6b7280;
                    font-size: 0.75rem;
                }

                .marking-section {
                    background: #f9fafb;
                    padding: 1rem;
                    border-radius: 6px;
                    margin-bottom: 1.5rem;
                    border: 1px solid #e5e7eb;
                }

                .checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .form-checkbox {
                    width: 1rem;
                    height: 1rem;
                    border-radius: 4px;
                    border: 1px solid #d1d5db;
                    color: #2563eb;
                }

                .checkbox-label {
                    font-weight: 500;
                    color: #374151;
                    font-size: 0.875rem;
                }

                .marking-info {
                    margin-top: 0.75rem;
                    padding-top: 0.75rem;
                    border-top: 1px dashed #e5e7eb;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: #6b7280;
                }

                .info-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #dbeafe;
                    color: #1e40af;
                    font-weight: 700;
                    font-size: 10px;
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e5e7eb;
                }

                .btn {
                    padding: 0.625rem 1.25rem;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                }

                .btn-primary {
                    background: #2563eb;
                    color: white;
                }

                .btn-primary:hover {
                    background: #1d4ed8;
                }
            `}</style>
        </div>
    );
}
