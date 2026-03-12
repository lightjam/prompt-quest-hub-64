import { useState } from "react";
import { Moon, Sun, ExternalLink, Globe, ShieldCheck, Plus, RefreshCw, Lock, Layers, CheckCircle2, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiKey } from "@/context/ApiKeyContext";
import { useNavigate } from "react-router-dom";

const INFRA_COMPONENTS = [
  { name: "Task Scheduler", status: "Provisioned" },
  { name: "Graph Database", status: "Provisioned" },
  { name: "Context Store", status: "Provisioned" },
  { name: "Memory Store", status: "Provisioned" },
];

const Tenants = () => {
  const [isDark, setIsDark] = useState(true);
  const { hasApiKey } = useApiKey();
  const navigate = useNavigate();
  const [newTenantId, setNewTenantId] = useState("");
  const [tenants, setTenants] = useState<string[]>([]);
  const [expandedTenants, setExpandedTenants] = useState<Set<string>>(new Set());

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  useState(() => {
    document.documentElement.classList.add("dark");
  });

  const handleCreateTenant = () => {
    const id = newTenantId.trim();
    if (id && !tenants.includes(id)) {
      setTenants((prev) => [...prev, id]);
      setNewTenantId("");
    }
  };

  const handleCheckStatus = (tenantId: string) => {
    setExpandedTenants((prev) => {
      const next = new Set(prev);
      if (next.has(tenantId)) {
        next.delete(tenantId);
      } else {
        next.add(tenantId);
      }
      return next;
    });
  };

  const handleDeleteTenant = (tenantId: string) => {
    setTenants((prev) => prev.filter((t) => t !== tenantId));
    setExpandedTenants((prev) => {
      const next = new Set(prev);
      next.delete(tenantId);
      return next;
    });
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
          <div className="w-full max-w-5xl space-y-6 animate-fade-in relative">
            <h1 className="text-2xl font-display font-bold text-foreground">Tenants</h1>
            <p className="text-sm text-muted-foreground mt-1 mb-8">Manage isolated knowledge base infrastructure for your tenants.</p>

            {!hasApiKey && (
              <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-md flex items-center justify-center rounded-xl">
                <div className="flex flex-col items-center gap-4 text-center p-10 rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl max-w-sm">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Lock size={20} className="text-muted-foreground" />
                  </div>
                  <h2 className="text-lg font-display font-semibold text-foreground">API Key Required</h2>
                  <p className="text-sm text-muted-foreground">
                    You need to add your API key in API Settings to manage tenants.
                  </p>
                  <Button onClick={() => navigate("/settings")} className="gap-1.5">
                    Go to API Settings
                  </Button>
                </div>
              </div>
            )}

            <div className={!hasApiKey ? "pointer-events-none select-none" : ""}>
              {/* Create Tenant */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-primary" />
                  <h2 className="text-base font-display font-semibold text-foreground">Create Tenant</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Provision a new isolated environment. This runs in the background and takes a few moments.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={newTenantId}
                    onChange={(e) => setNewTenantId(e.target.value)}
                    placeholder="e.g. acme-corp"
                    className="bg-muted/50 border-border"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateTenant()}
                  />
                  <Button className="gap-1.5 shrink-0" onClick={handleCreateTenant}>
                    <Plus size={14} />
                    Create Tenant
                  </Button>
                </div>
              </div>

              {/* Tenant List */}
              {tenants.length > 0 && (
                <div className="mt-6 rounded-xl border border-border bg-card p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-primary" />
                    <h2 className="text-base font-display font-semibold text-foreground">Your Tenants</h2>
                  </div>
                  <div className="space-y-2">
                    {tenants.map((tenantId) => (
                      <div
                        key={tenantId}
                        className="rounded-lg border border-border bg-muted/30 overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-sm font-medium text-foreground">{tenantId}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => handleCheckStatus(tenantId)}
                            >
                              <RefreshCw size={14} />
                              Check Status
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteTenant(tenantId)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>

                        {expandedTenants.has(tenantId) && (
                          <div className="border-t border-border px-4 py-4 space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Layers size={18} className="text-muted-foreground" />
                                <h3 className="text-sm font-display font-semibold text-foreground">Infrastructure Details</h3>
                              </div>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                <CheckCircle2 size={12} />
                                Ready
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {INFRA_COMPONENTS.map((comp) => (
                                <div
                                  key={comp.name}
                                  className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1"
                                >
                                  <p className="text-sm font-semibold text-foreground">{comp.name}</p>
                                  <p className="flex items-center gap-1.5 text-xs text-primary">
                                    <CheckCircle2 size={12} />
                                    {comp.status}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tenants;
