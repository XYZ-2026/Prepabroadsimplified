import { redirect } from 'next/navigation';

// Legacy URL — extracurriculars are now part of the single "My Portfolio" page.
// Kept so existing links and bookmarks keep working.
export default function LegacyExtracurricularsRedirect() {
  redirect('/dashboard/student/portfolio');
}
