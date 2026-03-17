export default function SentenceHeatmap({ sentences }) {
  const getColor = (score) => {
    if (score < 0.35) return "bg-emerald-500/20 border-emerald-500/40 text-emerald-100";
    if (score < 0.65) return "bg-yellow-500/20 border-yellow-500/40 text-yellow-100";
    return "bg-red-500/20 border-red-500/40 text-red-100";
  };

  const getLabel = (score) => {
    if (score < 0.35) return "Human";
    if (score < 0.65) return "Uncertain";
    return "AI";
  };

  const getDot = (score) => {
    if (score < 0.35) return "bg-emerald-400";
    if (score < 0.65) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="w-full space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
        Sentence Analysis
      </h3>
      {sentences.map((item, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-3 p-4 rounded-xl border ${getColor(item.score)} transition-all`}
        >
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getDot(item.score)}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed">{item.sentence}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs font-bold">{Math.round(item.score * 100)}%</p>
            <p className="text-xs opacity-70">{getLabel(item.score)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
