"use client";

import Link from "next/link";
import { Plus, FileText, Calendar, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

interface Draft {
    id: string;
    courtName: string;
    caseType: string;
    petitionerName: string;
    respondentName: string;
    status: "draft" | "generated";
    createdAt: any;
}

// Skeleton component for loading state
const DraftSkeleton = () => (
    <li className="animate-pulse">
        <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded-full w-20"></div>
            </div>
            <div className="mt-2">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
        </div>
    </li>
);

export default function DashboardPage() {
    const { user } = useAuth();
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDrafts = async () => {
            if (!user) return;

            try {
                // Check cache first (5 min expiry)
                const cached = localStorage.getItem('drafts_cache');
                const cacheTime = localStorage.getItem('drafts_cache_time');

                if (cached && cacheTime) {
                    const now = Date.now();
                    const cacheAge = now - parseInt(cacheTime);

                    if (cacheAge < 5 * 60 * 1000) { // 5 minutes
                        setDrafts(JSON.parse(cached));
                        setLoading(false);
                        return; // Use cache
                    }
                }

                // Fetch from Firestore (no timeout - offline persistence enabled!)
                console.log('📥 Loading drafts from Firestore...');

                const querySnapshot = await getDocs(
                    query(
                        collection(db, "drafts"),
                        where("userId", "==", user.uid),
                        limit(20)
                    )
                );

                const draftsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Draft[];

                // Sort client-side
                draftsData.sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                    return dateB.getTime() - dateA.getTime();
                });

                setDrafts(draftsData);

                // Update cache
                localStorage.setItem('drafts_cache', JSON.stringify(draftsData));
                localStorage.setItem('drafts_cache_time', Date.now().toString());

                console.log(`✅ Loaded ${draftsData.length} drafts`);
            } catch (error: any) {
                console.error("❌ Error loading drafts:", error);

                // Don't show error if we have cache
                const cached = localStorage.getItem('drafts_cache');
                if (cached) {
                    setDrafts(JSON.parse(cached));
                    setError("Using cached drafts. Will refresh when online.");
                } else {
                    setError("Failed to load drafts. Please check your connection.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDrafts();
    }, [user]);

    return (
        <div className="px-4 py-6 sm:px-0">
            {/* Logo - Centered and Enlarged */}
            <div className="mb-8 flex justify-center animate-fadeInUp">
                <img
                    src="/logo.png"
                    alt="Rones & Das Associates"
                    className="h-48 w-auto"
                />
            </div>

            <div className="flex items-center justify-between mb-8 animate-fadeInUp">
                <div>
                    <h1 className="section-header text-3xl">Your Drafts</h1>
                    <p className="section-subheader mt-1">
                        Manage your Vakalathnama drafts and generated documents.
                    </p>
                </div>
                <Link
                    href="/vakalath/new"
                    className="btn-legal-primary inline-flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Start Drafting
                </Link>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm text-red-600 underline"
                    >
                        Refresh now
                    </button>
                </div>
            )}

            {loading ? (
                <div className="premium-card overflow-hidden">
                    <ul role="list" className="divide-y divide-slate-200">
                        {[1, 2, 3].map((i) => (
                            <DraftSkeleton key={i} />
                        ))}
                    </ul>
                </div>
            ) : drafts.length === 0 ? (
                <div className="glass-container text-center py-16 animate-fadeInUp">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
                        <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No drafts yet</h3>
                    <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                        Get started by creating your first Vakalathnama draft.
                    </p>
                    <Link
                        href="/vakalath/new"
                        className="btn-legal-primary inline-flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create First Draft
                    </Link>
                </div>
            ) : (
                <div className="premium-card overflow-hidden">
                    <ul role="list" className="divide-y divide-slate-200">
                        {drafts.map((draft, index) => (
                            <li
                                key={draft.id}
                                className="hover:bg-blue-50/50 transition-colors"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Link href={`/vakalath/preview?id=${draft.id}`} className="block">
                                    <div className="px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-base font-semibold text-blue-600 hover:text-blue-700">
                                                {draft.courtName} - {draft.caseType}
                                            </p>
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${draft.status === "generated"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-amber-100 text-amber-700"
                                                    }`}
                                            >
                                                {draft.status === "generated" ? "✓ Generated" : "⏳ Draft"}
                                            </span>
                                        </div>
                                        <div className="mt-3 sm:flex sm:justify-between items-center">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <FileText className="mr-2 h-4 w-4 text-slate-400" />
                                                {draft.petitionerName || "N/A"} vs {draft.respondentName || "N/A"}
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                                                <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                                                {draft.createdAt?.toDate
                                                    ? new Date(draft.createdAt.toDate()).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })
                                                    : "Unknown"}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {drafts.length === 20 && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
                            <p className="text-sm text-slate-600">
                                Showing recent 20 drafts
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
