import React, { useState } from "react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertTriangle, XCircle, Download } from "lucide-react";
import { downloadCaseReport } from "@/lib/reportGenerator";

function ScoreBadge({ label, score, invert }) {
  const good = invert ? score < 30 : score > 70;
  const warn = invert ? score >= 30 && score <= 60 : score >= 40 && score <= 70;
  const color = good ? "text-emerald-600 bg-emerald-50" : warn ? "text-amber-600 bg-amber-50" : "text-rose-600 bg-rose-50";
  return (
    <div className={`rounded-xl px-4 py-3 ${color}`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="text-2xl font-semibold">{Math.round(score)}</p>
    </div>
  );
}

export default function AnalysisResults({ caseData, onDecide, decided }) {
  const [notes, setNotes] = useState(caseData.officer_notes || "");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (decision) => {
    setSubmitting(true);
    await onDecide(decision, notes);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">Document — flagged regions</p>
          <div className="relative rounded-2xl overflow-hidden border border-slate-200">
            <Image src={caseData.document_image_url} alt="Document" className="w-full h-64" fittingType="fill" />
            {(caseData.tamper_findings || []).map((f, i) => (
              <div
                key={i}
                title={f.label}
                className="absolute rounded-full border-2 border-red-500 shadow-[0_0_0_2px_rgba(255,255,255,0.6)]"
                style={{
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  width: `${f.radius * 2}%`,
                  height: `${f.radius * 2}%`,
                  transform: "translate(-50%, -50%)"
                }}
              />
            ))}
          </div>
          {caseData.tamper_findings?.length > 0 && (
            <ul className="mt-2 text-xs text-slate-500 space-y-1">
              {caseData.tamper_findings.map((f, i) => <li key={i}>• {f.label}</li>)}
            </ul>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">Live face capture</p>
          <div className="rounded-2xl overflow-hidden border border-slate-200 w-40 h-40">
            <Image src={caseData.live_face_image_url} alt="Live face" className="w-40 h-40" fittingType="fill" />
          </div>
        </div>
      </div>

      {caseData.strictness && (
        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-100 rounded-lg px-3 py-1.5">
          <span>Verification Sensitivity: <strong className="capitalize text-slate-700">{caseData.strictness}</strong> mode</span>
          {caseData.face_match_score === 0 && (
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Biometric Mismatch (0 Score)
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <ScoreBadge label="Tamper Risk" score={caseData.tamper_score} invert />
        <ScoreBadge label="Face Match" score={caseData.face_match_score} />
        <ScoreBadge label="Judge Score" score={caseData.judge_score} />
      </div>

      {caseData.face_match_score === 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-900">Biometric Verification Alert (0 Match Score)</p>
            <p className="mt-0.5">The live facial scan does not match the photo on the identity document under the selected verification strictness. Manual inspection is strongly advised before decision.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="font-medium text-slate-800 mb-1">Tamper Analysis</p>
          <p>{caseData.tamper_summary}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="font-medium text-slate-800 mb-1">Face Match Analysis</p>
          <p>{caseData.face_match_summary}</p>
        </div>
      </div>

      {caseData.extracted_fields && Object.keys(caseData.extracted_fields).length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="font-medium text-slate-800 mb-2 text-sm">Extracted Fields</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-slate-600">
            {Object.entries(caseData.extracted_fields).map(([k, v]) => (
              <div key={k}><span className="text-slate-400 capitalize">{k.replace(/_/g, " ")}:</span> {String(v)}</div>
            ))}
          </div>
        </div>
      )}

      {!decided ? (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-700">Officer Decision</p>
          <Textarea
            placeholder="Add investigation notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
          />
          <div className="flex flex-wrap gap-2">
            <Button disabled={submitting} onClick={() => submit("approved")} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Approve
            </Button>
            <Button disabled={submitting} onClick={() => submit("manual_review")} className="gap-2 bg-amber-500 hover:bg-amber-600">
              <AlertTriangle className="w-4 h-4" /> Manual Review
            </Button>
            <Button disabled={submitting} onClick={() => submit("rejected")} variant="destructive" className="gap-2">
              <XCircle className="w-4 h-4" /> Reject
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Decision recorded: <span className="font-semibold capitalize">{caseData.decision.replace("_", " ")}</span>
          </p>
          <Button variant="outline" onClick={() => downloadCaseReport(caseData)} className="gap-2">
            <Download className="w-4 h-4" /> Download Report
          </Button>
        </div>
      )}
    </div>
  );
}