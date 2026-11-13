'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/student-dashboard.module.css';
import componentsStyles from '@/styles/components.module.css';
import ui from './portfolio-editor.module.css';
import { processPortrait, PortraitRuleError } from './portraitProcessor';
import {
  emptyPortfolioRecord,
  suggestUsername,
  usernameError,
  type PortfolioRecord,
} from '@/components/portfolio/portfolioTypes';

/* Editor-side shapes: comma / line separated strings are easier to type. */
type Row = Record<string, string>;

interface EditorState {
  username: string;
  published: boolean;
  fullName: string;
  photo: string;
  photoCutout: boolean;
  grade: string;
  stream: string;
  school: string;
  city: string;
  dream: string;
  bio: string;
  academics: Row[];
  activities: Row[];
  projects: Row[];
  awards: Row[];
  certifications: Row[];
  skills: Row[];
  journey: Row[];
  links: { email: string; linkedin: string; github: string; website: string; cv: string };
}

export type PortfolioSection =
  | 'basics'
  | 'photo'
  | 'about'
  | 'academics'
  | 'activities'
  | 'projects'
  | 'awards'
  | 'certifications'
  | 'skills'
  | 'journey'
  | 'links';

export interface PortfolioDefaults {
  fullName: string;
  grade: string;
  stream: string;
  school: string;
  city: string;
  email: string;
}

interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  wide?: boolean;
}

const LISTS: Record<
  'academics' | 'activities' | 'projects' | 'awards' | 'certifications' | 'skills' | 'journey',
  { title: string; hint: string; itemLabel: string; max: number; fields: FieldDef[] }
> = {
  academics: {
    title: 'Academics',
    hint: 'Grades, board results, ranks.',
    itemLabel: 'Academic record',
    max: 10,
    fields: [
      { key: 'label', label: 'Title', placeholder: 'Grade 10 Board Exams' },
      { key: 'detail', label: 'Details', placeholder: 'CBSE · Class rank #2' },
      { key: 'score', label: 'Score', placeholder: '96.2%' },
    ],
  },
  activities: {
    title: 'Leadership & Activities',
    hint: 'Clubs, student council, volunteering, internships.',
    itemLabel: 'Activity',
    max: 12,
    fields: [
      { key: 'title', label: 'Role', placeholder: 'Captain, Robotics Club' },
      { key: 'org', label: 'Organisation', placeholder: 'My School' },
      { key: 'years', label: 'Years', placeholder: '2024 — Present' },
      { key: 'detail', label: 'What you did', placeholder: 'Led a 20-member team…', textarea: true, wide: true },
    ],
  },
  projects: {
    title: 'Projects',
    hint: 'Science fair, apps, research, campaigns — anything you built or led.',
    itemLabel: 'Project',
    max: 12,
    fields: [
      { key: 'title', label: 'Project name', placeholder: 'Smart Irrigation Kit' },
      { key: 'year', label: 'Year', placeholder: '2025' },
      { key: 'tags', label: 'Tags (comma separated)', placeholder: 'Arduino, Sensors, Science Fair' },
      { key: 'link', label: 'Link (optional)', placeholder: 'https://…' },
      { key: 'tagline', label: 'Short description', placeholder: 'What it does and why it matters', textarea: true, wide: true },
    ],
  },
  awards: {
    title: 'Achievements',
    hint: 'Olympiads, competitions, sports, scholarships.',
    itemLabel: 'Achievement',
    max: 12,
    fields: [
      { key: 'title', label: 'Achievement', placeholder: 'Gold Medal' },
      { key: 'subtitle', label: 'Event', placeholder: 'National Science Olympiad' },
      { key: 'tag', label: 'Category', placeholder: 'Olympiad' },
      { key: 'detail', label: 'Details', placeholder: 'Zonal rank 14' },
    ],
  },
  certifications: {
    title: 'Courses & Certificates',
    hint: 'Online courses, workshops, music/language exams.',
    itemLabel: 'Certificate',
    max: 20,
    fields: [
      { key: 'title', label: 'Certificate', placeholder: 'Python for Beginners' },
      { key: 'issuer', label: 'Issued by', placeholder: 'Coursera' },
    ],
  },
  skills: {
    title: 'Skills',
    hint: 'Group your skills — they appear as a moving ribbon on your portfolio.',
    itemLabel: 'Skill group',
    max: 8,
    fields: [
      { key: 'name', label: 'Group', placeholder: 'Tech' },
      { key: 'skills', label: 'Skills (comma separated)', placeholder: 'Python, Scratch, Canva' },
    ],
  },
  journey: {
    title: 'My Journey',
    hint: 'Each school year is a season. Add highlights one per line as "Title: detail".',
    itemLabel: 'Season',
    max: 8,
    fields: [
      { key: 'title', label: 'Season title', placeholder: 'Grade 9 · Finding My Voice' },
      { key: 'years', label: 'Year(s)', placeholder: '2023' },
      {
        key: 'highlights',
        label: 'Highlights (one per line)',
        placeholder: 'Debate Debut: First inter-school debate\nVolunteer Tutoring: Started teaching maths',
        textarea: true,
        wide: true,
      },
    ],
  },
};

