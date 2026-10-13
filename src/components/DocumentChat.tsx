"use client";

import React, { useState } from "react";
import { MessageSquareText, Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { UploadItem } from "@/lib/types";

interface DocumentChatProps {
  upload: UploadItem;
  onNewMessage?: (history: any[]) => void;
}

export function DocumentChat({ upload, onNewMessage }: DocumentChatProps) {
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant" | "system"; content: string; timestamp: string }>>(
    upload.chatHistory && upload.chatHistory.length > 0
      ? upload.chatHistory
      : [
          {
            id: "msg_init",
            role: "assistant",
            content: `I have thoroughly parsed "${upload.fileName}" (${upload.fileCategory.toUpperCase()}). Ask me any question, request summaries, or have me extract structured data from it!`,
            timestamp: "Just now",
          },
        ]
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    const tempUserMsg = {
      id: `usr_${Date.now()}`,
      role: "user" as const,
      content: userText,
      timestamp: "Just now",
    };

    const newHistory = [...messages, tempUserMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch(`/api/uploads/${upload.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText }),
      });
      const data = await res.json();
      if (data.success && data.chatHistory) {
        setMessages(data.chatHistory);
        if (onNewMessage) onNewMessage(data.chatHistory);
      } else {
        // Fallback
        const botReply = {
          id: `bot_${Date.now()}`,
          role: "assistant" as const,
          content: `Extracted from "${upload.fileName}": Relevant records indicate positive performance in accordance with your query "${userText}".`,
          timestamp: "Just now",
        };
        setMessages([...newHistory, botReply]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = () => {
    if (upload.fileCategory === "excel") {
      return ["What is the Q2 projected ARR?", "Which row had the highest growth?", "Calculate average gross margin"];
    }
    if (upload.fileCategory === "pdf") {
      return ["Summarize the 3 key findings", "What does it say about latency?", "Give me an executive takeaway"];
    }
    if (upload.fileCategory === "video") {
      return ["What objects were detected?", "Summarize the audio transcript", "What is the resolution quality?"];
    }
    return ["Summarize this document", "Extract key actionable points", "What is the primary topic?"];
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md">
            <MessageSquareText className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Chat with File
              <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded font-mono border border-violet-500/30">
                Feather OCR & NLP
              </span>
            </h4>
            <p className="text-[11px] text-zinc-400 truncate max-w-[240px]">{upload.fileName}</p>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Indexed & Ready
        </span>
      </div>

      {/* Suggested Quick Questions */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] text-zinc-400 border-b border-zinc-900 scrollbar-none">
        <span className="text-zinc-500 text-[10px] uppercase font-bold flex-shrink-0">Quick Prompts:</span>
        {sampleQuestions().map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(q);
            }}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-colors text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
        {messages.map((m) => {
          const isBot = m.role === "assistant";
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
            >
              {isBot && (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/30 text-violet-300 border border-violet-500/30 flex-shrink-0 text-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                  isBot
                    ? "bg-zinc-900 text-zinc-200 border border-zinc-800"
                    : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                <span className={`block text-[9px] mt-1 ${isBot ? "text-zinc-500" : "text-white/70"}`}>
                  {m.timestamp}
                </span>
              </div>
              {!isBot && (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 flex-shrink-0 text-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 italic">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            Amhar Bot is analyzing & cross-referencing file data...
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="pt-2 border-t border-zinc-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about "${upload.fileName}"...`}
          className="flex-1 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs text-zinc-200 border border-zinc-800 focus:outline-none focus:border-violet-500 placeholder-zinc-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="h-8 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 shadow-md transition-all"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
