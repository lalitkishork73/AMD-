"use client";

import { useState } from "react";
import { User, ChevronDown } from "lucide-react";
import SignOut from "./Logout";

export default function Navbar ({ user }: { readonly user: any }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center justify-between bg-white border-b px-6 py-3 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

            <div className="relative">
                <button
                    title="button"
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition"
                >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                        <div className="px-4 py-3 border-b">
                            <p className="font-medium text-gray-800">{user?.name || "Guest User"}</p>
                            <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
                        </div>

                        <div className="px-2 py-1 hover:bg-red-50">
                            <SignOut />
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden logout trigger to reuse your SignOut logic */}
            
        </div>
    );
}
