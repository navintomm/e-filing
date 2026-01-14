/**
 * IA Form Component
 * 
 * Modal form for adding/editing Interlocutory Applications.
 * Handles complex fields like multiple grounds and urgency levels.
 */

'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { interlocutoryApplicationSchema, type IAFormData } from '@/lib/validators/complete-suit-validator';
import { X, Plus, Trash2 } from 'lucide-react';
import type { InterlocutoryApplication } from '@/types/suit';
import { useEffect } from 'react';

interface IAFormProps {
    isOpen: boolean;
    ia?: InterlocutoryApplication;
    onSave: (data: InterlocutoryApplication) => void;
    onCancel: () => void;
    nextIANumber: string; // e.g., "IA 1/2025"
}

export function IAForm({
    isOpen,
    ia,
    onSave,
    onCancel,
    nextIANumber
}: IAFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm<IAFormData>({
        resolver: zodResolver(interlocutoryApplicationSchema) as any,
        defaultValues: ia || {
            title: '',
            purpose: '',
            grounds: [''],
            reliefRequested: '',
            urgency: 'normal',
            facts: '',
            affidavitRequired: true
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: control as any,
        name: 'grounds'
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset({
                id: ia?.id || crypto.randomUUID(),
                iaNumber: ia?.iaNumber || nextIANumber,
                order: ia?.order || 0, // Redux handles this
                title: ia?.title || '',
                purpose: ia?.purpose || '',
                grounds: ia?.grounds && ia.grounds.length > 0 ? ia.grounds : [''],
                reliefRequested: ia?.reliefRequested || '',
                urgency: (ia?.urgency as any) || 'normal',
                facts: ia?.facts || '',
                affidavitRequired: ia?.affidavitRequired ?? true
            });
        }
    }, [isOpen, ia, nextIANumber, reset]);

    const onSubmit = (data: IAFormData) => {
        onSave(data as InterlocutoryApplication);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">
                        {ia ? 'Edit Interlocutory Application' : 'Add Interlocutory Application'}
                    </h3>
                    <button onClick={onCancel} className="close-btn">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
                    {/* IA Number (Display Only) */}
                    <div className="form-group">
                        <label className="form-label">IA Number</label>
                        <input
                            type="text"
                            value={ia?.iaNumber || nextIANumber}
                            disabled
                            className="form-input disabled"
                        />
                        <span className="help-text">Auto-generated based on filing year</span>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label required">
                            Title of Application
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register('title')}
                            className={`form-input ${errors.title ? 'error' : ''}`}
                            placeholder="e.g., Application for Temporary Injunction"
                        />
                        {errors.title && (
                            <span className="error-message">{errors.title.message}</span>
                        )}
                    </div>

                    {/* Purpose */}
                    <div className="form-group">
                        <label htmlFor="purpose" className="form-label required">
                            Purpose of Application
                        </label>
                        <textarea
                            id="purpose"
                            {...register('purpose')}
                            className={`form-input textarea ${errors.purpose ? 'error' : ''}`}
                            placeholder="Clearly state what you are seeking through this application..."
                            rows={3}
                        />
                        {errors.purpose && (
                            <span className="error-message">{errors.purpose.message}</span>
                        )}
                    </div>

                    {/* Grounds (Dynamic Array) */}
                    <div className="form-group">
                        <div className="grounds-header">
                            <label className="form-label required">Grounds</label>
                            <button
                                type="button"
                                onClick={() => append('')}
                                className="btn-add-ground"
                            >
                                <Plus className="w-4 h-4" />
                                Add Ground
                            </button>
                        </div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="ground-item">
                                <textarea
                                    {...register(`grounds.${index}` as const)}
                                    className={`form-input textarea ${errors.grounds?.[index] ? 'error' : ''}`}
                                    placeholder={`Ground ${index + 1}: State a legal or factual basis...`}
                                    rows={2}
                                />
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="btn-remove-ground"
                                        title="Remove ground"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                {errors.grounds?.[index] && (
                                    <span className="error-message">{errors.grounds[index]?.message}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Relief Requested */}
                    <div className="form-group">
                        <label htmlFor="reliefRequested" className="form-label required">
                            Relief Requested (Prayer)
                        </label>
                        <textarea
                            id="reliefRequested"
                            {...register('reliefRequested')}
                            className={`form-input textarea ${errors.reliefRequested ? 'error' : ''}`}
                            placeholder="State the specific relief you are requesting the court to grant..."
                            rows={3}
                        />
                        {errors.reliefRequested && (
                            <span className="error-message">{errors.reliefRequested.message}</span>
                        )}
                    </div>

                    {/* Facts */}
                    <div className="form-group">
                        <label htmlFor="facts" className="form-label required">
                            Facts Supporting the Application
                        </label>
                        <textarea
                            id="facts"
                            {...register('facts')}
                            className={`form-input textarea ${errors.facts ? 'error' : ''}`}
                            placeholder="Provide detailed facts that support this application..."
                            rows={4}
                        />
                        {errors.facts && (
                            <span className="error-message">{errors.facts.message}</span>
                        )}
                    </div>

                    <div className="form-grid">
                        {/* Urgency */}
                        <div className="form-group">
                            <label htmlFor="urgency" className="form-label required">
                                Urgency Level
                            </label>
                            <select
                                id="urgency"
                                {...register('urgency')}
                                className={`form-input ${errors.urgency ? 'error' : ''}`}
                            >
                                <option value="normal">Normal</option>
                                <option value="urgent">Urgent</option>
                            </select>
                            {errors.urgency && (
                                <span className="error-message">{errors.urgency.message}</span>
                            )}
                        </div>

                        {/* Affidavit Required */}
                        <div className="form-group">
                            <label className="form-label">Affidavit</label>
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="affidavitRequired"
                                    {...register('affidavitRequired')}
                                    className="form-checkbox"
                                />
                                <label htmlFor="affidavitRequired" className="checkbox-label">
                                    Affidavit required for this application
                                </label>
                            </div>
                        </div>
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
                            {ia ? 'Update Application' : 'Add Application'}
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
                    max-width: 700px;
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
                    grid-template-columns: 1fr 1fr;
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

                .form-input.disabled {
                    background: #f9fafb;
                    color: #6b7280;
                    cursor: not-allowed;
                }

                .textarea {
                    resize: vertical;
                    min-height: 60px;
                }

                .error-message {
                    color: #ef4444;
                    font-size: 0.75rem;
                }

                .help-text {
                    color: #6b7280;
                    font-size: 0.75rem;
                }

                .grounds-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }

                .btn-add-ground {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.375rem 0.75rem;
                    background: #f3f4f6;
                    color: #374151;
                    border: none;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-add-ground:hover {
                    background: #e5e7eb;
                }

                .ground-item {
                    position: relative;
                    margin-bottom: 1rem;
                }

                .btn-remove-ground {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    padding: 0.25rem;
                    background: #fee2e2;
                    color: #dc2626;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-remove-ground:hover {
                    background: #fecaca;
                }

                .checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: #f9fafb;
                    border-radius: 6px;
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
