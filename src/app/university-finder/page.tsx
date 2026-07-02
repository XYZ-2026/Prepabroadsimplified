import Topbar from '@/components/Layout/Topbar';
import Sidebar from '@/components/Layout/Sidebar';
import Footer from '@/components/Layout/Footer';
import UniversityFinderWizard from '@/components/UniversityFinder/UniversityFinderWizard';

export default function UniversityFinderPage() {
  return (
    <>
      <Topbar />
      <div className="sidebar-overlay" />
      <Sidebar userRole={null} />
      
      <main className="main-content" style={{ minHeight: '80vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <UniversityFinderWizard />
        </div>
      </main>

      <Footer />
    </>
  );
}
