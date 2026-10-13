"use client";

import React, { useRef, useState } from "react";
import { Film, Play, Pause, Volume2, VolumeX, Maximize2, Download, Sparkles, Video, Camera } from "lucide-react";

interface VideoPlayerProps {
  title: string;
  outputData?: any;
}

export function VideoPlayerView({ title, outputData }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<"player" | "script">("player");

  const videoUrl =
    outputData?.videoUrl ||
    "https://videos.pexels.com/video-files/36028944/15278871_3840_2160_60fps.mp4";

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-zinc-950 p-4 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-md">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
              {title}
              <span className="rounded bg-rose-500/20 text-rose-300 text-[10px] px-2 py-0.5 border border-rose-500/30 font-semibold">
                4K UHD • 60 FPS
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Camera: {outputData?.cameraMotion || "Orbital Drone Pan"} • Motion Score: {outputData?.motionScore || "9.9"}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab("player")}
              className={`px-3 py-1 rounded transition-all ${
                activeTab === "player" ? "bg-rose-500 text-white font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Video Stream
            </button>
            <button
              onClick={() => setActiveTab("script")}
              className={`px-3 py-1 rounded transition-all ${
                activeTab === "script" ? "bg-rose-500 text-white font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Director Script
            </button>
          </div>

          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Download MP4
          </a>
        </div>
      </div>

      {/* Video Content */}
      {activeTab === "player" ? (
        <div className="mt-3 relative rounded-xl overflow-hidden bg-black border border-zinc-800 group">
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            playsInline
            muted={isMuted}
            className="w-full max-h-[460px] object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Floating Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="h-10 w-10 rounded-full bg-white text-zinc-900 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-zinc-900 ml-0.5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="h-5 w-5 text-rose-400" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <span className="text-xs text-white/90 font-medium">
                  {outputData?.duration || "18s"} • 60 FPS Turbo Render
                </span>
              </div>

              <button
                onClick={handleFullscreen}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Director Script Tab */
        <div className="mt-3 p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <Camera className="h-4 w-4" /> Procedural Camera Sequence
          </div>
          <pre className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed font-sans bg-zinc-950 p-3.5 rounded-lg border border-zinc-800">
            {outputData?.script ||
              "Scene 1: Drone ascent above neon canopy.\nScene 2: High-speed traverse along magnetic hyper-rails.\nScene 3: Dramatic 360-degree orbit around the Apex Spire."}
          </pre>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-rose-400" /> Soundtrack: {outputData?.soundtrack || "Cyber Bass Pulse"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
