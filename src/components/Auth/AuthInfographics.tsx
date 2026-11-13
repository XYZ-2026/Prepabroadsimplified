import Image from 'next/image';
import styles from '@/styles/auth.module.css';

/**
 * Right-hand panel of /auth: one photograph of a counselling session with a short
 * title and three figures over it.
 *
 * To change the photo, drop the new file in /public/images/auth/ and update PHOTO.src.
 * Keep faces in the upper half: the bottom third sits under the text scrim.
 */
const PHOTO = {
  src: '/images/auth/counselling-session.webp',
  alt: 'A Clarvo counsellor walking a student through her options on a laptop',
};

const STATS = [
  { value: '25,000+', label: 'students guided' },
  { value: '147+', label: 'career roadmaps' },
  { value: '800+', label: 'universities covered' },
];

export default function AuthInfographics() {
  return (
    <figure className={styles.photoPanel}>
      <Image
        src={PHOTO.src}
        alt={PHOTO.alt}
        fill
        priority
        // Served as-is: the file is already a high-quality webp at full resolution, and
        // re-compressing it through the optimiser visibly softened faces.
        unoptimized
        className={styles.photoPanelImg}
      />

      <div className={styles.photoPanelNote}>
        <span className={styles.photoPanelNoteDot} aria-hidden="true" />
        <span>
          <strong>Counselling call</strong>
          45 minutes on Zoom
        </span>
      </div>

      <figcaption className={styles.photoPanelCaption}>
        <span className={styles.photoPanelLabel}>1-on-1 counselling</span>
        <h2 className={styles.photoPanelTitle}>Clarity starts with one honest conversation.</h2>
        <p className={styles.photoPanelText}>
          Sit down with a Clarvo counsellor and leave with a stream, a career direction and a plan.
        </p>
        <dl className={styles.photoPanelStats}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.photoPanelStat}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </figcaption>
    </figure>
  );
}
