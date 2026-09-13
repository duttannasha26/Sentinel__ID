import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import DocumentCapture from "@/components/newcase/DocumentCapture";
import FaceCapture from "@/components/newcase/FaceCapture";
import AnalysisResults from "@/components/newcase/AnalysisResults";

const DOC_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "visa", label: "Visa" },
  { value: "national_id", label: "National ID" },
  { value: "driving_license", label: "Driving License" },
  { value: "permit", label: "Permit" },
];

export default function NewCase() {
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState("passport");
  const [documentImageUrl, setDocumentImageUrl] = useState(null);
  const [liveFaceUrl, setLiveFaceUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [caseData, setCaseData] = useState(null);

  const runVerification = async () => {
    setAnalyzing(true);
    const [docRes, faceRes] = await Promise.all([
      base44.functions.invoke("analyzeDocument", { document_image_url: documentImageUrl, document_type: documentType }),
      base44.functions.invoke("matchFaces", { document_image_url: documentImageUrl, live_face_image_url: liveFaceUrl }),
    ]);
    const doc = docRes.data;
    const face = faceRes.data;
    const judge_score = Math.round((100 - doc.tamper_score) * 0.5 + face.face_match_score * 0.5);

    const created = await base44.entities.Case.create({
      document_type: documentType,
      document_image_url: documentImageUrl,
      live_face_image_url: liveFaceUrl,
      extracted_fields: doc.extracted_fields,
      tamper_score: doc.tamper_score,
      tamper_findings: doc.tamper_findings,
      tamper_summary: doc.tamper_summary,
      face_match_score: face.face_match_score,
      face_match_summary: face.face_match_summary,
      judge_score,
      status: "analyzed",
    });

    setCaseData(created);
    setAnalyzing(false);
  };

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

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#0f766e]/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-[#0f766e]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">New Verification</h1>
          <p className="text-sm text-slate-400">Capture, analyze, and decide on a document case.</p>
        </div>
      </div>

      {!caseData ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-8">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Document Type</label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="w-full sm:w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Document Photo</label>
            <DocumentCapture value={documentImageUrl} onChange={setDocumentImageUrl} />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Live Face Verification</label>
            <FaceCapture value={liveFaceUrl} onChange={setLiveFaceUrl} />
          </div>

          <Button
            onClick={runVerification}
            disabled={!documentImageUrl || !liveFaceUrl || analyzing}
            className="w-full gap-2 bg-[#1e3a5f] hover:bg-[#152b47] h-11"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {analyzing ? "Analyzing document & face..." : "Run Verification"}
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <AnalysisResults
            caseData={caseData}
            decided={caseData.status === "decided"}
            onDecide={handleDecide}
          />
          {caseData.status === "decided" && (
            <Button variant="ghost" className="mt-4" onClick={() => navigate("/cases")}>
              Back to Case History
            </Button>
          )}
        </div>
      )}
    </div>
  );
}