'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown, Mail, RotateCcw, Award, Download, Sparkles, Trophy } from 'lucide-react';
import styles from './portfolio.module.css';
import type { PortfolioProfile } from './portfolioTypes';
import { renderResumeHtml } from './resumeHtml';

/** Where the "Explore more certifications" card leads (the courses catalogue). */
const COURSES_URL = process.env.NEXT_PUBLIC_COURSES_URL || '/book-a-demo';

/** Header call to action: signed-in students land in the portfolio editor, everyone else signs in first. */
const BUILD_PORTFOLIO_URL = '/dashboard/student/profile/edit';

type SectionId = 'story' | 'achievements' | 'certifications' | 'skills' | 'projects' | 'about' | 'journey' | 'resume';

const ALL_SECTIONS: SectionId[] = ['story', 'achievements', 'certifications', 'skills', 'projects', 'about', 'journey', 'resume'];

const SECTION_META: Record<SectionId, { label: string; hue: string }> = {
  story: { label: 'My Story', hue: 'linear-gradient(135deg,#3b1b6e,#120a24)' },
  achievements: { label: 'Achievements', hue: 'linear-gradient(135deg,#7a4a06,#1f1405)' },
  certifications: { label: 'Certifications', hue: 'linear-gradient(135deg,#0f766e,#04201d)' },
  skills: { label: 'Skills', hue: 'linear-gradient(135deg,#0c4a6e,#06141f)' },
  projects: { label: 'Projects', hue: 'linear-gradient(135deg,#7c1d3a,#22070f)' },
  about: { label: 'About Me', hue: 'linear-gradient(135deg,#3b1f7a,#120a24)' },
  journey: { label: 'My Journey', hue: 'linear-gradient(135deg,#065f46,#04140f)' },
  resume: { label: 'Resume', hue: 'linear-gradient(135deg,#334155,#0b1120)' },
};

const SKILL_COLORS = ['#f43f5e', '#38bdf8', '#f59e0b', '#34d399', '#a78bfa', '#fb923c', '#f472b6', '#22d3ee'];
const PROJECT_HUES: [string, string][] = [
  ['#f43f5e', '#7c1d3a'],
  ['#f59e0b', '#7a4a06'],
  ['#38bdf8', '#0c4a6e'],
  ['#a78bfa', '#3b1f7a'],
  ['#34d399', '#065f46'],
  ['#fb923c', '#7c2d12'],
];

const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, '0');

function visibleSections(p: PortfolioProfile): SectionId[] {
  return ALL_SECTIONS.filter((id) => {
    switch (id) {
      case 'story':
        return p.academics.length > 0 || p.activities.length > 0;
      case 'achievements':
        return p.awards.length > 0;
      case 'certifications':
        return p.certifications.length > 0;
      case 'skills':
        return p.skills.length > 0;
      case 'projects':
        return p.projects.length > 0;
      case 'about':
        return Boolean(p.bio || p.school || p.dream || p.location || p.photoUrl);
      case 'journey':
        return p.seasons.length > 0;
      case 'resume':
        return true;
    }
  });
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ kicker, title, note }: { kicker: string; title: string; note?: string }) {
  return (
    <div className={styles.sectionHead}>
      <div>
        <span className={styles.kicker}>{kicker}</span>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, x: -30, letterSpacing: '0.12em' }}
          whileInView={{ opacity: 1, x: 0, letterSpacing: '0em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
        >
          {title}
        </motion.h2>
      </div>
      {note && <p className={styles.sectionNote}>{note}</p>}
    </div>
  );
}

/** Student photo with initials fallback (also used if the image fails to load). */
function PortraitMedia({ profile }: { profile: PortfolioProfile }) {
  const [failed, setFailed] = useState(false);
  if (profile.photoUrl && !failed) {
    return (
       
      <img
        src={profile.photoUrl}
        alt={profile.fullName}
        className={profile.photoCutout ? styles.portraitCutout : styles.portraitPhoto}
        onError={() => setFailed(true)}
      />
    );
  }
  return <div className={styles.portraitInitials}>{profile.initials}</div>;
}

interface SpotChip {
  value: string;
  label: string;
}

