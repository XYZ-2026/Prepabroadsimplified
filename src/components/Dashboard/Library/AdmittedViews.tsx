import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  Medal,
  PenLine,
  Sparkles,
  Trophy,
  Users,
  UserRound,
  ClipboardCheck,
  Activity,
  Clapperboard,
} from 'lucide-react';
import s from '@/styles/admitted-students.module.css';
import type { AdmittedDetail, AdmittedSummary } from '@/lib/wix-library';
import { admittedPortfolioPath, toItems } from '@/lib/admitted-portfolio';

export { toItems };

/* ───────────── helpers ───────────── */

// Site palette: white surfaces, navy text, Clarvo blue as the accent.
// College type is shown only as a thin accent line + a small pill.
const THEMES: Record<string, { accent: string; pillBg: string; pillFg: string }> = {
  'Ivy League': { accent: '#D97706', pillBg: '#FEF3C7', pillFg: '#92400E' },
  Private: { accent: '#2563EB', pillBg: '#E8F0FF', pillFg: '#1D4ED8' },
  Public: { accent: '#6366F1', pillBg: '#EEF2FF', pillFg: '#4338CA' },
};
const DEFAULT_THEME = { accent: '#98A2B3', pillBg: '#F2F4F7', pillFg: '#475467' };

export const themeFor = (collegeType: string) => THEMES[collegeType] || DEFAULT_THEME;

export function initialsOf(name: string, max = 2) {
  const stop = new Set(['of', 'the', 'and', 'at', 'in', '&', '-']);
  return (
    name
      .split(/\s+/)
      .filter((w) => w && !stop.has(w.toLowerCase()))
      .slice(0, max)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?'
  );
}

const pct = (v: number | null, max: number) => (v ? Math.max(4, Math.min(100, (v / max) * 100)) : 0);

/** "Title: detail" → bold title. */
function Item({ text, plain }: { text: string; plain?: boolean }) {
  const m = plain ? null : text.match(/^([^:]{2,80}):\s+(.*)$/);
  return m ? (
    <li>
      <strong>{m[1]}:</strong> {m[2]}
    </li>
  ) : (
    <li>{text}</li>
  );
}

/* ───────────── list page ───────────── */

function Metric({ label, value, max }: { label: string; value: number | null; max: number }) {
  return (
    <div className={s.metric}>
      <span className={s.metricLabel}>{label}</span>
      <div className={s.bar}>
        <span style={{ width: `${pct(value, max)}%` }} />
      </div>
      <span className={`${s.metricValue} ${value ? '' : s.metricNa}`}>{value ?? '—'}</span>
    </div>
  );
}

export function AdmittedCard({ student, href, gated = false }: { student: AdmittedSummary; href: string; gated?: boolean }) {
  const t = themeFor(student.collegeType);
  // `data-auth-gate` lets a surrounding <AuthGate mode="marked"> turn profile clicks into a sign-in popup.
  const gate = gated ? { 'data-auth-gate': '' } : {};
  return (
    <article className={s.card}>
      <Link href={href} className={s.cardMain} {...gate}>
        <div className={s.banner} style={{ borderTopColor: t.accent }}>
          <div className={s.bannerTop}>
            <span className={s.collegeMark} style={{ color: t.accent }}>
              {initialsOf(student.college, 3)}
            </span>
            <div className={s.collegeText}>
              <div className={s.college}>{student.college}</div>
              {student.location && <div className={s.collegeMeta}>{student.location}</div>}
            </div>
          </div>
          <div className={s.bannerTags}>
            {student.collegeType && (
              <span className={s.typePill} style={{ background: t.pillBg, color: t.pillFg }}>
                {student.collegeType}
              </span>
            )}
            {student.decision && (
              <span className={s.decision}>
                <BadgeCheck size={12} /> {student.decision}
              </span>
            )}
          </div>
        </div>
        <div className={s.body}>
          <div className={s.person}>
            <div className={s.avatar}>{initialsOf(student.name)}</div>
            <div>
              <h2 className={s.name}>{student.name}</h2>
              <div className={s.sub}>
                {[student.major, student.classYear && `Class of ${student.classYear}`].filter(Boolean).join(' · ')}
              </div>
            </div>
          </div>
          <div className={s.metrics}>
            <Metric label="GPA" value={student.gpa} max={4} />
            <Metric label="SAT" value={student.sat} max={1600} />
            <Metric label="ACT" value={student.act} max={36} />
          </div>
          {student.applicationType && (
            <div>
              <span className={s.tag}>{student.applicationType}</span>
            </div>
          )}
        </div>
      </Link>
      <div className={s.cardActions}>
        <Link href={href} className={s.actionGhost} {...gate}>
          View profile <ArrowRight size={14} />
        </Link>
        <Link href={admittedPortfolioPath(student.id)} className={s.actionPrimary}>
          <Clapperboard size={14} /> View portfolio
        </Link>
      </div>
    </article>
  );
}

