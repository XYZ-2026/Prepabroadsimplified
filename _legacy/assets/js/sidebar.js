'use strict';

/* ============================================================
   sidebar.js — Sidebar open/close, Accordion navigation
   Abroad Simplified
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const sidebar      = document.getElementById('sidebar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const sidebarClose = document.getElementById('sidebar-close');
  const overlay      = document.querySelector('.sidebar-overlay');


  /* ── 1. Toggle sidebar open / close ── */
  const openSidebar = () => {
    document.body.classList.add('sidebar-open');
    if (sidebar) sidebar.classList.add('open');
    if (window.innerWidth <= 1024 && overlay) {
      overlay.classList.add('visible');
    }
  };

  const closeSidebar = () => {
    document.body.classList.remove('sidebar-open');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }


  /* ── 2. Accordion: click header → expand / collapse ── */
  const navItems = document.querySelectorAll('#sidebar .nav-item.has-children');

  navItems.forEach(item => {
    const header = item.querySelector('.nav-link');

    if (header) {
      header.addEventListener('click', (e) => {
        e.preventDefault();

        // Single-expand mode: close all others
        navItems.forEach(other => {
          if (other !== item && other.classList.contains('open')) {
            other.classList.remove('open');
          }
        });

        // Toggle this item
        item.classList.toggle('open');
      });
    }
  });


  /* ── 3. Close sidebar on Escape key ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

});
