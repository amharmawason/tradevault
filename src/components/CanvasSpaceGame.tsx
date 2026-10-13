"use client";

import React, { useRef, useEffect, useState } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Shield, Zap, Sparkles, Code2, Flame } from "lucide-react";
import { playSoundEffect } from "./AudioSynth";

interface GameProps {
  title?: string;
  highScoreDefault?: number;
}

export function CanvasSpaceGame({ title = "Neon Defender: Cyber Space Shooter", highScoreDefault = 14850 }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(highScoreDefault);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [powerupActive, setPowerupActive] = useState<string | null>(null);

  // Mutable game state refs for loop
  const stateRef = useRef({
    player: { x: 300, y: 340, width: 34, height: 28, speed: 6, vx: 0, shield: 100 },
    lasers: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string }>,
    enemies: [] as Array<{ x: number; y: number; width: number; height: number; speed: number; hp: number; maxHp: number; color: string }>,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number }>,
    powerups: [] as Array<{ x: number; y: number; type: "triple" | "shield" | "nuke"; speed: number }>,
    stars: [] as Array<{ x: number; y: number; speed: number; size: number; alpha: number }>,
    keys: { left: false, right: false, up: false, down: false, shoot: false },
    lastShot: 0,
    tripleShot: false,
    tripleShotTimer: 0,
    enemySpawnTimer: 0,
    score: 0,
    lives: 3,
    running: false,
  });

  const triggerSound = (type: "laser" | "explosion" | "powerup") => {
    if (soundEnabled) {
      playSoundEffect(type);
    }
  };

  const startGame = () => {
    const s = stateRef.current;
    s.player.x = 300;
    s.player.y = 340;
    s.lasers = [];
    s.enemies = [];
    s.particles = [];
    s.powerups = [];
    s.score = 0;
    s.lives = 3;
    s.running = true;
    s.tripleShot = false;

    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsPlaying(true);
    setPowerupActive(null);
  };

  const restartGame = () => {
    startGame();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize stars
    const stars: Array<{ x: number; y: number; speed: number; size: number; alpha: number }> = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * 600,
        y: Math.random() * 400,
        speed: 0.5 + Math.random() * 2,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }
    stateRef.current.stars = stars;

    // Key event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = stateRef.current.keys;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keys.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keys.right = true;
      }
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        keys.up = true;
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        keys.down = true;
      }
      if (e.key === " " || e.key === "Spacebar") {
        keys.shoot = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = stateRef.current.keys;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = false;
      if (e.key === " " || e.key === "Spacebar") keys.shoot = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear background
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      // 2. Render and update starfield
      s.stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(168, 85, 247, ${star.alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      if (s.running) {
        // Player movement
        if (s.keys.left && s.player.x > 20) s.player.x -= s.player.speed;
        if (s.keys.right && s.player.x < width - 20) s.player.x += s.player.speed;
        if (s.keys.up && s.player.y > 40) s.player.y -= s.player.speed;
        if (s.keys.down && s.player.y < height - 30) s.player.y += s.player.speed;

        // Shooting
        if (s.keys.shoot && timestamp - s.lastShot > 160) {
          s.lastShot = timestamp;
          triggerSound("laser");

          if (s.tripleShot) {
            s.lasers.push({ x: s.player.x, y: s.player.y - 12, vx: 0, vy: -9, color: "#38bdf8" });
            s.lasers.push({ x: s.player.x - 10, y: s.player.y - 8, vx: -2, vy: -8, color: "#f43f5e" });
            s.lasers.push({ x: s.player.x + 10, y: s.player.y - 8, vx: 2, vy: -8, color: "#f43f5e" });
          } else {
            s.lasers.push({ x: s.player.x - 6, y: s.player.y - 10, vx: 0, vy: -9, color: "#00f0ff" });
            s.lasers.push({ x: s.player.x + 6, y: s.player.y - 10, vx: 0, vy: -9, color: "#00f0ff" });
          }
        }

        // Spawn Enemies
        s.enemySpawnTimer++;
        if (s.enemySpawnTimer > 45) {
          s.enemySpawnTimer = 0;
          const isHeavy = Math.random() > 0.75;
          s.enemies.push({
            x: 40 + Math.random() * (width - 80),
            y: -20,
            width: isHeavy ? 36 : 24,
            height: isHeavy ? 28 : 20,
            speed: isHeavy ? 1.5 : 2.5 + Math.random() * 1.5,
            hp: isHeavy ? 4 : 1,
            maxHp: isHeavy ? 4 : 1,
            color: isHeavy ? "#ec4899" : "#e11d48",
          });
        }

        // Spawn Powerups occasionally
        if (Math.random() < 0.005 && s.powerups.length < 2) {
          const types: Array<"triple" | "shield" | "nuke"> = ["triple", "shield", "nuke"];
          s.powerups.push({
            x: 30 + Math.random() * (width - 60),
            y: -10,
            type: types[Math.floor(Math.random() * types.length)],
            speed: 1.8,
          });
        }
      }

      // Update and Draw Lasers
      for (let i = s.lasers.length - 1; i >= 0; i--) {
        const l = s.lasers[i];
        l.x += l.vx;
        l.y += l.vy;

        ctx.strokeStyle = l.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x - l.vx * 1.5, l.y - l.vy * 1.5);
        ctx.stroke();

        // Laser removal
        if (l.y < 0 || l.x < 0 || l.x > width) {
          s.lasers.splice(i, 1);
        }
      }

      // Update and Draw Enemies
      for (let i = s.enemies.length - 1; i >= 0; i--) {
        const e = s.enemies[i];
        if (s.running) e.y += e.speed;

        // Draw alien ship
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, e.height / 2);
        ctx.lineTo(-e.width / 2, -e.height / 2);
        ctx.lineTo(0, -e.height / 4);
        ctx.lineTo(e.width / 2, -e.height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Check laser collision
        for (let j = s.lasers.length - 1; j >= 0; j--) {
          const l = s.lasers[j];
          const dist = Math.hypot(e.x - l.x, e.y - l.y);
          if (dist < e.width / 2 + 6) {
            s.lasers.splice(j, 1);
            e.hp--;

            // Sparks
            for (let p = 0; p < 4; p++) {
              s.particles.push({
                x: l.x,
                y: l.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 12,
                maxLife: 12,
                color: "#fbcfe8",
                size: 2,
              });
            }

            if (e.hp <= 0) {
              triggerSound("explosion");
              // Enemy Explosion particles
              for (let p = 0; p < 18; p++) {
                s.particles.push({
                  x: e.x,
                  y: e.y,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  life: 25,
                  maxLife: 25,
                  color: e.color,
                  size: 3,
                });
              }
              const addScore = e.maxHp > 1 ? 250 : 100;
              s.score += addScore;
              setScore(s.score);
              if (s.score > highScore) {
                setHighScore(s.score);
              }
              s.enemies.splice(i, 1);
              break;
            }
          }
        }

        // Enemy hits bottom or player
        if (e.y > height + 20) {
          s.enemies.splice(i, 1);
        } else if (s.running && Math.hypot(s.player.x - e.x, s.player.y - e.y) < 24) {
          // Crash with player
          triggerSound("explosion");
          s.enemies.splice(i, 1);
          s.lives--;
          setLives(s.lives);
          if (s.lives <= 0) {
            s.running = false;
            setGameOver(true);
            setIsPlaying(false);
          }
        }
      }

      // Update & Draw Powerups
      for (let i = s.powerups.length - 1; i >= 0; i--) {
        const p = s.powerups[i];
        p.y += p.speed;

        ctx.save();
        ctx.fillStyle = p.type === "triple" ? "#38bdf8" : p.type === "shield" ? "#34d399" : "#fbbf24";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Check player pickup
        if (s.running && Math.hypot(s.player.x - p.x, s.player.y - p.y) < 22) {
          triggerSound("powerup");
          if (p.type === "triple") {
            s.tripleShot = true;
            setPowerupActive("Triple Laser Active! (10s)");
            setTimeout(() => {
              stateRef.current.tripleShot = false;
              setPowerupActive(null);
            }, 10000);
          } else if (p.type === "shield") {
            s.lives = Math.min(5, s.lives + 1);
            setLives(s.lives);
            setPowerupActive("Shield Enhanced (+1 Life)");
            setTimeout(() => setPowerupActive(null), 3000);
          } else {
            // Nuke clears enemies
            s.enemies.forEach((en) => {
              for (let n = 0; n < 10; n++) {
                s.particles.push({
                  x: en.x,
                  y: en.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 20,
                  maxLife: 20,
                  color: "#fbbf24",
                  size: 3,
                });
              }
            });
            s.score += s.enemies.length * 150;
            setScore(s.score);
            s.enemies = [];
            setPowerupActive("Emp Blast Wave!");
            setTimeout(() => setPowerupActive(null), 3000);
          }
          s.powerups.splice(i, 1);
        } else if (p.y > height + 20) {
          s.powerups.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const pt = s.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        const alpha = Math.max(0, pt.life / pt.maxLife);

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
        ctx.globalAlpha = 1.0;

        if (pt.life <= 0) {
          s.particles.splice(i, 1);
        }
      }

      // Draw Player Starship
      if (!gameOver || s.lives > 0) {
        ctx.save();
        ctx.translate(s.player.x, s.player.y);

        // Engine glow
        ctx.fillStyle = "#38bdf8";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(-6, 12);
        ctx.lineTo(0, 20 + Math.random() * 8);
        ctx.lineTo(6, 12);
        ctx.closePath();
        ctx.fill();

        // Ship hull
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(-14, 12);
        ctx.lineTo(-6, 8);
        ctx.lineTo(0, 10);
        ctx.lineTo(6, 8);
        ctx.lineTo(14, 12);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = "#818cf8";
        ctx.beginPath();
        ctx.arc(0, -2, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Overlay if game not started
      if (!s.running && !gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, width, height);

        ctx.textAlign = "center";
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 22px system-ui";
        ctx.fillText("NEON DEFENDER", width / 2, height / 2 - 25);

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "13px system-ui";
        ctx.fillText("Press Arrow Keys / WASD to Fly • Spacebar to Shoot", width / 2, height / 2 + 10);
        ctx.fillText("Touch on-screen triggers supported on mobile", width / 2, height / 2 + 30);
      }

      // Game Over Overlay
      if (gameOver) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.fillRect(0, 0, width, height);

        ctx.textAlign = "center";
        ctx.fillStyle = "#f43f5e";
        ctx.font = "bold 26px system-ui";
        ctx.fillText("SYSTEM COMPROMISED", width / 2, height / 2 - 20);

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "15px system-ui";
        ctx.fillText(`Final Score: ${s.score}`, width / 2, height / 2 + 15);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [highScore, gameOver, soundEnabled]);

  // Mobile touch buttons
  const triggerKey = (key: "left" | "right" | "up" | "down" | "shoot", state: boolean) => {
    stateRef.current.keys[key] = state;
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-zinc-950 p-4 shadow-2xl backdrop-blur-xl">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-2">
              {title}
              <span className="rounded bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 border border-cyan-500/30 font-semibold">
                Canvas 60fps
              </span>
            </h3>
            <p className="text-xs text-zinc-400">Playable Game Engine with Sound FX & High Score</p>
          </div>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="text-zinc-400">Best:</span>
            <span className="font-bold text-amber-300 font-mono">{highScore}</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-400">Score:</span>
            <span className="font-extrabold text-cyan-400 font-mono text-sm">{score}</span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Shield
                key={i}
                className={`h-4 w-4 transition-colors ${
                  i < lives ? "text-emerald-400 fill-emerald-400/30" : "text-zinc-700"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-zinc-400 hover:text-white transition-colors"
            title="Toggle SFX"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4 text-zinc-600" />}
          </button>
        </div>
      </div>

      {/* Powerup Banner */}
      {powerupActive && (
        <div className="mt-2 flex items-center justify-center gap-2 py-1 px-3 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 rounded-lg border border-cyan-500/40 text-xs font-semibold text-cyan-300 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          {powerupActive}
        </div>
      )}

      {/* Canvas Viewport */}
      <div className="mt-3 relative flex justify-center bg-black rounded-xl overflow-hidden border border-zinc-800">
        <canvas
          ref={canvasRef}
          width={600}
          height={380}
          className="w-full max-w-[600px] h-[340px] md:h-[380px] cursor-crosshair select-none"
        />

        {/* Start / Restart Float Button */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={gameOver ? restartGame : startGame}
              className="pointer-events-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all"
            >
              {gameOver ? <RotateCcw className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
              {gameOver ? "Respawn Starship" : "Launch Arcade Shooter"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Pad Controls */}
      <div className="mt-3 flex items-center justify-between gap-2 p-2 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
        <div className="flex items-center gap-1">
          <button
            onMouseDown={() => triggerKey("left", true)}
            onMouseUp={() => triggerKey("left", false)}
            onTouchStart={() => triggerKey("left", true)}
            onTouchEnd={() => triggerKey("left", false)}
            className="h-10 w-12 rounded-lg bg-zinc-800 active:bg-cyan-500 text-white font-bold flex items-center justify-center select-none shadow"
          >
            ◀
          </button>
          <div className="flex flex-col gap-1">
            <button
              onMouseDown={() => triggerKey("up", true)}
              onMouseUp={() => triggerKey("up", false)}
              onTouchStart={() => triggerKey("up", true)}
              onTouchEnd={() => triggerKey("up", false)}
              className="h-8 w-12 rounded-lg bg-zinc-800 active:bg-cyan-500 text-white font-bold flex items-center justify-center select-none shadow"
            >
              ▲
            </button>
            <button
              onMouseDown={() => triggerKey("down", true)}
              onMouseUp={() => triggerKey("down", false)}
              onTouchStart={() => triggerKey("down", true)}
              onTouchEnd={() => triggerKey("down", false)}
              className="h-8 w-12 rounded-lg bg-zinc-800 active:bg-cyan-500 text-white font-bold flex items-center justify-center select-none shadow"
            >
              ▼
            </button>
          </div>
          <button
            onMouseDown={() => triggerKey("right", true)}
            onMouseUp={() => triggerKey("right", false)}
            onTouchStart={() => triggerKey("right", true)}
            onTouchEnd={() => triggerKey("right", false)}
            className="h-10 w-12 rounded-lg bg-zinc-800 active:bg-cyan-500 text-white font-bold flex items-center justify-center select-none shadow"
          >
            ▶
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => triggerKey("shoot", true)}
            onMouseUp={() => triggerKey("shoot", false)}
            onTouchStart={() => triggerKey("shoot", true)}
            onTouchEnd={() => triggerKey("shoot", false)}
            className="h-14 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 active:scale-95 text-white font-black flex items-center gap-2 select-none shadow-lg shadow-rose-500/30"
          >
            <Flame className="h-5 w-5 fill-white" /> FIRE
          </button>
          <button
            onClick={() => setShowCode(!showCode)}
            className="h-14 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex flex-col items-center justify-center gap-1 border border-zinc-700"
          >
            <Code2 className="h-4 w-4 text-cyan-400" />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* Inspect Code Modal/Drawer */}
      {showCode && (
        <div className="mt-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
            <span className="text-cyan-400 font-semibold">NeonDefenderGameEngine.ts (Source Code)</span>
            <span className="text-[10px] text-zinc-500">60 FPS RequestAnimationFrame</span>
          </div>
          <pre className="max-h-48 overflow-y-auto text-[11px] leading-relaxed text-zinc-400">
{`// Amhar's Bot Canvas Game Engine
class SpaceDefender {
  constructor(canvas, sfx) {
    this.ctx = canvas.getContext('2d');
    this.player = { x: 300, y: 340, speed: 6, shield: 100 };
    this.lasers = [];
    this.enemies = [];
    this.particles = [];
  }

  update() {
    this.handleInput();
    this.spawnEnemies();
    this.detectCollisions();
    this.render();
  }
}`}
          </pre>
        </div>
      )}
    </div>
  );
}
