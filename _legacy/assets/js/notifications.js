'use strict';

/* ============================================================
   notifications.js — Notifications panel dynamic content loader
   Abroad Simplified
   ============================================================ */

const NOTIFICATIONS = [
  {
    type: 'deadline',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    title: 'Fall 2026 Deadlines — Top US Universities',
    desc: 'Harvard, MIT, Stanford Round 1 deadlines closing soon. Check your application status.',
    time: '2 hours ago',
    tag: 'USA',
    tagColor: '--color-blue-bright'
  },
  {
    type: 'update',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
    title: 'UK Student Visa Processing Times Updated',
    desc: 'UKVI has revised standard processing to 3 weeks. Apply early for September 2026 intake.',
    time: '5 hours ago',
    tag: 'UK',
    tagColor: '--color-periwinkle'
  },
  {
    type: 'scholarship',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="9" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>',
    title: 'DAAD Scholarship 2026 Applications Open',
    desc: "Germany's DAAD scholarship for Indian students is now accepting applications. Deadline: March 2026.",
    time: '1 day ago',
    tag: 'Scholarship',
    tagColor: '--color-gold'
  },
  {
    type: 'event',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20h.01"></path><path d="M7 20v-4"></path><path d="M2 13h15.24a3 3 0 0 0 2.54-1.42l3-5A3 3 0 0 0 20.24 2H8.84a3 3 0 0 0-2.54 1.42L3.3 8"></path></svg>',
    title: 'Virtual University Fair — Canada & Australia',
    desc: 'Meet admission officers from 30+ universities. Register now for the free online fair.',
    time: '2 days ago',
    tag: 'Event',
    tagColor: '--color-lavender'
  },
  {
    type: 'update',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M16 14h.01"></path></svg>',
    title: 'Canada Study Permit Policy Change 2026',
    desc: 'IRCC has updated biometrics requirements for study permit applicants from India.',
    time: '3 days ago',
    tag: 'Canada',
    tagColor: '--color-blue-bright'
  },
  {
    type: 'deadline',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    title: 'Australia February 2027 Intake — Early Applications',
    desc: 'Top Australian universities are now accepting early applications for Feb 2027 intake. Secure your spot early.',
    time: '4 days ago',
    tag: 'Australia',
    tagColor: '--color-periwinkle'
  },
  {
    type: 'scholarship',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="9" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>',
    title: 'Chevening Scholarship UK — Last 2 Weeks to Apply',
    desc: 'Fully funded master\'s scholarships for outstanding students. Applications close soon.',
    time: '5 days ago',
    tag: 'Scholarship',
    tagColor: '--color-gold'
  },
  {
    type: 'update',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
    title: 'GRE Score Sending Policy Updated by ETS',
    desc: 'ETS now allows sending GRE scores to up to 8 institutions for free on test day.',
    time: '6 days ago',
    tag: 'Test Prep',
    tagColor: '--color-lavender'
  }
];


document.addEventListener('DOMContentLoaded', () => {

  const notifList = document.getElementById('notif-list');
  if (!notifList) return;

  // Clear loading placeholder
  notifList.innerHTML = '';

  const INITIAL_COUNT = 5;
  let visibleCount = 0;

  /**
   * Create a single notification DOM element
   */
  const createNotifItem = (data, index) => {
    const item = document.createElement('div');
    item.className = 'notif-item';
    item.style.animationDelay = `${index * 50}ms`;

    const icon = document.createElement('span');
    icon.className = 'notif-icon';
    icon.innerHTML = data.icon;

    const body = document.createElement('div');
    body.className = 'notif-body';

    const meta = document.createElement('div');
    meta.className = 'notif-meta';

    const tag = document.createElement('span');
    tag.className = 'notif-tag';
    tag.textContent = data.tag;
    tag.style.color = `var(${data.tagColor})`;

    const time = document.createElement('span');
    time.className = 'notif-time';
    time.textContent = data.time;

    meta.appendChild(tag);
    meta.appendChild(time);

    const title = document.createElement('p');
    title.className = 'notif-title';
    title.textContent = data.title;

    const desc = document.createElement('p');
    desc.className = 'notif-desc';
    desc.textContent = data.desc;

    body.appendChild(meta);
    body.appendChild(title);
    body.appendChild(desc);

    item.appendChild(icon);
    item.appendChild(body);

    return item;
  };


  /**
   * Render a batch of notifications
   */
  const renderBatch = (startIndex, count) => {
    const endIndex = Math.min(startIndex + count, NOTIFICATIONS.length);

    for (let i = startIndex; i < endIndex; i++) {
      const el = createNotifItem(NOTIFICATIONS[i], i - startIndex);
      notifList.appendChild(el);
    }

    visibleCount = endIndex;
  };


  /**
   * Render initial items + "Load More" button
   */
  renderBatch(0, INITIAL_COUNT);

  if (NOTIFICATIONS.length > INITIAL_COUNT) {
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'btn-load-more';
    loadMoreBtn.textContent = 'Load More Updates';
    loadMoreBtn.id = 'btn-load-more';

    loadMoreBtn.addEventListener('click', () => {
      renderBatch(visibleCount, 3);

      // Hide button if all notifications shown
      if (visibleCount >= NOTIFICATIONS.length) {
        loadMoreBtn.style.display = 'none';
      }
    });

    // Insert after the notif-list but inside the container
    const container = notifList.parentElement;
    container.appendChild(loadMoreBtn);
  }

});
