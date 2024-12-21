import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Receipt, 
  ArrowUpRight,
  Sparkles,
  Users, 
  Settings
} from "lucide-react";

const navigation = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bill Pay', href: '/bill-pay', icon: Receipt },
  { name: 'Receivables', href: '/receivables', icon: ArrowUpRight },
  { name: 'WonderPay Capital', href: '/capital', icon: Sparkles },
  { name: 'Clients & Vendors', href: '/clients', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col backdrop-blur-md bg-white/50">
      <div className="p-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-3 h-3 bg-blue-500 rounded-sm" />
          <span className="font-medium text-gray-900 font-inter">Wonderland Studio</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-black/5 font-inter",
                  isActive && "bg-gray-100/50 backdrop-blur-sm text-gray-900 font-medium"
                )}
              >
                <Icon className="h-[18px] w-[18px] stroke-[1.5px]" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;