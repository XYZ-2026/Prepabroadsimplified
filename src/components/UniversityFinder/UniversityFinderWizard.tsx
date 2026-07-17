'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/university-finder.module.css';
import { predictUniversities, UserProfile, PredictionResult, UniversityResult } from '@/lib/university-predictor';
import { MapPin, Award, Search } from 'lucide-react';
import { LOGO_BASE64 } from '@/lib/logo-base64';

export interface InitialDetails {
  name: string;
  email: string;
  mobile: string;
  state: string;
  city: string;
}

export default function UniversityFinderWizard({ initialDetails }: { initialDetails?: InitialDetails }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [details, setDetails] = useState(initialDetails || { name: '', email: '', mobile: '', state: '', city: '' });
  const [profile, setProfile] = useState<UserProfile>({
    c9: 0, c10: 0, c11: 0, c12: 0, sat: 0, avg_ap: 0, cc: 0, ec: 0, intr: 0,
    community: false, research: false, n_lor: 0, countries: ['All']
  });
  const [n_ap, setNAp] = useState(0);
  const [apScores, setApScores] = useState<number[]>([]);
  const [results, setResults] = useState<PredictionResult | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedDetails = localStorage.getItem('STUDENT_DETAILS');
      if (savedDetails) {
        setDetails(JSON.parse(savedDetails));
        setStep(2); // Skip step 1 if details exist
      } else if (initialDetails?.name && initialDetails?.email && initialDetails?.mobile && initialDetails?.state && initialDetails?.city) {
        setStep(2); // Skip step 1 if profile is already complete
      }
    } catch (e) { }
  }, [initialDetails]);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.name || !details.email || !details.mobile || !details.state || !details.city) {
      alert("Please fill all details");
      return;
    }
    localStorage.setItem('STUDENT_DETAILS', JSON.stringify(details));
    setStep(2);
  };

  const handlePredict = () => {
    // Calculate AP average
    const avg_ap = (n_ap > 0) ? (apScores.reduce((a, b) => a + Number(b), 0) / (n_ap * 5)) : 0;
    
    const finalProfile = { ...profile, avg_ap };
    
    // Save to localStorage
    localStorage.setItem('STUDY_PROFILE', JSON.stringify(finalProfile));
    
    // Run prediction
    const res = predictUniversities(finalProfile);
    setResults(res);
    setStep(3);
  };

  const renderStepper = () => (
    <div className={styles.stepperContainer}>
      <div className={`${styles.stepItem} ${step >= 1 ? styles.stepItemActive : ''}`}>
        <div className={`${styles.stepCircle} ${step > 1 ? styles.stepCircleDone : (step === 1 ? styles.stepCircleActive : '')}`}>1</div>
        <span className={styles.stepLabel}>DETAILS</span>
      </div>
      <div className={`${styles.stepItem} ${step >= 2 ? styles.stepItemActive : ''}`}>
        <div className={`${styles.stepCircle} ${step > 2 ? styles.stepCircleDone : (step === 2 ? styles.stepCircleActive : '')}`}>2</div>
        <span className={styles.stepLabel}>PROFILE</span>
      </div>
      <div className={`${styles.stepItem} ${step >= 3 ? styles.stepItemActive : ''}`}>
        <div className={`${styles.stepCircle} ${step === 3 ? styles.stepCircleActive : ''}`}>3</div>
        <span className={styles.stepLabel}>RESULTS</span>
      </div>
    </div>
  );

  // Render Step 1
  if (step === 1) {
    return (
      <div className={styles.wizardCard}>
        {renderStepper()}
        <h1 className={styles.wizardTitle}>Enter Student Details</h1>
        <form onSubmit={handleSaveDetails}>
          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input type="text" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} required />
            </div>
          </div>
          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label>Mobile Number</label>
              <input type="tel" value={details.mobile} onChange={e => setDetails({...details, mobile: e.target.value})} required />
            </div>
            <div className={styles.inputGroup}>
              <label>State</label>
              <input type="text" value={details.state} onChange={e => setDetails({...details, state: e.target.value})} required />
            </div>
          </div>
          <div className={styles.inputGroup} style={{ marginBottom: '20px' }}>
            <label>City</label>
            <input type="text" value={details.city} onChange={e => setDetails({...details, city: e.target.value})} required />
          </div>
          <button type="submit" className={styles.btnPrimary}>Save & Continue</button>
        </form>
      </div>
    );
  }

  // Render Step 2
  if (step === 2) {
    return (
      <div className={styles.wizardCard}>
        {renderStepper()}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className={styles.wizardTitle} style={{ textAlign: 'left', marginBottom: 0 }}>University Readiness Assessment</h1>
          <button onClick={() => setStep(1)} className={styles.btnSecondary} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            Edit Details
          </button>
        </div>
        
        <p style={{ marginBottom: '20px', color: '#666' }}>Hi {details.name}! We'll personalise suggestions for {details.city}, {details.state}.</p>

        <form onSubmit={(e) => { e.preventDefault(); handlePredict(); }}>
          <div className={styles.grid2}>
            <div>
              <div className={styles.inputGroup}>
                <label>Class 9 % *</label>
                <input type="number" step="any" min="0" max="100" value={profile.c9 || ''} onChange={e => setProfile({...profile, c9: Number(e.target.value)})} required />
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label>Class 10 % *</label>
                <input type="number" step="any" min="0" max="100" value={profile.c10 || ''} onChange={e => setProfile({...profile, c10: Number(e.target.value)})} required />
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label>Class 11 % *</label>
                <input type="number" step="any" min="0" max="100" value={profile.c11 || ''} onChange={e => setProfile({...profile, c11: Number(e.target.value)})} required />
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label>Class 12 % *</label>
                <input type="number" step="any" min="0" max="100" value={profile.c12 || ''} onChange={e => setProfile({...profile, c12: Number(e.target.value)})} required />
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label>SAT/ACT (400-1600) *</label>
                <input type="number" min="400" max="1600" value={profile.sat || ''} onChange={e => setProfile({...profile, sat: Number(e.target.value)})} required />
              </div>
            </div>
            <div>
              <div className={styles.inputGroup}>
                <label>Co-curricular (0-3) *</label>
                <input type="number" min="0" max="3" value={profile.cc === 0 && !String(profile.cc) ? '' : profile.cc} onChange={e => setProfile({...profile, cc: e.target.value === '' ? 0 : Number(e.target.value)})} required />
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label>Extra-curricular (0-3) *</label>
                <input type="number" min="0" max="3" value={profile.ec === 0 && !String(profile.ec) ? '' : profile.ec} onChange={e => setProfile({...profile, ec: e.target.value === '' ? 0 : Number(e.target.value)})} required />
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label>Internships (0-2) *</label>
                <select value={profile.intr} onChange={e => setProfile({...profile, intr: Number(e.target.value)})} required>
                  <option value="0">0</option><option value="1">1</option><option value="2">2</option>
                </select>
              </div>
              <div style={{ marginTop: '20px' }}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={profile.community} onChange={e => setProfile({...profile, community: e.target.checked})} />
                  Community Service
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={profile.research} onChange={e => setProfile({...profile, research: e.target.checked})} />
                  Research Project
                </label>
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label>Number of LORs (0-3) *</label>
                <select value={profile.n_lor} onChange={e => setProfile({...profile, n_lor: Number(e.target.value)})} required>
                  <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className={styles.inputGroup} style={{ flex: '1 1 min-content' }}>
              <label>Number of APs (0–5)</label>
              <input type="number" min="0" max="5" value={n_ap} onChange={e => {
                const val = Math.min(5, Math.max(0, Number(e.target.value)));
                setNAp(val);
                setApScores(Array(val).fill(0));
              }} required />
            </div>
            <button type="submit" className={styles.btnPrimary} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Search className="w-4 h-4" /> Find My Universities</button>
          </div>
          
          {n_ap > 0 && (
            <div style={{ marginTop: '20px' }}>
              {Array.from({ length: n_ap }).map((_, i) => (
                <div key={i} className={styles.inputGroup} style={{ marginBottom: '8px' }}>
                  <label>AP {i+1} score (0.0 - 5.0) *</label>
                  <input type="number" step="0.1" min="0" max="5" value={apScores[i] || ''} onChange={e => {
                    const newScores = [...apScores];
                    newScores[i] = Number(e.target.value);
                    setApScores(newScores);
                  }} required />
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    );
  }

  // Render Step 3 (Results)
  if (!results) return null;

  const renderCard = (uni: UniversityResult, categoryClass: string) => (
    <div key={uni.University} className={`${styles.uniCard} ${styles[categoryClass]}`}>
      <div className={styles.uniName}>{uni.University}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666', fontSize: '13px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} color="#9ca3af" />
          <span>{uni.Country}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Award size={14} color="#9ca3af" />
          <span>QS #{uni['QS Ranking'] || 'N/A'}</span>
        </div>
      </div>
      <div style={{ fontSize: '15px', color: '#111', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div><strong>Required:</strong> {uni['Required Profile Score']}</div>
        <div><strong>Your score:</strong> {uni['Your Profile %']}</div>
        <div><strong>Gap %:</strong> {uni['Gap %']}</div>
      </div>
    </div>
  );

  const handleDownloadPDF = async () => {
    if (!results) return;
    
    const loadScript = (src: string) => new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js');
    } catch (e) {
      console.error("Failed to load PDF generation scripts");
      alert("Failed to load PDF tools. Please check your connection.");
      return;
    }
    
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;

    // Fonts: we will use 'helvetica' (default) but style appropriately.
    const fontNormal = 'helvetica';
    
    // Header text helper
    const drawPageHeader = (pageTitle: string, subtitle: string) => {
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.setFont(fontNormal, 'normal');
      doc.text('ABROAD SIMPLIFIED • PERSONALISED UNIVERSITY REPORT', pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(180, 20, 30); // Red accent
      doc.setFont(fontNormal, 'bold');
      doc.text(pageTitle, margin, 25);
      
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text(subtitle, margin, 35);
    };

    // --- PAGE 1: COVER PAGE ---
    // Dark background with gradient vibe
    const step = 2;
    for (let y = 0; y <= pageHeight; y += step) {
      const ratio = y / pageHeight;
      // Premium dark gradient: Slate blue to dark crimson
      const r = Math.round(30 + (60 - 30) * ratio);
      const g = Math.round(35 + (20 - 35) * ratio);
      const b = Math.round(45 + (30 - 45) * ratio);
      doc.setFillColor(r, g, b);
      doc.rect(0, y, pageWidth, step + 0.5, 'F');
    }
    
    // Logo
    try {
      doc.addImage(LOGO_BASE64, 'PNG', margin, 38, 14, 14);
    } catch (e) {
      // Fallback: red square if logo fails
      doc.setFillColor(220, 53, 69);
      doc.roundedRect(margin, 40, 10, 10, 2, 2, 'F');
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(fontNormal, 'bold');
    doc.text('ABROAD ', margin + 18, 47);
    doc.setTextColor(255, 193, 7); // Yellow
    doc.setFont(fontNormal, 'normal');
    doc.text('SIMPLIFIED', margin + 39, 47);
    
    doc.setTextColor(255, 193, 7); // Yellow
    doc.setFontSize(10);
    doc.text('PERSONALISED UNIVERSITY REPORT', margin, 85);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.setFont(fontNormal, 'bold');
    doc.text('Your Global\nAdmissions Readiness,\nDecoded.', margin, 100);
    
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(12);
    doc.setFont(fontNormal, 'normal');
    doc.text('A data-driven breakdown of your profile match across 13\nstudy destinations and 160+ leading universities.', margin, 145);
    
    // Red horizontal line
    doc.setDrawColor(220, 53, 69);
    doc.setLineWidth(1);
    doc.line(margin, 175, margin + 30, 175);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont(fontNormal, 'bold');
    doc.text('PREPARED FOR', margin, 200);
    doc.text('LOCATION', 75, 200);
    doc.text('GENERATED ON', 140, 200);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(details.name, margin, 208);
    doc.text(`${details.city}, ${details.state}`, 75, 208);
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(today, 140, 208);
    
    // Footer line
    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont(fontNormal, 'normal');
    doc.text('CONFIDENTIAL & PERSONALISED', margin, pageHeight - 12);
    doc.text('abroadsimplified.com', pageWidth - margin, pageHeight - 12, { align: 'right' });

    // --- PAGE 2: PROFILE SUMMARY ---
    doc.addPage();
    drawPageHeader('01  •  STUDENT PROFILE', 'Profile Summary');
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(fontNormal, 'normal');
    doc.text('Here\'s a quick overview of the contact details on file for this report. All readiness scores\nand gap calculations that follow are benchmarked against your current academic and\nextracurricular profile.', margin, 45);
    
    // Contact Info Box (Light blue)
    doc.setFillColor(236, 244, 250);
    doc.roundedRect(margin, 70, pageWidth - 2 * margin, 50, 4, 4, 'F');
    
    // Red avatar circle
    doc.setFillColor(220, 53, 69);
    doc.circle(margin + 20, 95, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(fontNormal, 'bold');
    doc.text(details.name.charAt(0).toUpperCase(), margin + 20, 97, { align: 'center', baseline: 'middle' });
    
    doc.setFontSize(8);
    doc.setTextColor(100, 130, 180); // Blueish label
    doc.text('NAME', margin + 45, 82);
    doc.text('EMAIL', margin + 95, 82);
    doc.text('MOBILE', margin + 145, 82);
    doc.text('LOCATION', margin + 45, 105);
    
    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.text(details.name, margin + 45, 90);
    doc.text(details.email, margin + 95, 90);
    doc.text(details.mobile, margin + 145, 90);
    doc.text(`${details.city}, ${details.state}`, margin + 45, 113);
    
    // How to read this report box (Light pink)
    doc.setFillColor(252, 232, 233); // light red
    doc.roundedRect(margin, 135, pageWidth - 2 * margin, 25, 2, 2, 'F');
    
    // Thick red left border on the pink box
    doc.setFillColor(180, 20, 30);
    doc.rect(margin, 135, 2, 25, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(33, 37, 41);
    doc.setFont(fontNormal, 'bold');
    doc.setTextColor(180, 20, 30);
    doc.text('How to read this report: ', margin + 8, 145);
    doc.setTextColor(33, 37, 41);
    doc.setFont(fontNormal, 'normal');
    doc.text('Each university below is scored on a Required Profile Score, benchmarked', margin + 45, 145);
    doc.text('against your current Profile Match %. The Gap % shows how much stronger your profile needs to be — a', margin + 8, 150);
    doc.text('lower or negative gap means the university is well within reach today.', margin + 8, 155);

    // --- PAGE 3: COUNTRY READINESS ---
    doc.addPage();
    drawPageHeader('02  •  COUNTRY READINESS', 'Country-wise Readiness');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(fontNormal, 'normal');
    doc.text('Your overall profile match, benchmarked against the average admissions bar for\nuniversities in each destination country.', margin, 45);
    
    // Country Progress Bars Box
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    // Calculate box height
    const boxHeight = results.countryScores.length * 10 + 25;
    doc.roundedRect(margin, 60, pageWidth - 2 * margin, boxHeight, 4, 4, 'S');
    
    let cy = 70;
    results.countryScores.forEach(c => {
      doc.setFontSize(9);
      doc.setTextColor(33, 37, 41);
      doc.setFont(fontNormal, 'bold');
      doc.text(c.Country, margin + 10, cy + 3.5);
      
      const barX = margin + 50;
      const barWidth = 100;
      const barH = 5;
      
      // Empty track
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(barX, cy, barWidth, barH, 2.5, 2.5, 'F');
      
      // Fill
      let fillPct = Number(c['Total Profile %']);
      if (isNaN(fillPct)) fillPct = 50;
      // Use orange/yellow fill
      doc.setFillColor(230, 130, 20); // Orange
      const fillW = Math.max(5, Math.min(barWidth, (fillPct / 100) * barWidth));
      doc.roundedRect(barX, cy, fillW, barH, 2.5, 2.5, 'F');
      
      // Score text
      doc.setTextColor(180, 20, 30);
      doc.text(`${c['Total Profile %']}%`, barX + barWidth + 10, cy + 3.5);
      
      cy += 10;
    });
    
    // Legend
    doc.setFillColor(180, 20, 30);
    doc.rect(margin, 60 + boxHeight + 10, 4, 4, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont(fontNormal, 'normal');
    doc.text('Lower match', margin + 6, 60 + boxHeight + 13.5);
    
    doc.setFillColor(230, 170, 20); // yellow
    doc.rect(margin + 35, 60 + boxHeight + 10, 4, 4, 'F');
    doc.text('Higher match', margin + 41, 60 + boxHeight + 13.5);

    // --- PAGE 4+: GAP ANALYSIS TABLES ---
    doc.addPage();
    drawPageHeader('03  •  GAP ANALYSIS', 'University Gap Analysis');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(fontNormal, 'normal');
    doc.text('A full breakdown of 161 universities across your shortlisted countries, ranked from the most\nambitious reach to the safest bet, based on your current profile match.', margin, 45);

    const gapHead = ['COUNTRY', 'UNIVERSITY', 'QS RANK', 'REQUIRED', 'YOUR\nMATCH', 'GAP'];
    const gapBody = results.all.map(u => [
      u.Country, 
      u.University, 
      u['QS Ranking'] ? `#${u['QS Ranking']}` : 'N/A', 
      `${u['Required Profile Score']}%`, 
      `${u['Your Profile %']}%`, 
      u['Gap %'] > 0 ? `+${u['Gap %']}%` : `${u['Gap %']}%`
    ]);

    let firstTableDraw = true;

    (doc as any).autoTable({
      startY: 60,
      head: [gapHead],
      body: gapBody,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 5,
        valign: 'middle',
        lineColor: [240, 240, 240], // Light grey borders
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [33, 37, 41], // Dark header
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left'
      },
      columnStyles: {
        0: { fontStyle: 'bold' }, // Country
        2: { halign: 'center', textColor: [120, 120, 120] }, // QS
        3: { halign: 'center', textColor: [120, 120, 120] }, // Required
        4: { halign: 'center', textColor: [120, 120, 120] }, // Match
        5: { halign: 'center' } // Gap
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252],
      },
      margin: { left: margin, right: margin, top: 45, bottom: 25 },
      didDrawPage: (data: any) => {
        if (!firstTableDraw) {
          drawPageHeader('03  •  GAP ANALYSIS', 'University Gap Analysis (Cont.)');
        }
        firstTableDraw = false;
      },
      didParseCell: (data: any) => {
        if (data.section === 'body' && data.column.index === 5) {
          // Hide text by matching row background color
          data.cell.styles.textColor = data.row.index % 2 === 0 ? [255, 255, 255] : [252, 252, 252];
        }
      },
      didDrawCell: (data: any) => {
        // Left border logic
        if (data.section === 'body' && data.column.index === 0) {
          const gapStr = gapBody[data.row.index][5];
          const gapVal = parseFloat(gapStr.replace('%', '').replace('+', ''));
          
          let borderColor = [180, 20, 30]; // Red default
          if (gapVal <= 0) borderColor = [100, 100, 200]; // Blueish for safe
          else if (gapVal < 10) borderColor = [255, 193, 7]; // Yellow for target
          
          doc.setFillColor(borderColor[0], borderColor[1], borderColor[2]);
          // Draw a thick left border on the first cell
          doc.rect(data.cell.x, data.cell.y, 2, data.cell.height, 'F');
        }
        
        // Gap pill logic
        if (data.section === 'body' && data.column.index === 5) {
          const gapStr = gapBody[data.row.index][5];
          const gapVal = parseFloat(gapStr.replace('%', '').replace('+', ''));
          
          let pillBg = [252, 232, 233]; // light red
          let pillText = [200, 30, 40]; // dark red
          
          if (gapVal <= 0) {
            pillBg = [235, 235, 250]; // light blue
            pillText = [60, 60, 160]; // dark blue
          } else if (gapVal < 10) {
            pillBg = [255, 245, 220]; // light yellow
            pillText = [180, 130, 20]; // dark yellow
          }
          
          const textW = doc.getTextWidth(gapStr);
          const cellCx = data.cell.x + data.cell.width / 2;
          const cellCy = data.cell.y + data.cell.height / 2;
          
          const paddingX = 4;
          const pillW = textW + paddingX * 2;
          const pillH = 6;
          
          doc.setFillColor(pillBg[0], pillBg[1], pillBg[2]);
          doc.roundedRect(cellCx - pillW/2, cellCy - pillH/2, pillW, pillH, 3, 3, 'F');
          
          doc.setTextColor(pillText[0], pillText[1], pillText[2]);
          doc.setFontSize(8);
          doc.setFont(fontNormal, 'bold');
          doc.text(gapStr, cellCx, cellCy, { align: 'center', baseline: 'middle' });
        }
      }
    });

    // --- PAGE X: SHORTLIST CARDS ---
    let finalY = (doc as any).lastAutoTable.finalY || 0;
    
    // We add a new page for Shortlist
    doc.addPage();
    drawPageHeader('04  •  CURATED SHORTLIST', 'Your Shortlist, Organised by Strategy');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(fontNormal, 'normal');
    doc.text('A balanced list is the foundation of a strong application strategy. Here\'s how your\nclosest-matched universities break down.', margin, 45);

    let currY = 60;
    
    const drawCategoryHeader = (title: string, desc: string, yPos: number, dotColor: number[]) => {
      doc.setFillColor(dotColor[0], dotColor[1], dotColor[2]);
      doc.circle(margin + 2, yPos, 2, 'F');
      
      doc.setTextColor(33, 37, 41);
      doc.setFontSize(14);
      doc.setFont(fontNormal, 'bold');
      doc.text(title, margin + 6, yPos + 1.5);
      
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(9);
      doc.setFont(fontNormal, 'normal');
      doc.text(desc, margin, yPos + 8);
      
      return yPos + 18;
    };
    
    const drawCards = (unis: any[], yPos: number, borderColor: number[], pillBg: number[], pillText: number[]) => {
      const cardW = (pageWidth - 2 * margin - 10) / 3;
      const cardH = 55; // Increased card height for breathing room
      let x = margin;
      let y = yPos;
      
      for (let i = 0; i < Math.min(unis.length, 9); i++) { // Max 9 cards per category for space (3 rows)
        if (i > 0 && i % 3 === 0) {
          x = margin;
          y += cardH + 10;
        }
        
        // Page break check
        if (y + cardH > pageHeight - 20) {
          doc.addPage();
          drawPageHeader('04  •  CURATED SHORTLIST', 'Your Shortlist (Cont.)');
          y = 45;
          x = margin;
        }
        
        const uni = unis[i];
        
        // Card box
        doc.setDrawColor(230, 230, 230);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, y, cardW, cardH, 3, 3, 'FD');
        
        // Top border (Thin line to match web UI)
        doc.setFillColor(borderColor[0], borderColor[1], borderColor[2]);
        // Draw a thin rectangle just inside the rounded corners
        doc.rect(x + 1, y, cardW - 2, 1.2, 'F'); 
        
        // Country pill
        doc.setFontSize(7);
        doc.setFont(fontNormal, 'bold');
        const countryW = doc.getTextWidth(uni.Country);
        const pillW = countryW + 10;
        const pillH = 5;
        doc.setFillColor(pillBg[0], pillBg[1], pillBg[2]);
        doc.roundedRect(x + 5, y + 6, pillW, pillH, 2.5, 2.5, 'F');
        doc.setTextColor(pillText[0], pillText[1], pillText[2]);
        doc.text(uni.Country, x + 5 + pillW / 2, y + 6 + pillH / 2, { align: 'center', baseline: 'middle' });
        
        // QS Rank
        doc.setTextColor(100, 100, 100);
        doc.text(`QS #${uni['QS Ranking'] || 'N/A'}`, x + cardW - 5, y + 6 + pillH / 2, { align: 'right', baseline: 'middle' });
        
        // Uni Name
        doc.setTextColor(33, 37, 41);
        doc.setFontSize(9);
        doc.setFont(fontNormal, 'bold');
        const splitName = doc.splitTextToSize(uni.University, cardW - 10);
        doc.text(splitName, x + 5, y + 20);
        
        // Divider
        doc.setDrawColor(240, 240, 240);
        doc.setLineWidth(0.2);
        doc.line(x + 5, y + 38, x + cardW - 5, y + 38);
        
        // Stats
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.setFont(fontNormal, 'normal');
        doc.text('Required', x + 5, y + 44);
        doc.text('Your Match', x + cardW/2, y + 44, { align: 'center' });
        doc.text('Gap', x + cardW - 5, y + 44, { align: 'right' });
        
        doc.setTextColor(33, 37, 41);
        doc.setFont(fontNormal, 'bold');
        doc.text(`${uni['Required Profile Score']}%`, x + 5, y + 50);
        doc.text(`${uni['Your Profile %']}%`, x + cardW/2, y + 50, { align: 'center' });
        doc.setTextColor(pillText[0], pillText[1], pillText[2]);
        const gapStr2 = uni['Gap %'] > 0 ? `+${uni['Gap %']}%` : `${uni['Gap %']}%`;
        doc.text(gapStr2, x + cardW - 5, y + 50, { align: 'right' });
        
        x += cardW + 5;
      }
      
      const rows = Math.ceil(Math.min(unis.length, 9) / 3);
      return y + (rows > 0 ? cardH : 0) + 15;
    };

    if (results.ambitious.length > 0) {
      currY = drawCategoryHeader('Ambitious Universities', 'Strong picks worth aiming for — your profile is close, with a small gap left to close.', currY, [180, 20, 30]);
      currY = drawCards(results.ambitious, currY, [180, 20, 30], [252, 232, 233], [180, 20, 30]);
    }
    
    if (results.target.length > 0) {
      if (currY > pageHeight - 60) { doc.addPage(); drawPageHeader('04  •  CURATED SHORTLIST', 'Your Shortlist (Cont.)'); currY = 45; }
      currY = drawCategoryHeader('Target Universities', 'Well-matched to your current profile — a realistic core of your application list.', currY, [255, 193, 7]);
      currY = drawCards(results.target, currY, [255, 193, 7], [255, 245, 220], [180, 130, 20]);
    }
    
    if (results.safe.length > 0) {
      if (currY > pageHeight - 60) { doc.addPage(); drawPageHeader('04  •  CURATED SHORTLIST', 'Your Shortlist (Cont.)'); currY = 45; }
      currY = drawCategoryHeader('Safe Universities', 'Your profile already meets or exceeds the benchmark — strong footing for an offer.', currY, [100, 120, 200]);
      currY = drawCards(results.safe, currY, [100, 120, 200], [235, 235, 250], [60, 60, 160]);
    }

    // --- PAGE LAST: CTA ---
    doc.addPage();
    // No header for CTA maybe, just a dark box
    doc.setFillColor(40, 44, 52); // Dark slate
    doc.roundedRect(margin, 30, pageWidth - 2 * margin, 80, 4, 4, 'F');
    
    doc.setTextColor(255, 193, 7); // Yellow
    doc.setFontSize(16);
    doc.setFont(fontNormal, 'bold');
    doc.text('Ready to close the gap?', margin + 15, 45);
    
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.setFont(fontNormal, 'normal');
    doc.text('This report is a snapshot, not a ceiling. Strengthening academics, test scores, and extracurriculars\ncan shift your match percentage meaningfully within a single application cycle. Connect with an\nAbroad Simplified counsellor to turn this data into a personalised action plan.', margin + 15, 55);
    
    // CTA Button
    doc.setFillColor(220, 53, 69);
    doc.roundedRect(margin + 15, 80, 60, 12, 6, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(fontNormal, 'bold');
    doc.text('TALK TO A COUNSELLOR', margin + 45, 87.5, { align: 'center' });

    doc.save('Personalised_University_Report.pdf');
  };

  return (
    <div className={styles.wizardCard}>
      {renderStepper()}
      <div className={styles.resultsHeader}>
        <div>
          <h1 className={styles.wizardTitle} style={{ marginBottom: '4px' }}>Your Results</h1>
          <p style={{ color: '#666' }}>Hi {details.name}, here are the universities mapped to your profile.</p>
        </div>
        <div>
          <button onClick={handleDownloadPDF} className={styles.btnPrimary} style={{ marginRight: '10px' }}>📄 Download PDF</button>
          <button onClick={() => setStep(2)} className={styles.btnSecondary}>← Back to Editor</button>
        </div>
      </div>
      
      {results.ambitious.length > 0 && (
        <>
          <div className={`${styles.categoryTitle} ${styles.ambitious}`}>
            <span className={styles.dot}></span> Ambitious
          </div>
          <div className={styles.cardsRow}>{results.ambitious.map(u => renderCard(u, 'ambitious'))}</div>
        </>
      )}

      {results.target.length > 0 && (
        <>
          <div className={`${styles.categoryTitle} ${styles.target}`}>
            <span className={styles.dot}></span> Target
          </div>
          <div className={styles.cardsRow}>{results.target.map(u => renderCard(u, 'target'))}</div>
        </>
      )}

      {results.safe.length > 0 && (
        <>
          <div className={`${styles.categoryTitle} ${styles.safe}`}>
            <span className={styles.dot}></span> Safe
          </div>
          <div className={styles.cardsRow}>{results.safe.map(u => renderCard(u, 'safe'))}</div>
        </>
      )}

      {results.all.length === 0 && (
        <div className={styles.wizardCard}>
          No universities matched your profile. Try adjusting your scores or selected countries.
        </div>
      )}
    </div>
  );
}
