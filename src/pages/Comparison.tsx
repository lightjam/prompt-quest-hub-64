import { useState } from "react";
import { Moon, Sun, ExternalLink } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ComparisonPanel } from "@/components/ComparisonPanel";

const Comparison = () => {
  const [isDark, setIsDark] = useState(true);

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
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border bg-surface-elevated text-foreground hover:bg-muted transition-colors"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href="#"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface-elevated text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink size={14} />
            API Reference
          </a>
        </div>
        <ComparisonPanel />
      </div>
    </div>
  );
};

export default Comparison;
