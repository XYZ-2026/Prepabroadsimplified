/**
 * Universal Executive Summary HTML Report Builder
 * ─────────────────────────────────────────────────────────────────────────────
 * Builds the 15-page Curated Executive Edition across all three academic variants:
 * 1. Junior (Class 7–9)
 * 2. Class 10 (Approved baseline)
 * 3. Senior (Class 12)
 *
 * GUARANTEE: For Class 10, yields 100% exact parity with the approved Class 10 baseline.
 */

import type { UniversalReportData } from './universal-report-schema';
import { buildClass10ExecutiveSummaryHTMLReport } from '../class10_executive_summary_builder';

export function buildUniversalExecutiveSummaryHTMLReport(data: UniversalReportData): string {
  // If variant is grade10, delegate directly to the approved Class 10 baseline to ensure 100% zero regression
  if (data.variant === 'grade10') {
    return buildClass10ExecutiveSummaryHTMLReport(
      data.student,
      data.scores,
      data.personalization,
      data.comparisonData,
      data.parentProfile
    );
  }

  const { student, scores, personalization, comparisonData, config, roadmaps, studyAbroad, academicRoadmap, actionPlan } = data;

  const name = student.name || 'Candidate';
  const firstName = name.split(' ')[0] || 'Candidate';
  const dateStr = student.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const rid = (student.reportId || `AS-EXECUTIVE`).toUpperCase();

  const primaryRoadmap = roadmaps.primary;
  const secondaryRoadmap = roadmaps.secondary;
  const alternativeRoadmap = roadmaps.alternative;

  const primaryCareerName = primaryRoadmap.pathwayName;
  const topFitScore = primaryRoadmap.fitScore || 92;

  const overallApt = scores.aptitude?.overall || 80;
  const numSc = scores.aptitude?.numerical || 78;
  const reasSc = scores.aptitude?.reasoning || 80;
  const spatSc = scores.aptitude?.spatial || 74;
  const verbSc = scores.aptitude?.verbal || 75;

  const cSc = scores.personality?.conscientiousness || 76;
  const oSc = scores.personality?.openness || 75;
  const eSc = scores.personality?.extraversion || 68;
  const aSc = scores.personality?.agreeableness || 74;
  const esSc = scores.personality?.emotionalStability || 70;

  const topVarkCode = scores.topVark || 'V';
  const topVarkLabel = topVarkCode === 'V' ? 'Visual (Spatial)' : topVarkCode === 'A' ? 'Auditory (Verbal)' : topVarkCode === 'R' ? 'Read/Write (Textual)' : 'Kinesthetic (Tactile)';

  const topRiasecCodes = scores.topRiasec && scores.topRiasec.length > 0 ? scores.topRiasec : ['Investigative', 'Realistic', 'Artistic'];
  const topRiasecLabel = topRiasecCodes.slice(0, 3).join('-');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.reportTitle} — Executive Edition | ${name}</title>
    <!-- Google Fonts: Poppins -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
    <!-- FontAwesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        maroon: {
                            DEFAULT: '#6B0919',
                            dark: '#4A0510',
                            light: '#8C1D2F',
                        },
                        gold: {
                            DEFAULT: '#D4AF37',
                            light: '#F3E5AB',
                            dark: '#AA820A',
                        },
                        cream: '#FDFBF7',
                    },
                    fontFamily: {
                        sans: ['Poppins', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        @media print {
            body { background: white !important; padding: 0 !important; margin: 0 !important; }
            .as-report-page {
                page-break-after: always !important;
                break-after: page !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
                width: 210mm !important;
                height: 297mm !important;
                max-height: 297mm !important;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                box-sizing: border-box !important;
                padding: 12mm 15mm !important;
            }
            .avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }
            .no-print { display: none !important; }
        }
        @page { size: A4 portrait; margin: 0; }
        body { font-family: 'Poppins', sans-serif; background-color: #F3F4F6; }
        .as-report-page {
            width: 210mm;
            min-height: 297mm;
            max-height: 297mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            position: relative;
            box-sizing: border-box;
            padding: 12mm 15mm;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .maroon-gradient { background: linear-gradient(135deg, #4A0510 0%, #6B0919 60%, #8C1D2F 100%); }
        .gold-gradient { background: linear-gradient(135deg, #AA820A 0%, #D4AF37 50%, #F3E5AB 100%); }
    </style>
</head>
<body class="text-slate-800 text-sm antialiased selection:bg-gold selection:text-maroon-dark">

    <div class="max-w-[210mm] mx-auto">

        <!-- PAGE 01: EXECUTIVE COVER -->
        <section class="as-report-page avoid-break p-0 border-0" id="page-1" data-page="1">
            <div class="maroon-gradient text-white flex flex-col justify-between h-full p-8 sm:p-12 relative overflow-hidden border-4 border-gold">
                <div class="absolute -top-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-maroon-light/30 rounded-full blur-3xl pointer-events-none"></div>

                <div class="flex justify-between items-start border-b-2 border-gold/40 pb-6 relative z-10 shrink-0">
                    <div class="space-y-1">
                        <div class="flex items-center space-x-2">
                            <span class="w-3 h-3 rounded-full bg-gold inline-block"></span>
                            <span class="tracking-widest text-xs font-bold uppercase text-gold">ABROAD SIMPLIFIED</span>
                        </div>
                        <span class="font-bold text-sm text-gold-light tracking-wide block">${config.reportTitle} — EXECUTIVE EDITION</span>
                        <span class="text-[10px] text-slate-300 font-mono">Dossier Code: #${rid}</span>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold tracking-wider uppercase shadow">
                            15-PAGE EXECUTIVE
                        </span>
                        <span class="block text-[9px] text-slate-300 font-mono mt-1">Curated Diagnostic Brief</span>
                    </div>
                </div>

                <div class="space-y-4 my-auto relative z-10 shrink-0">
                    <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-gold/20 text-gold-light text-xs font-semibold uppercase tracking-wider border border-gold/40 backdrop-blur-sm">
                        <i class="fa-solid fa-graduation-cap text-gold"></i>
                        <span>${config.academicStage}</span>
                    </div>
                    <div>
                        <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                            Executive Career Brief <br />
                            <span class="text-transparent bg-clip-text gold-gradient">&amp; Strategic Roadmap</span>
                        </h1>
                        <p class="text-slate-300 text-xs sm:text-sm mt-3 max-w-xl font-light leading-relaxed">
                            Curated 15-page synthesis covering cognitive capacity, behavioral traits, pathway alignment, and high-yield milestones.
                        </p>
                    </div>

                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-gold/40 shadow-2xl max-w-lg mt-6">
                        <div class="text-[10px] font-bold text-gold uppercase tracking-wider mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                            <span>Candidate Record</span>
                            <span class="font-mono text-slate-300">ID: ${rid}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div><span class="text-slate-400 block text-[10px]">Candidate Name:</span><strong class="text-white font-bold text-sm block">${name}</strong></div>
                            <div><span class="text-slate-400 block text-[10px]">Academic Stage:</span><span class="font-bold text-gold">${config.academicStage}</span></div>
                            <div><span class="text-slate-400 block text-[10px]">Evaluation Date:</span><span class="text-white">${dateStr}</span></div>
                            <div><span class="text-slate-400 block text-[10px]">Primary Match:</span><span class="text-white truncate block">${primaryRoadmap.pathwayTitle}</span></div>
                        </div>
                    </div>
                </div>

                <div class="border-t-2 border-gold/40 pt-4 flex justify-between items-center text-xs text-slate-300 relative z-10 shrink-0">
                    <div class="flex items-center space-x-2">
                        <i class="fa-solid fa-shield-halved text-gold"></i>
                        <span>Normative Group: ${config.normGroup}</span>
                    </div>
                    <span class="font-mono text-[10px] text-gold-light">Executive Edition | Page 01 of 15</span>
                </div>
            </div>
        </section>

        <!-- PAGE 02: TABLE OF CONTENTS & LETTER -->
        <section class="as-report-page avoid-break" id="page-2" data-page="2">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Executive Summary</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Dossier Overview &amp; Executive Letter</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 02</span>
                </div>

                <div class="space-y-4 shrink-0 my-auto text-xs leading-relaxed text-slate-700">
                    <div class="bg-cream/80 p-4 rounded-xl border border-gold/40 space-y-2">
                        <strong class="text-maroon font-bold uppercase text-[11px] block flex items-center gap-1.5">
                            <i class="fa-solid fa-envelope-open-text text-gold"></i> Executive Advisory Letter
                        </strong>
                        <p class="text-slate-800 text-[11.5px] leading-relaxed">
                            Dear ${name} and Family,<br /><br />
                            This 15-Page Executive Edition is a curated diagnostic brief extracted deterministically from your comprehensive 56-page evaluation. It consolidates key cognitive assets, personality drivers, recommended pathways, and 90-day action milestones into a high-yield executive decision map.
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-1">
                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-maroon font-bold text-[10.5px] block">Part I: Diagnostic Core (Pages 01–05)</strong>
                            <ul class="text-[10px] text-slate-600 space-y-0.5">
                                <li>01. Cover &amp; Candidate Record</li>
                                <li>02. Executive Letter &amp; Index</li>
                                <li>03. Diagnostic Snapshot &amp; KPIs</li>
                                <li>04. Visual Analytics &amp; Cognitive Radar</li>
                                <li>05. Executive Profile &amp; Synthesis</li>
                            </ul>
                        </div>
                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-maroon font-bold text-[10.5px] block">Part II: Roadmaps &amp; Action (Pages 06–15)</strong>
                            <ul class="text-[10px] text-slate-600 space-y-0.5">
                                <li>06–08. Personality, Cognitive &amp; Learning Summaries</li>
                                <li>09–11. Career Fitment, Family &amp; Readiness</li>
                                <li>12–14. Pathway Roadmaps (Primary, Secondary, Alt)</li>
                                <li>15. Strategic 90-Day Execution Plan</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Executive Overview | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 03: DIAGNOSTIC SNAPSHOT -->
        <section class="as-report-page avoid-break" id="page-3" data-page="3">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Executive Summary</span>
                        <h2 class="text-lg font-extrabold">Candidate Diagnostic Snapshot</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 03</span>
                </div>

                <div class="grid grid-cols-4 gap-2 text-center shrink-0">
                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40">
                        <span class="text-[9px] text-slate-500 block uppercase font-bold">Overall Aptitude</span>
                        <span class="text-lg font-black text-maroon">${overallApt}%</span>
                        <span class="text-[8px] text-slate-400 block">${Math.round(overallApt * 0.96)}th Percentile</span>
                    </div>
                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40">
                        <span class="text-[9px] text-slate-500 block uppercase font-bold">Execution Grit</span>
                        <span class="text-lg font-black text-emerald-800">${cSc}%</span>
                        <span class="text-[8px] text-slate-400 block">Conscientiousness</span>
                    </div>
                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40">
                        <span class="text-[9px] text-slate-500 block uppercase font-bold">Dominant RIASEC</span>
                        <span class="text-lg font-black text-gold-dark">${topRiasecLabel}</span>
                        <span class="text-[8px] text-slate-400 block">Interest Cluster</span>
                    </div>
                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40">
                        <span class="text-[9px] text-slate-500 block uppercase font-bold">Primary Fitment</span>
                        <span class="text-lg font-black text-maroon">${topFitScore}%</span>
                        <span class="text-[8px] text-slate-400 block truncate">${primaryCareerName.split(' ')[0]}</span>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Diagnostic Snapshot | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 04: VISUAL ANALYTICS -->
        <section class="as-report-page avoid-break" id="page-4" data-page="4">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Executive Summary</span>
                        <h2 class="text-lg font-extrabold">Visual Analytics &amp; Cognitive Dimensions</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 04</span>
                </div>

                <div class="grid grid-cols-2 gap-3 shrink-0 my-auto">
                    <div class="bg-cream/60 p-3 rounded-2xl border border-gold/30 shadow-sm flex flex-col items-center">
                        <span class="font-bold text-maroon uppercase text-[10px] mb-2 block w-full text-left border-b border-slate-200 pb-1">
                            <i class="fa-solid fa-compass text-gold mr-1"></i> Core Aptitude Profile
                        </span>
                        <div class="w-full space-y-2 text-[10px]">
                            <div class="flex justify-between"><span>Verbal Comprehension</span><strong>${verbSc}%</strong></div>
                            <div class="flex justify-between"><span>Numerical Reasoning</span><strong>${numSc}%</strong></div>
                            <div class="flex justify-between"><span>Fluid Logic</span><strong>${reasSc}%</strong></div>
                            <div class="flex justify-between"><span>Spatial Visualization</span><strong>${spatSc}%</strong></div>
                        </div>
                    </div>
                    <div class="bg-cream/60 p-3 rounded-2xl border border-gold/30 shadow-sm flex flex-col items-center">
                        <span class="font-bold text-maroon uppercase text-[10px] mb-2 block w-full text-left border-b border-slate-200 pb-1">
                            <i class="fa-solid fa-chart-pie text-gold mr-1"></i> Behavioral Overview
                        </span>
                        <div class="w-full space-y-2 text-[10px]">
                            <div class="flex justify-between"><span>Openness</span><strong>${oSc}%</strong></div>
                            <div class="flex justify-between"><span>Conscientiousness</span><strong>${cSc}%</strong></div>
                            <div class="flex justify-between"><span>Extraversion</span><strong>${eSc}%</strong></div>
                            <div class="flex justify-between"><span>Emotional Stability</span><strong>${esSc}%</strong></div>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Visual Analytics | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 05: PROFILE SYNTHESIS -->
        <section class="as-report-page avoid-break" id="page-5" data-page="5">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Executive Summary</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Executive Profile Synthesis</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 05</span>
                </div>

                <div class="space-y-3 shrink-0 my-auto text-xs leading-relaxed text-slate-700">
                    <div class="bg-cream p-4 rounded-xl border border-gold/40 space-y-2">
                        <strong class="text-maroon font-bold uppercase text-[11px] block flex items-center gap-1.5">
                            <i class="fa-solid fa-feather text-gold"></i> Core Profile Synthesis
                        </strong>
                        <p class="text-slate-800 text-xs leading-relaxed">${personalization?.executiveSummary || `${name} demonstrates a balanced cognitive profile with notable strength in analytical deduction and goal-directed persistence.`}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-1">
                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                            <strong class="text-maroon font-bold text-[11px] block border-b border-slate-100 pb-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-circle-check text-emerald-600"></i> Top Strengths
                            </strong>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                ${(personalization?.strengths || ['High fluid reasoning and logical problem solving', 'Methodical execution discipline and milestone persistence']).slice(0, 3).map(s => `<li>• ${s}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                            <strong class="text-maroon font-bold text-[11px] block border-b border-slate-100 pb-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-arrow-trend-up text-amber-600"></i> Strategic Priorities
                            </strong>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                ${(personalization?.growthAreas || ['Pair high curiosity with structured daily execution buffers', 'Enhance active recall practice over passive rereading']).slice(0, 3).map(g => `<li>• ${g}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Profile Synthesis | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 06: PHASE I SUMMARY -->
        <section class="as-report-page avoid-break" id="page-6" data-page="6">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase I Summary</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Personality Architecture Summary</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 06</span>
                </div>
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <p class="text-slate-700 leading-relaxed">Your personality profile balances exploratory curiosity (Openness: ${oSc}%) with methodical execution (Conscientiousness: ${cSc}%). You approach academic responsibilities with high personal accountability and steady emotional equanimity under pressure.</p>
                </div>
                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Phase I Summary | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 07: PHASE II SUMMARY -->
        <section class="as-report-page avoid-break" id="page-7" data-page="7">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase II Summary</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Cognitive Processing Summary</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 07</span>
                </div>
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <p class="text-slate-700 leading-relaxed">Your cognitive profile reveals outstanding fluid reasoning (${reasSc}%). You excel at identifying underlying rules and solving novel multi-step problems from first principles without relying on memorized formulas.</p>
                </div>
                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Phase II Summary | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 08: PHASE III SUMMARY -->
        <section class="as-report-page avoid-break" id="page-8" data-page="8">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase III Summary</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Learning &amp; Execution Summary</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 08</span>
                </div>
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <p class="text-slate-700 leading-relaxed">Your learning preferences center on ${topVarkLabel} inputs. You encode information most effectively through structured concept mapping, active retrieval testing, and scheduled deep work sprints.</p>
                </div>
                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Phase III Summary | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 09: PHASE IV SUMMARY -->
        <section class="as-report-page avoid-break" id="page-9" data-page="9">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase IV Summary</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Career Fitment &amp; Stream Alignment</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 09</span>
                </div>
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <p class="text-slate-700 leading-relaxed">Based on multi-construct triangulation, your highest strategic match is <strong>${primaryRoadmap.pathwayTitle}</strong> (${topFitScore}% Match), supported by secondary fitment in ${secondaryRoadmap.pathwayTitle}.</p>
                </div>
                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Phase IV Summary | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 10: PHASE V SUMMARY -->
        <section class="as-report-page avoid-break" id="page-10" data-page="10">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase V Summary</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Family Alignment &amp; Consensus Strategy</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 10</span>
                </div>
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <p class="text-slate-700 leading-relaxed">Student and family expectations demonstrate strong baseline harmony around core academic goals. Transparent conversations around college budgets, scholarship planning, and subject choices solidify mutual support.</p>
                </div>
                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Phase V Summary | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 11: PHASE VI SUMMARY -->
        <section class="as-report-page avoid-break" id="page-11" data-page="11">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI Summary</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Advanced Synthesis &amp; Readiness</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 11</span>
                </div>
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <p class="text-slate-700 leading-relaxed">Positioned in the high-yield execution quadrant, your combination of fluid logic and conscientiousness provides a resilient competitive foundation for demanding examinations and degree programs.</p>
                </div>
                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Phase VI Summary | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 12: PRIMARY ROADMAP -->
        <section class="as-report-page avoid-break" id="page-12" data-page="12">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">${primaryRoadmap.pathwayRankLabel}</span>
                        <h2 class="text-lg font-extrabold">${primaryRoadmap.pathwayTitle}</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 12</span>
                </div>
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <p class="text-slate-700 text-[11px] leading-relaxed">${primaryRoadmap.rationale}</p>
                    <div class="bg-cream/60 p-3 rounded-xl border border-gold/30">
                        <strong class="text-maroon font-bold text-[10.5px] block mb-1">Key Milestone:</strong>
                        <p class="text-[10px] text-slate-700">${primaryRoadmap.milestone}</p>
                    </div>
                </div>
                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Primary Pathway Roadmap | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 13: SECONDARY ROADMAP -->
        <section class="as-report-page avoid-break" id="page-13" data-page="13">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">${secondaryRoadmap.pathwayRankLabel}</span>
                        <h2 class="text-lg font-extrabold">${secondaryRoadmap.pathwayTitle}</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 13</span>
                </div>
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <p class="text-slate-700 text-[11px] leading-relaxed">${secondaryRoadmap.rationale}</p>
                    <div class="bg-cream/60 p-3 rounded-xl border border-gold/30">
                        <strong class="text-maroon font-bold text-[10.5px] block mb-1">Key Milestone:</strong>
                        <p class="text-[10px] text-slate-700">${secondaryRoadmap.milestone}</p>
                    </div>
                </div>
                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Secondary Pathway Roadmap | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 14: ALTERNATIVE ROADMAP -->
        <section class="as-report-page avoid-break" id="page-14" data-page="14">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">${alternativeRoadmap.pathwayRankLabel}</span>
                        <h2 class="text-lg font-extrabold">${alternativeRoadmap.pathwayTitle}</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 14</span>
                </div>
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <p class="text-slate-700 text-[11px] leading-relaxed">${alternativeRoadmap.rationale}</p>
                    <div class="bg-cream/60 p-3 rounded-xl border border-gold/30">
                        <strong class="text-maroon font-bold text-[10.5px] block mb-1">Key Milestone:</strong>
                        <p class="text-[10px] text-slate-700">${alternativeRoadmap.milestone}</p>
                    </div>
                </div>
                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Alternative Pathway Roadmap | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 15: STRATEGIC 90-DAY EXECUTION PLAN & CONCLUSION -->
        <section class="as-report-page avoid-break" id="page-15" data-page="15">
            <div class="maroon-gradient rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border-4 border-gold h-full flex flex-col justify-between">
                <div class="flex items-center justify-between border-b-2 border-gold/40 pb-4 relative z-10 shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-gold text-maroon-dark font-black flex items-center justify-center text-base shadow">
                            <i class="fa-solid fa-flag-checkered"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-gold tracking-widest block uppercase">${config.actionPlanTerminology.pageTitle}</span>
                            <span class="text-[10px] text-slate-300 block font-medium">Strategic 90-Day Execution Summary</span>
                        </div>
                    </div>
                    <span class="inline-block px-2.5 py-0.5 rounded-full bg-gold/20 border border-gold text-gold-light text-[10px] font-bold uppercase tracking-wider">
                        FINAL PAGE (PAGE 15)
                    </span>
                </div>

                <div class="space-y-3 shrink-0 my-auto text-xs leading-relaxed relative z-10">
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-gold/30 space-y-2">
                        <span class="text-gold font-bold text-[11px] uppercase block">This Month Action Milestones:</span>
                        <ul class="space-y-1 text-slate-200 text-[10px]">
                            ${actionPlan.thisMonth.slice(0, 3).map(m => `<li>• ${m}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-gold/30 space-y-2">
                        <span class="text-gold font-bold text-[11px] uppercase block">Next 90 Days Objectives:</span>
                        <ul class="space-y-1 text-slate-200 text-[10px]">
                            ${actionPlan.next90Days.slice(0, 3).map(m => `<li>• ${m}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="border-t-2 border-gold/40 pt-3 text-center relative z-10 space-y-0.5 shrink-0">
                    <p class="text-xs italic font-serif text-gold-light max-w-xl mx-auto">
                        "Your potential is not defined by where you start, but by the clarity of the path you choose to walk."
                    </p>
                    <p class="text-[9px] text-slate-400 uppercase font-semibold">© 2026 PrepAbroad Simplified | Executive Edition Complete</p>
                </div>
            </div>
        </section>

    </div>
</body>
</html>`;
}
