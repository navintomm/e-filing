/**
 * Generate Documents Component - Step 7
 * 
 * Displays a summary of all collected data and initiates document generation.
 * Shows:
 * - Summary of all 6 steps
 * - List of documents to be generated
 * - Generation progress
 * - Success/error states
 */

'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    goToNextStep,
    goToPreviousStep,
    startGeneration,
    updateGenerationProgress,
    setGeneratedDocuments,
    generationError
} from '@/store/suit-draft-slice';
import {
    selectCurrentDraft,
    selectIsGenerating,
    selectGenerationProgress
} from '@/store/selectors';
import {
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
    User,
    Scale,
    Calendar,
    MapPin,
    FileCheck,
    Gavel
} from 'lucide-react';
import type { GeneratedDocument, Party, DocumentItem } from '@/types/suit';
import {
    generateVakalathFromDraft,
    generateListOfPartiesPDF,
    generateListOfDocumentsPDF,
    generateValuationPDF,
    generatePlaintPDF,
    generateAffidavitPDF,
    generateIAPDF,
    generateIAAffidavitPDF,
    generateSynopsisPDF,
    generateIndexPDF
} from '@/lib/generator-kerala-template';

// Documents that will be generated
const DOCUMENT_LIST = [
    { name: 'Vakalathnama', required: true, description: 'Authorization to advocate' },
    { name: 'Plaint', required: true, description: 'Main suit document' },
    { name: 'Affidavit', required: true, description: 'Sworn statement of facts' },
    { name: 'List of Parties', required: true, description: 'Complete party list' },
    { name: 'List of Documents', required: true, description: 'Index of annexed documents' },
    { name: 'Court Fee Certificate', required: true, description: 'Fee computation' },
    { name: 'Memo of Appearance', required: true, description: 'Advocate appearance memo' },
    { name: 'Index', required: true, description: 'Master index of all documents' },
    { name: 'Interlocutory Applications', required: false, description: 'IAs (if any)' },
    { name: 'IA Affidavits', required: false, description: 'Affidavits for IAs' },
    { name: 'Written Statement', required: false, description: 'Defendant response (template)' },
    { name: 'Synopsis', required: false, description: 'Case summary for reference' },
];

