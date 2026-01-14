"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { VakalathFormValues } from "@/lib/vakalath-validators";
import { generatePDF } from "@/lib/generator-kerala-template";
import WordEditor from '@/components/WordEditor';
import { generateEditableHTML } from '@/lib/html-generator';
import BackButton from "@/components/BackButton";

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [data, setData] = useState<VakalathFormValues | null>(null);
    const [loading, setLoading] = useState(true);
    const [editableHTML, setEditableHTML] = useState('');
    const [includeDocket, setIncludeDocket] = useState(false);

    useEffect(() => {
        const fetchDraft = async () => {
            if (!id) return;

            // Check session storage first for performance
            const cached = sessionStorage.getItem(`draft_${id}`);
            if (cached) {
                const formData = JSON.parse(cached) as VakalathFormValues;
                setData(formData);
                setEditableHTML(generateEditableHTML(formData));
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, "drafts", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const formData = docSnap.data() as VakalathFormValues;
                    setData(formData);

                    // Generate editable HTML from form data
                    const html = generateEditableHTML(formData);
                    setEditableHTML(html);

                    // Cache for performance
                    sessionStorage.setItem(`draft_${id}`, JSON.stringify(formData));
                }
            } catch (error) {
                console.error("Error fetching draft:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDraft();
    }, [id]);

    const handleSaveChanges = async () => {
        if (!id || !data) return;

        try {
            await updateDoc(doc(db, "drafts", id), {
                ...data,
                editedContent: editableHTML,
                lastModified: new Date().toISOString(),
            });

            // Update cache
            sessionStorage.setItem(`draft_${id}`, JSON.stringify(data));

            return true;
        } catch (error) {
            console.error('Error saving:', error);
            throw error;
        }
    };

    const handleDownloadPDF = async () => {
        if (!data) return;

        try {
            // generatePDF returns Uint8Array
            const pdfBytes = await generatePDF(data);
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const firstPetitioner = data.parties.find(p =>
                p.role?.toLowerCase().includes('petitioner') ||
                p.role?.toLowerCase().includes('plaintiff') ||
                p.role?.toLowerCase().includes('complainant') ||
                p.role?.toLowerCase().includes('applicant')
            );

            link.download = `Vakalath_${firstPetitioner?.name || 'Document'}_${data.district}.pdf`;
            link.click();
            URL.revokeObjectURL(url);

            // Update status
            if (id) {
                await updateDoc(doc(db, "drafts", id), { status: "generated" });
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF');
        }
    };

    const handleDownloadDOCX = async () => {
        alert("DOCX generation currently unavailable in legacy preview");
        // if (!data) return;

        // try {
        //     const blob = await generateDOCX(data);
        //     const url = URL.createObjectURL(blob);
        //     const link = document.createElement('a');
        //     link.href = url;

        //     const firstPetitioner = data.parties.find(p =>
        //         p.role?.toLowerCase().includes('petitioner') ||
        //         p.role?.toLowerCase().includes('plaintiff') ||
        //         p.role?.toLowerCase().includes('complainant') ||
        //         p.role?.toLowerCase().includes('applicant')
        //     );

        //     link.download = `Vakalath_${firstPetitioner?.name || 'Document'}_${data.district}.docx`;
        //     link.click();
        //     URL.revokeObjectURL(url);

        //     // Update status
        //     if (id) {
        //         await updateDoc(doc(db, "drafts", id), { status: "generated" });
        //     }
        // } catch (error) {
        //     console.error('Error generating DOCX:', error);
        //     alert('Error generating DOCX');
        // }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <div className="text-lg text-gray-600">Loading document...</div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-4">Draft not found</div>
                    <BackButton />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            {data.documentType}
                        </h1>
                        <p className="text-sm text-gray-600">
                            {data.caseType} No. {data.caseNumber} of {data.year}
                        </p>
                    </div>
                </div>

                {/* Include Docket Option (District Courts only) */}
                {!data.courtName.toLowerCase().includes('high court') && (
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={includeDocket}
                            onChange={(e) => setIncludeDocket(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Include Docket Page
                    </label>
                )}
            </div>

            {/* Word Editor */}
            <div className="flex-1 overflow-hidden">
                <WordEditor
                    initialContent={editableHTML}
                    onSave={async (content) => {
                        setEditableHTML(content);
                        try {
                            await handleSaveChanges();
                            return true;
                        } catch (error) {
                            return false;
                        }
                    }}
                    onDownloadPDF={handleDownloadPDF}
                    onDownloadDOCX={handleDownloadDOCX}
                />
            </div>
        </div>
    );
}
