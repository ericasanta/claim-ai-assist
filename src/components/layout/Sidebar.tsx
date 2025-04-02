
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  ClipboardCheck,
  MessageSquare,
  FileImage,
  CircleDollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Claims",
    href: "/claims",
    icon: ClipboardCheck,
  },
  {
    title: "AI Analysis",
    href: "/analysis",
    icon: FileImage,
  },
  {
    title: "Estimates",
    href: "/estimates",
    icon: CircleDollarSign,
  },
  {
    title: "Virtual Assistant",
    href: "/assistant",
    icon: MessageSquare,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Policies",
    href: "/policies",
    icon: FileText,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 gap-1">
            {NavItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button variant="secondary" className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask AI Assistant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
