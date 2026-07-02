import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ═══════════════════════════════════════════════════════════
// TAB SWITCHING LOGIC
// ═══════════════════════════════════════════════════════════
window.switchAuthTab = function(tabName) {
  // Update buttons
  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('tab-register').classList.remove('active');
  document.getElementById('tab-forgot').classList.remove('active');
  document.getElementById('tab-' + tabName).classList.add('active');

  // Update forms
  document.getElementById('form-login').style.display = 'none';
  document.getElementById('form-register').style.display = 'none';
  document.getElementById('form-forgot').style.display = 'none';
  document.getElementById('form-' + tabName).style.display = 'block';

  // Clear errors and inputs
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('reg-error').style.display = 'none';
  document.getElementById('forgot-error').style.display = 'none';
  document.getElementById('forgot-message').style.display = 'none';
  document.getElementById('login-form').reset();
  document.getElementById('register-form').reset();
  document.getElementById('forgot-form').reset();
};


// ═══════════════════════════════════════════════════════════
// AUTHENTICATION LOGIC
// ═══════════════════════════════════════════════════════════

// Hardcoded Admin Credentials
const ADMIN_EMAIL = 'admin@abroadsimplified.com';
const ADMIN_PASS = 'admin123';

// Login Form Submit
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value.trim();
  const errorEl = document.getElementById('login-error');
  const btn = e.target.querySelector('button');
  const originalText = btn.textContent;
  
  errorEl.style.display = 'none';
  btn.textContent = 'Logging in...';
  btn.disabled = true;

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    // Save state in localStorage so index.html knows the user is admin
    localStorage.setItem('currentUserRole', 'admin');
    
    // Simulate slight delay for effect
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
    return;
  }

  // 2. Try Student Login (Firebase)
  if (!auth) {
    errorEl.textContent = "Firebase is not configured. Unable to login students.";
    errorEl.style.display = 'block';
    btn.textContent = originalText;
    btn.disabled = false;
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem('currentUserRole', 'student');
    window.location.href = 'index.html';
  } catch (error) {
    console.error("Login error:", error);
    errorEl.textContent = getErrorMessage(error.code);
    errorEl.style.display = 'block';
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

// Register Form Submit
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const mobile = document.getElementById('reg-mobile').value;
  const studentType = document.getElementById('reg-type').value;
  const errorEl = document.getElementById('reg-error');
  const btn = e.target.querySelector('button');
  const originalText = btn.textContent;

  errorEl.style.display = 'none';
  btn.textContent = 'Creating account...';
  btn.disabled = true;

  if (!auth) {
    errorEl.textContent = "Firebase is not configured. Unable to register students.";
    errorEl.style.display = 'block';
    btn.textContent = originalText;
    btn.disabled = false;
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with their name
    await updateProfile(userCredential.user, {
      displayName: name
    });

    // Save additional student details to Firestore
    if (db) {
      await setDoc(doc(db, "students", userCredential.user.uid), {
        name: name,
        email: email,
        mobile: mobile,
        studentType: studentType,
        createdAt: serverTimestamp(),
        role: "student"
      });
    }
    
    localStorage.setItem('currentUserRole', 'student');
    window.location.href = 'index.html';
  } catch (error) {
    console.error("Registration error:", error);
    errorEl.textContent = getErrorMessage(error.code);
    errorEl.style.display = 'block';
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

// Forgot Password Form Submit
document.getElementById('forgot-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('forgot-email').value;
  const errorEl = document.getElementById('forgot-error');
  const messageEl = document.getElementById('forgot-message');
  const btn = e.target.querySelector('button');
  const originalText = btn.textContent;

  errorEl.style.display = 'none';
  messageEl.style.display = 'none';
  btn.textContent = 'Sending...';
  btn.disabled = true;

  if (!auth) {
    errorEl.textContent = "Firebase is not configured.";
    errorEl.style.display = 'block';
    btn.textContent = originalText;
    btn.disabled = false;
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    messageEl.textContent = "Reset link sent! Please check your email.";
    messageEl.style.color = "#2e7d32";
    messageEl.style.fontSize = "0.85rem";
    messageEl.style.marginBottom = "1rem";
    messageEl.style.display = 'block';
    btn.textContent = originalText;
    btn.disabled = false;
  } catch (error) {
    console.error("Forgot password error:", error);
    errorEl.textContent = getErrorMessage(error.code);
    errorEl.style.display = 'block';
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

// Helper function to make Firebase error messages user-friendly
function getErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}
