'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/career-library.module.css';
import { getClusterIcon } from './CareerIcons';
import type {
  CareerProfile,
  CareerRoadmap,
  ClusterDefinition,
  StreamDefinition,
  CareerLibraryFilterState
} from '@/lib/career-library/types';
import { filterCareerProfiles } from '@/lib/career-library/career-service';

interface CareerLibraryExplorerProps {
  initialProfiles: CareerProfile[];
  initialRoadmaps: Record<string, CareerRoadmap>;
  clusters: Record<string, ClusterDefinition>;
  streams: Record<string, StreamDefinition>;
}

export default function CareerLibraryExplorer({
  initialProfiles,
  initialRoadmaps,
  clusters,
  streams
}: CareerLibraryExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedFutureScope, setSelectedFutureScope] = useState('all');

  // Selected Career Profile for detailed dashboard view
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);

  // User Psychometric Match Scores
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);

  // Check URL query parameter on mount or URL change for direct navigation & refresh
  useEffect(() => {
    const careerParam = searchParams.get('career') || searchParams.get('id');
    if (careerParam) {
      const match = initialProfiles.find(p => p.id.toLowerCase() === careerParam.toLowerCase());
      if (match) {
        setSelectedCareerId(match.id);
      }
    } else {
      setSelectedCareerId(null);
    }
  }, [searchParams, initialProfiles]);

  // Fetch real psychometric results for authenticated student
  useEffect(() => {
    let isMounted = true;
    fetch('/api/career-library/match-scores')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.authenticated && data.hasReport && data.matches) {
          setMatchScores(data.matches);
        }
      })
      .catch(err => {
        console.warn('[Career Library] User psychometric match scores unavailable:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingMatches(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered Profiles
  const filteredProfiles = useMemo(() => {
    const filterState: CareerLibraryFilterState = {
      searchQuery,
      stream: 'all',
      cluster: selectedCluster,
      difficulty: selectedDifficulty,
      futureScope: selectedFutureScope
    };
    return filterCareerProfiles(initialProfiles, filterState);
  }, [initialProfiles, searchQuery, selectedCluster, selectedDifficulty, selectedFutureScope]);

  // Has active filters
  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCluster !== 'all' ||
    selectedDifficulty !== 'all' ||
    selectedFutureScope !== 'all'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCluster('all');
    setSelectedDifficulty('all');
    setSelectedFutureScope('all');
  };

  const handleOpenDetail = (careerId: string) => {
    setSelectedCareerId(careerId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    startTransition(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('career', careerId);
      window.history.pushState({}, '', url.toString());
    });
  };

  const handleBackToList = () => {
    setSelectedCareerId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    startTransition(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete('career');
      url.searchParams.delete('id');
      window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    });
  };

  // Active detailed career
  const activeProfile = useMemo(() => {
    if (!selectedCareerId) return null;
    return initialProfiles.find(p => p.id === selectedCareerId) || null;
  }, [selectedCareerId, initialProfiles]);

  const activeRoadmap = useMemo(() => {
    if (!selectedCareerId) return null;
    return initialRoadmaps[selectedCareerId] || null;
  }, [selectedCareerId, initialRoadmaps]);

  const topIndiaColleges = useMemo(() => {
    if (!activeProfile && !activeRoadmap) return [];
    return activeProfile?.topIndiaColleges || activeRoadmap?.topIndiaColleges || [];
  }, [activeProfile, activeRoadmap]);

  const studyAbroad = useMemo(() => {
    if (!activeProfile && !activeRoadmap) return [];
    return activeProfile?.studyAbroad || activeRoadmap?.studyAbroad || [];
  }, [activeProfile, activeRoadmap]);

  const collegeNotes = useMemo(() => {
    if (!activeProfile && !activeRoadmap) return [];
    return activeProfile?.collegeNotes || activeRoadmap?.collegeNotes || [];
  }, [activeProfile, activeRoadmap]);

  // Helper to render rating dots
  const renderRatingDots = (rating: number, isScope: boolean = false) => {
    const dots = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      dots.push(
        <span
          key={i}
          className={`${styles.starDot} ${
            isFilled ? (isScope ? styles.starDotScope : styles.starDotFilled) : ''
          }`}
        />
      );
    }
    return <span className={styles.starsContainer}>{dots}</span>;
  };

  return (
    <div className={styles.wrap} id="careerLibraryRoot">
      {/* Detail Dashboard View */}
      {activeProfile && activeRoadmap ? (
        <div className={styles.branchDashboard} role="region" aria-label="Career Details">
          <button
            onClick={handleBackToList}
            className={styles.backBtn}
            type="button"
            aria-label="Back to Career Library"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Career Library
          </button>

          {/* Detailed Header Card: Brief Information + Entrance Exam */}
          <div className={styles.detailHeaderCard}>
            <div className={styles.detailHeaderTags}>
              <span className={styles.branchClusterBadge}>
                {getClusterIcon(activeProfile.cluster, 15)}
                {clusters[activeProfile.cluster]?.name || 'Specialization'}
              </span>

              {typeof matchScores[activeProfile.id] === 'number' && (
                <div className={styles.matchBadge} title="Personal match based on verified psychometric assessment results">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {matchScores[activeProfile.id]}% Match with Your Psychometric Profile
                </div>
              )}
            </div>

            <h1 className={styles.detailHeaderTitle}>{activeProfile.name}</h1>
            <p className={styles.detailHeaderDesc}>{activeProfile.desc}</p>

            {/* Entrance Exam Required (If available, render; if not, skip) */}
            {activeRoadmap.entryRoute && (
              <div className={styles.entranceExamSection}>
                <div className={styles.entranceExamHeader}>
                  <svg className={styles.entranceExamIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  <span className={styles.entranceExamTitle}>Required Qualifying Route &amp; Entrance Exams</span>
                </div>
                <div className={styles.entranceExamContent}>
                  {activeRoadmap.entryRoute}
                </div>
              </div>
            )}
          </div>

          {/* Top Indian Colleges Section (Comes immediately after brief information & entrance exams) */}
          {topIndiaColleges && topIndiaColleges.length > 0 && (
            <div className={styles.collegesSectionCard}>
              <div className={styles.collegesHeader}>
                <div className={styles.collegesTitleGroup}>
                  <h2 className={styles.collegesTitle}>
                    <span style={{ fontSize: '20px' }}>🏛️</span>
                    Top Premier Indian Colleges &amp; Universities
                  </h2>
                  <p className={styles.collegesSubtitle}>
                    Ranked institutions, key campus groups, and admission entrance exams for {activeProfile.name}.
                  </p>
                </div>
              </div>

              <div className={styles.collegesGrid}>
                {topIndiaColleges.map((college) => (
                  <div key={college.rank} className={styles.collegeRowCard}>
                    <div className={styles.collegeRankBadge}>
                      #{college.rank}
                    </div>
                    <div className={styles.collegeDetails}>
                      <div className={styles.collegeName}>
                        {college.name}
                      </div>
                      {college.examples && college.examples.length > 0 && (
                        <div className={styles.collegeExamples}>
                          <strong>Key Campuses: </strong>
                          {college.examples.join(' · ')}
                        </div>
                      )}
                      {college.entry && (
                        <div className={styles.collegeEntryBadge}>
                          <span>📝 Entrance: {college.entry}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2-Column Dashboard Details Grid: All the other data */}
          <div className={styles.detailGrid}>
            {/* Left Column */}
            <div className={styles.colFlex}>
              {/* Suitability & Fit */}
              <div className={styles.detailCard}>
                <h2 className={styles.detailCardTitle}>Why This Branch Fits You</h2>
                <div className={styles.whyFitsBox}>
                  {activeRoadmap.whyFits}
                </div>

                <h2 className={styles.detailCardTitle} style={{ borderLeftColor: '#344054', marginTop: '20px' }}>
                  Who This Branch Suits
                </h2>
                <div className={styles.whoSuitsBox}>
                  {activeProfile.whoSuits}
                </div>
              </div>

              {/* 4-Year Academic / Professional Journey */}
              <div className={styles.detailCard}>
                <h2 className={styles.detailCardTitle}>4-Year Academic Journey</h2>
                <div className={styles.timeline}>
                  {activeRoadmap.yearByYear.map((stage, idx) => (
                    <div key={idx} className={styles.timelineItem}>
                      <div className={styles.timelineDot} />
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineYear}>{stage.year}</div>
                        <ul className={styles.timelineList}>
                          {stage.items.map((sub, sIdx) => (
                            <li key={sIdx}>{sub}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Subjects & Essential Tools */}
              <div className={styles.detailCard}>
                <h2 className={styles.detailCardTitle}>Core Subjects & Essential Tools</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#344054', marginBottom: '10px' }}>
                      Core Academic Subjects
                    </h3>
                    <div className={styles.badgeList}>
                      {(activeRoadmap.coreSubjects || activeProfile.coreSkills || []).map((subject, sIdx) => (
                        <span key={sIdx} className={`${styles.chip} ${styles.chipSubject}`}>
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#344054', marginBottom: '10px' }}>
                      Essential Tools & Technologies
                    </h3>
                    <div className={styles.badgeList}>
                      {(activeRoadmap.tools || activeProfile.tools || []).map((tool, tIdx) => (
                        <span key={tIdx} className={`${styles.chip} ${styles.chipTool}`}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Practical Experience & Strategy */}
              <div className={styles.detailCard}>
                <h2 className={styles.detailCardTitle}>Practical Experience & Strategy</h2>
                
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#344054', marginBottom: '12px' }}>
                  Recommended Project Ideas
                </h3>
                <div className={styles.projectsList}>
                  {activeRoadmap.projects.map((proj, pIdx) => (
                    <div key={pIdx} className={styles.projectItem}>
                      <span className={styles.projectIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </span>
                      <span className={styles.projectText}>{proj}</span>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#344054', marginTop: '22px', marginBottom: '8px' }}>
                  Internship Strategy
                </h3>
                <div className={styles.strategyBox}>
                  <strong>Industry & Field Strategy: </strong>
                  {activeRoadmap.internshipStrategy}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.colFlex}>
              {/* Careers & Salary Outlook */}
              <div className={styles.detailCard}>
                <h2 className={styles.detailCardTitle}>Careers & Salary Outlook</h2>

                {/* Salary Box with CLARVO Navy-Blue gradient */}
                <div className={styles.salaryBox}>
                  <div className={styles.salaryBoxTitle}>Expected Salary Direction</div>
                  <div className={styles.salaryBoxVal}>{activeRoadmap.salaryDirection}</div>
                </div>

                <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#344054', marginBottom: '10px' }}>
                  Potential Career Pathways
                </h3>
                <div className={styles.badgeList} style={{ marginBottom: '22px' }}>
                  {(activeRoadmap.careerPaths || activeProfile.careers || []).map((car, cIdx) => (
                    <span key={cIdx} className={styles.chip} style={{ fontWeight: 700 }}>
                      💼 {car}
                    </span>
                  ))}
                </div>

                <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#344054', marginBottom: '10px' }}>
                  Top Recruiters & Industries
                </h3>
                <div className={styles.recruiterGrid}>
                  {activeRoadmap.topRecruiters.map((rec, rIdx) => (
                    <div key={rIdx} className={styles.recruiterTag}>
                      {rec}
                    </div>
                  ))}
                </div>

                {activeRoadmap.higherEd && activeRoadmap.higherEd.length > 0 && (
                  <div style={{ marginTop: '22px' }}>
                    <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#344054', marginBottom: '10px' }}>
                      Higher Education & Certifications
                    </h3>
                    <div className={styles.badgeList}>
                      {activeRoadmap.higherEd.map((hi, hIdx) => (
                        <span key={hIdx} className={styles.chip}>
                          🎓 {hi}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Milestones & Future Trends */}
              <div className={styles.detailCard}>
                <h2 className={styles.detailCardTitle}>Milestones & Future Trends</h2>

                <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#344054', marginBottom: '10px' }}>
                  Skill-Building Milestones
                </h3>
                <div className={styles.milestonesList} style={{ marginBottom: '22px' }}>
                  {activeRoadmap.skillMilestones.map((ms, mIdx) => {
                    const splitIdx = ms.indexOf(':');
                    const semTitle = splitIdx !== -1 ? ms.slice(0, splitIdx) : `Stage ${mIdx + 1}`;
                    const semDesc = splitIdx !== -1 ? ms.slice(splitIdx + 1) : ms;
                    return (
                      <div key={mIdx} className={styles.milestoneItem}>
                        <span className={styles.milestoneSem}>{semTitle}</span>
                        <span className={styles.milestoneDesc}>{semDesc}</span>
                      </div>
                    );
                  })}
                </div>

                <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#344054', marginBottom: '10px' }}>
                  Future Industry Trends
                </h3>
                <div className={styles.badgeList} style={{ marginBottom: '22px' }}>
                  {activeRoadmap.futureTrends.map((trend, trIdx) => (
                    <span key={trIdx} className={`${styles.chip} ${styles.chipSubject}`}>
                      🚀 {trend}
                    </span>
                  ))}
                </div>

                <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#344054', marginBottom: '10px' }}>
                  Risks & Challenges
                </h3>
                <div className={styles.risksBox}>
                  {activeRoadmap.risks.map((risk, rkIdx) => (
                    <div key={rkIdx} className={styles.riskItem}>
                      <span style={{ color: '#D97706', fontWeight: 700 }}>⚠️</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Action Plan */}
              <div className={styles.actionPlanBox}>
                <h3 className={styles.actionPlanTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Your Action Plan
                </h3>
                <ul className={styles.actionList}>
                  {activeRoadmap.actionPlan.map((action, aIdx) => (
                    <li key={aIdx}>
                      <span style={{ color: '#16A34A', fontWeight: 800 }}>✓</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>

                {activeRoadmap.isFallback && (
                  <div className={styles.fallbackNotice}>
                    ℹ️ Standard curriculum benchmark synthesized from accredited academic guidelines.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Study Abroad Destinations Section (At the end, card layout for desktop view) */}
          {studyAbroad && studyAbroad.length > 0 && (
            <div className={styles.abroadSectionCard}>
              <div className={styles.abroadHeader}>
                <h2 className={styles.abroadTitle}>
                  <span style={{ fontSize: '22px' }}>🌐</span>
                  Top Study Abroad Destinations &amp; Global Universities
                </h2>
                <p className={styles.abroadSubtitle}>
                  Curated world-class institutions across 6 premier international study destinations for {activeProfile.name}.
                </p>
              </div>

              <div className={styles.abroadDestinationsGrid}>
                {studyAbroad.map((dest) => (
                  <div key={dest.code} className={styles.abroadLocationCard}>
                    <div className={styles.abroadCardTop}>
                      <div className={styles.abroadLocationHeader}>
                        <div className={styles.abroadCountryGroup}>
                          <span className={styles.abroadFlag}>{dest.flag}</span>
                          <span className={styles.abroadCountryName}>{dest.country}</span>
                        </div>
                        <span className={styles.abroadCodeBadge}>{dest.code}</span>
                      </div>
                      {dest.note && (
                        <p className={styles.abroadCountryNote}>{dest.note}</p>
                      )}
                    </div>

                    <ul className={styles.abroadUniList}>
                      {dest.universities.map((uni) => (
                        <li key={uni.rank} className={styles.abroadUniItem}>
                          <span className={styles.abroadUniRank}>{uni.rank}</span>
                          <span className={styles.abroadUniName}>{uni.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {collegeNotes && collegeNotes.length > 0 && (
                <div className={styles.collegeNotesAlert}>
                  <span style={{ fontSize: '16px' }}>ℹ️</span>
                  <div>
                    <strong>Admissions &amp; Recognition Advisory: </strong>
                    {collegeNotes.join(' ')}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Catalogue List View */
        <div className={styles.listViewPanel}>
          {/* Page Header */}
          <div className={styles.pageHdr}>
            <div className={styles.pageHdrTitle}>
              <h1 className={styles.pageTitle}>Career Library</h1>
              <p className={styles.pageSubtitle}>
                Explore comprehensive career branches, degree pathways, 4-year academic roadmaps, required tools, and salary trends across Engineering, Commerce, Arts, Law, and Sciences.
              </p>
            </div>
          </div>

          {/* Search & Filters Card */}
          <div className={styles.searchCard}>
            <div className={styles.filtersRow}>
              {/* Search input */}
              <div className={styles.searchInputGroup}>
                <div className={styles.searchBox}>
                  <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search career names, descriptions, tools, or potential outcomes..."
                    aria-label="Search career library"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Category Cluster Filter Pills */}
              <div className={styles.clusterTabs} role="tablist" aria-label="Career Clusters">
                <button
                  type="button"
                  className={`${styles.clusterPill} ${selectedCluster === 'all' ? styles.clusterPillActive : ''}`}
                  onClick={() => setSelectedCluster('all')}
                  role="tab"
                  aria-selected={selectedCluster === 'all'}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  All Specializations ({initialProfiles.length})
                </button>

                {Object.entries(clusters).map(([key, cluster]) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.clusterPill} ${selectedCluster === key ? styles.clusterPillActive : ''}`}
                    onClick={() => setSelectedCluster(key)}
                    role="tab"
                    aria-selected={selectedCluster === key}
                  >
                    {getClusterIcon(key, 15)}
                    {cluster.name}
                  </button>
                ))}
              </div>

              {/* Select Filters: Difficulty and Future Scope */}
              <div className={styles.selectFiltersGrid}>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className={styles.filterSelect}
                  aria-label="Filter by Difficulty Level"
                >
                  <option value="all">Any Difficulty Level</option>
                  <option value="2">Foundational (2/5)</option>
                  <option value="3">Moderate (3/5)</option>
                  <option value="4">Hard (4/5)</option>
                  <option value="5">Very Challenging (5/5)</option>
                </select>

                <select
                  value={selectedFutureScope}
                  onChange={(e) => setSelectedFutureScope(e.target.value)}
                  className={styles.filterSelect}
                  aria-label="Filter by Future Scope"
                >
                  <option value="all">Any Future Scope</option>
                  <option value="3">Good Scope (3+ Stars)</option>
                  <option value="4">Very High Scope (4+ Stars)</option>
                  <option value="5">Exceptional Scope (5 Stars)</option>
                </select>
              </div>
            </div>
          </div>

          {/* List View Header */}
          <div className={styles.listViewHeader}>
            <span className={styles.countBadge}>
              {filteredProfiles.length} Specialization{filteredProfiles.length === 1 ? '' : 's'} Available
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className={styles.clearFiltersBtn}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Career Cards Grid */}
          {filteredProfiles.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#FFFFFF',
              border: '1.5px solid #E4E7EC',
              borderRadius: '20px',
              color: '#667085'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#080F1C', marginBottom: '6px' }}>
                No careers found matching your criteria
              </h3>
              <p style={{ fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                Try adjusting your search terms or clearing difficulty and future scope filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className={styles.backBtn}
                style={{ margin: '0 auto' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={styles.branchesListGrid}>
              {filteredProfiles.map((profile) => {
                const clusterInfo = clusters[profile.cluster] || { name: 'Core' };
                const matchPercent = matchScores[profile.id];

                return (
                  <div
                    key={profile.id}
                    className={styles.branchCard}
                    onClick={() => handleOpenDetail(profile.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View detailed roadmap for ${profile.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenDetail(profile.id);
                      }
                    }}
                  >
                    <div className={styles.branchCardHeader}>
                      <span className={styles.branchClusterBadge}>
                        {getClusterIcon(profile.cluster, 14)}
                        {clusterInfo.name}
                      </span>

                      {typeof matchPercent === 'number' && (
                        <span className={styles.matchBadge} title="Personal match score from your diagnostic report">
                          ✓ {matchPercent}% Match
                        </span>
                      )}
                    </div>

                    <h2 className={styles.branchCardName}>{profile.name}</h2>
                    <p className={styles.branchCardDesc}>{profile.desc}</p>

                    <div className={styles.branchCardMeta}>
                      <div className={styles.cardMetaItem}>
                        <span className={styles.cardMetaLabel}>Difficulty</span>
                        <span className={styles.cardMetaVal}>
                          {profile.difficulty}/5 {renderRatingDots(profile.difficulty, false)}
                        </span>
                      </div>

                      <div className={styles.cardMetaItem}>
                        <span className={styles.cardMetaLabel}>Future Scope</span>
                        <span className={styles.cardMetaVal}>
                          {profile.futureScope}/5 {renderRatingDots(profile.futureScope, true)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
