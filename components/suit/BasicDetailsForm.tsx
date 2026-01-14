/**
 * Basic Details Form Component
 * 
 * Step 1 of the Draft Suit wizard.
 * Collects: District, Court, Case Type, Vakalath Type, Party Signature, Applicant Status, Year
 * 
 * Features:
 * - Kerala e-Filing inspired design
 * - Conditional logic (district → court, vakalathnama → signature)
 * - Real-time validation with Zod
 * - Redux integration
 * - Auto-save on changes
 */

'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateBasicDetails, goToNextStep } from '@/store/suit-draft-slice';
import { selectBasicDetails } from '@/store/selectors';
import {
    basicDetailsSchema,
    type BasicDetailsFormData
} from '@/lib/validators';
import {
    KERALA_DISTRICTS,
    CASE_TYPES,
    APPLICANT_STATUS_OPTIONS,
    VAKALATH_TYPES,
    getCourtNamesForDistrict,
    isPartySignatureRequired,
    getYearRange
} from '@/lib/data/kerala-courts';

export function BasicDetailsForm() {
    const dispatch = useAppDispatch();
    const existingData = useAppSelector(selectBasicDetails);

    // Initialize form with React Hook Form + Zod validation
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors, isValid }
    } = useForm<BasicDetailsFormData>({
        resolver: zodResolver(basicDetailsSchema) as any,
        mode: 'onChange', // Real-time validation
        defaultValues: (existingData as any) || {
            district: '',
            court: '',
            caseType: '',
            vakalathType: 'vakalathnama',
            partySignatureRequired: false,
            applicantStatus: 'plaintiff',
            year: new Date().getFullYear()
        }
    });

    // Watch for changes in district and vakalathType for conditional logic
    const selectedDistrict = watch('district');
    const selectedVakalathType = watch('vakalathType');

    // Conditional logic: Update courts when district changes
    useEffect(() => {
        if (selectedDistrict) {
            // Reset court selection when district changes
            setValue('court', '');
        }
    }, [selectedDistrict, setValue]);

    // Conditional logic: Show/hide party signature based on vakalath type
    const showPartySignature = isPartySignatureRequired(selectedVakalathType);

    // Get courts for selected district
    const availableCourts = selectedDistrict
        ? getCourtNamesForDistrict(selectedDistrict)
        : [];

    // Year range for dropdown
    const yearRange = getYearRange();

    // Form submission handler
    const onSubmit = (data: BasicDetailsFormData) => {
        // Save to Redux
        dispatch(updateBasicDetails(data));

        // Move to next step
        dispatch(goToNextStep());
    };

    // Auto-save on changes (debounced by middleware)
    useEffect(() => {
        const subscription = watch((data) => {
            if (isValid) {
                dispatch(updateBasicDetails(data as BasicDetailsFormData));
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, isValid, dispatch]);

    return (
        <div className="basic-details-form">
            <div className="form-header">
                <h2>Basic Details</h2>
                <p className="form-description">
                    Enter the basic information about the case. All fields marked with * are required.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="form-content">
                {/* District Dropdown */}
                <div className="form-group">
                    <label htmlFor="district" className="form-label required">
                        District
                    </label>
                    <select
                        id="district"
                        {...register('district')}
                        className={`form-select ${errors.district ? 'error' : ''}`}
                    >
                        <option value="">-- Select District --</option>
                        {KERALA_DISTRICTS.map(district => (
                            <option key={district} value={district}>
                                {district}
                            </option>
                        ))}
                    </select>
                    {errors.district && (
                        <span className="error-message">{errors.district.message}</span>
                    )}
                </div>

                {/* Court Dropdown (Conditional on District) */}
                <div className="form-group">
                    <label htmlFor="court" className="form-label required">
                        Court
                    </label>
                    <select
                        id="court"
                        {...register('court')}
                        className={`form-select ${errors.court ? 'error' : ''}`}
                        disabled={!selectedDistrict}
                    >
                        <option value="">
                            {selectedDistrict
                                ? '-- Select Court --'
                                : '-- Select District First --'}
                        </option>
                        {availableCourts.map(court => (
                            <option key={court} value={court}>
                                {court}
                            </option>
                        ))}
                    </select>
                    {errors.court && (
                        <span className="error-message">{errors.court.message}</span>
                    )}
                    {selectedDistrict && availableCourts.length === 0 && (
                        <span className="info-message">No courts found for this district</span>
                    )}
                </div>

                {/* Case Type Dropdown */}
                <div className="form-group">
                    <label htmlFor="caseType" className="form-label required">
                        Case Type
                    </label>
                    <select
                        id="caseType"
                        {...register('caseType')}
                        className={`form-select ${errors.caseType ? 'error' : ''}`}
                    >
                        <option value="">-- Select Case Type --</option>
                        {CASE_TYPES.map(caseType => (
                            <option key={caseType.code} value={caseType.code} title={caseType.description}>
                                {caseType.code} - {caseType.name}
                            </option>
                        ))}
                    </select>
                    {errors.caseType && (
                        <span className="error-message">{errors.caseType.message}</span>
                    )}
                </div>

                {/* Vakalath Type Radio Buttons */}
                <div className="form-group">
                    <label className="form-label required">Vakalath Type</label>
                    <div className="radio-group">
                        {VAKALATH_TYPES.map(type => (
                            <label key={type.value} className="radio-label">
                                <input
                                    type="radio"
                                    value={type.value}
                                    {...register('vakalathType')}
                                    className="radio-input"
                                />
                                <span className="radio-text">
                                    {type.label}
                                    <span className="radio-description">{type.description}</span>
                                </span>
                            </label>
                        ))}
                    </div>
                    {errors.vakalathType && (
                        <span className="error-message">{errors.vakalathType.message}</span>
                    )}
                </div>

                {/* Party Signature (Conditional on Vakalathnama) */}
                {showPartySignature && (
                    <div className="form-group">
                        <label className="form-label">Party Signature</label>
                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    {...register('partySignatureRequired')}
                                    className="checkbox-input"
                                />
                                <span className="checkbox-text">
                                    Party signature required on Vakalathnama
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Applicant Status Dropdown */}
                <div className="form-group">
                    <label htmlFor="applicantStatus" className="form-label required">
                        Applicant Status
                    </label>
                    <select
                        id="applicantStatus"
                        {...register('applicantStatus')}
                        className={`form-select ${errors.applicantStatus ? 'error' : ''}`}
                    >
                        <option value="">-- Select Status --</option>
                        {APPLICANT_STATUS_OPTIONS.map(status => (
                            <option key={status.value} value={status.value} title={status.description}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                    {errors.applicantStatus && (
                        <span className="error-message">{errors.applicantStatus.message}</span>
                    )}
                </div>

                {/* Year Dropdown */}
                <div className="form-group">
                    <label htmlFor="year" className="form-label required">
                        Year
                    </label>
                    <select
                        id="year"
                        {...register('year', { valueAsNumber: true })}
                        className={`form-select ${errors.year ? 'error' : ''}`}
                    >
                        {yearRange.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    {errors.year && (
                        <span className="error-message">{errors.year.message}</span>
                    )}
                </div>

                {/* Case Number (Optional) */}
                <div className="form-group">
                    <label htmlFor="caseNumber" className="form-label">
                        Case Number <span className="optional">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        id="caseNumber"
                        {...register('caseNumber')}
                        className={`form-input ${errors.caseNumber ? 'error' : ''}`}
                        placeholder="Enter case number if already assigned"
                    />
                    {errors.caseNumber && (
                        <span className="error-message">{errors.caseNumber.message}</span>
                    )}
                    <span className="help-text">
                        Leave blank if case number not yet assigned
                    </span>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        disabled
                    >
                        Back
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!isValid}
                    >
                        Next: Party Details
                    </button>
                </div>
            </form>

            <style jsx>{`
        .basic-details-form {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .form-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .form-header h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .form-description {
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .form-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .form-label.required::after {
          content: '*';
          color: #ef4444;
          margin-left: 0.25rem;
        }
        
        .optional {
          font-weight: 400;
          color: #9ca3af;
          font-size: 0.75rem;
        }
        
        .form-select,
        .form-input {
          padding: 0.625rem 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.2s;
          background: white;
        }
        
        .form-select:focus,
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-select:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
          color: #9ca3af;
        }
        
        .form-select.error,
        .form-input.error {
          border-color: #ef4444;
        }
        
        .form-select.error:focus,
        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .radio-group,
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .radio-label,
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .radio-label:hover,
        .checkbox-label:hover {
          background: #f9fafb;
          border-color: #3b82f6;
        }
        
        .radio-input,
        .checkbox-input {
          margin-top: 0.125rem;
          width: 1rem;
          height: 1rem;
          cursor: pointer;
        }
        
        .radio-text,
        .checkbox-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .radio-description {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .error-message::before {
          content: '⚠';
          font-size: 0.875rem;
        }
        
        .info-message {
          color: #3b82f6;
          font-size: 0.75rem;
        }
        
        .help-text {
          color: #6b7280;
          font-size: 0.75rem;
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #e5e7eb;
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
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #6b7280;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #e5e7eb;
        }
        
        .btn-secondary:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        @media (max-width: 640px) {
          .basic-details-form {
            padding: 1rem;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
}
