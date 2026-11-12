import React from 'react';
import Link from 'next/link';
import { Pencil, FileText, Check } from 'lucide-react';
import RequestAccessButton from '@/components/Auth/RequestAccessButton';
import { formatGradeLabel, normalizeGrade, getStudentPsychometricAccess } from '@/lib/psychometric-access-policy';
import type { CompletionResult, NextStep, SectionKey } from '@/lib/student-profile-meta';
import type { StudentProfileData } from '@/components/Profile/StudentProfileView';
import styles from '@/styles/student-profile-hub.module.css';

export interface StudentProfileHubData extends StudentProfileData {
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  parentRelation?: string;
}

interface Props {
  student: StudentProfileHubData;
  completion: CompletionResult;
  nextStep: NextStep;
  savedCareersCount: number;
  editUrl?: string;
}

const EDIT_URL = '/dashboard/student/profile/edit';

function Field({ label, value, note, verified }: { label: string; value?: string; note?: string; verified?: boolean }) {
  const empty = !value || value === 'Not Provided' || value === 'Not Specified';
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabel}>{label}</div>
      <div className={`${styles.fieldValue} ${empty ? styles.fieldEmpty : ''}`}>
        {empty ? 'Not provided' : value}
        {verified && !empty && <span className={styles.badgeOk}>Verified</span>}
      </div>
      {note && <div className={styles.fieldNote}>{note}</div>}
    </div>
  );
}

