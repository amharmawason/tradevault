"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Film,
  Image as ImageIcon,
  FileCode,
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { playSoundEffect } from "./AudioSynth";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (upload: any) => void;
}

const PRESET_FILES = [
  {
    name: "Enterprise_AI_ARR_Financial_Model.xlsx",
    category: "excel",
    size: "3.2 MB",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    icon: FileSpreadsheet,
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    name: "Post_Quantum_Cryptography_Whitepaper_v3.pdf",
    category: "pdf",
    size: "5.1 MB",
    type: "application/pdf",
    icon: FileText,
    color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
  },
  {
    name: "Amhar_Omni_Keynote_Launch_4K.mp4",
    category: "video",
    size: "64.8 MB",
    type: "video/mp4",
    icon: Film,
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  {
    name: "Global_Partnership_Agreement_2026.docx",
    category: "word",
    size: "1.4 MB",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    icon: FileText,
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  {
    name: "Cybernetic_Architecture_Diagram.png",
    category: "photo",
    size: "4.2 MB",
    type: "image/png",
    icon: ImageIcon,
    color: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10",
  },
];

export function UploadModal({ isOpen, onClose, onUploaded }: UploadModalProps) {
  const [loading, setLoading] = useState(false);
  const [customName, setCustomName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");

  if (!isOpen) return null;

  const handleUploadItem = async (presetOrCustom: {
    fileName: string;
    fileSize: string;
    fileType: string;
    customCategory?: string;
  }) => {
    setLoading(true);
    setProgressMsg("Encrypting and uploading to Amhar Sovereign Vault...");
    playSoundEffect("powerup");

    setTimeout(() => {
      setProgressMsg("Feather NLP & Vision parser extracting tabular data & semantics...");
    }, 600);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: presetOrCustom.fileName,
          fileSize: presetOrCustom.fileSize,
          fileType: presetOrCustom.fileType,
          customCategory: presetOrCustom.customCategory,
        }),
      });

      const data = await res.json();
      if (data.success && data.upload) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
        onUploaded(data.upload);
        onClose();
        setCustomName("");
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setLoading(false);
      setProgressMsg("");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    handleUploadItem({
      fileName: file.name,
      fileSize: `${sizeMb} MB`,
      fileType: file.type || "application/octet-stream",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Omni-Upload Anything
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-semibold border border-cyan-500/30">
                ZERO LIMITS
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Upload Video, Photo, PDF, Word, Excel, Code, or any arbitrary file
            </p>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
              handleUploadItem({
                fileName: file.name,
                fileSize: `${sizeMb} MB`,
                fileType: file.type || "application/octet-stream",
              });
            }
          }}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
            dragActive
              ? "border-cyan-400 bg-cyan-950/20"
              : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
          }`}
        >
          <input
            type="file"
            id="fileInput"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-cyan-400 mb-3 shadow">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-zinc-200">
              Drop any file here, or <span className="text-cyan-400 underline">browse computer</span>
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Supports .xlsx, .csv, .pdf, .docx, .mp4, .png, .jpg, .zip, .json, and more
            </p>
            <span className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ⚡ Feather Premium: Unlimited File Size & Instant OCR
            </span>
          </div>
        </div>

        {/* One-Click Presets */}
        <div className="mt-5">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Or One-Click Test Files:
          </span>
          <div className="space-y-2">
            {PRESET_FILES.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleUploadItem({
                      fileName: p.name,
                      fileSize: p.size,
                      fileType: p.type,
                      customCategory: p.category,
                    })
                  }
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/70 hover:bg-zinc-800 border border-zinc-800/80 transition-all text-left text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${p.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-200 group-hover:text-white">{p.name}</p>
                      <p className="text-[11px] text-zinc-500">{p.size} • Instant Full Analysis</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-[10px] font-semibold group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                    Upload & Index
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading status */}
        {loading && (
          <div className="mt-4 p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/30 text-xs flex items-center gap-3 text-cyan-200">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400 flex-shrink-0" />
            <div>
              <p className="font-semibold">{progressMsg}</p>
              <p className="text-[10px] text-zinc-400">Amhar Sovereign Vault clearance approved</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
