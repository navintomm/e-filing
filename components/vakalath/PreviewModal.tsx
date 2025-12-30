"use client";

import { useState } from "react";
import { X, FileDown, Type, AlignLeft, Square } from "lucide-react";
import { VakalathFormValues } from "@/lib/validators";
import { generatePDF, generateDOCX } from "@/lib/generator";
import { createVakalathInGoogleDocs } from "@/lib/vakalath-google-docs";
import { Loader2 } from "lucide-react";

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: VakalathFormValues;
    fontSize: number;
    setFontSize: (size: number) => void;
    fontFamily: string;
    setFontFamily: (family: string) => void;
}

export function PreviewModal({
    isOpen,
    onClose,
    data,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily
}: PreviewModalProps) {
    const [lineHeight, setLineHeight] = useState(1.5); // Default 1.5 line spacing
    const [margins, setMargins] = useState({
        top: 108,    // 1.5" in pixels (1.5 * 72)
        bottom: 108, // 1.5" 
        left: 126,   // 1.75"
        right: 72    // 1.0"
    });

    if (!isOpen) return null;

    const handleDownloadPDF = async () => {
        try {
            const pdfBytes = await generatePDF(data, fontSize);
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Vakalath_Preview.pdf`;
            link.click();
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');
        }
    };

    const handleDownloadDOCX = async () => {
        try {
            const blob = await generateDOCX(data);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Vakalath_Preview.docx`;
            link.click();
        } catch (error) {
            console.error('Error generating DOCX:', error);
            alert('Failed to generate DOCX');
        }
    };

    const [isCreatingGoogleDoc, setIsCreatingGoogleDoc] = useState(false);

    const handleDownloadGoogleDoc = async () => {
        setIsCreatingGoogleDoc(true);
        try {
            const result = await createVakalathInGoogleDocs(data);
            if (result.success && result.documentUrl) {
                window.open(result.documentUrl, '_blank');
            } else {
                alert(result.error || 'Failed to create Google Doc');
            }
        } catch (error) {
            console.error('Error creating Google Doc:', error);
            alert('Failed to create Google Doc');
        } finally {
            setIsCreatingGoogleDoc(false);
        }
    };

    // Extract parties
    const petitioners = data.parties?.filter(p =>
        p.role?.toLowerCase().includes('petitioner') ||
        p.role?.toLowerCase().includes('plaintiff') ||
        p.role?.toLowerCase().includes('complainant') ||
        p.role?.toLowerCase().includes('applicant')
    ) || [];

    const respondents = data.parties?.filter(p =>
        p.role?.toLowerCase().includes('respondent') ||
        p.role?.toLowerCase().includes('defendant') ||
        p.role?.toLowerCase().includes('opposite')
    ) || [];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
            onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-xl font-bold text-gray-900">Document Preview</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-3 border-b border-gray-200 flex flex-wrap items-center gap-4 bg-gray-50">
                    {/* Font Size */}
                    <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-gray-600" />
                        <button
                            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
                        >
                            A-
                        </button>
                        <span className="text-sm font-medium">{fontSize}px</span>
                        <button
                            onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
                        >
                            A+
                        </button>
                    </div>

                    {/* Line Spacing */}
                    <div className="flex items-center gap-2">
                        <AlignLeft className="w-4 h-4 text-gray-600" />
                        <button
                            onClick={() => setLineHeight(Math.max(1.0, lineHeight - 0.1))}
                            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
                        >
                            -
                        </button>
                        <span className="text-sm font-medium">{lineHeight.toFixed(1)}x</span>
                        <button
                            onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))}
                            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
                        >
                            +
                        </button>
                    </div>

                    {/* Font Family */}
                    <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="serif">Times New Roman</option>
                        <option value="sans-serif">Arial</option>
                        <option value="monospace">Courier New</option>
                    </select>

                    {/* Margin Controls */}
                    <div className="flex items-center gap-2">
                        <Square className="w-4 h-4 text-gray-600" />
                        <div className="flex gap-1 items-center text-xs">
                            <div className="flex flex-col items-center">
                                <label className="text-gray-500">L</label>
                                <input
                                    type="number"
                                    value={Math.round(margins.left / 72 * 100) / 100}
                                    onChange={(e) => setMargins({ ...margins, left: parseFloat(e.target.value) * 72 })}
                                    step="0.1"
                                    className="w-12 px-1 py-0.5 border rounded text-center"
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <label className="text-gray-500">T</label>
                                <input
                                    type="number"
                                    value={Math.round(margins.top / 72 * 100) / 100}
                                    onChange={(e) => setMargins({ ...margins, top: parseFloat(e.target.value) * 72 })}
                                    step="0.1"
                                    className="w-12 px-1 py-0.5 border rounded text-center"
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <label className="text-gray-500">R</label>
                                <input
                                    type="number"
                                    value={Math.round(margins.right / 72 * 100) / 100}
                                    onChange={(e) => setMargins({ ...margins, right: parseFloat(e.target.value) * 72 })}
                                    step="0.1"
                                    className="w-12 px-1 py-0.5 border rounded text-center"
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <label className="text-gray-500">B</label>
                                <input
                                    type="number"
                                    value={Math.round(margins.bottom / 72 * 100) / 100}
                                    onChange={(e) => setMargins({ ...margins, bottom: parseFloat(e.target.value) * 72 })}
                                    step="0.1"
                                    className="w-12 px-1 py-0.5 border rounded text-center"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Download Buttons */}
                    <button
                        onClick={handleDownloadPDF}
                        className="ml-auto inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 shadow-sm transition-colors"
                    >
                        <FileDown className="w-4 h-4 mr-2" />
                        PDF
                    </button>
                    <button
                        onClick={handleDownloadGoogleDoc}
                        disabled={isCreatingGoogleDoc}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 shadow-sm transition-colors disabled:opacity-50"
                    >
                        {isCreatingGoogleDoc ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <FileDown className="w-4 h-4 mr-2" />
                        )}
                        Google Doc
                    </button>
                    <button
                        onClick={handleDownloadDOCX}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 shadow-sm transition-colors"
                    >
                        <FileDown className="w-4 h-4 mr-2" />
                        DOCX
                    </button>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-md"
                        style={{
                            fontSize: `${fontSize}px`,
                            fontFamily,
                            lineHeight,
                            paddingTop: `${margins.top}px`,
                            paddingBottom: `${margins.bottom}px`,
                            paddingLeft: `${margins.left}px`,
                            paddingRight: `${margins.right}px`
                        }}>

                        {/* Document Header */}
                        <div className="text-center font-bold mb-4">
                            <p className="uppercase">BEFORE THE {data.courtName}</p>
                            <p className="mt-4">{data.caseType} No. {data.caseNumber || '_______'} of {data.year || '20__'}</p>
                        </div>

                        {/* Petitioners */}
                        <div className="mb-4">
                            {petitioners.map((p, index) => (
                                <p key={`pet - ${index} `} className="font-bold">
                                    {index + 1}. {p.name}
                                </p>
                            ))}
                            <p className="font-bold">... {petitioners.length > 1 ? 'Petitioners' : 'Petitioner'}</p>
                        </div>

                        <div className="text-center my-4">And</div>

                        {/* Respondents */}
                        <div className="mb-4">
                            {respondents.map((r, index) => (
                                <p key={`res - ${index} `} className="font-bold">
                                    {index + 1}. {r.name}
                                </p>
                            ))}
                            <p className="font-bold">... {respondents.length > 1 ? 'Respondents' : 'Respondent'}</p>
                        </div>

                        {/* Title */}
                        <div className="text-center font-bold text-lg my-6 uppercase">
                            {data.documentType}
                        </div>

                        {/* Body */}
                        <div className="space-y-4 text-justify leading-relaxed">
                            <p>
                                {petitioners.length > 1 ? "We" : "I"} {petitioners.map(p => p.name).join(', ')} {petitioners.length > 1 ? 'residents' : 'resident'} of:
                            </p>

                            {petitioners.map((p, index) => (
                                <p key={`det - ${index} `}>
                                    {index + 1}. {p.name}, aged {p.age || '___'} years,
                                    {p.fatherOrHusbandName && ` ${p.fatherOrHusbandName}, `} residing at {p.address || '___________'}
                                </p>
                            ))}

                            <p className="mt-4">
                                do hereby appoint and retain <strong>{data.advocateName}</strong> Advocate, {data.advocateAddress} to appear for {petitioners.length > 1 ? "us" : "me"} in the above suit, appeal or petition and to conduct and prosecute the same and all proceedings that may be taken in respect of any application for execution of any decree or order passed therein.
                            </p>

                            <p>
                                {petitioners.length > 1 ? "We" : "I"} empower the said Advocate/s to compromise, adjourn or withdraw the suit or proceeding on {petitioners.length > 1 ? "our" : "my"} behalf and to appear in all miscellaneous proceedings in the above suit or matter till all decrees or orders are fully satisfied or adjusted.
                            </p>

                            {data.witnesses && (
                                <div className="mt-6">
                                    <p className="font-bold">WITNESSES:</p>
                                    {data.witnesses.split(',').map((witness, index) => (
                                        <p key={`wit - ${index} `}>{index + 1}. {witness.trim()}</p>
                                    ))}
                                </div>
                            )}

                            {/* Signatures */}
                            <div className="mt-8 space-y-2">
                                <p>Date: _______________</p>
                                <p className="mt-6 font-bold">Signatures of Client(s):</p>
                                {petitioners.map((p, index) => (
                                    <div key={`sig - ${index} `} className="mt-4">
                                        <p>{index + 1}. _______________________</p>
                                        <p className="ml-4">({p.name})</p>
                                    </div>
                                ))}
                            </div>

                            {/* Acceptance */}
                            <div className="mt-12 text-center">
                                <p className="font-bold mb-4">ACCEPTANCE</p>
                                <p>I accept the above Vakalathnama.</p>
                                <div className="mt-8 text-left space-y-2">
                                    <p>Place: _______________</p>
                                    <p>Date: _______________</p>
                                    <p className="mt-6">Advocate's Signature: _______________________</p>
                                    <p>Name: {data.advocateName}</p>
                                    <p>Enrolment No.: {data.enrollmentNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
