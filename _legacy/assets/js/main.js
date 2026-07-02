'use strict';

/* ============================================================
   main.js — Init, DOMContentLoaded, Global Utilities
   Abroad Simplified
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Topbar scroll effect ── */
  const topbar = document.getElementById('topbar');

  const handleScroll = () => {
    if (window.scrollY > 10) {
      topbar.classList.add('scrolled');
    } else {
      topbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── 1.5 User Login State ── */
  const currentUserRole = localStorage.getItem('currentUserRole');
  const guestBlock = document.getElementById('guest-login-block');
  const userBlock = document.getElementById('logged-in-user-block');

  if (currentUserRole && guestBlock && userBlock) {
    guestBlock.style.display = 'none';
    userBlock.style.display = 'flex';
    
    const dashboardLink = document.getElementById('sidebar-dashboard-link');
    
    if (currentUserRole === 'admin') {
      const avatar = document.getElementById('sidebar-user-avatar');
      avatar.style.backgroundColor = 'var(--color-red-deep)';
      avatar.textContent = 'A';
      
      document.getElementById('sidebar-user-name').textContent = 'Admin';
      
      const badge = document.getElementById('sidebar-user-badge');
      badge.textContent = 'ADMIN';
      badge.style.backgroundColor = 'var(--color-red-deep)';
      badge.style.color = 'white';
      
      document.getElementById('sidebar-user-email').textContent = 'admin@abroadsimplified.com';
      
      const quickAction = document.getElementById('sidebar-quick-action');
      if (quickAction) quickAction.style.display = 'none';
      
      const adminSidebarNav = document.getElementById('admin-sidebar-nav');
      if (adminSidebarNav) adminSidebarNav.style.display = 'block';
      
      const logoutSidebarNav = document.getElementById('logout-sidebar-nav');
      if (logoutSidebarNav) logoutSidebarNav.style.display = 'block';
      
    } else if (currentUserRole === 'student') {
      document.getElementById('sidebar-user-avatar').textContent = 'S';
      document.getElementById('sidebar-user-name').textContent = 'Student';
      document.getElementById('sidebar-user-email').textContent = 'student@abroadsimplified.com';
      
      const studentSidebarNav = document.getElementById('student-sidebar-nav');
      if (studentSidebarNav) studentSidebarNav.style.display = 'block';
      
      const logoutSidebarNav = document.getElementById('logout-sidebar-nav');
      if (logoutSidebarNav) logoutSidebarNav.style.display = 'block';
    }
  }

  // Handle Logout
  const logoutBtns = [document.getElementById('logout-btn'), document.getElementById('profile-logout-btn')];
  logoutBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUserRole');
        window.location.href = 'auth.html';
      });
    }
  });


  /* ── 2. Active nav link detection ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('#sidebar .nav-link, #sidebar .nav-sub-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPath) {
      link.classList.add('active');
      // If it's a sub-link, open the parent accordion
      const parentItem = link.closest('.nav-item');
      if (parentItem) {
        parentItem.classList.add('open');
      }
    }
  });


  /* ── 3. Smooth scroll for in-page anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const topbarHeight = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--topbar-height')) || 60;

        window.scrollTo({
          top: targetEl.offsetTop - topbarHeight - 16,
          behavior: 'smooth'
        });

        // Close sidebar on mobile after clicking
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          if (overlay) overlay.classList.remove('visible');
        }
      }
    });
  });


  /* ── 4. Mobile sidebar overlay click-outside-to-close ── */
  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.remove('open');
      }
      overlay.classList.remove('visible');
    });
  }

});
