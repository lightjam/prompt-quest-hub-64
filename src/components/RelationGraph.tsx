import { useState, useRef, useEffect, useCallback } from "react";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface GraphNode {
  id: string;
  label: string;
  type: "primary" | "secondary";
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

interface RelationGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  className?: string;
}

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function RelationGraph({ nodes, edges, className }: RelationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [positions, setPositions] = useState<Record<string, NodePosition>>({});
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
  const animRef = useRef<number>();
  const posRef = useRef<Record<string, NodePosition>>({});

  // Measure container
  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDimensions({ width: Math.max(400, width), height: 450 });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Initialize positions in a radial layout
  useEffect(() => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const primaryNode = nodes.find((n) => n.type === "primary");
    const secondaryNodes = nodes.filter((n) => n.type === "secondary");
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;

    const initial: Record<string, NodePosition> = {};
    if (primaryNode) {
      initial[primaryNode.id] = { x: cx, y: cy, vx: 0, vy: 0 };
    }
    secondaryNodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / secondaryNodes.length - Math.PI / 2;
      initial[node.id] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
      };
    });
    posRef.current = initial;
    setPositions({ ...initial });
  }, [nodes, dimensions]);

  // Simple force simulation
  useEffect(() => {
    let frame = 0;
    const maxFrames = 120;

    const tick = () => {
      const pos = posRef.current;
      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2;
      const damping = 0.85;
      const nodeIds = Object.keys(pos);

      // Repulsion between all nodes
      for (let i = 0; i < nodeIds.length; i++) {
        for (let j = i + 1; j < nodeIds.length; j++) {
          const a = pos[nodeIds[i]];
          const b = pos[nodeIds[j]];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const force = 2000 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }

      // Attraction along edges
      edges.forEach((edge) => {
        const a = pos[edge.source];
        const b = pos[edge.target];
        if (!a || !b) return;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idealDist = 160;
        const force = (dist - idealDist) * 0.01;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      });

      // Center gravity
      nodeIds.forEach((id) => {
        const n = pos[id];
        n.vx += (cx - n.x) * 0.001;
        n.vy += (cy - n.y) * 0.001;
      });

      // Apply velocity
      nodeIds.forEach((id) => {
        const n = pos[id];
        if (id === dragNode) return;
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
        // Clamp
        n.x = Math.max(60, Math.min(dimensions.width - 60, n.x));
        n.y = Math.max(40, Math.min(dimensions.height - 40, n.y));
      });

      setPositions({ ...pos });
      frame++;
      if (frame < maxFrames) {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [nodes, edges, dimensions, dragNode]);

  const handleMouseDown = useCallback((id: string) => {
    setDragNode(id);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragNode || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      posRef.current[dragNode] = { ...posRef.current[dragNode], x, y, vx: 0, vy: 0 };
      setPositions({ ...posRef.current });
    },
    [dragNode]
  );

  const handleMouseUp = useCallback(() => {
    setDragNode(null);
  }, []);

  const handleReset = () => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const primaryNode = nodes.find((n) => n.type === "primary");
    const secondaryNodes = nodes.filter((n) => n.type === "secondary");
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;

    const reset: Record<string, NodePosition> = {};
    if (primaryNode) {
      reset[primaryNode.id] = { x: cx, y: cy, vx: 0, vy: 0 };
    }
    secondaryNodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / secondaryNodes.length - Math.PI / 2;
      reset[node.id] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
      };
    });
    posRef.current = reset;
    setPositions({ ...reset });
  };

  const [expandedOpen, setExpandedOpen] = useState(false);

  return (
    <>
    <div className={cn("rounded-xl border-2 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden shadow-lg shadow-primary/5 ring-1 ring-primary/10", className)}>
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-border/50">
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Reset View
        </button>
        <button
          onClick={() => setExpandedOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Maximize2 size={12} />
          Expanded View
        </button>
      </div>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full cursor-grab active:cursor-grabbing select-none"
        style={{ height: 450 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              className="fill-muted-foreground/40"
            />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              className="fill-primary"
            />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const s = positions[edge.source];
          const t = positions[edge.target];
          if (!s || !t) return null;

          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mx = (s.x + t.x) / 2;
          const my = (s.y + t.y) / 2;
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const isActive = hoveredNode === edge.source || hoveredNode === edge.target;

          // Offset line endpoints by node radius
          const nodeRadius = 8;
          const offsetX = (dx / dist) * nodeRadius;
          const offsetY = (dy / dist) * nodeRadius;

          return (
            <g key={`edge-${i}`}>
              <line
                x1={s.x + offsetX}
                y1={s.y + offsetY}
                x2={t.x - offsetX}
                y2={t.y - offsetY}
                className={cn(
                  "transition-all duration-200",
                  isActive ? "stroke-primary/60" : "stroke-muted-foreground/20"
                )}
                strokeWidth={isActive ? 2 : 1}
                markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
              />
              <g transform={`translate(${mx}, ${my}) rotate(${angle > 90 || angle < -90 ? angle + 180 : angle})`}>
                <rect
                  x={-edge.label.length * 3.5 - 6}
                  y={-10}
                  width={edge.label.length * 7 + 12}
                  height={18}
                  rx={4}
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "fill-primary/15" : "fill-card"
                  )}
                />
                <text
                  textAnchor="middle"
                  dy="3"
                  className={cn(
                    "text-[9px] font-mono font-semibold tracking-wider uppercase select-none transition-all duration-200",
                    isActive ? "fill-primary" : "fill-muted-foreground/60"
                  )}
                >
                  {edge.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;

          const isPrimary = node.type === "primary";
          const isHovered = hoveredNode === node.id;
          const isConnected = hoveredNode
            ? edges.some(
                (e) =>
                  (e.source === hoveredNode && e.target === node.id) ||
                  (e.target === hoveredNode && e.source === node.id)
              ) || hoveredNode === node.id
            : true;

          return (
            <g
              key={node.id}
              onMouseDown={() => handleMouseDown(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
              style={{
                opacity: hoveredNode && !isConnected ? 0.3 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {/* Glow */}
              {(isPrimary || isHovered) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isPrimary ? 22 : 16}
                  className={cn(
                    "transition-all duration-300",
                    isPrimary ? "fill-primary/15" : "fill-accent-foreground/10"
                  )}
                />
              )}
              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isPrimary ? 12 : 7}
                className={cn(
                  "transition-all duration-200 stroke-2",
                  isPrimary
                    ? "fill-primary stroke-primary/40"
                    : isHovered
                    ? "fill-accent-foreground stroke-accent-foreground/40"
                    : "fill-primary/70 stroke-primary/20"
                )}
              />
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + (isPrimary ? 26 : 20)}
                textAnchor="middle"
                className={cn(
                  "text-[11px] font-medium select-none pointer-events-none transition-all duration-200",
                  isHovered ? "fill-foreground" : "fill-muted-foreground"
                )}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>

    <Dialog open={expandedOpen} onOpenChange={setExpandedOpen}>
      <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Expanded Graph View</DialogTitle>
        <RelationGraph nodes={nodes} edges={edges} className="border-0 rounded-none" />
      </DialogContent>
    </Dialog>
    </>
  );
}
