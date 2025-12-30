"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vakalathFormSchema, VakalathFormValues } from "@/lib/validators";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, FileText, Users, Scale, AlertCircle, Save, Shield, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Components
import { BasicDetails } from "@/components/vakalath/BasicDetails";
import { PartyDetails } from "@/components/vakalath/PartyDetails";
import { AdvocateDetails } from "@/components/vakalath/AdvocateDetails";
import { PreviewModal } from "@/components/vakalath/PreviewModal";
import BackButton from "@/components/BackButton";

const STEPS = [
    { id: "basic", title: "Basic Details", icon: FileText, description: "Case status and category" },
    { id: "party", title: "Party Details", icon: Users, description: "Petitioner and Respondent details" },
    { id: "advocate", title: "Advocate Details", icon: Shield, description: "Advocate information" },
];

export default function NewVakalathPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [fontFamily, setFontFamily] = useState('serif');

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<VakalathFormValues>({
        resolver: zodResolver(vakalathFormSchema) as any,
        defaultValues: {
            // Basic values
            documentType: "Vakalathnama", // Updated default
            courtName: "HIGH COURT OF KERALA",
            caseType: "WP(C)",
            district: "",
            partySignature: "Yes",
            caseNumber: "",
            year: new Date().getFullYear().toString(),
            includeDocket: false,

            // Arrays
            parties: [],

            // Advocate Details
            advocateName: "",
            enrollmentNumber: "",
            advocateAddress: "",
            advocateMobile: "",
        },
    });

    const onSubmit = async (data: VakalathFormValues) => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            console.log('💾 Saving draft (offline persistence enabled)...');

            // NO TIMEOUT! Firestore offline persistence handles everything
            const docRef = await addDoc(collection(db, "drafts"), {
                ...data,
                userId: user.uid,
                status: "draft",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                draftType: "vakalath",
            });

            console.log("✅ Saved! ID:", docRef.id);
            sessionStorage.setItem(`draft_${docRef.id}`, JSON.stringify({ ...data, id: docRef.id }));
            localStorage.setItem(`draft_backup_${docRef.id}`, JSON.stringify({
                ...data,
                id: docRef.id,
                savedAt: new Date().toISOString()
            }));

            alert(`✅ Draft saved!\n\nID: ${docRef.id}`);
            router.push(`/vakalath/preview?id=${docRef.id}`);
        } catch (error: any) {
            console.error("❌ Error:", error);

            // Save locally as fallback
            const localId = `local_${Date.now()}`;
            localStorage.setItem(`draft_${localId}`, JSON.stringify({
                ...data,
                id: localId,
                isLocal: true,
                savedAt: new Date().toISOString(),
                userId: user.uid
            }));

            alert(`✅ Saved locally!\n\nID: ${localId}\n\nWill sync when online.`);
            router.push(`/vakalath/preview?id=${localId}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = async () => {
        let fieldsToValidate: any[] = [];

        switch (activeStep) {
            case 0:
                fieldsToValidate = [
                    "documentType",
                    "courtName",
                    "caseType",
                    "district",
                    "caseNumber",
                    "year",
                    "partySignature"
                ];
                break;
            case 1:
                fieldsToValidate = ["parties"];
                break;
            case 2:
                fieldsToValidate = [
                    "advocateName",
                    "enrollmentNumber",
                    "advocateAddress",
                    "advocateMobile"
                ];
                break;
        }

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid && activeStep < STEPS.length - 1) {
            setActiveStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10 transition-all duration-300 ease-in-out">
                <div className="p-6 border-b border-gray-100">
                    <BackButton text="Back to Dashboard" />
                    <h2 className="text-lg font-bold text-gray-900 mt-4">EF-DCK-2025-0245258</h2>
                    <p className="text-xs text-gray-500 mt-1">New e-filing draft</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {STEPS.map((step, index) => {
                        const isActive = activeStep === index;
                        const isCompleted = activeStep > index;

                        return (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(index)}
                                className={cn(
                                    "w-full flex items-start p-3 rounded-lg text-left transition-colors",
                                    isActive ? "bg-blue-50 border-l-4 border-blue-600 shadow-sm" : "hover:bg-gray-50 border-l-4 border-transparent"
                                )}
                            >
                                <div className={cn(
                                    "mt-0.5 mr-3 flex-shrink-0",
                                    isActive ? "text-blue-600" : "text-gray-400"
                                )}>
                                    {isCompleted ? <Check className="w-5 h-5 text-green-500" /> : <step.icon className="w-5 h-5" />}
                                </div>
                                <div>
                                    <span className={cn(
                                        "block text-sm font-medium",
                                        isActive ? "text-blue-900" : "text-gray-700"
                                    )}>
                                        {step.title}
                                    </span>
                                    <span className="block text-xs text-gray-500 mt-0.5 line-clamp-1">
                                        {step.description}
                                    </span>
                                </div>
                            </button>
                        );
                    })}

                    {/* Preview Button - Right after Advocate Details step */}
                    {activeStep === 2 && (
                        <div className="px-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowPreview(true)}
                                className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-blue-700 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
                            >
                                <Eye className="mr-2 w-5 h-5" />
                                Preview Document
                            </button>
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : "Save Draft"}
                        <Save className="ml-2 w-4 h-4" />
                    </button>
                </div>
            </aside>

            {/* Mobile Header (visible only on small screens) */}
            <div className="md:hidden w-full bg-white border-b border-gray-200 p-4 fixed top-16 z-20 flex overflow-x-auto gap-4">
                {STEPS.map((step, index) => (
                    <button
                        key={step.id}
                        onClick={() => setActiveStep(index)}
                        className={cn(
                            "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border",
                            activeStep === index ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"
                        )}
                    >
                        {step.title}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-5xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 min-h-[600px]">
                        <div className="mb-6 pb-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{STEPS[activeStep].title}</h1>
                                <p className="text-sm text-gray-500 mt-1">{STEPS[activeStep].description}</p>
                            </div>
                            <div className="text-sm text-gray-400">
                                Step {activeStep + 1} of {STEPS.length}
                            </div>
                        </div>

                        {/* Configurable Render based on Step */}
                        <div className={activeStep === 0 ? "block" : "hidden"}>
                            <BasicDetails register={register} control={control} errors={errors} setValue={setValue} watch={watch} />
                        </div>
                        <div className={activeStep === 1 ? "block" : "hidden"}>
                            <PartyDetails register={register} control={control} errors={errors} />
                        </div>
                        <div className={activeStep === 2 ? "block" : "hidden"}>
                            <AdvocateDetails register={register} control={control} errors={errors} setValue={setValue} watch={watch} />
                        </div>
                    </div>

                    {/* Navigation Buttons for Content Area */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={activeStep === 0}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>

                        <div className="flex gap-4">
                            {activeStep === STEPS.length - 1 ? (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Draft"}
                                    <Check className="ml-2 w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                                >
                                    Next Step
                                    <ChevronRight className="ml-2 w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </main>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                data={watch()}
                fontSize={fontSize}
                setFontSize={setFontSize}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
            />
        </div>
    );
}
