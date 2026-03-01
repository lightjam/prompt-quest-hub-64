import { useState } from "react";
import { Moon, Sun, ExternalLink, FileText, File, ChevronDown, ChevronUp, Network, Download, Search } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RelationGraph } from "@/components/RelationGraph";

interface KnowledgeItem {
  id: string;
  filename: string;
  contentType: string;
  date: string;
  metadata: Record<string, string | number | boolean | null | object>;
}

const mockItems: KnowledgeItem[] = [
  {
    id: "1",
    filename: "foundationcapital.com_context-graphs-ais-trillion-dollar-opportunity_2026-02-26T01_48_37.859Z.md",
    contentType: "text/markdown",
    date: "2/26/2026",
    metadata: {
      bucket_name: "sandbox-user-id",
      content_type: "text/markdown",
      filename: "foundationcapital.com_context-graphs-ais-trillion-dollar-opportunity_2026-02-26T01_48_37.859Z.md",
      tenant_id: "q77rmslzar",
      sub_tenant_id: "workbench-st-1",
      bucket: "sandbox-user-id",
      size_bytes: 21464,
      status: "queued",
      uploaded_at: "2026-02-26T01:48:53.637957+00:00",
      is_memory: false,
    },
  },
  {
    id: "2",
    filename: "www.ibm.com_think_topics_knowledge-graph.2026-02-26T01_34_53.127Z.md",
    contentType: "text/markdown",
    date: "2/26/2026",
    metadata: { content_type: "text/markdown", size_bytes: 15230, status: "processed", is_memory: false },
  },
  {
    id: "3",
    filename: "cortex.pdf",
    contentType: "application/pdf",
    date: "2/24/2026",
    metadata: { content_type: "application/pdf", size_bytes: 84210, status: "processed", is_memory: false },
  },
  {
    id: "4",
    filename: "lost-in-middle-how-llms-use-long-context.pdf",
    contentType: "application/pdf",
    date: "2/24/2026",
    metadata: { content_type: "application/pdf", size_bytes: 120400, status: "processed", is_memory: false },
  },
  {
    id: "5",
    filename: "1706.03762v7.pdf",
    contentType: "application/pdf",
    date: "2/24/2026",
    metadata: { content_type: "application/pdf", size_bytes: 95300, status: "processed", is_memory: false },
  },
  {
    id: "6",
    filename: "research.trychroma.com_context-rot.2026-02-24T06_00_11.160Z.md",
    contentType: "text/markdown",
    date: "2/24/2026",
    metadata: { content_type: "text/markdown", size_bytes: 18700, status: "processed", is_memory: false },
  },
];

const graphNodes = [
  { id: "doc", label: "Document", type: "primary" as const },
  { id: "topic1", label: "Knowledge Graphs", type: "secondary" as const },
  { id: "topic2", label: "RAG", type: "secondary" as const },
  { id: "topic3", label: "LLM Context", type: "secondary" as const },
  { id: "topic4", label: "Vector Search", type: "secondary" as const },
];

const graphEdges = [
  { source: "doc", target: "topic1", label: "COVERS" },
  { source: "doc", target: "topic2", label: "REFERENCES" },
  { source: "topic1", target: "topic3", label: "IMPROVES" },
  { source: "topic2", target: "topic4", label: "USES" },
];

const BrowseKnowledge = () => {
  const [isDark, setIsDark] = useState(true);
  const [tenantId, setTenantId] = useState("cortexai-workbench");
  const [subTenantId, setSubTenantId] = useState("workbench-st-1");
  const [kind, setKind] = useState("knowledge");
  const [loaded, setLoaded] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [graphId, setGraphId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  useState(() => {
    document.documentElement.classList.add("dark");
  });

  const filteredItems = mockItems.filter((item) =>
    item.filename.toLowerCase().includes(filterText.toLowerCase())
  );

  const getTypeLabel = (ct: string) => {
    if (ct.includes("pdf")) return "application";
    if (ct.includes("markdown") || ct.includes("text")) return "text";
    return "file";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button onClick={toggleTheme} className="p-2 rounded-lg border border-border bg-surface-elevated text-foreground hover:bg-muted transition-colors">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a href="#" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface-elevated text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <ExternalLink size={14} />
            API Reference
          </a>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 py-8 min-h-screen">
          <div className="w-full max-w-5xl space-y-6 animate-fade-in">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">Browse Knowledge Base</h1>

          {/* Filters */}
          <div className="grid grid-cols-[1fr_1fr_180px_auto] gap-3 mb-6">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tenant ID</label>
              <Input value={tenantId} onChange={(e) => setTenantId(e.target.value)} className="bg-card border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sub-Tenant ID (Optional)</label>
              <Input value={subTenantId} onChange={(e) => setSubTenantId(e.target.value)} className="bg-card border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Kind</label>
              <Select value={kind} onValueChange={setKind}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="knowledge">Knowledge</SelectItem>
                  <SelectItem value="memories">Memories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => setLoaded(true)} className="px-6">Load</Button>
            </div>
          </div>

          {loaded && (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">{filteredItems.length} items</span>
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Filter by filename..."
                    className="pl-9 h-9 bg-card border-border text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredItems.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const showGraph = graphId === item.id;
                  const isPdf = item.contentType.includes("pdf");

                  return (
                    <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden transition-all">
                      {/* Header row */}
                      <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {isPdf ? <File size={18} className="text-primary shrink-0" /> : <FileText size={18} className="text-primary shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.filename}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">{getTypeLabel(item.contentType)}</Badge>
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1.5"
                            onClick={() => setGraphId(showGraph ? null : item.id)}
                          >
                            <Network size={14} />
                            {showGraph ? "Hide Graph" : "View Graph"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs gap-1"
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {isExpanded ? "collapse" : "expand"}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded metadata */}
                      {isExpanded && (
                        <div className="border-t border-border px-5 py-4 space-y-3">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Document Metadata</p>
                          <pre className="text-xs text-foreground/80 bg-muted/50 rounded-lg p-4 overflow-x-auto font-mono leading-relaxed">
                            {JSON.stringify(item.metadata, null, 2)}
                          </pre>
                          <a href="#" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                            <Download size={12} />
                            Download Content
                          </a>
                        </div>
                      )}

                      {/* Graph view */}
                      {showGraph && (
                        <div className="border-t border-border px-5 py-4">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Knowledge Graph</p>
                          <RelationGraph nodes={graphNodes} edges={graphEdges} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseKnowledge;
