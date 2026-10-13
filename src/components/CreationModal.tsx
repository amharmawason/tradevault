"use client";

import React, { useState } from "react";
import {
  Film,
  Image as ImageIcon,
  Music,
  Smartphone,
  Globe,
  Gamepad2,
  SearchCode,
  Sparkles,
  X,
  Loader2,
  Sliders,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { CreationType } from "@/lib/types";
import confetti from "canvas-confetti";
import { playSoundEffect } from "./AudioSynth";

interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (creation: any) => void;
  initialType?: CreationType;
}

const MODALITY_CONFIGS = [
  { type: "video" as CreationType, label: "Video Studio", icon: Film, color: "from-rose-500 to-red-600", placeholder: "e.g., Cyberpunk Tokyo drone hyperlapse with neon reflections in 4K 60fps" },
  { type: "photo" as CreationType, label: "Photo / Art", icon: ImageIcon, color: "from-fuchsia-500 to-pink-600", placeholder: "e.g., Ultra-detailed photorealistic portrait of an android mystic, 85mm f/1.4 lens" },
  { type: "music" as CreationType, label: "Music & Audio", icon: Music, color: "from-violet-500 to-purple-600", placeholder: "e.g., 1980s retro synthwave anthem with pulsating Moog bassline at 128 BPM" },
  { type: "app" as CreationType, label: "Full App", icon: Smartphone, color: "from-indigo-500 to-cyan-500", placeholder: "e.g., AI biometric fitness dashboard with real-time calorie burn and hydration tracker" },
  { type: "website" as CreationType, label: "Web Studio", icon: Globe, color: "from-blue-500 to-cyan-500", placeholder: "e.g., Modern glassmorphism SaaS landing page for enterprise AI multi-agents" },
  { type: "game" as CreationType, label: "Game Engine", icon: Gamepad2, color: "from-cyan-500 to-emerald-500", placeholder: "e.g., Fast retro arcade space shooter in HTML5 canvas with neon explosions & sound FX" },
  { type: "research" as CreationType, label: "Deep Research", icon: SearchCode, color: "from-amber-500 to-orange-500", placeholder: "e.g., Quantum resistance breakthroughs & lattice cryptographic migration strategies" },
];

export function CreationModal({ isOpen, onClose, onCreated, initialType = "video" }: CreationModalProps) {
  const [selectedType, setSelectedType] = useState<CreationType>(initialType);
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Modality-specific options
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [cameraMotion, setCameraMotion] = useState("Orbital Drone Pan");
  const [bpm, setBpm] = useState(128);
  const [genre, setGenre] = useState("Retrowave / Synthwave");
  const [stylePreset, setStylePreset] = useState("Photorealistic");

  if (!isOpen) return null;

  const activeConfig = MODALITY_CONFIGS.find((m) => m.type === selectedType) || MODALITY_CONFIGS[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setGenerationStep(1);
    playSoundEffect("powerup");

    const timer1 = setTimeout(() => setGenerationStep(2), 700);
    const timer2 = setTimeout(() => setGenerationStep(3), 1400);

    try {
      const res = await fetch("/api/creations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          prompt,
          title: title.trim() ? title.trim() : undefined,
          options: {
            aspectRatio,
            cameraMotion,
            bpm,
            genre,
            style: stylePreset,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.creation) {
        clearTimeout(timer1);
        clearTimeout(timer2);
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
        });
        onCreated(data.creation);
        onClose();
        setPrompt("");
        setTitle("");
      } else {
        alert(data.error || "Generation error");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setLoading(false);
      setGenerationStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 text-zinc-950 font-black shadow-lg shadow-amber-500/20">
            ⚡
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Amhar&apos;s Bot Omni-Creator
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-2 py-0.5 rounded-full font-black tracking-wide">
                FEATHER UNLOCKED
              </span>
            </h2>
            <p className="text-xs text-zinc-400">Generate any media, code, interactive game, or deep intelligence with zero limits</p>
          </div>
        </div>

        {/* Modality Selector Tabs */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pb-4 border-b border-zinc-800/80">
          {MODALITY_CONFIGS.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => {
                  playSoundEffect("click");
                  setSelectedType(item.type);
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-zinc-800 text-white border-2 border-amber-400/80 shadow-lg"
                    : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
                }`}
              >
                <Icon className={`h-4 w-4 mb-1 ${isSelected ? "text-amber-400" : "text-zinc-400"}`} />
                <span className="text-[11px] truncate w-full text-center">{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Creation Form */}
        <form onSubmit={handleGenerate} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Title <span className="text-zinc-500 font-normal">(Optional - auto-generated if blank)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cyberpunk Neo-Tokyo 2088"
              className="w-full rounded-xl bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 border border-zinc-800 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Prompt & Directive <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeConfig.placeholder}
              className="w-full rounded-xl bg-zinc-900 p-3.5 text-sm text-zinc-100 border border-zinc-800 focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          {/* Dynamic Configuration per Type */}
          {selectedType === "video" && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Camera Trajectory</label>
                <select
                  value={cameraMotion}
                  onChange={(e) => setCameraMotion(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-zinc-200"
                >
                  <option>Orbital Drone Pan</option>
                  <option>Forward Dolly Zoom</option>
                  <option>Dynamic Flyover</option>
                  <option>360 Spiral Upward</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-zinc-200"
                >
                  <option>16:9 (Landscape 4K)</option>
                  <option>9:16 (Vertical Reels/TikTok)</option>
                  <option>1:1 (Square)</option>
                  <option>2.39:1 (Cinemascope)</option>
                </select>
              </div>
            </div>
          )}

          {selectedType === "photo" && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Aesthetic Preset</label>
                <select
                  value={stylePreset}
                  onChange={(e) => setStylePreset(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-zinc-200"
                >
                  <option>Photorealistic 8K</option>
                  <option>Unreal Engine 5 Render</option>
                  <option>Studio Executive Portrait</option>
                  <option>Cyberpunk Neon Noir</option>
                  <option>Concept Art Illustration</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-zinc-200"
                >
                  <option>16:9 (Landscape)</option>
                  <option>1:1 (Square)</option>
                  <option>9:16 (Portrait)</option>
                  <option>4:5 (Instagram)</option>
                </select>
              </div>
            </div>
          )}

          {selectedType === "music" && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Musical Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-zinc-200"
                >
                  <option>Retrowave / Synthwave</option>
                  <option>Cyberpunk Industrial EDM</option>
                  <option>Cinematic Orchestral</option>
                  <option>Lo-Fi Chill Beats</option>
                  <option>Ambient Piano & Space</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Tempo (BPM): {bpm}</label>
                <input
                  type="range"
                  min="70"
                  max="160"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-full accent-violet-500 mt-2"
                />
              </div>
            </div>
          )}

          {/* Synthesis Step Feedback */}
          {loading && (
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-xs space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {generationStep === 1 && "Connecting to Feather Unlocked Hyper-Cluster..."}
                  {generationStep === 2 && `Synthesizing neural weights for ${activeConfig.label}...`}
                  {generationStep === 3 && "Finalizing 4K lossless output & state vectors..."}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Zero latency pipeline • Unlimited compute tokens enabled</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-black transition-all shadow-lg active:scale-95 ${
                loading
                  ? "bg-zinc-700 opacity-50 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 shadow-amber-500/25"
              }`}
            >
              <Zap className="h-4 w-4 fill-black" />
              {loading ? "Synthesizing..." : `Generate ${activeConfig.label}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
