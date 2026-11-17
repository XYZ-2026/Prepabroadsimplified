import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import PortfolioEditor from '@/components/Dashboard/Student/PortfolioEditor';
import { getPortfolioByUid } from '@/lib/portfolio-service';
import { formatGradeLabel, normalizeGrade } from '@/lib/psychometric-access-policy';
import type { PortfolioRecord } from '@/components/portfolio/portfolioTypes';
import styles from '@/styles/student-dashboard.module.css';

export const metadata: Metadata = { title: 'My Portfolio' };

// One place for the whole portfolio: profile & story, activities, projects, awards,
// certificates, skills, journey and links — plus a preview of how it looks.
export default async function PortfolioPage() {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');
  if (claims.role !== 'student') redirect('/dashboard');

  let defaults = { fullName: claims.name || '', grade: '', stream: '', school: '', city: '', email: claims.email || '' };
  try {
    const snap = await adminDb.collection('users').doc(claims.uid).get();
    if (snap.exists) {
      const d = snap.data() || {};
      const rawGrade = String(d.grade || d.academicGrade || '').trim();
      const isUg = normalizeGrade(rawGrade) === 'UG';
      defaults = {
        fullName: d.name || defaults.fullName,
        grade: normalizeGrade(rawGrade) ? formatGradeLabel(rawGrade) : rawGrade,
        // Undergraduates show their course; school students their stream (or board)
        stream: isUg ? d.ugCourse || '' : d.stream || d.board || '',
        school: d.currentSchool || d.schoolName || '',
        city: d.city || '',
        email: d.email || defaults.email,
      };
    }
  } catch (err) {
    console.error('Error loading profile defaults for portfolio:', err);
  }

  let portfolio: PortfolioRecord | null = null;
  let loadFailed = false;
  try {
    portfolio = await getPortfolioByUid(claims.uid);
  } catch (err) {
    loadFailed = true;
    console.error('Error fetching student portfolio:', err);
  }

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Portfolio</h1>
        <p className={styles.pageSubtitle}>
          Build your complete portfolio in one place — your photo and story, activities, projects, achievements and
          skills — then preview it and share your link.
        </p>
      </div>

      <PortfolioEditor
        initialRecord={portfolio}
        loadFailed={loadFailed}
        title="Portfolio Builder"
        startHidden
        previewHref="/dashboard/student/portfolio/preview"
        defaults={defaults}
      />
    </div>
  );
}
