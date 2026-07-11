'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';

interface AnalyticsClientProps {
  tierData: { name: string; count: number }[];
  strengthData: { name: string; value: number }[];
  timelineData: { date: string; avgScore: number; count: number }[];
  learningStyleData: { name: string; value: number }[];
  personalityData: { trait: string; average: number }[];
  gradeData: { name: string; value: number }[];
  careerData: { name: string; count: number }[];
  riasecData: { code: string; average: number }[];
  iqHistogramData: { range: string; count: number }[];
  personaData: { name: string; value: number }[];
  aptitudeDomainData: { domain: string; iq: number; psychometric: number }[];
}

const PIE_COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#f97316', '#ec4899'];
const LEARNING_COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981'];
const RIASEC_LABELS: Record<string, string> = {
  R: 'Realistic', I: 'Investigative', A: 'Artistic',
  S: 'Social', E: 'Enterprising', C: 'Conventional'
};

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-surface, #fff)',
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: '1px solid var(--border-color, #eaeaea)',
};

const headingStyle: React.CSSProperties = {
  marginBottom: '20px',
  color: 'var(--text-heading, #1a1a1a)',
  fontSize: '15px',
  fontWeight: 700,
  letterSpacing: '0.3px',
};

const tooltipStyle = {
  borderRadius: '10px',
  border: 'none',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  fontSize: '13px',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-muted, #888)',
  textTransform: 'uppercase',
  letterSpacing: '1.2px',
  marginBottom: '16px',
  marginTop: '36px',
  paddingBottom: '8px',
  borderBottom: '1px solid var(--border-color, #eaeaea)',
};

// Custom pie label renderer (compact)
const renderPieLabel = ({ name, percent = 0 }: any) =>
  percent > 0.04 ? `${name} (${(percent * 100).toFixed(0)}%)` : '';

export default function AnalyticsClient({
  tierData, strengthData, timelineData,
  learningStyleData, personalityData, gradeData,
  careerData, riasecData, iqHistogramData,
  personaData, aptitudeDomainData,
}: AnalyticsClientProps) {

  const riasecChartData = riasecData.map(d => ({
    code: RIASEC_LABELS[d.code] || d.code,
    average: d.average,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>

      {/* ═══ SECTION: Core Overview ═══ */}
      <p style={sectionTitle}>Core Overview</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>

        {/* Tier Distribution */}
        <div style={cardStyle}>
          <h3 style={headingStyle}>Assessment Distribution by Type</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(99,102,241,0.06)' }} contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cognitive Strengths */}
        <div style={cardStyle}>
          <h3 style={headingStyle}>Top Cognitive Strengths</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={strengthData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderPieLabel}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="var(--bg-surface, #fff)"
                >
                  {strengthData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ═══ SECTION: Trends ═══ */}
      <p style={sectionTitle}>Performance Trends</p>
      <div style={cardStyle}>
        <h3 style={headingStyle}>Assessment Trends Over Time</h3>
        <div style={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#6366f1" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '13px' }} />
              <Line yAxisId="left" type="monotone" dataKey="avgScore" name="Average IQ" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="count" name="Tests Taken" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══ SECTION: IQ Test Analytics ═══ */}
      {(iqHistogramData.some(d => d.count > 0) || personaData.length > 0) && (
        <>
          <p style={sectionTitle}>IQ Test Analytics</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>

            {/* IQ Score Distribution Histogram */}
            {iqHistogramData.some(d => d.count > 0) && (
              <div style={cardStyle}>
                <h3 style={headingStyle}>IQ Score Distribution</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={iqHistogramData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                        {iqHistogramData.map((entry, index) => {
                          const colors = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#06b6d4'];
                          return <Cell key={`iq-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Cognitive Persona */}
            {personaData.length > 0 && (
              <div style={cardStyle}>
                <h3 style={headingStyle}>Cognitive Persona Breakdown</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={personaData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderPieLabel}
                        outerRadius={100}
                        innerRadius={40}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="var(--bg-surface, #fff)"
                      >
                        {personaData.map((_, i) => (
                          <Cell key={`persona-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ SECTION: Psychometric Insights ═══ */}
      {(learningStyleData.length > 0 || personalityData.some(d => d.average > 0)) && (
        <>
          <p style={sectionTitle}>Psychometric Insights</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>

            {/* Learning Style Distribution */}
            {learningStyleData.length > 0 && (
              <div style={cardStyle}>
                <h3 style={headingStyle}>Learning Style Distribution (VARK)</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={learningStyleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderPieLabel}
                        outerRadius={100}
                        innerRadius={40}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="var(--bg-surface, #fff)"
                      >
                        {learningStyleData.map((_, i) => (
                          <Cell key={`vark-${i}`} fill={LEARNING_COLORS[i % LEARNING_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Personality Trait Averages (Radar) */}
            {personalityData.some(d => d.average > 0) && (
              <div style={cardStyle}>
                <h3 style={headingStyle}>Average Personality Profile (Big Five)</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={personalityData} cx="50%" cy="50%" outerRadius="75%">
                      <PolarGrid stroke="#e2e2e2" />
                      <PolarAngleAxis dataKey="trait" tick={{ fontSize: 11, fill: 'var(--text-body, #444)' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Average %" dataKey="average" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                      <Tooltip contentStyle={tooltipStyle} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ SECTION: Interest & Career Analytics ═══ */}
      {(riasecData.some(d => d.average > 0) || careerData.length > 0) && (
        <>
          <p style={sectionTitle}>Interest &amp; Career Analytics</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>

            {/* RIASEC Interest Profile */}
            {riasecData.some(d => d.average > 0) && (
              <div style={cardStyle}>
                <h3 style={headingStyle}>Average RIASEC Interest Profile</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riasecChartData} cx="50%" cy="50%" outerRadius="75%">
                      <PolarGrid stroke="#e2e2e2" />
                      <PolarAngleAxis dataKey="code" tick={{ fontSize: 11, fill: 'var(--text-body, #444)' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Average %" dataKey="average" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} strokeWidth={2} />
                      <Tooltip contentStyle={tooltipStyle} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Top Career Clusters */}
            {careerData.length > 0 && (
              <div style={cardStyle}>
                <h3 style={headingStyle}>Top Career Clusters</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={careerData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eaeaea" />
                      <XAxis type="number" axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" width={140} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" name="Students" radius={[0, 6, 6, 0]}>
                        {careerData.map((_, i) => (
                          <Cell key={`career-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ SECTION: Demographics & Comparison ═══ */}
      {(gradeData.length > 0 || aptitudeDomainData.some(d => d.iq > 0 || d.psychometric > 0)) && (
        <>
          <p style={sectionTitle}>Demographics &amp; Domain Comparison</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>

            {/* Grade Distribution */}
            {gradeData.length > 0 && (
              <div style={cardStyle}>
                <h3 style={headingStyle}>Student Grade Distribution</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderPieLabel}
                        outerRadius={100}
                        innerRadius={40}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="var(--bg-surface, #fff)"
                      >
                        {gradeData.map((_, i) => (
                          <Cell key={`grade-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Aptitude Domain Comparison */}
            {aptitudeDomainData.some(d => d.iq > 0 || d.psychometric > 0) && (
              <div style={cardStyle}>
                <h3 style={headingStyle}>Aptitude Domain Averages (IQ vs Psychometric)</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={aptitudeDomainData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                      <XAxis dataKey="domain" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: '13px' }} />
                      <Bar dataKey="iq" name="IQ Test" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="psychometric" name="Psychometric" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
