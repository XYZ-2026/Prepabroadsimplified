'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import styles from '@/styles/auth.module.css';
import componentsStyles from '@/styles/components.module.css';

type Tab = 'login' | 'register' | 'forgot';

export default function AuthForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regType, setRegType] = useState('');
  const [regState, setRegState] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');

  // Password visibility state
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const idToken = await userCredential.user.getIdToken();

      // Send token to our server API to create a session cookie
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session on server');
      }

      // Redirect to the main homepage, which now serves both roles
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = userCredential.user;

      // 2. Save user profile data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: regName,
        email: regEmail,
        mobile: regMobile,
        studentType: regType,
        state: regState,
        city: regCity,
        role: 'student', // default role
        createdAt: serverTimestamp(),
      });

      // 3. Create session cookie
      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session on server');
      }

      // Redirect to the home page (which now serves as the dashboard)
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, forgotEmail);
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
      <div className={styles.authHeader}>
        <div className={styles.authLogoIcon}>A</div>
        <h2 className={styles.authHeaderTitle}>Abroad Simplified</h2>
        <p className={styles.authHeaderSubtitle}>Your complete counselling toolkit</p>
      </div>

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

      {error && <div className={`${styles.authError} ${styles.authErrorVisible}`}>{error}</div>}
      {message && <div className={`${styles.authMessage} ${styles.authMessageVisible}`}>{message}</div>}

      {/* Login Form */}
      <div className={activeTab === 'login' ? styles.authFormContainerActive : styles.authFormContainer}>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              required
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
        <p className={styles.authFooterLink}>
          No account? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('register'); }}>Register free →</a>
        </p>
      </div>

      {/* Register Form */}
      <div className={activeTab === 'register' ? styles.authFormContainerActive : styles.authFormContainer}>
        <form onSubmit={handleRegister}>
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
          <div className={styles.formGroup}>
            <label htmlFor="reg-email">Email Address</label>
            <input
              type="email"
              id="reg-email"
              required
              placeholder="rahul@example.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
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
            <div className={styles.formGroup}>
              <label htmlFor="reg-type">Student Type</label>
              <select id="reg-type" required value={regType} onChange={(e) => setRegType(e.target.value)}>
                <option value="" disabled>Select Level</option>
                <option value="ug">UG (Undergraduate)</option>
                <option value="pg">PG (Postgraduate)</option>
                <option value="phd">PhD</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="reg-state">State</label>
              <select id="reg-state" required value={regState} onChange={(e) => setRegState(e.target.value)}>
                <option value="" disabled>Select State</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="delhi">Delhi</option>
                {/* Add more states here as needed */}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="reg-city">City</label>
              <input
                type="text"
                id="reg-city"
                required
                placeholder="Pune / Mumbai"
                value={regCity}
                onChange={(e) => setRegCity(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="reg-password">Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showRegPassword ? "text" : "password"}
                  id="reg-password"
                  required
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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
                  placeholder="repeat"
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={`${componentsStyles.btn} ${componentsStyles.btnPrimary} ${styles.btnBlock}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>
        <p className={styles.authFooterLink}>
          Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('login'); }}>Sign in →</a>
        </p>
      </div>

      {/* Forgot Password Form */}
      <div className={activeTab === 'forgot' ? styles.authFormContainerActive : styles.authFormContainer}>
        <form onSubmit={handleForgot}>
          <div className={styles.formGroup}>
            <label htmlFor="forgot-email">Email Address</label>
            <input
              type="email"
              id="forgot-email"
              required
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
          Remembered your password? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('login'); }}>Sign in →</a>
        </p>
      </div>
    </div>
  );
}
