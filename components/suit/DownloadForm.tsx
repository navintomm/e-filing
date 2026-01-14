/**
 * Download Component - Step 9 (Final Step)
 * 
 * Allows users to download their generated suit documents in various formats.
 * Includes bulk download and final completion actions.
 */

'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { goToPreviousStep, startNewDraft } from '@/store/suit-draft-slice';
import { selectCurrentDraft } from '@/store/selectors';
import {
    Download,
    FileText,
    CheckCircle,
    FileDown,
    ArrowLeft,
    Plus,
    Home,
    Mail,
    Printer,
    Archive
} from 'lucide-react';
import type { GeneratedDocument } from '@/types/suit';
import { useRouter } from 'next/navigation';

export function DownloadForm() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const currentDraft = useAppSelector(selectCurrentDraft);
    const documents = currentDraft?.metadata.generatedDocuments || [];

    const handleDownload = (doc: GeneratedDocument, format: 'pdf' | 'docx') => {
        // In a real application, this would trigger a direct download of the buffer or from a URL
        const downloadUrl = format === 'pdf' ? doc.pdfBuffer : doc.docxBuffer;

        // Mock download notification
        console.log(`Downloading ${doc.name} as ${format.toUpperCase()}...`);
        alert(`Downloading ${doc.name} as ${format.toUpperCase()}.\n(In production, this would trigger the file download)`);
    };

    const handleDownloadAll = () => {
        alert("Preparing ZIP archive with all 12+ documents...\n(In production, this would download a single .zip file)");
    };

    const handleStartNew = () => {
        if (confirm('Start a new suit draft? All current unsaved changes will be cleared.')) {
            dispatch(startNewDraft());
            router.push('/suit/new');
        }
    };

    if (!currentDraft || documents.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <Download className="w-8 h-8 text-slate-400" />
                </div>
                <h3>Ready to Download</h3>
                <p>Ensure you have generated and reviewed your documents first.</p>
                <button
                    onClick={() => dispatch(goToPreviousStep())}
                    className="btn btn-primary mt-4"
                >
                    Back to Preview
                </button>
            </div>
        );
    }

    return (
        <div className="download-container">
            {/* Header / Success Message */}
            <div className="download-header">
                <div className="success-badge">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2>Suit Drafting Complete!</h2>
                <p className="case-ref">
                    Ref: {currentDraft.basicDetails.caseType} for {currentDraft.partyDetails.plaintiffs[0]?.name || 'Petitioner'}
                </p>
                <p className="description">
                    Your {documents.length} legal documents are ready. You can download them individually or as a bulk archive.
                </p>
            </div>

            <div className="download-grid">
                {/* Individual Downloads */}
                <div className="documents-section">
                    <h3 className="section-title">Case Documents</h3>
                    <div className="doc-list">
                        {documents.map((doc: GeneratedDocument) => (
                            <div key={doc.id} className="doc-row">
                                <div className="doc-main-info">
                                    <FileText className="w-5 h-5 text-slate-500" />
                                    <div className="doc-text">
                                        <span className="doc-name">{doc.name}</span>
                                        <span className="doc-meta">{doc.type.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div className="doc-actions">
                                    <button
                                        className="btn-download pdf"
                                        onClick={() => handleDownload(doc, 'pdf')}
                                        title="Download PDF"
                                    >
                                        PDF
                                    </button>
                                    <button
                                        className="btn-download docx"
                                        onClick={() => handleDownload(doc, 'docx')}
                                        title="Download Word"
                                    >
                                        DOCX
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bulk Actions & Meta */}
                <aside className="actions-section">
                    <div className="action-card primary-card">
                        <Archive className="w-8 h-8 text-blue-600 mb-2" />
                        <h4>Bulk Download</h4>
                        <p>Get all documents in a single .zip archive for easy filing.</p>
                        <button className="btn btn-primary w-full" onClick={handleDownloadAll}>
                            <FileDown className="w-4 h-4 mr-2" /> Download All (.ZIP)
                        </button>
                    </div>

                    <div className="secondary-actions">
                        <button className="btn btn-secondary w-full mb-2">
                            <Mail className="w-4 h-4 mr-2" /> Email Documents
                        </button>
                        <button className="btn btn-secondary w-full">
                            <Printer className="w-4 h-4 mr-2" /> Print All
                        </button>
                    </div>

                    <div className="completion-options">
                        <hr />
                        <button className="option-link" onClick={handleStartNew}>
                            <Plus className="w-4 h-4" /> Start Another Suit
                        </button>
                        <button className="option-link" onClick={() => router.push('/dashboard')}>
                            <Home className="w-4 h-4" /> Go to Dashboard
                        </button>
                        <button className="option-link text-slate-500" onClick={() => dispatch(goToPreviousStep())}>
                            <ArrowLeft className="w-4 h-4" /> Back to Edit
                        </button>
                    </div>
                </aside>
            </div>

            <style jsx>{`
                .download-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding-bottom: 4rem;
                }

                .download-header {
                    text-align: center;
                    padding: 3rem 2rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                }

                .success-badge {
                    margin-bottom: 1.5rem;
                    display: flex;
                    justify-content: center;
                }

                .download-header h2 {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: #111827;
                    margin-bottom: 0.5rem;
                }

                .case-ref {
                    font-size: 1.125rem;
                    color: #4b5563;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                }

                .description {
                    color: #6b7280;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .download-grid {
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 2rem;
                }

                .documents-section {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #e5e7eb;
                }

                .doc-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .doc-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: #f9fafb;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .doc-row:hover {
                    background: #f3f4f6;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .doc-main-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .doc-text {
                    display: flex;
                    flex-direction: column;
                }

                .doc-name {
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: #111827;
                }

                .doc-meta {
                    font-size: 0.75rem;
                    color: #6b7280;
                    text-transform: capitalize;
                }

                .doc-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .btn-download {
                    padding: 0.375rem 0.75rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 4px;
                    border: 1px solid #d1d5db;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-download.pdf:hover {
                    background: #fef2f2;
                    color: #dc2626;
                    border-color: #fecaca;
                }

                .btn-download.docx:hover {
                    background: #eff6ff;
                    color: #2563eb;
                    border-color: #bfdbfe;
                }

                .actions-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .action-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    text-align: center;
                }

                .primary-card {
                    border: 2px solid #eff6ff;
                    background: linear-gradient(to bottom, #ffffff, #f8fafc);
                }

                .action-card h4 {
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 0.5rem;
                }

                .action-card p {
                    font-size: 0.8125rem;
                    color: #64748b;
                    margin-bottom: 1.25rem;
                }

                .secondary-actions {
                    background: white;
                    padding: 1rem;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .completion-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .completion-options hr {
                    border: 0;
                    border-top: 1px solid #e2e8f0;
                    margin-bottom: 0.5rem;
                }

                .option-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                    background: transparent;
                    border: none;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #3b82f6;
                    cursor: pointer;
                    transition: color 0.2s;
                    text-align: left;
                }

                .option-link:hover {
                    color: #1d4ed8;
                    text-decoration: underline;
                }

                .btn {
                    padding: 0.75rem 1.25rem;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                }

                .btn-primary {
                    background: #2563eb;
                    color: white;
                }

                .btn-primary:hover {
                    background: #1d4ed8;
                    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.4);
                }

                .btn-secondary {
                    background: white;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                }

                .btn-secondary:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                @media (max-width: 768px) {
                    .download-grid {
                        grid-template-columns: 1fr;
                    }

                    .download-header h2 {
                        font-size: 1.75rem;
                    }
                }
            `}</style>
        </div>
    );
}
