"use client";

import React from "react";
import {
  Film,
  Image as ImageIcon,
  Music,
  Smartphone,
  Globe,
  Gamepad2,
  SearchCode,
  UploadCloud,
  Table,
  MessageSquareText,
  Sparkles,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
  Zap,
  Bookmark,
  ShieldCheck,
} from "lucide-react";
import { User } from "@/lib/types";

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  currentUser: User | null;
  onOpenSettings: () => void;
  onOpenCreate: () => void;
  onOpenUpload: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  creationsCount: number;
  uploadsCount: number;
}

export function Sidebar({
  currentView,
  onSelectView,
  currentUser,
  onOpenSettings,
  onOpenCreate,
  onOpenUpload,
  isCollapsed,
  onToggleCollapse,
  creationsCount,
  uploadsCount,
}: SidebarProps) {
  const creationNav = [
    { id: "all", label: "Studio Overview", icon: Layers, badge: String(creationsCount) },
    { id: "video", label: "Video Studio", icon: Film, color: "text-rose-400 group-hover:text-rose-300" },
    { id: "photo", label: "Photo & Art", icon: ImageIcon, color: "text-fuchsia-400 group-hover:text-fuchsia-300" },
    { id: "music", label: "Music & Audio", icon: Music, color: "text-violet-400 group-hover:text-violet-300" },
    { id: "app", label: "App Sandbox", icon: Smartphone, color: "text-indigo-400 group-hover:text-indigo-300" },
    { id: "website", label: "Website Studio", icon: Globe, color: "text-blue-400 group-hover:text-blue-300" },
    { id: "game", label: "Game Engine", icon: Gamepad2, color: "text-cyan-400 group-hover:text-cyan-300" },
    { id: "research", label: "Deep Research", icon: SearchCode, color: "text-amber-400 group-hover:text-amber-300" },
  ];

  const vaultNav = [
    { id: "vault", label: "Vault (Upload Anything)", icon: UploadCloud, badge: String(uploadsCount) },
    { id: "spreadsheets", label: "Excel & Data Analytics", icon: Table, color: "text-emerald-400" },
    { id: "doc_chat", label: "Document Q&A Chat", icon: MessageSquareText, color: "text-violet-400" },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-zinc-800 bg-zinc-950/95 backdrop-blur-xl transition-all duration-300 select-none z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => onSelectView("all")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-600 text-zinc-950 font-black shadow-lg shadow-amber-500/20 flex-shrink-0">
            <Zap className="h-5 w-5 fill-zinc-950" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                Amhar&apos;s Bot
                <span className="text-[9px] bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-1.5 py-0.2 rounded font-black">
                  VIP
                </span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono truncate">Feather Sovereign Suite</span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="p-3 space-y-2 border-b border-zinc-900">
        <button
          onClick={onOpenCreate}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all truncate"
        >
          <Zap className="h-4 w-4 fill-zinc-950 flex-shrink-0" />
          {!isCollapsed && <span>New Creation</span>}
        </button>

        <button
          onClick={onOpenUpload}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all truncate"
        >
          <UploadCloud className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Upload Anything</span>}
        </button>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Creation Modalities */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Generation Hub
            </p>
          )}
          <div className="space-y-0.5">
            {creationNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${item.color || "text-zinc-400 group-hover:text-white"}`} />
                  {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 text-zinc-400 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Omni-Upload Vault */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Omni-Upload & Vault
            </p>
          )}
          <div className="space-y-0.5">
            {vaultNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${item.color || "text-cyan-400"}`} />
                  {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Short-cuts & Templates */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Library & VIP
            </p>
          )}
          <div className="space-y-0.5">
            <button
              onClick={() => onSelectView("favorites")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === "favorites"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Bookmark className="h-4 w-4 text-amber-400 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">Favorites</span>}
            </button>
            <button
              onClick={() => onSelectView("templates")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === "templates"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Sparkles className="h-4 w-4 text-pink-400 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">Prompt Templates</span>}
            </button>
            <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all"
            >
              <Settings className="h-4 w-4 text-zinc-400 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">Feather Settings</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Footer User Profile Card */}
      {currentUser && (
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/80">
          <div
            onClick={onOpenSettings}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-9 w-9 rounded-full object-cover border-2 border-amber-400/40 flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col truncate flex-1">
                <span className="font-bold text-xs text-white truncate flex items-center gap-1">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 truncate">
                  <ShieldCheck className="h-3 w-3 text-amber-400 flex-shrink-0" /> Feather Unlocked
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
