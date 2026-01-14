/**
 * Address Form Component
 * 
 * Reusable subform for collecting address details.
 * Used within Party forms for both plaintiffs and defendants.
 * 
 * Features:
 * - All 6 address fields (building, street, locality, district, state, pincode)
 * - Real-time validation
 * - Kerala-focused (defaults to Kerala state)
 * - Pincode validation (6 digits)
 */

'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { PartyFormData } from '@/lib/validators';

interface AddressFormProps {
    register: UseFormRegister<PartyFormData>;
    errors: FieldErrors<PartyFormData>;
    fieldPrefix?: string;
}

export function AddressForm({ register, errors, fieldPrefix = 'address' }: AddressFormProps) {
    return (
        <div className="address-form">
            <h4 className="section-title">Address</h4>

            <div className="form-grid">
                {/* Building/House */}
                <div className="form-group">
                    <label htmlFor={`${fieldPrefix}.building`} className="form-label required">
                        Building / House Name
                    </label>
                    <input
                        type="text"
                        id={`${fieldPrefix}.building`}
                        {...register(`${fieldPrefix}.building` as any)}
                        className={`form-input ${errors.address?.building ? 'error' : ''}`}
                        placeholder="e.g., Sree Nilayam"
                    />
                    {errors.address?.building && (
                        <span className="error-message">{errors.address.building.message}</span>
                    )}
                </div>

                {/* Street */}
                <div className="form-group">
                    <label htmlFor={`${fieldPrefix}.street`} className="form-label required">
                        Street
                    </label>
                    <input
                        type="text"
                        id={`${fieldPrefix}.street`}
                        {...register(`${fieldPrefix}.street` as any)}
                        className={`form-input ${errors.address?.street ? 'error' : ''}`}
                        placeholder="e.g., M.G. Road"
                    />
                    {errors.address?.street && (
                        <span className="error-message">{errors.address.street.message}</span>
                    )}
                </div>

                {/* Locality */}
                <div className="form-group">
                    <label htmlFor={`${fieldPrefix}.locality`} className="form-label required">
                        Locality
                    </label>
                    <input
                        type="text"
                        id={`${fieldPrefix}.locality`}
                        {...register(`${fieldPrefix}.locality` as any)}
                        className={`form-input ${errors.address?.locality ? 'error' : ''}`}
                        placeholder="e.g., Kadavanthra"
                    />
                    {errors.address?.locality && (
                        <span className="error-message">{errors.address.locality.message}</span>
                    )}
                </div>

                {/* District */}
                <div className="form-group">
                    <label htmlFor={`${fieldPrefix}.district`} className="form-label required">
                        District
                    </label>
                    <input
                        type="text"
                        id={`${fieldPrefix}.district`}
                        {...register(`${fieldPrefix}.district` as any)}
                        className={`form-input ${errors.address?.district ? 'error' : ''}`}
                        placeholder="e.g., Ernakulam"
                    />
                    {errors.address?.district && (
                        <span className="error-message">{errors.address.district.message}</span>
                    )}
                </div>

                {/* State */}
                <div className="form-group">
                    <label htmlFor={`${fieldPrefix}.state`} className="form-label required">
                        State
                    </label>
                    <input
                        type="text"
                        id={`${fieldPrefix}.state`}
                        {...register(`${fieldPrefix}.state` as any)}
                        className={`form-input ${errors.address?.state ? 'error' : ''}`}
                        placeholder="Kerala"
                        defaultValue="Kerala"
                    />
                    {errors.address?.state && (
                        <span className="error-message">{errors.address.state.message}</span>
                    )}
                </div>

                {/* Pincode */}
                <div className="form-group">
                    <label htmlFor={`${fieldPrefix}.pincode`} className="form-label required">
                        Pincode
                    </label>
                    <input
                        type="text"
                        id={`${fieldPrefix}.pincode`}
                        {...register(`${fieldPrefix}.pincode` as any)}
                        className={`form-input ${errors.address?.pincode ? 'error' : ''}`}
                        placeholder="682020"
                        maxLength={6}
                    />
                    {errors.address?.pincode && (
                        <span className="error-message">{errors.address.pincode.message}</span>
                    )}
                    <span className="help-text">6-digit pincode</span>
                </div>
            </div>

            <style jsx>{`
        .address-form {
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        
        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
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
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-input.error {
          border-color: #ef4444;
        }
        
        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
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
        }
        
        .help-text {
          color: #6b7280;
          font-size: 0.75rem;
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
