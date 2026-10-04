'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/student-dashboard.module.css';
import componentsStyles from '@/styles/components.module.css';
import { 
  AcademicGrade, 
  formatGradeLabel, 
  getStudentPsychometricAccess, 
  normalizeGrade 
} from '@/lib/psychometric-access-policy';

export interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  studentType?: string;
  grade?: string;
  academicGrade?: string;
  board?: string;
  stream?: string;
  state: string;
  city: string;
  currentSchool: string;
  schoolName?: string;
  graduationYear: string;
  targetCountries: string;
  degreeLevel: string;
  fieldOfInterest: string;
}

const BOARD_OPTIONS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];

const STREAM_OPTIONS = [
  'Science (PCM)',
  'Science (PCB)',
  'Commerce',
  'Humanities / Arts',
];

const STATE_OPTIONS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Other'
];

export default function UpdateProfileForm({ initialData }: { initialData: ProfileData }) {
  const router = useRouter();

  const initialGrade = normalizeGrade(initialData.grade || initialData.academicGrade) || '';
  const initialBoard = initialData.board || 'CBSE';
  const isCustomBoard = !BOARD_OPTIONS.slice(0, 5).includes(initialBoard) && initialBoard !== '';

  const [formData, setFormData] = useState<ProfileData>({
    ...initialData,
    grade: initialGrade,
    academicGrade: initialGrade,
    board: isCustomBoard ? 'Other' : (initialBoard || 'CBSE'),
    stream: initialData.stream || '',
    currentSchool: initialData.schoolName || initialData.currentSchool || '',
  });

  const [customBoard, setCustomBoard] = useState(isCustomBoard ? initialBoard : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentNormalizedGrade = normalizeGrade(formData.grade);
  const isSeniorGrade = currentNormalizedGrade === '11' || currentNormalizedGrade === '12';
  const access = getStudentPsychometricAccess(formData.grade);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (newGrade: AcademicGrade) => {
    setFormData(prev => ({
      ...prev,
      grade: newGrade,
      academicGrade: newGrade,
      stream: (newGrade === '11' || newGrade === '12') ? prev.stream : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const finalBoard = formData.board === 'Other' && customBoard.trim() ? customBoard.trim() : formData.board;

      const payload = {
        ...formData,
        board: finalBoard,
        schoolName: formData.currentSchool,
      };

      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully! Academic eligibility re-evaluated.');
      router.refresh();
      
      setTimeout(() => {
        setSuccess('');
      }, 4000);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Edit Profile Information</h2>
      </div>
      <div className={styles.cardBody}>
        {error && (
          <div style={{ padding: '12px 16px', background: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', border: '1px solid #ffcdd2' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '12px 16px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', border: '1px solid #c8e6c9' }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                disabled
                value={formData.email}
                title="Email cannot be changed directly."
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="state">State</label>
              <select 
                id="state" 
                name="state" 
                required 
                value={formData.state} 
                onChange={handleChange}
              >
                <option value="" disabled>Select State</option>
                {STATE_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Academic Background (Authoritative) */}
          <div style={{ marginTop: '32px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Academic Background &amp; Stage</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Your selected grade determines your unlocked psychometric assessment.
            </p>
          </div>

          {/* Grade Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
              Current Academic Grade:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
              {(['7', '8', '9', '10', '11', '12'] as AcademicGrade[]).map(g => {
                const isSelected = formData.grade === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGradeChange(g)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #690b1b' : '1px solid #cbd5e1',
                      background: isSelected ? 'rgba(105, 11, 27, 0.06)' : '#ffffff',
                      color: isSelected ? '#690b1b' : '#334155',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                    }}
                  >
                    Grade {g}
                  </button>
                );
              })}
            </div>

            {/* Eligibility Live Notice */}
            <div style={{
              marginTop: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '12.5px',
              color: '#475569',
              lineHeight: 1.5,
            }}>
              <strong>Psychometric Tool Unlocked:</strong>{' '}
              <span style={{ color: '#690b1b', fontWeight: 700 }}>
                {access.status === 'ELIGIBLE' ? access.eligibleTestName : 'Select a grade to unlock'}
              </span>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                Note: Updating your grade immediately recalculates your assessment eligibility. Historical completed reports remain preserved under the grade at time of attempt.
              </div>
            </div>
          </div>

          {/* School Name & Board */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="currentSchool">School / College Name</label>
              <input
                type="text"
                id="currentSchool"
                name="currentSchool"
                required
                value={formData.currentSchool}
                onChange={handleChange}
                placeholder="e.g. Delhi Public School"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="board">Education Board</label>
              <select
                id="board"
                name="board"
                required
                value={formData.board}
                onChange={handleChange}
              >
                {BOARD_OPTIONS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {formData.board === 'Other' && (
            <div className={styles.formRow} style={{ marginTop: '-8px' }}>
              <div className={styles.formGroup} style={{ width: '100%' }}>
                <label htmlFor="customBoard">Specify Board Name</label>
                <input
                  type="text"
                  id="customBoard"
                  required
                  placeholder="e.g. Maharashtra State Board, NIOS"
                  value={customBoard}
                  onChange={(e) => setCustomBoard(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Senior Stream Selector for 11 & 12 */}
          {isSeniorGrade && (
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ width: '100%' }}>
                <label htmlFor="stream">Academic Stream (Grade {formData.grade})</label>
                <select
                  id="stream"
                  name="stream"
                  required
                  value={formData.stream}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Stream</option>
                  {STREAM_OPTIONS.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="graduationYear">Expected Graduation Year</label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2026"
              />
            </div>
          </div>

          {/* Study Abroad Preferences */}
          <div style={{ marginTop: '32px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Study Abroad Preferences</h3>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="targetCountries">Target Countries</label>
              <input
                type="text"
                id="targetCountries"
                name="targetCountries"
                value={formData.targetCountries}
                onChange={handleChange}
                placeholder="e.g. USA, UK, Canada"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="degreeLevel">Degree Level Sought</label>
              <select
                id="degreeLevel"
                name="degreeLevel"
                value={formData.degreeLevel}
                onChange={handleChange}
              >
                <option value="" disabled>Select Level</option>
                <option value="bachelors">Bachelors</option>
                <option value="masters">Masters</option>
                <option value="phd">PhD</option>
                <option value="diploma">Diploma / Certificate</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ width: '100%' }}>
              <label htmlFor="fieldOfInterest">Field of Interest / Major</label>
              <input
                type="text"
                id="fieldOfInterest"
                name="fieldOfInterest"
                value={formData.fieldOfInterest}
                onChange={handleChange}
                placeholder="e.g. Computer Science, Business Administration"
              />
            </div>
          </div>

          <div className={styles.submitBtn}>
            <button
              type="submit"
              className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}
              disabled={loading}
            >
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
