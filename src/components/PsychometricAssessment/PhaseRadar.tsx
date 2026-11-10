'use client';

import React from 'react';
import { m } from 'motion/react';
import { springData } from './motion/tokens';

interface PhaseRadarProps {
  /** Index of the furthest phase reached (0–3). Axes up to it are filled. */
  activeIndex: number;
  labels: string[];
  size?: number;
  showLabels?: boolean;
  className?: string;
}

// Sample profile shape (fictional), one value per phase axis: top, right, bottom, left.
const SAMPLE_VALUES = [0.84, 0.78, 0.7, 0.88];
const C = 100;
const R = 62;
const DIRS: Array<[number, number]> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
const EMPTY = 0.08;

function point(axis: number, v: number) {
  const [dx, dy] = DIRS[axis];
  return [C + dx * R * v, C + dy * R * v] as const;
}

function shapePath(activeIndex: number) {
  const pts = DIRS.map((_, i) => point(i, i <= activeIndex ? SAMPLE_VALUES[i] : EMPTY));
  return `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
}

/**
 * Four-axis profile radar (spec 5.3). Each phase fills one more axis, so by
 * phase 4 the full shape is drawn. The path morphs with the data spring.
 */
export default function PhaseRadar({ activeIndex, labels, size = 200, showLabels = true, className = '' }: PhaseRadarProps) {
  const ring = (f: number) =>
    `M ${C} ${C - R * f} L ${C + R * f} ${C} L ${C} ${C + R * f} L ${C - R * f} ${C} Z`;

  const labelPos: Array<{ x: number; y: number; anchor: 'middle' | 'start' | 'end' }> = [
    { x: C, y: C - R - 12, anchor: 'middle' },
    { x: C + R + 8, y: C + 4, anchor: 'start' },
    { x: C, y: C + R + 20, anchor: 'middle' },
    { x: C - R - 8, y: C + 4, anchor: 'end' },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox={showLabels ? '-30 0 260 200' : '30 30 140 140'}
      className={`block shrink-0 overflow-visible ${className}`}
      role="img"
      aria-label={`Profile radar: ${activeIndex + 1} of 4 phases mapped`}
    >
      {[1, 0.66, 0.33].map((f) => (
        <path key={f} d={ring(f)} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
      ))}
      <line x1={C} y1={C - R} x2={C} y2={C + R} stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
      <line x1={C - R} y1={C} x2={C + R} y2={C} stroke="rgba(255,255,255,0.14)" strokeWidth={1} />

      <m.path
        initial={false}
        animate={{ d: shapePath(activeIndex) }}
        transition={springData}
        fill="rgba(18,88,222,0.45)"
        stroke="#1258DE"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {DIRS.map((_, i) => {
        const [x, y] = point(i, SAMPLE_VALUES[i]);
        const filled = i <= activeIndex;
        return (
          <m.circle
            key={i}
            cx={x}
            cy={y}
            initial={false}
            animate={{ r: filled ? 4.5 : 0, opacity: filled ? 1 : 0 }}
            // Tween, not spring: a spring overshoots below r=0, which SVG rejects.
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            fill={i === activeIndex ? '#E6EDFF' : '#1258DE'}
            stroke="#1258DE"
            strokeWidth={2}
          />
        );
      })}

      {showLabels &&
        labels.map((label, i) => (
          <text
            key={label}
            x={labelPos[i].x}
            y={labelPos[i].y}
            textAnchor={labelPos[i].anchor}
            fontSize={13}
            fontWeight={i === activeIndex ? 700 : 500}
            fill={i <= activeIndex ? '#E6EDFF' : 'rgba(230,237,255,0.45)'}
            style={{ transition: 'fill 300ms' }}
          >
            {label}
          </text>
        ))}
    </svg>
  );
}
