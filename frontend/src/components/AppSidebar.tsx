import { Home, FolderOpen, Users, Target, FileText, Bot, BarChart3, Bell, Settings, HelpCircle } from "lucide-react";
import { NavItems } from "@/components/ui/nav";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Resources",
    url: "/candidates",
    icon: Users,
  },
  {
    title: "Allocation",
    url: "/allocation",
    icon: Target,
  },
  {
    title: "AI Assistant",
    url: "/chatbot",
    icon: Bot,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
];

const systemNavItems = [
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "FAQ",
    url: "/faq",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-gray-800 text-white z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">OPT-MAP</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4">
        <NavItems items={mainNavItems} />
      </div>

      {/* System Section */}
      <div className="border-t border-gray-700 p-4">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">System</div>
        <NavItems items={systemNavItems} />
      </div>
    </div>
  );
}
