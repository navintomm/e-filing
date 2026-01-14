/**
 * IA Details Form (Manager)
 * 
 * Step 5 of the Draft Suit System.
 * Manages Interlocutory Applications filed along with the suit.
 */

'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    addIA,
    updateIA,
    removeIA,
    goToNextStep,
    goToPreviousStep
} from '@/store/suit-draft-slice';
import { selectIAs, selectBasicDetails } from '@/store/selectors';
import { IAList } from './IAList';
import { IAForm } from './IAForm';
import type { InterlocutoryApplication } from '@/types/suit';
import { Plus, Info } from 'lucide-react';

export function IADetailsForm() {
    const dispatch = useAppDispatch();
    const iasRaw = useAppSelector(selectIAs);
    const basicDetails = useAppSelector(selectBasicDetails);

    // Ensure safe array access
    const ias = (iasRaw || []) as InterlocutoryApplication[];

    const [showForm, setShowForm] = useState(false);
    const [editingIA, setEditingIA] = useState<InterlocutoryApplication | null>(null);

    // Calculate next IA number (e.g., "IA 1/2025")
    const year = basicDetails?.year || new Date().getFullYear();
    const nextIANumber = `IA ${ias.length + 1}/${year}`;

    const handleAddIA = () => {
        setEditingIA(null);
        setShowForm(true);
    };

    const handleEditIA = (ia: InterlocutoryApplication) => {
        setEditingIA(ia);
        setShowForm(true);
    };

    const handleDeleteIA = (id: string) => {
        if (confirm('Are you sure you want to remove this application? This action cannot be undone.')) {
            dispatch(removeIA(id));
        }
    };

    const handleSaveIA = (iaData: InterlocutoryApplication) => {
        if (editingIA) {
            dispatch(updateIA({ id: editingIA.id, ia: iaData }));
        } else {
            dispatch(addIA(iaData));
        }
        setShowForm(false);
        setEditingIA(null);
    };

    const handleNext = () => {
        // IAs are optional, so we can always proceed
        dispatch(goToNextStep());
    };

    return (
        <div className="ia-manager">
            <div className="manager-header">
                <h2>Interlocutory Applications</h2>
                <p className="manager-description">
                    Add urgent applications that need to be filed along with the suit
                    (e.g., applications for temporary injunction, interim relief, etc.).
                </p>
            </div>

            <div className="info-banner">
                <Info className="w-5 h-5" />
                <div>
                    <strong>Optional Step:</strong> Most suits don't require interlocutory applications.
                    You can skip this step if your suit doesn't need any urgent interim relief.
                </div>
            </div>

            <div className="manager-content">
                <div className="section-header">
                    <div className="section-title-group">
                        <h3 className="section-title">Applications</h3>
                        {ias.length > 0 && (
                            <span className="count-badge">{ias.length}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAddIA}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Application
                    </button>
                </div>

                <IAList
                    applications={ias}
                    onEdit={handleEditIA}
                    onDelete={handleDeleteIA}
                />
            </div>

            <div className="manager-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => dispatch(goToPreviousStep())}
                >
                    ← Back to Documents
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                >
                    {ias.length === 0 ? 'Skip this Step →' : 'Next: Judgements →'}
                </button>
            </div>

            <IAForm
                isOpen={showForm}
                ia={editingIA || undefined}
                onSave={handleSaveIA}
                onCancel={() => setShowForm(false)}
                nextIANumber={nextIANumber}
            />

            <style jsx>{`
                .ia-manager {
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

                .info-banner {
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                    border-left: 4px solid #3b82f6;
                    padding: 1rem;
                    margin: 1rem 0;
                    border-radius: 4px;
                    display: flex;
                    gap: 0.75rem;
                    color: #1e40af;
                    font-size: 0.875rem;
                }

                .info-banner strong {
                    font-weight: 600;
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
