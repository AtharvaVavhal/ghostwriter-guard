export default function ScoreBadge({ score }) {
  const percent = Math.round(score * 100);

  const getLabel = () => {
    if (score < 0.35) return "Likely Human";
    if (score < 0.65) return "Uncertain";
    return "Likely AI";
  };

  const getColor = () => {
    if (score < 0.35) return "text-emerald-400 border-emerald-500 bg-emerald-500/10";
    if (score < 0.65) return "text-yellow-400 border-yellow-500 bg-yellow-500/10";
    return "text-red-400 border-red-500 bg-red-500/10";
  };

  const getRingColor = () => {
    if (score < 0.35) return "#10b981";
    if (score < 0.65) return "#eab308";
    return "#ef4444";
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl border ${getColor()}`}>
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={getRingColor()} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{percent}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest">AI Probability</p>
        <p className="text-lg font-bold mt-1">{getLabel()}</p>
      </div>
    </div>
  );
}
