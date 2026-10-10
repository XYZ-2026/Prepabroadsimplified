'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth as clientAuth, db as clientDb } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import styles from '@/styles/auth.module.css';
import componentsStyles from '@/styles/components.module.css';
import { 
  AcademicGrade, 
  formatGradeLabel, 
  getStudentPsychometricAccess, 
  normalizeGrade 
} from '@/lib/psychometric-access-policy';

type Tab = 'login' | 'register' | 'forgot';

const GOAL_OPTIONS = [
  { id: 'career_exploration', title: 'Career Exploration', sub: 'Discover aligned industries & tracks', icon: '🧭' },
  { id: 'stream_selection', title: 'Stream Selection', sub: 'Class 10 to 11 subject combinations', icon: '🎯' },
  { id: 'university_discovery', title: 'University Discovery', sub: 'Find global & domestic colleges', icon: '🏛️' },
  { id: 'study_abroad', title: 'Study Abroad Guidance', sub: 'Country fitment, exams & admissions', icon: '✈️' },
  { id: 'strengths_skills', title: 'Strengths & Skill Audit', sub: 'Assess aptitude & cognitive traits', icon: '⚡' },
  { id: 'academic_roadmap', title: 'Academic Roadmap', sub: 'Strategic milestones for school years', icon: '🗺️' },
];

const INTEREST_AREAS = [
  'Technology & AI',
  'Robotics & Engineering',
  'Medicine & Life Sciences',
  'Business & Finance',
  'Design & Architecture',
  'Law & Policy',
  'Psychology & Human Behavior',
  'Media & Journalism',
  'Pure Sciences & Research',
];

const BOARD_OPTIONS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];

const STREAM_OPTIONS = [
  { id: 'Science (PCM)', title: 'Science (PCM)', sub: 'Physics, Chemistry, Mathematics' },
  { id: 'Science (PCB)', title: 'Science (PCB)', sub: 'Physics, Chemistry, Biology' },
  { id: 'Commerce', title: 'Commerce', sub: 'Accounts, Business Studies, Economics' },
  { id: 'Humanities / Arts', title: 'Humanities / Arts', sub: 'Psychology, Sociology, Political Science' },
];

const STATE_OPTIONS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Other'
];

interface AuthFormProps {
  defaultTab?: Tab;
}

