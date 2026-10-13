"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Key,
  Cpu,
  Sparkles,
  X,
  Copy,
  Check,
  UserCheck,
  RefreshCw,
  Zap,
  Volume2,
} from "lucide-react";
import { User } from "@/lib/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  allUsers: User[];
  onUserSwitched: (user: User) => void;
  onSettingsSaved: (updatedUser: User) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onUserSwitched,
  onSettingsSaved,
}: SettingsModalProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [turboMode, setTurboMode] = useState(currentUser?.settings?.turboMode ?? true);
  const [soundEffects, setSoundEffects] = useState(currentUser?.settings?.soundEffects ?? true);
  const [modelEngine, setModelEngine] = useState(
    currentUser?.settings?.modelEngine || "Amhar-Omni-v5-Supreme"
  );
  const [saving, setSaving] = useState(false);
  const [reseedLoading, setReseedLoading] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(currentUser.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          settings: {
            turboMode,
            soundEffects,
            modelEngine,
            autoUpscale: true,
            darkTheme: true,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        onSettingsSaved(data.user);
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleReseed = async () => {
    setReseedLoading(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setReseedLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with VIP Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-600 text-zinc-950 font-black shadow-lg shadow-amber-500/20">
            <Zap className="h-6 w-6 fill-zinc-950" />
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Amhar&apos;s Bot Settings & VIP
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/40">
                FEATHER UNLOCKED
              </span>
            </h2>
            <p className="text-xs text-zinc-400">Zero limits, unlimited compute credits & supreme API clearance</p>
          </div>
        </div>

        {/* User Account Switcher */}
        <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-amber-400" /> Active Profile
            </span>
            <span className="text-[10px] text-zinc-500">Switch profile anytime</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {allUsers.map((u) => {
              const isActive = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => onUserSwitched(u)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? "bg-amber-500/10 border-amber-400/60 text-white"
                      : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="h-8 w-8 rounded-full object-cover border border-amber-400/30" />
                  <div className="truncate">
                    <p className="text-xs font-bold truncate text-white">{u.name}</p>
                    <p className="text-[10px] text-amber-400 font-mono truncate">{u.role}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* VIP Clearance Card */}
        <div className="p-4 bg-gradient-to-br from-amber-950/30 via-zinc-900 to-zinc-900 rounded-xl border border-amber-500/30 space-y-2 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> Supreme Feather Clearance
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">STATUS: UNLIMITED</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            All limits removed for Amhar&apos;s Bot. Enjoy full access to 4K video rendering, lossless stem audio synthesis, full-stack app compilers, and unlimited document parsing.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400 font-mono">
            <span>Compute Balance:</span>
            <span className="text-amber-300 font-bold">∞ UNLIMITED CREDITS</span>
          </div>
        </div>

        {/* API Key */}
        <div className="space-y-2 mb-5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-zinc-400" /> Amhar Bot Master API Key
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Header: Authorization Bearer</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="password"
              readOnly
              value={currentUser.apiKey}
              className="flex-1 bg-zinc-900 rounded-xl px-3.5 py-2 text-xs font-mono text-zinc-200 border border-zinc-800 select-all"
            />
            <button
              onClick={handleCopyKey}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 border border-zinc-700 transition-all"
            >
              {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedKey ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Engine Settings */}
        <div className="space-y-3 mb-6 p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Omni Model Engine</label>
            <select
              value={modelEngine}
              onChange={(e) => setModelEngine(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200"
            >
              <option value="Amhar-Omni-v5-Supreme">Amhar-Omni-v5-Supreme (Multi-modal Unified 4K)</option>
              <option value="Amhar-Claude-Direct">Amhar-Claude-Direct (Hyper-Precision Reasoning)</option>
              <option value="Amhar-Quantum-Sovereign">Amhar-Quantum-Sovereign (Lattice Resistance)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-zinc-300">Turbo Mode (60 FPS & Multi-Threaded Inference)</span>
            <input
              type="checkbox"
              checked={turboMode}
              onChange={(e) => setTurboMode(e.target.checked)}
              className="accent-amber-400 h-4 w-4 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-zinc-400" /> Sound Effects & Web Audio Synthesis
            </span>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="accent-amber-400 h-4 w-4 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleReseed}
            disabled={reseedLoading}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${reseedLoading ? "animate-spin" : ""}`} />
            {reseedLoading ? "Resetting demo data..." : "Reset Demo Data"}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
