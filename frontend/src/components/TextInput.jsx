import { useState } from "react";

export default function TextInput({ onSubmit, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim().length < 10) return;
    onSubmit(text);
  };

  return (
    <div className="w-full">
      <textarea
        className="w-full h-48 p-4 rounded-xl bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none text-sm leading-relaxed transition-colors"
        placeholder="Paste assignment text here to check for AI authorship..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-500">{text.length} characters</span>
        <button
          onClick={handleSubmit}
          disabled={loading || text.trim().length < 10}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold rounded-lg text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Analyze Text →"}
        </button>
      </div>
    </div>
  );
}
