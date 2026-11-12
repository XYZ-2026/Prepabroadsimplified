// Single source of truth for the student navigation tree.

export interface NavItem {
  label: string;
  href: string;
  /** 'exact' = pathname must equal href; 'prefix' = pathname starts with href */
  match: 'exact' | 'prefix';
  icon: 'user' | 'file' | 'trophy' | 'pen' | 'bookmark' | 'book' | 'brain' | 'search' | 'users' | 'settings';
}

export const STUDENT_DASHBOARD_ITEMS: NavItem[] = [
  { label: 'My Profile', href: '/dashboard/student/profile', match: 'prefix', icon: 'user' },
  { label: 'My Assessments', href: '/dashboard/student/assessments', match: 'exact', icon: 'file' },
  { label: 'Extracurriculars', href: '/dashboard/student/extracurriculars', match: 'prefix', icon: 'trophy' },
  { label: 'SOP & Essays', href: '/dashboard/student/essays', match: 'prefix', icon: 'pen' },
  { label: 'Saved Careers', href: '/dashboard/student/saved-careers', match: 'prefix', icon: 'bookmark' },
];

/** Tools shown after the Psychometric Tests accordion (which keeps its own bespoke markup). */
export const TOOL_ITEMS: NavItem[] = [
  { label: 'Career Library', href: '/career-library', match: 'exact', icon: 'book' },
  { label: 'IQ Test', href: '/iq-test', match: 'exact', icon: 'brain' },
  { label: 'University Predictor', href: '/university-finder', match: 'exact', icon: 'search' },
];

export const RESOURCE_ITEMS: NavItem[] = [
  { label: 'Admitted Profiles', href: '/dashboard/student/admitted-students', match: 'prefix', icon: 'users' },
  { label: 'Admitted Essays', href: '/dashboard/student/sops', match: 'prefix', icon: 'file' },
  { label: 'Settings', href: '/dashboard/student/settings', match: 'prefix', icon: 'settings' },
];

export function isNavActive(item: NavItem, pathname: string): boolean {
  if (item.href === '/career-library') {
    return pathname === '/career-library' || pathname === '/dashboard/career-library';
  }
  return item.match === 'exact'
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
