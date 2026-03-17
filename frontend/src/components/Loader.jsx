import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("Tokenizing sentences...");

  const steps = [
    "Tokenizing sentences...",
    "Running GPT-2 perplexity...",
    "Computing burstiness score...",
    "Running ML classifier...",
    "Fusing signals...",
    "Generating results...",
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 12 + 3;
      if (current > 95) current = 95;
      setProgress(Math.round(current));
      setStep(steps[Math.min(Math.floor(current / 18), steps.length - 1)]);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-gray-800" />
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-gray-400 animate-pulse">{step}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center text-xs text-gray-600">{progress}% complete</p>
    </div>
  );
}
