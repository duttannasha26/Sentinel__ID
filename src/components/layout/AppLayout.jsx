import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, ScanFace, FolderClock, Images } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new-case", label: "New Verification", icon: ScanFace },
  { to: "/cases", label: "Case History", icon: FolderClock },
  { to: "/synthetic-documents", label: "Reference Library", icon: Images },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col md:flex-row">
      <aside className="md:w-64 w-full bg-white border-b md:border-b-0 md:border-r border-slate-200 md:min-h-screen flex md:flex-col">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100 md:border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#0f766e] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-tight tracking-tight">Sentinel ID</p>
            <p className="text-[11px] text-slate-400 leading-tight">Document Verification</p>
          </div>
        </div>
        <nav className="flex md:flex-col flex-row overflow-x-auto md:overflow-visible px-2 md:px-3 py-2 md:py-4 gap-1 flex-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-[#0f766e]/10 text-[#0f766e]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}