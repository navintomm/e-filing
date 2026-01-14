/**
 * Schedule List Component
 * 
 * Displays a list of added property schedules as cards.
 * Supports edit triggers.
 */
import { Edit2, Trash2, MapPin, FileText, Package, Briefcase } from 'lucide-react';
import type { Schedule } from '@/types/suit';

interface ScheduleListProps {
    schedules: Schedule[];
    onEdit: (schedule: Schedule) => void;
    onDelete: (id: string) => void;
}

export function ScheduleList({ schedules, onEdit, onDelete }: ScheduleListProps) {
    if (schedules.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <Package className="w-8 h-8 text-slate-400" />
                </div>
                <p>No schedules added yet.</p>
                <span className="empty-hint">Add property schedules, movables, or documents involved in the suit.</span>
            </div>
        );
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'property': return <MapPin className="w-5 h-5 text-blue-600" />;
            case 'movable': return <Package className="w-5 h-5 text-amber-600" />;
            case 'document': return <FileText className="w-5 h-5 text-green-600" />;
            default: return <Briefcase className="w-5 h-5 text-slate-600" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'property': return 'Immovable Property';
            case 'movable': return 'Movable Property';
            case 'document': return 'Document/Deed';
            case 'other': return 'Other Asset';
            default: return type;
        }
    };

    return (
        <div className="schedule-grid">
            {schedules.map((schedule) => (
                <div key={schedule.id} className="schedule-card">
                    <div className="card-header">
                        <div className="schedule-badge">
                            Schedule {schedule.scheduleName}
                        </div>
                        <div className="card-actions">
                            <button
                                onClick={() => onEdit(schedule)}
                                className="action-btn edit"
                                title="Edit Schedule"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(schedule.id)}
                                className="action-btn delete"
                                title="Delete Schedule"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="type-row">
                            {getTypeIcon(schedule.type)}
                            <span className="type-label">{getTypeLabel(schedule.type)}</span>
                        </div>

                        <p className="description line-clamp-3">
                            {schedule.description}
                        </p>

                        {schedule.type === 'property' && schedule.measurements && (
                            <div className="measurements-preview">
                                <span className="label">Area:</span>
                                <span className="value">
                                    {schedule.measurements.area} {schedule.measurements.unit}
                                </span>
                            </div>
                        )}

                        {schedule.type === 'property' && schedule.surveyNumber && (
                            <div className="measurements-preview">
                                <span className="label">Survey No:</span>
                                <span className="value">{schedule.surveyNumber}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <style jsx>{`
                .schedule-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    background: #f9fafb;
                    border: 2px dashed #e5e7eb;
                    border-radius: 8px;
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

                .schedule-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    overflow: hidden;
                    transition: all 0.2s;
                }

                .schedule-card:hover {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    border-color: #d1d5db;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: #f9fafb;
                    border-bottom: 1px solid #e5e7eb;
                }

                .schedule-badge {
                    background: #dbeafe;
                    color: #1e40af;
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .card-actions {
                    display: flex;
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

                .action-btn.edit {
                    color: #6b7280;
                }

                .action-btn.edit:hover {
                    color: #2563eb;
                    background: #dbeafe;
                }

                .action-btn.delete {
                    color: #6b7280;
                }

                .action-btn.delete:hover {
                    color: #dc2626;
                    background: #fee2e2;
                }

                .card-body {
                    padding: 1rem;
                }

                .type-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }

                .type-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                }

                .description {
                    font-size: 0.875rem;
                    color: #4b5563;
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }

                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .measurements-preview {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.875rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid #f3f4f6;
                    margin-top: 0.5rem;
                }

                .label {
                    color: #6b7280;
                }

                .value {
                    font-weight: 500;
                    color: #1f2937;
                }
            `}</style>
        </div>
    );
}
