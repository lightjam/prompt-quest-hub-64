import { useState } from "react";
import { Moon, Sun, Eye, EyeOff, Save, RotateCcw, Key, ExternalLink } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ApiSettings = () => {
  const [isDark, setIsDark] = useState(true);
  const [apiKey, setApiKey] = useState("sk-cortex-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

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
        </div>

        <div className="p-8 pt-6 max-w-3xl">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">API Settings</h1>

          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Key size={18} className="text-primary" />
              <h2 className="text-base font-display font-semibold text-foreground">Cortex API Credentials</h2>
            </div>

            <p className="text-sm text-muted-foreground">
              To use your own custom knowledge base, you must log into{" "}
              <a href="https://usecortex.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                usecortex.ai
              </a>{" "}
              to get your API Key.
            </p>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">API Key</label>
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setSaved(false); }}
                  className="bg-muted/50 border-border pr-10 font-mono text-sm"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="gap-1.5"
                onClick={() => setSaved(true)}
              >
                <Save size={14} />
                Save
              </Button>
              <Button
                variant="destructive"
                className="gap-1.5"
                onClick={() => { setApiKey(""); setSaved(false); }}
              >
                <RotateCcw size={14} />
                Reset
              </Button>
            </div>

            {saved && (
              <div className="text-sm text-primary bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5">
                ✓ API key saved successfully.
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="mt-6 rounded-xl border border-border bg-card p-6 space-y-3">
            <h3 className="text-sm font-display font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <a href="https://usecortex.ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink size={13} /> Cortex Dashboard
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink size={13} /> API Documentation
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink size={13} /> Usage & Billing
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSettings;
