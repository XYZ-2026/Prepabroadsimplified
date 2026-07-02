import collegeFinderData from '@/data/College_finder.json';
import universityData from '@/data/University.json';

export interface UserProfile {
  c9: number;
  c10: number;
  c11: number;
  c12: number;
  sat: number;
  avg_ap: number;
  cc: number;
  ec: number;
  intr: number;
  community: boolean;
  research: boolean;
  n_lor: number;
  countries: string[];
}

export interface UniversityResult {
  Country: string;
  University: string;
  'QS Ranking': number | null;
  'Required Profile Score': number;
  'Your Profile %': number;
  'Gap %': number;
}

export interface PredictionResult {
  countryScores: { Country: string; 'Total Profile %': number }[];
  all: UniversityResult[];
  ambitious: UniversityResult[];
  target: UniversityResult[];
  safe: UniversityResult[];
}

function pctToDecimal(v: any): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === 'number') return v;
  const s = String(v).trim();
  if (s.endsWith('%')) {
    const num = parseFloat(s.replace('%', '').trim());
    return isNaN(num) ? 0 : num / 100;
  }
  const num = parseFloat(s);
  return isNaN(num) ? 0 : num;
}

function normalizeProfileRow(r: any) {
  const out: any = {};
  out.Country = (r.Country || '').trim();
  const map: Record<string, string> = {
    'Class 9': 'Class 9', 'Class 10': 'Class 10', 'Class 11': 'Class 11', 'Class 12': 'Class 12',
    'SAT': 'SAT', 'AP': 'AP',
    'CC (Max 3)': 'CC', 'EC (Max 3)': 'EC', 'Internship (Max 2)': 'Internship',
    'CC': 'CC', 'EC': 'EC', 'Internship': 'Internship',
    'Community': 'Community', 'Research': 'Research', 'LOR': 'LOR'
  };
  for (const key in map) {
    if (r.hasOwnProperty(key)) {
      out[map[key]] = pctToDecimal(r[key]);
    } else {
      out[map[key]] = r[map[key]] !== undefined ? pctToDecimal(r[map[key]]) : 0;
    }
  }
  return out;
}

function normalizeUniRow(u: any) {
  return {
    Country: (u.Country || '').trim(),
    University: u.University || '',
    'QS Ranking': (u['QS Ranking'] !== undefined && u['QS Ranking'] !== '') ? +u['QS Ranking'] : null,
    'Required Profile Score': +u['Required Profile Score'] || 0
  };
}

export function predictUniversities(profile: UserProfile): PredictionResult {
  const collegeProfile = collegeFinderData.map(normalizeProfileRow);
  const uniList = universityData.map(normalizeUniRow);

  const user_profile: Record<string, number> = {
    "Class 9": (profile.c9 || 0) / 100,
    "Class 10": (profile.c10 || 0) / 100,
    "Class 11": (profile.c11 || 0) / 100,
    "Class 12": (profile.c12 || 0) / 100,
    "SAT": (profile.sat || 0) / 1600,
    "AP": profile.avg_ap || 0,
    "CC": (profile.cc || 0) / 3,
    "EC": (profile.ec || 0) / 3,
    "Internship": (profile.intr || 0) / 2,
    "Community": profile.community ? 1.0 : 0.0,
    "Research": profile.research ? 1.0 : 0.0,
    "LOR": (profile.n_lor || 0) / 3
  };

  const selCountries = profile.countries || ["All"];
  const useAll = selCountries.length === 0 || selCountries.includes("All");
  const filteredProfile = useAll ? collegeProfile : collegeProfile.filter(r => selCountries.includes(r.Country));

  if (filteredProfile.length === 0) {
    return { countryScores: [], all: [], ambitious: [], target: [], safe: [] };
  }

  const acad_keys = ["Class 9", "Class 10", "Class 11", "Class 12", "SAT", "AP"];
  const act_keys = ["CC", "EC", "Internship", "Community", "Research"];

  const countryScores = filteredProfile.map(row => {
    let total = 0;
    acad_keys.concat(act_keys).forEach(k => {
      const rowVal = Number(row[k] || 0);
      total += (Number(user_profile[k] || 0) * rowVal);
    });
    total += (Number(user_profile["LOR"] || 0) * Number(row["LOR"] || 0));
    return {
      Country: row.Country,
      "Total Profile %": Math.round(total * 1000) / 10
    };
  });

  const score_map: Record<string, number> = {};
  countryScores.forEach(r => { score_map[r.Country] = r["Total Profile %"]; });

  let gap_view = uniList.map(u => {
    const your = score_map[u.Country];
    return Object.assign({}, u, { "Your Profile %": (your === undefined ? null : your) });
  }).filter(u => u["Your Profile %"] !== null) as UniversityResult[];

  gap_view.forEach(r => {
    r["Gap %"] = (Number(r["Required Profile Score"] || 0) - Number(r["Your Profile %"] || 0));
    r["Gap %"] = Math.round(r["Gap %"] * 10) / 10;
  });
  
  gap_view.sort((a, b) => b["Gap %"] - a["Gap %"]);

  if (gap_view.length === 0) {
    return { countryScores, all: [], ambitious: [], target: [], safe: [] };
  }

  const posIndices = gap_view.map((r, idx) => r["Gap %"] > 0 ? idx : -1).filter(i => i >= 0);
  let anchor;
  if (posIndices.length > 0) {
    let minIdx = posIndices[0], minVal = gap_view[minIdx]["Gap %"];
    posIndices.forEach(i => { if (gap_view[i]["Gap %"] < minVal) { minVal = gap_view[i]["Gap %"]; minIdx = i; } });
    anchor = minIdx;
  } else {
    let minIdx = 0, minVal = Math.abs(gap_view[0]["Gap %"]);
    for (let i = 1; i < gap_view.length; i++) {
      const av = Math.abs(gap_view[i]["Gap %"]);
      if (av < minVal) { minVal = av; minIdx = i; }
    }
    anchor = minIdx;
  }

  const target_start = Math.max(0, anchor - 2);
  const target_df = gap_view.slice(target_start, anchor + 4);
  const ambitious_df = gap_view.slice(Math.max(0, target_start - 6), target_start);
  const safe_df = gap_view.slice(anchor + 4, anchor + 10);

  return {
    countryScores,
    all: gap_view,
    ambitious: ambitious_df,
    target: target_df,
    safe: safe_df
  };
}
