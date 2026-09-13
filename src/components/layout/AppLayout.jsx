import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, ScanFace, FolderClock, Images, Wifi, WifiOff, HardDrive } from "lucide-react";
import { useOfflineManager } from "@/lib/offlineManager";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new-case", label: "New Verification", icon: ScanFace },
  { to: "/cases", label: "Case History", icon: FolderClock },
  { to: "/synthetic-documents", label: "Reference Library", icon: Images },
];

export default function AppLayout() {
  const location = useLocation();
  const { isOnline, forceOffline, effectiveOffline, toggleForceOffline } = useOfflineManager();

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col md:flex-row">
      <aside className="md:w-64 w-full bg-white border-b md:border-b-0 md:border-r border-slate-200 md:min-h-screen flex md:flex-col justify-between">
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#0f766e] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 leading-tight tracking-tight">Sentinel ID</p>
                <p className="text-[11px] text-slate-400 leading-tight">Document Verification</p>
              </div>
            </div>
          </div>

          <nav className="flex md:flex-col flex-row overflow-x-auto md:overflow-visible px-2 md:px-3 py-2 md:py-4 gap-1">
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
        </div>

        {/* Offline Status Footer Badge & Toggle */}
        <div className="p-4 border-t border-slate-100 hidden md:block">
          <div
            className={`p-3 rounded-xl border text-xs flex flex-col gap-2 ${
              effectiveOffline
                ? "bg-amber-50/80 border-amber-200 text-amber-900"
                : "bg-emerald-50/80 border-emerald-200 text-emerald-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                {effectiveOffline ? (
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                )}
                {effectiveOffline ? "Offline Mode Active" : "Online Mode"}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  effectiveOffline ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                }`}
              />
            </div>

            <p className="text-[11px] opacity-80 leading-relaxed">
              {effectiveOffline
                ? "Operating locally. Cases and biometrics persist to browser storage."
                : "Connected to verification services and cloud database."}
            </p>

            <button
              type="button"
              onClick={toggleForceOffline}
              className={`mt-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-all ${
                effectiveOffline
                  ? "bg-amber-200/80 hover:bg-amber-300/80 text-amber-900"
                  : "bg-emerald-200/80 hover:bg-emerald-300/80 text-emerald-900"
              }`}
            >
              <HardDrive className="w-3 h-3" />
              {forceOffline ? "Disable Simulated Offline" : "Enable Simulated Offline"}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}