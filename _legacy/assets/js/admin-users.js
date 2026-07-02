import { db } from './firebase-config.js';
import { collection, query, orderBy, limit, getDocs, startAfter, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM Elements
const usersTableBody = document.getElementById('users-table-body');
const loadMoreBtn = document.getElementById('load-more-btn');
const exportCsvBtn = document.getElementById('export-csv-btn');
const totalUsersCount = document.getElementById('total-users-count');

// Pagination State
let lastVisibleDoc = null;
const PAGE_SIZE = 50;
let loadedUsers = [];
let totalUsers = 0;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Check if admin
  if (localStorage.getItem('currentUserRole') !== 'admin') {
    window.location.href = 'auth.html';
    return;
  }

  // Load initial data
  await loadTotalCount();
  await loadUsers(true);
});

async function loadTotalCount() {
  if (!db) return;
  try {
    const collRef = collection(db, "students");
    const snapshot = await getCountFromServer(collRef);
    totalUsers = snapshot.data().count;
    totalUsersCount.textContent = totalUsers;
    updateLoadMoreText();
  } catch (error) {
    console.error("Error fetching total count:", error);
  }
}

async function loadUsers(isInitial = false) {
  if (!db) {
    usersTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--color-red-deep);">Firebase is not configured. Displaying mock data...</td></tr>';
    // If Firebase isn't configured, we could render mock users here.
    return;
  }

  try {
    if (isInitial) {
      usersTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading users...</td></tr>';
      loadMoreBtn.disabled = true;
    }

    const usersRef = collection(db, "students");
    let q;

    if (isInitial || !lastVisibleDoc) {
      q = query(usersRef, orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    } else {
      q = query(usersRef, orderBy("createdAt", "desc"), startAfter(lastVisibleDoc), limit(PAGE_SIZE));
    }

    const querySnapshot = await getDocs(q);
    
    if (isInitial) {
      usersTableBody.innerHTML = '';
    }

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    if (users.length > 0) {
      lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      loadedUsers = [...loadedUsers, ...users];
      renderUsers(users);
    } else if (isInitial) {
      usersTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found.</td></tr>';
    }

    // Check if we reached the end
    if (users.length < PAGE_SIZE) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
      loadMoreBtn.disabled = false;
    }

    updateLoadMoreText();
  } catch (error) {
    console.error("Error fetching users:", error);
    if (isInitial) {
      usersTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error loading users.</td></tr>';
    }
    loadMoreBtn.disabled = false;
  }
}

function renderUsers(users) {
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.className = 'user-row';

    const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
    const name = user.name || 'Unknown';
    const email = user.email || 'N/A';
    const phone = user.mobile || 'N/A';
    // We don't have location yet in auth.js, just default to Not specified
    const locationStr = user.state || user.city ? `${user.city || ''} ${user.state || ''}`.trim() : 'Not specified';
    
    // Format Date
    let dateStr = 'Unknown';
    if (user.createdAt) {
      // Handle Firestore timestamp
      const date = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
      dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    tr.innerHTML = `
      <td>
        <div class="user-details">
          <div class="user-avatar-small">${initial}</div>
          <div>
            <span class="user-name-text">${name}</span>
            <span class="user-email-text">${email}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="user-phone">${phone}</span>
      </td>
      <td>
        <span class="user-subtext">${locationStr}</span>
      </td>
      <td>
        <span class="user-subtext">${dateStr}</span>
      </td>
      <td>
        <button class="btn-edit" onclick="alert('Edit \\'${name}\\' clicked')">Edit Profile</button>
      </td>
    `;
    usersTableBody.appendChild(tr);
  });
}

function updateLoadMoreText() {
  loadMoreBtn.textContent = `Load More Users (Showing ${loadedUsers.length} of ${totalUsers})`;
}

loadMoreBtn.addEventListener('click', () => {
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Loading...';
  loadUsers(false);
});

// CSV Export
exportCsvBtn.addEventListener('click', () => {
  if (loadedUsers.length === 0) {
    alert("No data to export.");
    return;
  }

  const headers = ["Name", "Email", "Phone", "Location", "Joined", "Type"];
  const rows = loadedUsers.map(user => {
    const name = (user.name || '').replace(/"/g, '""');
    const email = user.email || '';
    const phone = user.mobile || '';
    const location = (user.state || user.city ? `${user.city || ''} ${user.state || ''}`.trim() : 'Not specified').replace(/"/g, '""');
    let dateStr = '';
    if (user.createdAt) {
      const date = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
      dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    const type = user.studentType || '';

    return `"${name}","${email}","${phone}","${location}","${dateStr}","${type}"`;
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `students_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
