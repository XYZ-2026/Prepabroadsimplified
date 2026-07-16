'use client';

import { useState } from 'react';
import styles from '@/styles/admin-users.module.css';

export interface UserData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  studentType: string;
  state: string;
  city: string;
  createdAtStr: string;
}

export default function UsersTableClient({ initialUsers }: { initialUsers: UserData[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const filteredUsers = initialUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = filterType === 'all' || user.studentType === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) return;
    
    const headers = ['Name', 'Email', 'Mobile', 'Type', 'Location', 'Joined'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => 
        `"${user.name}","${user.email}","${user.mobile}","${user.studentType}","${user.city}, ${user.state}","${user.createdAtStr}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `as_users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className={styles.actionsGroup}>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="ug">UG</option>
            <option value="pg">PG</option>
            <option value="phd">PhD</option>
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
              <th>User</th>
              <th>Contact Info</th>
              <th>Level &amp; Location</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className={styles.userRow}>
                  <td>
                    <div className={styles.userDetails}>
                      <div className={styles.userAvatarSmall}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className={styles.userNameText}>{user.name}</span>
                        <span className={styles.userSubtext}>ID: {user.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.userEmailText} style={{ display: 'block', color: 'var(--text-heading)', fontWeight: 500 }}>{user.email}</span>
                    <span className={styles.userPhone}>{user.mobile}</span>
                  </td>
                  <td>
                    <span style={{ display: 'block', color: 'var(--text-heading)', fontWeight: 500, textTransform: 'uppercase' }}>{user.studentType}</span>
                    <span className={styles.userSubtext}>{user.city}, {user.state}</span>
                  </td>
                  <td>
                    <span className={styles.userSubtext}>{user.createdAtStr}</span>
                  </td>
                  <td>
                    <button className={styles.btnEdit} onClick={() => setSelectedUser(user)}>View Details</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setSelectedUser(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>User Details</h2>
              <button className={styles.btnClose} onClick={() => setSelectedUser(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailGroup}>
                  <div className={styles.detailLabel}>Name</div>
                  <div className={styles.detailValue}>{selectedUser.name}</div>
                </div>
                <div className={styles.detailGroup}>
                  <div className={styles.detailLabel}>Email</div>
                  <div className={styles.detailValue}>{selectedUser.email}</div>
                </div>
                <div className={styles.detailGroup}>
                  <div className={styles.detailLabel}>Mobile</div>
                  <div className={styles.detailValue}>{selectedUser.mobile}</div>
                </div>
                <div className={styles.detailGroup}>
                  <div className={styles.detailLabel}>Student Type</div>
                  <div className={styles.detailValue} style={{ textTransform: 'uppercase' }}>{selectedUser.studentType}</div>
                </div>
                <div className={styles.detailGroup}>
                  <div className={styles.detailLabel}>Location</div>
                  <div className={styles.detailValue}>{selectedUser.city}, {selectedUser.state}</div>
                </div>
                <div className={styles.detailGroup}>
                  <div className={styles.detailLabel}>Joined Date</div>
                  <div className={styles.detailValue}>{selectedUser.createdAtStr}</div>
                </div>
                <div className={styles.detailGroup}>
                  <div className={styles.detailLabel}>User ID</div>
                  <div className={styles.detailValue} style={{ fontSize: '13px', wordBreak: 'break-all' }}>{selectedUser.id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
