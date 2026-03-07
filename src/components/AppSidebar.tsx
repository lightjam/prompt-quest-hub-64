import { Search, BarChart3, BookOpen, Upload, Users, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
  requiresApiKey?: boolean;
}

const items: SidebarItem[] = [
  { icon: Search, label: "Search", path: "/" },
  { icon: BarChart3, label: "Comparison", path: "/comparison" },
  { icon: BookOpen, label: "Browse Knowledge", path: "/browse" },
  { icon: Upload, label: "Upload Knowledge", path: "/upload", requiresApiKey: true },
  { icon: Users, label: "Tenants", path: "/tenants", requiresApiKey: true },
  { icon: Settings, label: "API Settings", path: "/settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasApiKey } = useApiKey();

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out h-screen sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border">
        {!collapsed && (
          <span className="font-display font-bold text-sidebar-primary-foreground text-base tracking-tight">
            Cortex Workbench
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
