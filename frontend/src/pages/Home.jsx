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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👻</span>
            <div>
              <h1 className="text-lg font-bold text-white">GhostWriter Guard</h1>
              <p className="text-xs text-gray-500">AI Text Detection for Academic Integrity</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            API Connected
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Input */}
        <section>
          <h2 className="text-xl font-bold mb-2">Paste Assignment Text</h2>
          <p className="text-sm text-gray-400 mb-4">
            Our 3-signal ML pipeline will analyze each sentence for AI authorship.
          </p>
          <TextInput onSubmit={handleSubmit} loading={loading} />
        </section>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && <Loader />}

        {/* Results */}
        {result && !loading && (
          <section className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Results</h2>
              <div className="flex items-center gap-3">
                <DownloadReport result={result} />
                <button
                  onClick={() => setResult(null)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Clear ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <ScoreBadge score={result.overall_score} />
              </div>
              <div className="md:col-span-2 grid grid-cols-3 gap-3 content-start">
                <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center">
                  <p className="text-2xl font-bold text-white">{result.sentences.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Sentences</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center">
                  <p className="text-2xl font-bold text-red-400">
                    {result.sentences.filter(s => s.score >= 0.65).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">AI Flagged</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center">
                  <p className="text-2xl font-bold text-emerald-400">
                    {result.sentences.filter(s => s.score < 0.35).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Human</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Human (0–35%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Uncertain (35–65%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> AI (65–100%)</span>
            </div>

            <SentenceHeatmap sentences={result.sentences} />
          </section>
        )}
      </main>
    </div>
  );
}
