"use client";

import { useEffect, useState } from "react";
import { PhoneCall, Loader2, Delete } from "lucide-react";

export default function CallsPage() {
  const [formData, setFormData] = useState({ number: "", strategy: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const strategies = [
    { label: "Twilio AMD", value: "twilio" },
    { label: "Jambonz", value: "jambonz" },
    { label: "Hugging Face", value: "huggingface" },
    { label: "Gemini", value: "gemini" },
  ];

  const dialPad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  const handleDial = (digit: string) =>
    setFormData((prev) => ({ ...prev, number: prev.number + digit }));

  const handleDelete = () =>
    setFormData((prev) => ({ ...prev, number: prev.number.slice(0, -1) }));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, strategy: e.target.value }));

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.number || !formData.strategy) {
      setMessage("❗ Please fill all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/dial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetNumber: formData.number,
          strategy: formData.strategy,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to initiate call");
      }

      setMessage(`📞 Call initiated successfully using ${formData.strategy}!`);
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Error: ${err.message || "Something went wrong."}`);
    } finally {
      setLoading(false);
    }
  };

  // 🎹 Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;

      if (/[0-9*#]/.test(key)) {
        setActiveKey(key);
        handleDial(key);
        setTimeout(() => setActiveKey(null), 150);
      } else if (key === "Backspace") {
        handleDelete();
      } else if (key === "Enter") {
        handleSubmit();
      }
    };

    globalThis.addEventListener("keydown", handleKeyPress);
    return () => globalThis.removeEventListener("keydown", handleKeyPress);
  });

  return (
    <div className="p-6 h-full bg-linear-to-b from-gray-50 to-blue-50 flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 tracking-tight">
        Smart Dialer
      </h1>

      <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg border border-gray-200 transition-all">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Number Display */}
          <div className="flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3 shadow-inner border border-gray-200 transition-all">
            <span
              className={`text-2xl font-mono text-gray-800 truncate ${
                formData.number
                  ? "animate-pulse text-blue-700"
                  : "text-gray-500"
              }`}
            >
              {formData.number || "Enter Number.."}
            </span>
            {formData.number && (
              <button
                title="button"
                type="button"
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <Delete className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-green-400 text-sm">Example: 919876543210</p>

          {/* Dial Pad */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {dialPad.map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDial(digit)}
                className={`text-lg font-semibold rounded-xl py-3 transition-all duration-150 shadow-sm active:scale-95 ${
                  activeKey === digit
                    ? "bg-blue-600 text-white scale-95"
                    : "bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600"
                }`}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Strategy Dropdown */}
          <div>
            <label
              htmlFor="strategy-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Strategy
            </label>
            <select
              id="strategy-select"
              title="select"
              name="strategy"
              value={formData.strategy}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="">-- Choose Strategy --</option>
              {strategies.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-white text-base font-medium transition-all shadow-md active:scale-95 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Dialing...
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" /> Dial Now
                </>
              )}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mt-2 text-center text-sm font-medium ${
                message.startsWith("📞") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
