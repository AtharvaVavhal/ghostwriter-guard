export default function SentenceHeatmap({ sentences }) {
  const getConfig = (score) => {
    if (score < 0.35) return {
      bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
      border: "border-emerald-500/25",
      dot: "bg-emerald-400",
      bar: "bg-emerald-500",
      text: "text-emerald-400",
      label: "Human",
      badge: "bg-emerald-500/20 text-emerald-300"
    };
    if (score < 0.65) return {
      bg: "bg-yellow-500/10 hover:bg-yellow-500/15",
      border: "border-yellow-500/25",
      dot: "bg-yellow-400",
      bar: "bg-yellow-500",
      text: "text-yellow-400",
      label: "Uncertain",
      badge: "bg-yellow-500/20 text-yellow-300"
    };
    return {
      bg: "bg-red-500/10 hover:bg-red-500/15",
      border: "border-red-500/25",
      dot: "bg-red-400",
      bar: "bg-red-500",
      text: "text-red-400",
      label: "AI",
      badge: "bg-red-500/20 text-red-300"
    };
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Sentence Analysis
        </h3>
        <span className="text-xs text-gray-600">{sentences.length} sentences</span>
      </div>

      {sentences.map((item, idx) => {
        const config = getConfig(item.score);
        const percent = Math.round(item.score * 100);
        return (
          <div
            key={idx}
            className={`group p-4 rounded-xl border ${config.bg} ${config.border} transition-all duration-200`}
          >
            <div className="flex items-start gap-3">
              {/* Index + dot */}
              <div className="flex flex-col items-center gap-1.5 pt-0.5 shrink-0">
                <span className="text-xs text-gray-600 w-5 text-center">{idx + 1}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed text-gray-200 mb-3">{item.sentence}</p>

                {/* Confidence bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-800/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${config.bar} transition-all duration-700`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${config.text} shrink-0`}>
                    {percent}%
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${config.badge}`}>
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Copy button */}
              <button
                onClick={() => copyToClipboard(item.sentence)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-gray-700 text-gray-500 hover:text-gray-300 shrink-0"
                title="Copy"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
