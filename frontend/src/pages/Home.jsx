import { useState } from "react";
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

  const handleSubmit = async (text) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeText(text);
      setResult(data);
    } catch (err) {
      setError("Failed to connect to the API. Make sure the backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">

      {/* ── Top Nav ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold text-black">G</div>
            <span className="font-semibold text-white tracking-tight">GhostWriter Guard</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              API Live
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
              95.75% Accuracy
            </span>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-8 animate-fade-in">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Academic Integrity Tool — 3-Signal ML Pipeline
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
            Detect AI-Written
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Assignments Instantly
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            Sentence-by-sentence AI detection using GPT-2 perplexity, burstiness analysis, and a trained ML classifier with 95.75% accuracy.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12 animate-slide-up" style={{animationDelay: '0.3s'}}>
            {[
              { value: "95.75%", label: "Accuracy" },
              { value: "3", label: "Signals" },
              { value: "1.3M+", label: "Trained Samples" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-white/3 border border-white/8 text-center">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Analyzer ───────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/8 bg-white/2 p-6 md:p-8 backdrop-blur animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Analysis Engine</h2>
            </div>
            <TextInput onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && <Loader />}

          {/* Results */}
          {result && !loading && (
            <div className="mt-6 space-y-6 animate-slide-up">

              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Detection Results</h2>
                </div>
                <div className="flex items-center gap-3">
                  <DownloadReport result={result} />
                  <button
                    onClick={() => setResult(null)}
                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                  >
                    Clear ✕
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
                    <div key={stat.label} className="p-5 rounded-xl bg-white/3 border border-white/8 flex flex-col justify-between">
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-2">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 px-1">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Human (0–35%)</span>
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Uncertain (35–65%)</span>
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> AI Generated (65–100%)</span>
              </div>

              {/* Sentence Heatmap */}
              <div className="rounded-2xl border border-white/8 bg-white/2 p-6">
                <SentenceHeatmap sentences={result.sentences} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      {!result && !loading && (
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-center text-xs font-semibold text-gray-600 uppercase tracking-widest mb-8">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "🧠", title: "GPT-2 Perplexity", desc: "Measures how predictable the text is. AI text has low perplexity — it's too perfect." },
                { icon: "📊", title: "Burstiness Score", desc: "Analyzes sentence length variation. Humans write unevenly; AI writes uniformly." },
                { icon: "🤖", title: "ML Classifier", desc: "LogisticRegression trained on 1.3M samples. Combines all signals for 95.75% accuracy." },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-xl border border-white/8 bg-white/2 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h4 className="font-semibold text-white text-sm mb-2">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/5 px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <span>© 2025 GhostWriter Guard — Academic Integrity Tool</span>
          <span>Built with FastAPI · React · GPT-2 · scikit-learn</span>
        </div>
      </footer>
    </div>
  );
}
