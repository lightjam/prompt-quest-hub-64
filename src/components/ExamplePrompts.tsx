

const examples = [
  "What is overall accuracy of cortex",
  "What is context rot",
  "What is self-attention and how is it related to noam shazeer",
  "Explain transformer architecture",
];

export function ExamplePrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {examples.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="group flex items-center gap-1.5 px-4 py-2 rounded-xl border border-chip-border bg-chip text-sm text-muted-foreground hover:bg-chip-hover hover:text-foreground hover:border-primary/30 transition-all duration-200"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
