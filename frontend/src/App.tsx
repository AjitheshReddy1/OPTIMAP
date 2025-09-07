import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Resources from "./pages/Resources";
import Allocators from "./pages/Allocators";
import AIMatching from "./pages/AIMatching";
import Allocation from "./pages/Allocation";
import Chatbot from "./pages/Chatbot";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen w-full">
            <AppSidebar />
            
            <div className="ml-64 flex-1 flex flex-col bg-gray-50 min-h-screen">
              {/* Main content */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/candidates" element={<Candidates />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/allocators" element={<Allocators />} />
                  <Route path="/ai-matching" element={<AIMatching />} />
            <Route path="/allocation" element={<Allocation />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
