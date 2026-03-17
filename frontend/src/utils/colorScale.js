/**
 * colorScale.js
 * Converts an AI probability score [0, 1] to an HSL color string.
 * 0.0 - 0.35 → Green  (Human)
 * 0.35 - 0.65 → Yellow (Uncertain)
 * 0.65 - 1.0 → Red    (AI)
 */

export function scoreToHSL(score) {
  if (score < 0.35) {
    const intensity = score / 0.35;
    return `hsl(120, ${60 + intensity * 20}%, ${40 + intensity * 5}%)`;
  } else if (score < 0.65) {
    const intensity = (score - 0.35) / 0.30;
    return `hsl(${60 - intensity * 15}, 90%, 50%)`;
  } else {
    const intensity = (score - 0.65) / 0.35;
    return `hsl(0, ${70 + intensity * 20}%, ${45 + intensity * 5}%)`;
  }
}

export function scoreToLabel(score) {
  if (score < 0.35) return "Human";
  if (score < 0.65) return "Uncertain";
  return "AI";
}

export function scoreToTextColor(score) {
  if (score < 0.35) return "text-emerald-400";
  if (score < 0.65) return "text-yellow-400";
  return "text-red-400";
}
