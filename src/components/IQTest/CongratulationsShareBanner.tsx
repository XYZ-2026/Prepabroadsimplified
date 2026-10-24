'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  X as CloseIcon,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

interface CongratulationsShareBannerProps {
  candidateName: string;
  estimatedIQ: number;
  percentile: number;
  cognitiveBand: string;
  cognitivePersona: string;
  strongestDomain: string;
  resultId: string;
}

// Grammatically correct ordinal helper (1st, 2nd, 3rd, 4th, 21st, 22nd, 23rd, 97th)
export function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// Brand SVG Icons for pixel-perfect social representations
const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.39 9.74v-8.37H5.07v8.37h2.78Z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.3Z" />
  </svg>
);

const XTwitterIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

export default function CongratulationsShareBanner({
  candidateName,
  estimatedIQ,
  percentile,
  cognitiveBand,
  cognitivePersona,
  strongestDomain,
  resultId,
}: CongratulationsShareBannerProps) {
  const [copied, setCopied] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copyingImage, setCopyingImage] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const ordinal = getOrdinalSuffix(percentile);

  // Dynamic public share URL and image asset URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://clarvo.in';
  const shareUrl = `${origin}/iq-test/result/${resultId}`;
  const shareImageUrl = `/api/iq-test/share-image?resultId=${resultId}`;

  // Formatted captions for each platform
  const linkedInPostText = `🎓 Excited to share that I just completed the Standardized 45-Item Cognitive Assessment by Clarvo Center for Cognitive Sciences!

🧠 Estimated IQ Score: ${estimatedIQ} (${percentile}${ordinal} Percentile)
🏆 Cognitive Classification: ${cognitiveBand}
✨ Cognitive Persona: ${cognitivePersona}
🎯 Primary Strength: ${strongestDomain}

Take the assessment and explore your cognitive roadmap:
${shareUrl}

#Clarvo #CognitiveScience #IQAssessment #ProblemSolving #StudentDevelopment`;

  const whatsAppMessage = `🧠 *Clarvo Cognitive Assessment Result*
I just completed the 45-item standardized cognitive assessment!

• *Estimated IQ Score*: ${estimatedIQ} (${percentile}${ordinal} Percentile)
• *Classification*: ${cognitiveBand}
• *Cognitive Persona*: ${cognitivePersona}
• *Primary Strength*: ${strongestDomain}

Check your cognitive profile here:
${shareUrl}`;

  const twitterText = `🧠 I just completed the Standardized Cognitive Assessment on Clarvo! Scored ${estimatedIQ} (${percentile}${ordinal} percentile) — Persona: "${cognitivePersona}". Explore your cognitive profile:`;

  const instagramCaption = `🧠 Standardized Cognitive Assessment by Clarvo Center for Cognitive Sciences
  
Estimated IQ Score: ${estimatedIQ}
Performance Rank: ${percentile}${ordinal} Percentile (${cognitiveBand})
Cognitive Persona: ${cognitivePersona}
Strongest Domain: ${strongestDomain}

Assess your problem-solving and spatial reasoning profile at Clarvo!
Link: ${shareUrl}

#Clarvo #CognitiveAssessment #IQScore #CognitiveProfile #ProblemSolving #Achievement`;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Download the high-definition achievement card image
  const handleDownloadCardImage = async () => {
    setDownloadingImage(true);
    try {
      const response = await fetch(shareImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${candidateName.replace(/[^a-zA-Z0-9]/g, '_')}_Cognitive_Score_Card.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      triggerToast('Achievement card image downloaded!');
    } catch (err) {
      console.error('Download error:', err);
      triggerToast('Failed to download image. Opening image directly...');
      window.open(shareImageUrl, '_blank');
    } finally {
      setDownloadingImage(false);
    }
  };

  // 2. 1-Click Copy Image directly to clipboard (for pasting in LinkedIn, Twitter, Slack, WhatsApp Web)
  const handleCopyImageToClipboard = async () => {
    setCopyingImage(true);
    try {
      const response = await fetch(shareImageUrl);
      const blob = await response.blob();
      
      // Modern Clipboard API: write image PNG blob to clipboard
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedImage(true);
        triggerToast('Image copied to clipboard! You can paste (Ctrl+V) directly into your post.');
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        triggerToast('Direct image copy not supported on this browser. Downloading image...');
        handleDownloadCardImage();
      }
    } catch (err) {
      console.error('Clipboard image error:', err);
      triggerToast('Could not copy image. Downloading image instead...');
      handleDownloadCardImage();
    } finally {
      setCopyingImage(false);
    }
  };

  // 3. LinkedIn Sharing Handler
  const handleShareLinkedIn = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(linkedInPostText).catch(() => {});
    }
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInPostText)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    triggerToast('LinkedIn opened! The link automatically displays your score card in the post preview.');
  };

  // 4. WhatsApp Sharing Handler
  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsAppMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    triggerToast('Redirecting to WhatsApp! Your score card image will preview with the link.');
  };

  // 5. X / Twitter Sharing Handler
  const handleShareTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}&hashtags=Clarvo,CognitiveAssessment,IQ`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    triggerToast('Redirecting to X! The tweet automatically attaches your score card preview.');
  };

  // 6. Instagram / Mobile Native Share (attaches real image file if on mobile)
  const handleShareInstagramOrMobile = async () => {
    // If mobile native share with files is supported, attach the real image file
    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        const response = await fetch(shareImageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'Cognitive_Achievement_Card.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Clarvo Cognitive Score: IQ ${estimatedIQ}`,
            text: instagramCaption,
            files: [file],
          });
          return;
        }
      } catch (err) {
        // Fallback to modal
      }
    }

    // Desktop or fallback: Open Modal with Image Preview, 1-Click Copy Image & Download
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(instagramCaption);
    }
    setShowShareModal(true);
  };

  // 7. Direct Copy Link Handler
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(whatsAppMessage);
        setCopied(true);
        triggerToast('Achievement summary & link copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      triggerToast('Could not access clipboard.');
    }
  };

  return (
    <>
      {/* ── CONGRATULATIONS & ACHIEVEMENT HERO BANNER ── */}
      <section className="bg-gradient-to-br from-[#080F1C] via-[#0D1B36] to-[#1E3A8A] rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-2xl shadow-blue-900/15 mb-8 relative overflow-hidden border border-blue-900/40">
        
        {/* Subtle Ambient Light Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 md:gap-8">
          
          {/* Top Section: Congratulations Announcement */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] font-extrabold text-[#38BDF8] tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Cognitive Evaluation Certified
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight mb-2.5">
                🎉 Congratulations, {candidateName}!
              </h1>

              <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed font-medium">
                You have officially completed all 45 standardized items of the <strong className="text-white">Clarvo Cognitive Assessment</strong>. Before reviewing your comprehensive 5-domain psychometric breakdown below, share your score card image and certified achievement with your network!
              </p>
            </div>

            {/* Live Highlight Stat Badges */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 self-start lg:self-center shadow-lg">
              <div className="px-3 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Estimated IQ</span>
                <span className="text-4xl font-display font-extrabold text-white leading-tight">{estimatedIQ}</span>
              </div>
              <div className="h-10 w-px bg-white/20 hidden sm:block" />
              <div className="px-3 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Percentile</span>
                <span className="text-base font-extrabold text-amber-300 block leading-tight">{percentile}{ordinal}</span>
                <span className="text-[10px] text-blue-200 font-medium">Top {Math.max(1, 100 - percentile)}% Nationally</span>
              </div>
              <div className="h-10 w-px bg-white/20 hidden sm:block" />
              <div className="px-3 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Classification</span>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-md inline-block mt-0.5">
                  {cognitiveBand}
                </span>
              </div>
            </div>

          </div>

          {/* Social Media Sharing Action Row */}
          <div className="pt-6 border-t border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-[#38BDF8] flex items-center justify-center shrink-0 shadow-inner">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  Share Your Score Card &amp; Achievement
                </span>
                <span className="text-[11px] text-blue-200/80 font-medium">
                  Posts automatically include your verified certificate image card:
                </span>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              
              {/* 1. LinkedIn */}
              <button
                onClick={handleShareLinkedIn}
                className="px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                title="Post to LinkedIn with description and card image"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </button>

              {/* 2. WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                title="Share to WhatsApp contact, group, or status with preview card"
              >
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </button>

              {/* 3. X / Twitter */}
              <button
                onClick={handleShareTwitter}
                className="px-3.5 py-2.5 rounded-xl bg-black hover:bg-slate-900 border border-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                title="Tweet on X with score card preview"
              >
                <XTwitterIcon />
                <span>Post</span>
              </button>

              {/* 4. Instagram / Image Share */}
              <button
                onClick={handleShareInstagramOrMobile}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                title="Share image to Instagram Story or Feed"
              >
                <InstagramIcon />
                <span>Instagram</span>
              </button>

              {/* 5. Download Card Image */}
              <button
                onClick={handleDownloadCardImage}
                disabled={downloadingImage}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Download verified score card image (.png)"
              >
                <Download className="w-4 h-4 text-cyan-300" />
                <span>{downloadingImage ? 'Saving...' : 'Score Card'}</span>
              </button>

              {/* 6. Copy Summary Link */}
              <button
                onClick={handleCopyLink}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border ${
                  copied 
                    ? 'bg-emerald-600 border-emerald-500 text-white' 
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
                title="Copy shareable achievement link & caption"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#080F1C] text-white border border-blue-500/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── INTERACTIVE SHARE & IMAGE MODAL ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            >
              <CloseIcon className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white flex items-center justify-center shadow-md shrink-0">
                <InstagramIcon />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E1306C] block">
                  Social Achievement Card
                </span>
                <h3 className="text-lg font-display font-bold text-slate-900">
                  Share Your Verified Score Card
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
              When sharing on <strong>LinkedIn &amp; WhatsApp</strong>, this visual score card automatically appears in the post preview! For <strong>Instagram</strong>, download or copy the card image below to attach directly to your Story or Feed:
            </p>

            {/* Live Visual Card Image Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md mb-4 bg-[#080F1C] relative group">
              <img 
                src={shareImageUrl} 
                alt="Clarvo Cognitive Score Achievement Card" 
                className="w-full h-auto object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={handleDownloadCardImage}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#2563EB]" />
                  Download Image
                </button>
                <button
                  onClick={handleCopyImageToClipboard}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-[#1D4ED8] transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedImage ? 'Copied!' : 'Copy Image'}
                </button>
              </div>
            </div>

            {/* Action Bar for Card Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              <button
                onClick={handleDownloadCardImage}
                disabled={downloadingImage}
                className="py-2.5 px-4 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingImage ? 'Downloading...' : 'Download Image (.png)'}</span>
              </button>

              <button
                onClick={handleCopyImageToClipboard}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {copiedImage ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <ImageIcon className="w-4 h-4 text-slate-500" />}
                <span>{copiedImage ? 'Image Copied to Clipboard!' : 'Copy Image to Clipboard'}</span>
              </button>
            </div>

            {/* Copied Caption Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                <span>Formatted Post Caption</span>
                <span className="text-emerald-600 flex items-center gap-1 font-extrabold"><Check className="w-3 h-3" /> Caption Ready</span>
              </div>
              <p className="text-[11px] text-slate-700 font-mono line-clamp-3 leading-relaxed">
                {instagramCaption}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-xs font-bold text-center shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(instagramCaption);
                  triggerToast('Caption re-copied to clipboard!');
                }}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Re-copy Caption</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
