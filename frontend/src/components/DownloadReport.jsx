import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { scoreToLabel } from "../utils/colorScale";

export default function DownloadReport({ result, targetRef }) {
  const generating = useRef(false);

  const handleDownload = async () => {
    if (generating.current) return;
    generating.current = true;

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let y = 20;

    // ── Header ──────────────────────────────────────────────
    pdf.setFillColor(17, 24, 39);
    pdf.rect(0, 0, pageWidth, 35, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("GhostWriter Guard", margin, 15);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(156, 163, 175);
    pdf.text("AI Text Detection Report", margin, 22);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, 28);

    y = 45;

    // ── Overall Score ────────────────────────────────────────
    const percent = Math.round(result.overall_score * 100);
    const label = scoreToLabel(result.overall_score);

    // Score box
    const scoreColor = result.overall_score < 0.35
      ? [16, 185, 129]
      : result.overall_score < 0.65
      ? [234, 179, 8]
      : [239, 68, 68];

    pdf.setFillColor(...scoreColor);
    pdf.roundedRect(margin, y, 50, 25, 3, 3, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${percent}%`, margin + 10, y + 14);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("AI Probability", margin + 10, y + 21);

    // Label box
    pdf.setFillColor(31, 41, 55);
    pdf.roundedRect(margin + 55, y, 50, 25, 3, 3, "F");
    pdf.setTextColor(...scoreColor);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(label, margin + 65, y + 12);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(156, 163, 175);
    pdf.text("Verdict", margin + 65, y + 19);

    // Stats boxes
    const stats = [
      { label: "Sentences", value: result.sentences.length, color: [255, 255, 255] },
      { label: "AI Flagged", value: result.sentences.filter(s => s.score >= 0.65).length, color: [239, 68, 68] },
      { label: "Human", value: result.sentences.filter(s => s.score < 0.35).length, color: [16, 185, 129] },
    ];

    stats.forEach((stat, i) => {
      const x = margin + 115 + i * 27;
      pdf.setFillColor(31, 41, 55);
      pdf.roundedRect(x, y, 24, 25, 3, 3, "F");
      pdf.setTextColor(...stat.color);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(stat.value), x + 7, y + 12);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(156, 163, 175);
      pdf.text(stat.label, x + 2, y + 20);
    });

    y += 35;

    // ── Divider ──────────────────────────────────────────────
    pdf.setDrawColor(55, 65, 81);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;

    // ── Sentence Analysis ─────────────────────────────────────
    pdf.setTextColor(156, 163, 175);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text("SENTENCE ANALYSIS", margin, y);
    y += 6;

    result.sentences.forEach((item, idx) => {
      const sentPercent = Math.round(item.score * 100);
      const sentLabel = scoreToLabel(item.score);
      const color = item.score < 0.35
        ? [16, 185, 129]
        : item.score < 0.65
        ? [234, 179, 8]
        : [239, 68, 68];

      // Check page overflow
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }

      // Row background
      pdf.setFillColor(31, 41, 55);
      pdf.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, "F");

      // Color dot
      pdf.setFillColor(...color);
      pdf.circle(margin + 4, y + 8, 2, "F");

      // Sentence number
      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${idx + 1}.`, margin + 8, y + 9);

      // Sentence text (truncated)
      const maxWidth = pageWidth - margin * 2 - 40;
      const truncated = item.sentence.length > 120
        ? item.sentence.substring(0, 120) + "..."
        : item.sentence;

      pdf.setTextColor(229, 231, 235);
      pdf.setFontSize(7.5);
      pdf.text(truncated, margin + 14, y + 9, { maxWidth: maxWidth - 14 });

      // Score badge
      pdf.setFillColor(...color);
      pdf.roundedRect(pageWidth - margin - 22, y + 3, 20, 10, 2, 2, "F");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${sentPercent}% ${sentLabel}`, pageWidth - margin - 21, y + 10);

      y += 19;
    });

    y += 5;

    // ── Footer ────────────────────────────────────────────────
    if (y > 265) {
      pdf.addPage();
      y = 20;
    }
    pdf.setDrawColor(55, 65, 81);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 5;
    pdf.setTextColor(107, 114, 128);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text("GhostWriter Guard — AI Text Detection for Academic Integrity", margin, y);
    pdf.text(`Model Accuracy: 95.75% | 3-Signal Pipeline: GPT-2 Perplexity + Burstiness + ML Classifier`, margin, y + 4);

    pdf.save(`ghostwriter-report-${Date.now()}.pdf`);
    generating.current = false;
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 text-gray-200 text-sm font-medium rounded-lg transition-all duration-200"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download PDF Report
    </button>
  );
}
