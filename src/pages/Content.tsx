import { useState, useRef } from "react";
import { Moon, Sun, ExternalLink, Upload, FileText, File, X, AlertTriangle, CloudUpload, Lock, ChevronDown, ChevronUp, Network, Download, Search } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RelationGraph } from "@/components/RelationGraph";
import { useApiKey } from "@/context/ApiKeyContext";
import { useNavigate } from "react-router-dom";

// Browse Knowledge mock data
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
    is_memory: false
  }
},
{
  id: "2",
  filename: "www.ibm.com_think_topics_knowledge-graph.2026-02-26T01_34_53.127Z.md",
  contentType: "text/markdown",
  date: "2/26/2026",
  metadata: { content_type: "text/markdown", size_bytes: 15230, status: "processed", is_memory: false }
},
{
  id: "3",
  filename: "cortex.pdf",
  contentType: "application/pdf",
  date: "2/24/2026",
  metadata: { content_type: "application/pdf", size_bytes: 84210, status: "processed", is_memory: false }
},
{
  id: "4",
  filename: "lost-in-middle-how-llms-use-long-context.pdf",
  contentType: "application/pdf",
  date: "2/24/2026",
  metadata: { content_type: "application/pdf", size_bytes: 120400, status: "processed", is_memory: false }
},
{
  id: "5",
  filename: "1706.03762v7.pdf",
  contentType: "application/pdf",
  date: "2/24/2026",
  metadata: { content_type: "application/pdf", size_bytes: 95300, status: "processed", is_memory: false }
},
{
  id: "6",
  filename: "research.trychroma.com_context-rot.2026-02-24T06_00_11.160Z.md",
  contentType: "text/markdown",
  date: "2/24/2026",
  metadata: { content_type: "text/markdown", size_bytes: 18700, status: "processed", is_memory: false }
}];


const graphNodes = [
{ id: "doc", label: "Document", type: "primary" as const },
{ id: "topic1", label: "Knowledge Graphs", type: "secondary" as const },
{ id: "topic2", label: "RAG", type: "secondary" as const },
{ id: "topic3", label: "LLM Context", type: "secondary" as const },
{ id: "topic4", label: "Vector Search", type: "secondary" as const }];


const graphEdges = [
{ source: "doc", target: "topic1", label: "COVERS" },
{ source: "doc", target: "topic2", label: "REFERENCES" },
{ source: "topic1", target: "topic3", label: "IMPROVES" },
{ source: "topic2", target: "topic4", label: "USES" }];


