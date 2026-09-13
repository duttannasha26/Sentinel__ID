import React from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, Activity } from "lucide-react";

export default function FaceScanVisualizer({ provider = "azure", stepIndex = 0, stepText = "", scanning = false }) {
  if (!scanning) return null;

  const isAzure = provider === "azure";
  const isAws = provider === "aws";
  const isOffline = provider === "offline";

  return (
    <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden flex items-center justify-center">
      {/* Provider-specific Background Grid & Scanner Rays */}
      {isAzure && (
        <>
          {/* Azure Cyan Holographic Scanning Beam */}
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent shadow-[0_0_15px_#38bdf8]"
            animate={{ top: ["5%", "92%", "5%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Azure Reticle Corner Brackets */}
          <div className="absolute inset-6 border border-cyan-400/30 rounded-3xl flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className="w-5 h-5 border-t-2 border-l-2 border-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
              <div className="w-5 h-5 border-t-2 border-r-2 border-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            </div>
            <div className="flex justify-between">
              <div className="w-5 h-5 border-b-2 border-l-2 border-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
              <div className="w-5 h-5 border-b-2 border-r-2 border-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            </div>
          </div>

          {/* Azure Simulated Facial Keypoint Landmark Mesh Crosshairs */}
          <div className="absolute w-32 h-36 flex flex-col items-center justify-between">
            {/* Eye level landmarks */}
            <div className="flex justify-between w-full px-4 pt-4">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full border border-cyan-300 bg-cyan-400/80 shadow-[0_0_6px_#38bdf8]"
              />
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2.5 h-2.5 rounded-full border border-cyan-300 bg-cyan-400/80 shadow-[0_0_6px_#38bdf8]"
              />
            </div>

            {/* Nose tip landmark */}
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full border border-cyan-200 bg-white shadow-[0_0_6px_#fff]"
            />

            {/* Mouth corners landmarks */}
            <div className="flex justify-between w-16 pb-4">
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-2 h-2 rounded-full border border-cyan-300 bg-cyan-400/80 shadow-[0_0_6px_#38bdf8]"
              />
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.1 }}
                className="w-2 h-2 rounded-full border border-cyan-300 bg-cyan-400/80 shadow-[0_0_6px_#38bdf8]"
              />
            </div>
          </div>

          {/* Azure Animated Telemetry Overlay */}
          <div className="absolute bottom-2 inset-x-2 bg-slate-950/80 backdrop-blur-md rounded-xl p-1.5 text-center text-[10px] text-cyan-300 border border-cyan-500/30 flex items-center justify-between px-3">
            <span className="flex items-center gap-1 font-mono">
              <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" /> AZURE AI FACE
            </span>
            <span className="font-mono text-cyan-200">CONF: {(96.5 + (stepIndex * 0.9)).toFixed(1)}%</span>
            <span className="font-mono text-[9px] text-cyan-400/80">LIVENESS OK</span>
          </div>
        </>
      )}

      {isAws && (
        <>
          {/* AWS Amber Rotating Hex / Radial Radar Sweep */}
          <motion.div
            className="absolute w-44 h-44 rounded-full border border-amber-500/40 shadow-[0_0_20px_#f59e0b]"
            animate={{ rotate: 360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            style={{ borderStyle: "dashed" }}
          />

          {/* AWS Pulsing Radar Pulse Wave */}
          <motion.div
            className="absolute rounded-full border-2 border-amber-400/60"
            animate={{ width: ["20%", "95%"], height: ["20%", "95%"], opacity: [0.8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />

          {/* AWS 3D Wireframe Mesh Nodes */}
          <div className="absolute w-28 h-28 flex flex-wrap justify-between items-center p-2 opacity-80">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
              />
            ))}
          </div>

          {/* AWS Gesture Challenge Prompt Icon Rings */}
          <div className="absolute top-4 inset-x-0 flex justify-center">
            <span className="bg-amber-950/85 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-500/40 text-[10px] font-mono text-amber-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 animate-spin" /> AWS REKOGNITION LIVENESS
            </span>
          </div>

          <div className="absolute bottom-2 inset-x-2 bg-slate-950/80 backdrop-blur-md rounded-xl p-1.5 text-center text-[10px] text-amber-300 border border-amber-500/30 flex items-center justify-between px-3">
            <span className="font-mono text-amber-400">DEPTH MAP: ACTIVE</span>
            <span className="font-mono text-amber-200">RADAR: SYNCD</span>
          </div>
        </>
      )}

      {isOffline && (
        <>
          {/* Offline Local Biometric Teal Laser Grid */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981]"
            animate={{ top: ["8%", "90%", "8%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="absolute inset-4 border-2 border-emerald-500/40 rounded-full animate-pulse" />

          {/* Offline Telemetry Badge */}
          <div className="absolute bottom-2 inset-x-2 bg-slate-950/80 backdrop-blur-md rounded-xl p-1.5 text-center text-[10px] text-emerald-300 border border-emerald-500/30 flex items-center justify-between px-3">
            <span className="flex items-center gap-1 font-mono">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> OFFLINE ENGINE
            </span>
            <span className="font-mono text-emerald-200">LOCAL CANVAS MESH</span>
          </div>
        </>
      )}
    </div>
  );
}