function toEditor(record: PortfolioRecord): EditorState {
  return {
    ...record,
    academics: record.academics.map((a) => ({ ...a })),
    activities: record.activities.map((a) => ({ ...a })),
    projects: record.projects.map((p) => ({ ...p, tags: p.tags.join(', ') })),
    awards: record.awards.map((a) => ({ ...a })),
    certifications: record.certifications.map((c) => ({ ...c })),
    skills: record.skills.map((g) => ({ name: g.name, skills: g.skills.join(', ') })),
    journey: record.journey.map((s) => ({
      title: s.title,
      years: s.years,
      highlights: s.highlights.map((h) => (h.detail ? `${h.title}: ${h.detail}` : h.title)).join('\n'),
    })),
    links: { ...record.links },
  };
}

function blankRow(fields: FieldDef[]): Row {
  return Object.fromEntries(fields.map((f) => [f.key, '']));
}

export default function PortfolioEditor({
  initialRecord,
  defaults,
  loadFailed,
  sections,
  title = 'My Portfolio',
  startHidden = false,
}: {
  initialRecord: PortfolioRecord | null;
  defaults: PortfolioDefaults;
  loadFailed: boolean;
  /** Which groups to render. Omit to render everything. The FULL record is always saved, so hidden groups are never wiped. */
  sections?: PortfolioSection[];
  title?: string;
  /** New records are created unpublished (used when the student has not chosen to go public yet). */
  startHidden?: boolean;
}) {
  const show = (key: PortfolioSection) => !sections || sections.includes(key);
  const [state, setState] = useState<EditorState>(() => {
    if (initialRecord) return toEditor(initialRecord);
    const base = emptyPortfolioRecord();
    return toEditor({
      ...base,
      published: startHidden ? false : base.published,
      username: suggestUsername(defaults.fullName),
      fullName: defaults.fullName,
      grade: defaults.grade,
      stream: defaults.stream,
      school: defaults.school,
      city: defaults.city,
      links: { ...base.links, email: defaults.email },
    });
  });
  const [savedUsername, setSavedUsername] = useState(initialRecord?.username || '');
  const [savedPublished, setSavedPublished] = useState(initialRecord?.published ?? false);
  const [origin, setOrigin] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const set = <K extends keyof EditorState>(key: K, value: EditorState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const setRow = (list: keyof typeof LISTS, index: number, key: string, value: string) =>
    setState((prev) => ({
      ...prev,
      [list]: prev[list].map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    }));

  const addRow = (list: keyof typeof LISTS) =>
    setState((prev) => ({ ...prev, [list]: [...prev[list], blankRow(LISTS[list].fields)] }));

  const removeRow = (list: keyof typeof LISTS, index: number) =>
    setState((prev) => ({ ...prev, [list]: prev[list].filter((_, i) => i !== index) }));

  const usernameProblem = usernameError(state.username);
  const portfolioUrl = savedUsername && origin ? `${origin}/${savedUsername}` : '';

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setSuccess('');
    setUploading(true);
    try {
      setUploadStep('Removing background…');
      const processed = await processPortrait(file);
      URL.revokeObjectURL(processed.previewUrl);

      setUploadStep('Uploading…');
      const ext = processed.blob.type === 'image/webp' ? 'webp' : processed.blob.type === 'image/png' ? 'png' : 'jpg';
      const form = new FormData();
      form.append('photo', new File([processed.blob], `portrait.${ext}`, { type: processed.blob.type }));
      const res = await fetch('/api/portfolio/photo', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      setState((prev) => ({ ...prev, photo: json.url, photoCutout: processed.cutout }));
      setSuccess(
        `${processed.note ? processed.note + ' ' : 'Background removed. '}Remember to save your portfolio.`,
      );
      setTimeout(() => setSuccess(''), 6000);
    } catch (err) {
      setError(
        err instanceof PortraitRuleError || err instanceof Error ? err.message : 'Upload failed',
      );
    } finally {
      setUploading(false);
      setUploadStep('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (loadFailed) {
      setError('Your existing portfolio could not be loaded, so saving is disabled to avoid overwriting it. Please refresh the page.');
      return;
    }
    if (usernameProblem) {
      setError(usernameProblem);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save portfolio');
      const saved: PortfolioRecord = json.portfolio;
      setState(toEditor(saved));
      setSavedUsername(saved.username);
      setSavedPublished(saved.published);
      setSuccess(saved.published ? 'Portfolio saved and live!' : 'Portfolio saved (hidden from the public).');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save portfolio');
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the URL is still visible to copy manually */
    }
  };

  const initials =
    state.fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || '?';

  return (
    <div className={styles.card} id="portfolio">
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
      </div>
      <div className={styles.cardBody}>
        {portfolioUrl ? (
          <div className={ui.urlBox}>
            <span className={ui.urlLabel}>Your portfolio URL</span>
            <span className={ui.urlText}>{portfolioUrl}</span>
            <button type="button" className={ui.urlBtn} onClick={copyUrl}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {savedPublished && (
              <a className={ui.urlBtn} href={`/${savedUsername}`} target="_blank" rel="noopener noreferrer">
                Open ↗
              </a>
            )}
            {!savedPublished && <span className={ui.urlHint}>Your portfolio is hidden. Turn on “Show my portfolio publicly” and save to share it.</span>}
          </div>
        ) : (
          <p className={ui.sectionHint}>
            Fill in the details below and save — you will get a shareable portfolio link like{' '}
            <strong>{origin || ''}/{state.username || 'your-name'}</strong>.
          </p>
        )}

        {loadFailed && (
          <div className={ui.alertError}>
            We could not load your saved portfolio right now. Saving is disabled so nothing gets overwritten — please refresh in a moment.
          </div>
        )}
        {error && <div className={ui.alertError}>{error}</div>}
        {success && <div className={ui.alertSuccess}>{success}</div>}

        <form onSubmit={handleSave}>
          {show('basics') && (
          <>
          {/* Basics */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="pf-username">Portfolio username</label>
              <input
                id="pf-username"
                value={state.username}
                onChange={(e) => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="aarav-sharma"
                maxLength={30}
                required
              />
              <small style={{ marginTop: 6, fontSize: 12, color: usernameProblem && state.username ? '#b91c1c' : '#6b7280' }}>
                {state.username && usernameProblem ? usernameProblem : `Your link: ${origin}/${state.username || '…'}`}
              </small>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="pf-name">Name on portfolio</label>
              <input id="pf-name" value={state.fullName} onChange={(e) => set('fullName', e.target.value)} maxLength={80} required />
            </div>
          </div>

          <div className={styles.formRow}>
            <label className={ui.toggle}>
              <input type="checkbox" checked={state.published} onChange={(e) => set('published', e.target.checked)} />
              Show my portfolio publicly
            </label>
          </div>
          <p className={ui.sectionHint} style={{ marginTop: -4 }}>
            A published portfolio can appear in Google search results for your name. Turn this off at any time to hide it.
          </p>

          </>
          )}

          {show('photo') && (
          <>
          {/* Photo */}
          <div className={ui.section}>
            <h3 className={ui.sectionTitle}>Hero photo</h3>
            <p className={ui.sectionHint}>
              We automatically remove the background and place you under a spotlight on your portfolio.
            </p>
            <div className={ui.photoRow}>
              <div className={ui.spotPreview}>
                {state.photo ? (
                   
                  <img
                    src={state.photo}
                    alt="Portfolio photo"
                    className={state.photoCutout ? ui.spotCutout : ui.spotBlend}
                  />
                ) : (
                  <span className={ui.spotInitials}>{initials}</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button type="button" className={ui.fileBtn} onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? uploadStep || 'Processing…' : state.photo ? 'Change photo' : 'Upload photo'}
                  </button>
                  {state.photo && !uploading && (
                    <button type="button" className={ui.removeBtn} onClick={() => setState((prev) => ({ ...prev, photo: '', photoCutout: false }))}>
                      Remove
                    </button>
                  )}
                </div>
                {uploading && (
                  <span className={ui.processingNote}>
                    The first upload downloads the background-removal model (about 30 MB), so it can take a little while.
                  </span>
                )}
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handlePhoto} />
              </div>
            </div>

            <div className={ui.rules}>
              <strong>Photo rules — for the best spotlight result</strong>
              <ul>
                <li><b>Just you:</b> one person only, no group photos.</li>
                <li><b>Face the camera:</b> front-facing, whole face visible — no sunglasses, caps, masks or face filters.</li>
                <li><b>Head &amp; shoulders:</b> chest-up framing, with some empty space above your head (don&apos;t crop the top of your head).</li>
                <li><b>Portrait orientation:</b> taller than wide, at least 400 px on the shorter side (1000 × 1250 px or larger is ideal).</li>
                <li><b>Plain background:</b> a plain wall or simple, uncluttered background that contrasts with your hair and clothes.</li>
                <li><b>Good light:</b> even light on your face, no strong light behind you, sharp focus (not blurry).</li>
                <li><b>Format:</b> JPG, PNG or WebP, up to 15 MB. Studio or black-and-white portraits work great.</li>
              </ul>
            </div>
          </div>

          </>
          )}

          {show('about') && (
          <>
          {/* About */}
          <div className={ui.section}>
            <h3 className={ui.sectionTitle}>About you</h3>
            <p className={ui.sectionHint}>Pre-filled from your profile — edit how it appears on your portfolio.</p>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="pf-grade">Grade</label>
                <input id="pf-grade" value={state.grade} onChange={(e) => set('grade', e.target.value)} placeholder="Grade 11" maxLength={40} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="pf-stream">Stream / Board</label>
                <input id="pf-stream" value={state.stream} onChange={(e) => set('stream', e.target.value)} placeholder="Science (PCM)" maxLength={60} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="pf-school">School</label>
                <input id="pf-school" value={state.school} onChange={(e) => set('school', e.target.value)} maxLength={120} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="pf-city">City</label>
                <input id="pf-city" value={state.city} onChange={(e) => set('city', e.target.value)} maxLength={60} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="pf-dream">Dream career</label>
                <input id="pf-dream" value={state.dream} onChange={(e) => set('dream', e.target.value)} placeholder="Aerospace Engineering" maxLength={80} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="pf-bio">Short bio</label>
              <textarea
                id="pf-bio"
                className={ui.textarea}
                value={state.bio}
                onChange={(e) => set('bio', e.target.value)}
                maxLength={800}
                placeholder="Tell visitors who you are, what you love and what you are working towards."
              />
            </div>
          </div>

          </>
          )}

          {/* Repeatable lists */}
          {(Object.keys(LISTS) as (keyof typeof LISTS)[]).filter((k) => show(k)).map((listKey) => {
            const cfg = LISTS[listKey];
            const rows = state[listKey];
            return (
              <div key={listKey} className={ui.section}>
                <h3 className={ui.sectionTitle}>{cfg.title}</h3>
                <p className={ui.sectionHint}>{cfg.hint}</p>
                {rows.map((row, i) => (
                  <div key={i} className={ui.item}>
                    <div className={ui.itemHead}>
                      <span>
                        {cfg.itemLabel} {i + 1}
                      </span>
                      <button type="button" className={ui.removeBtn} onClick={() => removeRow(listKey, i)}>
                        Remove
                      </button>
                    </div>
                    <div className={ui.itemGrid}>
                      {cfg.fields.map((f) => (
                        <label key={f.key} className={f.wide ? ui.wide : undefined}>
                          {f.label}
                          {f.textarea ? (
                            <textarea
                              value={row[f.key] || ''}
                              placeholder={f.placeholder}
                              onChange={(e) => setRow(listKey, i, f.key, e.target.value)}
                            />
                          ) : (
                            <input
                              value={row[f.key] || ''}
                              placeholder={f.placeholder}
                              onChange={(e) => setRow(listKey, i, f.key, e.target.value)}
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="button" className={ui.addBtn} onClick={() => addRow(listKey)} disabled={rows.length >= cfg.max}>
                  + Add {cfg.itemLabel.toLowerCase()}
                </button>
              </div>
            );
          })}

          {show('links') && (
          <>
          {/* Links */}
          <div className={ui.section}>
            <h3 className={ui.sectionTitle}>Contact & links</h3>
            <p className={ui.sectionHint}>Only filled-in links are shown on your portfolio.</p>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="pf-email">Contact email</label>
                <input id="pf-email" type="email" value={state.links.email} onChange={(e) => set('links', { ...state.links, email: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="pf-linkedin">LinkedIn URL</label>
                <input id="pf-linkedin" value={state.links.linkedin} onChange={(e) => set('links', { ...state.links, linkedin: e.target.value })} placeholder="https://linkedin.com/in/…" />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="pf-github">GitHub URL</label>
                <input id="pf-github" value={state.links.github} onChange={(e) => set('links', { ...state.links, github: e.target.value })} placeholder="https://github.com/…" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="pf-website">Website</label>
                <input id="pf-website" value={state.links.website} onChange={(e) => set('links', { ...state.links, website: e.target.value })} placeholder="https://…" />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="pf-cv">CV / Resume link</label>
                <input id="pf-cv" value={state.links.cv} onChange={(e) => set('links', { ...state.links, cv: e.target.value })} placeholder="https://drive.google.com/…" />
              </div>
            </div>
          </div>

          </>
          )}

          <div className={ui.saveBar}>
            <button
              type="submit"
              className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}
              disabled={saving || uploading || loadFailed}
            >
              {saving ? 'Saving Portfolio...' : 'Save Portfolio'}
            </button>
            {portfolioUrl && savedPublished && (
              <a href={`/${savedUsername}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600 }}>
                View my portfolio ↗
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
