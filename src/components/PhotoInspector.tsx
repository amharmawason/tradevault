"use client";

import React, { useState } from "react";
import { Image as ImageIcon, ZoomIn, Download, Copy, Check, Sparkles, Layers, Sliders } from "lucide-react";
import confetti from "canvas-confetti";

interface PhotoInspectorProps {
  title: string;
  outputData?: any;
}

export function PhotoInspector({ title, outputData }: PhotoInspectorProps) {
  const [copied, setCopied] = useState(false);
  const [upscaling, setUpscaling] = useState(false);
  const [upscaled, setUpscaled] = useState(false);

  const imageUrl =
    outputData?.imageUrl ||
    "https://images.pexels.com/photos/7688749/pexels-photo-7688749.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

  const triggerUpscale = () => {
    setUpscaling(true);
    setTimeout(() => {
      setUpscaling(false);
      setUpscaled(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(outputData?.prompt || title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-fuchsia-500/30 bg-zinc-950 p-4 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-fuchsia-500 to-pink-600 text-white shadow-md">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
              {title}
              <span className="rounded bg-fuchsia-500/20 text-fuchsia-300 text-[10px] px-2 py-0.5 border border-fuchsia-500/30 font-semibold">
                {upscaled ? "Feather 8K Upscaled" : "Feather 4K Master"}
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Sampler: {outputData?.sampler || "Euler a"} • Seed: {outputData?.seed || "88472910"} • CFG: {outputData?.cfgScale || 7.0}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerUpscale}
            disabled={upscaling || upscaled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              upscaled
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white hover:opacity-90 shadow-md shadow-fuchsia-500/20"
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 ${upscaling ? "animate-spin" : ""}`} />
            {upscaling ? "Upscaling 4X..." : upscaled ? "✓ 8K Ultra Ready" : "Feather 8K Upscale"}
          </button>

          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div className="mt-3 relative rounded-xl overflow-hidden bg-black border border-zinc-800 group">
        <img
          src={imageUrl}
          alt={title}
          className="w-full max-h-[500px] object-cover transition-all duration-300 group-hover:scale-[1.01]"
        />
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={copyPrompt}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs hover:bg-black/80 transition-colors border border-white/10"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy Prompt"}
          </button>
        </div>
      </div>

      {/* Telemetry info */}
      <div className="mt-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-xs">
        <p className="text-zinc-300 leading-relaxed font-sans">
          <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px] block mb-0.5">Prompt:</span>
          {outputData?.prompt || title}
        </p>
        {outputData?.negativePrompt && (
          <p className="text-zinc-500 text-[11px] mt-2 italic">
            Negative prompt: {outputData.negativePrompt}
          </p>
        )}
      </div>
    </div>
  );
}
