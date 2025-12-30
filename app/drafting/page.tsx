"use client";

import Link from "next/link";
import { FileText, Gavel, Scale, Shield, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const DRAFTING_OPTIONS = [
    {
        id: "case-drafting",
        title: "Case Drafting",
        description: "Draft a new case from scratch.",
        icon: Gavel,
        href: "/case/new",
        disabled: true,
    },
    {
        id: "petition-drafting",
        title: "Petition Drafting",
        description: "Draft various types of petitions.",
        icon: FileText,
        href: "/petition/new",
        disabled: true,
    },
    {
        id: "written-statement",
        title: "Written Statement",
        description: "Draft a written statement for a case.",
        icon: FileText,
        href: "/ws/new",
        disabled: true,
    },
    {
        id: "caveat",
        title: "Caveat",
        description: "File a caveat to prevent ex-parte orders.",
        icon: AlertCircle,
        href: "/caveat/new",
        disabled: true,
    },
    {
        id: "vakalath",
        title: "Vakalath / Memo",
        description: "Create a Vakalathnama or Memo of Appearance.",
        icon: Scale,
        href: "/vakalath/new",
        disabled: false,
    },
];

export default function DraftingSelectionPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Start New Drafting
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Choose the type of document you want to draft.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {DRAFTING_OPTIONS.map((option) => (
                        <div
                            key={option.id}
                            className={cn(
                                "relative group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200",
                                option.disabled && "opacity-60 cursor-not-allowed grayscale-[0.5]"
                            )}
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className={cn(
                                    "p-3 rounded-lg",
                                    option.disabled ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600"
                                )}>
                                    <option.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {option.title}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">
                                {option.description}
                            </p>

                            {option.disabled ? (
                                <button disabled className="w-full py-2 px-4 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
                                    Coming Soon
                                </button>
                            ) : (
                                <Link
                                    href={option.href}
                                    className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Start Drafting
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
