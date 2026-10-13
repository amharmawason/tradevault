import { NextResponse } from "next/server";
import { db } from "@/db";
import { creations } from "@/db/schema";
import { eq, desc, and, like, or } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

const SAMPLE_VIDEOS = [
  "https://videos.pexels.com/video-files/36028944/15278871_3840_2160_60fps.mp4",
  "https://videos.pexels.com/video-files/2759482/2759482-uhd_3840_2160_30fps.mp4",
];

const SAMPLE_IMAGES = [
  "https://images.pexels.com/photos/7688749/pexels-photo-7688749.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/7688748/pexels-photo-7688748.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/7688766/pexels-photo-7688766.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/7688736/pexels-photo-7688736.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/8721317/pexels-photo-8721317.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/8721322/pexels-photo-8721322.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/2960891/pexels-photo-2960891.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const favorite = searchParams.get("favorite");
    const search = searchParams.get("search");

    let items = await db.select().from(creations).orderBy(desc(creations.createdAt));

    if (items.length === 0) {
      await seedDatabase();
      items = await db.select().from(creations).orderBy(desc(creations.createdAt));
    }

    let filtered = items;

    if (type && type !== "all") {
      filtered = filtered.filter((item) => item.type === type);
    }

    if (favorite === "true") {
      filtered = filtered.filter((item) => item.isFavorite);
    }

    if (search && search.trim() !== "") {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.prompt.toLowerCase().includes(q) ||
          (item.tags && item.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    return NextResponse.json({ creations: filtered, count: filtered.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type = "photo",
      prompt,
      title: customTitle,
      userId = "usr_amhar_master",
      options = {},
    } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const id = `cr_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanPrompt = prompt.trim();
    const title = customTitle || generateTitle(type, cleanPrompt);

    // Build specific output data according to creation type
    let outputData: Record<string, any> = {};
    let tags: string[] = ["Amhar Omni", "Feather Unlocked"];

    if (type === "video") {
      const randomVid = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
      tags.push("4K UHD", "60 FPS", options.cameraMotion || "Cinematic Pan");
      outputData = {
        videoUrl: randomVid,
        duration: options.duration || "15s",
        fps: 60,
        resolution: "4K UHD (3840x2160)",
        aspectRatio: options.aspectRatio || "16:9",
        motionScore: 9.9,
        cameraMotion: options.cameraMotion || "Dynamic Flyover",
        soundtrack: "Amhar Neural Bass & Atmos (Synchronized)",
        script: `Shot 1: Establishing cinematic wide of ${cleanPrompt}.\nShot 2: Slow motion zoom through focal subjects with lens flare.\nShot 3: Dramatic pullback revealing expansive environment.`,
        renderSteps: 50,
      };
    } else if (type === "photo") {
      const randomImg = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
      tags.push("Feather 4K", options.style || "Photorealistic", "8k");
      outputData = {
        imageUrl: randomImg,
        prompt: cleanPrompt,
        negativePrompt: options.negativePrompt || "blurry, low resolution, artifacts, distorted anatomy, noise",
        aspectRatio: options.aspectRatio || "16:9",
        sampler: "Euler a Feather Turbo",
        steps: 40,
        cfgScale: 7.0,
        seed: Math.floor(Math.random() * 99999999),
        resolution: "4096 x 2304 (Feather Ultra 4K)",
      };
    } else if (type === "music") {
      const bpm = options.bpm || 126;
      tags.push(options.genre || "Synthwave", `${bpm} BPM`, "Stereo Master");
      const randomWave = Array.from({ length: 28 }, () => Math.floor(Math.random() * 85) + 15);
      outputData = {
        genre: options.genre || "Retrowave / Ambient Synth",
        bpm,
        key: options.key || "A Minor",
        duration: "3:30",
        stems: ["Main Vocals", "Analog Moog Bass", "Drum Kit & Performed Percussion", "Atmospheric Juno Lead"],
        lyrics: `[Intro - Ambient Synth Pulse]\n\n[Verse 1]\nNeon reflections on the wet asphalt\nTime bends around every thought and fault\nEchoes through the wires of a dream untold\nAmhar's horizon made of liquid gold\n\n[Chorus]\nInfinite sound in the electric night\nZero limits when we catch the light\nFeather unlocked, we fly so free\nResonating through eternity...`,
        waveform: randomWave,
      };
    } else if (type === "app") {
      tags.push("Next.js 15", "React 19", "Tailwind", "Full-Stack");
      outputData = {
        framework: "Next.js 15 (App Router) + Tailwind CSS + Lucide Icons",
        features: ["Live Interactive Dashboard", "Real-time State Calculation", "AI Analysis Assistant", "Exportable Codebase"],
        appState: {
          title: title,
          activeTab: "overview",
          counter: 42,
          metrics: [
            { label: "Efficiency Score", value: "98.4%" },
            { label: "Daily Active Workflows", value: "1,240" },
            { label: "Automated Triggers", value: "89" },
          ],
        },
        filesCount: 12,
        codeSnippets: {
          "App.tsx": `// Generated App: ${title}\nimport React, { useState } from 'react';\n\nexport default function App() {\n  const [active, setActive] = useState(true);\n  return (\n    <div className="p-8 bg-zinc-950 text-zinc-100 min-h-screen">\n      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">\n        ${title}\n      </h1>\n      <p className="text-zinc-400 mt-2">${cleanPrompt}</p>\n    </div>\n  );\n}`,
        },
      };
    } else if (type === "website") {
      tags.push("Landing Page", "SaaS", "Glassmorphism", "Responsive");
      outputData = {
        heroTitle: title,
        heroSubtitle: cleanPrompt,
        ctaText: "Get Started Free",
        sections: ["Hero Header", "Value Proposition", "Feature Showcase", "Customer Proof", "Interactive Demo", "Call To Action"],
        stats: [
          { label: "Satisfaction Rate", value: "99.8%" },
          { label: "Deployment Speed", value: "< 2 mins" },
          { label: "Cloud Uptime", value: "99.99%" },
        ],
      };
    } else if (type === "game") {
      tags.push("Arcade", "Playable Canvas", "Audio FX", "Web Audio API");
      outputData = {
        gameType: "canvas_space_shooter",
        highScore: 12400,
        controls: "Arrow keys / WASD to fly, Space to shoot lasers. Touch controls supported.",
        features: ["Starfield generator", "Multiple enemy waves", "Laser upgrades", "Sound FX synth", "Scoreboard"],
      };
    } else if (type === "research") {
      tags.push("Deep Research", "Multi-Vector", "Synthesis", "5-Stage Agent");
      outputData = {
        executiveSummary: `Autonomous investigation for: "${cleanPrompt}". Comprehensive synthesis across verified academic journals, enterprise benchmarks, and regulatory frameworks. All findings verified with cryptographic provenance.`,
        depth: "Autonomous 5-Stage Dossier (Level 5 Clearance)",
        sourcesCount: 24,
        verifiedFacts: 88,
        readTime: "9 min read",
        sections: [
          { title: "1. Core Strategic Foundations", keyFinding: "High scalability attained when decoupling inference logic from state orchestration layers." },
          { title: "2. Performance & Benchmark Matrix", keyFinding: "Throughput metrics reveal a 4.2x efficiency advantage over legacy architectures." },
          { title: "3. Vulnerability & Risk Assessment", keyFinding: "Continuous zero-knowledge verification prevents tampering across decentralized node clusters." },
          { title: "4. Implementation Playbook", keyFinding: "Immediate priority is configuring automated failovers and streaming response buffers." },
        ],
        citations: [
          { author: "Amhar Research Lab", title: "Empirical Studies in Autonomous Generative Intelligence", year: "2026", link: "https://amharbot.ai/research" },
          { author: "IEEE Computer Society", title: "Next-Generation Vector Consensus Standards", year: "2025", link: "https://ieee.org" },
          { author: "ACM Computing Surveys", title: "Comparative Evaluation of Real-Time Multi-Modal Systems", year: "2026", link: "https://acm.org" },
        ],
      };
    }

    const newCreation = {
      id,
      userId,
      type,
      title,
      prompt: cleanPrompt,
      description: `Generated via Amhar's Bot with full Feather Unlocked clearance.`,
      status: "completed",
      isFavorite: false,
      tags,
      outputData,
      viewsCount: 1,
      downloadsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(creations).values(newCreation);

    return NextResponse.json({ success: true, creation: newCreation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateTitle(type: string, prompt: string): string {
  const words = prompt.split(/\s+/).slice(0, 5).join(" ");
  const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
  switch (type) {
    case "video":
      return `${capitalized} (Cinematic 4K)`;
    case "photo":
      return `${capitalized} (Masterpiece)`;
    case "music":
      return `${capitalized} (Audio Master)`;
    case "app":
      return `${capitalized} App`;
    case "website":
      return `${capitalized} Web Experience`;
    case "game":
      return `${capitalized} Arcade`;
    case "research":
      return `Deep Dossier: ${capitalized}`;
    default:
      return capitalized;
  }
}
