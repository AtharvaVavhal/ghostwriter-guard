import { useState, useRef } from "react";

const SAMPLES = [
  {
    label: "AI Text",
    color: "red",
    text: "The implementation of advanced machine learning algorithms has consequently revolutionized numerous sectors of modern industry. Furthermore, the integration of natural language processing technologies has subsequently enabled organizations to streamline their operational workflows with remarkable efficiency. Additionally, the systematic deployment of predictive analytics models has thereby facilitated more informed decision-making processes across diverse organizational hierarchies."
  },
  {
    label: "Human Text",
    color: "green",
    text: "I honestly wasn't sure what to write for this assignment at first. The topic seemed kinda boring when I read it, but then I started looking into it and actually found some really interesting stuff. My roommate thought I was crazy staying up until 2am reading about it, but I couldn't stop. I think that's the thing about research — you never know what you'll find."
  },
  {
    label: "Mixed Text",
    color: "yellow",
    text: "I was honestly surprised by the results. The implementation of advanced neural network architectures has consequently enabled unprecedented improvements in diagnostic accuracy. My friend told me about it last week, and I couldn't believe it at first. Furthermore, the systematic integration of machine learning frameworks has subsequently facilitated more efficient data processing workflows."
  }
];

export default function TextInput({ onSubmit, loading }) {
  const [text, setText] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = () => {
    if (text.trim().length < 10) return;
    onSubmit(text);
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;
    setFileName(file.name);
    setPdfLoading(true);
    setText("");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs", import.meta.url
      ).toString();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((item) => item.str).join(" ") + " ";
      }
      setText(fullText.trim());
    } catch (err) {
      alert("Failed to read PDF. Please try a different file.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText("");
    setFileName(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Sample Text Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-500 self-center">Try sample:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            onClick={() => { setText(s.text); setFileName(null); }}
            disabled={loading}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              s.color === "red" ? "border-red-500/30 text-red-400 hover:bg-red-500/10" :
              s.color === "green" ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" :
              "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* PDF Upload */}
      <div
        onClick={() => fileInputRef.current.click()}
        className="w-full p-3 rounded-xl border-2 border-dashed border-gray-700 hover:border-emerald-500 cursor-pointer transition-colors flex items-center justify-center gap-2 group"
      >
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePDFUpload} />
        {pdfLoading ? (
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            Extracting text from PDF...
          </div>
        ) : fileName ? (
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fileName} — text extracted!
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500 group-hover:text-emerald-400 text-xs transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload PDF — or paste text below
          </div>
        )}
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          className="w-full h-44 p-4 rounded-xl bg-gray-950 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none text-sm leading-relaxed transition-colors"
          placeholder="Paste assignment text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading || pdfLoading}
        />
        {/* Textarea actions */}
        {text && (
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all text-xs"
              title="Copy text"
            >
              {copied ? "✓" : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
              title="Clear text"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">{text.length} characters · {text.split(/\s+/).filter(Boolean).length} words</span>
        <button
          onClick={handleSubmit}
          disabled={loading || pdfLoading || text.trim().length < 10}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 disabled:text-gray-600 text-black font-semibold rounded-xl text-sm transition-all duration-200 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Analyze Text →"}
        </button>
      </div>
    </div>
  );
}
