import { useState } from "react";
import { ChevronDown, FileText, GitBranch, Network, Layers, Copy, Check, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RelationGraph } from "./RelationGraph";

// Mock data for demonstration
const mockContextString = `Cortex is an advanced AI system designed for knowledge management and retrieval. It leverages transformer-based architectures to process and understand complex documents. The system achieves an overall accuracy of 94.7% on standard benchmarks.

Key features include:
- Semantic search with hybrid retrieval combining dense and sparse representations
- Knowledge graph construction for entity relationship mapping
- Context-aware chunking that preserves document structure
- Multi-tenant architecture supporting isolated knowledge bases

The accuracy metrics are computed using a combination of recall@k, precision@k, and NDCG scores across diverse query types including factual, analytical, and comparative questions.`;

const mockDirectRelations = [
  {
    id: "rel-1",
    source: "Cortex AI",
    relation: "HAS_FEATURE",
    target: "Semantic Search",
    weight: 0.95,
    metadata: "Core search capability using dense vector embeddings with HNSW index for approximate nearest neighbor lookup.",
  },
  {
    id: "rel-2",
    source: "Cortex AI",
    relation: "ACHIEVES",
    target: "94.7% Accuracy",
    weight: 0.92,
    metadata: "Measured on standard QA benchmarks including SQuAD 2.0 and Natural Questions datasets.",
  },
  {
    id: "rel-3",
    source: "Cortex AI",
    relation: "USES",
    target: "Transformer Architecture",
    weight: 0.88,
    metadata: "Based on encoder-only transformer with custom attention mechanisms for long document processing.",
  },
  {
    id: "rel-4",
    source: "Semantic Search",
    relation: "DEPENDS_ON",
    target: "Vector Embeddings",
    weight: 0.91,
    metadata: "Uses fine-tuned embedding models producing 768-dimensional dense vectors.",
  },
];

const mockGraphRelations = [
  {
    id: "graph-1",
    path: ["Cortex AI", "Transformer Architecture", "Self-Attention", "Noam Shazeer"],
    depth: 3,
    description: "Cortex AI utilizes transformer architecture, which relies on self-attention mechanisms originally developed with contributions from Noam Shazeer.",
  },
  {
    id: "graph-2",
    path: ["Cortex AI", "Knowledge Graph", "Entity Extraction", "NER Models"],
    depth: 3,
    description: "The knowledge graph is built through entity extraction pipelines powered by custom Named Entity Recognition models.",
  },
  {
    id: "graph-3",
    path: ["Semantic Search", "Hybrid Retrieval", "BM25", "Sparse Vectors"],
    depth: 3,
    description: "Hybrid retrieval combines semantic search with BM25 sparse vector matching for improved recall.",
  },
];

const mockContextChunks = [
  {
    id: "chunk-1",
    source: "cortex-whitepaper.pdf",
    page: 12,
    score: 0.96,
    content: "The overall accuracy of Cortex on the standard evaluation benchmark suite is 94.7%, representing a 3.2% improvement over the previous generation. This accuracy is measured across factual recall, semantic understanding, and cross-document reasoning tasks.",
  },
  {
    id: "chunk-2",
    source: "architecture-docs.md",
    page: 3,
    score: 0.89,
    content: "Cortex employs a multi-stage retrieval pipeline: Stage 1 uses approximate nearest neighbor search on dense embeddings, Stage 2 applies re-ranking with a cross-encoder model, and Stage 3 performs context assembly with graph-augmented retrieval.",
  },
  {
    id: "chunk-3",
    source: "benchmarks-q4-2025.csv",
    page: 1,
    score: 0.85,
    content: "Benchmark results show Cortex achieving 96.1% on factual QA, 93.4% on multi-hop reasoning, 91.2% on comparative analysis, and 98.1% on entity lookup queries. The aggregate weighted accuracy stands at 94.7%.",
  },
  {
    id: "chunk-4",
    source: "release-notes-v3.md",
    page: 7,
    score: 0.78,
    content: "Version 3.0 introduces graph-augmented context retrieval, which enriches retrieved chunks with knowledge graph traversal results. This feature contributed to a 5.8% improvement in multi-hop reasoning accuracy.",
  },
];

export function SearchResults() {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <Tabs defaultValue="context" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto gap-0">
          <TabTab value="context" icon={<FileText size={14} />} label="Context String" count={1} />
          <TabTab value="direct" icon={<GitBranch size={14} />} label="Direct Relations" count={mockDirectRelations.length} />
          <TabTab value="graph" icon={<Network size={14} />} label="Graph Relations" count={mockGraphRelations.length} />
          <TabTab value="chunks" icon={<Layers size={14} />} label="Context Chunks" count={mockContextChunks.length} />
        </TabsList>

        <TabsContent value="context" className="mt-4">
          <ContextStringTab />
        </TabsContent>
        <TabsContent value="direct" className="mt-4">
          <DirectRelationsTab />
        </TabsContent>
        <TabsContent value="graph" className="mt-4">
          <GraphRelationsTab />
        </TabsContent>
        <TabsContent value="chunks" className="mt-4">
          <ContextChunksTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TabTab({ value, icon, label, count }: { value: string; icon: React.ReactNode; label: string; count: number }) {
  return (
    <TabsTrigger
      value={value}
      className="flex items-center gap-1.5 px-4 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none bg-transparent text-muted-foreground data-[state=active]:text-foreground"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
        {count}
      </span>
    </TabsTrigger>
  );
}

// ─── Context String Tab ───
function ContextStringTab() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockContextString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Assembled context from retrieved knowledge
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition-colors"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
          {mockContextString}
        </pre>
      </div>
    </div>
  );
}

