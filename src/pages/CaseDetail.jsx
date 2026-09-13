import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft } from "lucide-react";
import AnalysisResults from "@/components/newcase/AnalysisResults";

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    base44.entities.Case.get(id).then(setCaseData);
  }, [id]);

  const handleDecide = async (decision, notes) => {
    const updated = await base44.entities.Case.update(caseData.id, {
      decision,
      officer_notes: notes,
      decided_by: (await base44.auth.me()).full_name,
      decided_at: new Date().toISOString(),
      status: "decided",
    });
    setCaseData(updated);
  };

  if (!caseData) return <div className="px-6 py-10 text-sm text-slate-400">Loading case...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/cases" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Case History
      </Link>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <AnalysisResults
          caseData={caseData}
          decided={caseData.status === "decided"}
          onDecide={handleDecide}
        />
      </div>
    </div>
  );
}