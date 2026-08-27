'use client';

import { useState } from 'react';
import styles from '@/styles/admin-users.module.css';
import CounsellorProfileView, { CounsellorProfileData } from '@/components/Profile/CounsellorProfileView';

export interface AllottedStudentData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  studentType: string;
  state: string;
  city: string;
  createdAtStr: string;
}

export interface CounsellorData extends CounsellorProfileData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  state: string;
  city: string;
  createdAtStr: string;
  designation: string;
  specialization: string;
  experienceYears: string;
  bio: string;
  allottedStudents: AllottedStudentData[];
}

interface Props {
  counsellors: CounsellorData[];
}

export default function AdminCounsellorsClient({ counsellors }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounsellor, setSelectedCounsellor] = useState<CounsellorData | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'students'>('profile');

  const filteredCounsellors = counsellors.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudentsAllotted = counsellors.reduce((acc, c) => acc + c.allottedStudents.length, 0);
  const avgAllotment = counsellors.length > 0 ? (totalStudentsAllotted / counsellors.length).toFixed(1) : '0';

  if (selectedCounsellor) {
    return (
      <div>
        {/* Top Back Navigation */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={() => setSelectedCounsellor(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              color: 'var(--color-red-deep, #690b1b)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Counsellors List
          </button>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Viewing Counsellor: <strong>{selectedCounsellor.name}</strong></span>
        </div>

        {/* Counsellor Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-red-deep, #690b1b) 0%, #8d1212 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(105, 11, 27, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>{selectedCounsellor.name}</h1>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                COUNSELLOR
              </span>
            </div>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
              {selectedCounsellor.email} · {selectedCounsellor.mobile || 'No phone'} · {selectedCounsellor.city}{selectedCounsellor.city && selectedCounsellor.state ? ', ' : ''}{selectedCounsellor.state}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{selectedCounsellor.allottedStudents.length}</div>
            <div style={{ fontSize: '12px', opacity: 0.85 }}>Students Assigned</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '24px',
          background: '#fff',
          padding: '6px 12px 0 12px',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          maxWidth: '100%',
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'profile' ? 700 : 500,
              color: activeTab === 'profile' ? 'var(--color-red-deep, #690b1b)' : '#64748b',
              borderBottom: activeTab === 'profile' ? '3px solid var(--color-red-deep, #690b1b)' : '3px solid transparent',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            📋 Counsellor Profile
          </button>
          <button
            onClick={() => setActiveTab('students')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'students' ? 700 : 500,
              color: activeTab === 'students' ? 'var(--color-red-deep, #690b1b)' : '#64748b',
              borderBottom: activeTab === 'students' ? '3px solid var(--color-red-deep, #690b1b)' : '3px solid transparent',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            👥 Allotted Students ({selectedCounsellor.allottedStudents.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <CounsellorProfileView
            counsellor={{
              ...selectedCounsellor,
              allottedStudentsCount: selectedCounsellor.allottedStudents.length,
            }}
            hideHeaderTitle={true}
          />
        ) : (
          <div className={styles.usersTableContainer}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Contact Info</th>
                  <th>Student Level &amp; Location</th>
                  <th>Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {selectedCounsellor.allottedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No students are currently allotted to this counsellor.
                    </td>
                  </tr>
                ) : (
                  selectedCounsellor.allottedStudents.map(student => (
                    <tr key={student.id} className={styles.userRow}>
                      <td>
                        <div className={styles.userDetails}>
                          <div className={styles.userAvatarSmall}>{student.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <div className={styles.userNameText}>{student.name}</div>
                            <div className={styles.userIdText}>ID: {student.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.userContact}>
                          <div>{student.email}</div>
                          <div className={styles.userMobile}>{student.mobile || 'No phone'}</div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {student.studentType && (
                            <span className={`${styles.badge} ${styles.badgePrimary}`} style={{ textTransform: 'uppercase' }}>
                              {student.studentType}
                            </span>
                          )}
                          <span style={{ fontSize: '13px', color: '#64748b' }}>
                            {student.city}{student.city && student.state ? ', ' : ''}{student.state}
                          </span>
                        </div>
                      </td>
                      <td>{student.createdAtStr}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #690b1b 0%, #8D1212 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        color: '#fff',
        marginBottom: '24px',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Counsellor Management
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
          View registered counsellors, inspect their detailed profiles, and monitor student allotments.
        </p>
      </div>

      {/* Stats Header */}
      <div className={styles.adminStatsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{counsellors.length}</h3>
            <p>Total Counsellors</p>
            <div className={styles.statTrend} style={{ color: 'var(--color-red-deep, #690b1b)' }}>Active Staff</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAlerts}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{totalStudentsAllotted}</h3>
            <p>Allotted Students</p>
            <div className={styles.statTrend}>Across all counsellors</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{avgAllotment}</h3>
            <p>Avg Students / Counsellor</p>
            <div className={styles.statTrend}>Capacity metric</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.usersControls}>
        <div className={styles.searchBox}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search counsellors by name, email, specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Counsellors Square Cards Grid */}
      {filteredCounsellors.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          color: 'var(--text-muted, #64748b)',
        }}>
          No counsellors found matching your search.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '20px',
          width: '100%',
        }}>
          {filteredCounsellors.map(counsellor => (
            <div
              key={counsellor.id}
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                transition: 'all 0.25s ease',
                position: 'relative',
              }}
            >
              <div>
                {/* Top Row: Avatar & Allotted Count Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, var(--color-red-deep, #690b1b) 0%, #8d1212 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 800,
                    boxShadow: '0 4px 10px rgba(105, 11, 27, 0.2)',
                  }}>
                    {counsellor.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: counsellor.allottedStudents.length > 0 ? 'rgba(105, 11, 27, 0.08)' : '#f1f5f9',
                    color: counsellor.allottedStudents.length > 0 ? 'var(--color-red-deep, #690b1b)' : '#64748b',
                    fontWeight: 700,
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    {counsellor.allottedStudents.length} Students
                  </span>
                </div>

                {/* Counsellor Info */}
                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                  {counsellor.name}
                </h3>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-red-deep, #690b1b)', marginBottom: '12px' }}>
                  {counsellor.designation || 'Education Counsellor'}
                </div>

                {/* Contact & Meta Details */}
                <div style={{
                  background: '#f8fafc',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #f1f5f9',
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#475569',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{counsellor.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>{counsellor.mobile || 'No phone provided'}</span>
                  </div>
                  {counsellor.specialization && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-red-deep, #690b1b)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                      <span>{counsellor.specialization}</span>
                    </div>
                  )}
                  {(counsellor.city || counsellor.state) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{counsellor.city}{counsellor.city && counsellor.state ? ', ' : ''}{counsellor.state}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Joined Date & Action Button */}
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                  Joined: <strong>{counsellor.createdAtStr}</strong>
                </div>
                <button
                  onClick={() => { setSelectedCounsellor(counsellor); setActiveTab('profile'); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'var(--color-red-deep, #690b1b)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(105, 11, 27, 0.15)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  View Profile &amp; Students ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
