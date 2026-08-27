'use client';

import { useState } from 'react';
import styles from '@/styles/admin-users.module.css';

interface CounsellorData {
  id: string;
  name: string;
  email: string;
  studentCount: number;
  totalWorkload: number;
}

interface Props {
  counsellors: CounsellorData[];
  unassignedCount: number;
  isAdmin: boolean;
}

export default function AllotmentManagerClient({ counsellors, unassignedCount, isAdmin }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleRunSJF = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/counsellor/allot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'auto' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to run allotment');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const maxWorkload = Math.max(...counsellors.map(c => c.totalWorkload), 1);

  return (
    <>
      {/* Counsellor Workload Table */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #eaeaea',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Counsellor Workload Overview</h3>
          {isAdmin && (
            <button
              onClick={handleRunSJF}
              disabled={loading || unassignedCount === 0}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                background: loading ? '#ccc' : unassignedCount === 0 ? '#e5e5e5' : 'linear-gradient(135deg, #ea580c, #f97316)',
                color: '#fff',
                fontWeight: 700,
                cursor: loading || unassignedCount === 0 ? 'default' : 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Running SJF...
                </>
              ) : unassignedCount === 0 ? (
                '✓ All Students Assigned'
              ) : (
                <>⚡ Run SJF Auto-Allotment ({unassignedCount} students)</>
              )}
            </button>
          )}
        </div>

        {counsellors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <p>No counsellors registered yet. Register as a Counsellor to get started.</p>
          </div>
        ) : (
          <div className={styles.usersTableContainer}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>Counsellor</th>
                  <th>Email</th>
                  <th>Students Assigned</th>
                  <th>Est. Workload (min)</th>
                  <th>Load Distribution</th>
                </tr>
              </thead>
              <tbody>
                {counsellors.map(c => (
                  <tr key={c.id} className={styles.userRow}>
                    <td>
                      <div className={styles.userDetails}>
                        <div className={styles.userAvatarSmall} style={{ background: 'rgba(105, 11, 27, 0.1)', color: 'var(--color-red-deep, #690b1b)' }}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className={styles.userNameText}>{c.name}</span>
                          <span className={styles.userSubtext}>ID: {c.id.substring(0, 8)}...</span>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--text-heading)', fontWeight: 500 }}>{c.email}</span></td>
                    <td>
                      <span style={{
                        padding: '4px 14px',
                        borderRadius: '16px',
                        background: c.studentCount > 0 ? 'rgba(105, 11, 27, 0.08)' : '#f5f5f5',
                        color: c.studentCount > 0 ? 'var(--color-red-deep, #690b1b)' : '#888',
                        fontWeight: 600,
                        fontSize: '14px',
                      }}>{c.studentCount}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>{c.totalWorkload}</span>
                      <span style={{ fontSize: '12px', color: '#888' }}> min</span>
                    </td>
                    <td style={{ width: '200px' }}>
                      <div style={{
                        width: '100%',
                        height: '10px',
                        background: '#f0f0f0',
                        borderRadius: '5px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${(c.totalWorkload / maxWorkload) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #690b1b, #8D1212)',
                          borderRadius: '5px',
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px',
          color: '#dc2626',
          marginBottom: '20px',
          fontWeight: 500,
        }}>
          ❌ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          padding: '24px',
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '16px',
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '17px', fontWeight: 700, color: '#059669' }}>
            ✅ {result.message}
          </h3>
          {result.workloads && result.workloads.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {result.workloads.map((w: any) => (
                <div key={w.counsellorId} style={{
                  padding: '14px 18px',
                  background: '#fff',
                  borderRadius: '10px',
                  border: '1px solid #e8e8e8',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{w.counsellorName}</div>
                  <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                    {w.studentCount} students · {w.totalWorkload} min workload
                  </div>
                </div>
              ))}
            </div>
          )}
          <p style={{ marginTop: '14px', fontSize: '13px', color: '#888' }}>
            Refresh the page to see updated workload distributions.
          </p>
        </div>
      )}

      {/* SJF Explanation */}
      <div style={{
        marginTop: '24px',
        padding: '24px',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #eaeaea',
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: '#333' }}>
          📖 How SJF Allotment Works
        </h3>
        <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 10px' }}>
            <strong>Job Length (J<sub>i</sub>)</strong> is estimated for each student based on profile complexity:
          </p>
          <ul style={{ margin: '0 0 10px', paddingLeft: '20px' }}>
            <li>Base profile review: <strong>10 min</strong></li>
            <li>Academic tier: UG (+10 min), PG/PhD (+15 min)</li>
            <li>IQ Test taken: <strong>+15 min</strong> (cognitive review)</li>
            <li>Psychometric Test taken: <strong>+20 min</strong> (RIASEC + VARK + career fitment review)</li>
          </ul>
          <p style={{ margin: 0 }}>
            Students are sorted by ascending J<sub>i</sub> (shortest first), then iteratively assigned to the counsellor with the
            <strong> lowest current workload</strong>. This minimizes average waiting time and balances load across all counsellors.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
