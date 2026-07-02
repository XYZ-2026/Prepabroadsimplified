'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/university-finder.module.css';
import { predictUniversities, UserProfile, PredictionResult, UniversityResult } from '@/lib/university-predictor';

export default function UniversityFinderWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [details, setDetails] = useState({ name: '', email: '', mobile: '', state: '', city: '' });
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
      }
    } catch (e) { }
  }, []);

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
          <button onClick={() => setStep(1)} className={styles.btnSecondary}>Edit Details</button>
        </div>
        
        <p style={{ marginBottom: '20px', color: '#666' }}>Hi {details.name}! We'll personalise suggestions for {details.city}, {details.state}.</p>

        <div className={styles.grid2}>
          <div>
            <div className={styles.inputGroup}>
              <label>Class 9 %</label>
              <input type="number" min="0" max="100" value={profile.c9 || ''} onChange={e => setProfile({...profile, c9: Number(e.target.value)})} />
            </div>
            <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
              <label>Class 10 %</label>
              <input type="number" min="0" max="100" value={profile.c10 || ''} onChange={e => setProfile({...profile, c10: Number(e.target.value)})} />
            </div>
            <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
              <label>Class 11 %</label>
              <input type="number" min="0" max="100" value={profile.c11 || ''} onChange={e => setProfile({...profile, c11: Number(e.target.value)})} />
            </div>
            <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
              <label>Class 12 %</label>
              <input type="number" min="0" max="100" value={profile.c12 || ''} onChange={e => setProfile({...profile, c12: Number(e.target.value)})} />
            </div>
            <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
              <label>SAT/ACT (400-1600)</label>
              <input type="number" min="400" max="1600" value={profile.sat || ''} onChange={e => setProfile({...profile, sat: Number(e.target.value)})} />
            </div>
          </div>
          <div>
            <div className={styles.inputGroup}>
              <label>Co-curricular (0-3)</label>
              <input type="number" min="0" max="3" value={profile.cc || ''} onChange={e => setProfile({...profile, cc: Number(e.target.value)})} />
            </div>
            <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
              <label>Extra-curricular (0-3)</label>
              <input type="number" min="0" max="3" value={profile.ec || ''} onChange={e => setProfile({...profile, ec: Number(e.target.value)})} />
            </div>
            <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
              <label>Internships (0-2)</label>
              <select value={profile.intr} onChange={e => setProfile({...profile, intr: Number(e.target.value)})}>
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
              <label>Number of LORs (0-3)</label>
              <select value={profile.n_lor} onChange={e => setProfile({...profile, n_lor: Number(e.target.value)})}>
                <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={styles.inputGroup}>
            <label>Number of APs (0–5)</label>
            <input type="number" min="0" max="5" value={n_ap} onChange={e => {
              const val = Math.min(5, Math.max(0, Number(e.target.value)));
              setNAp(val);
              setApScores(Array(val).fill(0));
            }} />
          </div>
          <button onClick={handlePredict} className={styles.btnPrimary}>🔍 Find My Universities</button>
        </div>
        
        {n_ap > 0 && (
          <div style={{ marginTop: '20px' }}>
            {Array.from({ length: n_ap }).map((_, i) => (
              <div key={i} className={styles.inputGroup} style={{ marginBottom: '8px' }}>
                <label>AP {i+1} score (0.0 - 5.0)</label>
                <input type="number" step="0.1" min="0" max="5" value={apScores[i] || ''} onChange={e => {
                  const newScores = [...apScores];
                  newScores[i] = Number(e.target.value);
                  setApScores(newScores);
                }} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render Step 3 (Results)
  if (!results) return null;

  const renderCard = (uni: UniversityResult, categoryClass: string) => (
    <div key={uni.University} className={`${styles.uniCard} ${styles[categoryClass]}`}>
      <div className={styles.uniName}>{uni.University}</div>
      <div style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
        {uni.Country} · QS #{uni['QS Ranking'] || 'N/A'}
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

    // --- PAGE 1: COVER PAGE ---
    // Premium dark header banner
    doc.setFillColor(33, 37, 41);
    doc.rect(0, 0, pageWidth, 120, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.text('Abroad Simplified', pageWidth / 2, 60, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text('Personalised University Report', pageWidth / 2, 75, { align: 'center' });
    
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(14);
    doc.text(`Prepared for: ${details.name}`, pageWidth / 2, 160, { align: 'center' });
    doc.text(`Location: ${details.city}, ${details.state}`, pageWidth / 2, 170, { align: 'center' });
    
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${today}`, pageWidth / 2, pageHeight - 30, { align: 'center' });

    doc.addPage();

    // --- PAGE 2: USER DETAILS & COUNTRY SCORES ---
    doc.setFontSize(22);
    doc.setTextColor(33, 37, 41);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Profile Summary', 14, 25);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(73, 80, 87);
    
    // Draw a box for student info
    doc.setDrawColor(222, 226, 230);
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(14, 32, pageWidth - 28, 40, 3, 3, 'FD');

    doc.setTextColor(33, 37, 41);
    doc.setFont('helvetica', 'bold');
    doc.text('Contact Information', 20, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${details.name}`, 20, 50);
    doc.text(`Email: ${details.email}`, 20, 58);
    doc.text(`Mobile: ${details.mobile}`, 110, 50);
    doc.text(`Location: ${details.city}, ${details.state}`, 110, 58);

    let y = 85;

    // Helper for rendering tables
    const renderSection = (title: string, head: string[], body: any[][], headFill: number[], headText: number[], forceNewPage: boolean = true) => {
      if (body.length === 0) return;
      
      if (forceNewPage) {
        doc.addPage();
        y = 25;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(33, 37, 41);
      doc.text(title, 14, y);
      
      (doc as any).autoTable({
        startY: y + 6,
        head: [head],
        body: body,
        theme: 'striped',
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 6,
        },
        headStyles: {
          fillColor: headFill,
          textColor: headText,
          fontStyle: 'bold',
          halign: 'left',
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250],
        },
        margin: { top: 20, bottom: 20 },
      });
      
      y = (doc as any).lastAutoTable.finalY + 20;
    };

    const countryHead = ['Country', 'Total Profile Match (%)'];
    const countryBody = results.countryScores.map(c => [c.Country, c['Total Profile %']]);
    renderSection('Country-wise Readiness', countryHead, countryBody, [52, 58, 64], [255, 255, 255], true);

    const gapHead = ['Country', 'University', 'QS Ranking', 'Required Profile Score', 'Your Profile %', 'Gap %'];
    const gapBody = results.all.map(u => [u.Country, u.University, u['QS Ranking'] || 'N/A', u['Required Profile Score'], u['Your Profile %'], u['Gap %']]);
    renderSection('University Gap Analysis', gapHead, gapBody, [52, 58, 64], [255, 255, 255], true);

    const uniHead = ['Country', 'University', 'QS Ranking', 'Required Score', 'Your Match %', 'Gap %'];
    
    const ambBody = results.ambitious.map(u => [u.Country, u.University, u['QS Ranking'] || 'N/A', u['Required Profile Score'], u['Your Profile %'], u['Gap %']]);
    renderSection('Ambitious Universities', uniHead, ambBody, [211, 47, 47], [255, 255, 255], true);

    const tgtBody = results.target.map(u => [u.Country, u.University, u['QS Ranking'] || 'N/A', u['Required Profile Score'], u['Your Profile %'], u['Gap %']]);
    renderSection('Target Universities', uniHead, tgtBody, [25, 118, 210], [255, 255, 255], true);

    const safeBody = results.safe.map(u => [u.Country, u.University, u['QS Ranking'] || 'N/A', u['Required Profile Score'], u['Your Profile %'], u['Gap %']]);
    renderSection('Safe Universities', uniHead, safeBody, [56, 142, 60], [255, 255, 255], true);

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
