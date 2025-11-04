"use client";
import { useEffect, useState } from "react";

export default function CallsPage () {
    const [calls, setCalls] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [strategy, setStrategy] = useState("ALL");
    const [status, setStatus] = useState("ALL");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [loading, setLoading] = useState(false);
    const [debounced, setDebounced] = useState("");

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(search), 500);
        return () => clearTimeout(handler);
    }, [search]);

    const fetchCalls = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: "5",
                search: debounced,
                strategy,
                status,
                ...(dateRange.start && { startDate: dateRange.start }),
                ...(dateRange.end && { endDate: dateRange.end }),
            });

            const res = await fetch(`/api/calls?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setCalls(data.data.items);
                setTotal(data.data.total);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalls();
    }, [page, debounced, strategy, status, dateRange]);

    const totalPages = Math.ceil(total / 5);

    const strategies = ["ALL", "TWILIO_NATIVE", "JAMBONZ", "HUGGINGFACE", "GEMINI"];
    const statuses = ["ALL", "HUMAN", "MACHINE", "FAILED", "QUEUED", "ANSWERED"];

    return (
        <div className="p-6 bg-gray-50  text-gray-500">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">📞 Call History</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6 items-center">
                {/* Search */}
                <input
                    type="text"
                    placeholder="🔍 Search number..."
                    className="border border-gray-300 rounded-lg px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Strategy Filter */}
                <select
                    title="select"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                    {strategies.map((s) => (
                        <option key={s} value={s}>
                            {s.replace("_", " ")}
                        </option>
                    ))}
                </select>

                {/* Status Filter */}
                <select
                    title="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                {/* Date Filter */}
                <div className="flex items-center gap-2">
                    <label htmlFor="start-date" className="text-gray-600 text-sm">From:</label>
                    <input
                        type="date"
                        id="start-date"
                        className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    />
                    <label htmlFor="end-date" className="text-gray-600 text-sm">To:</label>
                    <input
                        type="date"
                        id="end-date"
                        className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-indigo-100 text-indigo-800">
                        <tr>
                            <th className="py-3 px-4 text-left">Number</th>
                            <th className="py-3 px-4 text-left">Strategy</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Result</th>
                            <th className="py-3 px-4 text-left">Latency</th>
                            <th className="py-3 px-4 text-left">Cost</th>
                            <th className="py-3 px-4 text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            if (loading) {
                                return (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-500">
                                            Loading calls...
                                        </td>
                                    </tr>
                                );
                            }

                            if (calls.length === 0) {
                                return (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-400">
                                            No calls found.
                                        </td>
                                    </tr>
                                );
                            }

                            return calls.map((call:any) => {
                                let statusClass = "text-gray-700";
                                if (call.status === "HUMAN") {
                                    statusClass = "text-green-600";
                                } else if (call.status === "FAILED") {
                                    statusClass = "text-red-600";
                                } else if (call.status === "MACHINE") {
                                    statusClass = "text-yellow-600";
                                }

                                return (
                                    <tr
                                        key={call.id}
                                        className="border-t hover:bg-indigo-50 transition duration-150 ease-in-out"
                                    >
                                        <td className="px-4 py-3">{call.number}</td>
                                        <td className="px-4 py-3">{call.strategy}</td>
                                        <td className={`px-4 py-3 font-medium ${statusClass}`}>
                                            {call.status}
                                        </td>
                                        <td className="px-4 py-3 capitalize">{call.result}</td>
                                        <td className="px-4 py-3">{call.latency}</td>
                                        <td className="px-4 py-3">{call.cost ?? "-"}</td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(call.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            });
                        })()}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <p className="text-gray-600 text-sm">
                    Page {page} of {totalPages || 1}
                </p>
                <div className="flex gap-3">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600  disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
