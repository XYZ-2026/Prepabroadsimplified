# CLARVO Career Library — Career Profile Extension Guide

This guide explains how to add new careers (in Commerce, Arts, Humanities, Medical, Law, Design, or Emerging domains) without modifying UI components or altering the existing engineering assessment.

---

## 1. Where to Add New Careers

You can add new career records directly into:
`src/data/career-library/manual_extensions.json`

Once saved, any valid record added here **automatically appears in the Career Library catalogue, search queries, cluster filters, and detailed view** immediately.

---

## 2. Career Record Schema (JSON Template)

Here is a complete template for adding a new career:

```json
[
  {
    "id": "investment-banking-analyst",
    "name": "Investment Banking & Corporate Finance",
    "cluster": "commerce-finance",
    "family": "investment-banking",
    "stream": "commerce",
    "desc": "Advises corporations and institutions on mergers, acquisitions, capital raising, and financial restructuring.",
    "difficulty": 4,
    "futureScope": 5,
    "whoSuits": "Students with sharp quantitative acumen, endurance for high-stakes deal cycles, and strong business presentation skills.",
    "coreSkills": [
      "Financial Statement Modelling",
      "Discounted Cash Flow (DCF) Valuation",
      "LBO Modelling",
      "Pitchbook Preparation",
      "Due Diligence",
      "Capital Markets Advisory"
    ],
    "tools": [
      "Advanced Excel",
      "Bloomberg Terminal",
      "FactSet",
      "CapIQ",
      "PowerPoint",
      "Python (pandas)"
    ],
    "careers": [
      "Investment Banking Analyst",
      "Private Equity Associate",
      "Corporate Development Manager",
      "M&A Associate",
      "Venture Capital Analyst"
    ],
    "isEngineeringAssessmentEligible": false,
    "hasExplicitRoadmap": true,
    "sourceNotes": "Reviewed against SEBI and global investment banking hiring benchmarks.",
    "lastReviewed": "2026-10"
  }
]
```

---

## 3. Supported Streams (`stream`)
- `"engineering"`: Engineering & Technology (PCM)
- `"commerce"`: Commerce, Finance & Management
- `"arts"`: Arts, Humanities, Creative, Media & Law
- `"science-health"`: Medical, Allied Health & Pure Sciences

---

## 4. Supported Clusters (`cluster`)
- **Engineering**: `computer-it`, `ai-data`, `electronics`, `electrical`, `mechanical`, `civil`, `chemical-pharma`, `textile-fashion`, `food-material`, `emerging`
- **Commerce**: `commerce-finance`, `management-business`
- **Arts / Law / Media**: `humanities-social`, `media-communication`, `creative-design`, `law-public`
- **Science / Health**: `medical-health`, `pure-science`

---

## 5. Adding a Custom Roadmap (Optional)

If a career has an explicit roadmap, you can add it to `src/data/career-library/roadmaps.json` keyed by the career's `id`:

```json
"investment-banking-analyst": {
  "whyFits": "Investment Banking matches your drive for high-impact corporate finance deals.",
  "entryRoute": "Bachelor's degree in Commerce, Economics, or Engineering + CFA / MBA in Finance.",
  "yearByYear": [
    { "year": "Year 1", "items": ["Financial Accounting", "Microeconomics", "Excel Modelling", "Business Law"] },
    { "year": "Year 2", "items": ["Corporate Finance", "Macroeconomics", "Valuation Fundamentals", "NISM / CFA L1 prep"] },
    { "year": "Year 3", "items": ["M&A Simulation", "LBO Models", "Summer Analyst Internship", "Pitching Practice"] },
    { "year": "Year 4", "items": ["Advanced Valuation", "Deal Structuring", "Full-time Analyst Recruiting"] }
  ],
  "coreSubjects": ["Financial Modelling", "Corporate Valuation", "Capital Markets", "Financial Economics"],
  "tools": ["Excel", "Bloomberg", "FactSet", "CapIQ"],
  "projects": ["Build an end-to-end DCF model of a NIFTY 50 company", "Create an M&A pitch deck for a hypothetical merger"],
  "internshipStrategy": "Target boutique advisory firms and investment bank summer analyst programs.",
  "skillMilestones": ["Sem 1-2: Accounting and Excel fluency", "Sem 3-4: 3-statement models", "Sem 5-6: Internship", "Sem 7-8: Final placement"],
  "careerPaths": ["Investment Banking Analyst", "PE Associate", "Corporate Development"],
  "topRecruiters": ["Goldman Sachs", "Morgan Stanley", "JPMorgan", "Avendus", "Kotak Investment Banking"],
  "salaryDirection": "Starting: ₹12-25 LPA | Mid-career: ₹30-70 LPA | Senior: ₹1 Cr+ (Managing Director).",
  "futureTrends": ["Private credit growth", "Cross-border tech acquisitions", "AI-assisted due diligence"],
  "risks": ["Demanding 70-80 hour work weeks during active deals", "High cyclicality tied to market liquidity"],
  "actionPlan": ["Master Excel financial modelling", "Read financial newspapers daily", "Network with alumni in finance"]
}
```

*Note: If no explicit roadmap is authored, CLARVO's domain-aware fallback generator automatically constructs a tailored roadmap appropriate for the career's stream (Commerce/Arts/Health/Tech), without imposing irrelevant engineering coursework.*

---

## 6. Guaranteeing Zero Regressions for Engineering Assessments

- Engineering assessments only evaluate profiles with `"isEngineeringAssessmentEligible": true`.
- Commerce and Arts profiles must have `"isEngineeringAssessmentEligible": false`.
- This ensures that adding new non-engineering careers never introduces irrelevant careers into the 32-trait engineering assessment matching system.