export default function AuthForm({ defaultTab }: AuthFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialTab = (): Tab => {
    if (defaultTab) return defaultTab;
    if (typeof window !== 'undefined' && searchParams) {
      const tabParam = searchParams.get('tab');
      const modeParam = searchParams.get('mode');
      if (tabParam === 'register' || modeParam === 'signup') return 'register';
      if (tabParam === 'forgot') return 'forgot';
    }
    return 'login';
  };

  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab);

  useEffect(() => {
    if (searchParams) {
      const tabParam = searchParams.get('tab');
      const modeParam = searchParams.get('mode');
      if (tabParam === 'register' || modeParam === 'signup') {
        setActiveTab('register');
      } else if (tabParam === 'login' || modeParam === 'signin') {
        setActiveTab('login');
      } else if (tabParam === 'forgot') {
        setActiveTab('forgot');
      }
    }
  }, [searchParams]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register multi-step wizard state
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Basic Identity
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regRole, setRegRole] = useState<'student' | 'counsellor'>('student');

  // Step 2: Academic Profile
  const [regGrade, setRegGrade] = useState<AcademicGrade | ''>('');
  const [regSchool, setRegSchool] = useState('');
  const [regBoard, setRegBoard] = useState('CBSE');
  const [regCustomBoard, setRegCustomBoard] = useState('');
  const [regStream, setRegStream] = useState('');
  const [regState, setRegState] = useState('');
  const [regCity, setRegCity] = useState('');

  // Step 3: Goals & Interests
  const [regGoals, setRegGoals] = useState<string[]>(['Career Exploration', 'University Discovery']);
  const [regInterests, setRegInterests] = useState<string[]>(['Technology & AI']);

  // Step 4: Account Security
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Post-Registration Welcome State
  const [welcomeData, setWelcomeData] = useState<{
    name: string;
    grade: string;
    assessmentName: string;
    href: string;
  } | null>(null);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');

  // Password visibility state
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Toggle goal selection
  const toggleGoal = (goalTitle: string) => {
    setRegGoals(prev => 
      prev.includes(goalTitle) ? prev.filter(g => g !== goalTitle) : [...prev, goalTitle]
    );
  };

  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    setRegInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(clientAuth, provider);
      const user = userCredential.user;

      const userRef = doc(clientDb, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      let isNewUser = false;
      if (!userSnap.exists()) {
        isNewUser = true;
        await setDoc(userRef, {
          name: user.displayName || '',
          email: user.email || '',
          mobile: '',
          role: 'student',
          grade: '',
          academicGrade: '',
          currentSchool: '',
          schoolName: '',
          board: '',
          stream: '',
          state: '',
          city: '',
          toolAccess: {
            iqTest: true,
            psychometricTest: true,
            universityPredictor: true,
          },
          createdAt: serverTimestamp(),
        });
      } else {
        const data = userSnap.data();
        if (!data.grade && !data.academicGrade) {
          isNewUser = true;
        }
      }

      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session on server');
      }

      if (isNewUser) {
        router.push('/dashboard/student/update-profile');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword;

    try {
      const userCredential = await signInWithEmailAndPassword(clientAuth, cleanEmail, cleanPassword);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session on server');
      }

      router.push('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 1 Validation & Proceed
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!regMobile.trim() || regMobile.trim().length < 8) {
      setError('Please enter a valid mobile number');
      return;
    }
    setRegStep(2);
  };

  // Step 2 Validation & Proceed
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regRole === 'student') {
      if (!regGrade) {
        setError('Please select your current grade (Grade 7 to 12)');
        return;
      }
      if (!regSchool.trim()) {
        setError('Please enter your school or institution name');
        return;
      }
      if (regBoard === 'Other' && !regCustomBoard.trim()) {
        setError('Please specify your education board');
        return;
      }
      if ((regGrade === '11' || regGrade === '12') && !regStream) {
        setError('Please select your stream (Science, Commerce, or Humanities)');
        return;
      }
      if (!regState) {
        setError('Please select your state');
        return;
      }
      if (!regCity.trim()) {
        setError('Please enter your city');
        return;
      }
    }
    setRegStep(3);
  };

  // Step 3 Validation & Proceed
  const handleStep3Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regGoals.length === 0) {
      setError('Please select at least one primary goal');
      return;
    }
    setRegStep(4);
  };

  // Final Registration Submission (Step 4)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const cleanEmail = regEmail.trim().toLowerCase();

    try {
      const userCredential = await createUserWithEmailAndPassword(clientAuth, cleanEmail, regPassword);
      const user = userCredential.user;

      const normalizedGrade = regRole === 'student' && regGrade ? normalizeGrade(regGrade) : null;
      const finalBoard = regBoard === 'Other' && regCustomBoard.trim() ? regCustomBoard.trim() : regBoard;
      const isSenior = normalizedGrade === '11' || normalizedGrade === '12';

      const userProfilePayload: Record<string, any> = {
        name: regName.trim(),
        email: cleanEmail,
        mobile: regMobile.trim(),
        role: regRole, // strictly student or counsellor - no public admin escalation
        state: regState,
        city: regCity.trim(),
        currentSchool: regSchool.trim(),
        schoolName: regSchool.trim(),
        board: finalBoard,
        stream: isSenior ? regStream : '',
        goals: regGoals,
        declaredInterests: regInterests,
        onboarding: {
          goals: regGoals,
          declaredInterests: regInterests,
          registeredAt: new Date().toISOString(),
        },
        toolAccess: {
          iqTest: true,
          psychometricTest: true,
          universityPredictor: true,
        },
        createdAt: serverTimestamp(),
      };

      if (normalizedGrade) {
        userProfilePayload.grade = normalizedGrade;
        userProfilePayload.academicGrade = normalizedGrade;
        userProfilePayload.studentType = isSenior ? 'Class 11/12' : `Grade ${normalizedGrade}`;
      }

      await setDoc(doc(clientDb, 'users', user.uid), userProfilePayload);

      // Create session on server
      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session on server');
      }

      // Resolve eligible assessment for Welcome screen
      if (regRole === 'student' && normalizedGrade) {
        const access = getStudentPsychometricAccess(normalizedGrade);
        setWelcomeData({
          name: regName.trim(),
          grade: formatGradeLabel(normalizedGrade),
          assessmentName: access.eligibleTestName,
          href: access.eligibleHref,
        });
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. Please sign in instead.');
      } else {
        setError(err.message || 'Failed to complete registration');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const cleanEmail = forgotEmail.trim().toLowerCase();

    try {
      await sendPasswordResetEmail(clientAuth, cleanEmail);
      setMessage('Password reset email sent! Check your inbox.');
      setForgotEmail('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* Tab Switcher - only show if not in post-registration welcome */}
      {!welcomeData && (
        <div className={styles.authTabs}>
          <button
            className={`${styles.authTab} ${activeTab === 'login' ? styles.authTabActive : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); setMessage(''); }}
          >
            Sign In
          </button>
          <button
            className={`${styles.authTab} ${activeTab === 'register' ? styles.authTabActive : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); setMessage(''); }}
          >
            Register
          </button>
          <button
            className={`${styles.authTab} ${activeTab === 'forgot' ? styles.authTabActive : ''}`}
            onClick={() => { setActiveTab('forgot'); setError(''); setMessage(''); }}
          >
            Forgot Password
          </button>
        </div>
      )}

      {error && <div className={`${styles.authError} ${styles.authErrorVisible}`}>{error}</div>}
      {message && <div className={`${styles.authMessage} ${styles.authMessageVisible}`}>{message}</div>}

      {/* ── POST REGISTRATION WELCOME SCREEN ── */}
      {welcomeData && (
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeIconWrapper}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h2 className={styles.welcomeHeading}>Welcome, {welcomeData.name}!</h2>
          <p className={styles.welcomeSub}>
            Your student profile has been configured for <strong>{welcomeData.grade}</strong>.
          </p>

          <div className={styles.unlockedAssessmentBanner}>
            <span className={styles.unlockedBadge}>AVAILABLE NOW</span>
            <h3 className={styles.unlockedTitle}>{welcomeData.assessmentName}</h3>
            <p className={styles.unlockedDescription}>
              Tailored specifically to your current academic stage. You can begin whenever you're ready — no pressure to start immediately.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => router.push(welcomeData.href)}
              className={`${componentsStyles.btn} ${componentsStyles.btnPrimary} ${styles.btnBlock}`}
              style={{ fontSize: '15px', padding: '12px' }}
            >
              Explore Assessment →
            </button>
            <button
              onClick={() => router.push('/dashboard/student/profile')}
              className={`${componentsStyles.btn} ${componentsStyles.btnOutline} ${styles.btnBlock}`}
              style={{ fontSize: '14px', padding: '10px', background: '#fff' }}
            >
              Go to Student Dashboard
            </button>
          </div>
        </div>
      )}

      {/* ── LOGIN FORM ── */}
      {!welcomeData && activeTab === 'login' && (
        <div className={styles.authFormContainerActive}>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="login-password">Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  id="login-password"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className={styles.passwordToggleBtn} 
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showLoginPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`${componentsStyles.btn} ${componentsStyles.btnPrimary} ${styles.btnBlock}`}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
            <span style={{ padding: '0 8px', color: '#888', fontSize: '12px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`${componentsStyles.btn} ${styles.btnBlock}`}
            style={{ background: '#fff', color: '#333', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p className={styles.authFooterLink}>
            No account? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('register'); setRegStep(1); }}>Register free →</a>
          </p>
        </div>
      )}

      {/* ── 4-STEP ONBOARDING REGISTER FORM ── */}
      {!welcomeData && activeTab === 'register' && (
        <div className={styles.authFormContainerActive}>
          {/* Step Progress Header */}
          <div className={styles.wizardHeader}>
            <div className={styles.wizardProgressBarTrack}>
              <div 
                className={styles.wizardProgressBarFill}
                style={{ width: `${(regStep / 4) * 100}%` }}
              />
            </div>
            <div className={styles.wizardStepsRow}>
              {[
                { s: 1, label: 'Identity' },
                { s: 2, label: 'Academic' },
                { s: 3, label: 'Goals' },
                { s: 4, label: 'Account' },
              ].map(step => {
                const isDone = regStep > step.s;
                const isActive = regStep === step.s;
                return (
                  <div 
                    key={step.s}
                    className={`${styles.wizardStepItem} ${isActive ? styles.wizardStepItemActive : ''} ${isDone ? styles.wizardStepItemDone : ''}`}
                  >
                    <div className={styles.wizardStepCircle}>
                      {isDone ? '✓' : step.s}
                    </div>
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── STEP 1: Basic Identity ── */}
          {regStep === 1 && (
            <form onSubmit={handleStep1Next}>
              <h3 className={styles.wizardSectionTitle}>Basic Identity</h3>
              <p className={styles.wizardSectionSubtitle}>Let's start with your profile details.</p>

              <div className={styles.formGroup}>
                <label htmlFor="reg-name">Full Name</label>
                <input
                  type="text"
                  id="reg-name"
                  required
                  placeholder="Rahul Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-email">Email Address</label>
                  <input
                    type="email"
                    id="reg-email"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="rahul@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-mobile">Mobile Number</label>
                  <input
                    type="tel"
                    id="reg-mobile"
                    required
                    placeholder="98765 43210"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Registering As</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRegRole('student')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: regRole === 'student' ? '2px solid #690b1b' : '1px solid #e2e8f0',
                      background: regRole === 'student' ? 'rgba(105, 11, 27, 0.06)' : '#fff',
                      color: regRole === 'student' ? '#690b1b' : '#64748b',
                      fontWeight: regRole === 'student' ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('counsellor')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: regRole === 'counsellor' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                      background: regRole === 'counsellor' ? 'rgba(124, 58, 237, 0.06)' : '#fff',
                      color: regRole === 'counsellor' ? '#7c3aed' : '#64748b',
                      fontWeight: regRole === 'counsellor' ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    💼 Counsellor
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`${componentsStyles.btn} ${componentsStyles.btnPrimary} ${styles.btnBlock}`}
                style={{ marginTop: '14px' }}
              >
                Continue to Academic Profile →
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 10px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
                <span style={{ padding: '0 8px', color: '#888', fontSize: '11px' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`${componentsStyles.btn} ${styles.btnBlock}`}
                style={{ background: '#fff', color: '#333', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Sign up with Google
              </button>
            </form>
          )}

          {/* ── STEP 2: Academic Profile ── */}
          {regStep === 2 && (
            <form onSubmit={handleStep2Next}>
              <h3 className={styles.wizardSectionTitle}>Academic Profile</h3>
              <p className={styles.wizardSectionSubtitle}>
                Your selected grade determines your psychometric test eligibility.
              </p>

              {/* Prominent Grade Selector */}
              <div className={styles.gradeSectionWrapper}>
                <div className={styles.gradeGridLabel}>
                  <span>I'm Currently In:</span>
                  {regGrade && <span style={{ color: '#690b1b' }}>Selected: Grade {regGrade}</span>}
                </div>
                <div className={styles.gradeGrid}>
                  {(['7', '8', '9', '10', '11', '12'] as AcademicGrade[]).map(grade => {
                    const isSelected = regGrade === grade;
                    const isJunior = ['7', '8', '9'].includes(grade);
                    const isClass10 = grade === '10';
                    const isSenior = ['11', '12'].includes(grade);
                    return (
                      <div
                        key={grade}
                        onClick={() => {
                          setRegGrade(grade);
                          if (['7', '8', '9', '10'].includes(grade)) {
                            setRegStream('');
                          }
                        }}
                        className={`${styles.gradeCard} ${isSelected ? styles.gradeCardActive : ''}`}
                      >
                        {isSelected && <span className={styles.gradeCardBadge}>✓</span>}
                        <span className={styles.gradeCardNumber}>Grade {grade}</span>
                        <span className={styles.gradeCardSub}>
                          {isJunior ? 'Class 7–9' : isClass10 ? 'Class 10' : 'Senior'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Senior Stream Selector for 11-12 */}
              {(regGrade === '11' || regGrade === '12') && (
                <div className={styles.streamWrapper}>
                  <div className={styles.streamTitle}>
                    <span>Academic Stream (Required for Grade {regGrade}):</span>
                  </div>
                  <div className={styles.streamGrid}>
                    {STREAM_OPTIONS.map(stream => {
                      const isSelected = regStream === stream.id;
                      return (
                        <div
                          key={stream.id}
                          onClick={() => setRegStream(stream.id)}
                          className={`${styles.streamCard} ${isSelected ? styles.streamCardActive : ''}`}
                        >
                          <div className={styles.streamCardName}>{stream.title}</div>
                          <div className={styles.streamCardSub}>{stream.sub}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* School Name */}
              <div className={styles.formGroup} style={{ marginTop: '0.9rem' }}>
                <label htmlFor="reg-school">School / College Name</label>
                <input
                  type="text"
                  id="reg-school"
                  required
                  placeholder="e.g. Delhi Public School, R.K. Puram"
                  value={regSchool}
                  onChange={(e) => setRegSchool(e.target.value)}
                />
              </div>

              {/* Board Selection */}
              <div className={styles.formGroup}>
                <label>Education Board</label>
                <div className={styles.boardPillsWrapper}>
                  {BOARD_OPTIONS.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setRegBoard(b)}
                      className={`${styles.boardPill} ${regBoard === b ? styles.boardPillActive : ''}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                {regBoard === 'Other' && (
                  <input
                    type="text"
                    style={{ marginTop: '8px' }}
                    placeholder="Specify Board (e.g. State Board Maharashtra, NIOS)"
                    value={regCustomBoard}
                    onChange={(e) => setRegCustomBoard(e.target.value)}
                    required
                  />
                )}
              </div>

              {/* State and City */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-state">State</label>
                  <select
                    id="reg-state"
                    required
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                  >
                    <option value="" disabled>Select State</option>
                    {STATE_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-city">City</label>
                  <input
                    type="text"
                    id="reg-city"
                    required
                    placeholder="e.g. Mumbai"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setRegStep(1)}
                  className={`${componentsStyles.btn} ${componentsStyles.btnOutline}`}
                  style={{ flex: 1 }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}
                  style={{ flex: 2 }}
                >
                  Continue to Goals →
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: Goals & Interests ── */}
          {regStep === 3 && (
            <form onSubmit={handleStep3Next}>
              <h3 className={styles.wizardSectionTitle}>Goals &amp; Interests</h3>
              <p className={styles.wizardSectionSubtitle}>
                Tell us what you want to achieve. These self-reported preferences customize your guidance and do not modify test scores.
              </p>

              {/* Primary Goals */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  What are your top priorities? (Select 1 or more)
                </label>
                <div className={styles.goalsGrid}>
                  {GOAL_OPTIONS.map(goal => {
                    const isSelected = regGoals.includes(goal.title);
                    return (
                      <div
                        key={goal.id}
                        onClick={() => toggleGoal(goal.title)}
                        className={`${styles.goalCard} ${isSelected ? styles.goalCardActive : ''}`}
                      >
                        <span className={styles.goalIcon}>{goal.icon}</span>
                        <div>
                          <div className={styles.goalCardText}>{goal.title}</div>
                          <div className={styles.goalCardSub}>{goal.sub}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Declared Interests */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Declared Fields of Interest:
                </label>
                <div className={styles.interestsWrap}>
                  {INTEREST_AREAS.map(interest => {
                    const isSelected = regInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`${styles.interestChip} ${isSelected ? styles.interestChipActive : ''}`}
                      >
                        {isSelected ? '✓ ' : '+ '}{interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRegStep(2)}
                  className={`${componentsStyles.btn} ${componentsStyles.btnOutline}`}
                  style={{ flex: 1 }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}
                  style={{ flex: 2 }}
                >
                  Review &amp; Set Password →
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 4: Account & Review Summary ── */}
          {regStep === 4 && (
            <form onSubmit={handleRegister}>
              <h3 className={styles.wizardSectionTitle}>Account &amp; Review</h3>
              <p className={styles.wizardSectionSubtitle}>
                Review your profile summary and secure your account.
              </p>

              {/* Profile Review Summary (Compact & Clean - NO password shown) */}
              <div className={styles.profileSummaryBox}>
                <div className={styles.profileSummaryTitle}>
                  <span>Your Academic Profile</span>
                  <span 
                    onClick={() => setRegStep(2)} 
                    style={{ color: '#690b1b', cursor: 'pointer', textTransform: 'none', fontWeight: 600 }}
                  >
                    Edit details ✎
                  </span>
                </div>
                <div className={styles.profileSummaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryItemLabel}>Academic Stage</span>
                    <span className={styles.summaryItemValue}>
                      {regGrade ? `Grade ${regGrade}` : 'Student'}
                      {regStream ? ` (${regStream})` : ''}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryItemLabel}>Education Board</span>
                    <span className={styles.summaryItemValue}>
                      {regBoard === 'Other' && regCustomBoard ? regCustomBoard : regBoard}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryItemLabel}>School / Institution</span>
                    <span className={styles.summaryItemValue} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {regSchool || 'Not provided'}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryItemLabel}>Location</span>
                    <span className={styles.summaryItemValue}>
                      {regCity ? `${regCity}, ${regState}` : 'India'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Password Inputs */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-password">Password</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showRegPassword ? "text" : "password"}
                      id="reg-password"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="min 6 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className={styles.passwordToggleBtn} 
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      tabIndex={-1}
                    >
                      {showRegPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="reg-confirm-password">Confirm Password</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showRegConfirmPassword ? "text" : "password"}
                      id="reg-confirm-password"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="repeat password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className={styles.passwordToggleBtn} 
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showRegConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit & Back */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setRegStep(3)}
                  className={`${componentsStyles.btn} ${componentsStyles.btnOutline}`}
                  style={{ flex: 1 }}
                  disabled={loading}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}
                  style={{ flex: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Complete Registration →'}
                </button>
              </div>
            </form>
          )}

          <p className={styles.authFooterLink} style={{ marginTop: '14px' }}>
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('login'); }}>Sign In →</a>
          </p>
        </div>
      )}

      {/* ── FORGOT PASSWORD FORM ── */}
      {!welcomeData && activeTab === 'forgot' && (
        <div className={styles.authFormContainerActive}>
          <form onSubmit={handleForgot}>
            <div className={styles.formGroup}>
              <label htmlFor="forgot-email">Email Address</label>
              <input
                type="email"
                id="forgot-email"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={`${componentsStyles.btn} ${componentsStyles.btnPrimary} ${styles.btnBlock}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link →'}
            </button>
          </form>
          <p className={styles.authFooterLink}>
            Remembered your password? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('login'); }}>Sign In →</a>
          </p>
        </div>
      )}
    </div>
  );
}
