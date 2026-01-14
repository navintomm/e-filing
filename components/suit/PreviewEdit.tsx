/**
 * Preview & Edit Component - Step 8
 * 
 * Allows the user to review and edit generated documents.
 * Features:
 * - Document sidebar for quick navigation
 * - Google Docs integration (simulation) for editing
 * - Live HTML preview
 * - Status tracking for edited documents
 */

'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { goToNextStep, goToPreviousStep } from '@/store/suit-draft-slice';
import { selectCurrentDraft } from '@/store/selectors';
import {
    FileText,
    ExternalLink,
    CheckCircle2,
    Edit3,
    Eye,
    RefreshCw,
    Download
} from 'lucide-react';
import type { GeneratedDocument } from '@/types/suit';

export function PreviewEdit() {
    const dispatch = useAppDispatch();
    const currentDraft = useAppSelector(selectCurrentDraft);
    const documents = currentDraft?.metadata.generatedDocuments || [];

    const [selectedDocId, setSelectedDocId] = useState<string | null>(
        documents.length > 0 ? documents[0].id : null
    );
    const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');

    const selectedDoc = documents.find((d: GeneratedDocument) => d.id === selectedDocId);

    // Mock functionality to simulate opening Google Docs
    const handleOpenGoogleDoc = (doc: GeneratedDocument) => {
        // In a real app, this would be a real Google Docs URL
        const mockUrl = `https://docs.google.com/document/d/mock-id/${doc.id}`;
        window.open(mockUrl, '_blank');
    };

    if (!currentDraft || documents.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3>No Documents Generated</h3>
                <p>Please go back to the previous step and generate documents first.</p>
                <button
                    onClick={() => dispatch(goToPreviousStep())}
                    className="btn btn-primary mt-4"
                >
                    Back to Generate
                </button>
            </div>
        );
    }

    return (
        <div className="preview-edit-container">
            {/* Sidebar - Document List */}
            <aside className="document-sidebar">
                <div className="sidebar-header">
                    <h3 className="sidebar-title">Documents</h3>
                    <span className="doc-count">{documents.length} Files</span>
                </div>

                <div className="doc-list">
                    {documents.map((doc: GeneratedDocument) => (
                        <div
                            key={doc.id}
                            className={`doc-item ${selectedDocId === doc.id ? 'active' : ''}`}
                            onClick={() => setSelectedDocId(doc.id)}
                        >
                            <div className="doc-icon">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div className="doc-info">
                                <span className="doc-name">{doc.name}</span>
                                <span className="doc-status">
                                    {doc.status === 'ready' ? (
                                        <span className="status-ready"><CheckCircle2 className="w-3 h-3" /> Ready</span>
                                    ) : (
                                        <span className="status-pending">Processing...</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content - Preview/Edit Area */}
            <main className="preview-main">
                {selectedDoc ? (
                    <div className="preview-content">
                        {/* Toolbar */}
                        <div className="preview-toolbar">
                            <div className="toolbar-left">
                                <h2 className="preview-title">{selectedDoc.name}</h2>
                                <span className="preview-badge">{selectedDoc.type}</span>
                            </div>

                            <div className="toolbar-right">
                                <div className="view-toggle">
                                    <button
                                        className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
                                        onClick={() => setViewMode('preview')}
                                    >
                                        <Eye className="w-4 h-4" /> Preview
                                    </button>
                                    <button
                                        className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
                                        onClick={() => setViewMode('edit')}
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </button>
                                </div>

                                <button
                                    className="btn btn-outline"
                                    onClick={() => handleOpenGoogleDoc(selectedDoc)}
                                    title="Open in Google Docs"
                                >
                                    <ExternalLink className="w-4 h-4" /> Google Docs
                                </button>
                            </div>
                        </div>

                        {/* Document Viewer */}
                        <div className="document-viewport">
                            {viewMode === 'preview' ? (
                                <div className="document-preview">
                                    {/* Mock Document Content - In real app, render HTML or PDF */}
                                    <div className="paper-sheet">
                                        <div className="paper-header">
                                            <div className="court-name">IN THE HONOURABLE {currentDraft.basicDetails.court.toUpperCase()}</div>
                                            <div className="case-number">{currentDraft.basicDetails.caseType} No. _____ of {currentDraft.basicDetails.year}</div>
                                        </div>

                                        <div className="paper-body">
                                            <h3 className="doc-heading">{selectedDoc.name.toUpperCase()}</h3>

                                            <p className="paper-text">
                                                {selectedDoc.htmlContent ? (
                                                    <div dangerouslySetInnerHTML={{ __html: selectedDoc.htmlContent }} />
                                                ) : (
                                                    "Document content preview not available. Please verify the generation step."
                                                )}
                                            </p>

                                            {selectedDoc.name === 'Vakalathnama' && (
                                                <div className="vakalath-preview">
                                                    <p>I, <strong>{currentDraft.partyDetails.plaintiffs[0]?.name}</strong>, Plaintiff No. 1 in the above case, do hereby appoint...</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="paper-footer">
                                            Page 1 of 1
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="editor-placeholder">
                                    <div className="google-docs-mock">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg"
                                            alt="Google Docs"
                                            className="gdocs-logo"
                                        />
                                        <h3>Google Docs Integration</h3>
                                        <p>In the production version, this area embeds the Google Docs editor.</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleOpenGoogleDoc(selectedDoc)}
                                        >
                                            Open in Google Docs
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="no-selection">
                        <FileText className="w-12 h-12 text-slate-300" />
                        <p>Select a document to preview</p>
                    </div>
                )}
            </main>

            {/* Bottom Navigation */}
            <div className="preview-navigation">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => dispatch(goToPreviousStep())}
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => dispatch(goToNextStep())}
                >
                    Finalize & Download
                    <Download className="w-4 h-4 ml-2" />
                </button>
            </div>

            <style jsx>{`
                .preview-edit-container {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 0;
                    background: #f3f4f6;
                    border-radius: 8px;
                    overflow: hidden;
                    height: calc(100vh - 200px);
                    min-height: 600px;
                    border: 1px solid #e5e7eb;
                    position: relative;
                }

                /* Sidebar */
                .document-sidebar {
                    background: white;
                    border-right: 1px solid #e5e7eb;
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .sidebar-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0;
                }

                .doc-count {
                    font-size: 0.75rem;
                    color: #6b7280;
                    background: #f3f4f6;
                    padding: 0.25rem 0.5rem;
                    border-radius: 99px;
                }

                .doc-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0.75rem;
                }

                .doc-item {
                    display: flex;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 0.25rem;
                }

                .doc-item:hover {
                    background: #f9fafb;
                }

                .doc-item.active {
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                }

                .doc-icon {
                    color: #6b7280;
                    padding-top: 0.125rem;
                }

                .doc-item.active .doc-icon {
                    color: #3b82f6;
                }

                .doc-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.125rem;
                }

                .doc-name {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 170px;
                }

                .doc-item.active .doc-name {
                    color: #1d4ed8;
                }

                .doc-status {
                    font-size: 0.75rem;
                }

                .status-ready {
                    color: #16a34a;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                /* Main Content */
                .preview-main {
                    display: flex;
                    flex-direction: column;
                    background: #e5e7eb;
                    overflow: hidden;
                    padding-bottom: 80px; /* Space for footer */
                }

                .preview-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                /* Toolbar */
                .preview-toolbar {
                    background: white;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }

                .toolbar-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .preview-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0;
                }

                .preview-badge {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    background: #f3f4f6;
                    color: #6b7280;
                    padding: 0.125rem 0.5rem;
                    border-radius: 4px;
                    font-weight: 600;
                }

                .toolbar-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .view-toggle {
                    display: flex;
                    background: #f3f4f6;
                    padding: 0.25rem;
                    border-radius: 6px;
                }

                .toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.375rem 0.75rem;
                    border: none;
                    background: transparent;
                    border-radius: 4px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .toggle-btn.active {
                    background: white;
                    color: #1f2937;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }

                .btn-outline {
                    background: white;
                    border: 1px solid #d1d5db;
                    color: #374151;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.375rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    cursor: pointer;
                }

                .btn-outline:hover {
                    background: #f9fafb;
                }

                /* Viewport */
                .document-viewport {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem;
                    display: flex;
                    justify-content: center;
                }

                .document-preview {
                    width: 100%;
                    max-width: 800px;
                }

                .paper-sheet {
                    background: white;
                    width: 100%;
                    min-height: 1000px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    padding: 3rem; /* Approx 1 inch */
                    display: flex;
                    flex-direction: column;
                }

                .paper-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    font-family: 'Times New Roman', serif;
                }

                .court-name {
                    font-weight: bold;
                    font-size: 1.125rem;
                    margin-bottom: 0.5rem;
                }

                .doc-heading {
                    text-align: center;
                    text-decoration: underline;
                    margin-bottom: 1.5rem;
                    font-family: 'Times New Roman', serif;
                }

                .paper-body {
                    flex: 1;
                    font-family: 'Times New Roman', serif;
                    line-height: 1.6;
                    font-size: 1.05rem;
                }

                .paper-footer {
                    margin-top: 2rem;
                    text-align: center;
                    font-size: 0.75rem;
                    color: #9ca3af;
                    border-top: 1px solid #f3f4f6;
                    padding-top: 1rem;
                }

                /* Empty States */
                .editor-placeholder, .no-selection {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #6b7280;
                }

                .google-docs-mock {
                    text-align: center;
                    background: white;
                    padding: 3rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    max-width: 400px;
                }

                .gdocs-logo {
                    width: 64px;
                    height: 64px;
                    margin-bottom: 1.5rem;
                }

                .editor-placeholder h3 {
                    margin: 0 0 0.5rem 0;
                    color: #1f2937;
                }

                .preview-navigation {
                    position: absolute;
                    bottom: 0;
                    left: 280px; /* Sidebar width */
                    right: 0;
                    background: white;
                    padding: 1rem 2rem;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 10;
                }

                .btn {
                    padding: 0.625rem 1.25rem;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    display: flex;
                    align-items: center;
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

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                @media (max-width: 1024px) {
                    .preview-edit-container {
                        grid-template-columns: 1fr;
                        height: auto;
                        min-height: 800px;
                    }

                    .document-sidebar {
                        border-right: none;
                        border-bottom: 1px solid #e5e7eb;
                        max-height: 200px;
                    }

                    .preview-navigation {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                    }
                    
                    .preview-main {
                        padding-bottom: 80px;
                    }
                }
            `}</style>
        </div>
    );
}
