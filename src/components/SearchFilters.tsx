import { useState } from "react";
import { ChevronDown, Zap, Network } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchFilters() {
  const [searchType, setSearchType] = useState("Knowledge");
  const [mode, setMode] = useState("Fast");
  const [alpha, setAlpha] = useState(0.8);
  const [topN, setTopN] = useState(10);
  const [graphContext, setGraphContext] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Search Type Chip */}
      <FilterChip label={searchType} options={["Knowledge", "Semantic", "Hybrid"]} onChange={setSearchType} />

      {/* Mode Chip */}
      <FilterChip
        label={mode}
        options={["Fast", "Balanced", "Precise"]}
        onChange={setMode}
        icon={<Zap size={12} />}
      />

      {/* Graph Context Toggle */}
      <button
        onClick={() => setGraphContext(!graphContext)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200",
          graphContext
            ? "bg-accent text-accent-foreground border-primary/30"
            : "bg-chip text-muted-foreground border-chip-border hover:bg-chip-hover"
        )}
      >
        <Network size={12} />
        Graph
        <span className={cn(
          "text-[10px] font-bold uppercase",
          graphContext ? "text-primary" : "text-muted-foreground/60"
        )}>
          {graphContext ? "ON" : "OFF"}
        </span>
      </button>

      {/* Advanced toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
      >
        {showAdvanced ? "Less" : "More"} options
      </button>

      {/* Advanced filters row */}
      {showAdvanced && (
        <div className="flex items-center gap-4 w-full pt-1 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Alpha</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-20 h-1 accent-primary"
            />
            <span className="text-xs font-mono text-foreground w-6">{alpha}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Top N</span>
            <input
              type="range"
              min={1}
              max={50}
              value={topN}
              onChange={(e) => setTopN(parseInt(e.target.value))}
              className="w-20 h-1 accent-primary"
            />
            <span className="text-xs font-mono text-foreground w-6">{topN}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  options,
  onChange,
  icon,
}: {
  label: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-chip text-foreground border border-chip-border hover:bg-chip-hover transition-all duration-200"
      >
        {icon}
        {label}
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-surface-elevated border border-border rounded-lg shadow-lg py-1 z-50 min-w-[120px] animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={cn(
                "block w-full text-left px-3 py-1.5 text-xs transition-colors",
                opt === label
                  ? "text-primary font-medium bg-accent"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
