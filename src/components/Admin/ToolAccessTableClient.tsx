'use client';

import { useState } from 'react';
import styles from '@/styles/admin-users.module.css';

export interface UserAccessData {
  id: string;
  name: string;
  email: string;
  toolAccess?: {
    iqTest: boolean;
    psychometricTest: boolean;
    universityPredictor: boolean;
  };
  accessRequests?: string[];
}

export default function ToolAccessTableClient({ initialUsers }: { initialUsers: UserAccessData[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserAccessData[]>(initialUsers);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleToggleAccess = async (userId: string, toolKey: keyof NonNullable<UserAccessData['toolAccess']>, currentValue: boolean) => {
    setSavingUserId(userId);
    
    // Find the user to get their current full access object
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;
    
    const currentAccess = userToUpdate.toolAccess || {
      iqTest: true,
      psychometricTest: true,
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
        // Optimistically update the UI: grant access and clear request
        setUsers(prevUsers => prevUsers.map(u => {
          if (u.id === userId) {
            const newRequests = (u.accessRequests || []).filter(req => req !== toolKey);
            return { ...u, toolAccess: newAccess, accessRequests: newRequests };
          }
          return u;
        }));
      } else {
        alert('Failed to update tool access');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving.');
    } finally {
      setSavingUserId(null);
    }
  };

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
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.usersTableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>User</th>
              <th style={{ width: '20%', textAlign: 'center' }}>University Predictor</th>
              <th style={{ width: '20%', textAlign: 'center' }}>IQ Test</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Psychometric Test</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const access = user.toolAccess || { iqTest: true, psychometricTest: true, universityPredictor: true };
                const isSaving = savingUserId === user.id;
                
                return (
                  <tr key={user.id} className={styles.userRow} style={{ opacity: isSaving ? 0.6 : 1 }}>
                    <td>
                      <div className={styles.userDetails}>
                        <div className={styles.userAvatarSmall}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className={styles.userNameText}>{user.name}</span>
                          <span className={styles.userEmailText} style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <label style={{ display: 'inline-flex', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={access.universityPredictor}
                            disabled={isSaving}
                            onChange={() => handleToggleAccess(user.id, 'universityPredictor', access.universityPredictor)}
                            style={{ width: '20px', height: '20px', accentColor: '#690b1b' }}
                          />
                        </label>
                        {user.accessRequests?.includes('universityPredictor') && (
                          <span style={{ fontSize: '10px', backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Requested</span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <label style={{ display: 'inline-flex', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={access.iqTest}
                            disabled={isSaving}
                            onChange={() => handleToggleAccess(user.id, 'iqTest', access.iqTest)}
                            style={{ width: '20px', height: '20px', accentColor: '#690b1b' }}
                          />
                        </label>
                        {user.accessRequests?.includes('iqTest') && (
                          <span style={{ fontSize: '10px', backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Requested</span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <label style={{ display: 'inline-flex', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={access.psychometricTest}
                            disabled={isSaving}
                            onChange={() => handleToggleAccess(user.id, 'psychometricTest', access.psychometricTest)}
                            style={{ width: '20px', height: '20px', accentColor: '#690b1b' }}
                          />
                        </label>
                        {user.accessRequests?.includes('psychometricTest') && (
                          <span style={{ fontSize: '10px', backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Requested</span>
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
