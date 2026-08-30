'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/admin-users.module.css';
import StudentProfileView, { StudentProfileData } from '@/components/Profile/StudentProfileView';
import OverrideLockButton from './OverrideLockButton';

export interface StudentData extends StudentProfileData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  studentType: string;
  state: string;
  city: string;
  createdAtStr: string;
}

interface IQResult {
  id: string;
  userId: string;
  estimatedIQ?: number;
  iqScore?: number;
  percentile?: number;
  cognitiveBand?: string;
  tier?: string;
  strongestDomain?: string;
  strength?: string;
  cognitivePersona?: string;
  domains?: { category: string; correct: number; total: number; percentage: number }[];
  createdAt?: string;
  type: 'iq';
}

interface PsychometricResult {
  id: string;
  userId: string;
  testName: string;
  scores: any;
  createdAt: string;
  workflowState?: string;
  type: 'psychometric';
}

interface Props {
  students: StudentData[];
  iqResults: IQResult[];
  psychoResults: PsychometricResult[];
}

import StudentWorkspace from './StudentWorkspace';

export default function CounsellorStudentsClient({ students, iqResults, psychoResults }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentIQ = (studentId: string) =>
    iqResults.filter(r => r.userId === studentId);

  const getStudentPsycho = (studentId: string) =>
    psychoResults.filter(r => r.userId === studentId);

  if (selectedStudent) {
    return (
      <StudentWorkspace
        student={selectedStudent}
        iqResults={iqResults}
        psychoResults={psychoResults}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  return (
    <>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #690b1b 0%, #8D1212 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        color: '#fff',
        marginBottom: '24px',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Allotted Students Workspace
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0, color: '#ffffff' }}>
          Click any student row or View Details to open their dedicated Counsellor Workspace &amp; 56-Page Diagnostic Reports.
        </p>
      </div>

      {/* Analytics Stats */}
      <div className={styles.adminStatsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{students.length}</h3>
            <p>Total Allotted</p>
            <div className={styles.statTrend} style={{ color: 'var(--color-red-deep, #690b1b)' }}>Your students</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAlerts}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{iqResults.length}</h3>
            <p>IQ Tests Taken</p>
            <div className={styles.statTrend}>By your cohort</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{psychoResults.length}</h3>
            <p>Psychometric Tests</p>
            <div className={styles.statTrend}>By your cohort</div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className={styles.usersControls}>
        <div className={styles.searchBox}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className={styles.usersTableContainer}>
        <table className={styles.usersTable} style={{ width: '100%', tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Student</th>
              <th style={{ width: '25%' }}>Contact</th>
              <th style={{ width: '20%' }}>Level &amp; Location</th>
              <th style={{ width: '15%' }}>Tests Taken</th>
              <th style={{ width: '10%', textWrap: 'nowrap', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  {students.length === 0
                    ? 'No students have been allotted to you yet. Run the SJF allotment from the Allotment Manager.'
                    : 'No students found matching your search.'}
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => {
                const iqCount = getStudentIQ(student.id).length;
                const psychoCount = getStudentPsycho(student.id).length;
                return (
                  <tr
                    key={student.id}
                    className={styles.userRow}
                    onClick={() => setSelectedStudent(student)}
                    style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                  >
                    <td>
                      <div className={styles.userDetails}>
                        <div className={styles.userAvatarSmall}>{student.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <span 
                            className={styles.userNameText}
                            style={{ color: '#690B1B', fontWeight: 700, fontSize: '14.5px' }}
                          >
                            {student.name} →
                          </span>
                          <span className={styles.userSubtext}>Joined: {student.createdAtStr}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'block', color: 'var(--text-heading)', fontWeight: 500 }}>{student.email}</span>
                      <span className={styles.userPhone}>{student.mobile || '—'}</span>
                    </td>
                    <td>
                      <span style={{ display: 'block', color: 'var(--text-heading)', fontWeight: 500, textTransform: 'uppercase' }}>
                        {student.studentType || '—'}
                      </span>
                      <span className={styles.userSubtext}>{student.city}{student.city && student.state ? ', ' : ''}{student.state}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {iqCount > 0 && (
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: 'rgba(37, 99, 235, 0.1)',
                            color: '#2563eb',
                            fontSize: '12px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}>
                            IQ: {iqCount}
                          </span>
                        )}
                        {psychoCount > 0 && (
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: 'rgba(105, 11, 27, 0.08)',
                            color: 'var(--color-red-deep, #690b1b)',
                            fontSize: '12px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}>
                            Psycho: {psychoCount}
                          </span>
                        )}
                        {iqCount === 0 && psychoCount === 0 && (
                          <span style={{ fontSize: '12px', color: '#999', whiteSpace: 'nowrap' }}>No tests</span>
                        )}
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                      <button 
                        className={styles.btnEdit} 
                        style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student);
                        }}
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
