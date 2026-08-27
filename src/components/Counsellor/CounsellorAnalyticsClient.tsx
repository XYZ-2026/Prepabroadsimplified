'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

interface CounsellorAnalyticsClientProps {
  iqHistogramData: { range: string; count: number }[];
  strengthData: { name: string; value: number }[];
  learningStyleData: { name: string; value: number }[];
  riasecData: { code: string; average: number }[];
  personalityData: { trait: string; average: number }[];
}

const PIE_COLORS = ['#690b1b', '#F4B400', '#7D8DBD', '#2D303C'];
const BAR_COLORS = ['#690b1b', '#8D1212', '#A59132', '#F4B400'];
const RIASEC_LABELS: Record<string, string> = {
  R: 'Realistic', I: 'Investigative', A: 'Artistic',
  S: 'Social', E: 'Enterprising', C: 'Conventional',
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
  fontWeight: 700,
  fontSize: '17px',
};

export default function CounsellorAnalyticsClient({
  iqHistogramData,
  strengthData,
  learningStyleData,
  riasecData,
  personalityData,
}: CounsellorAnalyticsClientProps) {
  const riasecChartData = riasecData.map(d => ({
    subject: RIASEC_LABELS[d.code] || d.code,
    value: d.average,
    fullMark: 100,
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px', marginTop: '8px' }}>
      {/* IQ Score Distribution */}
      {iqHistogramData.some(d => d.count > 0) && (
        <div style={cardStyle}>
          <h3 style={headingStyle}>📊 Cohort IQ Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={iqHistogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#690b1b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cognitive Strengths */}
      {strengthData.length > 0 && (
        <div style={cardStyle}>
          <h3 style={headingStyle}>🧠 Cognitive Strengths</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={strengthData}
                cx="50%"
                cy="50%"
                outerRadius="75%"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {strengthData.map((_, index) => (
                  <Cell key={`str-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Learning Styles (VARK) */}
      {learningStyleData.length > 0 && (
        <div style={cardStyle}>
          <h3 style={headingStyle}>📚 Learning Style Distribution (VARK)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={learningStyleData}
                cx="50%"
                cy="50%"
                outerRadius="75%"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {learningStyleData.map((_, index) => (
                  <Cell key={`vark-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* RIASEC Radar */}
      {riasecData.some(d => d.average > 0) && (
        <div style={cardStyle}>
          <h3 style={headingStyle}>🧭 RIASEC Interest Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riasecChartData}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="subject" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} />
              <Radar name="Average" dataKey="value" stroke="#690b1b" fill="#690b1b" fillOpacity={0.3} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Big Five Personality */}
      {personalityData.some(d => d.average > 0) && (
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <h3 style={headingStyle}>🎭 Big Five Personality Averages</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={personalityData} layout="vertical" margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} fontSize={11} />
              <YAxis type="category" dataKey="trait" width={110} fontSize={12} />
              <Tooltip formatter={(value: any) => `${value}%`} />
              <Bar dataKey="average" fill="#690b1b" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
