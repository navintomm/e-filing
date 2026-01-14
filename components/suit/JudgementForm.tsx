/**
 * Judgement Form Component
 * 
 * Modal form for adding/editing precedents and case law.
 * Captures case details, citations, and optional file references.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { judgementSchema, type JudgementFormData } from '@/lib/validators/complete-suit-validator';
import { X } from 'lucide-react';
import type { Judgement } from '@/types/suit';
import { useEffect } from 'react';

interface JudgementFormProps {
    isOpen: boolean;
    judgement?: Judgement;
    onSave: (data: Judgement) => void;
    onCancel: () => void;
}

export function JudgementForm({
    isOpen,
    judgement,
    onSave,
    onCancel
}: JudgementFormProps) {
    const currentYear = new Date().getFullYear();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<JudgementFormData>({
        resolver: zodResolver(judgementSchema) as any,
        defaultValues: judgement || {
            caseName: '',
            citation: '',
            court: '',
            year: currentYear,
            relevantParagraphs: '',
            fileUrl: ''
        }
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset({
                id: judgement?.id || crypto.randomUUID(),
                order: judgement?.order || 0, // Redux handles this
                caseName: judgement?.caseName || '',
                citation: judgement?.citation || '',
                court: judgement?.court || '',
                year: judgement?.year || currentYear,
                relevantParagraphs: judgement?.relevantParagraphs || '',
                fileUrl: judgement?.fileUrl || ''
            });
        }
    }, [isOpen, judgement, currentYear, reset]);

    const onSubmit = (data: JudgementFormData) => {
        onSave(data as Judgement);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">
                        {judgement ? 'Edit Precedent' : 'Add Precedent'}
                    </h3>
                    <button onClick={onCancel} className="close-btn">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
                    {/* Case Name */}
                    <div className="form-group">
                        <label htmlFor="caseName" className="form-label required">
                            Case Name
                        </label>
                        <input
                            type="text"
                            id="caseName"
                            {...register('caseName')}
                            className={`form-input ${errors.caseName ? 'error' : ''}`}
                            placeholder="e.g., Kesavananda Bharati v. State of Kerala"
                        />
                        {errors.caseName && (
                            <span className="error-message">{errors.caseName.message}</span>
                        )}
                    </div>

                    {/* Citation */}
                    <div className="form-group">
                        <label htmlFor="citation" className="form-label required">
                            Citation
                        </label>
                        <input
                            type="text"
                            id="citation"
                            {...register('citation')}
                            className={`form-input ${errors.citation ? 'error' : ''}`}
                            placeholder="e.g., AIR 1973 SC 1461"
                        />
                        {errors.citation && (
                            <span className="error-message">{errors.citation.message}</span>
                        )}
                        <span className="help-text">
                            Include standard legal citation format (e.g., AIR, SCC, SCR)
                        </span>
                    </div>

                    <div className="form-grid">
                        {/* Court */}
                        <div className="form-group">
                            <label htmlFor="court" className="form-label required">
                                Court
                            </label>
                            <input
                                type="text"
                                id="court"
                                {...register('court')}
                                className={`form-input ${errors.court ? 'error' : ''}`}
                                placeholder="e.g., Supreme Court of India"
                            />
                            {errors.court && (
                                <span className="error-message">{errors.court.message}</span>
                            )}
                        </div>

                        {/* Year */}
                        <div className="form-group">
                            <label htmlFor="year" className="form-label required">
                                Year
                            </label>
                            <input
                                type="number"
                                id="year"
                                {...register('year', { valueAsNumber: true })}
                                className={`form-input ${errors.year ? 'error' : ''}`}
                                min={1950}
                                max={currentYear}
                                placeholder={currentYear.toString()}
                            />
                            {errors.year && (
                                <span className="error-message">{errors.year.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Relevant Paragraphs */}
                    <div className="form-group">
                        <label htmlFor="relevantParagraphs" className="form-label">
                            Relevant Paragraphs / Points
                            <span className="optional-badge">Optional</span>
                        </label>
                        <textarea
                            id="relevantParagraphs"
                            {...register('relevantParagraphs')}
                            className={`form-input textarea ${errors.relevantParagraphs ? 'error' : ''}`}
                            placeholder="Summarize the key legal principles or paragraphs that are relevant to your case..."
                            rows={4}
                        />
                        {errors.relevantParagraphs && (
                            <span className="error-message">{errors.relevantParagraphs.message}</span>
                        )}
                    </div>

                    {/* File URL */}
                    <div className="form-group">
                        <label htmlFor="fileUrl" className="form-label">
                            Link to Full Text
                            <span className="optional-badge">Optional</span>
                        </label>
                        <input
                            type="url"
                            id="fileUrl"
                            {...register('fileUrl')}
                            className={`form-input ${errors.fileUrl ? 'error' : ''}`}
                            placeholder="https://..."
                        />
                        {errors.fileUrl && (
                            <span className="error-message">{errors.fileUrl.message}</span>
                        )}
                        <span className="help-text">
                            Link to Google Drive, Indian Kanoon, or other legal database
                        </span>
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
                        >
                            {judgement ? 'Update Precedent' : 'Add Precedent'}
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
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                    position: sticky;
                    top: 0;
                    background: white;
                    z-index: 10;
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
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }

                .form-label {
                    font-weight: 600;
                    color: #374151;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .form-label.required::after {
                    content: '*';
                    color: #ef4444;
                }

                .optional-badge {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #6b7280;
                    background: #f3f4f6;
                    padding: 0.125rem 0.5rem;
                    border-radius: 9999px;
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

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e5e7eb;
                    position: sticky;
                    bottom: 0;
                    background: white;
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

                @media (max-width: 640px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
