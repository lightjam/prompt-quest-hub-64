import { useState } from "react";
import { ArrowUp, ArrowUpRight, Zap, Network, ChevronDown, Copy, Check, FileText, GitBranch, Layers, Hash, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RelationGraph } from "./RelationGraph";

const examplePrompts = [
  "What is overall accuracy of cortex",
  "What is context rot",
  "What is self-attention and how is it related to noam shazeer",
];

// Mock comparison data
const mockStats = {
  baseline: { tokens: 64855, cost: 0.0325 },
  cortex: { tokens: 6907, cost: 0.0036 },
  savings: 89.4,
  fullContextChars: 259151,
};

const mockEconomics = {
  baseline: { input: 64809, total: 64855, cost: "$0.0325" },
  cortex: { input: 6861, total: 6907, cost: "$0.0036" },
};

const mockBaselineChunks = [
  {
    id: "b1",
    source: "foundationcapital.com",
    title: "Context graphs: six trillion dollar opportunity",
    url: "https://foundationcapital.com/context-graphs",
    snippet: "Full context baseline re-sends complete source documents every query. Context graphs represent a six trillion dollar opportunity in enterprise AI...",
  },
  {
    id: "b2",
    source: "www.ibm.com",
    title: "First testing knowledge graph 2026",
    url: "https://www.ibm.com/knowledge-graph",
    snippet: "Enterprise knowledge management through structured graph representations enables more accurate information retrieval across distributed systems...",
  },
  {
    id: "b3",
    source: "cortex.pdf",
    title: "Beyond Context Windows: Long Term Agentic Memory",
    url: "#",
    snippet: "Cortex extends beyond traditional context windows by implementing persistent agentic memory systems that maintain coherence across sessions...",
  },
];

const mockCortexContext = `>>> ENTITY PATHS >>>
[cortex] → RELATED_TO → [knowledge management tasks]. Cortex achieves 97.4% accuracy, demonstrating robust handling of contradictory or evolving user information.
[cortex] → RELATED_TO → [knowledge source tasks]. On knowledge update tasks, Cortex achieves 97.4% accuracy, demonstrating robust handling of contradictory or evolving user information.
>>> MAINTAINS → [evaluation area]: Cortex maintains consistently high accuracy across all evaluation benchmarks.
>>> USES_TOOL → [multi-stage pipeline]: Cortex employs a Multi-Stage Pipeline that combines retrieval with graph traversal.`;

const mockGraphEvidence = {
  nodes: [
    { id: "cortex", label: "cortex", type: "primary" as const },
    { id: "vectorstore", label: "vectorstore", type: "secondary" as const },
    { id: "eval", label: "evaluation area", type: "secondary" as const },
    { id: "cross", label: "cross-model evaluations", type: "secondary" as const },
    { id: "schema", label: "multi-field hybrid schema", type: "secondary" as const },
    { id: "knowledge", label: "knowledge update tasks", type: "secondary" as const },
    { id: "pipeline", label: "multi-stage pipeline", type: "secondary" as const },
    { id: "snowflake", label: "snowflake", type: "secondary" as const },
    { id: "longretrieval", label: "long-horizon retrieval", type: "secondary" as const },
  ],
  edges: [
    { source: "cortex", target: "knowledge", label: "RELATED_TO" },
    { source: "cortex", target: "eval", label: "MAINTAINS" },
    { source: "cortex", target: "pipeline", label: "USES_TOOL" },
    { source: "cortex", target: "vectorstore", label: "RELATED_TO" },
    { source: "cortex", target: "cross", label: "RELATED_TO" },
    { source: "pipeline", target: "schema", label: "INCLUDES" },
    { source: "pipeline", target: "snowflake", label: "INCLUDES" },
    { source: "cortex", target: "longretrieval", label: "RELATED_TO" },
  ],
};

const mockDirectRelations = [
  { source: "cortex", relation: "RELATED_TO", target: "knowledge update tasks" },
  { source: "cortex", relation: "RELATED_TO", target: "knowledge update tasks" },
  { source: "cortex", relation: "MAINTAINS", target: "evaluation area" },
  { source: "cortex", relation: "USES_TOOL", target: "multi-stage pipeline" },
];

