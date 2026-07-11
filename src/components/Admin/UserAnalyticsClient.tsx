'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

interface UserAnalyticsClientProps {
  totalUsers: number;
  activeAssessments: number;
  conversionRate: string;
  studentTypeData: { name: string; value: number }[];
  targetCountriesData: { name: string; count: number }[];
  fieldOfInterestData: { name: string; count: number }[];
  degreeLevelData: { name: string; value: number }[];
  stateData: { name: string; count: number }[];
  signupTimeline: { date: string; signups: number }[];
}

const PIE_COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#f97316', '#ec4899'];

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

export default function UserAnalyticsClient({
  studentTypeData, targetCountriesData, fieldOfInterestData,
  degreeLevelData, stateData, signupTimeline
}: UserAnalyticsClientProps) {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>

      {/* ═══ SECTION: Growth & Acquisition ═══ */}
      <p style={{...sectionTitle, marginTop: 0}}>Growth &amp; Acquisition</p>
      <div style={cardStyle}>
        <h3 style={headingStyle}>User Registration Timeline</h3>
        <div style={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={signupTimeline} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '13px' }} />
              <Line type="monotone" dataKey="signups" name="New Signups" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══ SECTION: Demographics ═══ */}
      <p style={sectionTitle}>User Demographics</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>

        {/* Student Type */}
        {studentTypeData.length > 0 && (
          <div style={cardStyle}>
            <h3 style={headingStyle}>Student Type Breakdown</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentTypeData}
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
                    {studentTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* State/Region */}
        {stateData.length > 0 && (
          <div style={cardStyle}>
            <h3 style={headingStyle}>Top Geographic Locations</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eaeaea" />
                  <XAxis type="number" axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Users" radius={[0, 6, 6, 0]}>
                    {stateData.map((_, i) => (
                      <Cell key={`state-${i}`} fill={PIE_COLORS[(i + 3) % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ═══ SECTION: Academic Intentions ═══ */}
      {(degreeLevelData.length > 0 || targetCountriesData.length > 0 || fieldOfInterestData.length > 0) && (
        <>
          <p style={sectionTitle}>Study Abroad Intentions</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>

            {/* Degree Level */}
            {degreeLevelData.length > 0 && (
              <div style={cardStyle}>
                <h3 style={headingStyle}>Target Degree Level</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={degreeLevelData}
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
                        {degreeLevelData.map((_, i) => (
                          <Cell key={`degree-${i}`} fill={PIE_COLORS[(i + 2) % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Target Countries */}
            {targetCountriesData.length > 0 && (
              <div style={cardStyle}>
                <h3 style={headingStyle}>Most Requested Destinations</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={targetCountriesData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eaeaea" />
                      <XAxis type="number" axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" name="Users" radius={[0, 6, 6, 0]}>
                        {targetCountriesData.map((_, i) => (
                          <Cell key={`country-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {/* Fields of Interest */}
            {fieldOfInterestData.length > 0 && (
              <div style={{...cardStyle, gridColumn: '1 / -1'}}>
                <h3 style={headingStyle}>Fields of Interest</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fieldOfInterestData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" name="Users" radius={[6, 6, 0, 0]} fill="#22d3ee" />
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
