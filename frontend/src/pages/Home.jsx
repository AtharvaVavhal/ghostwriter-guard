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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-sm">G</div>
            <span className="font-bold text-white">GhostWriter Guard</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              API Live
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              93.4% Accuracy
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            AI Detection for Academic Integrity
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Detect AI-Written
            <span className="text-emerald-400"> Assignments</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
            3-signal ML pipeline analyzes text sentence by sentence.
            GPT-2 Perplexity + Burstiness + 93.4% accurate classifier.
          </p>

          {/* Signal pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { label: "GPT-2 Perplexity", color: "blue" },
              { label: "Burstiness Score", color: "purple" },
              { label: "ML Classifier", color: "emerald" },
            ].map((s) => (
              <span key={s.label} className={`px-3 py-1 rounded-full text-xs border ${
                s.color === "blue" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                s.color === "purple" ? "border-purple-500/30 text-purple-400 bg-purple-500/10" :
                "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
              }`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Input Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <TextInput onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 px-6 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: "93.4%", label: "Model Accuracy" },
            { value: "8", label: "Detection Features" },
            { value: "1.3M+", label: "Training Samples" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-emerald-400">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
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
        <section ref={resultsRef} className="py-12 px-6">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Detection Results</h2>
                <p className="text-gray-500 text-sm mt-1">{result.sentences.length} sentences analyzed</p>
              </div>
              <div className="flex items-center gap-3">
                <DownloadReport result={result} />
                <button
                  onClick={() => setResult(null)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-600"
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
              <div className="md:col-span-3 grid grid-cols-3 gap-4">
                {[
                  { label: "Total Sentences", value: result.sentences.length, color: "text-white" },
                  { label: "AI Flagged", value: result.sentences.filter(s => s.score >= 0.65).length, color: "text-red-400" },
                  { label: "Human", value: result.sentences.filter(s => s.score < 0.35).length, color: "text-emerald-400" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Human (0–35%)</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Uncertain (35–65%)</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> AI Generated (65–100%)</span>
            </div>

            {/* Heatmap */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <SentenceHeatmap sentences={result.sentences} />
            </div>
          </div>
        </section>
      )}

      {/* How it works section */}
      {!result && !loading && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-10 text-gray-300">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Paste or Upload", desc: "Paste text directly or upload a PDF assignment file", icon: "📄" },
                { step: "02", title: "3-Signal Analysis", desc: "GPT-2 perplexity, burstiness scoring, and ML classifier run on each sentence", icon: "🔬" },
                { step: "03", title: "Get Results", desc: "See color-coded sentence heatmap and download a forensic PDF report", icon: "📊" },
              ].map((item) => (
                <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
                  <span className="absolute top-4 right-4 text-4xl opacity-10 font-bold text-gray-400">{item.step}</span>
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6 text-center">
        <p className="text-xs text-gray-600">
          GhostWriter Guard — Built by Team GhostWriter Guard, Vishwakarma Institute of Technology, Pune
        </p>
      </footer>
    </div>
  );
}
