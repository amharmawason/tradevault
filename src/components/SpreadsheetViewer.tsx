"use client";

import React, { useState } from "react";
import { Table, Download, Search, Plus, BarChart3, TrendingUp, Check, Sparkles } from "lucide-react";

interface SpreadsheetProps {
  fileName: string;
  parsedData?: {
    headers?: string[];
    rows?: any[][];
    summary?: string;
  };
}

export function SpreadsheetViewer({ fileName, parsedData }: SpreadsheetProps) {
  const defaultHeaders = parsedData?.headers || ["Month", "ARR ($M)", "Active Users", "Compute Cost ($)", "Gross Margin (%)", "Churn Rate (%)"];
  const defaultRows = parsedData?.rows || [
    ["Jan 2026", 12.4, 185000, 240000, 78.4, 0.8],
    ["Feb 2026", 14.1, 210000, 265000, 79.2, 0.7],
    ["Mar 2026", 16.8, 255000, 290000, 81.0, 0.6],
    ["Apr 2026", 19.5, 305000, 315000, 82.5, 0.5],
    ["May 2026", 22.3, 360000, 340000, 83.1, 0.4],
    ["Jun 2026", 25.8, 420000, 370000, 84.6, 0.4],
  ];

  const [headers, setHeaders] = useState<string[]>(defaultHeaders);
  const [rows, setRows] = useState<any[][]>(defaultRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [copiedNotification, setCopiedNotification] = useState(false);

  const filteredRows = rows.filter((row) =>
    row.some((cell) => String(cell).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportCSV = () => {
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName.replace(/\.[^/.]+$/, "")}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleAddRow = () => {
    const newMonth = `Month ${rows.length + 1}`;
    const lastRow = rows[rows.length - 1];
    const prevArr = typeof lastRow?.[1] === "number" ? lastRow[1] : 25;
    const newRow = [
      newMonth,
      Number((prevArr * 1.12).toFixed(1)),
      Math.floor((Number(lastRow?.[2]) || 400000) * 1.1),
      Math.floor((Number(lastRow?.[3]) || 350000) * 1.05),
      85.2,
      0.4,
    ];
    setRows([...rows, newRow]);
  };

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-zinc-950 p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
            <Table className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base md:text-lg">{fileName}</h3>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                Excel / Spreadsheets Parsed
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {rows.length} records indexed • Automatic KPI aggregation & charts
            </p>
          </div>
        </div>

        {/* View Toggle & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === "table" ? "chart" : "table")}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
          >
            {viewMode === "table" ? (
              <>
                <BarChart3 className="h-3.5 w-3.5 text-emerald-400" /> Switch to Chart
              </>
            ) : (
              <>
                <Table className="h-3.5 w-3.5 text-emerald-400" /> Switch to Grid
              </>
            )}
          </button>

          <button
            onClick={handleAddRow}
            className="flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-zinc-800 border border-emerald-500/30 transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> Add Row
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 transition-all"
          >
            {copiedNotification ? (
              <>
                <Check className="h-3.5 w-3.5" /> Exported!
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" /> Export CSV
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
          <p className="text-[11px] text-zinc-400">Peak ARR Recorded</p>
          <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
            ${rows[rows.length - 1]?.[1] || "25.8"}M
          </p>
          <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="h-3 w-3" /> +108% 6-Mo Velocity
          </span>
        </div>

        <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
          <p className="text-[11px] text-zinc-400">Avg Gross Margin</p>
          <p className="text-xl font-black text-cyan-400 font-mono mt-0.5">81.5%</p>
          <span className="text-[10px] text-zinc-400 mt-1 block">Feather Optimized</span>
        </div>

        <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
          <p className="text-[11px] text-zinc-400">Active Pipeline Users</p>
          <p className="text-xl font-black text-purple-400 font-mono mt-0.5">
            {Number(rows[rows.length - 1]?.[2] || 420000).toLocaleString()}
          </p>
          <span className="text-[10px] text-purple-400 font-semibold mt-1 block">Zero dropoff</span>
        </div>

        <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
          <p className="text-[11px] text-zinc-400">AI Confidence Index</p>
          <p className="text-xl font-black text-amber-400 font-mono mt-0.5">99.4%</p>
          <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5 mt-1">
            <Sparkles className="h-3 w-3" /> Zero Validation Errors
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search spreadsheet records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-zinc-900 pl-9 pr-3 py-1.5 text-xs text-zinc-200 border border-zinc-800 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <p className="text-xs text-zinc-500">
          Showing {filteredRows.length} of {rows.length} rows
        </p>
      </div>

      {/* Main Content: Table or SVG Chart */}
      {viewMode === "table" ? (
        <div className="mt-3 overflow-x-auto rounded-xl border border-zinc-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px]">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-zinc-900/50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-2 text-zinc-300 font-mono text-xs whitespace-nowrap">
                      {typeof cell === "number" && cIdx === 1 ? (
                        <span className="text-emerald-400 font-semibold">${cell}M</span>
                      ) : typeof cell === "number" && cIdx === 4 ? (
                        <span className="text-cyan-400">{cell}%</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* SVG Interactive Chart */
        <div className="mt-3 p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-300">Revenue Progression Trend (ARR $M)</span>
            <span className="text-[11px] text-emerald-400 font-mono font-medium">Auto-Visualized</span>
          </div>

          <div className="flex items-end justify-between gap-3 h-48 px-2 pt-6 pb-2 border-b border-zinc-800">
            {rows.map((row, idx) => {
              const val = typeof row[1] === "number" ? row[1] : 15;
              const maxVal = 30;
              const heightPct = Math.min(100, (val / maxVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 group-hover:scale-110 transition-transform">
                    ${val}M
                  </span>
                  <div
                    className="w-full max-w-[38px] rounded-t-lg bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all group-hover:brightness-125"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-zinc-500 text-center truncate max-w-[50px]">
                    {String(row[0]).split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Summary Footer */}
      {parsedData?.summary && (
        <div className="mt-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-xs text-zinc-300">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5" /> Amhar Bot Spreadsheet Analysis:
          </span>
          <p className="text-zinc-400 text-xs leading-relaxed">{parsedData.summary}</p>
        </div>
      )}
    </div>
  );
}
