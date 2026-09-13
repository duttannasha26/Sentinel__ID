import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { FolderClock, ChevronRight } from "lucide-react";

const decisionStyles = {
  approved: "bg-emerald-50 text-emerald-700",
  manual_review: "bg-amber-50 text-amber-700",
  rejected: "bg-rose-50 text-rose-700",
  pending: "bg-slate-100 text-slate-500",
};

export default function Cases() {
  const [cases, setCases] = useState(null);

  useEffect(() => {
    base44.entities.Case.list("-created_date", 100).then(setCases);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#0f766e]/10 flex items-center justify-center">
          <FolderClock className="w-5 h-5 text-[#0f766e]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Case History</h1>
          <p className="text-sm text-slate-400">All document verification cases.</p>
        </div>
      </div>

      {cases === null ? (
        <p className="text-sm text-slate-400">Loading cases...</p>
      ) : cases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
          No cases yet. Start a new verification to see it here.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {cases.map((c) => (
            <Link key={c.id} to={`/cases/${c.id}`} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <Image src={c.document_image_url} alt="" className="w-12 h-12" fittingType="fill" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 capitalize">{c.document_type.replace("_", " ")}</p>
                <p className="text-xs text-slate-400">{new Date(c.created_date).toLocaleString()}</p>
              </div>
              <div className="text-sm font-semibold text-slate-700">{c.judge_score ?? "—"}</div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${decisionStyles[c.decision]}`}>
                {c.decision.replace("_", " ")}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}