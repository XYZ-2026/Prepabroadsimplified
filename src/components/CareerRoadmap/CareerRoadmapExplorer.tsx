'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import '@/styles/career-roadmap.css';
import { NodeIcon } from '@/components/CareerRoadmap/RoadmapIcons';
import {
  formatNodeType,
  formatNodeTypeBadge,
  formatEdgeType,
} from '@/lib/career-roadmap-formatter';
import { StartScreen, StartOptionItem } from '@/components/CareerRoadmap/StartScreen';
import { DetailPanel, NodeDetailData } from '@/components/CareerRoadmap/DetailPanel';
import { CompareModal } from '@/components/CareerRoadmap/CompareModal';
import { SaveModal } from '@/components/CareerRoadmap/SaveModal';
import { SavedRoadmapsModal, SavedRoadmapItem } from '@/components/CareerRoadmap/SavedRoadmapsModal';
import { StartOverModal } from '@/components/CareerRoadmap/StartOverModal';

// ── Types ────────────────────────────────────────────────────
export interface GraphNodeData {
  id: string;
  type: string;
  label: string;
  status: string;
  confidence?: string;
  childCount?: number;
  isEndpoint?: boolean;
}

export interface RevealedEdgeData {
  id: string;
  source: string;
  target: string;
  edgeType: string;
  label: string;
  condition?: string;
  durationText?: string;
}

export interface PositionedNode extends GraphNodeData {
  x: number;
  y: number;
  nodeState: 'CURRENT' | 'SELECTED' | 'FRONTIER' | 'ALTERNATIVE';
  stepNumber?: number;
}

export interface PositionedEdge extends RevealedEdgeData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  midX: number;
  midY: number;
  pathData: string;
  edgeState: 'ACTIVE_PATH' | 'FRONTIER' | 'ALTERNATIVE';
}

interface SearchResult {
  id: string;
  type: string;
  typeLabel: string;
  label: string;
  canonicalName: string;
  status: string;
  confidence: string;
}

