import UniversityFinderWizard from '@/components/UniversityFinder/UniversityFinderWizard';
import { verifySessionCookie, getUserProfile } from '@/lib/auth';
import AccessRestricted from '@/components/Auth/AccessRestricted';
import ToolLocked from '@/components/Auth/ToolLocked';
import styles from '@/styles/university-finder.module.css';
import { Megaphone } from 'lucide-react';

export default async function UniversityFinderPage() {
  const claims = await verifySessionCookie();
  const profile = claims ? await getUserProfile() : null;

  if (!claims) {
    return (
      <main style={{ minHeight: '100vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <AccessRestricted />
      </main>
    );
  }

  if (profile?.toolAccess && profile.toolAccess.universityPredictor === false) {
    return (
      <main style={{ minHeight: '100vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <ToolLocked toolName="University Predictor" toolId="universityPredictor" />
      </main>
    );
  }

  const firstName = profile?.name ? profile.name.split(' ')[0] : (claims.email === 'admin@as.com' ? 'admin' : 'Student');

  return (
    <>
      <main style={{ minHeight: '80vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div className={styles.greetingBox}>
            <Megaphone className="w-5 h-5 text-[#690b1b]" />
            <span>Hi <span className={styles.greetingName}>{firstName}</span>, ready to find your ideal university?</span>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroTag}>STUDY ABROAD HUB</div>
            <h1 className={styles.heroTitle}>University Predictor</h1>
            <p className={styles.heroDesc}>
              Strategic predictor for global university admissions. Uses your academic profile to find the most accurate university matches.
            </p>
          </div>

          <UniversityFinderWizard 
            initialDetails={profile ? {
              name: profile.name || '',
              email: profile.email || '',
              mobile: profile.mobile || '',
              state: profile.state || '',
              city: profile.city || '',
            } : undefined} 
          />
        </div>
      </main>
    </>
  );
}