export function AdmittedHero({ total }: { total: number }) {
  return (
    <div className={s.hero}>
      <svg className={s.heroArt} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.2" aria-hidden>
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </svg>
      <div className={s.heroKicker}>Real admits · Real profiles</div>
      <h1 className={s.heroTitle}>Admitted Students</h1>
      <p className={s.heroText}>
        See exactly what got students into top universities — their scores, activities, awards, leadership and the
        essays they wrote. Use them to benchmark and plan your own application.
      </p>
      <div className={s.heroStats}>
        <div className={s.heroStat}>
          <strong>{total.toLocaleString('en-IN')}</strong>
          <span>Profiles</span>
        </div>
        <div className={s.heroStat}>
          <strong>Ivy · Private · Public</strong>
          <span>Universities</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────── profile page ───────────── */

function Panel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className={s.panel}>
      <div className={s.panelHead}>
        <span className={s.panelIcon}>{icon}</span>
        <h2 className={s.panelTitle}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ListPanel({ icon, title, text, plain }: { icon: React.ReactNode; title: string; text: string; plain?: boolean }) {
  const items = toItems(text);
  if (!items.length) return null;
  return (
    <Panel icon={icon} title={title}>
      <ul className={s.list}>
        {items.map((t, i) => (
          <Item key={i} text={t} plain={plain} />
        ))}
      </ul>
    </Panel>
  );
}

function FactsPanel({ icon, title, rows }: { icon: React.ReactNode; title: string; rows: [string, string | number | null][] }) {
  const shown = rows.filter(([, v]) => v !== null && v !== '');
  if (!shown.length) return null;
  return (
    <Panel icon={icon} title={title}>
      <dl className={s.facts}>
        {shown.map(([k, v]) => (
          <div key={k} className={s.fact}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

function EssayPanel({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const topic = lines[0]?.match(/^topic:\s*(.+)$/i)?.[1];
  const paras = topic ? lines.slice(1) : lines;
  return (
    <Panel icon={<PenLine size={17} />} title={title}>
      {topic && <div className={s.essayTopic}>Topic: {topic}</div>}
      <div className={s.essay}>
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </Panel>
  );
}

function Score({ label, value, max, decimals }: { label: string; value: number | null; max: number; decimals?: boolean }) {
  if (!value) return null;
  return (
    <div className={s.score}>
      <div className={s.scoreValue}>
        {decimals ? value.toFixed(2) : value}
        <span className={s.scoreOut}> / {max}</span>
      </div>
      <div className={s.scoreLabel}>{label}</div>
      <div className={s.scoreBar}>
        <span style={{ width: `${pct(value, max)}%` }} />
      </div>
    </div>
  );
}

export function AdmittedProfile({ student: st }: { student: AdmittedDetail }) {
  const t = themeFor(st.collegeType);
  const counts: [React.ReactNode, number | null, string][] = [
    [<BookOpen key="ap" size={18} />, st.apCount, 'AP courses'],
    [<GraduationCap key="ib" size={18} />, st.ibCount, 'IB courses'],
    [<Activity key="ec" size={18} />, st.extracurricularCount, 'Activities'],
    [<Trophy key="aw" size={18} />, st.awardsCount, 'Awards'],
    [<PenLine key="es" size={18} />, st.essaysCount, 'Essays'],
  ];

  return (
    <>
      <div className={s.profileHero} style={{ borderTopColor: t.accent }}>
        <div className={s.profileTop}>
          <div className={`${s.avatar} ${s.avatarXl}`}>{initialsOf(st.name)}</div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h1 className={s.profileName}>{st.name}</h1>
            <div className={s.profileCollege}>
              Admitted to <strong>{st.college}</strong>
              {st.location ? ` · ${st.location}` : ''}
            </div>
            <div className={s.chips}>
              {st.decision && (
                <span className={`${s.chip} ${s.chipSolid}`}>
                  <BadgeCheck size={12} style={{ verticalAlign: '-2px' }} /> {st.decision}
                </span>
              )}
              {st.collegeType && (
                <span className={s.chip} style={{ background: t.pillBg, color: t.pillFg, borderColor: 'transparent' }}>
                  {st.collegeType}
                </span>
              )}
              {st.applicationType && <span className={s.chip}>{st.applicationType}</span>}
              {st.major && <span className={s.chip}>Major: {st.major}</span>}
              {st.classYear && <span className={s.chip}>Class of {st.classYear}</span>}
            </div>
            <Link href={admittedPortfolioPath(st.id)} className={`${s.actionPrimary} ${s.profilePortfolioBtn}`}>
              <Clapperboard size={15} /> View portfolio
            </Link>
          </div>
        </div>
        <div className={s.scoreRow}>
          <Score label="GPA · unweighted" value={st.gpa} max={4} decimals />
          <Score label="GPA · weighted" value={st.gpaWeighted} max={5} decimals />
          <Score label="SAT" value={st.sat} max={1600} />
          <Score label="SAT Math" value={st.satMath} max={800} />
          <Score label="SAT EBRW" value={st.satEbrw} max={800} />
          <Score label="ACT" value={st.act} max={36} />
        </div>
      </div>

      {counts.some(([, v]) => v) && (
        <div className={s.countRow}>
          {counts
            .filter(([, v]) => v)
            .map(([icon, v, label]) => (
              <div key={label} className={s.countCard}>
                <span className={s.countIcon}>{icon}</span>
                <div>
                  <div className={s.countValue}>{v}</div>
                  <div className={s.countLabel}>{label}</div>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className={s.columns}>
        <div className={s.stack}>
          <ListPanel icon={<Activity size={17} />} title="Extracurricular activities" text={st.extracurriculars} />
          <ListPanel icon={<Medal size={17} />} title="Awards & honours" text={st.awards} />
          <ListPanel icon={<Users size={17} />} title="Leadership" text={st.leadership} />
          <ListPanel icon={<HeartHandshake size={17} />} title="Community service" text={st.service} />
          <ListPanel icon={<Trophy size={17} />} title="Sports & athletics" text={st.sports} />
          <ListPanel icon={<FlaskConical size={17} />} title="Research" text={st.research} />
          <ListPanel icon={<Briefcase size={17} />} title="Work experience" text={st.work} />
          <EssayPanel title="Personal statement" text={st.personalStatement} />
          <EssayPanel title="Supplemental essays" text={st.supplementalEssays} />
        </div>
        <div className={s.stack}>
          <FactsPanel
            icon={<GraduationCap size={17} />}
            title="Academics"
            rows={[
              ['Class rank', st.classRank],
              ['School type', st.schoolType],
              ['IB / Diploma', st.ibCourses],
            ]}
          />
          <ListPanel icon={<BookOpen size={17} />} title="AP courses" text={st.apCourses} plain />
          <ListPanel icon={<Sparkles size={17} />} title="AP scores" text={st.apScores} />
          <FactsPanel
            icon={<UserRound size={17} />}
            title="Background"
            rows={[
              ['From', st.home],
              ['Gender', st.gender],
              ['Ethnicity', st.ethnicity],
              ['First-generation', st.firstGeneration],
              ['International', st.international],
            ]}
          />
          <FactsPanel
            icon={<ClipboardCheck size={17} />}
            title="Application"
            rows={[
              ['Type', st.applicationType],
              ['Recommendations', st.recommendations],
              ['Interview', st.interview],
            ]}
          />
        </div>
      </div>

      <p className={s.note}>
        Profiles are shared for learning purposes — use them to understand what successful applications look like.
        {st.sourceUrl && (
          <>
            {' '}
            <a href={st.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">
              View source ↗
            </a>
          </>
        )}
      </p>
    </>
  );
}
