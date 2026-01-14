/**
 * Party Form Component
 * 
 * Modal form for adding or editing a party (plaintiff or defendant).
 * 
 * Features:
 * - Name, parentage, age, occupation inputs
 * - Address subform (reuses AddressForm)
 * - Real-time validation with Zod
 * - Modal overlay design
 * - Save/Cancel actions
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partySchema, type PartyFormData } from '@/lib/validators';
import { AddressForm } from './AddressForm';

interface PartyFormProps {
  party?: PartyFormData;
  role: 'plaintiff' | 'defendant';
  onSave: (party: PartyFormData) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function PartyForm({ party, role, onSave, onCancel, isOpen }: PartyFormProps) {
  const isEditing = !!party;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<PartyFormData>({
    resolver: zodResolver(partySchema) as any,
    mode: 'onChange', // Real-time validation
    defaultValues: party || {
      id: '', // Will be set via reset()
      name: '',
      parentageType: 'son_of',
      parentName: '',
      age: 30,
      occupation: '',
      address: {
        building: '',
        street: '',
        locality: '',
        district: '',
        state: 'Kerala',
        pincode: ''
      },
      role,
      order: 1
    }
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (party) {
        reset(party);
      } else {
        // Generate new ID for new party
        reset({
          id: crypto.randomUUID(),
          name: '',
          parentageType: 'son_of',
          parentName: '',
          age: 30,
          occupation: '',
          address: {
            building: '',
            street: '',
            locality: '',
            district: '',
            state: 'Kerala',
            pincode: ''
          },
          role,
          order: 1
        });
      }
    }
  }, [isOpen, party, role, reset]);

  const onSubmit = (data: PartyFormData) => {
    onSave({ ...data, role });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? 'Edit' : 'Add'} {role === 'plaintiff' ? 'Plaintiff' : 'Defendant'}
          </h3>
          <button type="button" className="modal-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label required">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g., Rajesh Kumar"
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

          {/* Parentage Type */}
          <div className="form-group">
            <label htmlFor="parentageType" className="form-label required">
              Parentage Type
            </label>
            <select
              id="parentageType"
              {...register('parentageType')}
              className={`form-select ${errors.parentageType ? 'error' : ''}`}
            >
              <option value="son_of">Son of</option>
              <option value="daughter_of">Daughter of</option>
              <option value="wife_of">Wife of</option>
              <option value="husband_of">Husband of</option>
            </select>
            {errors.parentageType && (
              <span className="error-message">{errors.parentageType.message}</span>
            )}
          </div>

          {/* Parent Name */}
          <div className="form-group">
            <label htmlFor="parentName" className="form-label required">
              Parent/Spouse Name
            </label>
            <input
              type="text"
              id="parentName"
              {...register('parentName')}
              className={`form-input ${errors.parentName ? 'error' : ''}`}
              placeholder="e.g., Krishnan Nair"
            />
            {errors.parentName && (
              <span className="error-message">{errors.parentName.message}</span>
            )}
          </div>

          {/* Age and Occupation Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age" className="form-label required">
                Age
              </label>
              <input
                type="number"
                id="age"
                {...register('age', { valueAsNumber: true })}
                className={`form-input ${errors.age ? 'error' : ''}`}
                min="1"
                max="150"
                placeholder="30"
              />
              {errors.age && (
                <span className="error-message">{errors.age.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="occupation" className="form-label required">
                Occupation
              </label>
              <input
                type="text"
                id="occupation"
                {...register('occupation')}
                className={`form-input ${errors.occupation ? 'error' : ''}`}
                placeholder="e.g., Business"
              />
              {errors.occupation && (
                <span className="error-message">{errors.occupation.message}</span>
              )}
            </div>
          </div>

          {/* Address Subform */}
          <AddressForm register={register} errors={errors} />

          {/* Form Actions */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update' : 'Add'} {role === 'plaintiff' ? 'Plaintiff' : 'Defendant'}
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
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }
        
        .modal-close {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 1.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .modal-close:hover {
          background: #e5e7eb;
          color: #374151;
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
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 2fr;
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
        .form-select {
          padding: 0.625rem 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        
        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-input.error,
        .form-select.error {
          border-color: #ef4444;
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
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.5rem;
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
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .modal-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
