'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
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

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      let isNewUser = false;
      if (!userSnap.exists()) {
        isNewUser = true;
        // Create basic profile
        await setDoc(userRef, {
          name: user.displayName || '',
          email: user.email || '',
          mobile: '',
          studentType: '',
          state: '',
          city: '',
          role: 'student',
          toolAccess: {
            iqTest: true,
            psychometricTest: false,
            universityPredictor: true,
          },
          createdAt: serverTimestamp(),
        });
      } else {
        // Even if they exist, check if they are missing critical profile info
        const data = userSnap.data();
        if (!data.studentType || !data.state) {
          isNewUser = true;
        }
      }

      // Create session cookie
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
        toolAccess: {
          iqTest: true,
          psychometricTest: false,
          universityPredictor: true,
        },
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
        
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
          <span style={{ padding: '0 10px', color: '#888', fontSize: '13px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`${componentsStyles.btn} ${styles.btnBlock}`}
          style={{ background: '#fff', color: '#333', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

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
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
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
            {loading ? 'Registering...' : 'Create Account →'}
          </button>
        </form>
        
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
          <span style={{ padding: '0 10px', color: '#888', fontSize: '13px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`${componentsStyles.btn} ${styles.btnBlock}`}
          style={{ background: '#fff', color: '#333', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Register with Google
        </button>

        <p className={styles.authFooterLink}>
          Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('login'); }}>Sign In →</a>
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
