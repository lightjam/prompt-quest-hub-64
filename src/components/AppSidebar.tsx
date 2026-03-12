import { BarChart3, BookOpen, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import hydraLogo from "@/assets/hydradb-logo.png";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const items: SidebarItem[] = [
  { icon: BarChart3, label: "Comparison", path: "/comparison" },
  { icon: BookOpen, label: "Context", path: "/content" },
  { icon: Users, label: "Tenants", path: "/tenants" },
  { icon: Settings, label: "API Settings", path: "/settings" },
];

export function AppSidebar() {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const expanded = hovered;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out h-screen sticky top-0 overflow-hidden",
        expanded ? "w-60" : "w-16"
      )}
    >
      <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border overflow-hidden whitespace-nowrap">
        <img src={hydraLogo} alt="HydraDB" className="w-8 h-8 shrink-0" />
        {expanded && (
          <span className="font-display font-bold text-sidebar-primary-foreground text-base tracking-tight">
            HydraDB Workbench
          </span>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap overflow-hidden",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {expanded && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