function heroChips(profile: PortfolioProfile): SpotChip[] {
  const chips: SpotChip[] = [];
  const scored = profile.academics.find((a) => a.score && /\d/.test(a.score));
  if (scored) chips.push({ value: scored.score, label: scored.label });
  else if (profile.grade) chips.push({ value: profile.grade, label: profile.stream || profile.school });
  if (profile.awards[0]) chips.push({ value: profile.awards[0].title, label: profile.awards[0].subtitle });
  return chips.slice(0, 2);
}

/**
 * Spotlight portrait: background-removed cutout standing under a red spotlight,
 * fading into the page. Non-cutout photos are blended onto the light instead.
 */
function SpotlightPortrait({
  profile,
  variant,
  chips = [],
}: {
  profile: PortfolioProfile;
  variant: 'hero' | 'intro';
  chips?: SpotChip[];
}) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const hasPhoto = Boolean(profile.photoUrl) && !failed;

  return (
    <div className={`${styles.spotStage} ${variant === 'intro' ? styles.spotIntro : ''}`}>
      <div className={styles.spotBeam} />
      <motion.div
        className={styles.spotGlow}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={reduce ? { opacity: 1, scale: 1 } : { opacity: [0.85, 1, 0.85], scale: [1, 1.04, 1] }}
        transition={reduce ? { duration: 0.6 } : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className={styles.spotHotspot} />
      {hasPhoto ? (
         
        <motion.img
          src={profile.photoUrl}
          alt={profile.fullName}
          className={profile.photoCutout ? styles.spotImg : styles.spotImgBlend}
          onError={() => setFailed(true)}
          initial={{ opacity: 0, y: 40, filter: 'brightness(0.4)' }}
          animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
          transition={{ duration: 1.4, ease, delay: variant === 'intro' ? 0.9 : 0.2 }}
        />
      ) : (
        <div className={styles.spotInitials}>{profile.initials}</div>
      )}
      {chips.map((c, i) => (
        <motion.div
          key={c.value + i}
          className={`${styles.spotChip} ${i === 0 ? styles.spotChipLeft : styles.spotChipRight}`}
          initial={{ opacity: 0, y: 20 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
          transition={
            reduce
              ? { duration: 0.6, delay: 1 }
              : { opacity: { duration: 0.6, delay: 1 + i * 0.2 }, y: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: 1 } }
          }
        >
          <strong>{c.value}</strong>
          {c.label && <span>{c.label}</span>}
        </motion.div>
      ))}
    </div>
  );
}

/* ───────────────────────── Intro ───────────────────────── */

function Intro({ profile, onDone }: { profile: PortfolioProfile; onDone: () => void }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    const t = setTimeout(onDone, reduce ? 1000 : 3400);
    return () => clearTimeout(t);
  }, [onDone, reduce]);

  const letters = profile.firstName.toUpperCase().split('');
  const subtitle = [profile.grade, profile.school].filter(Boolean).join(' · ');
  return (
    <motion.div
      className={styles.overlay}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
      transition={{ duration: 0.7, ease }}
    >
      <button className={styles.skip} onClick={onDone}>Skip intro</button>
      <motion.div initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.6, ease }}>
        <h1 className={styles.introName} aria-label={profile.firstName}>
          {letters.map((l, i) => (
            <motion.span
              key={i}
              style={{ display: 'inline-block' }}
              initial={{ opacity: 0, y: 60, rotateX: 90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease }}
            >
              {l}
            </motion.span>
          ))}
        </h1>
        <motion.div
          className={styles.theSeries}
          initial={{ opacity: 0, letterSpacing: '1.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.6em' }}
          transition={{ delay: 1.1, duration: 1.2, ease }}
        >
          The Series
        </motion.div>
      </motion.div>
      {profile.photoUrl && <SpotlightPortrait profile={profile} variant="intro" />}
      {subtitle && (
        <motion.div
          className={styles.introRole}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          {subtitle}
        </motion.div>
      )}
      <motion.div
        className={styles.introBar}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: reduce ? 1 : 3.2, ease: 'linear' }}
      />
    </motion.div>
  );
}

/* ───────────────────────── Sections ───────────────────────── */

