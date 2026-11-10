'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';
import { Sparkles, RotateCw, Play, Pause } from 'lucide-react';

interface PhaseNode {
  id: string;
  badge: 'P1' | 'P2' | 'P3' | 'P4';
  title: string;
  modules: string;
  trait: string;
  x: number;
  y: number;
  z: number;
  color: string;
  glowColor: string;
}

export default function HeroPhaseScene3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  const [hoveredNode, setHoveredNode] = useState<PhaseNode | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string>('all');

  const hoveredNodeRef = useRef<PhaseNode | null>(null);
  const isAutoRotatingRef = useRef<boolean>(true);

  hoveredNodeRef.current = hoveredNode;
  isAutoRotatingRef.current = isAutoRotating;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    // 4 Convergent Phase Nodes in 3D tetrahedral orbital coordinates
    const radius = 145;
    const nodes: PhaseNode[] = [
      {
        id: 'p1',
        badge: 'P1',
        title: 'Personality Architecture',
        modules: 'Modules 01–10',
        trait: 'Big Five & Persistence',
        x: -radius * 0.95,
        y: -radius * 0.55,
        z: -35,
        color: '#1258DE',
        glowColor: 'rgba(18, 88, 222, 0.45)',
      },
      {
        id: 'p2',
        badge: 'P2',
        title: 'Cognitive Processing',
        modules: 'Modules 11–20',
        trait: 'Pattern Logic & Speed',
        x: radius * 0.95,
        y: -radius * 0.55,
        z: 35,
        color: '#2563EB',
        glowColor: 'rgba(37, 99, 235, 0.45)',
      },
      {
        id: 'p3',
        badge: 'P3',
        title: 'Learning & execution',
        modules: 'Modules 21–28',
        trait: 'VARK Modalities & Focus',
        x: -radius * 0.85,
        y: radius * 0.65,
        z: 45,
        color: '#0284C7',
        glowColor: 'rgba(2, 132, 199, 0.45)',
      },
      {
        id: 'p4',
        badge: 'P4',
        title: 'Stream & career alignment',
        modules: 'Modules 29–30',
        trait: 'Holland RIASEC Stream Fit',
        x: radius * 0.85,
        y: radius * 0.65,
        z: -45,
        color: '#4F46E5',
        glowColor: 'rgba(79, 70, 229, 0.45)',
      },
    ];

    // Background volumetric particle constellation (120 particles)
    const particleCount = 120;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * radius * 3.2,
      y: (Math.random() - 0.5) * radius * 3.2,
      z: (Math.random() - 0.5) * radius * 2.5,
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.006 + 0.002,
    }));

    // Mouse / Pointer tracking variables
    let targetRotX = 0.12;
    let targetRotY = -0.18;
    let currentRotX = 0.12;
    let currentRotY = -0.18;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    let mouseClientX = -9999;
    let mouseClientY = -9999;

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      setIsAutoRotating(false);
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseClientX = e.clientX - rect.left;
      mouseClientY = e.clientY - rect.top;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX -= deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotY = nx * 0.65;
        targetRotX = -ny * 0.45;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handlePointerDown);
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      // Autonomous orbital drift if not dragging and auto-rotation is on
      if (isAutoRotatingRef.current && !isDragging) {
        targetRotY += 0.003;
      }

      // Smooth physics damping (lerp 0.06)
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 420;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      // 3D perspective projection function
      const project = (p: { x: number; y: number; z: number }) => {
        // Rotate around Y
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        // Rotate around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const scale = fov / (fov + z2 + 220);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          scale,
          depth: z2,
        };
      };

      // ── 1. RENDER BACKGROUND VOLUMETRIC PARTICLES ──
      particles.forEach((pt) => {
        // Slow axial drift
        pt.z = ((pt.z + pt.speed * 40 + radius * 1.25) % (radius * 2.5)) - radius * 1.25;
        const proj = project(pt);
        if (proj.depth > -180) {
          const alpha = Math.max(0.05, Math.min(0.7, (proj.depth + 180) / 360)) * pt.alpha;
          ctx.fillStyle = `rgba(18, 88, 222, ${alpha})`;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, pt.size * proj.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ── 2. RENDER 3D ORBITAL GUIDE RINGS ──
      ctx.save();
      ctx.strokeStyle = 'rgba(18, 88, 222, 0.14)';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      const ringSteps = 64;
      for (let i = 0; i <= ringSteps; i++) {
        const theta = (i / ringSteps) * Math.PI * 2;
        const rx = Math.cos(theta) * radius * 1.1;
        const rz = Math.sin(theta) * radius * 1.1;
        const pt = project({ x: rx, y: 0, z: rz });
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();

      // Outer inclined ring
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.beginPath();
      for (let i = 0; i <= ringSteps; i++) {
        const theta = (i / ringSteps) * Math.PI * 2;
        const rx = Math.cos(theta) * radius * 1.35;
        const ry = Math.sin(theta) * radius * 0.45;
        const pt = project({ x: rx, y: ry, z: 0 });
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();
      ctx.restore();

      // Project center synthesis core
      const centerProj = project({ x: 0, y: 0, z: 0 });

      // ── 3. RENDER CONVERGENT DATA STRANDS & PHOTON PACKETS ──
      nodes.forEach((node, idx) => {
        const nodeProj = project(node);

        // Gradient line from node to center core
        const grad = ctx.createLinearGradient(nodeProj.px, nodeProj.py, centerProj.px, centerProj.py);
        grad.addColorStop(0, `${node.color}dd`);
        grad.addColorStop(0.5, 'rgba(18, 88, 222, 0.4)');
        grad.addColorStop(1, 'rgba(37, 99, 235, 0.85)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(1.4, 2.4 * nodeProj.scale);
        ctx.beginPath();
        ctx.moveTo(nodeProj.px, nodeProj.py);
        ctx.lineTo(centerProj.px, centerProj.py);
        ctx.stroke();

        // 2 High-velocity data pulses flowing toward center
        [0, 0.5].forEach((offset) => {
          const pulseT = (time * 0.85 + idx * 0.25 + offset) % 1;
          const pulseX = nodeProj.px + (centerProj.px - nodeProj.px) * pulseT;
          const pulseY = nodeProj.py + (centerProj.py - nodeProj.py) * pulseT;

          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 3 * nodeProj.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      // ── 4. RENDER CENTRAL SYNTHESIS HOLOGRAPHIC CORE ──
      const coreSize = 30 * centerProj.scale;
      // Pulsating ambient aura
      const pulseAura = Math.sin(time * 3) * 4;
      const coreGlow = ctx.createRadialGradient(
        centerProj.px,
        centerProj.py,
        2,
        centerProj.px,
        centerProj.py,
        coreSize * 2.4 + pulseAura
      );
      coreGlow.addColorStop(0, 'rgba(18, 88, 222, 0.45)');
      coreGlow.addColorStop(0.5, 'rgba(37, 99, 235, 0.15)');
      coreGlow.addColorStop(1, 'rgba(18, 88, 222, 0)');

      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(centerProj.px, centerProj.py, coreSize * 2.4 + pulseAura, 0, Math.PI * 2);
      ctx.fill();

      // Core sphere body with metallic lighting
      const coreGrad = ctx.createLinearGradient(
        centerProj.px - coreSize,
        centerProj.py - coreSize,
        centerProj.px + coreSize,
        centerProj.py + coreSize
      );
      coreGrad.addColorStop(0, '#1E40AF');
      coreGrad.addColorStop(0.4, '#1258DE');
      coreGrad.addColorStop(1, '#080F1C');

      ctx.fillStyle = coreGrad;
      ctx.shadowColor = 'rgba(18, 88, 222, 0.5)';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(centerProj.px, centerProj.py, coreSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Holographic text inside Core
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(11 * centerProj.scale)}px "DM Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CLARVO', centerProj.px, centerProj.py - 4 * centerProj.scale);
      ctx.fillStyle = '#93C5FD';
      ctx.font = `600 ${Math.round(8 * centerProj.scale)}px "DM Sans", sans-serif`;
      ctx.fillText('SYNTHESIS', centerProj.px, centerProj.py + 7 * centerProj.scale);

      // ── 5. DEPTH-SORT & RENDER 4 PHASE NODES WITH RAYCAST HIT-TESTING ──
      const projectedNodes = nodes.map((node) => ({
        ...node,
        proj: project(node),
      }));
      projectedNodes.sort((a, b) => a.proj.depth - b.proj.depth);

      let foundHover: PhaseNode | null = null;

      projectedNodes.forEach((node) => {
        const { px, py, scale } = node.proj;
        const baseRadius = 24 * scale;

        // Hit-test against pointer position
        const distToMouse = Math.hypot(px - mouseClientX, py - mouseClientY);
        const isHovered = distToMouse < baseRadius * 1.5;
        if (isHovered) {
          foundHover = node;
        }

        const nodeRadius = isHovered ? baseRadius * 1.25 : baseRadius;

        // Node Glow on Hover
        if (isHovered) {
          ctx.fillStyle = node.glowColor;
          ctx.beginPath();
          ctx.arc(px, py, nodeRadius * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node sphere body
        const sphereGrad = ctx.createRadialGradient(
          px - nodeRadius * 0.35,
          py - nodeRadius * 0.35,
          2,
          px,
          py,
          nodeRadius
        );
        sphereGrad.addColorStop(0, '#FFFFFF');
        sphereGrad.addColorStop(0.3, '#F0F5FF');
        sphereGrad.addColorStop(1, '#DBEAFE');

        ctx.fillStyle = sphereGrad;
        ctx.strokeStyle = node.color;
        ctx.lineWidth = (isHovered ? 3 : 2) * scale;
        ctx.beginPath();
        ctx.arc(px, py, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pure text badge inside node: strictly P1, P2, P3, P4 (NO icons inside badges)
        ctx.fillStyle = node.color;
        ctx.font = `bold ${Math.round((isHovered ? 14 : 12) * scale)}px "DM Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.badge, px, py);

        // Phase Title and Module Range Label
        const isUpper = py < cy;
        const labelY = isUpper ? py - nodeRadius - 10 * scale : py + nodeRadius + 14 * scale;

        ctx.fillStyle = '#080F1C';
        ctx.font = `bold ${Math.round(11 * scale)}px "DM Sans", sans-serif`;
        ctx.fillText(node.title, px, labelY);

        ctx.fillStyle = '#64748B';
        ctx.font = `500 ${Math.round(9 * scale)}px "DM Sans", sans-serif`;
        ctx.fillText(node.modules, px, labelY + (isUpper ? -11 : 11) * scale);
      });

      if (foundHover !== hoveredNodeRef.current) {
        setHoveredNode(foundHover);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (container) {
        container.removeEventListener('mousedown', handlePointerDown);
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
      }
    };
  }, [prefersReducedMotion]);

  // Reduced motion accessible fallback
  if (prefersReducedMotion) {
    return (
      <div
        className="w-full max-w-[480px] mx-auto aspect-square rounded-2xl bg-gradient-to-b from-white to-[#F0F5FF] border border-[#DDE3F0] p-6 shadow-sm flex flex-col items-center justify-between relative overflow-hidden"
        aria-label="Static visual architecture of the four psychometric assessment phases"
      >
        <div className="text-center">
          <span className="text-xs font-bold text-[#1258DE] bg-[#E8F0FF] px-3 py-1 rounded-full uppercase tracking-wider font-dmsans">
            30-Module Assessment Matrix
          </span>
          <h3 className="text-lg font-bold text-[#080F1C] mt-2 font-dmsans">
            Four Convergent Diagnostic Pillars
          </h3>
        </div>

        {/* 2D 4-Quadrant Visual */}
        <div className="grid grid-cols-2 gap-4 w-full my-auto">
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-bold text-[#1258DE] bg-[#EFF6FF] px-2 py-0.5 rounded-full inline-block mb-1">
              P1
            </span>
            <div className="font-bold text-sm text-[#080F1C]">Personality</div>
            <div className="text-xs text-[#64748B]">Modules 01–10</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full inline-block mb-1">
              P2
            </span>
            <div className="font-bold text-sm text-[#080F1C]">Cognitive</div>
            <div className="text-xs text-[#64748B]">Modules 11–20</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-bold text-[#0284C7] bg-[#F0F9FF] px-2 py-0.5 rounded-full inline-block mb-1">
              P3
            </span>
            <div className="font-bold text-sm text-[#080F1C]">Execution</div>
            <div className="text-xs text-[#64748B]">Modules 21–28</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full inline-block mb-1">
              P4
            </span>
            <div className="font-bold text-sm text-[#080F1C]">Alignment</div>
            <div className="text-xs text-[#64748B]">Modules 29–30</div>
          </div>
        </div>

        <div className="w-full text-center py-2 px-4 rounded-lg bg-[#E6EDFF]/80 text-[#1258DE] text-xs font-semibold">
          Central Engine: 50+ Page Comprehensive Family Dossier
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[560px] aspect-square mx-auto flex flex-col items-center justify-center select-none"
      aria-label="Interactive 3D Web Experience of the four psychometric assessment phases"
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating Hover Card */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 max-w-xs p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#BFDBFE] shadow-xl text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold text-white bg-[#1258DE] px-2 py-0.5 rounded-full">
              {hoveredNode.badge}
            </span>
            <span className="text-[10px] font-medium text-[#64748B]">
              {hoveredNode.modules}
            </span>
          </div>
          <div className="font-bold text-xs text-[#080F1C]">
            {hoveredNode.title}
          </div>
          <div className="text-[11px] text-[#1258DE] font-medium mt-0.5">
            Key Focus: {hoveredNode.trait}
          </div>
        </div>
      )}

      {/* 3D Control Strip */}
      <div className="absolute bottom-2 inset-x-4 flex items-center justify-between gap-2 text-[11px] text-[#64748B] pointer-events-auto">
        <span className="hidden sm:inline-block font-medium">
          Drag to rotate spatial model · Hover nodes to inspect
        </span>

        <button
          type="button"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-[#E2E8F0] hover:bg-white text-[#475569] transition-colors cursor-pointer text-xs"
        >
          {isAutoRotating ? (
            <>
              <Pause className="w-3 h-3 text-[#1258DE]" />
              <span>Pause rotation</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-[#1258DE]" />
              <span>Auto rotate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
