import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ScanFace, ArrowRight } from "lucide-react";

export default function Home() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    base44.entities.Case.list("-created_date", 5).then(setCases);
  }, []);

  const counts = cases.reduce((acc, c) => {
    acc[c.decision] = (acc[c.decision] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f766e] rounded-3xl p-8 md:p-10 text-white mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-6 h-6" />
          <span className="text-sm font-medium tracking-wide uppercase opacity-80">Sentinel ID</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight max-w-lg">
          AI-assisted document screening for faster, more consistent border decisions.
        </h1>
        <p className="text-sm md:text-base opacity-80 mt-3 max-w-lg">
          Capture a document and a live face, get an AI tamper analysis and face-match score, and record an officer decision — all in one workspace.
        </p>
        <Link to="/new-case">
          <Button className="mt-6 bg-white text-[#1e3a5f] hover:bg-white/90 gap-2">
            <ScanFace className="w-4 h-4" /> Start New Verification
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Approved", value: counts.approved || 0, color: "text-emerald-600" },
          { label: "Manual Review", value: counts.manual_review || 0, color: "text-amber-600" },
          { label: "Rejected", value: counts.rejected || 0, color: "text-rose-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs text-slate-400">{s.label} (recent)</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-700">Recent Cases</p>
          <Link to="/cases" className="text-sm text-[#0f766e] font-medium inline-flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {cases.length === 0 ? (
          <p className="text-sm text-slate-400">No cases yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {cases.map((c) => (
              <Link key={c.id} to={`/cases/${c.id}`} className="flex items-center justify-between py-3 hover:opacity-70">
                <span className="text-sm text-slate-700 capitalize">{c.document_type.replace("_", " ")}</span>
                <span className="text-xs text-slate-400 capitalize">{c.decision.replace("_", " ")}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}