const mockChainNodes = [
  { id: "cortex2", label: "cortex", type: "primary" as const },
  { id: "accuracy", label: "overall accuracy", type: "secondary" as const },
  { id: "longret", label: "long-horizon retrieval", type: "secondary" as const },
  { id: "prefext", label: "preference extraction", type: "secondary" as const },
  { id: "tempstate", label: "temporal state tracking", type: "secondary" as const },
  { id: "evalarea", label: "evaluation area", type: "secondary" as const },
  { id: "benchground", label: "benchground", type: "secondary" as const },
  { id: "asstrecall", label: "assistant recall", type: "secondary" as const },
];

const mockChainEdges = [
  { source: "cortex2", target: "accuracy", label: "RELATED_TO" },
  { source: "cortex2", target: "evalarea", label: "MAINTAINS" },
  { source: "cortex2", target: "benchground", label: "RELATED_TO" },
  { source: "accuracy", target: "longret", label: "RELATED_TO" },
  { source: "accuracy", target: "prefext", label: "RELATED_TO" },
  { source: "accuracy", target: "tempstate", label: "RELATED_TO" },
  { source: "evalarea", target: "asstrecall", label: "INCLUDES" },
];

const mockChainRelations = [
  { source: "cortex", relation: "RELATED_TO", target: "benchground" },
  { source: "cross-model evaluations", relation: "RELATED_TO", target: "cortex" },
  { source: "cortex", relation: "RELATED_TO", target: "benchground" },
  { source: "cortex", relation: "MAINTAINS", target: "evaluation area" },
  { source: "cortex", relation: "RELATED_TO", target: "benchground" },
];

const mockCortexChunks = [
  {
    id: "cc1",
    score: 0.827,
    content: "This analysis tests a central architectural hypothesis: that effective memory system design should reduce dependence on raw model capacity by ensuring the properly structured context and skill modules are available. We emphasize that it was crucial to show clearly if Cortex exceeds downstream models rather than a competitive model comparison. API Reference Configuration: Current 0.2 Pro, As mentioned in Section 3.2.1, Cortex achieves 0.9797 accuracy...",
  },
];

