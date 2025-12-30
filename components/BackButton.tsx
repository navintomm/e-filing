"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    text?: string;
    fallbackUrl?: string;
}

export default function BackButton({ text = "Back", fallbackUrl = "/dashboard" }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        // Try to go back in history
        if (window.history.length > 1) {
            router.back();
        } else {
            // Fallback to dashboard if no history
            router.push(fallbackUrl);
        }
    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow"
        >
            <ArrowLeft className="w-4 h-4" />
            {text}
        </button>
    );
}
