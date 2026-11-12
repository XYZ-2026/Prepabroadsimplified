import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import PortfolioEditor, { type PortfolioSection } from '@/components/Dashboard/Student/PortfolioEditor';
import { getPortfolioByUid } from '@/lib/portfolio-service';
import type { PortfolioRecord } from '@/components/portfolio/portfolioTypes';
import styles from '@/styles/student-dashboard.module.css';

export const metadata: Metadata = { title: 'Extracurriculars' };

export default async function ExtracurricularsPage() {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');
  if (claims.role !== 'student') redirect('/dashboard');

  let defaults = { fullName: claims.name || '', grade: '', stream: '', school: '', city: '', email: claims.email || '' };
  try {
    const snap = await adminDb.collection('users').doc(claims.uid).get();
    if (snap.exists) {
      const d = snap.data() || {};
      const grade = String(d.grade || d.academicGrade || '').trim();
      defaults = {
        fullName: d.name || defaults.fullName,
        grade: /^\d+$/.test(grade) ? `Grade ${grade}` : grade,
        stream: d.stream || d.board || '',
        school: d.currentSchool || d.schoolName || '',
        city: d.city || '',
        email: d.email || defaults.email,
      };
    }
  } catch (err) {
    console.error('Error loading profile defaults for extracurriculars:', err);
  }

  let portfolio: PortfolioRecord | null = null;
  let loadFailed = false;
  try {
    portfolio = await getPortfolioByUid(claims.uid);
  } catch (err) {
    loadFailed = true;
    console.error('Error fetching student portfolio:', err);
  }

  const lists: PortfolioSection[] = ['activities', 'projects', 'awards', 'certifications', 'skills'];
  // First-time visitors also need a portfolio link (username) so the record can be created.
  const sections: PortfolioSection[] = portfolio ? lists : ['basics', ...lists];

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Extracurriculars</h1>
        <p className={styles.pageSubtitle}>
          Your activities, projects, achievements and skills — the evidence behind your applications. They also power your
          public portfolio.
        </p>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
          Your photo, bio and links live in{' '}
          <Link href="/dashboard/student/profile/edit" style={{ color: '#2563eb', fontWeight: 700 }}>Update Profile</Link>.
        </p>
      </div>

      <PortfolioEditor
        initialRecord={portfolio}
        loadFailed={loadFailed}
        title="Activities & Achievements"
        sections={sections}
        startHidden
        defaults={defaults}
      />
    </div>
  );
}
