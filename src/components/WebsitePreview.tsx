"use client";

import React, { useState } from "react";
import { Globe, Monitor, Tablet, Smartphone, ExternalLink, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

interface WebsiteProps {
  title: string;
  outputData?: any;
}

export function WebsitePreview({ title, outputData }: WebsiteProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const heroTitle = outputData?.heroTitle || "Cognitive Intelligence Scaled to Infinity";
  const heroSubtitle = outputData?.heroSubtitle || "Deploy autonomous multi-agent swarms across your entire enterprise cloud in under 60 seconds.";
  const stats = outputData?.stats || [
    { label: "Active Inference Nodes", value: "24,500+" },
    { label: "Average Token Latency", value: "1.4ms" },
    { label: "Enterprise Cost Saved", value: "$4.8M" },
  ];

  const getContainerWidth = () => {
    if (device === "mobile") return "max-w-[360px]";
    if (device === "tablet") return "max-w-[640px]";
    return "w-full";
  };

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-zinc-950 p-4 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
              {title}
              <span className="rounded bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 border border-blue-500/30 font-semibold">
                Responsive HTML5 + CSS
              </span>
            </h3>
            <p className="text-xs text-zinc-400">Live viewport rendering with interactive buttons & components</p>
          </div>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center gap-1.5 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              device === "desktop" ? "bg-blue-600 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              device === "tablet" ? "bg-blue-600 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              device === "mobile" ? "bg-blue-600 text-white font-medium" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Website Viewport Container */}
      <div className="mt-3 flex justify-center bg-zinc-900/50 p-3 md:p-6 rounded-xl border border-zinc-800/80 overflow-hidden">
        <div
          className={`transition-all duration-300 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl overflow-hidden ${getContainerWidth()}`}
        >
          {/* Browser Address Bar Mock */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-1 max-w-xs mx-3 bg-slate-950 px-3 py-0.5 rounded text-center text-slate-400 truncate text-[10px] font-mono border border-slate-800">
              https://apexneural.io/enterprise-ai
            </div>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </div>

          {/* Rendered Web Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Nav */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-black tracking-wider bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                APEX//NEURAL
              </span>
              <button className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-all shadow-md">
                Launch Swarm
              </button>
            </div>

            {/* Hero Section */}
            <div className="text-center pt-4 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                <Zap className="h-3.5 w-3.5 text-blue-400" /> Amhar Omni-Architecture v5.0 Live
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {heroTitle}
              </h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-blue-500/30 hover:opacity-90 transition-all">
                  Deploy Free <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-all">
                  Documentation
                </button>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {stats.map((s: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-900/70 rounded-xl border border-slate-800/80 text-center">
                  <p className="text-lg md:text-xl font-black text-cyan-400 font-mono">{s.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 99.99% Latency Guarantee
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> Post-Quantum Kyber-768
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
