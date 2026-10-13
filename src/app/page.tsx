"use client";

import React, { useState, useEffect } from "react";
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
  Zap,
  Play,
  Heart,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  Plus,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  FileText,
  FileCode,
  ShieldCheck,
} from "lucide-react";
import { Creation, UploadItem, User, TemplateItem, CreationType } from "@/lib/types";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { CreationModal } from "@/components/CreationModal";
import { UploadModal } from "@/components/UploadModal";
import { SettingsModal } from "@/components/SettingsModal";
import { AudioSynth } from "@/components/AudioSynth";
import { CanvasSpaceGame } from "@/components/CanvasSpaceGame";
import { SpreadsheetViewer } from "@/components/SpreadsheetViewer";
import { AppSimulator } from "@/components/AppSimulator";
import { WebsitePreview } from "@/components/WebsitePreview";
import { DeepResearchViewer } from "@/components/DeepResearchViewer";
import { VideoPlayerView } from "@/components/VideoPlayerView";
import { PhotoInspector } from "@/components/PhotoInspector";
import { DocumentChat } from "@/components/DocumentChat";

export default function AmharBotDashboard() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data states
  const [creations, setCreations] = useState<Creation[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Active detail modal
  const [activeCreation, setActiveCreation] = useState<Creation | null>(null);
  const [activeUpload, setActiveUpload] = useState<UploadItem | null>(null);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<CreationType>("video");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user & seed if needed
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();
      if (authData.currentUser) {
        setCurrentUser(authData.currentUser);
        setAllUsers(authData.allUsers || [authData.currentUser]);
      }

      // 2. Fetch creations
      const creRes = await fetch("/api/creations");
      const creData = await creRes.json();
      if (creData.creations) {
        setCreations(creData.creations);
      }

      // 3. Fetch uploads
      const upRes = await fetch("/api/uploads");
      const upData = await upRes.json();
      if (upData.uploads) {
        setUploads(upData.uploads);
      }

      // 4. Fetch templates
      const tplRes = await fetch("/api/templates");
      const tplData = await tplRes.json();
      if (tplData.templates) {
        setTemplates(tplData.templates);
      }
    } catch (e) {
      console.error("Initialization error", e);
    } finally {
      setLoading(false);
    }
  };

  // Optimistic favorite toggle
  const handleToggleFavorite = async (creationId: string, currentFav: boolean) => {
    setCreations((prev) =>
      prev.map((c) => (c.id === creationId ? { ...c, isFavorite: !currentFav } : c))
    );
    try {
      await fetch(`/api/creations/${creationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !currentFav }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Optimistic deletion
  const handleDeleteCreation = async (creationId: string) => {
    if (!confirm("Are you sure you want to delete this creation?")) return;
    setCreations((prev) => prev.filter((c) => c.id !== creationId));
    if (activeCreation?.id === creationId) setActiveCreation(null);
    try {
      await fetch(`/api/creations/${creationId}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUpload = async (uploadId: string) => {
    if (!confirm("Remove this file from Amhar Vault?")) return;
    setUploads((prev) => prev.filter((u) => u.id !== uploadId));
    if (activeUpload?.id === uploadId) setActiveUpload(null);
    try {
      await fetch(`/api/uploads/${uploadId}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };

  // Filter creations
  const filteredCreations = creations.filter((c) => {
    if (currentView === "favorites" && !c.isFavorite) return false;
    if (
      currentView !== "all" &&
      currentView !== "favorites" &&
      currentView !== "vault" &&
      currentView !== "spreadsheets" &&
      currentView !== "doc_chat" &&
      currentView !== "templates" &&
      c.type !== currentView
    ) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchPrompt = c.prompt.toLowerCase().includes(q);
      const matchTag = c.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchPrompt && !matchTag) return false;
    }
    return true;
  });

  // Filter uploads
  const filteredUploads = uploads.filter((u) => {
    if (currentView === "spreadsheets" && u.fileCategory !== "excel") return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = u.fileName.toLowerCase().includes(q);
      const matchCat = u.fileCategory.toLowerCase().includes(q);
      if (!matchName && !matchCat) return false;
    }
    return true;
  });

  const openGeneratorForType = (type: CreationType) => {
    setCreateModalType(type);
    setCreateModalOpen(true);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <div className={`${mobileSidebarOpen ? "block fixed inset-0 z-40" : "hidden md:flex"}`}>
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => {
            setCurrentView(v);
            setMobileSidebarOpen(false);
          }}
          currentUser={currentUser}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onOpenCreate={() => {
            setCreateModalType("video");
            setCreateModalOpen(true);
          }}
          onOpenUpload={() => setUploadModalOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          creationsCount={creations.length}
          uploadsCount={uploads.length}
        />
      </div>

      {/* Main Workspace Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={currentUser}
          onOpenCreate={() => {
            setCreateModalType("video");
            setCreateModalOpen(true);
          }}
          onOpenUpload={() => setUploadModalOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onToggleSidebarMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Top Hero Banner (Overview mode) */}
          {currentView === "all" && (
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/30 p-6 md:p-8 shadow-2xl">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    FEATHER UNLOCKED SUPREME • ZERO LIMITS ARCHITECTURE
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Amhar&apos;s Bot Generation Engine
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Generate 4K videos, photorealistic art, lossless stems music, full-stack apps, responsive websites, playable canvas games, autonomous deep research dossiers, and upload & analyze any file format.
                  </p>
                </div>

                {/* Quick Stats Pill */}
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center min-w-[90px]">
                    <p className="text-lg font-black text-amber-400 font-mono">∞</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Tokens</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center min-w-[90px]">
                    <p className="text-lg font-black text-cyan-400 font-mono">60 FPS</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Turbo Engine</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center min-w-[90px]">
                    <p className="text-lg font-black text-emerald-400 font-mono">{creations.length}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Creations</p>
                  </div>
                </div>
              </div>

              {/* Modality Quick Triggers Bar */}
              <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {[
                  { type: "video" as CreationType, label: "Video 4K", icon: Film, color: "hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400" },
                  { type: "photo" as CreationType, label: "Photo 8K", icon: ImageIcon, color: "hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 text-fuchsia-400" },
                  { type: "music" as CreationType, label: "Music Stems", icon: Music, color: "hover:border-violet-500/50 hover:bg-violet-500/10 text-violet-400" },
                  { type: "app" as CreationType, label: "App Sandbox", icon: Smartphone, color: "hover:border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-400" },
                  { type: "website" as CreationType, label: "Web Studio", icon: Globe, color: "hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-400" },
                  { type: "game" as CreationType, label: "Play Game", icon: Gamepad2, color: "hover:border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400" },
                  { type: "research" as CreationType, label: "Research", icon: SearchCode, color: "hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-400" },
                  { type: "upload" as any, label: "Upload Any", icon: UploadCloud, color: "hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400" },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.type === "upload") setUploadModalOpen(true);
                        else openGeneratorForType(item.type);
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-semibold transition-all active:scale-95 ${item.color}`}
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      <span className="text-[11px] truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dedicated View Banner */}
          {currentView !== "all" && (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-zinc-800 text-amber-400 border border-zinc-700">
                  {currentView === "video" && <Film className="h-5 w-5 text-rose-400" />}
                  {currentView === "photo" && <ImageIcon className="h-5 w-5 text-fuchsia-400" />}
                  {currentView === "music" && <Music className="h-5 w-5 text-violet-400" />}
                  {currentView === "app" && <Smartphone className="h-5 w-5 text-indigo-400" />}
                  {currentView === "website" && <Globe className="h-5 w-5 text-blue-400" />}
                  {currentView === "game" && <Gamepad2 className="h-5 w-5 text-cyan-400" />}
                  {currentView === "research" && <SearchCode className="h-5 w-5 text-amber-400" />}
                  {currentView === "vault" && <UploadCloud className="h-5 w-5 text-cyan-400" />}
                  {currentView === "spreadsheets" && <Table className="h-5 w-5 text-emerald-400" />}
                  {currentView === "doc_chat" && <MessageSquareText className="h-5 w-5 text-violet-400" />}
                  {currentView === "favorites" && <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />}
                  {currentView === "templates" && <Sparkles className="h-5 w-5 text-pink-400" />}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white capitalize">
                    {currentView === "all" ? "Omni Studio" : currentView.replace("_", " ")}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Feather Sovereign clearance active • Unlimited compute enabled
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {["video", "photo", "music", "app", "website", "game", "research"].includes(currentView) && (
                  <button
                    onClick={() => openGeneratorForType(currentView as CreationType)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create New {currentView.toUpperCase()}</span>
                  </button>
                )}
                {["vault", "spreadsheets", "doc_chat"].includes(currentView) && (
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>Upload New File</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SPECIALIZED MODALITY WORKSPACES */}

          {/* 1. PLAYABLE GAME ENGINE VIEW */}
          {(currentView === "game" || (currentView === "all" && activeCreation?.type === "game")) && (
            <div className="space-y-3">
              <CanvasSpaceGame
                title={activeCreation?.title || "Neon Defender: Cyber Space Shooter"}
                highScoreDefault={activeCreation?.outputData?.highScore || 14850}
              />
            </div>
          )}

          {/* 2. AUDIO SYNTH VIEW */}
          {(currentView === "music" || (currentView === "all" && activeCreation?.type === "music")) && (
            <div className="space-y-3">
              <AudioSynth
                title={activeCreation?.title || "Synthwave Odyssey: Neon Horizon"}
                genre={activeCreation?.outputData?.genre || "Retrowave / Synthwave"}
                bpm={activeCreation?.outputData?.bpm || 128}
                stems={activeCreation?.outputData?.stems}
                lyrics={activeCreation?.outputData?.lyrics}
              />
            </div>
          )}

          {/* 3. APP LIVE SIMULATOR VIEW */}
          {(currentView === "app" || (currentView === "all" && activeCreation?.type === "app")) && (
            <div className="space-y-3">
              <AppSimulator
                title={activeCreation?.title || "AuraFit - AI Nutrition & Biometrics Tracker"}
                outputData={activeCreation?.outputData}
              />
            </div>
          )}

          {/* 4. WEBSITE PREVIEW VIEW */}
          {(currentView === "website" || (currentView === "all" && activeCreation?.type === "website")) && (
            <div className="space-y-3">
              <WebsitePreview
                title={activeCreation?.title || "ApexNeural - Enterprise Cognitive AI Platform"}
                outputData={activeCreation?.outputData}
              />
            </div>
          )}

          {/* 5. DEEP RESEARCH DOSSIER VIEW */}
          {(currentView === "research" || (currentView === "all" && activeCreation?.type === "research")) && (
            <div className="space-y-3">
              <DeepResearchViewer
                title={activeCreation?.title || "Autonomous Multi-Agent Systems & Post-Quantum Cryptography"}
                prompt={activeCreation?.prompt || "Synthesize lattice cryptography and multi-agent consensus"}
                outputData={activeCreation?.outputData}
              />
            </div>
          )}

          {/* 6. VIDEO STUDIO VIEW */}
          {(currentView === "video" || (currentView === "all" && activeCreation?.type === "video")) && (
            <div className="space-y-3">
              <VideoPlayerView
                title={activeCreation?.title || "Cyberpunk Tokyo 2088 Neon Flythrough"}
                outputData={activeCreation?.outputData}
              />
            </div>
          )}

          {/* 7. PHOTO / ART INSPECTOR VIEW */}
          {(currentView === "photo" || (currentView === "all" && activeCreation?.type === "photo")) && (
            <div className="space-y-3">
              <PhotoInspector
                title={activeCreation?.title || "Bionic Shaman in Bioluminescent Rainforest"}
                outputData={activeCreation?.outputData}
              />
            </div>
          )}

          {/* 8. SPREADSHEETS / EXCEL VIEW */}
          {(currentView === "spreadsheets" || (activeUpload && activeUpload.fileCategory === "excel")) && (
            <div className="space-y-3">
              <SpreadsheetViewer
                fileName={activeUpload?.fileName || "Global_Enterprise_AI_ARR_Metrics_2025_2026.xlsx"}
                parsedData={activeUpload?.parsedData as any}
              />
            </div>
          )}

          {/* 9. DOCUMENT Q&A CHAT VIEW */}
          {(currentView === "doc_chat" || (activeUpload && currentView !== "spreadsheets")) && (
            <div className="space-y-3">
              <DocumentChat
                upload={activeUpload || uploads[0] || {
                  id: "up_default",
                  userId: "usr_amhar_master",
                  fileName: "Quantum_Agent_Architecture_Whitepaper_v2.pdf",
                  fileType: "application/pdf",
                  fileCategory: "pdf",
                  fileSize: "4.8 MB",
                  chatHistory: [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }}
                onNewMessage={(newHist) => {
                  if (activeUpload) {
                    setUploads((prev) =>
                      prev.map((u) => (u.id === activeUpload.id ? { ...u, chatHistory: newHist } : u))
                    );
                  }
                }}
              />
            </div>
          )}

          {/* 10. PROMPT TEMPLATES LIBRARY */}
          {currentView === "templates" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Feather VIP Prompt Templates</h3>
                  <p className="text-xs text-zinc-400">Curated high-performance recipes across all 7 creation categories</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          {tpl.badge}
                        </span>
                        <span className="text-xs font-mono text-zinc-500 uppercase">{tpl.category}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                        {tpl.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{tpl.description}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500 italic truncate max-w-[180px]">
                        &ldquo;{tpl.prompt.slice(0, 35)}...&rdquo;
                      </span>
                      <button
                        onClick={() => {
                          setCreateModalType(tpl.category as CreationType);
                          setCreateModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-amber-400 hover:text-black text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        Use Template <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. CREATIONS GALLERY GRID (Overview & Modality feeds) */}
          {currentView !== "templates" && currentView !== "spreadsheets" && currentView !== "doc_chat" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Creations Gallery
                    <span className="text-xs font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-800">
                      {filteredCreations.length}
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">Click any card to inspect, interact, play, or preview</p>
                </div>
              </div>

              {/* Empty state */}
              {filteredCreations.length === 0 && !loading && (
                <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-amber-400 mb-3">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">No creations match this view</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                    Try clearing search query or click &ldquo;New Creation&rdquo; to synthesize assets with Feather Unlocked power.
                  </p>
                  <button
                    onClick={() => {
                      setCreateModalType("video");
                      setCreateModalOpen(true);
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold text-xs"
                  >
                    Synthesize First Asset
                  </button>
                </div>
              )}

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCreations.map((c) => {
                  const isCurrentActive = activeCreation?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveCreation(c)}
                      className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden p-4 flex flex-col justify-between ${
                        isCurrentActive
                          ? "border-amber-400/80 bg-zinc-900/90 shadow-xl ring-1 ring-amber-400/50"
                          : "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                    >
                      <div>
                        {/* Type & Favorite Bar */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              c.type === "video"
                                ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                                : c.type === "photo"
                                ? "bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20"
                                : c.type === "music"
                                ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                                : c.type === "app"
                                ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                                : c.type === "website"
                                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                : c.type === "game"
                                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                                : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                            }`}
                          >
                            {c.type === "video" && <Film className="h-3 w-3" />}
                            {c.type === "photo" && <ImageIcon className="h-3 w-3" />}
                            {c.type === "music" && <Music className="h-3 w-3" />}
                            {c.type === "app" && <Smartphone className="h-3 w-3" />}
                            {c.type === "website" && <Globe className="h-3 w-3" />}
                            {c.type === "game" && <Gamepad2 className="h-3 w-3" />}
                            {c.type === "research" && <SearchCode className="h-3 w-3" />}
                            {c.type}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(c.id, c.isFavorite);
                            }}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                          >
                            <Heart
                              className={`h-4 w-4 ${c.isFavorite ? "text-rose-500 fill-rose-500" : ""}`}
                            />
                          </button>
                        </div>

                        {/* Card Title & Prompt */}
                        <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                          {c.title}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {c.prompt}
                        </p>

                        {/* Visual Preview / Thumbnail */}
                        {c.type === "photo" && c.outputData?.imageUrl && (
                          <div className="mt-3 rounded-xl overflow-hidden h-32 bg-zinc-950 border border-zinc-800">
                            <img
                              src={c.outputData.imageUrl}
                              alt={c.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}

                        {c.type === "video" && c.outputData?.thumbnail && (
                          <div className="mt-3 relative rounded-xl overflow-hidden h-32 bg-zinc-950 border border-zinc-800">
                            <img
                              src={c.outputData.thumbnail}
                              alt={c.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="p-2 rounded-full bg-rose-600 text-white shadow-lg">
                                <Play className="h-4 w-4 fill-white ml-0.5" />
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {c.tags && c.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {c.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-400 border border-zinc-800/80"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Views & Delete */}
                      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Eye className="h-3.5 w-3.5 text-zinc-400" /> {c.viewsCount} views
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCreation(c.id);
                            }}
                            className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Delete creation"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 12. OMNI-UPLOAD VAULT SECTION ("Upload Anything") */}
          {(currentView === "all" || currentView === "vault") && (
            <div className="space-y-4 pt-4 border-t border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Omni-Upload Vault
                    <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      {filteredUploads.length} Files
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Upload & analyze Excel, PDF, Video, Word, Photo, and Code with instant OCR & tabular parsing
                  </p>
                </div>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all"
                >
                  <UploadCloud className="h-3.5 w-3.5" /> Upload Anything
                </button>
              </div>

              {/* Uploads Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredUploads.map((u) => {
                  const isCurrentActive = activeUpload?.id === u.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        setActiveUpload(u);
                        if (u.fileCategory === "excel") setCurrentView("spreadsheets");
                        else setCurrentView("doc_chat");
                      }}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrentActive
                          ? "border-cyan-400 bg-zinc-900/90 shadow-xl ring-1 ring-cyan-400/40"
                          : "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                              u.fileCategory === "excel"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : u.fileCategory === "pdf"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : u.fileCategory === "video"
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                : u.fileCategory === "photo"
                                ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {u.fileCategory === "excel" && <Table className="h-3 w-3" />}
                            {u.fileCategory === "pdf" && <FileText className="h-3 w-3" />}
                            {u.fileCategory === "video" && <Film className="h-3 w-3" />}
                            {u.fileCategory === "photo" && <ImageIcon className="h-3 w-3" />}
                            {u.fileCategory === "word" && <FileText className="h-3 w-3" />}
                            {u.fileCategory}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500">{u.fileSize}</span>
                        </div>

                        <h4 className="font-bold text-white text-xs md:text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors">
                          {u.fileName}
                        </h4>
                        {u.aiInsights && (
                          <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                            {u.aiInsights}
                          </p>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                        <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
                          <MessageSquareText className="h-3.5 w-3.5" />
                          {u.fileCategory === "excel" ? "Open Spreadsheet" : "Chat with File"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUpload(u.id);
                          }}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Delete file"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      <CreationModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        initialType={createModalType}
        onCreated={(newCreation) => {
          setCreations((prev) => [newCreation, ...prev]);
          setActiveCreation(newCreation);
          if (newCreation.type !== "all") {
            setCurrentView(newCreation.type);
          }
        }}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploaded={(newUpload) => {
          setUploads((prev) => [newUpload, ...prev]);
          setActiveUpload(newUpload);
          if (newUpload.fileCategory === "excel") setCurrentView("spreadsheets");
          else setCurrentView("doc_chat");
        }}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        onUserSwitched={(u) => {
          setCurrentUser(u);
          setSettingsModalOpen(false);
        }}
        onSettingsSaved={(updatedUser) => {
          setCurrentUser(updatedUser);
        }}
      />
    </div>
  );
}
