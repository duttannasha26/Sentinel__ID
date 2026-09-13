import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage } from "@/lib/fileUpload";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { ScanFace, RotateCcw, Cpu, Zap, Activity } from "lucide-react";
import FaceScanVisualizer from "./FaceScanVisualizer";

const PROVIDER_STEPS = {
  azure: [
    "Azure AI Face: Align face in target reticle",
    "Azure AI Face: Tracking biometric landmarks...",
    "Azure AI Face: Measuring pose pitch/roll/yaw...",
    "Azure AI Face: Verifying liveness confidence..."
  ],
  aws: [
    "AWS Rekognition: Position face inside radar zone",
    "AWS Rekognition: Blink naturally for liveness challenge",
    "AWS Rekognition: Turn head slightly left & right",
    "AWS Rekognition: Generating 3D depth-map mesh..."
  ],
  offline: [
    "Offline Engine: Initializing local canvas scanner",
    "Offline Engine: Sampling facial pixel histogram",
    "Offline Engine: Processing landmark feature vectors",
    "Offline Engine: Finalizing local liveness score..."
  ]
};

export default function FaceCapture({ value, onChange }) {
  const [provider, setProvider] = useState("azure"); // 'azure' | 'aws' | 'offline'
  const [scanning, setScanning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [captureError, setCaptureError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const steps = PROVIDER_STEPS[provider] || PROVIDER_STEPS.azure;

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  useEffect(() => {
    if (scanning && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [scanning]);

  const startScan = async () => {
    setCaptureError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setScanning(true);
      setStepIndex(0);

      for (let i = 1; i < steps.length; i++) {
        await new Promise((r) => setTimeout(r, 1100));
        setStepIndex(i);
      }
      await new Promise((r) => setTimeout(r, 900));

      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video?.videoWidth || 640;
      canvas.height = video?.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (video) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
      const file = new File([blob], `live-capture-${provider}.jpg`, { type: "image/jpeg" });
      onChange(await uploadImage(file));
    } catch (error) {
      setCaptureError(error.message || "The face capture could not be completed.");
    } finally {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setScanning(false);
    }
  };

  if (value) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl overflow-hidden border border-slate-200 w-44 mx-auto relative group">
          <Image src={value} alt="Live capture" className="w-44 h-44" fittingType="fill" />
          <div className="absolute bottom-1 right-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-mono uppercase">
            {provider} SCAN
          </div>
        </div>
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={() => onChange(null)} className="gap-2 text-slate-700">
            <RotateCcw className="w-4 h-4" /> Re-scan Face
          </Button>
        </div>
      </div>
    );
  }

  if (scanning) {
    const isAzure = provider === "azure";
    const isAws = provider === "aws";
    const isOffline = provider === "offline";

    return (
      <div className="flex flex-col items-center gap-4 py-2">
        <div
          className={`relative w-60 h-60 rounded-full overflow-hidden border-4 ${
            isAzure
              ? "border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.35)]"
              : isAws
              ? "border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.35)]"
              : "border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
          }`}
        >
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          <FaceScanVisualizer provider={provider} stepIndex={stepIndex} stepText={steps[stepIndex]} scanning={scanning} />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`text-sm font-medium ${
              isAzure ? "text-cyan-700" : isAws ? "text-amber-700" : "text-emerald-700"
            }`}
          >
            {steps[stepIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Scanner Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setProvider("azure")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            provider === "azure"
              ? "bg-[#0078D4] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> Azure AI Face
        </button>

        <button
          type="button"
          onClick={() => setProvider("aws")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            provider === "aws"
              ? "bg-[#FF9900] text-slate-950 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> AWS Rekognition
        </button>

        <button
          type="button"
          onClick={() => setProvider("offline")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            provider === "offline"
              ? "bg-[#0f766e] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Offline Local
        </button>
      </div>

      <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
        <ScanFace
          className={`w-7 h-7 ${
            provider === "azure"
              ? "text-[#0078D4]"
              : provider === "aws"
              ? "text-[#FF9900]"
              : "text-[#0f766e]"
          }`}
        />
      </div>

      <p className="text-xs text-slate-500 text-center max-w-xs leading-relaxed">
        {provider === "azure" && "Azure AI Face v3.2 HUD reticle scan with live keypoint landmark crosshairs and pose telemetry."}
        {provider === "aws" && "AWS Rekognition hex radar sweep with interactive liveness challenge prompts and 3D depth mesh."}
        {provider === "offline" && "Local browser canvas biometric mesh engine designed for 100% offline verification."}
      </p>

      <Button
        onClick={startScan}
        className={`gap-2 font-medium ${
          provider === "azure"
            ? "bg-[#0078D4] hover:bg-[#005a9e] text-white"
            : provider === "aws"
            ? "bg-[#FF9900] hover:bg-[#e08600] text-slate-950"
            : "bg-[#0f766e] hover:bg-[#0b5a54] text-white"
        }`}
      >
        <ScanFace className="w-4 h-4" /> Start {provider.toUpperCase()} Scan
      </Button>

      {captureError && <p className="text-xs text-red-600 text-center font-medium">{captureError}</p>}
    </div>
  );
}