const Content = () => {
  const [isDark, setIsDark] = useState(true);
  const { hasApiKey } = useApiKey();
  const navigate = useNavigate();

  // Upload state
  const [uploadTenantId, setUploadTenantId] = useState("hydradb-workbench");
  const [uploadSubTenantId, setUploadSubTenantId] = useState("workbench-st-1");
  const [uploadTab, setUploadTab] = useState("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [memoryText, setMemoryText] = useState("");
  const [memoryKey, setMemoryKey] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Browse state
  const [browseTenantId, setBrowseTenantId] = useState("hydradb-workbench");
  const [browseSubTenantId, setBrowseSubTenantId] = useState("workbench-st-1");
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

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
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface-elevated text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <ExternalLink size={14} />
            API Reference
          </a>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 py-8 min-h-screen">
          <div className="w-full max-w-5xl space-y-6 animate-fade-in">
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">Context</h1>

            <Tabs defaultValue="browse" className="w-full">
              <TabsList className="bg-card border border-border p-1 rounded-xl shadow-md">
                <TabsTrigger value="browse" className="px-5 py-2.5 text-sm font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">Browse Knowledge</TabsTrigger>
                <TabsTrigger value="upload" className="px-5 py-2.5 text-sm font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">Upload Knowledge</TabsTrigger>
              </TabsList>

              {/* ─── Upload Knowledge Tab ─── */}
              <TabsContent value="upload" className="space-y-6 relative">
                {!hasApiKey &&
                <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-md flex items-center justify-center rounded-xl">
                    <div className="flex flex-col items-center gap-4 text-center p-10 rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl max-w-sm">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Lock size={20} className="text-muted-foreground" />
                      </div>
                      <h2 className="text-lg font-display font-semibold text-foreground">API Key Required</h2>
                      <p className="text-sm text-muted-foreground">
                        You need to add your API key in API Settings to upload knowledge.
                      </p>
                      <Button onClick={() => navigate("/settings")} className="gap-1.5">
                        Go to API Settings
                      </Button>
                    </div>
                  </div>
                }

                <div className={!hasApiKey ? "pointer-events-none select-none" : ""}>
                  <div className="grid grid-cols-2 gap-3 mb-6 mt-[32px]">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Tenant ID</label>
                      <Input value={uploadTenantId} onChange={(e) => setUploadTenantId(e.target.value)} className="bg-card border-border" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Sub-Tenant ID (Optional)</label>
                      <Input value={uploadSubTenantId} onChange={(e) => setUploadSubTenantId(e.target.value)} className="bg-card border-border" />
                    </div>
                  </div>

                  <Tabs value={uploadTab} onValueChange={setUploadTab} className="mb-6">
                    <TabsList>
                      <TabsTrigger value="upload">Upload Knowledge</TabsTrigger>
                      <TabsTrigger value="memory">Upload Memory</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                      








                      

                      <div className="flex justify-end">
                        


                        
                      </div>

                      <div
                        onDragOver={(e) => {e.preventDefault();setDragOver(true);}}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                        dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40 bg-card/50"}`
                        }>
                        
                        <CloudUpload size={36} className="text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Drag & drop files here, or click to browse</p>
                        <Button variant="outline" size="sm" className="mt-1">Choose Files</Button>
                        <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => {
                          if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                        }} />
                      </div>

                      {files.length > 0 &&
                      <div className="space-y-2">
                          {files.map((f, i) =>
                        <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-muted/50 border border-border">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText size={14} className="text-primary shrink-0" />
                                <span className="text-sm text-foreground truncate">{f.name}</span>
                                <span className="text-xs text-muted-foreground">({(f.size / 1024).toFixed(1)} KB)</span>
                              </div>
                              <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <X size={14} />
                              </button>
                            </div>
                        )}
                          <Button className="w-full mt-2 gap-2">
                            <Upload size={14} />
                            Upload {files.length} file{files.length > 1 ? "s" : ""}
                          </Button>
                        </div>
                      }
                    </TabsContent>

                    <TabsContent value="memory" className="space-y-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Memory Key</label>
                        <Input value={memoryKey} onChange={(e) => setMemoryKey(e.target.value)} placeholder="e.g. user-preference-language" className="bg-card border-border" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Memory Content</label>
                        <Textarea
                          value={memoryText}
                          onChange={(e) => setMemoryText(e.target.value)}
                          placeholder="Enter memory content..."
                          rows={6}
                          className="bg-card border-border resize-none" />
                        
                      </div>
                      <Button className="gap-2">
                        <Upload size={14} />
                        Save Memory
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              {/* ─── Browse Knowledge Tab ─── */}
              <TabsContent value="browse" className="space-y-6">
                <div className="grid grid-cols-[1fr_1fr_180px_auto] gap-3 mt-[32px]">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Tenant ID</label>
                    <Input value={browseTenantId} onChange={(e) => setBrowseTenantId(e.target.value)} className="bg-card border-border" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Sub-Tenant ID (Optional)</label>
                    <Input value={browseSubTenantId} onChange={(e) => setBrowseSubTenantId(e.target.value)} className="bg-card border-border" />
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

                {loaded &&
                <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{filteredItems.length} items</span>
                      <div className="relative w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        placeholder="Filter by filename..."
                        className="pl-9 h-9 bg-card border-border text-sm" />
                      
                      </div>
                    </div>

                    <div className="space-y-3">
                      {filteredItems.map((item) => {
                      const isExpanded = expandedId === item.id;
                      const showGraph = graphId === item.id;
                      const isPdf = item.contentType.includes("pdf");

                      return (
                        <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden transition-all">
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
                                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setGraphId(showGraph ? null : item.id)}>
                                  <Network size={14} />
                                  {showGraph ? "Hide Graph" : "View Graph"}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  {isExpanded ? "collapse" : "expand"}
                                </Button>
                              </div>
                            </div>

                            {isExpanded &&
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
                          }

                            {showGraph &&
                          <div className="border-t border-border px-5 py-4">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Knowledge Graph</p>
                                <RelationGraph nodes={graphNodes} edges={graphEdges} />
                              </div>
                          }
                          </div>);

                    })}
                    </div>
                  </>
                }
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>);

};

export default Content;