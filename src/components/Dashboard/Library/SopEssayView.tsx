import Link from 'next/link';
import { BookOpenText, Clock, ExternalLink, GraduationCap, Lightbulb, PenLine, UserRound } from 'lucide-react';
import styles from '@/styles/student-library.module.css';
import type { SopDetail } from '@/lib/wix-library';

export function SopEssayView({ sop }: { sop: SopDetail }) {
  const paragraphs = sop.essay
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const source = sop.link || sop.originalLink;
  const minutes = Math.max(1, Math.round(sop.words / 220));

  return (
    <div className={styles.essayLayout}>
      <article className={styles.detail}>
        <div className={styles.cardTop}>
          {sop.level && <span className={`${styles.badge} ${styles.badgeAccent}`}>{sop.level}</span>}
          {sop.type && <span className={styles.badge}>{sop.type}</span>}
        </div>
        <h1 className={styles.detailTitle}>{sop.title}</h1>
        <div className={styles.detailMeta}>
          {sop.author && <span>By {sop.author}</span>}
          {sop.words > 0 && (
            <span>
              {sop.words.toLocaleString('en-IN')} words · {minutes} min read
            </span>
          )}
        </div>

        <div className={styles.essay}>
          {paragraphs.length > 0 ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : <p>This essay has no text.</p>}
        </div>
      </article>

      <aside className={styles.essayAside}>
        <div className={styles.asideCard}>
          <h2 className={styles.asideTitle}>About this essay</h2>
          <dl className={styles.asideFacts}>
            {sop.program && (
              <div>
                <dt>
                  <GraduationCap size={15} /> Programme
                </dt>
                <dd>{sop.program}</dd>
              </div>
            )}
            {sop.level && (
              <div>
                <dt>
                  <BookOpenText size={15} /> Level
                </dt>
                <dd>{sop.level}</dd>
              </div>
            )}
            {sop.type && (
              <div>
                <dt>
                  <PenLine size={15} /> Type
                </dt>
                <dd>{sop.type}</dd>
              </div>
            )}
            {sop.author && (
              <div>
                <dt>
                  <UserRound size={15} /> Author
                </dt>
                <dd>{sop.author}</dd>
              </div>
            )}
            {sop.words > 0 && (
              <div>
                <dt>
                  <Clock size={15} /> Length
                </dt>
                <dd>
                  {sop.words.toLocaleString('en-IN')} words · {minutes} min
                </dd>
              </div>
            )}
          </dl>
          {source && (
            <a className={styles.asideLink} href={source} target="_blank" rel="noopener noreferrer nofollow">
              View original source <ExternalLink size={13} />
            </a>
          )}
        </div>

        <div className={`${styles.asideCard} ${styles.asideTips}`}>
          <h2 className={styles.asideTitle}>
            <Lightbulb size={16} /> How to read it
          </h2>
          <ul>
            <li>Notice how the opening hooks the reader with a specific moment.</li>
            <li>Track how each paragraph links an experience to the programme.</li>
            <li>See how the ending ties goals back to this university.</li>
          </ul>
          <p>
            Use essays for inspiration only — admissions teams check for plagiarism, so always write your own story.
            {sop.license && sop.license !== 'Unknown' ? ` Licence: ${sop.license}.` : ''}
          </p>
        </div>

        <Link href="/dashboard/student/sops" className={styles.asideBack}>
          ← Browse more essays
        </Link>
      </aside>
    </div>
  );
}
