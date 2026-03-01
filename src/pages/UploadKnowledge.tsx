import { useState, useRef } from "react";
import { Moon, Sun, ExternalLink, Upload, FileText, X, AlertTriangle, CloudUpload } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const UploadKnowledge = () => {
  const [isDark, setIsDark] = useState(true);
  const [tenantId, setTenantId] = useState("cortexai-workbench");
  const [subTenantId, setSubTenantId] = useState("workbench-st-1");
  const [tab, setTab] = useState("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [memoryText, setMemoryText] = useState("");
  const [memoryKey, setMemoryKey] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
          <div className="w-full max-w-4xl space-y-6 animate-fade-in">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">Upload Knowledge</h1>

          {/* Tenant fields */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tenant ID</label>
              <Input value={tenantId} onChange={(e) => setTenantId(e.target.value)} className="bg-card border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sub-Tenant ID (Optional)</label>
              <Input value={subTenantId} onChange={(e) => setSubTenantId(e.target.value)} className="bg-card border-border" />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={tab} onValueChange={setTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="upload">Upload Knowledge</TabsTrigger>
              <TabsTrigger value="memory">Add Memory</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              {/* API notice */}
              <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">
                  You need to add your own API key to upload new knowledge. Please visit{" "}
                  <a href="https://usecortex.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    usecortex.ai
                  </a>{" "}
                  to get your API keys.
                </p>
              </div>

              {/* Help link */}
              <div className="flex justify-end">
                <a href="/upload-docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <ExternalLink size={12} />
                  API Reference: Upload Knowledge
                </a>
              </div>

              {/* Drag & drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40 bg-card/50"
                }`}
              >
                <CloudUpload size={36} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag & drop files here, or click to browse</p>
                <Button variant="outline" size="sm" className="mt-1">Choose Files</Button>
                <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => {
                  if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                }} />
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((f, i) => (
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
                  ))}
                  <Button className="w-full mt-2 gap-2">
                    <Upload size={14} />
                    Upload {files.length} file{files.length > 1 ? "s" : ""}
                  </Button>
                </div>
              )}
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
                  className="bg-card border-border resize-none"
                />
              </div>
              <Button className="gap-2">
                <Upload size={14} />
                Save Memory
              </Button>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadKnowledge;
