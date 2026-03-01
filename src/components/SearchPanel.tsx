import { useState } from "react";
import { Search, Send, ArrowUp } from "lucide-react";
import { SearchFilters } from "./SearchFilters";
import { ExamplePrompts } from "./ExamplePrompts";
import { SearchResults } from "./SearchResults";

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const [tenantId, setTenantId] = useState("cortexai-workbench");
  const [subTenantId, setSubTenantId] = useState("workbench-st-1");
  const [hasSearched, setHasSearched] = useState(false);

  const handleExampleClick = (prompt: string) => {
    setQuery(prompt);
    setHasSearched(true);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setHasSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12 min-h-screen">
      <div className={`w-full max-w-3xl space-y-8 animate-fade-in transition-all duration-500 ${hasSearched ? "pt-4" : "pt-[15vh]"}`}>
        {/* Header */}
        {!hasSearched && (
          <div className="text-center space-y-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
              Search your knowledge
            </h1>
            <p className="text-muted-foreground text-lg">
              Give your AI the best context, high quality structure, and the complete picture it needs
            </p>
          </div>
        )}

        {/* Tenant IDs - compact row */}
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tenant ID
            </label>
            <input
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground placeholder:text-search-placeholder focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sub-Tenant ID
              <span className="ml-1 text-muted-foreground/60 normal-case tracking-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={subTenantId}
              onChange={(e) => setSubTenantId(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground placeholder:text-search-placeholder focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            />
          </div>
        </div>

        {/* Main Search Area */}
        <div className="search-glow rounded-2xl bg-search-bg overflow-hidden">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search your knowledge base..."
            rows={hasSearched ? 2 : 3}
            className="w-full resize-none bg-transparent px-5 pt-5 pb-2 text-foreground placeholder:text-search-placeholder focus:outline-none text-base"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <SearchFilters />
            <button
              onClick={handleSearch}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
              disabled={!query.trim()}
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        {/* Example Prompts or Results */}
        {hasSearched ? (
          <SearchResults />
        ) : (
          <ExamplePrompts onSelect={handleExampleClick} />
        )}
      </div>
    </div>
  );
}
