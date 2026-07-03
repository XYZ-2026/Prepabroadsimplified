'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/student-dashboard.module.css';
import componentsStyles from '@/styles/components.module.css';

export interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  studentType: string;
  state: string;
  city: string;
  currentSchool: string;
  graduationYear: string;
  targetCountries: string;
  degreeLevel: string;
  fieldOfInterest: string;
}

export default function UpdateProfileForm({ initialData }: { initialData: ProfileData }) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      router.refresh();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
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
              <label htmlFor="studentType">Student Type</label>
              <select 
                id="studentType" 
                name="studentType" 
                required 
                value={formData.studentType} 
                onChange={handleChange}
              >
                <option value="" disabled>Select Level</option>
                <option value="ug">UG (Undergraduate)</option>
                <option value="pg">PG (Postgraduate)</option>
                <option value="phd">PhD</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
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
                <option value="maharashtra">Maharashtra</option>
                <option value="delhi">Delhi</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamilnadu">Tamil Nadu</option>
                <option value="other">Other</option>
                {/* Simplified states list, can be expanded */}
              </select>
            </div>
            <div className={styles.formGroup}>
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

          <div style={{ marginTop: '32px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Academic Background</h3>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="currentSchool">Current School / College Name</label>
              <input
                type="text"
                id="currentSchool"
                name="currentSchool"
                value={formData.currentSchool}
                onChange={handleChange}
                placeholder="e.g. Delhi Public School"
              />
            </div>
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
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
