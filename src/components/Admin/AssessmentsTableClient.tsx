'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/admin-users.module.css';

export interface AssessmentData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  iqScore: number;
  percentile: number;
  tier: string;
  strength: string;
  createdAtStr: string;
  type?: 'iq' | 'psychometric';
}

export default function AssessmentsTableClient({ initialAssessments }: { initialAssessments: AssessmentData[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');

  const filteredAssessments = initialAssessments.filter((assessment) => {
    const matchesSearch = 
      assessment.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      assessment.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTier = filterTier === 'all' || assessment.tier === filterTier;
    
    return matchesSearch && matchesTier;
  });

  const handleExportCSV = () => {
    if (filteredAssessments.length === 0) return;
    
    const headers = ['Name', 'Email', 'IQ Score', 'Percentile', 'Tier', 'Strength', 'Date Taken'];
    const csvContent = [
      headers.join(','),
      ...filteredAssessments.map(assessment => 
        `"${assessment.userName}","${assessment.userEmail}","${assessment.iqScore}","${assessment.percentile}","${assessment.tier}","${assessment.strength}","${assessment.createdAtStr}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `as_assessments_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get unique tiers for filter
  const uniqueTiers = Array.from(new Set(initialAssessments.map(a => a.tier)));

  return (
    <>
      <div className={styles.usersControls}>
        <div className={styles.searchBox}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by student name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.actionsGroup}>
          <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
            <option value="all">All Tiers</option>
            {uniqueTiers.map(tier => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>
          <button className={styles.btnExport} onClick={handleExportCSV}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className={styles.usersTableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Score &amp; Tier / Test Name</th>
              <th>Top Strength / Interest</th>
              <th>Date Taken</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssessments.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No assessments found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAssessments.map((assessment) => (
                <tr key={assessment.id} className={styles.userRow}>
                  <td>
                    <div className={styles.userDetails}>
                      <div className={styles.userAvatarSmall}>
                        {assessment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className={styles.userNameText}>{assessment.userName}</span>
                        <span className={styles.userSubtext}>{assessment.userEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'block', color: 'var(--text-heading)', fontWeight: 600, fontSize: '1.1rem' }}>
                      {assessment.iqScore}{assessment.type === 'psychometric' ? '%' : ''}
                    </span>
                    <span className={styles.userSubtext}>
                      {assessment.tier} {assessment.type !== 'psychometric' && `(Top ${assessment.percentile}%)`}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'block', color: 'var(--text-heading)', fontWeight: 500 }}>{assessment.strength}</span>
                  </td>
                  <td>
                    <span className={styles.userSubtext}>{assessment.createdAtStr}</span>
                  </td>
                  <td>
                    <Link href={assessment.type === 'psychometric' ? `/psychometric-test/result/${assessment.id}` : `/iq-test/result/${assessment.id}`} target="_blank" className={styles.btnEdit}>
                      View Full Report
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