// ─── Direct Relations Tab ───
const directGraphNodes = [
  { id: "cortex", label: "Cortex AI", type: "primary" as const },
  { id: "search", label: "Semantic Search", type: "secondary" as const },
  { id: "accuracy", label: "94.7% Accuracy", type: "secondary" as const },
  { id: "transformer", label: "Transformer Architecture", type: "secondary" as const },
  { id: "vectors", label: "Vector Embeddings", type: "secondary" as const },
];

const directGraphEdges = [
  { source: "cortex", target: "search", label: "HAS_FEATURE" },
  { source: "cortex", target: "accuracy", label: "ACHIEVES" },
  { source: "cortex", target: "transformer", label: "USES" },
  { source: "search", target: "vectors", label: "DEPENDS_ON" },
];

function DirectRelationsTab() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Entities and relationships directly matching the query
      </p>
      <RelationGraph nodes={directGraphNodes} edges={directGraphEdges} />
      {mockDirectRelations.map((rel) => (
        <ExpandableCard key={rel.id} defaultOpen={false}>
          {({ isOpen, toggle }) => (
            <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary/20">
              <button
                onClick={toggle}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <ChevronDown
                  size={14}
                  className={cn("text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")}
                />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">{rel.source}</span>
                  <span className="shrink-0 px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-[10px] font-mono font-semibold uppercase tracking-wide">
                    {rel.relation}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">{rel.target}</span>
                </div>
                <ScoreBadge score={rel.weight} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-0 border-t border-border/50 animate-fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed pt-3">
                    {rel.metadata}
                  </p>
                </div>
              )}
            </div>
          )}
        </ExpandableCard>
      ))}
    </div>
  );
}

// ─── Graph Relations Tab ───
const graphGraphNodes = [
  { id: "cortex", label: "Cortex AI", type: "primary" as const },
  { id: "transformer", label: "Transformer Architecture", type: "secondary" as const },
  { id: "attention", label: "Self-Attention", type: "secondary" as const },
  { id: "shazeer", label: "Noam Shazeer", type: "secondary" as const },
  { id: "kg", label: "Knowledge Graph", type: "secondary" as const },
  { id: "ner", label: "NER Models", type: "secondary" as const },
  { id: "hybrid", label: "Hybrid Retrieval", type: "secondary" as const },
  { id: "bm25", label: "BM25", type: "secondary" as const },
];

const graphGraphEdges = [
  { source: "cortex", target: "transformer", label: "USES" },
  { source: "transformer", target: "attention", label: "RELIES_ON" },
  { source: "attention", target: "shazeer", label: "DEVELOPED_BY" },
  { source: "cortex", target: "kg", label: "BUILDS" },
  { source: "kg", target: "ner", label: "POWERED_BY" },
  { source: "cortex", target: "hybrid", label: "USES" },
  { source: "hybrid", target: "bm25", label: "INCLUDES" },
];

function GraphRelationsTab() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Multi-hop relationships discovered through graph traversal
      </p>
      <RelationGraph nodes={graphGraphNodes} edges={graphGraphEdges} />
      {mockGraphRelations.map((rel) => (
        <ExpandableCard key={rel.id} defaultOpen={false}>
          {({ isOpen, toggle }) => (
            <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary/20">
              <button
                onClick={toggle}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <ChevronDown
                  size={14}
                  className={cn("text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")}
                />
                <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
                  {rel.path.map((node, i) => (
                    <span key={i} className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-medium text-foreground">{node}</span>
                      {i < rel.path.length - 1 && (
                        <span className="text-muted-foreground/40">→</span>
                      )}
                    </span>
                  ))}
                </div>
                <span className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
                  <Hash size={10} />
                  depth {rel.depth}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-0 border-t border-border/50 animate-fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed pt-3">
                    {rel.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </ExpandableCard>
      ))}
    </div>
  );
}

// ─── Context Chunks Tab ───
function ContextChunksTab() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-3">
        Raw document chunks used to assemble the context
      </p>
      {mockContextChunks.map((chunk) => (
        <ExpandableCard key={chunk.id} defaultOpen={false}>
          {({ isOpen, toggle }) => (
            <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary/20">
              <button
                onClick={toggle}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <ChevronDown
                  size={14}
                  className={cn("text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")}
                />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText size={14} className="text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">{chunk.source}</span>
                  <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded-md bg-muted shrink-0">
                    p.{chunk.page}
                  </span>
                </div>
                <ScoreBadge score={chunk.score} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-0 border-t border-border/50 animate-fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed pt-3">
                    {chunk.content}
                  </p>
                </div>
              )}
            </div>
          )}
        </ExpandableCard>
      ))}
    </div>
  );
}

// ─── Shared Components ───
function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <span
      className={cn(
        "shrink-0 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md",
        pct >= 90
          ? "bg-green-500/10 text-green-600 dark:text-green-400"
          : pct >= 80
          ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
          : "bg-muted text-muted-foreground"
      )}
    >
      {score.toFixed(2)}
    </span>
  );
}

function ExpandableCard({
  children,
  defaultOpen = false,
}: {
  children: (props: { isOpen: boolean; toggle: () => void }) => React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return <>{children({ isOpen, toggle: () => setIsOpen(!isOpen) })}</>;
}
