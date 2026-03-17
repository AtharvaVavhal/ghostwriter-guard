import { useState, useRef } from "react";

export default function TextInput({ onSubmit, loading }) {
  const [text, setText] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
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
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url
      ).toString();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        fullText += pageText + " ";
      }

      setText(fullText.trim());
    } catch (err) {
      console.error(err);
      alert("Failed to read PDF. Please try a different file.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* PDF Upload Area */}
      <div
        onClick={() => fileInputRef.current.click()}
        className="w-full mb-3 p-4 rounded-xl border-2 border-dashed border-gray-700 hover:border-emerald-500 cursor-pointer transition-colors flex items-center justify-center gap-3 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handlePDFUpload}
        />
        {pdfLoading ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            Extracting text from PDF...
          </div>
        ) : fileName ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fileName} — text extracted!
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500 group-hover:text-emerald-400 text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload PDF assignment — or paste text below
          </div>
        )}
      </div>

      {/* Text Area */}
      <textarea
        className="w-full h-48 p-4 rounded-xl bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none text-sm leading-relaxed transition-colors"
        placeholder="Paste assignment text here to check for AI authorship..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading || pdfLoading}
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-500">{text.length} characters</span>
        <button
          onClick={handleSubmit}
          disabled={loading || pdfLoading || text.trim().length < 10}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold rounded-lg text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Analyze Text →"}
        </button>
      </div>
    </div>
  );
}
