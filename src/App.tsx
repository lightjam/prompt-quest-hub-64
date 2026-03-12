import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApiKeyProvider } from "@/context/ApiKeyContext";
import Index from "./pages/Index";
import Comparison from "./pages/Comparison";
import Content from "./pages/Content";
import Tenants from "./pages/Tenants";
import ApiSettings from "./pages/ApiSettings";
import UploadDocs from "./pages/UploadDocs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ApiKeyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Comparison />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/content" element={<Content />} />
            <Route path="/browse" element={<Content />} />
            <Route path="/upload" element={<Content />} />
            <Route path="/upload-docs" element={<UploadDocs />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/settings" element={<ApiSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ApiKeyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
