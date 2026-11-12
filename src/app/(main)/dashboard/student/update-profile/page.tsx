import { redirect } from 'next/navigation';

// Legacy URL — kept so existing links (assessment pages, emails, bookmarks) keep working.
export default function LegacyUpdateProfileRedirect() {
  redirect('/dashboard/student/profile/edit');
}