export function GenerateDocuments() {
    const dispatch = useAppDispatch();
    const currentDraft = useAppSelector(selectCurrentDraft);
    const isGenerating = useAppSelector(selectIsGenerating);
    const generationProgress = useAppSelector(selectGenerationProgress);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    if (!currentDraft) {
        return <div>Loading draft data...</div>;
    }

    const {
        basicDetails,
        partyDetails,
        plaintDetails,
        scheduleDetails,
        documentDetails,
        iaDetails,
        judgementDetails
    } = currentDraft;

    // Calculate summary statistics
    const stats = {
        plaintiffs: partyDetails.plaintiffs.length,
        defendants: partyDetails.defendants.length,
        schedules: scheduleDetails.schedules.length,
        documents: documentDetails.documents.length,
        ias: iaDetails.applications.length,
        judgements: judgementDetails.judgements.length
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleGenerate = async () => {
        dispatch(startGeneration());

        try {
            const docs: GeneratedDocument[] = [];
            const totalDocs = DOCUMENT_LIST.filter(doc => doc.required || (doc.name.includes('IA') && stats.ias > 0)).length;
            let completed = 0;

            const updateProgress = () => {
                completed++;
                dispatch(updateGenerationProgress(Math.round((completed / totalDocs) * 100)));
            };

            // 1. Vakalathnama
            const vakalathBuffer = await generateVakalathFromDraft(currentDraft);
            docs.push({
                id: 'doc_vakalath',
                name: 'Vakalathnama',
                type: 'vakalathnama',
                status: 'ready',
                generatedAt: new Date(),
                pdfUrl: URL.createObjectURL(new Blob([vakalathBuffer] as BlobPart[], { type: 'application/pdf' }))
            });
            updateProgress();

            // 2. List of Parties
            const partiesBuffer = await generateListOfPartiesPDF(currentDraft);
            docs.push({
                id: 'doc_parties',
                name: 'List of Parties',
                type: 'list_of_parties',
                status: 'ready',
                generatedAt: new Date(),
                pdfUrl: URL.createObjectURL(new Blob([partiesBuffer] as BlobPart[], { type: 'application/pdf' }))
            });
            updateProgress();

            // 3. List of Documents
            const docsListBuffer = await generateListOfDocumentsPDF(currentDraft);
            docs.push({
                id: 'doc_list',
                name: 'List of Documents',
                type: 'list_of_documents',
                status: 'ready',
                generatedAt: new Date(),
                pdfUrl: URL.createObjectURL(new Blob([docsListBuffer] as BlobPart[], { type: 'application/pdf' }))
            });
            updateProgress();

            // 4. Plaint
            const plaintBuffer = await generatePlaintPDF(currentDraft);
            docs.push({
                id: 'doc_plaint',
                name: 'Plaint',
                type: 'plaint',
                status: 'ready',
                generatedAt: new Date(),
                pdfUrl: URL.createObjectURL(new Blob([plaintBuffer] as BlobPart[], { type: 'application/pdf' }))
            });
            updateProgress();

            // 5. Affidavit
            const affidavitBuffer = await generateAffidavitPDF(currentDraft);
            docs.push({
                id: 'doc_affidavit',
                name: 'Affidavit',
                type: 'affidavit',
                status: 'ready',
                generatedAt: new Date(),
                pdfUrl: URL.createObjectURL(new Blob([affidavitBuffer] as BlobPart[], { type: 'application/pdf' }))
            });
            updateProgress();

            // 6. Case Fee / Valuation
            const valuationBuffer = await generateValuationPDF(currentDraft);
            docs.push({
                id: 'doc_valuation',
                name: 'Court Fee Certificate',
                type: 'court_fee_certificate',
                status: 'ready',
                generatedAt: new Date(),
                pdfUrl: URL.createObjectURL(new Blob([valuationBuffer] as BlobPart[], { type: 'application/pdf' }))
            });
            updateProgress();

            // 7. Interlocutory Applications (Bundle)
            if (stats.ias > 0) {
                const iaBuffer = await generateIAPDF(currentDraft);
                docs.push({
                    id: 'doc_ia',
                    name: 'Interlocutory Applications',
                    type: 'interlocutory_application',
                    status: 'ready',
                    generatedAt: new Date(),
                    pdfUrl: URL.createObjectURL(new Blob([iaBuffer] as BlobPart[], { type: 'application/pdf' }))
                });
                updateProgress();

                const iaAffidavitBuffer = await generateIAAffidavitPDF(currentDraft);
                docs.push({
                    id: 'doc_ia_affidavit',
                    name: 'IA Affidavits',
                    type: 'ia_affidavit',
                    status: 'ready',
                    generatedAt: new Date(),
                    pdfUrl: URL.createObjectURL(new Blob([iaAffidavitBuffer] as BlobPart[], { type: 'application/pdf' }))
                });
                updateProgress();
            }

            // 8. Synopsis
            if (DOCUMENT_LIST.find(d => d.name === 'Synopsis')?.required || true) { // Always generate for now or based on user choice
                const synopsisBuffer = await generateSynopsisPDF(currentDraft);
                docs.push({
                    id: 'doc_synopsis',
                    name: 'Synopsis',
                    type: 'synopsis',
                    status: 'ready',
                    generatedAt: new Date(),
                    pdfUrl: URL.createObjectURL(new Blob([synopsisBuffer] as BlobPart[], { type: 'application/pdf' }))
                });
                updateProgress();
            }

            // 9. Index
            const indexBuffer = await generateIndexPDF(currentDraft);
            docs.push({
                id: 'doc_index',
                name: 'Index',
                type: 'index',
                status: 'ready',
                generatedAt: new Date(),
                pdfUrl: URL.createObjectURL(new Blob([indexBuffer] as BlobPart[], { type: 'application/pdf' }))
            });
            updateProgress();

            // 10. Remaining documents (Mocked)
            const remainingDocs = DOCUMENT_LIST.filter(d =>
                !['Vakalathnama', 'List of Parties', 'List of Documents', 'Court Fee Certificate', 'Plaint', 'Affidavit', 'Interlocutory Applications', 'IA Affidavits', 'Synopsis', 'Index'].includes(d.name) &&
                d.required
            );

            for (const doc of remainingDocs) {
                // Add a small delay to simulate generation
                await new Promise(resolve => setTimeout(resolve, 300));
                docs.push({
                    id: `doc_${doc.name.toLowerCase().replace(/\s+/g, '_')}`,
                    name: doc.name,
                    type: doc.name.toLowerCase().replace(/\s+/g, '_'),
                    status: 'ready',
                    generatedAt: new Date(),
                    htmlContent: `<h1>${doc.name}</h1><p>High-fidelity template pending implementation. Using standard draft layout.</p>`
                });
                updateProgress();
            }

            dispatch(setGeneratedDocuments(docs));
            dispatch(goToNextStep());
        } catch (error) {
            dispatch(generationError(error instanceof Error ? error.message : 'Generation failed'));
        }
    };

    return (
        <div className="generate-documents">
            <div className="content-card">
                {/* Header */}
                <div className="card-header">
                    <div className="header-icon">
                        <FileText className="icon" />
                    </div>
                    <div>
                        <h2 className="card-title">Generate Court Documents</h2>
                        <p className="card-subtitle">
                            Review your data and generate all required court documents
                        </p>
                    </div>
                </div>

                <div className="card-body">
                    {/* Progress Bar (visible during generation) */}
                    {isGenerating && (
                        <div className="generation-progress">
                            <div className="progress-header">
                                <Loader2 className="spinner" />
                                <span className="progress-text">Generating documents...</span>
                                <span className="progress-percent">{generationProgress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${generationProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Data Summary */}
                    <div className="summary-section">
                        <h3 className="section-title">Data Summary</h3>
                        <div className="summary-grid">
                            {/* Basic Details */}
                            <div
                                className={`summary-card ${expandedSection === 'basic' ? 'expanded' : ''}`}
                                onClick={() => toggleSection('basic')}
                            >
                                <div className="summary-header">
                                    <div className="summary-icon">
                                        <Scale />
                                    </div>
                                    <div className="summary-info">
                                        <h4 className="summary-title">Basic Details</h4>
                                        <p className="summary-value">
                                            {basicDetails.caseType} in {basicDetails.court}
                                        </p>
                                    </div>
                                    {expandedSection === 'basic' ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                {expandedSection === 'basic' && (
                                    <div className="summary-details">
                                        <div className="detail-row">
                                            <span className="detail-label">District:</span>
                                            <span className="detail-value">{basicDetails.district}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Year:</span>
                                            <span className="detail-value">{basicDetails.year}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Type:</span>
                                            <span className="detail-value">{basicDetails.vakalathType}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Parties */}
                            <div
                                className={`summary-card ${expandedSection === 'parties' ? 'expanded' : ''}`}
                                onClick={() => toggleSection('parties')}
                            >
                                <div className="summary-header">
                                    <div className="summary-icon">
                                        <User />
                                    </div>
                                    <div className="summary-info">
                                        <h4 className="summary-title">Parties</h4>
                                        <p className="summary-value">
                                            {stats.plaintiffs} Plaintiff(s) vs {stats.defendants} Defendant(s)
                                        </p>
                                    </div>
                                    {expandedSection === 'parties' ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                {expandedSection === 'parties' && (
                                    <div className="summary-details">
                                        <div className="detail-section">
                                            <span className="detail-label">Plaintiffs:</span>
                                            {partyDetails.plaintiffs.map((p: Party, i: number) => (
                                                <span key={p.id} className="detail-value">{i + 1}. {p.name}</span>
                                            ))}
                                        </div>
                                        <div className="detail-section">
                                            <span className="detail-label">Defendants:</span>
                                            {partyDetails.defendants.map((d: Party, i: number) => (
                                                <span key={d.id} className="detail-value">{i + 1}. {d.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Documents & Schedules */}
                            <div
                                className={`summary-card ${expandedSection === 'items' ? 'expanded' : ''}`}
                                onClick={() => toggleSection('items')}
                            >
                                <div className="summary-header">
                                    <div className="summary-icon">
                                        <FileCheck />
                                    </div>
                                    <div className="summary-info">
                                        <h4 className="summary-title">Schedules & Documents</h4>
                                        <p className="summary-value">
                                            {stats.schedules} Schedule(s), {stats.documents} Document(s)
                                        </p>
                                    </div>
                                    {expandedSection === 'items' ? <ChevronUp /> : <ChevronDown />}
                                </div>
                                {expandedSection === 'items' && (
                                    <div className="summary-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Total Pages:</span>
                                            <span className="detail-value">{documentDetails.totalPages}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Marked Exhibits:</span>
                                            <span className="detail-value">
                                                {documentDetails.documents.filter((d: DocumentItem) => d.isMarked).length}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Optional Items */}
                            <div
                                className={`summary-card ${expandedSection === 'optional' ? 'expanded' : ''}`}
                                onClick={() => toggleSection('optional')}
                            >
                                <div className="summary-header">
                                    <div className="summary-icon">
                                        <Gavel />
                                    </div>
                                    <div className="summary-info">
                                        <h4 className="summary-title">IAs & Judgements</h4>
                                        <p className="summary-value">
                                            {stats.ias} IA(s), {stats.judgements} Citation(s)
                                        </p>
                                    </div>
                                    {expandedSection === 'optional' ? <ChevronUp /> : <ChevronDown />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Document List */}
                    <div className="document-list-section">
                        <h3 className="section-title">Documents to Generate</h3>
                        <div className="document-list">
                            {DOCUMENT_LIST.map((doc, index) => {
                                const willGenerate = doc.required || (
                                    (doc.name.includes('IA') && stats.ias > 0)
                                );
                                return (
                                    <div key={index} className={`document-item ${!willGenerate ? 'disabled' : ''}`}>
                                        <div className="document-icon">
                                            {willGenerate ? (
                                                <CheckCircle2 className="icon-check" />
                                            ) : (
                                                <AlertCircle className="icon-skip" />
                                            )}
                                        </div>
                                        <div className="document-info">
                                            <h4 className="document-name">{doc.name}</h4>
                                            <p className="document-desc">{doc.description}</p>
                                        </div>
                                        <div className="document-status">
                                            {doc.required ? (
                                                <span className="badge badge-required">Required</span>
                                            ) : willGenerate ? (
                                                <span className="badge badge-included">Included</span>
                                            ) : (
                                                <span className="badge badge-skipped">Skipped</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="card-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => dispatch(goToPreviousStep())}
                        disabled={isGenerating}
                    >
                        ← Back to Judgements
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="spinner" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <FileText />
                                Generate All Documents
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
                /* Base Styles */
                .generate-documents {
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .content-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                /* Header */
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 2rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .header-icon {
                    width: 4rem;
                    height: 4rem;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .header-icon .icon {
                    width: 2rem;
                    height: 2rem;
                }

                .card-title {
                    font-size: 1.875rem;
                    font-weight: 800;
                    margin: 0 0 0.5rem 0;
                }

                .card-subtitle {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 1rem;
                }

                /* Card Body */
                .card-body {
                    padding: 2rem;
                }

                /* Generation Progress */
                .generation-progress {
                    background: #eff6ff;
                    border: 2px solid #3b82f6;
                    border-radius: 8px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }

                .progress-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    color: #3b82f6;
                    font-weight: 600;
                }

                .progress-text {
                    flex: 1;
                }

                .progress-percent {
                    font-size: 1.125rem;
                }

                .progress-bar {
                    height: 8px;
                    background: #dbeafe;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: #3b82f6;
                    transition: width 0.3s ease;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* Summary Section */
                .summary-section {
                    margin-bottom: 2rem;
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 1rem;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1rem;
                }

                .summary-card {
                    background: #f9fafb;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .summary-card:hover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }

                .summary-card.expanded {
                    border-color: #3b82f6;
                }

                .summary-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                }

                .summary-icon {
                    width: 3rem;
                    height: 3rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .summary-info {
                    flex: 1;
                }

                .summary-title {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #6b7280;
                    margin: 0 0 0.25rem 0;
                }

                .summary-value {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0;
                }

                .summary-details {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #e5e7eb;
                }

                .detail-row,
                .detail-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    margin-bottom: 0.75rem;
                }

                .detail-label {
                    font-size: 0.75rem;
                    color: #6b7280;
                    font-weight: 600;
                }

                .detail-value {
                    font-size: 0.875rem;
                    color: #1f2937;
                }

                /* Document List */
                .document-list-section {
                    margin-bottom: 2rem;
                }

                .document-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .document-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f9fafb;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .document-item.disabled {
                    opacity: 0.5;
                }

                .document-item:not(.disabled):hover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }

                .document-icon {
                    width: 2.5rem;
                    height: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    flex-shrink: 0;
                }

                .icon-check {
                    color: #22c55e;
                    width: 1.5rem;
                    height: 1.5rem;
                }

                .icon-skip {
                    color: #6b7280;
                    width: 1.5rem;
                    height: 1.5rem;
                }

                .document-info {
                    flex: 1;
                }

                .document-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0 0 0.25rem 0;
                }

                .document-desc {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0;
                }

                .document-status {
                    flex-shrink: 0;
                }

                .badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .badge-required {
                    background: #dbeafe;
                    color: #1e40af;
                }

                .badge-included {
                    background: #dcfce7;
                    color: #166534;
                }

                .badge-skipped {
                    background: #f3f4f6;
                    color: #6b7280;
                }

                /* Footer */
                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    padding: 2rem;
                    background: #f9fafb;
                    border-top: 2px solid #e5e7eb;
                }

                .btn {
                    padding: 0.875rem 1.75rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
                }

                .btn-secondary {
                    background: white;
                    color: #374151;
                    border: 2px solid #e5e7eb;
                }

                .btn-secondary:hover:not(:disabled) {
                    border-color: #9ca3af;
                }

                @media (max-width: 768px) {
                    .card-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .card-footer {
                        flex-direction: column;
                    }

                    .btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}
