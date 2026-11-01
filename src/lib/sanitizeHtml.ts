/**
 * Helper to sanitize HTML content from CMS / external editors:
 * - Fixes character encoding and Mojibake artifacts
 * - Strips and converts broken LaTeX images to KaTeX delimiters ($...$)
 * - Normalizes Greek symbols
 * - Neutralizes script tags and inline event handlers for safe rendering
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return "";
  let cleaned = html;

  // 1. Remove dangerous script and iframe tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  // 2. Remove inline event handlers (onload, onerror, onclick, etc.)
  cleaned = cleaned.replace(/\son\w+="[^"]*"/gi, "");
  cleaned = cleaned.replace(/\son\w+='[^']*'/gi, "");
  cleaned = cleaned.replace(/href="javascript:[^"]*"/gi, 'href="#"');

  // 3. Convert LaTeX formula images to KaTeX $...$ syntax
  cleaned = cleaned.replace(
    /<img[^>]+src="[^"]*(?:latex|artofproblemsolving|codecogs)[^"]*"[^>]*alt="([^"]+)"[^>]*>/gi,
    (_match, altText) => {
      const decodedAlt = altText
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"');
      return ` $${decodedAlt}$ `;
    }
  );

  cleaned = cleaned.replace(
    /<img[^>]+alt="([^"]+)"[^>]+src="[^"]*(?:latex|artofproblemsolving|codecogs)[^"]*"[^>]*>/gi,
    (_match, altText) => {
      const decodedAlt = altText
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"');
      return ` $${decodedAlt}$ `;
    }
  );

  // 4. Remove any remaining broken LaTeX image tags
  cleaned = cleaned.replace(/<img[^>]+src="[^"]*(?:latex|artofproblemsolving|codecogs)[^"]*"[^>]*>/gi, "");

  // 5. Replace escaped characters like \* and \_ with * and _
  cleaned = cleaned.replace(/\\([*_])/g, "$1");

  // 6. Replace LaTeX greek symbols with unicode characters
  const greekMap: Record<string, string> = {
    "\\alpha": "α",
    "\\beta": "β",
    "\\gamma": "γ",
    "\\delta": "δ",
    "\\epsilon": "ε",
    "\\zeta": "ζ",
    "\\eta": "η",
    "\\theta": "θ",
    "\\iota": "ι",
    "\\kappa": "κ",
    "\\lambda": "λ",
    "\\mu": "μ",
    "\\nu": "ν",
    "\\xi": "ξ",
    "\\pi": "π",
    "\\rho": "ρ",
    "\\sigma": "σ",
    "\\tau": "τ",
    "\\upsilon": "υ",
    "\\phi": "φ",
    "\\chi": "χ",
    "\\psi": "ψ",
    "\\omega": "ω",
    "\\Sigma": "Σ",
    "\\Delta": "Δ",
    "\\Theta": "Θ",
    "\\Lambda": "Λ",
    "\\Xi": "Ξ",
    "\\Pi": "Π",
    "\\Phi": "Φ",
    "\\Psi": "Ψ",
    "\\Omega": "Ω",
  };

  Object.entries(greekMap).forEach(([command, unicode]) => {
    const escapedCommand = command.replace(/\\/g, "\\\\");
    const regex = new RegExp(escapedCommand + "(?![a-zA-Z])", "g");
    cleaned = cleaned.replace(regex, unicode);
  });

  // 7. Sanitize Mojibake artifacts
  cleaned = cleaned
    .replace(/â€”/g, "&mdash;")
    .replace(/â€“/g, "&ndash;")
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/\uFFFD/g, " ");

  return cleaned;
};