function Hero({ profile, firstSection, hasContact }: { profile: PortfolioProfile; firstSection?: SectionId; hasContact: boolean }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const fade = useTransform(scrollY, [0, 500], [1, 0.2]);
  const reduce = useReducedMotion();

  const meta: string[] = [];
  if (profile.stream) meta.push(profile.stream);
  if (profile.location) meta.push(profile.location);
  if (profile.projects.length) meta.push(`${profile.projects.length} Project${profile.projects.length > 1 ? 's' : ''}`);
  if (profile.awards.length) meta.push(`${profile.awards.length} Award${profile.awards.length > 1 ? 's' : ''}`);

  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroGlow} />
      <motion.div className={styles.heroCopy} style={reduce ? undefined : { opacity: fade }}>
        <motion.span className={styles.kicker} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Student Portfolio
        </motion.span>
        <motion.h1
          className={styles.heroName}
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease, delay: 0.1 }}
        >
          {profile.firstName}
        </motion.h1>
        <div className={styles.theSeries} style={{ textAlign: 'left' }}>The Series</div>
        {(profile.grade || meta.length > 0) && (
          <motion.div
            className={styles.metaRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
          >
            {profile.grade && <span className={styles.rating}>{profile.grade}</span>}
            {meta.map((m, i) => (
              <React.Fragment key={m}>
                {(i > 0 || Boolean(profile.grade)) && <span className={styles.dot} />}
                <span>{m}</span>
              </React.Fragment>
            ))}
          </motion.div>
        )}
        {profile.dream && (
          <motion.div className={styles.roleLine} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            Dream: {profile.dream}
          </motion.div>
        )}
        {profile.bio && (
          <motion.p
            className={styles.bio}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease }}
          >
            {profile.bio}
          </motion.p>
        )}
        <motion.div
          className={styles.ctaRow}
          style={{ marginTop: profile.bio ? 0 : 24 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7, ease }}
        >
          {firstSection && (
            <motion.a className={styles.btnPrimary} href={`#${firstSection}`} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              Explore my story <ArrowDown size={16} />
            </motion.a>
          )}
          {hasContact && (
            <motion.a className={styles.btnGhost} href="#contact" whileHover={{ scale: 1.04 }}>
              <Mail size={16} /> Get in touch
            </motion.a>
          )}
        </motion.div>
      </motion.div>

      <motion.div className={styles.portraitWrap} style={reduce ? undefined : { y }}>
        <SpotlightPortrait profile={profile} variant="hero" chips={heroChips(profile)} />
      </motion.div>
    </section>
  );
}

