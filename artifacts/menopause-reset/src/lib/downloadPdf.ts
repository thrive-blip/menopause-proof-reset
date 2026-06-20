import html2pdf from "html2pdf.js";

// One-click PDF download (no print dialog). Captures a DOM element and saves it
// as an A4 PDF. Elements with class "pdf-keep" are not split across page breaks.
export function downloadPdf(el: HTMLElement, filename: string): Promise<void> {
  const opt = {
    margin: 0, // full-bleed: the teal cover + dividers run to the page edge; content blocks carry their own padding
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 1.7, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"], before: [".rpt-break"], avoid: [".pdf-keep"] },
  };
  return html2pdf().set(opt as Record<string, unknown>).from(el).save();
}
