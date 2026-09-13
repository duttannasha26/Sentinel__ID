import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertTriangle, XCircle, Download, Loader2 } from "lucide-react";
import { downloadCaseReport } from "@/lib/reportGenerator";

function RoundGaugeCard({ label, score, invert, statusText }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score ?? 0)));
  const good = invert ? safeScore < 30 : safeScore > 70;
  const warn = invert ? safeScore >= 30 && safeScore <= 60 : safeScore >= 40 && safeScore <= 70;

  const strokeColor = good ? "#10b981" : warn ? "#f59e0b" : "#f43f5e";
  const cardBg = good
    ? "bg-emerald-50/70 border-emerald-200/80 shadow-emerald-500/5"
    : warn
    ? "bg-amber-50/70 border-amber-200/80 shadow-amber-500/5"
    : "bg-rose-50/70 border-rose-200/80 shadow-rose-500/5";

  const textColor = good ? "text-emerald-700" : warn ? "text-amber-700" : "text-rose-700";

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center p-4 rounded-2xl border ${cardBg} shadow-sm transition-all hover:scale-[1.02]`}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</p>

      {/* Round Dashboard Gauge */}
      <div className="relative w-28 h-28 flex items-center justify-center my-1">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-200/80"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated Gauge Ring */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>

        {/* Center Percentage Value */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-2xl font-extrabold ${textColor}`}>{safeScore}</span>
          <span className="text-[10px] font-semibold text-slate-400">/ 100</span>
        </div>
      </div>

      <p className={`mt-2 text-xs font-semibold text-center leading-tight ${textColor}`}>
        {statusText}
      </p>
    </div>
  );
}

export default function AnalysisResults({ caseData, onDecide, decided }) {
  const [notes, setNotes] = useState(caseData.officer_notes || "");
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      await downloadCaseReport(caseData);
    } finally {
      setDownloading(false);
    }
  };

  const submit = async (decision) => {
    setSubmitting(true);
    await onDecide(decision, notes);
    setSubmitting(false);
  };

  const tamperScore = caseData.tamper_score ?? 0;
  const faceScore = caseData.face_match_score ?? 0;
  const judgeScore = caseData.judge_score ?? 0;

  const tamperStatus = tamperScore < 30 ? "Clean Substrate" : tamperScore <= 60 ? "Moderate Anomaly" : "High Tamper Risk";
  const faceStatus = faceScore > 70 ? "Biometric Match Confirmed" : faceScore >= 40 ? "Partial Match" : "Biometric Mismatch";
  const judgeStatus = judgeScore > 70 ? "High Verification Trust" : judgeScore >= 40 ? "Moderate Trust" : "High Risk Flagged";

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

      {/* Round Dashboard Score Gauges */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Verification Dashboard Metrics</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RoundGaugeCard
            label="Tamper Risk Score"
            score={tamperScore}
            invert={true}
            statusText={tamperStatus}
          />
          <RoundGaugeCard
            label="Face Match Score"
            score={faceScore}
            invert={false}
            statusText={faceStatus}
          />
          <RoundGaugeCard
            label="Overall Judge Score"
            score={judgeScore}
            invert={false}
            statusText={judgeStatus}
          />
        </div>
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
          <Button variant="outline" disabled={downloading} onClick={handleDownloadReport} className="gap-2">
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? "Generating Report..." : "Download Report"}
          </Button>
        </div>
      )}
    </div>
  );
}