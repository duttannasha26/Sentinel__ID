import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage } from "@/lib/fileUpload";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { ScanFace, RotateCcw } from "lucide-react";

const STEPS = ["Center your face in the frame", "Blink naturally", "Slowly turn your head", "Analyzing liveness..."];

export default function FaceCapture({ value, onChange }) {
  const [scanning, setScanning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [captureError, setCaptureError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  // Attach the camera stream to the <video> element once it is mounted (scanning === true)
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

      for (let i = 1; i < STEPS.length; i++) {
        await new Promise((r) => setTimeout(r, 1100));
        setStepIndex(i);
      }
      await new Promise((r) => setTimeout(r, 900));

      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
      const file = new File([blob], "live-capture.jpg", { type: "image/jpeg" });
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
        <div className="rounded-2xl overflow-hidden border border-slate-200 w-40 mx-auto">
          <Image src={value} alt="Live capture" className="w-40 h-40" fittingType="fill" />
        </div>
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={() => onChange(null)} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Re-scan
          </Button>
        </div>
      </div>
    );
  }

  if (scanning) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-52 h-52 rounded-full overflow-hidden border-4 border-[#0f766e]/20">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-[#0f766e]"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ borderStyle: "dashed" }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm font-medium text-slate-600"
          >
            {STEPS[stepIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="w-16 h-16 rounded-full bg-[#0f766e]/10 flex items-center justify-center">
        <ScanFace className="w-7 h-7 text-[#0f766e]" />
      </div>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        Start a guided liveness scan using your camera to capture your live face.
      </p>
      <Button onClick={startScan} className="bg-[#0f766e] hover:bg-[#0b5a54] gap-2">
        <ScanFace className="w-4 h-4" /> Start Liveness Scan
      </Button>
      {captureError && <p className="text-sm text-red-600 text-center">{captureError}</p>}
    </div>
  );
}