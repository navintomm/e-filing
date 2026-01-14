/**
 * Schedule Form Component
 * 
 * Modal form for adding or editing a property schedule.
 * Support for different schedule types (Property, Movable, Document, Other).
 * 
 * Features:
 * - Dynamic fields based on schedule type
 * - Boundary inputs for properties
 * - Measurement inputs for properties
 * - Registration details
 * - Real-time validation with Zod
 */

'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleSchema, type ScheduleFormData } from '@/lib/validators';
import { useEffect } from 'react';

interface ScheduleFormProps {
    schedule?: ScheduleFormData;
    existingNames?: string[]; // To validate uniqueness or suggest next name
    onSave: (schedule: ScheduleFormData) => void;
    onCancel: () => void;
    isOpen: boolean;
}

export function ScheduleForm({ schedule, existingNames = [], onSave, onCancel, isOpen }: ScheduleFormProps) {
    const isEditing = !!schedule;

    // Determine next available schedule letter if adding new
    const getNextScheduleName = () => {
        if (isEditing) return schedule?.scheduleName;

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        for (const letter of letters) {
            if (!existingNames.includes(letter)) {
                return letter;
            }
        }
        return 'A';
    };

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors, isValid }
    } = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleSchema) as any,
        mode: 'onChange',
        defaultValues: schedule ? JSON.parse(JSON.stringify(schedule)) : {
            id: crypto.randomUUID(),
            scheduleName: getNextScheduleName(),
            scheduleType: 'property',
            description: '',
            boundaries: {
                north: '',
                south: '',
                east: '',
                west: ''
            },
            measurements: {
                area: 0,
                unit: 'cent',
                dimensions: ''
            },
            surveyNumber: '',
            order: existingNames.length + 1
        }
    });

    // Watch type to conditionally show fields
    const scheduleType = useWatch({
        control,
        name: 'scheduleType'
    });

    // Update schedule name when opening if not editing
    useEffect(() => {
        if (isOpen && !isEditing) {
            setValue('scheduleName', getNextScheduleName() || 'A');
        }
    }, [isOpen, isEditing, existingNames, setValue]);

    const onSubmit = (data: ScheduleFormData) => {
        onSave(data);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">
                        {isEditing ? 'Edit' : 'Add'} Schedule Item
                    </h3>
                    <button type="button" className="modal-close" onClick={onCancel}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
                    {/* Basic Info Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="scheduleName" className="form-label required">
                                Schedule ID
                            </label>
                            <input
                                type="text"
                                id="scheduleName"
                                {...register('scheduleName')}
                                className={`form-input ${errors.scheduleName ? 'error' : ''}`}
                                maxLength={1}
                                placeholder="A"
                            />
                            {errors.scheduleName && (
                                <span className="error-message">{errors.scheduleName.message}</span>
                            )}
                        </div>

                        <div className="form-group flex-2">
                            <label htmlFor="scheduleType" className="form-label required">
                                Property Type
                            </label>
                            <select
                                id="scheduleType"
                                {...register('scheduleType')}
                                className={`form-select ${errors.scheduleType ? 'error' : ''}`}
                            >
                                <option value="property">Immovable Property</option>
                                <option value="movable">Movable Property</option>
                                <option value="document">Document/Deed</option>
                                <option value="other">Other Asset</option>
                            </select>
                            {errors.scheduleType && (
                                <span className="error-message">{errors.scheduleType.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label required">
                            Description
                        </label>
                        <textarea
                            id="description"
                            {...register('description')}
                            className={`form-textarea ${errors.description ? 'error' : ''}`}
                            rows={4}
                            placeholder="Detailed description of the property/item..."
                        />
                        {errors.description && (
                            <span className="error-message">{errors.description.message}</span>
                        )}
                        <p className="form-hint">
                            Include details like village, desom, taluk, district for immovable properties.
                        </p>
                    </div>

                    {/* Conditional Fields for Immovable Property */}
                    {scheduleType === 'property' && (
                        <div className="property-fields animate-fadeIn">
                            <h4 className="section-subtitle">Property Details</h4>

                            {/* Survey Number & Measurements Row */}
                            <div className="form-row three-col">
                                <div className="form-group">
                                    <label htmlFor="surveyNumber" className="form-label">
                                        Survey Number
                                    </label>
                                    <input
                                        type="text"
                                        id="surveyNumber"
                                        {...register('surveyNumber')}
                                        className={`form-input ${errors.surveyNumber ? 'error' : ''}`}
                                        placeholder="e.g., 123/4B"
                                    />
                                    {errors.surveyNumber && (
                                        <span className="error-message">{errors.surveyNumber.message}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="measurements.area" className="form-label">
                                        Area
                                    </label>
                                    <input
                                        type="number"
                                        id="measurements.area"
                                        {...register('measurements.area', { valueAsNumber: true })}
                                        className={`form-input ${errors.measurements?.area ? 'error' : ''}`}
                                        step="0.01"
                                    />
                                    {errors.measurements?.area && (
                                        <span className="error-message">{errors.measurements.area.message}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="measurements.unit" className="form-label">
                                        Unit
                                    </label>
                                    <select
                                        id="measurements.unit"
                                        {...register('measurements.unit')}
                                        className={`form-select ${errors.measurements?.unit ? 'error' : ''}`}
                                    >
                                        <option value="cent">Cents</option>
                                        <option value="acre">Acres</option>
                                        <option value="sqft">Sq. Ft.</option>
                                        <option value="sqm">Sq. Meters</option>
                                    </select>
                                </div>
                            </div>

                            {/* Boundaries Grid */}
                            <div className="boundaries-section">
                                <label className="form-label block mb-2">Boundaries</label>
                                <div className="boundaries-grid">
                                    {/* North */}
                                    <div className="form-group">
                                        <label htmlFor="boundaries.north" className="boundary-label">North</label>
                                        <input
                                            type="text"
                                            id="boundaries.north"
                                            {...register('boundaries.north')}
                                            className={`form-inputBoundary ${errors.boundaries?.north ? 'error' : ''}`}
                                            placeholder="Property of..."
                                        />
                                    </div>

                                    {/* South */}
                                    <div className="form-group">
                                        <label htmlFor="boundaries.south" className="boundary-label">South</label>
                                        <input
                                            type="text"
                                            id="boundaries.south"
                                            {...register('boundaries.south')}
                                            className={`form-inputBoundary ${errors.boundaries?.south ? 'error' : ''}`}
                                            placeholder="Property of..."
                                        />
                                    </div>

                                    {/* East */}
                                    <div className="form-group">
                                        <label htmlFor="boundaries.east" className="boundary-label">East</label>
                                        <input
                                            type="text"
                                            id="boundaries.east"
                                            {...register('boundaries.east')}
                                            className={`form-inputBoundary ${errors.boundaries?.east ? 'error' : ''}`}
                                            placeholder="Road / Property of..."
                                        />
                                    </div>

                                    {/* West */}
                                    <div className="form-group">
                                        <label htmlFor="boundaries.west" className="boundary-label">West</label>
                                        <input
                                            type="text"
                                            id="boundaries.west"
                                            {...register('boundaries.west')}
                                            className={`form-inputBoundary ${errors.boundaries?.west ? 'error' : ''}`}
                                            placeholder="Property of..."
                                        />
                                    </div>
                                </div>
                                {(errors.boundaries?.north || errors.boundaries?.south || errors.boundaries?.east || errors.boundaries?.west) && (
                                    <span className="error-message mt-2">All boundary fields are required for properties</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={!isValid}>
                            {isEditing ? 'Update Schedule' : 'Add Schedule'}
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
          z-index: 1000;
          padding: 1rem;
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .animate-fadeIn {
            animation: fadeIn 0.4s ease-out;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 2px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 12px 12px 0 0;
        }
        
        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }
        
        .modal-close {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: none;
          background: white;
          color: #6b7280;
          font-size: 1.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .modal-close:hover {
          background: #ef4444;
          color: white;
        }
        
        .modal-body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .flex-2 {
            flex: 2;
        }
        
        .form-row {
          display: flex;
          gap: 1.5rem;
        }

        .three-col {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1rem;
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
        
        .form-input,
        .form-select,
        .form-textarea,
        .form-inputBoundary {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.2s;
          width: 100%;
        }
        
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus,
        .form-inputBoundary:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-input.error,
        .form-select.error,
        .form-textarea.error,
        .form-inputBoundary.error {
          border-color: #ef4444;
          background-color: #fef2f2;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .form-hint {
            font-size: 0.75rem;
            color: #6b7280;
            margin-top: 0.25rem;
        }

        .section-subtitle {
            font-size: 1rem;
            font-weight: 600;
            color: #4b5563;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
        }

        .boundaries-section {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 8px;
        }

        .boundaries-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .boundary-label {
            font-size: 0.75rem;
            color: #6b7280;
            margin-bottom: 0.25rem;
            text-transform: uppercase;
            font-weight: 700;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e5e7eb;
          margin-top: 1rem;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
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
          .modal-content {
            max-height: 100vh;
            border-radius: 0;
          }
          .boundaries-grid {
            grid-template-columns: 1fr;
          }
          .three-col {
            grid-template-columns: 1fr;
          }
          .form-row {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
        </div>
    );
}
