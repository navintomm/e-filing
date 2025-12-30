"use client";

import Link from "next/link";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut, FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar({ user }: { user: User }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <nav className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                                Vakalath Portal
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-4 text-sm text-gray-500 hidden sm:block">{user.email}</span>
                        <Link
                            href="/dashboard/profile"
                            className="mr-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
