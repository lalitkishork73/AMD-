"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    History,
    PhoneCall
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
    { name: "Calls", href: "/dashboard/calls", icon: PhoneCall },
    { name: "History", href: "/dashboard/history", icon: History },
];

export default function Sidebar () {
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-200 shadow-xl border-r border-slate-700 flex flex-col justify-between fixed">
            {/* ---- Header ---- */}
            <div className="p-6 ">
                <div className="flex items-center gap-2 mb-8">
                    <div className="h-10 w-10 bg-linear-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                        M
                    </div>
                    <h2 className="text-2xl font-semibold tracking-wide">AMD</h2>
                </div>

                {/* ---- Navigation ---- */}
                <div className="space-y-1 relative">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-lg relative overflow-hidden transition-all duration-200 ${isActive
                                        ? "text-white font-medium"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="activeIndicator"
                                        className="absolute inset-0 bg-linear-to-r from-indigo-600 to-blue-500 rounded-lg shadow-lg"
                                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                    />
                                )}
                                <span className="relative flex items-center gap-3 z-10">
                                    <Icon className="w-5 h-5" />
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

         
        </div>
    );
}
