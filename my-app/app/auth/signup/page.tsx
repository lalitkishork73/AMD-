"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from 'next/navigation'
import Link from "next/link";

export default function SignupPage () {
    const router = useRouter(); 
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!form.name || !form.email || !form.password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await authClient.signUp.email({
                name: form.name,
                email: form.email,
                password: form.password,
                // image: "https://api.dicebear.com/6.x/initials/svg?seed=" + form.name,
                callbackURL: "/dashboard",
            },
        {
            onRequest:(ctx)=>{
            },
            onSuccess:(ctx)=>{
                router.push("/dashboard"); 
            },
            onError:(ctx)=>{
                setError(ctx.error.message || "Something went wrong");
            }
        });

            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md text-white shadow-2xl"
            >
                <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>

                {error && (
                    <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-500/20 text-green-200 p-3 rounded mb-4 text-sm text-center">
                        Account created successfully! Please check your email.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 bg-transparent border border-gray-500 rounded-lg focus:border-indigo-400 outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 bg-transparent border border-gray-500 rounded-lg focus:border-indigo-400 outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 bg-transparent border border-gray-500 rounded-lg focus:border-indigo-400 outline-none"
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition rounded-lg py-2 font-semibold text-white"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
                    </motion.button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-300">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-indigo-400 hover:underline">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
