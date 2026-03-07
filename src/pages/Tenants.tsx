import { useState } from "react";
import { Moon, Sun, ExternalLink, Globe, ShieldCheck, Plus, RefreshCw, Lock } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiKey } from "@/context/ApiKeyContext";
import { useNavigate } from "react-router-dom";

const Tenants = () => {
  const [isDark, setIsDark] = useState(true);
  const { hasApiKey } = useApiKey();
  const navigate = useNavigate();
  const [newTenantId, setNewTenantId] = useState("");
  const [verifyTenantId, setVerifyTenantId] = useState("");
  const [created, setCreated] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  useState(() => {
    document.documentElement.classList.add("dark");
  });

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
          <h1 className="text-2xl font-display font-bold text-foreground">Tenants</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-8">Manage isolated knowledge base infrastructure for your tenants.</p>

          {!hasApiKey ? (
            <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Lock size={20} className="text-muted-foreground" />
              </div>
              <h2 className="text-lg font-display font-semibold text-foreground">API Key Required</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                You need to add your API key in API Settings to manage tenants.
              </p>
              <Button onClick={() => navigate("/settings")} className="gap-1.5">
                Go to API Settings
              </Button>
            </div>
          ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                />
                <Button
                  className="gap-1.5 shrink-0"
                  onClick={() => {
                    if (newTenantId.trim()) {
                      setCreated(newTenantId.trim());
                      setNewTenantId("");
                    }
                  }}
                >
                  <Plus size={14} />
                  Create Tenant
                </Button>
              </div>
              {created && (
                <div className="text-sm text-primary bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5">
                  ✓ Tenant "<span className="font-medium">{created}</span>" is being provisioned. This may take a few minutes.
                </div>
              )}
            </div>

            {/* Verify Status */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                <h2 className="text-base font-display font-semibold text-foreground">Verify Status</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Check the deployment status of a tenant's infrastructure components.
              </p>
              <div className="flex gap-2">
                <Input
                  value={verifyTenantId}
                  onChange={(e) => setVerifyTenantId(e.target.value)}
                  placeholder="tenant-id"
                  className="bg-muted/50 border-border"
                />
                <Button
                  variant="outline"
                  className="gap-1.5 shrink-0"
                  onClick={() => {
                    if (verifyTenantId.trim()) {
                      setStatus("active");
                    }
                  }}
                >
                  <RefreshCw size={14} />
                  Check Status
                </Button>
              </div>
              {status && (
                <div className="flex items-center gap-2 text-sm bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-4 py-2.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Tenant "<span className="font-medium">{verifyTenantId}</span>" is <span className="font-semibold">active</span>. All infrastructure components are operational.
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tenants;
