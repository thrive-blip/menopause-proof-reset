import html2pdf from "html2pdf.js";

// One-click PDF download (no print dialog). Captures a DOM element and saves it
// as an A4 PDF. Elements with class "pdf-keep" are not split across page breaks.
// margin is in mm: the report passes 0 (its blocks carry their own padding so the
// teal cover/dividers bleed to the edge); other screens default to 12.
export function downloadPdf(el: HTMLElement, filename: string, margin = 12): Promise<void> {
  const opt = {
    margin,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 1.7, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"], before: [".rpt-break"], avoid: [".pdf-keep"] },
  };
  return html2pdf().set(opt as Record<string, unknown>).from(el).save();
}
