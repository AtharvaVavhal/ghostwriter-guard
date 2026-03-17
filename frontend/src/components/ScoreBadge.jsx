export default function ScoreBadge({ score }) {
  const percent = Math.round(score * 100);

  const getConfig = () => {
    if (score < 0.35) return {
      label: "Likely Human",
      sublabel: "Low AI probability",
      ring: "#10b981",
      bg: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      icon: "✓"
    };
    if (score < 0.65) return {
      label: "Uncertain",
      sublabel: "Mixed signals detected",
      ring: "#eab308",
      bg: "from-yellow-500/20 to-yellow-500/5",
      border: "border-yellow-500/30",
      text: "text-yellow-400",
      badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      icon: "?"
    };
    return {
      label: "Likely AI",
      sublabel: "High AI probability",
      ring: "#ef4444",
      bg: "from-red-500/20 to-red-500/5",
      border: "border-red-500/30",
      text: "text-red-400",
      badge: "bg-red-500/20 text-red-300 border-red-500/30",
      icon: "!"
    };
  };

  const config = getConfig();
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={`relative p-6 rounded-2xl border ${config.border} bg-gradient-to-br ${config.bg} overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5"
        style={{ background: config.ring, filter: "blur(20px)" }} />

      {/* Ring */}
      <div className="flex justify-center mb-4">
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={config.ring} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${config.text}`}>{percent}%</span>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="text-center space-y-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.badge}`}>
          <span>{config.icon}</span>
          {config.label}
        </span>
        <p className="text-xs text-gray-500">{config.sublabel}</p>
      </div>

      {/* AI Probability label */}
      <div className="mt-3 pt-3 border-t border-white/5 text-center">
        <p className="text-xs text-gray-600 uppercase tracking-widest">AI Probability</p>
      </div>
    </div>
  );
}
