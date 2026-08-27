'use client';

import { useState } from 'react';
import styles from '@/styles/components.module.css';

interface Notification {
  type: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  tag: string;
  tagColor: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    type: 'deadline',
    icon: '📅',
    title: 'Fall 2026 Deadlines — Top US Universities',
    desc: 'Harvard, MIT, Stanford Round 1 deadlines closing soon. Check your application status.',
    time: '2 hours ago',
    tag: 'USA',
    tagColor: '--color-blue-bright',
  },
  {
    type: 'update',
    icon: '🎓',
    title: 'UK Student Visa Processing Times Updated',
    desc: 'UKVI has revised standard processing to 3 weeks. Apply early for September 2026 intake.',
    time: '5 hours ago',
    tag: 'UK',
    tagColor: '--color-periwinkle',
  },
  {
    type: 'scholarship',
    icon: '💰',
    title: 'DAAD Scholarship 2026 Applications Open',
    desc: "Germany's DAAD scholarship for Indian students is now accepting applications. Deadline: March 2026.",
    time: '1 day ago',
    tag: 'Scholarship',
    tagColor: '--color-gold',
  },
  {
    type: 'event',
    icon: '🌍',
    title: 'Virtual University Fair — Canada & Australia',
    desc: 'Meet admission officers from 30+ universities. Register now for the free online fair.',
    time: '2 days ago',
    tag: 'Event',
    tagColor: '--color-lavender',
  },
  {
    type: 'update',
    icon: '🍁',
    title: 'Canada Study Permit Policy Change 2026',
    desc: 'IRCC has updated biometrics requirements for study permit applicants from India.',
    time: '3 days ago',
    tag: 'Canada',
    tagColor: '--color-blue-bright',
  },
  {
    type: 'deadline',
    icon: '🦘',
    title: 'Australia February 2027 Intake — Early Applications',
    desc: 'Top Australian universities are now accepting early applications for Feb 2027 intake. Secure your spot early.',
    time: '4 days ago',
    tag: 'Australia',
    tagColor: '--color-periwinkle',
  },
  {
    type: 'scholarship',
    icon: '🏆',
    title: 'Chevening Scholarship UK — Last 2 Weeks to Apply',
    desc: "Fully funded master's scholarships for outstanding students. Applications close soon.",
    time: '5 days ago',
    tag: 'Scholarship',
    tagColor: '--color-gold',
  },
  {
    type: 'update',
    icon: '📝',
    title: 'GRE Score Sending Policy Updated by ETS',
    desc: 'ETS now allows sending GRE scores to up to 8 institutions for free on test day.',
    time: '6 days ago',
    tag: 'Test Prep',
    tagColor: '--color-lavender',
  },
];

const INITIAL_COUNT = 5;

export default function NotificationPanel() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleNotifications = NOTIFICATIONS.slice(0, visibleCount);
  const hasMore = visibleCount < NOTIFICATIONS.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, NOTIFICATIONS.length));
  };

  return (
    <div>
      {visibleNotifications.map((notif, index) => (
        <div
          key={index}
          className={styles.notifItem}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span className={styles.notifIcon}>{notif.icon}</span>
          <div className={styles.notifBody}>
            <div className={styles.notifMeta}>
              <span
                className={styles.notifTag}
                style={{ color: `var(${notif.tagColor})` }}
              >
                {notif.tag}
              </span>
              <span className={styles.notifTime}>{notif.time}</span>
            </div>
            <p className={styles.notifTitle}>{notif.title}</p>
            <p className={styles.notifDesc}>{notif.desc}</p>
          </div>
        </div>
      ))}
      {hasMore && (
        <button className={styles.btnLoadMore} onClick={loadMore}>
          Load More Updates
        </button>
      )}
    </div>
  );
}
