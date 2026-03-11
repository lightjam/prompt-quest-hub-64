import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";

const UploadDocs = () => {
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
        <div className="absolute top-4 right-4">
          <button onClick={toggleTheme} className="p-2 rounded-lg border border-border bg-surface-elevated text-foreground hover:bg-muted transition-colors">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="p-8 pt-6 max-w-3xl">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Upload Knowledge — API Reference</h1>
          <p className="text-sm text-muted-foreground mb-8">Learn how to programmatically upload documents and memories to your HydraDB knowledge base.</p>

          <div className="space-y-8">
            {/* Endpoint */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-foreground">Endpoint</h2>
              <code className="block bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground">
                POST https://api.usehydradb.ai/v1/knowledge/upload
              </code>
            </section>

            {/* Headers */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-foreground">Headers</h2>
              <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium">Header</th>
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-b border-border">
                      <td className="px-4 py-2 text-foreground">Authorization</td>
                      <td className="px-4 py-2 text-muted-foreground">Bearer &lt;API_KEY&gt;</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-foreground">Content-Type</td>
                      <td className="px-4 py-2 text-muted-foreground">multipart/form-data</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Body params */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-foreground">Body Parameters</h2>
              <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium">Parameter</th>
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium">Type</th>
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-b border-border">
                      <td className="px-4 py-2 text-foreground">file</td>
                      <td className="px-4 py-2 text-muted-foreground">File</td>
                      <td className="px-4 py-2 text-muted-foreground font-sans">The file to upload (PDF, MD, TXT)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2 text-foreground">tenant_id</td>
                      <td className="px-4 py-2 text-muted-foreground">string</td>
                      <td className="px-4 py-2 text-muted-foreground font-sans">Your tenant identifier</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2 text-foreground">sub_tenant_id</td>
                      <td className="px-4 py-2 text-muted-foreground">string?</td>
                      <td className="px-4 py-2 text-muted-foreground font-sans">Optional sub-tenant scope</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-foreground">upsert</td>
                      <td className="px-4 py-2 text-muted-foreground">boolean</td>
                      <td className="px-4 py-2 text-muted-foreground font-sans">Replace existing document if true</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Example */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-foreground">Example (cURL)</h2>
              <pre className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`curl -X POST https://api.usehydradb.ai/v1/knowledge/upload \\
  -H "Authorization: Bearer sk-hydradb-xxx" \\
  -F "file=@document.pdf" \\
  -F "tenant_id=acme-corp" \\
  -F "sub_tenant_id=team-alpha" \\
  -F "upsert=true"`}
              </pre>
            </section>

            {/* Response */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-foreground">Response</h2>
              <pre className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`{
  "status": "queued",
  "file_id": "b509e244-0d2a-4970-a0f9-2f23fd6aeae7",
  "filename": "document.pdf",
  "message": "File accepted and queued for processing."
}`}
              </pre>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocs;
