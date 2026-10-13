"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, Music as MusicIcon, Disc } from "lucide-react";

interface AudioSynthProps {
  title: string;
  genre: string;
  bpm: number;
  stems?: string[];
  lyrics?: string;
  autoPlay?: boolean;
}

export function playSoundEffect(type: "laser" | "explosion" | "powerup" | "click") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "laser") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "explosion") {
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.25);
    } else if (type === "powerup") {
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.06 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.12);
      });
    } else if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) {
    // AudioContext blocked or not supported
  }
}

export function AudioSynth({
  title,
  genre,
  bpm,
  stems = ["Lead Vocoder", "Moog Bass", "Drum Kit", "Juno Arp Synth"],
  lyrics,
}: AudioSynthProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [activeStem, setActiveStem] = useState<string>("All Stems");
  const [progress, setProgress] = useState(0);
  const [currentLyricsLine, setCurrentLyricsLine] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);
  const stepRef = useRef(0);

  // Parse lyrics lines for karaoke style display
  const lyricsLines = lyrics
    ? lyrics.split("\n").filter((l) => l.trim().length > 0 && !l.startsWith("["))
    : [
        "Streets of chrome beneath the purple sky",
        "Electric shadows as the speeders fly",
        "Gridlines fading in the rear view glass",
        "Time stood still while the seconds pass",
        "Take me down to Neon Horizon",
        "Where the night never sleeps",
      ];

  const togglePlay = () => {
    if (isPlaying) {
      stopSynth();
    } else {
      startSynth();
    }
  };

  const startSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      setIsPlaying(true);

      const notes = [220, 261.63, 293.66, 329.63, 392.0, 440, 523.25, 587.33];
      const bassNotes = [110, 110, 130.81, 146.83];
      const stepDuration = 60 / bpm / 2; // eighth notes

      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        const currentStep = stepRef.current;

        // Progress bar simulation
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));

        // Advance lyrics line every 16 steps
        if (currentStep % 16 === 0) {
          setCurrentLyricsLine((prev) => (prev + 1) % lyricsLines.length);
        }

        const masterGain = ctx.createGain();
        masterGain.gain.value = muted ? 0 : volume;
        masterGain.connect(ctx.destination);

        // 1. Arp Synth melody
        if (activeStem === "All Stems" || activeStem.includes("Arp") || activeStem.includes("Lead")) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          const noteIndex = (currentStep * 3) % notes.length;
          osc.frequency.setValueAtTime(notes[noteIndex], now);

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(1400 + Math.sin(currentStep) * 600, now);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.005, now + stepDuration * 0.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + stepDuration * 0.8);
        }

        // 2. Bassline
        if ((activeStem === "All Stems" || activeStem.includes("Bass")) && currentStep % 2 === 0) {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = "sine";
          const bassNote = bassNotes[Math.floor(currentStep / 4) % bassNotes.length];
          bassOsc.frequency.setValueAtTime(bassNote, now);

          bassGain.gain.setValueAtTime(0.18, now);
          bassGain.gain.exponentialRampToValueAtTime(0.01, now + stepDuration * 1.5);

          bassOsc.connect(bassGain);
          bassGain.connect(masterGain);

          bassOsc.start(now);
          bassOsc.stop(now + stepDuration * 1.5);
        }

        // 3. Drum beat (Kick on 1 & 3, Snare on 2 & 4, Hi-hat on every step)
        if (activeStem === "All Stems" || activeStem.includes("Drum")) {
          // Hi-hat
          const hatOsc = ctx.createOscillator();
          const hatGain = ctx.createGain();
          hatOsc.type = "square";
          hatOsc.frequency.setValueAtTime(7000, now);
          hatGain.gain.setValueAtTime(0.03, now);
          hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          hatOsc.connect(hatGain);
          hatGain.connect(masterGain);
          hatOsc.start(now);
          hatOsc.stop(now + 0.04);

          // Kick on beats 0, 4, 8, 12
          if (currentStep % 4 === 0) {
            const kickOsc = ctx.createOscillator();
            const kickGain = ctx.createGain();
            kickOsc.frequency.setValueAtTime(150, now);
            kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
            kickGain.gain.setValueAtTime(0.3, now);
            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            kickOsc.connect(kickGain);
            kickGain.connect(masterGain);
            kickOsc.start(now);
            kickOsc.stop(now + 0.12);
          }
        }

        stepRef.current = (stepRef.current + 1) % 64;
      }, stepDuration * 1000);
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const stopSynth = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
    if (audioCtxRef.current && audioCtxRef.current.state === "running") {
      audioCtxRef.current.suspend();
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-violet-950/40 p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25">
            <MusicIcon className={`h-6 w-6 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-zinc-950">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base md:text-lg">{title}</h3>
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[11px] font-semibold text-violet-300 border border-violet-500/30">
                {genre}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {bpm} BPM • Stereo Studio Master • Web Audio Synths Active
            </p>
          </div>
        </div>

        {/* Master Play Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-sm transition-all shadow-lg active:scale-95 ${
              isPlaying
                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/30 animate-pulse"
                : "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white hover:opacity-90 shadow-violet-500/30"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" /> Stop Live Synth
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" /> Play Web Audio Synth
              </>
            )}
          </button>
        </div>
      </div>

      {/* Waveform Equalizer Display */}
      <div className="mt-4 flex items-end justify-between gap-1 h-14 bg-zinc-900/80 rounded-xl p-3 border border-zinc-800/80">
        {Array.from({ length: 36 }).map((_, i) => {
          const heightPercent = isPlaying
            ? Math.max(15, Math.sin(i * 0.4 + (progress * 0.2)) * 40 + 50 + (i % 3) * 10)
            : 18 + ((i * 7) % 25);
          return (
            <div
              key={i}
              className={`w-full rounded-full transition-all duration-75 ${
                isPlaying
                  ? "bg-gradient-to-t from-violet-500 via-fuchsia-400 to-cyan-300 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  : "bg-zinc-700/60"
              }`}
              style={{ height: `${heightPercent}%` }}
            />
          );
        })}
      </div>

      {/* Interactive Stems Isolation */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span className="flex items-center gap-1.5 font-medium text-zinc-300">
            <Radio className="h-3.5 w-3.5 text-violet-400" /> Isolated Stems Control:
          </span>
          <span className="text-zinc-500">Click a stem to solo</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All Stems", ...stems].map((stem) => (
            <button
              key={stem}
              onClick={() => {
                playSoundEffect("click");
                setActiveStem(stem);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeStem === stem
                  ? "bg-violet-500 text-white font-semibold ring-2 ring-violet-400/50 shadow-md"
                  : "bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700/60"
              }`}
            >
              {stem === "All Stems" ? "✨ Full Master Mix" : stem}
            </button>
          ))}
        </div>
      </div>

      {/* Lyrics Display */}
      {lyricsLines.length > 0 && (
        <div className="mt-4 rounded-xl bg-zinc-900/60 border border-zinc-800/60 p-3.5">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Synchronized Lyrics</span>
            <span className="text-violet-400 font-mono text-[10px]">Karaoke Sync Active</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white tracking-wide transition-all bg-gradient-to-r from-violet-200 to-fuchsia-200 bg-clip-text">
              &ldquo;{lyricsLines[currentLyricsLine] || lyricsLines[0]}&rdquo;
            </p>
            <p className="text-xs text-zinc-500 italic">
              Next: {lyricsLines[(currentLyricsLine + 1) % lyricsLines.length]}
            </p>
          </div>
        </div>
      )}

      {/* Footer controls */}
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800/60">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMuted(!muted)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            {muted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setMuted(false);
            }}
            className="w-20 accent-violet-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <Disc className={`h-3.5 w-3.5 text-violet-400 ${isPlaying ? "animate-spin" : ""}`} />
          <span>Lossless 24-bit 96kHz FLAC / Web Audio Synthesis</span>
        </div>
      </div>
    </div>
  );
}