export default function StudentProfileHub({ student, completion, nextStep, savedCareersCount, editUrl = EDIT_URL }: Props) {
  const name = student.name || 'Student';
  const rawGrade = student.grade || student.academicGrade;
  const grade = normalizeGrade(rawGrade);
  const gradeLabel = formatGradeLabel(rawGrade);
  const access = getStudentPsychometricAccess(rawGrade, student.toolAccess);
  const school = student.schoolName || student.currentSchool || '';
  const location = [student.city, student.state].filter((x) => x && x !== 'Not Provided').join(', ');
  const needsStream = grade === '11' || grade === '12';
  const degree = student.degreeLevel && student.degreeLevel !== 'Not Provided' ? student.degreeLevel : '';

  const chip = grade ? (needsStream ? 'Class 11/12' : `Grade ${grade}`) : 'Student';
  const completeBySection = Object.fromEntries(completion.sections.map((s) => [s.key, s.complete])) as Record<SectionKey, boolean>;

  const railItems: { id: string; label: string; key?: SectionKey }[] = [
    { id: 'personal', label: 'Personal & Contact', key: 'personal' },
    { id: 'academics', label: 'Academics', key: 'academics' },
    { id: 'goals', label: 'Goals & Interests', key: 'goals' },
    { id: 'abroad', label: 'Study Abroad', key: 'abroad' },
    { id: 'guardian', label: 'Parent / Guardian', key: 'guardian' },
    { id: 'counsellor', label: 'My Counsellor' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  const hasCounsellor = student.counsellorName && student.counsellorName !== 'Not Assigned';

  return (
    <div className={styles.hub}>
      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroMain}>
          <div className={styles.avatar} aria-hidden="true">{name.charAt(0).toUpperCase()}</div>
          <div className={styles.heroText}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{name}</h1>
              <span className={styles.chip}>{chip}</span>
            </div>
            <p className={styles.contact}>
              {student.email}
              {student.mobile && student.mobile !== 'Not Provided' ? ` · ${student.mobile}` : ''}
            </p>
          </div>
        </div>
        <div className={styles.heroActions}>
          <Link href="/dashboard/student/assessments" className={styles.btnGhost}>
            <FileText size={16} /> My Assessments
          </Link>
          <Link href={editUrl} className={styles.btnPrimary}>
            <Pencil size={16} /> Update Profile
          </Link>
        </div>
      </header>

      {/* Next step + completion */}
      <div className={styles.topGrid}>
        <section className={styles.nextCard} aria-label="Your next step">
          <span className={styles.eyebrow}>Your next step</span>
          <h2 className={styles.nextTitle}>{nextStep.title}</h2>
          <p className={styles.nextBody}>{nextStep.body}</p>
          <div className={styles.nextActions}>
            {nextStep.requestAccess ? (
              <RequestAccessButton toolName="Psychometric Test" toolId="psychometricTest" />
            ) : (
              <Link href={nextStep.href} className={styles.ctaBtn}>{nextStep.cta}</Link>
            )}
            {nextStep.secondary && (
              <Link href={nextStep.secondary.href} className={styles.linkBtn}>{nextStep.secondary.label} →</Link>
            )}
          </div>
        </section>

        <section className={styles.meterCard} aria-label="Profile completion">
          <div className={styles.meterHead}>
            <span className={styles.meterTitle}>Profile completion</span>
            <span className={styles.meterPct}>{completion.percent}%</span>
          </div>
          <div className={styles.meterTrack} role="progressbar" aria-valuenow={completion.percent} aria-valuemin={0} aria-valuemax={100}>
            <div className={styles.meterFill} style={{ width: `${completion.percent}%` }} />
          </div>
          <p className={styles.meterHint}>
            {completion.missing.length === 0
              ? 'Your profile is complete — counsellors and reports can use your full details.'
              : `Still missing: ${completion.missing.slice(0, 3).join(', ')}${completion.missing.length > 3 ? ` +${completion.missing.length - 3} more` : ''}.`}
          </p>
        </section>
      </div>

      <div className={styles.layout}>
        {/* Section rail */}
        <nav className={styles.rail} aria-label="Profile sections">
          <ul className={styles.railList}>
            {railItems.map((item) => {
              const done = item.key ? completeBySection[item.key] : undefined;
              return (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={styles.railLink}>
                    {done !== undefined && (
                      <span className={`${styles.tick} ${done ? styles.tickDone : ''}`} aria-label={done ? 'Complete' : 'Incomplete'}>
                        {done && <Check size={11} strokeWidth={3} />}
                      </span>
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.content}>
          {/* Personal */}
          <section id="personal" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Personal &amp; Contact Details</h2>
              <Link href={editUrl} className={styles.sectionEdit}>Edit</Link>
            </div>
            <div className={styles.grid}>
              <Field label="Full name" value={student.name} />
              <Field label="Email address" value={student.email} />
              <Field label="Mobile number" value={student.mobile} />
              <Field label="Location" value={location} />
              <Field label="Member since" value={student.createdAtStr === 'Unknown' ? '' : student.createdAtStr} />
            </div>
          </section>

          {/* Academics */}
          <section id="academics" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Academic Profile &amp; Stage</h2>
              <Link href={editUrl} className={styles.sectionEdit}>Edit</Link>
            </div>
            <div className={styles.grid}>
              <Field
                label="Academic stage"
                value={grade ? gradeLabel : ''}
                verified={!!grade}
                note={
                  access.status === 'ELIGIBLE'
                    ? `✓ Unlocked: ${access.eligibleTestName}`
                    : access.status === 'DISABLED'
                    ? 'Assessment access pending approval'
                    : 'Set your grade to unlock your assessment'
                }
              />
              <Field label="School / college" value={school} />
              <Field label="Education board" value={student.board} />
              {(needsStream || student.stream) && <Field label="Academic stream" value={student.stream} />}
              <Field label="Expected graduation year" value={student.graduationYear} />
            </div>
          </section>

          {/* Goals */}
          <section id="goals" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Goals &amp; Priorities</h2>
              <Link href={editUrl} className={styles.sectionEdit}>Edit</Link>
            </div>
            {(student.goals?.length || 0) + (student.declaredInterests?.length || 0) > 0 ? (
              <div className={styles.panel}>
                {!!student.goals?.length && (
                  <>
                    <div className={styles.panelLabel}>Target priorities</div>
                    <div className={styles.tags}>
                      {student.goals!.map((g, i) => <span key={i} className={styles.tag}>✓ {g}</span>)}
                    </div>
                  </>
                )}
                {!!student.declaredInterests?.length && (
                  <div className={student.goals?.length ? styles.panelGap : undefined}>
                    <div className={styles.panelLabel}>Declared interest fields</div>
                    <div className={styles.tags}>
                      {student.declaredInterests!.map((g, i) => <span key={i} className={`${styles.tag} ${styles.tagAccent}`}>★ {g}</span>)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.promo}>
                <p className={styles.promoText}>Tell us what you are aiming for — it sharpens your career matches and counsellor sessions.</p>
                <Link href={editUrl} className={styles.ctaBtn}>Add goals</Link>
              </div>
            )}
          </section>

          {/* Study abroad */}
          <section id="abroad" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Study Abroad Preferences</h2>
              <Link href={editUrl} className={styles.sectionEdit}>Edit</Link>
            </div>
            <div className={styles.grid}>
              <Field label="Target countries" value={student.targetCountries} />
              <Field label="Degree level sought" value={degree} />
              <Field label="Field of interest / major" value={student.fieldOfInterest} />
            </div>
          </section>

          {/* Guardian */}
          <section id="guardian" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Parent / Guardian</h2>
              <Link href={editUrl} className={styles.sectionEdit}>Edit</Link>
            </div>
            <div className={styles.grid}>
              <Field label="Name" value={student.parentName} />
              <Field label="Relationship" value={student.parentRelation} />
              <Field label="Phone / WhatsApp" value={student.parentPhone} />
              <Field label="Email" value={student.parentEmail} />
            </div>
          </section>

          {/* Counsellor */}
          <section id="counsellor" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>My Counsellor</h2>
            </div>
            {hasCounsellor ? (
              <div className={styles.counsellor}>
                <div>
                  <div className={styles.counsellorName}>{student.counsellorName}</div>
                  <div className={styles.counsellorRole}>{student.counsellorDesignation || 'Education Counsellor'}</div>
                </div>
                {student.counsellorEmail && <div className={styles.counsellorMeta}>Email: <strong>{student.counsellorEmail}</strong></div>}
                {student.counsellorMobile && <div className={styles.counsellorMeta}>Phone: <strong>{student.counsellorMobile}</strong></div>}
              </div>
            ) : (
              <div className={styles.promo}>
                <p className={styles.promoText}>A counsellor will be assigned to you shortly. Want to speak to one sooner?</p>
                <Link href="/book-a-demo?from=dashboard:counsellor" className={styles.ctaBtn}>Book a consultation</Link>
              </div>
            )}
          </section>

          {/* Portfolio + saved */}
          <section id="portfolio" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Portfolio &amp; Saved Careers</h2>
            </div>
            <div className={styles.promo}>
              <p className={styles.promoText}>
                Build your public portfolio from your activities, projects and awards. You have{' '}
                <strong>{savedCareersCount}</strong> saved career{savedCareersCount === 1 ? '' : 's'}.
              </p>
              <div className={styles.nextActions}>
                <Link href="/dashboard/student/extracurriculars" className={styles.ctaBtn}>Open Extracurriculars</Link>
                <Link href="/dashboard/student/saved-careers" className={styles.linkBtn}>Saved careers →</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