// ── Progressive Graph Layout Engine ──────────────────────────
// Constructs a non-overlapping, hierarchical layout where:
// 1. All revealed nodes stay visible (active path + alternatives + frontier).
// 2. The selected route runs left-to-right with crimson prominence.
// 3. Revealed alternatives fan out cleanly below their decision parents without overlapping.
// 4. Subtree heights are recursively allocated to mathematically prevent card collision.
export function layoutProgressiveGraph(
  nodesMap: Map<string, GraphNodeData>,
  edgesList: RevealedEdgeData[],
  startNodeId: string | null,
  selectedPath: string[],
  currentNodeId: string | null,
  containerWidth: number,
  containerHeight: number
): {
  positionedNodes: PositionedNode[];
  positionedEdges: PositionedEdge[];
  canvasWidth: number;
  canvasHeight: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  const CARD_W = 215;
  const CARD_H = 80;
  const COL_GAP_X = 85;
  const GAP_Y = 16;
  const START_X = 60;

  if (nodesMap.size === 0 || !startNodeId) {
    return {
      positionedNodes: [],
      positionedEdges: [],
      canvasWidth: containerWidth,
      canvasHeight: containerHeight,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    };
  }

  // 1. Build spanning tree rooted at startNodeId
  const primaryParentMap = new Map<string, string>();
  const childrenMap = new Map<string, string[]>();

  for (const nodeId of nodesMap.keys()) {
    childrenMap.set(nodeId, []);
  }

  // Assign parents along selectedPath first (guarantees the active backbone)
  for (let i = 0; i < selectedPath.length - 1; i++) {
    const parent = selectedPath[i];
    const child = selectedPath[i + 1];
    if (nodesMap.has(parent) && nodesMap.has(child)) {
      primaryParentMap.set(child, parent);
    }
  }

  // Assign parents for remaining revealed nodes using incoming edges from explored nodes
  for (const edge of edgesList) {
    if (nodesMap.has(edge.source) && nodesMap.has(edge.target)) {
      if (edge.target === startNodeId) continue;
      if (!primaryParentMap.has(edge.target)) {
        primaryParentMap.set(edge.target, edge.source);
      }
    }
  }

  // Populate childrenMap
  for (const [childId, parentId] of primaryParentMap.entries()) {
    const arr = childrenMap.get(parentId) || [];
    if (!arr.includes(childId)) {
      arr.push(childId);
    }
    childrenMap.set(parentId, arr);
  }

  // Stable ordering of children:
  // If a child is on selectedPath, prioritize it first so the primary route runs horizontally clean
  for (const [, children] of childrenMap.entries()) {
    children.sort((a, b) => {
      const aOnPath = selectedPath.includes(a) ? 1 : 0;
      const bOnPath = selectedPath.includes(b) ? 1 : 0;
      if (aOnPath !== bOnPath) return bOnPath - aOnPath;
      const aIsCurrent = a === currentNodeId ? 1 : 0;
      const bIsCurrent = b === currentNodeId ? 1 : 0;
      if (aIsCurrent !== bIsCurrent) return bIsCurrent - aIsCurrent;
      return 0; // preserve original order from dataset
    });
  }

  // 2. Compute depth for each node
  const depthMap = new Map<string, number>();
  depthMap.set(startNodeId, 0);

  const queue = [startNodeId];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    const currDepth = depthMap.get(curr) || 0;
    const children = childrenMap.get(curr) || [];
    for (const ch of children) {
      if (!depthMap.has(ch)) {
        depthMap.set(ch, currDepth + 1);
        queue.push(ch);
      }
    }
  }

  // Ensure any orphaned nodes have a depth
  for (const nodeId of nodesMap.keys()) {
    if (!depthMap.has(nodeId)) {
      depthMap.set(nodeId, 1);
    }
  }

  // 3. Compute subtree heights (bottom-up)
  const subtreeHeightMap = new Map<string, number>();
  function getSubtreeHeight(u: string): number {
    if (subtreeHeightMap.has(u)) return subtreeHeightMap.get(u)!;
    const children = childrenMap.get(u) || [];
    if (children.length === 0) {
      subtreeHeightMap.set(u, CARD_H);
      return CARD_H;
    }
    let total = 0;
    for (let i = 0; i < children.length; i++) {
      total += getSubtreeHeight(children[i]);
      if (i < children.length - 1) total += GAP_Y;
    }
    const h = Math.max(CARD_H, total);
    subtreeHeightMap.set(u, h);
    return h;
  }

  const rootHeight = getSubtreeHeight(startNodeId);
  const startY = Math.max(40, (containerHeight - rootHeight) / 2);

  // 4. Assign non-overlapping Coordinates
  const posMap = new Map<string, { x: number; y: number }>();

  function assignPositions(u: string, rangeTop: number, rangeBottom: number) {
    const depth = depthMap.get(u) || 0;
    const x = START_X + depth * (CARD_W + COL_GAP_X);
    const y = rangeTop + (rangeBottom - rangeTop) / 2 - CARD_H / 2;
    posMap.set(u, { x, y });

    const children = childrenMap.get(u) || [];
    if (children.length === 0) return;

    let currY = rangeTop;
    for (const ch of children) {
      const chHeight = subtreeHeightMap.get(ch) || CARD_H;
      assignPositions(ch, currY, currY + chHeight);
      currY += chHeight + GAP_Y;
    }
  }

  assignPositions(startNodeId, startY, startY + rootHeight);

  // Fallback for any disconnected nodes
  for (const nodeId of nodesMap.keys()) {
    if (!posMap.has(nodeId)) {
      const depth = depthMap.get(nodeId) || 1;
      posMap.set(nodeId, {
        x: START_X + depth * (CARD_W + COL_GAP_X),
        y: startY + posMap.size * (CARD_H + GAP_Y),
      });
    }
  }

  // 5. Build Positioned Nodes with their States
  const frontierSet = new Set<string>();
  if (currentNodeId) {
    for (const e of edgesList) {
      if (e.source === currentNodeId && e.target !== currentNodeId) {
        frontierSet.add(e.target);
      }
    }
  }

  const positionedNodes: PositionedNode[] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [id, data] of nodesMap.entries()) {
    const pos = posMap.get(id) || { x: START_X, y: startY };
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
    maxX = Math.max(maxX, pos.x + CARD_W);
    maxY = Math.max(maxY, pos.y + CARD_H);

    let nodeState: 'CURRENT' | 'SELECTED' | 'FRONTIER' | 'ALTERNATIVE' = 'ALTERNATIVE';
    let stepNumber: number | undefined;

    const pathIdx = selectedPath.indexOf(id);
    if (id === currentNodeId) {
      nodeState = 'CURRENT';
      stepNumber = pathIdx >= 0 ? pathIdx + 1 : selectedPath.length;
    } else if (pathIdx >= 0) {
      nodeState = 'SELECTED';
      stepNumber = pathIdx + 1;
    } else if (frontierSet.has(id)) {
      nodeState = 'FRONTIER';
    } else {
      nodeState = 'ALTERNATIVE';
    }

    positionedNodes.push({
      ...data,
      x: pos.x,
      y: pos.y,
      nodeState,
      stepNumber,
    });
  }

  // 6. Build Positioned Edges with Bézier Curves
  const positionedEdges: PositionedEdge[] = [];

  for (const edge of edgesList) {
    const sourcePos = posMap.get(edge.source);
    const targetPos = posMap.get(edge.target);
    if (!sourcePos || !targetPos) continue;

    const x1 = sourcePos.x + CARD_W;
    const y1 = sourcePos.y + CARD_H / 2;
    const x2 = targetPos.x;
    const y2 = targetPos.y + CARD_H / 2;

    const dx = Math.max(25, (x2 - x1) * 0.45);
    const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

    let edgeState: 'ACTIVE_PATH' | 'FRONTIER' | 'ALTERNATIVE' = 'ALTERNATIVE';
    const srcIdx = selectedPath.indexOf(edge.source);
    const tgtIdx = selectedPath.indexOf(edge.target);

    if (srcIdx >= 0 && tgtIdx === srcIdx + 1) {
      edgeState = 'ACTIVE_PATH';
    } else if (edge.source === currentNodeId) {
      edgeState = 'FRONTIER';
    } else {
      edgeState = 'ALTERNATIVE';
    }

    positionedEdges.push({
      ...edge,
      x1,
      y1,
      x2,
      y2,
      midX: (x1 + x2) / 2,
      midY: (y1 + y2) / 2,
      pathData,
      edgeState,
    });
  }

  const canvasWidth = Math.max(containerWidth, maxX + 140);
  const canvasHeight = Math.max(containerHeight, maxY + 120);

  return {
    positionedNodes,
    positionedEdges,
    canvasWidth,
    canvasHeight,
    minX: minX === Infinity ? 0 : minX,
    minY: minY === Infinity ? 0 : minY,
    maxX: maxX === -Infinity ? containerWidth : maxX,
    maxY: maxY === -Infinity ? containerHeight : maxY,
  };
}

