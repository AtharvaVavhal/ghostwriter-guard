export default function SentenceHeatmap({ sentences }) {
  const getColor = (score) => {
    if (score < 0.35) return "bg-emerald-500/15 border-emerald-500/40";
    if (score < 0.65) return "bg-yellow-500/15 border-yellow-500/40";
    return "bg-red-500/15 border-red-500/40";
  };

  const getDot = (score) => {
    if (score < 0.35) return "bg-emerald-400";
    if (score < 0.65) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getLabel = (score) => {
    if (score < 0.35) return "Human";
    if (score < 0.65) return "Uncertain";
    return "AI";
  };

  const getTextColor = (score) => {
    if (score < 0.35) return "text-emerald-400";
    if (score < 0.65) return "text-yellow-400";
    return "text-red-400";
  };

  const getMeterColor = (score) => {
    if (score < 0.35) return "bg-emerald-500";
    if (score < 0.65) return "bg-yellow-500";
    return "bg-red-500";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
        Sentence Analysis
      </h3>
      {sentences.map((item, idx) => (
        <div
          key={idx}
          className={`group p-4 rounded-xl border ${getColor(item.score)} transition-all hover:scale-[1.005]`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xs text-gray-600 mt-0.5 w-5 shrink-0">{idx + 1}.</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed text-gray-200">{item.sentence}</p>

              {/* Confidence Meter */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 bg-gray-800 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getMeterColor(item.score)}`}
                    style={{ width: `${Math.round(item.score * 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${getTextColor(item.score)} w-16 text-right`}>
                  {Math.round(item.score * 100)}% {getLabel(item.score)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <div className={`w-2 h-2 rounded-full ${getDot(item.score)}`} />
              <button
                onClick={() => copyToClipboard(item.sentence)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-gray-700 text-gray-500 hover:text-gray-300"
                title="Copy sentence"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
