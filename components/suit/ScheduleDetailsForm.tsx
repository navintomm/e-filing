/**
 * Schedule Details Form (Manager)
 * 
 * Step 3 of the Draft Suit System.
 * Manages the list of property schedules and the add/edit modal.
 */

'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    addSchedule,
    updateSchedule,
    removeSchedule,
    goToNextStep,
    goToPreviousStep
} from '@/store/suit-draft-slice';
import { selectSchedules, selectBasicDetails } from '@/store/selectors';
import { validateScheduleDetails, validatePropertyCaseHasSchedule } from '@/lib/validators';
import { ScheduleList } from './ScheduleList';
import { ScheduleForm } from './ScheduleForm';
import type { Schedule } from '@/types/suit';
import { Plus, AlertTriangle } from 'lucide-react';

export function ScheduleDetailsForm() {
    const dispatch = useAppDispatch();
    const schedulesRaw = useAppSelector(selectSchedules);
    const basicDetails = useAppSelector(selectBasicDetails);

    // Fix: Redux state might return undefined schedules initially
    const schedules = (schedulesRaw || []) as Schedule[];

    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Business Logic: Check if schedule is required
    const isPropertyCase = basicDetails?.caseType && ['OS', 'OP'].includes(basicDetails.caseType);
    const hasSchedules = schedules.length > 0;

    // Allow proceeding if it's NOT a property case, OR if it IS a property case and has schedules
    // But even for property cases, it might be optional depending on specific context, 
    // though usually required. We'll show a warning but might allow proceed if user insists?
    // The validator `validatePropertyCaseHasSchedule` returns a warning, not invalid.

    const handleAddSchedule = () => {
        setEditingSchedule(null);
        setShowForm(true);
    };

    const handleEditSchedule = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        setShowForm(true);
    };

    const handleDeleteSchedule = (id: string) => {
        if (confirm('Are you sure you want to remove this schedule?')) {
            dispatch(removeSchedule(id));
        }
    };

    const handleSaveSchedule = (scheduleData: any) => {
        if (editingSchedule) {
            dispatch(updateSchedule({ id: editingSchedule.id, schedule: scheduleData }));
        } else {
            dispatch(addSchedule(scheduleData));
        }
        setShowForm(false);
        setEditingSchedule(null);
        setValidationError(null);
    };

    const handleNext = () => {
        // Validation
        const validation = validateScheduleDetails({ schedules });

        if (!validation.success) {
            // Zod error handling - usually unexpected here as individual items are validated
            console.error("Schedule list validation failed", validation.error);
            return;
        }

        // Business Rule Check
        if (basicDetails?.caseType) {
            const ruleCheck = validatePropertyCaseHasSchedule(basicDetails.caseType, schedules);
            if (ruleCheck.warning && !confirm(`${ruleCheck.warning}. Do you want to proceed without adding a schedule?`)) {
                return;
            }
        }

        dispatch(goToNextStep());
    };

    return (
        <div className="schedule-manager">
            <div className="manager-header">
                <h2>Schedule Details</h2>
                <p className="manager-description">
                    Add details of properties, movables, or documents involved in the suit.
                    These will be referenced as Schedule A, Schedule B, etc.
                </p>
            </div>

            <div className="manager-content">
                <div className="section-header">
                    <div className="section-title-group">
                        <h3 className="section-title">Suit Schedules</h3>
                        <span className="count-badge">{schedules.length}</span>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAddSchedule}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Schedule
                    </button>
                </div>

                {isPropertyCase && !hasSchedules && (
                    <div className="warning-notice">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <span>
                            <strong>Note:</strong> Since this is a Property Suit ({basicDetails.caseType}),
                            you should typically add at least one property schedule.
                        </span>
                    </div>
                )}

                <ScheduleList
                    schedules={schedules}
                    onEdit={handleEditSchedule}
                    onDelete={handleDeleteSchedule}
                />
            </div>

            <div className="manager-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => dispatch(goToPreviousStep())}
                >
                    ← Back to Party Details
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                >
                    Next: Document Details →
                </button>
            </div>

            <ScheduleForm
                isOpen={showForm}
                schedule={editingSchedule || undefined}
                existingNames={schedules.map(s => s.scheduleName)}
                onSave={handleSaveSchedule}
                onCancel={() => setShowForm(false)}
            />

            <style jsx>{`
                .schedule-manager {
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
                    background: #eff6ff;
                    color: #1d4ed8;
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                }

                .warning-notice {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem;
                    background: #fffbeb;
                    border: 1px solid #fcd34d;
                    border-radius: 8px;
                    color: #92400e;
                    font-size: 0.875rem;
                    margin-bottom: 2rem;
                    align-items: center;
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