export function ComparisonPanel() {
  const [query, setQuery] = useState("");
  const [tenantId, setTenantId] = useState("cortexai-workbench");
  const [subTenantId, setSubTenantId] = useState("workbench-st-1");
  const [hasCompared, setHasCompared] = useState(false);
  const [baselineMethod, setBaselineMethod] = useState("Full Context LLM");
  const [searchType, setSearchType] = useState("Knowledge");
  const [scope, setScope] = useState("All knowledge");
  const [topN, setTopN] = useState(5);
  const [graphContext, setGraphContext] = useState(true);

  const handleCompare = () => {
    if (query.trim()) setHasCompared(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCompare();
    }
  };

  const handleExampleClick = (prompt: string) => {
    setQuery(prompt);
    setHasCompared(true);
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 min-h-screen">
      <div className={cn("w-full max-w-5xl space-y-6 animate-fade-in transition-all duration-500", hasCompared ? "pt-2" : "pt-[10vh]")}>
        {/* Header */}
        {!hasCompared && (
          <div className="text-center space-y-2 mb-4">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Cortex vs Traditional Retrieval
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Compare Cortex's graph-augmented smart retrieval against full-context baselines. See the difference in cost, tokens, and quality.
            </p>
          </div>
        )}

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Baseline Config */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Baseline Configuration</h3>
            <div className="space-y-1.5">
              <label className="text-[11px] text-muted-foreground">Baseline method</label>
              <ChipSelect value={baselineMethod} options={["Full Context LLM", "Naive RAG", "Keyword Search"]} onChange={setBaselineMethod} />
            </div>
          </div>

          {/* Source / Scope */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source / Memory Scope</h3>
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Search type</label>
                <div className="flex gap-1.5">
                  {["Knowledge", "Semantic", "Hybrid"].map((t) => (
                    <button key={t} onClick={() => setSearchType(t)} className={cn("px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all", t === searchType ? "bg-accent text-accent-foreground border-primary/30" : "bg-chip text-muted-foreground border-chip-border hover:bg-chip-hover")}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Scope</label>
                <ChipSelect value={scope} options={["All knowledge", "Selected tenant", "Recent uploads"]} onChange={setScope} />
              </div>
            </div>
          </div>

          {/* Cortex Config */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cortex Configuration</h3>
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Top-N chunks</label>
                <input
                  type="number"
                  value={topN}
                  onChange={(e) => setTopN(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <button
                onClick={() => setGraphContext(!graphContext)}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                  graphContext ? "bg-accent text-accent-foreground border-primary/30" : "bg-chip text-muted-foreground border-chip-border hover:bg-chip-hover"
                )}
              >
                <Network size={12} />
                Graph Context
                <span className={cn("ml-auto text-[10px] font-bold uppercase", graphContext ? "text-primary" : "text-muted-foreground/60")}>
                  {graphContext ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tenant IDs - compact */}
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Tenant ID</label>
            <input type="text" value={tenantId} onChange={(e) => setTenantId(e.target.value)} className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Sub-Tenant ID <span className="text-muted-foreground/60 normal-case">(Optional)</span></label>
            <input type="text" value={subTenantId} onChange={(e) => setSubTenantId(e.target.value)} className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
        </div>

        {/* Compare Bar */}
        <div className="search-glow rounded-2xl bg-search-bg overflow-hidden">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a query to compare retrieval methods..."
            rows={hasCompared ? 2 : 3}
            className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-foreground placeholder:text-search-placeholder focus:outline-none text-base"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded-md bg-muted font-mono">{baselineMethod}</span>
              <span>vs</span>
              <span className="px-2 py-1 rounded-md bg-accent text-accent-foreground font-medium">Cortex (Top-{topN}, Graph: {graphContext ? "ON" : "OFF"})</span>
            </div>
            <button
              onClick={handleCompare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
              disabled={!query.trim()}
            >
              Compare
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* Example Prompts */}
        {!hasCompared && (
          <div className="flex flex-wrap gap-2 justify-center">
            {examplePrompts.map((p) => (
              <button key={p} onClick={() => handleExampleClick(p)} className="group flex items-center gap-1.5 px-4 py-2 rounded-xl border border-chip-border bg-chip text-sm text-muted-foreground hover:bg-chip-hover hover:text-foreground hover:border-primary/30 transition-all duration-200">
                {p}
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {hasCompared && <ComparisonResults />}
      </div>
    </div>
  );
}

// ─── Results ───
function ComparisonResults() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Baseline Tokens" value={mockStats.baseline.tokens.toLocaleString()} sub={`$${mockStats.baseline.cost.toFixed(4)}`} variant="muted" />
        <StatCard label="With Cortex" value={mockStats.cortex.tokens.toLocaleString()} sub={`$${mockStats.cortex.cost.toFixed(4)}`} variant="primary" />
        <StatCard label="Estimated Savings" value={`${mockStats.savings}%`} sub={`$${(mockStats.baseline.cost - mockStats.cortex.cost).toFixed(4)} saved`} variant="success" />
        <StatCard label="Full Context Size" value={`${(mockStats.fullContextChars / 1000).toFixed(0)}K chars`} sub={`Scope: 3 items`} variant="muted" />
      </div>

      {/* Generate button */}
      <div className="flex justify-center">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
          <Zap size={16} />
          Generate & Compare Answers
        </button>
      </div>

      {/* Request Economics */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
          <Hash size={14} className="text-muted-foreground" />
          Request Economics
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium text-xs">Metric</th>
                <th className="text-right py-2 text-muted-foreground font-medium text-xs">Baseline</th>
                <th className="text-right py-2 text-muted-foreground font-medium text-xs">With Cortex</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-border/50">
                <td className="py-2.5 text-foreground">Input tokens</td>
                <td className="py-2.5 text-right text-destructive">{mockEconomics.baseline.input.toLocaleString()}</td>
                <td className="py-2.5 text-right text-primary">{mockEconomics.cortex.input.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 text-foreground">Total tokens</td>
                <td className="py-2.5 text-right text-destructive">{mockEconomics.baseline.total.toLocaleString()}</td>
                <td className="py-2.5 text-right text-primary">{mockEconomics.cortex.total.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-foreground font-medium">Estimated cost</td>
                <td className="py-2.5 text-right text-destructive font-medium">{mockEconomics.baseline.cost}</td>
                <td className="py-2.5 text-right text-primary font-medium">{mockEconomics.cortex.cost}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Baseline Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <h3 className="font-display font-semibold text-foreground text-sm">Baseline: Full Context LLM</h3>
          </div>

          {/* Baseline Answer */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={12} /> Full Context Answer
            </h4>
            <p className="text-sm text-muted-foreground italic">
              Click "Generate & Compare Answers" to see the LLM response.
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Full context baseline sends the entire selected corpus in the system prompt.
            </p>
          </div>

          {/* Baseline Chunks */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={12} /> Returned chunks / snippets
            </h4>
            {mockBaselineChunks.map((chunk) => (
              <div key={chunk.id} className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-primary truncate">{chunk.source}</span>
                </div>
                <p className="text-xs font-medium text-foreground">{chunk.title}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{chunk.snippet}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cortex Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <h3 className="font-display font-semibold text-foreground text-sm">Cortex (Top-N: 5, Graph: ON)</h3>
          </div>

          {/* Cortex Answer */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={12} /> Cortex Answer
            </h4>
            <p className="text-sm text-muted-foreground italic">
              Click "Generate & Compare Answers" to see the LLM response.
            </p>
          </div>

          {/* Generated Context String */}
          <CortexContextSection />

          {/* Graph Evidence */}
          <CortexGraphEvidence />

          {/* Chain Relations */}
          <CortexChainRelations />

          {/* Retrieved Chunks */}
          <CortexRetrievedChunks />
        </div>
      </div>
    </div>
  );
}

function CortexContextSection() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(mockCortexContext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <FileText size={12} /> Generated Context String
        </h4>
        <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-colors">
          {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
        {mockCortexContext}
      </pre>
    </div>
  );
}

function CortexGraphEvidence() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <GitBranch size={12} /> Graph Evidence
        </h4>
        <div className="flex gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary">15 relations</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">10 paths</span>
        </div>
      </div>
      <RelationGraph nodes={mockGraphEvidence.nodes} edges={mockGraphEvidence.edges} />
      <div className="space-y-1.5">
        {mockDirectRelations.map((rel, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">{rel.source}</span>
            <span className="text-muted-foreground font-mono">—</span>
            <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[10px]">{rel.relation}</span>
            <span className="text-muted-foreground font-mono">—</span>
            <span className="text-foreground font-medium">{rel.target}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CortexChainRelations() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Network size={12} /> Chain Relations
      </h4>
      <RelationGraph nodes={mockChainNodes} edges={mockChainEdges} />
      <div className="space-y-1.5">
        {mockChainRelations.map((rel, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">{rel.source}</span>
            <span className="text-muted-foreground font-mono">—</span>
            <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[10px]">{rel.relation}</span>
            <span className="text-muted-foreground font-mono">—</span>
            <span className="text-foreground font-medium">{rel.target}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CortexRetrievedChunks() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Layers size={12} /> Retrieved Chunks (Cortex)
      </h4>
      {mockCortexChunks.map((chunk) => (
        <div key={chunk.id} className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Chunk</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
              Score {chunk.score}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{chunk.content}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Shared ───
function StatCard({ label, value, sub, variant }: { label: string; value: string; sub: string; variant: "muted" | "primary" | "success" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
      <p className={cn("text-2xl font-display font-bold tracking-tight", variant === "primary" ? "text-primary" : variant === "success" ? "text-green-500 dark:text-green-400" : "text-foreground")}>
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function ChipSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-chip text-foreground border border-chip-border hover:bg-chip-hover transition-all w-full justify-between">
        {value}
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-surface-elevated border border-border rounded-lg shadow-lg py-1 z-50 w-full animate-fade-in">
          {options.map((opt) => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} className={cn("block w-full text-left px-3 py-1.5 text-xs transition-colors", opt === value ? "text-primary font-medium bg-accent" : "text-foreground hover:bg-muted")}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
