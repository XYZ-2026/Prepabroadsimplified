/** Adds the diagonal "SAMPLE REPORT" watermark to report HTML. Shared by the viewer and the sample PDFs. */
export function injectSampleWatermark(html: string): string {
  const watermarkCSS = `
    <style id="sample-watermark-styles">
      body { position: relative; }
      .as-report-page { position: relative; overflow: hidden; }
      .as-report-page::after {
        content: 'SAMPLE REPORT';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-35deg);
        font-size: 72px;
        font-weight: 900;
        font-family: 'Poppins', sans-serif;
        color: rgba(8, 15, 28, 0.06);
        letter-spacing: 12px;
        pointer-events: none;
        z-index: 999;
        white-space: nowrap;
        text-transform: uppercase;
        user-select: none;
      }
    </style>
  `;

  if (html.includes('</head>')) {
    return html.replace('</head>', watermarkCSS + '</head>');
  }
  return watermarkCSS + html;
}