function ContinueRail({ sections }: { sections: SectionId[] }) {
  return (
    <section className={styles.section} style={{ paddingTop: 0 }}>
      <SectionHead kicker="Jump to an episode" title="Continue Exploring" />
      <div className={styles.rail}>
        {sections.map((id, i) => (
          <motion.a
            key={id}
            href={`#${id}`}
            className={styles.episode}
            style={{ background: SECTION_META[id].hue }}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease }}
            whileHover={{ y: -6 }}
          >
            <span className={styles.episodeGhost}>{pad(i + 1)}</span>
            <div className={styles.episodeInner}>
              <span className={styles.episodeNo}>EPISODE {pad(i + 1)}</span>
              <span className={styles.episodeTitle}>{SECTION_META[id].label}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function Story({ profile, ep }: { profile: PortfolioProfile; ep: string }) {
  const both = profile.academics.length > 0 && profile.activities.length > 0;
  return (
    <section className={styles.section} id="story">
      <SectionHead kicker={ep} title="My Story" note="Academics and the activities that shaped me." />
      <div className={styles.storyGrid} style={both ? undefined : { gridTemplateColumns: '1fr' }}>
        {profile.academics.length > 0 && (
          <Reveal>
            <div className={styles.card}>
              <div className={styles.label} style={{ marginTop: 0 }}>Academics</div>
              {profile.academics.map((e, i) => (
                <div key={i} className={styles.row}>
                  <div>
                    <div>{e.label}</div>
                    {e.detail && <div className={styles.rowSub}>{e.detail}</div>}
                  </div>
                  {e.score && <div className={styles.score}>{e.score}</div>}
                </div>
              ))}
            </div>
          </Reveal>
        )}
        {profile.activities.length > 0 && (
          <Reveal delay={0.12}>
            <div className={styles.card}>
              <div className={styles.label} style={{ marginTop: 0 }}>Leadership & Activities</div>
              {profile.activities.map((a, i) => (
                <div key={i} className={styles.row}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                    <div className={styles.rowSub}>{[a.org, a.detail].filter(Boolean).join(' · ')}</div>
                  </div>
                  {a.years && <div className={styles.rowSub} style={{ whiteSpace: 'nowrap' }}>{a.years}</div>}
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Achievements({ profile, ep }: { profile: PortfolioProfile; ep: string }) {
  return (
    <section className={styles.section} id="achievements">
      <SectionHead kicker={ep} title="Achievements" note="Olympiads, competitions and moments I am proud of." />
      {profile.awards.length > 0 && (
        <div className={styles.awardGrid}>
          {profile.awards.map((a, i) => (
            <motion.div
              key={i}
              className={styles.award}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7, ease }}
              whileHover={{ y: -6 }}
            >
              <div className={styles.awardTop}>
                <span className={styles.awardIcon} aria-hidden>
                  <Trophy size={16} />
                </span>
                {a.tag && <span className={styles.laurel}>{a.tag}</span>}
                <span className={styles.awardIndex}>{pad(i + 1)}</span>
              </div>
              <div className={styles.awardTitle}>{a.title}</div>
              {a.subtitle && <div className={styles.awardSub}>{a.subtitle}</div>}
              {a.detail && <div className={styles.awardDetail}>{a.detail}</div>}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function Skills({ profile, ep }: { profile: PortfolioProfile; ep: string }) {
  const groups = profile.skills.map((g, i) => ({ ...g, color: SKILL_COLORS[i % SKILL_COLORS.length] }));
  const all = groups.flatMap((g) => g.skills.map((s) => ({ skill: s, group: g.name, color: g.color })));
  // Repeat short lists so the ribbon always fills the screen width.
  const filled = all.length ? Array.from({ length: Math.max(1, Math.ceil(16 / all.length)) }, () => all).flat() : [];
  const half = Math.ceil(filled.length / 2);
  const rows = all.length > 6 ? [filled.slice(0, half), filled.slice(half)] : [filled];

  return (
    <section className={styles.section} id="skills" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div style={{ padding: '0 clamp(16px, 4vw, 56px)' }}>
        <SectionHead kicker={ep} title="My Skills" note="What I study, build, create and play." />
        <div className={styles.legend}>
          {groups.map((g) => (
            <span key={g.name}>
              <i style={{ background: g.color }} /> {g.name}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.marquee}>
        {rows.map((row, r) => (
          <div key={r} className={styles.marqueeRow}>
            <div className={`${styles.marqueeTrack} ${r % 2 ? styles.marqueeReverse : ''}`}>
              {[...row, ...row].map((s, i) => (
                <span key={i} className={styles.ribbonChip} aria-hidden={i >= row.length}>
                  <i style={{ background: s.color }} />
                  {s.skill}
                  <small>{s.group}</small>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects({ profile, ep }: { profile: PortfolioProfile; ep: string }) {
  return (
    <section className={styles.section} id="projects">
      <SectionHead kicker={ep} title="My Projects" note="Things I have built, researched and led." />
      <div className={styles.projects}>
        {profile.projects.map((p, i) => {
          const hue = PROJECT_HUES[i % PROJECT_HUES.length];
          return (
            <motion.article
              key={i}
              className={styles.project}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease }}
              whileHover={{ y: -6 }}
            >
              <div className={styles.projectArt} style={{ background: `linear-gradient(135deg, ${hue[0]}, ${hue[1]})` }}>
                <span>{pad(i + 1)}</span>
                {p.year && <small>{p.year}</small>}
              </div>
              <div className={styles.projectBody}>
                <h3 className={styles.projectTitle}>{p.title}</h3>
                {p.tagline && <p className={styles.projectDesc}>{p.tagline}</p>}
                {p.tags.length > 0 && (
                  <div className={styles.stack}>
                    {p.tags.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                )}
                {p.link && (
                  <a className={styles.projectLink} href={p.link} target="_blank" rel="noopener noreferrer nofollow">
                    View project <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function About({ profile, ep }: { profile: PortfolioProfile; ep: string }) {
  const facts = [
    ['Studying', [profile.grade, profile.stream].filter(Boolean).join(' · ')],
    ['School', profile.school],
    ['Based in', profile.location],
    ['Dream', profile.dream],
  ].filter(([, v]) => v);

  return (
    <section className={styles.section} id="about">
      <SectionHead kicker={ep} title="About Me" />
      <div className={styles.aboutGrid}>
        <Reveal>
          <div className={styles.portrait} style={{ width: '100%' }}>
            <PortraitMedia profile={profile} />
            <div className={styles.portraitFade} />
            <div className={styles.portraitCaption}>{profile.fullName}</div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          {profile.bio && (
            <>
              <blockquote className={styles.quote}>&ldquo;{profile.bio}&rdquo;</blockquote>
              <div className={styles.quoteBy}>— {profile.fullName}</div>
            </>
          )}
          {facts.length > 0 && (
            <div className={styles.factGrid}>
              {facts.map(([k, v]) => (
                <div key={k} className={styles.fact}>
                  <div className={styles.factLabel}>{k}</div>
                  <div className={styles.factValue}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Journey({ profile, ep }: { profile: PortfolioProfile; ep: string }) {
  const [season, setSeason] = useState(profile.seasons.length - 1);
  const s = profile.seasons[Math.min(season, profile.seasons.length - 1)];
  if (!s) return null;
  return (
    <section className={styles.section} id="journey">
      <SectionHead
        kicker={`${ep} · ${profile.seasons.length} Season${profile.seasons.length > 1 ? 's' : ''}`}
        title="My Journey"
        note="Every school year is a new season."
      />
      {profile.seasons.length > 1 && (
        <div className={styles.seasonTabs}>
          {profile.seasons.map((x, i) => (
            <button
              key={i}
              className={`${styles.seasonTab} ${i === season ? styles.seasonTabActive : ''}`}
              onClick={() => setSeason(i)}
            >
              Season {pad(i + 1)}
            </button>
          ))}
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={season}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.45, ease }}
        >
          <h3 className={styles.seasonHeading}>
            <span>S{pad(season + 1)}</span>
            {s.title}
            {s.years && <small className={styles.rowSub}>{s.years}</small>}
          </h3>
          <div className={styles.epList}>
            {s.highlights.map((e, i) => (
              <div key={i} className={styles.epItem}>
                <div className={styles.epNum}>{i + 1}</div>
                <div>
                  <div className={styles.epTitle}>{e.title}</div>
                  {e.detail && <div className={styles.epDetail}>{e.detail}</div>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Certifications({ profile, ep }: { profile: PortfolioProfile; ep: string }) {
  const external = /^https?:\/\//i.test(COURSES_URL);
  return (
    <section className={styles.section} id="certifications">
      <SectionHead kicker={ep} title="Certifications" note="Courses and credentials I have earned along the way." />
      <div className={styles.certGrid}>
        {profile.certifications.map((c, i) => (
          <motion.div
            key={i}
            className={styles.certCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.6, ease }}
            whileHover={{ y: -6 }}
          >
            <div className={styles.certIcon}>
              <Award size={20} />
            </div>
            <div className={styles.certTitle}>{c.title}</div>
            {c.issuer && <div className={styles.certIssuer}>{c.issuer}</div>}
            <span className={styles.certNo}>{pad(i + 1)}</span>
          </motion.div>
        ))}
        <motion.a
          href={COURSES_URL}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={`${styles.certCard} ${styles.certCta}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: profile.certifications.length * 0.06, duration: 0.6, ease }}
          whileHover={{ y: -6 }}
        >
          <div className={styles.certIcon}>
            <Sparkles size={20} />
          </div>
          <div className={styles.certTitle}>Explore more certifications</div>
          <div className={styles.certCtaText}>
            Browse CLARVO courses and earn certificates that make your profile stand out.
          </div>
          <span className={styles.certCtaLink}>
            View courses <ArrowRight size={14} />
          </span>
        </motion.a>
      </div>
    </section>
  );
}

function Resume({ profile, ep }: { profile: PortfolioProfile; ep: string }) {
  const html = React.useMemo(() => renderResumeHtml(profile, 'preview'), [profile]);
  const href = `/api/portfolio/resume/${encodeURIComponent(profile.username)}`;
  return (
    <section className={styles.section} id="resume">
      <SectionHead kicker={ep} title="My Resume" note="Every episode of my story, on one professional page." />
      <div className={styles.resumeWrap}>
        <Reveal>
          <a href={href} className={styles.resumePaper} aria-label={`Download ${profile.fullName}'s resume (PDF)`}>
            <iframe
              title={`${profile.fullName} — resume preview`}
              srcDoc={html}
              sandbox=""
              loading="lazy"
              tabIndex={-1}
              className={styles.resumeFrame}
            />
          </a>
        </Reveal>
        <Reveal delay={0.15}>
          <div className={styles.resumeCopy}>
            <p className={styles.resumeLead}>
              A clean, recruiter-ready resume built automatically from this portfolio — education, achievements,
              projects, activities, certifications and skills.
            </p>
            <a className={styles.btnPrimary} href={href}>
              <Download size={16} /> Download resume (PDF)
            </a>
            <p className={styles.resumeNote}>A4 · PDF · always up to date with this portfolio</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Finale({ profile, onReplay }: { profile: PortfolioProfile; onReplay: () => void }) {
  const subtitle = [profile.grade, profile.school].filter(Boolean).join(' · ');
  return (
    <section className={styles.finale} id="contact">
      <span className={styles.kicker}>The next episode</span>
      <motion.h2
        className={styles.finaleTitle}
        initial={{ opacity: 0, scale: 1.2, filter: 'blur(14px)' }}
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
      >
        To Be Continued…
      </motion.h2>
      <div className={styles.finaleName}>{profile.fullName}</div>
      {subtitle && <div className={styles.finaleSub}>{subtitle}</div>}
      {profile.links.length > 0 && (
        <div className={styles.finaleLinks}>
          {profile.links.map((l, i) => (
            <motion.a
              key={l.label}
              className={i === 0 ? styles.btnPrimary : styles.pillLink}
              href={l.href}
              target={l.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={l.href.startsWith('mailto:') ? undefined : 'noopener noreferrer nofollow'}
              whileHover={{ y: -3 }}
            >
              {l.label}
            </motion.a>
          ))}
        </div>
      )}
      <button className={styles.replay} onClick={onReplay}>
        <RotateCcw size={12} /> Replay intro
      </button>
    </section>
  );
}

/* ───────────────────────── Root ───────────────────────── */

export default function PortfolioExperience({ profile }: { profile: PortfolioProfile }) {
  const [introDone, setIntroDone] = useState(false);
  const [solidNav, setSolidNav] = useState(false);
  const sections = visibleSections(profile);

  useEffect(() => {
    const onScroll = () => setSolidNav(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (introDone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [introDone]);

  const finishIntro = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIntroDone(true);
  }, []);

  const replay = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIntroDone(false);
  };

  const ep = (id: SectionId) => `Episode ${pad(sections.indexOf(id) + 1)}`;
  const render: Record<SectionId, React.ReactNode> = {
    story: <Story key="story" profile={profile} ep={ep('story')} />,
    achievements: <Achievements key="achievements" profile={profile} ep={ep('achievements')} />,
    certifications: <Certifications key="certifications" profile={profile} ep={ep('certifications')} />,
    skills: <Skills key="skills" profile={profile} ep={ep('skills')} />,
    projects: <Projects key="projects" profile={profile} ep={ep('projects')} />,
    about: <About key="about" profile={profile} ep={ep('about')} />,
    journey: <Journey key="journey" profile={profile} ep={ep('journey')} />,
    resume: <Resume key="resume" profile={profile} ep={ep('resume')} />,
  };

  return (
    <div className={styles.root}>
      <div className={styles.grain} />

      <AnimatePresence mode="wait">
        {!introDone ? (
          <Intro key="intro" profile={profile} onDone={finishIntro} />
        ) : (
          <motion.div key="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <nav className={`${styles.nav} ${solidNav ? styles.navSolid : ''}`}>
              <a href="#home" className={styles.logo}>
                <span className={styles.logoMark}>{profile.initials}</span>
                <span className={styles.logoWord}>{profile.firstName}</span>
              </a>
              <div className={styles.navLinks}>
                <a href="#home">Home</a>
                {sections.map((id) => (
                  <a key={id} href={`#${id}`}>
                    {SECTION_META[id].label}
                  </a>
                ))}
              </div>
              <a className={styles.navBuild} href={BUILD_PORTFOLIO_URL} title="Create your own portfolio with CLARVO — free">
                <Sparkles size={13} aria-hidden />
                <span className={styles.navBuildLong}>Build your portfolio with CLARVO</span>
                <span className={styles.navBuildShort}>Build yours</span>
              </a>
              <a className={styles.navCta} href="#contact">Contact</a>
            </nav>

            <main>
              <Hero profile={profile} firstSection={sections[0]} hasContact={profile.links.length > 0} />
              {sections.length > 1 && <ContinueRail sections={sections} />}
              {sections.map((id) => render[id])}
              <Finale profile={profile} onReplay={replay} />
            </main>

            <footer className={styles.footer}>
              {profile.fullName} · Student portfolio
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
