"use client";

import React from "react";
import { Search, Sparkles, Zap, ShieldCheck, Menu, Plus, UploadCloud } from "lucide-react";
import { User } from "@/lib/types";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: User | null;
  onOpenCreate: () => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onToggleSidebarMobile: () => void;
}

export function Navbar({
  searchQuery,
  onSearchChange,
  currentUser,
  onOpenCreate,
  onOpenUpload,
  onOpenSettings,
  onToggleSidebarMobile,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 md:px-6 backdrop-blur-xl">
      {/* Left: Mobile hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebarMobile}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search creations, video, prompt, excel data, docs..."
            className="w-full rounded-xl bg-zinc-900/90 pl-9 pr-4 py-2 text-xs text-zinc-200 border border-zinc-800 focus:outline-none focus:border-amber-400 placeholder-zinc-500 transition-colors"
          />
        </div>
      </div>

      {/* Right: VIP Badge & Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Feather Unlocked Glow Badge */}
        <div
          onClick={onOpenSettings}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-400/30 cursor-pointer hover:border-amber-400/60 transition-all shadow-[0_0_15px_rgba(251,191,36,0.1)]"
        >
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-[11px] font-bold text-amber-300 tracking-wide uppercase font-mono">
            FEATHER UNLOCKED
          </span>
          <span className="text-[10px] text-zinc-400 border-l border-amber-500/30 pl-2 font-mono">
            ∞ Compute
          </span>
        </div>

        {/* Action Buttons */}
        <button
          onClick={onOpenUpload}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Upload</span>
        </button>

        <button
          onClick={onOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create</span>
        </button>

        {/* Profile Avatar trigger */}
        {currentUser && (
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-amber-400/40"
            />
          </button>
        )}
      </div>
    </header>
  );
}
