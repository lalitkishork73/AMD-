"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Logout() {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };
  return (
      <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left text-red-600 py-2 px-2 rounded-md hover:bg-red-100 transition">
      <LogOut className="w-4 h-4" /> Logout
    </button>
  );
}
