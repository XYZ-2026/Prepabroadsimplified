'use client';

import { useState, useMemo } from 'react';
import styles from '@/styles/admin-users.module.css';

export interface UserAccessData {
  id: string;
  name: string;
  email: string;
  role?: string;
  grade?: string;
  createdAt?: string;
  toolAccess?: {
    iqTest: boolean;
    psychometricTest: boolean;
    universityPredictor: boolean;
  };
  accessRequests?: string[];
}

export default function ToolAccessTableClient({ initialUsers }: { initialUsers: UserAccessData[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'granted' | 'requested'>('all');
  const [users, setUsers] = useState<UserAccessData[]>(initialUsers);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Compute counts
  const pendingUsers = useMemo(() => {
    return users.filter(u => u.toolAccess?.psychometricTest !== true);
  }, [users]);

  const grantedUsers = useMemo(() => {
    return users.filter(u => u.toolAccess?.psychometricTest === true);
  }, [users]);

  const requestedUsers = useMemo(() => {
    return users.filter(u => u.accessRequests?.includes('psychometricTest'));
  }, [users]);

  // Filtered users based on tab and search
  const displayedUsers = useMemo(() => {
    let list = users;
    if (activeTab === 'pending') {
      list = pendingUsers;
    } else if (activeTab === 'granted') {
      list = grantedUsers;
    } else if (activeTab === 'requested') {
      list = requestedUsers;
    }

    if (!searchTerm.trim()) return list;

    const query = searchTerm.toLowerCase();
    return list.filter(u => 
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.grade && u.grade.toLowerCase().includes(query))
    );
  }, [users, activeTab, searchTerm, pendingUsers, grantedUsers, requestedUsers]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleToggleAccess = async (
    userId: string, 
    toolKey: keyof NonNullable<UserAccessData['toolAccess']>, 
    currentValue: boolean
  ) => {
    setSavingUserId(userId);
    
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;
    
    const currentAccess = userToUpdate.toolAccess || {
      iqTest: true,
      psychometricTest: false,
      universityPredictor: true,
    };
    
    const newAccess = {
      ...currentAccess,
      [toolKey]: !currentValue
    };

    try {
      const res = await fetch('/api/admin/update-tool-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, toolAccess: newAccess }),
      });
      
      if (res.ok) {
        setUsers(prevUsers => prevUsers.map(u => {
          if (u.id === userId) {
            const newRequests = (u.accessRequests || []).filter(req => req !== toolKey);
            return { ...u, toolAccess: newAccess, accessRequests: newRequests };
          }
          return u;
        }));
        showNotification(
          !currentValue 
            ? `Granted ${toolKey === 'psychometricTest' ? 'Psychometric Test' : toolKey} access to ${userToUpdate.name}`
            : `Revoked ${toolKey === 'psychometricTest' ? 'Psychometric Test' : toolKey} access for ${userToUpdate.name}`,
          'success'
        );
      } else {
        showNotification('Failed to update access permissions', 'error');
      }
    } catch (error) {
      console.error(error);
      showNotification('An error occurred while saving', 'error');
    } finally {
      setSavingUserId(null);
    }
  };

  const handleBulkGrantPsychometric = async () => {
    if (pendingUsers.length === 0) {
      showNotification('No students are currently pending psychometric test access.', 'success');
      return;
    }

    const confirmGrant = window.confirm(
      `Are you sure you want to grant Psychometric Test access to all ${pendingUsers.length} pending students?`
    );
    if (!confirmGrant) return;

    setIsBulkSaving(true);
    const pendingIds = pendingUsers.map(u => u.id);

    try {
      const res = await fetch('/api/admin/update-tool-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: pendingIds,
          toolAccess: {
            iqTest: true,
            psychometricTest: true,
            universityPredictor: true,
          }
        }),
      });

      if (res.ok) {
        setUsers(prevUsers => prevUsers.map(u => {
          if (pendingIds.includes(u.id)) {
            const current = u.toolAccess || { iqTest: true, psychometricTest: false, universityPredictor: true };
            const newRequests = (u.accessRequests || []).filter(req => req !== 'psychometricTest');
            return {
              ...u,
              toolAccess: { ...current, psychometricTest: true },
              accessRequests: newRequests,
            };
          }
          return u;
        }));
        showNotification(`Successfully unlocked Psychometric Test access for ${pendingIds.length} students!`, 'success');
      } else {
        showNotification('Failed to execute bulk activation', 'error');
      }
    } catch (error) {
      console.error(error);
      showNotification('An error occurred during bulk activation', 'error');
    } finally {
      setIsBulkSaving(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {statusMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          padding: '14px 22px',
          borderRadius: '10px',
          backgroundColor: statusMessage.type === 'success' ? '#15803d' : '#b91c1c',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '14px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideIn 0.25s ease-out',
        }}>
          <span>{statusMessage.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Access Gate Policy Banner */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderLeft: '4px solid #690b1b',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: '#690b1b', 
              display: 'inline-block' 
            }} />
            <strong style={{ color: '#0f172a', fontSize: '15px', letterSpacing: '0.3px', fontWeight: 700 }}>
              STUDENT TEST ACCESS CONTROL: ADMIN APPROVAL REQUIRED
            </strong>
          </div>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: 700, 
            padding: '4px 12px', 
            borderRadius: '20px', 
            backgroundColor: '#fee2e2', 
            color: '#991b1b',
            letterSpacing: '0.3px'
          }}>
            🛡️ Access Gate Enforced
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
          Newly registered students are <strong>locked by default</strong> and cannot immediately start the psychometric assessment. You can grant access individually using the <strong>Grant Test Access</strong> button below or activate all pending students at once.
        </p>

        {/* Access Metrics Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '6px' }}>
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#fff', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, textTransform: 'uppercase' }}>Awaiting Activation</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#b45309' }}>{pendingUsers.length} Students</div>
            </div>
            <span style={{ fontSize: '20px' }}>⏳</span>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#fff', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>Access Granted</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a' }}>{grantedUsers.length} Students</div>
            </div>
            <span style={{ fontSize: '20px' }}>✓</span>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#fff', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#991b1b', fontWeight: 600, textTransform: 'uppercase' }}>Access Requests</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>{requestedUsers.length} Pending</div>
            </div>
            <span style={{ fontSize: '20px' }}>🔔</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Bulk Actions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              background: activeTab === 'all' ? '#690b1b' : '#f1f5f9',
              color: activeTab === 'all' ? '#ffffff' : '#475569',
              transition: 'all 0.2s',
            }}
          >
            All Students ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              background: activeTab === 'pending' ? '#d97706' : '#fef3c7',
              color: activeTab === 'pending' ? '#ffffff' : '#92400e',
              transition: 'all 0.2s',
            }}
          >
            Pending Test Access ({pendingUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('granted')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              background: activeTab === 'granted' ? '#16a34a' : '#dcfce7',
              color: activeTab === 'granted' ? '#ffffff' : '#166534',
              transition: 'all 0.2s',
            }}
          >
            Access Granted ({grantedUsers.length})
          </button>
          {requestedUsers.length > 0 && (
            <button
              onClick={() => setActiveTab('requested')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                background: activeTab === 'requested' ? '#dc2626' : '#fee2e2',
                color: activeTab === 'requested' ? '#ffffff' : '#991b1b',
                transition: 'all 0.2s',
              }}
            >
              🔔 Requested ({requestedUsers.length})
            </button>
          )}
        </div>

        {/* Bulk Action Button */}
        {pendingUsers.length > 0 && (
          <button
            onClick={handleBulkGrantPsychometric}
            disabled={isBulkSaving}
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: isBulkSaving ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
              opacity: isBulkSaving ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            <span>{isBulkSaving ? '⏳' : '⚡'}</span>
            <span>{isBulkSaving ? 'Granting Access...' : `Grant Test Access to All (${pendingUsers.length})`}</span>
          </button>
        )}
      </div>

      <div className={styles.usersControls}>
        <div className={styles.searchBox} style={{ width: '100%', maxWidth: '440px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search students by name, email or grade..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.usersTableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th style={{ width: '35%' }}>Student</th>
              <th style={{ width: '35%', textAlign: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎯</span> Psychometric Test Access
                </span>
              </th>
              <th style={{ width: '15%', textAlign: 'center' }}>IQ Test</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Uni Predictor</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>No students found</div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>
                    {searchTerm ? 'No results matched your search term.' : 'There are no students in this category.'}
                  </div>
                </td>
              </tr>
            ) : (
              displayedUsers.map((user) => {
                const access = user.toolAccess || { iqTest: true, psychometricTest: false, universityPredictor: true };
                const isSaving = savingUserId === user.id || isBulkSaving;
                const isPsychometricGranted = access.psychometricTest === true;
                const hasRequestedPsychometric = user.accessRequests?.includes('psychometricTest');

                return (
                  <tr key={user.id} className={styles.userRow} style={{ opacity: isSaving ? 0.6 : 1, transition: 'background-color 0.2s' }}>
                    <td>
                      <div className={styles.userDetails}>
                        <div className={styles.userAvatarSmall}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={styles.userNameText}>{user.name}</span>
                            {user.grade && (
                              <span style={{ 
                                fontSize: '11px', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                backgroundColor: '#f1f5f9', 
                                color: '#475569', 
                                fontWeight: 600 
                              }}>
                                {user.grade}
                              </span>
                            )}
                          </div>
                          <span className={styles.userEmailText} style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {user.email}
                          </span>
                          {user.createdAt && (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                              Joined: {user.createdAt}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Psychometric Test Primary Access Column */}
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        {isPsychometricGranted ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: '#dcfce7',
                              color: '#15803d',
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 700,
                              border: '1px solid #86efac'
                            }}>
                              <span>✓</span> ACCESS GRANTED
                            </span>
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => handleToggleAccess(user.id, 'psychometricTest', true)}
                              style={{
                                padding: '5px 12px',
                                fontSize: '11px',
                                fontWeight: 600,
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#64748b',
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s'
                              }}
                              title="Revoke Psychometric Test Access"
                            >
                              Revoke
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#fef3c7',
                              color: '#b45309',
                              padding: '5px 10px',
                              borderRadius: '16px',
                              fontSize: '11px',
                              fontWeight: 700,
                              border: '1px solid #fde68a'
                            }}>
                              <span>🔒</span> LOCKED
                            </span>

                            {hasRequestedPsychometric && (
                              <span style={{
                                fontSize: '10px',
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontWeight: 800,
                                border: '1px solid #fecaca',
                                animation: 'pulse 2s infinite'
                              }}>
                                🔔 REQUESTED
                              </span>
                            )}

                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => handleToggleAccess(user.id, 'psychometricTest', false)}
                              style={{
                                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '7px 16px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.2)',
                                transition: 'all 0.15s'
                              }}
                            >
                              <span>+</span> Grant Test Access
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* IQ Test Secondary Column */}
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <label style={{ display: 'inline-flex', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={access.iqTest}
                            disabled={isSaving}
                            onChange={() => handleToggleAccess(user.id, 'iqTest', access.iqTest)}
                            style={{ width: '18px', height: '18px', accentColor: '#690b1b' }}
                          />
                        </label>
                        {user.accessRequests?.includes('iqTest') && (
                          <span style={{ fontSize: '10px', backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            Requested
                          </span>
                        )}
                      </div>
                    </td>

                    {/* University Predictor Secondary Column */}
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <label style={{ display: 'inline-flex', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={access.universityPredictor}
                            disabled={isSaving}
                            onChange={() => handleToggleAccess(user.id, 'universityPredictor', access.universityPredictor)}
                            style={{ width: '18px', height: '18px', accentColor: '#690b1b' }}
                          />
                        </label>
                        {user.accessRequests?.includes('universityPredictor') && (
                          <span style={{ fontSize: '10px', backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            Requested
                          </span>
                        )}
                      </div>
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
