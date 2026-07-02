import UniversityFinderWizard from '@/components/UniversityFinder/UniversityFinderWizard';
import { verifySessionCookie, getUserProfile } from '@/lib/auth';
import AccessRestricted from '@/components/Auth/AccessRestricted';
import styles from '@/styles/university-finder.module.css';

export default async function UniversityFinderPage() {
  const claims = await verifySessionCookie();
  const profile = claims ? await getUserProfile() : null;

  if (!claims) {
    return (
      <main className="main-content" style={{ minHeight: '100vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <AccessRestricted />
      </main>
    );
  }

  const firstName = profile?.name ? profile.name.split(' ')[0] : (claims.email === 'admin@admin.com' ? 'admin' : 'Student');

  return (
    <>
      <main className="main-content" style={{ minHeight: '80vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div className={styles.greetingBox}>
            📣 Hi <span className={styles.greetingName}>{firstName}</span>, ready to find your ideal university?
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroTag}>STUDY ABROAD HUB</div>
            <h1 className={styles.heroTitle}>University Predictor</h1>
            <p className={styles.heroDesc}>
              Strategic predictor for global university admissions. Uses your academic profile to find the most accurate university matches.
            </p>
          </div>

          <UniversityFinderWizard />
        </div>
      </main>
    </>
  );
}
