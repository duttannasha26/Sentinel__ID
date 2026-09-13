import React, { useRef, useState } from "react";
import { uploadImage } from "@/lib/fileUpload";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Upload, Camera, RotateCcw, Loader2 } from "lucide-react";

export default function DocumentCapture({ value, onChange }) {
  const [mode, setMode] = useState("choose"); // choose | camera
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    setMode("camera");
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    streamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      onChange(await uploadImage(file));
    } catch (error) {
      setUploadError(error.message || "The image could not be uploaded.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const capture = async () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setUploading(true);
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
    const file = new File([blob], "document-capture.jpg", { type: "image/jpeg" });
    const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
    setUploading(false);
    stopStream();
    setMode("choose");
    onChange(file_url);
  };

  if (value) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <Image src={value} alt="Document" className="w-full h-56" fittingType="fill" />
        </div>
        <Button variant="outline" size="sm" onClick={() => onChange(null)} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Retake / Replace
        </Button>
      </div>
    );
  }

  if (mode === "camera") {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black">
          <video ref={videoRef} autoPlay playsInline className="w-full h-56 object-cover" />
        </div>
        <div className="flex gap-2">
          <Button onClick={capture} disabled={uploading} className="gap-2 bg-[#0f766e] hover:bg-[#0b5a54]">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            Capture Document
          </Button>
          <Button variant="outline" onClick={() => { stopStream(); setMode("choose"); }}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <label className="flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#0f766e] cursor-pointer transition-colors">
        {uploading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : <Upload className="w-5 h-5 text-slate-400" />}
        <span className="text-sm text-slate-500 font-medium">{uploading ? "Processing image..." : "Upload File"}</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </label>
      <button
        onClick={startCamera}
        className="flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#0f766e] transition-colors"
      >
        <Camera className="w-5 h-5 text-slate-400" />
        <span className="text-sm text-slate-500 font-medium">Use Camera</span>
      </button>
      {uploadError && <p className="col-span-2 text-sm text-red-600">{uploadError}</p>}
    </div>
  );
}