import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amhar's Bot — Sovereign AI Studio | Feather Unlocked (Zero Limits)",
  description:
    "Omnipotent AI generation bot with supreme Feather clearance. Synthesize 4K videos, photorealistic art, lossless stems music, full-stack apps, responsive websites, playable canvas games, autonomous deep research dossiers, and upload & analyze any file format.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
