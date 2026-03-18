import { useState, useRef } from "react";
import TextInput from "../components/TextInput";
import SentenceHeatmap from "../components/SentenceHeatmap";
import ScoreBadge from "../components/ScoreBadge";
import Loader from "../components/Loader";
import DownloadReport from "../components/DownloadReport";
import { analyzeText } from "../utils/api";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  const handleSubmit = async (text) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeText(text);
      setResult(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError("Failed to connect to the API. Make sure the backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const aiCount = result?.sentences.filter(s => s.score >= 0.65).length || 0;
  const humanCount = result?.sentences.filter(s => s.score < 0.35).length || 0;
  const uncertainCount = result?.sentences.filter(s => s.score >= 0.35 && s.score < 0.65).length || 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-emerald-500/20">G</div>
            <div>
              <span className="font-bold text-white text-sm">GhostWriter Guard</span>
              <span className="hidden md:inline text-gray-600 text-xs ml-2">AI Detection</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              API Live
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-medium">
              93.4% Accuracy
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full border border-gray-700 text-gray-400">
API:OK
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs mb-6 font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Sentence-Level AI Detection
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
            Detect AI-Written
            <br />
            <span className="text-emerald-400">Assignments</span>
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto mb-8">
            3-signal ML pipeline — GPT-2 Perplexity, Burstiness, and 8-feature Classifier.
            Color-coded sentence by sentence.
          </p>

          {/* Signals */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { label: "GPT-2 Perplexity", color: "blue" },
              { label: "Burstiness Score", color: "purple" },
              { label: "8-Feature Classifier", color: "emerald" },
              { label: "Fusion Engine", color: "amber" },
            ].map((s) => (
              <span key={s.label} className={`px-3 py-1 rounded-full text-xs border font-medium ${
                s.color === "blue" ? "border-blue-500/30 text-blue-400 bg-blue-500/5" :
                s.color === "purple" ? "border-purple-500/30 text-purple-400 bg-purple-500/5" :
                s.color === "amber" ? "border-amber-500/30 text-amber-400 bg-amber-500/5" :
                "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
              }`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Input Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur">
            <TextInput onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 px-6 border-y border-gray-800/40">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4 text-center">
          {[
            { value: "93.4%", label: "Accuracy" },
            { value: "8", label: "Features" },
            { value: "1.3M+", label: "Training Samples" },
            { value: "3", label: "Signals" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xl font-bold text-emerald-400">{stat.value}</p>
              <p className="text-xs text-gray-600 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="max-w-3xl mx-auto px-6">
          <Loader />
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <section ref={resultsRef} className="py-10 px-6">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Detection Results</h2>
                <p className="text-gray-600 text-xs mt-0.5">{result.sentences.length} sentences analyzed</p>
              </div>
              <div className="flex items-center gap-2">
                <DownloadReport result={result} />
                <button
                  onClick={() => setResult(null)}
                  className="text-xs text-gray-600 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Score + Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <ScoreBadge score={result.overall_score} />
              </div>
              <div className="md:col-span-3 grid grid-cols-3 gap-3">
                {[
                  { label: "AI Flagged", value: aiCount, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
                  { label: "Uncertain", value: uncertainCount, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
                  { label: "Human", value: humanCount, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                ].map((stat) => (
                  <div key={stat.label} className={`${stat.bg} border rounded-xl p-5 text-center`}>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    <p className="text-xs text-gray-700 mt-0.5">
                      {result.sentences.length > 0 ? Math.round((stat.value / result.sentences.length) * 100) : 0}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">📋 Analysis Summary</h3>
              <div className="space-y-2">
                {result.overall_score >= 0.65 && (
                  <p className="text-sm text-red-300">
                    🔴 <strong>High AI probability detected ({Math.round(result.overall_score * 100)}%).</strong> {aiCount} out of {result.sentences.length} sentences flagged as AI-generated. This text shows strong indicators of AI authorship including formal vocabulary patterns and uniform sentence structure.
                  </p>
                )}
                {result.overall_score >= 0.35 && result.overall_score < 0.65 && (
                  <p className="text-sm text-yellow-300">
                    🟡 <strong>Mixed signals detected ({Math.round(result.overall_score * 100)}%).</strong> {aiCount} AI sentences and {humanCount} human sentences found. This text may be partially AI-assisted or heavily edited.
                  </p>
                )}
                {result.overall_score < 0.35 && (
                  <p className="text-sm text-emerald-300">
                    🟢 <strong>Likely human-written ({Math.round(result.overall_score * 100)}%).</strong> {humanCount} out of {result.sentences.length} sentences show human writing patterns. Natural variation in sentence structure and casual language detected.
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  Model: 8-feature LogisticRegression · Accuracy: 93.4% · Signals: GPT-2 Perplexity + Burstiness + ML Classifier
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Human (0–35%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Uncertain (35–65%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> AI Generated (65–100%)</span>
            </div>

            {/* Heatmap */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <SentenceHeatmap sentences={result.sentences} />
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      {!result && !loading && (
        <section className="py-14 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-center mb-8 text-gray-400">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { step: "01", title: "Paste or Upload", desc: "Paste text directly or upload a PDF assignment", icon: "📄", color: "emerald" },
                { step: "02", title: "3-Signal Analysis", desc: "GPT-2 perplexity, burstiness, and 8-feature ML classifier", icon: "🔬", color: "blue" },
                { step: "03", title: "Get Results", desc: "Color-coded heatmap + downloadable forensic PDF report", icon: "📊", color: "purple" },
              ].map((item) => (
                <div key={item.step} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 relative overflow-hidden hover:border-gray-700 transition-colors">
                  <span className="absolute top-3 right-4 text-5xl opacity-5 font-black text-white">{item.step}</span>
                  <div className="text-xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-6 px-6 text-center">
        <p className="text-xs text-gray-700">
          GhostWriter Guard — AI Text Detection for Academic Integrity · Vishwakarma Institute of Technology, Pune
        </p>
      </footer>
    </div>
  );
}