// ── Main Component ───────────────────────────────────────────
export default function CareerRoadmapExplorer() {
  // ── Progressive Complete Exploration State ─────────────────
  const [startNodeId, setStartNodeId] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [exploredNodeIds, setExploredNodeIds] = useState<Set<string>>(new Set());

  // Revealed Graph Elements (Nodes & Edges)
  const [revealedNodesMap, setRevealedNodesMap] = useState<Map<string, GraphNodeData>>(new Map());
  const [revealedEdgesList, setRevealedEdgesList] = useState<RevealedEdgeData[]>([]);

  // Detailed view of current node (for DetailPanel)
  const [currentNodeDetail, setCurrentNodeDetail] = useState<NodeDetailData | null>(null);

  // Studio UI State
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [startOptions, setStartOptions] = useState<StartOptionItem[]>([]);

  // Canvas Viewport State
  const [zoomScale, setZoomScale] = useState(1);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  // User Profile & Roles
  const [userProfile, setUserProfile] = useState<{ role?: string; grade?: string } | null>(null);
  const [inspectorMode, setInspectorMode] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Comparison State
  const [comparedNodeIds, setComparedNodeIds] = useState<string[]>([]);
  const [comparedDetails, setComparedDetails] = useState<NodeDetailData[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);

  // Save Roadmap State
  const [saveTitle, setSaveTitle] = useState('My Career Roadmap');
  const [saveNotes, setSaveNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [currentRoadmapId, setCurrentRoadmapId] = useState<string | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmapItem[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [loadRoadmapsLoading, setLoadRoadmapsLoading] = useState(false);

  // Safe Start Over State
  const [showStartOverModal, setShowStartOverModal] = useState(false);

  // PDF Export State
  const [pdfLoading, setPdfLoading] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const isStaff = userProfile?.role === 'admin' || userProfile?.role === 'counsellor' || userProfile?.role === 'superadmin';

  // ── Load Start Options & User Profile on Mount ─────────────
  useEffect(() => {
    async function init() {
      try {
        const [graphRes, profileRes] = await Promise.all([
          fetch('/api/career-roadmap/graph?start=true').then(r => r.json()),
          fetch('/api/user/update-profile').then(r => r.json()).catch(() => null),
        ]);

        if (graphRes.startOptions) {
          setStartOptions(graphRes.startOptions);
        }
        if (profileRes?.user) {
          setUserProfile(profileRes.user);
        }

        // Check for URL path parameter (e.g. ?path=LEVEL_001,STREAM_001)
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const pathParam = params.get('path');
          if (pathParam) {
            const nodeIds = pathParam.split(',').filter(Boolean);
            if (nodeIds.length > 0) {
              restorePathFromIds(nodeIds);
              return;
            }
          }
        }
      } catch (err) {
        console.error('Failed to initialize Career Roadmap Studio:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // ── Restore Path from Node IDs ──────────────────────────────
  // Used on initial URL load or when loading a saved roadmap.
  // Reconstructs all explored nodes and their direct children.
  const restorePathFromIds = async (nodeIds: string[]) => {
    setLoading(true);
    setShowStartScreen(false);
    try {
      const newNodesMap = new Map<string, GraphNodeData>();
      const newEdgesList: RevealedEdgeData[] = [];
      const newExploredSet = new Set<string>();

      let lastDetail: NodeDetailData | null = null;

      for (let i = 0; i < nodeIds.length; i++) {
        const id = nodeIds[i];
        const res = await fetch(`/api/career-roadmap/node?id=${id}`);
        const data = await res.json();
        lastDetail = data;

        newExploredSet.add(id);

        // Add parent node
        newNodesMap.set(id, {
          id,
          label: data.node.displayName || data.node.canonicalName || id,
          type: data.node.type || 'ROUTE',
          status: data.node.status || 'ACTIVE',
          childCount: data.continuation?.frontier?.length ?? data.connections.outgoing.length,
          isEndpoint: data.continuation ? data.continuation.isTerminal : (data.connections.outgoing.length === 0),
        });

        // Add direct active children (frontier of each explored node)
        for (const outEdge of data.connections.outgoing) {
          if (!newNodesMap.has(outEdge.toNodeId)) {
            newNodesMap.set(outEdge.toNodeId, {
              id: outEdge.toNodeId,
              label: outEdge.toName,
              type: outEdge.toType,
              status: 'ACTIVE',
            });
          }
          if (!newEdgesList.some(e => e.source === id && e.target === outEdge.toNodeId)) {
            newEdgesList.push({
              id: outEdge.id,
              source: id,
              target: outEdge.toNodeId,
              edgeType: outEdge.edgeType,
              label: formatEdgeType(outEdge.edgeType),
              condition: outEdge.condition,
              durationText: outEdge.durationText,
            });
          }
        }

        // If this is the current (active) leaf node, also reveal its semantic continuation frontier
        if (i === nodeIds.length - 1 && data.continuation?.frontier) {
          for (const opt of data.continuation.frontier) {
            if (!newNodesMap.has(opt.id)) {
              newNodesMap.set(opt.id, {
                id: opt.id,
                label: opt.label,
                type: opt.nodeType,
                status: opt.status || 'ACTIVE',
              });
            }
            if (!newEdgesList.some(e => e.source === id && e.target === opt.id)) {
              newEdgesList.push({
                id: `CONT_${id}_${opt.id}`,
                source: id,
                target: opt.id,
                edgeType: opt.relationType,
                label: opt.relationType.replace(/_/g, ' '),
                condition: opt.phase,
              });
            }
          }
        }
      }

      setStartNodeId(nodeIds[0]);
      setSelectedPath(nodeIds);
      setCurrentNodeId(nodeIds[nodeIds.length - 1]);
      setExploredNodeIds(newExploredSet);
      setRevealedNodesMap(newNodesMap);
      setRevealedEdgesList(newEdgesList);
      setCurrentNodeDetail(lastDetail);
    } catch (err) {
      console.error('Failed to restore path:', err);
      setShowStartScreen(true);
    } finally {
      setLoading(false);
    }
  };

  // ── Sync URL Query State ───────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (selectedPath.length > 0) {
          url.searchParams.set('path', selectedPath.join(','));
        } else {
          url.searchParams.delete('path');
        }
        window.history.replaceState({}, '', url.toString());
      } catch {}
    }
  }, [selectedPath]);

  // ── Start Roadmap from Start Screen ────────────────────────
  // When user selects e.g. 10th:
  // Reveals 10th PLUS only 10th's immediate active children.
  // Grandchildren (e.g. PCM, PCB, B.Tech) are NOT rendered.
  const handleStartRoadmap = useCallback(async (startId: string, label?: string, type?: string) => {
    setLoading(true);
    setShowStartScreen(false);
    setIsDirty(true);
    setIsSaved(false);

    try {
      const res = await fetch(`/api/career-roadmap/node?id=${startId}`);
      const data = await res.json();

      const nodeLabel = label || data.node.displayName || data.node.canonicalName || startId;
      const nodeType = type || data.node.type || 'LEVEL';

      const initialNodes = new Map<string, GraphNodeData>();
      const initialEdges: RevealedEdgeData[] = [];

      // 1. Add Start Node
      initialNodes.set(startId, {
        id: startId,
        label: nodeLabel,
        type: nodeType,
        status: data.node.status || 'ACTIVE',
        childCount: data.continuation?.frontier?.length ?? data.connections.outgoing.length,
        isEndpoint: data.continuation ? data.continuation.isTerminal : (data.connections.outgoing.length === 0),
      });

      // 2. Add Start Node's Immediate Active Children or Frontier
      const startFrontier = (data.continuation?.frontier && data.continuation.frontier.length > 0)
        ? data.continuation.frontier
        : data.connections.outgoing.map((edge: any) => ({
            id: edge.toNodeId,
            label: edge.toName,
            nodeType: edge.toType,
            relationType: edge.edgeType,
            phase: 'ACADEMIC',
            source: 'Direct Edge',
            status: 'ACTIVE',
            confidence: 'HIGH',
            selectable: true,
          }));

      for (const opt of startFrontier) {
        initialNodes.set(opt.id, {
          id: opt.id,
          label: opt.label,
          type: opt.nodeType,
          status: opt.status || 'ACTIVE',
        });
        initialEdges.push({
          id: `EDGE_${startId}_${opt.id}`,
          source: startId,
          target: opt.id,
          edgeType: opt.relationType,
          label: opt.relationType.replace(/_/g, ' '),
          condition: opt.phase,
        });
      }

      setStartNodeId(startId);
      setSelectedPath([startId]);
      setCurrentNodeId(startId);
      setExploredNodeIds(new Set([startId]));
      setRevealedNodesMap(initialNodes);
      setRevealedEdgesList(initialEdges);
      setCurrentNodeDetail(data);
    } catch (err) {
      console.error('Failed to start roadmap:', err);
      showToast('Error starting roadmap');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ── Central Node Card Click Handler ────────────────────────
  // Implements the Progressive Complete Exploration Model:
  // - Keeps ALL previously revealed nodes and alternatives visible.
  // - Adds the selected node to the active path.
  // - Reveals ONLY the selected node's immediate active children.
  // - Does NOT recursively expand grandchildren.
  // - Switches branches cleanly if an earlier alternative is clicked.
  const handleNodeCardClick = useCallback(async (nodeId: string, nodeLabel?: string, nodeType?: string) => {
    // If clicking current node, just refresh or maintain focus
    if (nodeId === currentNodeId) return;

    setDetailLoading(true);
    setIsDirty(true);
    setIsSaved(false);

    try {
      const res = await fetch(`/api/career-roadmap/node?id=${nodeId}`);
      const data = await res.json();

      // Case 1: Node is already in the selectedPath (user inspecting an earlier step)
      if (selectedPath.includes(nodeId)) {
        setCurrentNodeId(nodeId);
        setCurrentNodeDetail(data);
        return;
      }

      // Case 2: Node is a direct child of the current node (Frontier Node)
      const isDirectFrontier = revealedEdgesList.some(
        e => e.source === currentNodeId && e.target === nodeId
      );

      let newPath: string[];
      if (isDirectFrontier) {
        newPath = [...selectedPath, nodeId];
      } else {
        // Case 3: Node is an earlier alternative branch!
        // We find the path from startNodeId to nodeId via revealed edges.
        const parentEdge = revealedEdgesList.find(e => e.target === nodeId);
        const parentId = parentEdge ? parentEdge.source : startNodeId;

        const parentIdx = parentId ? selectedPath.indexOf(parentId) : -1;
        if (parentIdx >= 0) {
          newPath = [...selectedPath.slice(0, parentIdx + 1), nodeId];
        } else {
          newPath = [startNodeId || nodeId, nodeId];
        }
      }

      // Update explored set: add newly explored nodeId
      setExploredNodeIds(prev => new Set([...prev, nodeId]));

      // Update revealed nodes & edges:
      // KEEP ALL EXISTING NODES & EDGES (Never delete previous alternatives!)
      setRevealedNodesMap(prevMap => {
        const nextMap = new Map(prevMap);

        // Update selected node with full details
        nextMap.set(nodeId, {
          id: nodeId,
          label: nodeLabel || data.node.displayName || data.node.canonicalName || nodeId,
          type: nodeType || data.node.type || 'ROUTE',
          status: data.node.status || 'ACTIVE',
          childCount: data.continuation?.frontier?.length ?? data.connections.outgoing.length,
          isEndpoint: data.continuation ? data.continuation.isTerminal : (data.connections.outgoing.length === 0),
        });

        // Reveal direct active children or semantic continuation frontier
        const frontierOptions = (data.continuation?.frontier && data.continuation.frontier.length > 0)
          ? data.continuation.frontier
          : data.connections.outgoing.map((outEdge: any) => ({
              id: outEdge.toNodeId,
              label: outEdge.toName,
              nodeType: outEdge.toType,
              relationType: outEdge.edgeType,
              phase: 'ACADEMIC',
              source: 'Direct Edge',
              status: 'ACTIVE',
              confidence: 'HIGH',
              selectable: true,
            }));

        for (const opt of frontierOptions) {
          if (!nextMap.has(opt.id)) {
            nextMap.set(opt.id, {
              id: opt.id,
              label: opt.label,
              type: opt.nodeType,
              status: opt.status || 'ACTIVE',
            });
          }
        }
        return nextMap;
      });

      setRevealedEdgesList(prevEdges => {
        const nextEdges = [...prevEdges];
        // Add direct outgoing edges
        for (const outEdge of data.connections.outgoing) {
          if (!nextEdges.some(e => e.source === nodeId && e.target === outEdge.toNodeId)) {
            nextEdges.push({
              id: outEdge.id,
              source: nodeId,
              target: outEdge.toNodeId,
              edgeType: outEdge.edgeType,
              label: formatEdgeType(outEdge.edgeType),
              condition: outEdge.condition,
              durationText: outEdge.durationText,
            });
          }
        }
        // If continuation has frontier items not covered by direct edges (e.g. for specialisations, or study abroad on degrees)
        if (data.continuation?.frontier) {
          for (const opt of data.continuation.frontier) {
            if (!nextEdges.some(e => e.source === nodeId && e.target === opt.id)) {
              nextEdges.push({
                id: `CONT_${nodeId}_${opt.id}`,
                source: nodeId,
                target: opt.id,
                edgeType: opt.relationType,
                label: opt.relationType.replace(/_/g, ' '),
                condition: opt.phase,
              });
            }
          }
        }
        return nextEdges;
      });

      setSelectedPath(newPath);
      setCurrentNodeId(nodeId);
      setCurrentNodeDetail(data);
    } catch (err) {
      console.error('Failed to expand roadmap node:', err);
      showToast('Error exploring option');
    } finally {
      setDetailLoading(false);
    }
  }, [currentNodeId, revealedEdgesList, selectedPath, startNodeId, showToast]);

  // ── Search Handlers ────────────────────────────────────────
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/career-roadmap/search?q=${encodeURIComponent(query)}&limit=12`);
        const data = await res.json();
        setSearchResults(data.results || []);
        setSearchOpen(true);
      } catch (err) {
        console.error('Search failed:', err);
      }
    }, 220);
  }, []);

  const handleSelectSearchResult = useCallback(async (result: SearchResult) => {
    setSearchQuery('');
    setSearchOpen(false);

    // If node is already visible in the graph, select and focus it
    if (revealedNodesMap.has(result.id)) {
      handleNodeCardClick(result.id, result.label, result.type);
      return;
    }

    // Otherwise start fresh exploration from searched node
    handleStartRoadmap(result.id, result.label, result.type);
    showToast(`Started roadmap exploration from ${result.label}`);
  }, [handleNodeCardClick, handleStartRoadmap, revealedNodesMap, showToast]);

  // ── Compare Handlers ───────────────────────────────────────
  const handleToggleCompare = useCallback((nodeId: string) => {
    setComparedNodeIds(prev => {
      if (prev.includes(nodeId)) {
        return prev.filter(id => id !== nodeId);
      }
      if (prev.length >= 3) {
        showToast('You can compare a maximum of 3 pathways side-by-side');
        return prev;
      }
      return [...prev, nodeId];
    });
  }, [showToast]);

  const openCompareModal = useCallback(async () => {
    if (comparedNodeIds.length === 0) return;
    setCompareLoading(true);
    setShowCompareModal(true);
    try {
      const details = await Promise.all(
        comparedNodeIds.map(async id => {
          const res = await fetch(`/api/career-roadmap/node?id=${id}`);
          return await res.json();
        })
      );
      setComparedDetails(details);
    } catch (err) {
      console.error('Failed to load compare details:', err);
      showToast('Error loading comparison details');
    } finally {
      setCompareLoading(false);
    }
  }, [comparedNodeIds, showToast]);

  // ── Save Roadmap Handlers ──────────────────────────────────
  const handleConfirmSave = useCallback(async () => {
    if (selectedPath.length === 0) {
      showToast('Please explore at least one stage before saving');
      return;
    }
    setSaving(true);
    try {
      const startId = startNodeId || selectedPath[0];
      const res = await fetch('/api/career-roadmap/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmapId: currentRoadmapId || undefined,
          title: saveTitle.trim() || 'My Career Roadmap',
          startNodeId: startId,
          selectedPathNodeIds: selectedPath,
          notes: saveNotes,
          version: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save roadmap');
      }

      setCurrentRoadmapId(data.roadmapId);
      setIsSaved(true);
      setIsDirty(false);
      setShowSaveModal(false);
      showToast('Roadmap exploration saved successfully!');
    } catch (err: any) {
      console.error('Save failed:', err);
      showToast(err.message || 'Error saving roadmap');
    } finally {
      setSaving(false);
    }
  }, [selectedPath, startNodeId, currentRoadmapId, saveTitle, saveNotes, showToast]);

  // ── Load Saved Roadmaps ────────────────────────────────────
  const openLoadRoadmapsModal = useCallback(async () => {
    setShowLoadModal(true);
    setLoadRoadmapsLoading(true);
    try {
      const res = await fetch('/api/career-roadmap/save');
      const data = await res.json();
      if (data.roadmaps) {
        setSavedRoadmaps(data.roadmaps);
      }
    } catch (err) {
      console.error('Failed to load saved roadmaps:', err);
    } finally {
      setLoadRoadmapsLoading(false);
    }
  }, []);

  const handleSelectSavedRoadmap = useCallback(async (item: SavedRoadmapItem) => {
    if (!item.selectedPathNodeIds || item.selectedPathNodeIds.length === 0) return;
    setShowLoadModal(false);
    setCurrentRoadmapId(item.roadmapId);
    setSaveTitle(item.title);
    setSaveNotes(item.notes || '');
    setIsSaved(true);
    setIsDirty(false);

    await restorePathFromIds(item.selectedPathNodeIds);
    showToast(`Loaded "${item.title}"`);
  }, [showToast]);

  const handleDeleteSavedRoadmap = useCallback(async (roadmapId: string) => {
    if (!confirm('Are you sure you want to delete this saved roadmap?')) return;
    try {
      const res = await fetch(`/api/career-roadmap/save?id=${roadmapId}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedRoadmaps(prev => prev.filter(r => r.roadmapId !== roadmapId));
        if (currentRoadmapId === roadmapId) {
          setCurrentRoadmapId(null);
        }
        showToast('Roadmap deleted');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete roadmap');
    }
  }, [currentRoadmapId, showToast]);

  // ── PDF Export Handler ─────────────────────────────────────
  // Exports the primary selected path (not the entire database)
  const handleDownloadPDF = useCallback(async () => {
    if (selectedPath.length === 0) {
      showToast('Please explore at least one pathway stage before downloading');
      return;
    }
    setPdfLoading(true);
    try {
      const res = await fetch('/api/career-roadmap/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: saveTitle || 'My Career Roadmap',
          selectedPathNodeIds: selectedPath,
          notes: saveNotes,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate roadmap PDF');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(saveTitle || 'Career_Roadmap').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('Roadmap PDF downloaded successfully!');
    } catch (err: any) {
      console.error('PDF error:', err);
      showToast(err.message || 'Error generating PDF');
    } finally {
      setPdfLoading(false);
    }
  }, [selectedPath, saveTitle, saveNotes, showToast]);

  // ── Safe Start Over ────────────────────────────────────────
  const handleConfirmStartOver = useCallback(() => {
    setShowStartOverModal(false);
    setShowStartScreen(true);
    setStartNodeId(null);
    setSelectedPath([]);
    setCurrentNodeId(null);
    setExploredNodeIds(new Set());
    setRevealedNodesMap(new Map());
    setRevealedEdgesList([]);
    setCurrentNodeDetail(null);
    setIsDirty(false);
    setIsSaved(false);
    setCurrentRoadmapId(null);
    setZoomScale(1);
    showToast('Returned to Start Screen');
  }, [showToast]);

  // ── Viewport Controls ──────────────────────────────────────
  const handleZoomIn = () => setZoomScale(s => Math.min(1.6, Number((s + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoomScale(s => Math.max(0.6, Number((s - 0.15).toFixed(2))));
  const handleResetZoom = () => setZoomScale(1);

  // ── Compute Progressive Hierarchical Graph Layout ──────────
  const containerW = canvasContainerRef.current?.clientWidth || 900;
  const containerH = canvasContainerRef.current?.clientHeight || 600;

  const { positionedNodes, positionedEdges, canvasWidth, canvasHeight, minX, minY, maxX, maxY } = useMemo(() => {
    return layoutProgressiveGraph(
      revealedNodesMap,
      revealedEdgesList,
      startNodeId,
      selectedPath,
      currentNodeId,
      containerW,
      containerH
    );
  }, [revealedNodesMap, revealedEdgesList, startNodeId, selectedPath, currentNodeId, containerW, containerH]);

  // Focus on Current Node
  const handleFocusCurrent = useCallback(() => {
    if (!canvasContainerRef.current || !currentNodeId) return;
    const curr = positionedNodes.find(n => n.id === currentNodeId);
    if (curr) {
      const containerW = canvasContainerRef.current.clientWidth;
      const containerH = canvasContainerRef.current.clientHeight;
      canvasContainerRef.current.scrollTo({
        left: Math.max(0, curr.x * zoomScale - containerW / 3),
        top: Math.max(0, curr.y * zoomScale - containerH / 3),
        behavior: 'smooth',
      });
    }
  }, [currentNodeId, positionedNodes, zoomScale]);

  // Fit Entire Explored Graph without making text microscopic (scale >= 0.65)
  const handleFitExplored = useCallback(() => {
    if (!canvasContainerRef.current || positionedNodes.length === 0) return;
    const containerW = canvasContainerRef.current.clientWidth;
    const containerH = canvasContainerRef.current.clientHeight;

    const graphW = Math.max(200, maxX - minX + 215);
    const graphH = Math.max(100, maxY - minY + 80);

    const scaleX = (containerW - 80) / graphW;
    const scaleY = (containerH - 80) / graphH;
    const fitScale = Math.min(1.0, Math.min(scaleX, scaleY));
    const finalScale = Math.max(0.65, Number(fitScale.toFixed(2)));

    setZoomScale(finalScale);
    canvasContainerRef.current.scrollTo({
      left: Math.max(0, minX * finalScale - 40),
      top: Math.max(0, minY * finalScale - 40),
      behavior: 'smooth',
    });
  }, [minX, minY, maxX, maxY, positionedNodes.length]);

  // Auto-scroll to Current Node on Step Transition
  useEffect(() => {
    if (canvasContainerRef.current && currentNodeId && positionedNodes.length > 0) {
      const curr = positionedNodes.find(n => n.id === currentNodeId);
      if (curr) {
        const containerW = canvasContainerRef.current.clientWidth;
        const targetScrollLeft = curr.x * zoomScale - containerW / 2 + 100;
        if (targetScrollLeft > canvasContainerRef.current.scrollLeft + containerW * 0.4 || targetScrollLeft < canvasContainerRef.current.scrollLeft) {
          canvasContainerRef.current.scrollTo({
            left: Math.max(0, targetScrollLeft),
            behavior: 'smooth',
          });
        }
      }
    }
  }, [currentNodeId, positionedNodes, zoomScale]);

  const currentStepNumber = useMemo(() => {
    const idx = selectedPath.indexOf(currentNodeId || '');
    return idx >= 0 ? idx + 1 : selectedPath.length;
  }, [selectedPath, currentNodeId]);

  return (
    <div className="roadmapStudio">
      {/* ── Studio Toolbar Header ── */}
      <header className="studioHeader">
        <div className="studioTitleGroup">
          <h1 className="studioMainTitle">
            Career Roadmap Studio
          </h1>
          <p className="studioSubtitle">Progressive Career Exploration Graph</p>
        </div>

        <div className="studioControls">
          {/* Search Box */}
          <div className="searchContainer">
            <span className="searchIcon">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              className="searchInput"
              type="text"
              placeholder="Search careers, degrees, streams, colleges, exams..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 220)}
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="searchResults">
                {searchResults.map(res => (
                  <div
                    key={res.id}
                    className="searchResultItem"
                    onMouseDown={() => handleSelectSearchResult(res)}
                  >
                    <div className="searchResultIcon">
                      <NodeIcon type={res.type} size={15} />
                    </div>
                    <div className="searchResultText">
                      <div className="searchResultName">{res.label}</div>
                      <div className="searchResultType">{res.typeLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Roadmaps */}
          <button
            className="btnStudioSecondary"
            onClick={openLoadRoadmapsModal}
            title="View saved roadmap plans"
          >
            Saved Roadmaps
          </button>

          {/* Primary Action: Save Roadmap */}
          {!showStartScreen && (
            <button
              className="btnStudioPrimary"
              onClick={() => setShowSaveModal(true)}
              title="Save current exploration path"
            >
              Save Roadmap
            </button>
          )}

          {/* Secondary Action: Download PDF */}
          {!showStartScreen && (
            <button
              className="btnStudioSecondary"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              title="Download roadmap PDF"
            >
              {pdfLoading ? 'Generating...' : 'Download PDF'}
            </button>
          )}

          {/* Admin / Counsellor Data Inspector Toggle */}
          {isStaff && (
            <button
              className={`btnStudioTertiary ${inspectorMode ? 'btnStudioPrimary' : ''}`}
              onClick={() => setInspectorMode(!inspectorMode)}
              title="Toggle Verification & Data Inspection View"
              style={{ fontSize: '12px' }}
            >
              Inspector
            </button>
          )}

          {/* Safe Start Over */}
          {!showStartScreen && (
            <button
              className="btnStudioTertiary"
              onClick={() => setShowStartOverModal(true)}
              title="Return to start screen"
            >
              Start Over
            </button>
          )}

          {/* Save Status Badge */}
          {!showStartScreen && (
            <div className="saveStateBadge">
              <span className={`saveStateDot ${isDirty ? 'saveStateDotUnsaved' : ''}`} />
              <span>{isSaved ? 'Saved' : isDirty ? 'Unsaved changes' : 'Ready'}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Sticky Breadcrumb / Stepper ── */}
      {selectedPath.length > 0 && !showStartScreen && (
        <nav className="breadcrumbBar" aria-label="Roadmap Path Navigation">
          <button
            className="breadcrumbItem"
            onClick={() => setShowStartOverModal(true)}
          >
            Start
          </button>
          {selectedPath.map((id, idx) => {
            const node = revealedNodesMap.get(id);
            const isCurrent = id === currentNodeId;
            return (
              <React.Fragment key={id}>
                <span className="breadcrumbSep">›</span>
                <button
                  className={`breadcrumbItem ${isCurrent ? 'breadcrumbItemActive' : ''}`}
                  onClick={() => handleNodeCardClick(id)}
                >
                  <NodeIcon type={node?.type || 'ROUTE'} size={14} />
                  <span>{node?.label || id}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* ── Main Studio Body ── */}
      <div className="studioBody">
        {/* Graph Canvas or Start Screen */}
        <main className="graphCanvas" ref={canvasContainerRef}>
          {showStartScreen ? (
            <StartScreen
              startOptions={startOptions}
              userGrade={userProfile?.grade}
              onSelectNode={handleStartRoadmap}
            />
          ) : loading ? (
            <div className="loadingState">
              <div className="loadingSpinner" />
              <span className="loadingText">Constructing career exploration graph...</span>
            </div>
          ) : (
            <div
              className="graphViewport"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top left',
                transition: 'transform 0.15s ease-out',
              }}
            >
              {/* Subtle Graph Legend */}
              <div className="graphLegendGroup">
                <span className="legendPill">
                  <span className="legendDotSelected" />
                  <span>Selected path</span>
                </span>
                <span className="legendPill">
                  <span className="legendDotAlternative" />
                  <span>Explored alternative</span>
                </span>
                <span className="legendPill">
                  <span className="legendDotFrontier" />
                  <span>Next option</span>
                </span>
              </div>

              {/* SVG Connector Bézier Curves */}
              <svg
                className="edgeSvg"
                style={{ width: canvasWidth, height: canvasHeight }}
              >
                <defs>
                  <marker
                    id="arrowheadDefault"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#CBD5E1" />
                  </marker>
                  <marker
                    id="arrowheadActive"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#690B1B" />
                  </marker>
                  <marker
                    id="arrowheadFrontier"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6.5"
                    markerHeight="6.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3B82F6" />
                  </marker>
                </defs>

                {positionedEdges.map(edge => {
                  const isHovered = hoveredEdgeId === edge.id;
                  const isActive = edge.edgeState === 'ACTIVE_PATH';
                  const isFrontier = edge.edgeState === 'FRONTIER';

                  const markerId = isActive
                    ? 'url(#arrowheadActive)'
                    : isFrontier
                    ? 'url(#arrowheadFrontier)'
                    : 'url(#arrowheadDefault)';

                  const edgeClass = isActive
                    ? 'edgePath edgePathActive'
                    : isFrontier
                    ? 'edgePath edgePathFrontier'
                    : isHovered
                    ? 'edgePath edgePathHovered'
                    : 'edgePath';

                  return (
                    <g
                      key={edge.id}
                      onMouseEnter={() => setHoveredEdgeId(edge.id)}
                      onMouseLeave={() => setHoveredEdgeId(null)}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <path
                        d={edge.pathData}
                        className={edgeClass}
                        markerEnd={markerId}
                      />
                      {/* Relationship Pill Label on Active or Hovered Edge */}
                      {(isActive || isHovered) && (
                        <g transform={`translate(${edge.midX}, ${edge.midY})`}>
                          <rect
                            x={-(edge.label.length * 3.5 + 8)}
                            y={-10}
                            width={edge.label.length * 7 + 16}
                            height={20}
                            className="edgeLabelPill"
                          />
                          <text y={1} className="edgeLabelText">
                            {edge.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Progressive Graph Node Cards */}
              {positionedNodes.map(node => {
                const cardClass =
                  node.nodeState === 'CURRENT'
                    ? 'nodeCard nodeCardCurrent'
                    : node.nodeState === 'SELECTED'
                    ? 'nodeCard nodeCardSelected'
                    : node.nodeState === 'FRONTIER'
                    ? 'nodeCard nodeCardFrontier'
                    : 'nodeCard nodeCardAlternative';

                const stepTagClass =
                  node.nodeState === 'CURRENT'
                    ? 'nodeCardStepTag nodeCardStepTagCurrent'
                    : node.nodeState === 'FRONTIER'
                    ? 'nodeCardStepTag nodeCardStepTagFrontier'
                    : 'nodeCardStepTag';

                const tagText =
                  node.nodeState === 'CURRENT'
                    ? `Focus · Step ${node.stepNumber || 1}`
                    : node.nodeState === 'SELECTED'
                    ? `Step ${node.stepNumber || 1}`
                    : node.nodeState === 'FRONTIER'
                    ? '+ Next'
                    : 'Alternative';

                return (
                  <div
                    key={node.id}
                    className={cardClass}
                    style={{
                      left: node.x,
                      top: node.y,
                    }}
                    onClick={() => handleNodeCardClick(node.id, node.label, node.type)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${node.label} (${formatNodeType(node.type)}) - ${tagText}`}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNodeCardClick(node.id, node.label, node.type);
                      }
                    }}
                  >
                    <div className="nodeCardHeader">
                      <div className="nodeCardTypeBadge">
                        <NodeIcon type={node.type} size={13} />
                        <span>{formatNodeTypeBadge(node.type)}</span>
                      </div>
                      <span className={stepTagClass}>
                        {tagText}
                      </span>
                    </div>

                    <div className="nodeCardTitle" title={node.label}>
                      {node.label}
                    </div>

                    <div className="nodeCardFooter">
                      {node.nodeState === 'CURRENT' ? (
                        <span style={{ fontSize: '11px', color: 'var(--roadmap-primary)', fontWeight: 700 }}>
                          {(node.childCount || 0) > 0 ? `${node.childCount} next options` : 'Destination'}
                        </span>
                      ) : node.nodeState === 'FRONTIER' ? (
                        <span style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 600 }}>
                          Click to explore →
                        </span>
                      ) : node.nodeState === 'SELECTED' ? (
                        <span style={{ fontSize: '10.5px', color: 'var(--roadmap-slate-500)' }}>
                          Active path step
                        </span>
                      ) : (
                        <span style={{ fontSize: '10.5px', color: 'var(--roadmap-slate-400)' }}>
                          Click to branch here
                        </span>
                      )}

                      <button
                        className={`nodeCardCompareBtn ${comparedNodeIds.includes(node.id) ? 'nodeCardCompareBtnActive' : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleCompare(node.id);
                        }}
                        title="Add to side-by-side comparison"
                      >
                        {comparedNodeIds.includes(node.id) ? '✓ Added' : '+ Compare'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating Graph Viewport Controls */}
          {!showStartScreen && (
            <div className="graphControlsGroup">
              <button
                className="graphControlBtn"
                onClick={handleFocusCurrent}
                title="Focus on Current Node"
                style={{ width: 'auto', padding: '0 8px', gap: '4px', fontSize: '11px', fontWeight: 600 }}
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
                Focus Current
              </button>
              <button
                className="graphControlBtn"
                onClick={handleFitExplored}
                title="Fit Explored Graph"
                style={{ width: 'auto', padding: '0 8px', gap: '4px', fontSize: '11px', fontWeight: 600 }}
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                Fit Graph
              </button>
              <button className="graphControlBtn" onClick={handleZoomIn} title="Zoom In">
                +
              </button>
              <button className="graphControlBtn" onClick={handleZoomOut} title="Zoom Out">
                −
              </button>
              <button className="graphControlBtn" onClick={handleResetZoom} title="Reset Zoom (100%)">
                ↺
              </button>
            </div>
          )}

          {/* Floating Comparison Dock */}
          {comparedNodeIds.length > 0 && (
            <div className="compareDock">
              <div className="comparePills">
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--roadmap-slate-800)' }}>
                  Compare ({comparedNodeIds.length}/3):
                </span>
                {comparedNodeIds.map(id => {
                  const node = revealedNodesMap.get(id);
                  return (
                    <span key={id} className="comparePill">
                      {node?.label || id}
                      <span className="comparePillRemove" onClick={() => handleToggleCompare(id)}>✕</span>
                    </span>
                  );
                })}
              </div>
              <button
                className="compareActionBtn"
                onClick={openCompareModal}
                disabled={comparedNodeIds.length < 2}
              >
                Compare Side-by-Side
              </button>
              <button
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}
                onClick={() => setComparedNodeIds([])}
              >
                Clear
              </button>
            </div>
          )}
        </main>

        {/* ── Right Detail Panel (Information Surface) ── */}
        <aside className={`detailPanel ${!currentNodeDetail && !detailLoading ? 'detailPanelHidden' : ''}`}>
          {detailLoading ? (
            <div className="detailLoading" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div className="loadingSpinner" style={{ margin: '0 auto 12px auto' }} />
              <span style={{ fontSize: '13px', color: 'var(--roadmap-slate-500)' }}>Updating step information...</span>
            </div>
          ) : currentNodeDetail ? (
            <DetailPanel
              detail={currentNodeDetail}
              stepNumber={currentStepNumber}
              totalSteps={selectedPath.length}
              inspectorMode={inspectorMode}
              isCompared={comparedNodeIds.includes(currentNodeDetail.node.id)}
              onToggleCompare={() => handleToggleCompare(currentNodeDetail.node.id)}
              onClose={() => {}}
              onSelectFrontierNode={(id, label, type) => handleNodeCardClick(id, label, type)}
              onSaveRoadmap={() => setShowSaveModal(true)}
              onDownloadPDF={handleDownloadPDF}
              onStartOver={() => setShowStartOverModal(true)}
            />
          ) : null}
        </aside>
      </div>

      {/* ── Bottom Path Summary Bar ── */}
      <footer className="pathSummaryBar">
        <div className="pathSummarySteps">
          <span className="pathSummaryLabel">YOUR PATH:</span>
          {selectedPath.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
              {selectedPath.map((id, i) => {
                const node = revealedNodesMap.get(id);
                const isCurrent = id === currentNodeId;
                return (
                  <React.Fragment key={id}>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        fontSize: '12.5px',
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? 'var(--roadmap-primary)' : 'var(--roadmap-slate-800)',
                        textDecoration: isCurrent ? 'underline' : 'none',
                      }}
                      onClick={() => handleNodeCardClick(id)}
                      title={`Click to focus Step ${i + 1}`}
                    >
                      {node?.label || id}
                    </button>
                    {i < selectedPath.length - 1 && (
                      <span style={{ color: 'var(--roadmap-slate-400)', fontSize: '11px' }}>→</span>
                    )}
                  </React.Fragment>
                );
              })}
              <span style={{ fontSize: '11px', color: 'var(--roadmap-slate-400)', marginLeft: '6px' }}>
                (Step {currentStepNumber} of {selectedPath.length})
              </span>
            </div>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--roadmap-slate-500)' }}>
              Choose a starting stage above to begin mapping your career
            </span>
          )}
        </div>

        <div className="pathSummaryActions">
          {inspectorMode && (
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--roadmap-slate-500)' }}>
              {revealedNodesMap.size} visible nodes · {revealedEdgesList.length} edges · Master Production
            </span>
          )}
          {!inspectorMode && (
            <span style={{ fontSize: '11px', color: 'var(--roadmap-slate-500)' }}>
              Source: Career Handbook · Exact mappings verified
            </span>
          )}
        </div>
      </footer>

      {/* ── Modals ── */}
      {showSaveModal && (
        <SaveModal
          title={saveTitle}
          notes={saveNotes}
          breadcrumbs={selectedPath.map(id => {
            const n = revealedNodesMap.get(id);
            return { id, label: n?.label || id, type: n?.type || 'ROUTE' };
          })}
          saving={saving}
          onTitleChange={setSaveTitle}
          onNotesChange={setSaveNotes}
          onConfirm={handleConfirmSave}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {showLoadModal && (
        <SavedRoadmapsModal
          roadmaps={savedRoadmaps}
          loading={loadRoadmapsLoading}
          onSelectRoadmap={handleSelectSavedRoadmap}
          onDeleteRoadmap={handleDeleteSavedRoadmap}
          onDownloadPDF={() => {
            setShowLoadModal(false);
            handleDownloadPDF();
          }}
          onClose={() => setShowLoadModal(false)}
        />
      )}

      {showCompareModal && (
        <CompareModal
          details={comparedDetails}
          loading={compareLoading}
          onClose={() => setShowCompareModal(false)}
          onRemoveItem={handleToggleCompare}
        />
      )}

      {showStartOverModal && (
        <StartOverModal
          onConfirm={handleConfirmStartOver}
          onClose={() => setShowStartOverModal(false)}
        />
      )}

      {/* ── Toast Feedback ── */}
      {toastMessage && (
        <div className="roadmapToast">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
