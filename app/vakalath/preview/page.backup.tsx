"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { VakalathFormValues } from "@/lib/validators";
import { generatePDF, generateDOCX } from "@/lib/generator";
import { FileDown, Printer, Edit, Share2, Type, Edit2, FileText, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [data, setData] = useState<VakalathFormValues | null>(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(14);
    const [fontFamily, setFontFamily] = useState('serif');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [includeDocket, setIncludeDocket] = useState(false); // Docket option for District Courts
    const router = useRouter();

    useEffect(() => {
        const fetchDraft = async () => {
            if (!id) return;

            // Optimization: Check session storage first
            const cached = sessionStorage.getItem(`draft_${id}`);
            if (cached) {
                setData(JSON.parse(cached));
                setLoading(false);
                // Optional: Still fetch in background to ensure freshness, but UI is valid immediately
                return;
            }

            try {
                const docRef = doc(db, "drafts", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(docSnap.data() as VakalathFormValues);
                } else {
                    // Handle not found
                }
            } catch (error) {
                console.error("Error fetching draft:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDraft();
    }, [id]);

    const handleDownloadPDF = async () => {
        if (!data) return;
        try {
            // Create a modified data object with includeDocket option
            const dataWithDocket = { ...data, includeDocket };

            const pdfBytes = await generatePDF(dataWithDocket);
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const firstPetitioner = data.parties.find(p =>
                p.role?.toLowerCase().includes('petitioner') ||
                p.role?.toLowerCase().includes('plaintiff') ||
                p.role?.toLowerCase().includes('complainant') ||
                p.role?.toLowerCase().includes('applicant')
            );
            link.download = `Vakalath_${firstPetitioner?.name || 'Client'}_${data.district}_${data.courtName.replace(/\s+/g, '_')}.pdf`;
            link.click();

            // Update status
            if (id) {
                await updateDoc(doc(db, "drafts", id), { status: "generated" });
            }
        } catch (e) {
            console.error(e);
            alert("Error generating PDF");
        }
    };

    const handleDownloadDOCX = async () => {
        if (!data) return;
        try {
            const blob = await generateDOCX(data);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const firstPetitioner = data.parties.find(p =>
                p.role?.toLowerCase().includes('petitioner') ||
                p.role?.toLowerCase().includes('plaintiff') ||
                p.role?.toLowerCase().includes('complainant') ||
                p.role?.toLowerCase().includes('applicant')
            );
            link.download = `Vakalath_${firstPetitioner?.name || 'Client'}_${data.district}_${data.courtName.replace(/\s+/g, '_')}.docx`;
            link.click();

            // Update status
            if (id) {
                await updateDoc(doc(db, "drafts", id), { status: "generated" });
            }
        } catch (e) {
            console.error(e);
            alert("Error generating DOCX");
        }
    };

    const handleOpenInGoogleDocs = async () => {
        if (!data) return;
        try {
            const { createVakalathInGoogleDocs } = await import('@/lib/vakalath-google-docs');

            const result = await createVakalathInGoogleDocs(data);

            if (result.success && result.documentUrl) {
                // Open the document
                window.open(result.documentUrl, '_blank');

                alert(`✅ Document created in Google Docs!\n\nDocument: ${result.documentTitle}\n${result.folderName ? `Folder: ${result.folderName}` : ''}\n\nThe document is now open for editing with proper Kerala court formatting.`);

                // Update status
                if (id) {
                    await updateDoc(doc(db, "drafts", id), { status: "generated" });
                }
            } else {
                throw new Error(result.error || 'Failed to create Google Doc');
            }
        } catch (e: any) {
            console.error(e);
            alert(`Error creating Google Doc: ${e.message}\n\nTip: Make sure you've authorized the app and Google Docs API is enabled.`);
        }
    };

    const handleSaveChanges = async () => {
        if (!id || !data) return;

        setIsSaving(true);
        try {
            // Get the editable content
            const editableDiv = document.getElementById('editable-content');
            if (editableDiv) {
                // Update the data with edited content
                await updateDoc(doc(db, "drafts", id), {
                    editedContent: editableDiv.innerHTML,
                    lastEdited: new Date().toISOString()
                });

                alert('✅ Changes saved successfully!');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('❌ Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading preview...</div></div>;
    if (!data) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Draft not found.</div></div>;

    const petitioners = data.parties.filter(p =>
        p.role?.toLowerCase().includes('petitioner') ||
        p.role?.toLowerCase().includes('plaintiff') ||
        p.role?.toLowerCase().includes('complainant') ||
        p.role?.toLowerCase().includes('applicant')
    );
    const respondents = data.parties.filter(p =>
        p.role?.toLowerCase().includes('respondent') ||
        p.role?.toLowerCase().includes('defendant') ||
        p.role?.toLowerCase().includes('opposite')
    );

    const isPluralPetitioner = petitioners.length > 1;
    const pronoun = isPluralPetitioner ? "We" : "I";

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            {/* Enhanced Toolbar */}
            <div className="max-w-6xl mx-auto mb-6 bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <BackButton />
                            <h3 className="text-xl font-semibold text-gray-900">Vakalath Preview</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Font Size Controls */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border">
                                <Type className="w-4 h-4 text-gray-500" />
                                <button
                                    onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                                    className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                                >
                                    A-
                                </button>
                                <span className="text-sm font-medium min-w-[40px] text-center">{fontSize}px</span>
                                <button
                                    onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                                    className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                                >
                                    A+
                                </button>
                            </div>

                            {/* Font Family Selector */}
                            <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="serif">Times New Roman</option>
                                <option value="sans-serif">Arial</option>
                                <option value="monospace">Courier New</option>
                                <option value="Georgia">Georgia</option>
                                <option value="'Trebuchet MS'">Trebuchet MS</option>
                            </select>

                            {/* Docket Toggle - Only for District Courts */}
                            {!data.courtName.toLowerCase().includes('high court') && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border">
                                    <input
                                        id="includeDocket"
                                        type="checkbox"
                                        checked={includeDocket}
                                        onChange={(e) => setIncludeDocket(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="includeDocket" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        Include Docket Page
                                    </label>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-500 shadow-sm transition-colors"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit Document
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSaveChanges}
                                        disabled={isSaving}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-500 shadow-sm transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="inline-flex items-center px-4 py-2 bg-slate-500 text-white text-sm font-medium rounded-lg hover:bg-slate-400 shadow-sm transition-colors"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </button>
                                </>
                            )}

                            <button
                                onClick={handleDownloadPDF}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 shadow-sm transition-colors"
                            >
                                <FileDown className="w-4 h-4 mr-2" />
                                PDF
                            </button>

                            <button
                                onClick={handleDownloadDOCX}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 shadow-sm transition-colors"
                                title="Download DOCX file to edit in Google Docs or Microsoft Word"
                            >
                                <FileDown className="w-4 h-4 mr-2" />
                                DOCX
                            </button>

                            <button
                                onClick={handleOpenInGoogleDocs}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-500 shadow-sm transition-colors"
                                title="Upload to Google Drive and open in Google Docs for editing"
                            >
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.01 1.988c-.59 0-1.173.11-1.72.314L1.169 6.825c-.75.302-1.169.917-1.169 1.583v7.183c0 .667.42 1.282 1.169 1.584l9.121 3.523c1.065.411 2.286.411 3.352 0l9.12-3.523c.75-.302 1.17-.917 1.17-1.584V8.408c0-.666-.42-1.281-1.17-1.583l-9.12-3.523c-.548-.204-1.131-.314-1.721-.314zm0 3.957l7.362 2.842-3.318 1.282-7.362-2.843 3.318-1.281zm-9.042 3.488l7.362 2.843v6.929l-7.362-2.842V9.433zm18.084 0v6.93l-7.362 2.842v-6.929l7.362-2.843z" />
                                </svg>
                                Open in Google Docs
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Content */}
            <div className="max-w-6xl mx-auto bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div
                        id="editable-content"
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        className={`border p-8 rounded-md bg-gray-50 text-gray-900 leading-relaxed max-w-3xl mx-auto shadow-sm min-h-[500px] ${isEditing ? 'ring-4 ring-amber-400 cursor-text' : ''}`}
                        style={{ fontSize: `${fontSize}px`, fontFamily }}>
                        {/* HTML Preview matching PDF structure */}
                        <div className="text-center font-bold mb-4">
                            <p className="uppercase">BEFORE THE COURT OF {data.courtName} {data.district}</p>
                            <p className="mt-4">{data.caseType} No. {data.caseNumber || '_______'} of {data.year || '20__'}</p>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between font-bold">
                                <div className="flex flex-col">
                                    {data.parties.filter(p =>
                                        p.role?.toLowerCase().includes('petitioner') ||
                                        p.role?.toLowerCase().includes('plaintiff') ||
                                        p.role?.toLowerCase().includes('complainant') ||
                                        p.role?.toLowerCase().includes('applicant')
                                    ).map((p, i) => (
                                        <span key={i}>{i + 1}. {p.name}</span>
                                    ))}
                                </div>
                                <span>- Plaintiff/Petitioner(s)</span>
                            </div>
                            <div className="text-center my-2">And</div>
                            <div className="flex justify-between font-bold">
                                <div className="flex flex-col">
                                    {data.parties.filter(p =>
                                        p.role?.toLowerCase().includes('respondent') ||
                                        p.role?.toLowerCase().includes('defendant') ||
                                        p.role?.toLowerCase().includes('opposite')
                                    ).map((p, i) => (
                                        <span key={i}>{i + 1}. {p.name}</span>
                                    ))}
                                </div>
                                <span>- Defendant/Respondent(s)</span>
                            </div>
                        </div>

                        <div className="text-center font-bold mb-4 mt-8 text-lg uppercase tracking-wide">
                            {data.documentType === "Memo of Appearance" ? "MEMO OF APPEARANCE" : "VAKALATHNAMA"}
                        </div>

                        <div className="text-justify mb-8 space-y-4">
                            <p>
                                {pronoun} {petitioners.map(p => p.name).join(', ')} {isPluralPetitioner ? 'residents' : 'resident'} of:
                            </p>
                            {petitioners.map((p, i) => (
                                <p key={i} className="pl-4">
                                    {i + 1}. {p.name}, {p.age && `aged ${p.age},`} {p.fatherOrHusbandName && `${p.fatherOrHusbandName},`} residing at {p.address || '...'}
                                </p>
                            ))}
                            <p>
                                do hereby appoint and retain <strong>{data.advocateName}</strong> Advocate to appear for me/us in the above suit, appeal or petition and to conduct and prosecute or defend the same and all proceedings that may be taken in respect of any application for execution of any decree or order passed therein. I/we empower the said Advocate/s to compromise any suit or proceeding on my/our behalf and to appear in all miscellaneous proceedings in the above suit or matter till all decrees or orders are fully satisfied or adjusted and to produce in court my money document or valuable security on my/our behalf to apply on or for their return and to receive back the same, to apply or obtain copy of all documents in the record of the proceeding, to draw any moneys that may be payable to me/us in the above suit or matter. I/We do further empower the said advocate/s to file any appeal reference or revision on any decree or order passed in the above suit or matter and to accept on my/our behalf service of notice of all or any appeal or petitions filed in any court of appeal, reference or revision with regard to the said suit or matter before the disposal of the same in the Honorable Court and I/we do hereby agree that everything lawfully done or made by the said advocate/s in the conduct of suit or matter shall be valid and binding on me/us as if done by me/us in person.
                            </p>

                        </div>

                        <div className="mt-12">
                            <p>Signed this the {new Date().getDate()} day of {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
                        </div>

                        <div className="mt-16">
                            <p className="font-bold mb-8">Witnesses:</p>
                            <div className="flex justify-between">
                                <div className="space-y-4">
                                    <p>1. __________________</p>
                                    <p>2. __________________</p>
                                </div>
                                <div className="font-bold">Signature of Executant</div>
                            </div>
                        </div>

                        <div className="text-center font-bold mt-12">Accepted</div>

                        <div className="text-center mt-12">
                            <p className="font-bold">{data.advocateName}</p>
                            <p>Roll No: {data.enrollmentNumber}</p>
                            <p>{data.advocateAddress}</p>
                            <p>Mob: {data.advocateMobile}</p>
                        </div>

                        <div className="text-center font-bold text-sm mt-8">Address for service of summons</div>
                    </div>

                    <div className="mt-8 flex justify-center gap-4">
                        <button
                            onClick={handleDownloadPDF}
                            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            <FileDown className="-ml-0.5 mr-2 h-4 w-4" />
                            Download PDF
                        </button>
                        <button
                            onClick={handleDownloadDOCX}
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            <FileDown className="-ml-0.5 mr-2 h-4 w-4" />
                            Download DOCX
                        </button>
                    </div>
                </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="max-w-6xl mx-auto mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-800">
                            <strong>LEGAL DISCLAIMER:</strong> This document is system-generated based on inputs provided.
                            Final verification and filing responsibility rests with the Advocate.
                            This software is not affiliated with any court.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
