/**
 * Judgement Details Form (Manager)
 * 
 * Step 6 of the Draft Suit System.
 * Manages precedents and case law cited in support of the suit.
 */

'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    addJudgement,
    updateJudgement,
    removeJudgement,
    goToNextStep,
    goToPreviousStep
} from '@/store/suit-draft-slice';
import { selectJudgements } from '@/store/selectors';
import { JudgementList } from './JudgementList';
import { JudgementForm } from './JudgementForm';
import type { Judgement } from '@/types/suit';
import { Plus, Info } from 'lucide-react';

export function JudgementDetailsForm() {
    const dispatch = useAppDispatch();
    const judgementsRaw = useAppSelector(selectJudgements);

    // Ensure safe array access
    const judgements = (judgementsRaw || []) as Judgement[];

    const [showForm, setShowForm] = useState(false);
    const [editingJudgement, setEditingJudgement] = useState<Judgement | null>(null);

    const handleAddJudgement = () => {
        setEditingJudgement(null);
        setShowForm(true);
    };

    const handleEditJudgement = (judgement: Judgement) => {
        setEditingJudgement(judgement);
        setShowForm(true);
    };

    const handleDeleteJudgement = (id: string) => {
        if (confirm('Are you sure you want to remove this precedent?')) {
            dispatch(removeJudgement(id));
        }
    };

    const handleSaveJudgement = (judgementData: Judgement) => {
        if (editingJudgement) {
            dispatch(updateJudgement({ id: editingJudgement.id, judgement: judgementData }));
        } else {
            dispatch(addJudgement(judgementData));
        }
        setShowForm(false);
        setEditingJudgement(null);
    };

    const handleNext = () => {
        // Judgements are optional, so we can always proceed
        dispatch(goToNextStep());
    };

    return (
        <div className="judgement-manager">
            <div className="manager-header">
                <h2>Precedents & Case Law</h2>
                <p className="manager-description">
                    Add relevant judgements and case law that support your legal arguments.
                    These will be cited in your petition to strengthen your position.
                </p>
            </div>

            <div className="info-banner">
                <Info className="w-5 h-5" />
                <div>
                    <strong>Optional Step:</strong> Not all suits require citing precedents.
                    You can skip this step if your arguments are based purely on facts and statutory law.
                </div>
            </div>

            <div className="manager-content">
                <div className="section-header">
                    <div className="section-title-group">
                        <h3 className="section-title">Case Law Citations</h3>
                        {judgements.length > 0 && (
                            <span className="count-badge">{judgements.length}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAddJudgement}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Precedent
                    </button>
                </div>

                <JudgementList
                    judgements={judgements}
                    onEdit={handleEditJudgement}
                    onDelete={handleDeleteJudgement}
                />
            </div>

            <div className="manager-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => dispatch(goToPreviousStep())}
                >
                    ← Back to Applications
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                >
                    {judgements.length === 0 ? 'Skip this Step →' : 'Continue to Next Step →'}
                </button>
            </div>

            <JudgementForm
                isOpen={showForm}
                judgement={editingJudgement || undefined}
                onSave={handleSaveJudgement}
                onCancel={() => setShowForm(false)}
            />

            <style jsx>{`
                .judgement-manager {
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
