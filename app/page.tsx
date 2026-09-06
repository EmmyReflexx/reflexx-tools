"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {TOOLS} from '../utils/tools'
import {
  HiOutlineSparkles,
  HiOutlineExternalLink,
  HiOutlineSearch,
  HiFire
} from "react-icons/hi";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sort tools so all "hot: true" items appear first
  const sortedTools = useMemo(() => {
    return [...TOOLS].sort((a, b) => Number(b.hot) - Number(a.hot));
  }, []);

  // Flexible fuzzy match regex (allows missing characters or slight typos)
  const filteredTools = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return sortedTools;

    // Escapes special characters & inserts `.*` between each letter for fuzzy matching
    // e.g. "socl" -> /s.*o.*c.*l/i (matches "Social Media Downloader")
    const pattern = trimmed
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .split("")
      .join(".*");

    try {
      const fuzzyRegex = new RegExp(pattern, "i");
      return sortedTools.filter(
        (tool) =>
          fuzzyRegex.test(tool.name) ||
          fuzzyRegex.test(tool.description) ||
          fuzzyRegex.test(tool.category)
      );
    } catch {
      // Fallback to simple includes search if regex construction fails
      const lower = trimmed.toLowerCase();
      return sortedTools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(lower) ||
          tool.description.toLowerCase().includes(lower) ||
          tool.category.toLowerCase().includes(lower)
      );
    }
  }, [searchQuery, sortedTools]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 font-lexend-r text-brand-dark">
      {/* Hero Header Section */}
      <div className="text-center space-y-4 border-b border-brand-border pb-8 sm:pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-brand-border text-xs font-lexend-b text-brand-muted">
          <HiOutlineSparkles className="w-4 h-4 text-neon" />
          <span>Reflexx Ecosystem</span>
        </div>
        <h1 className="font-lexend-eb text-3xl sm:text-5xl text-brand-dark tracking-tight">
          Reflexx Tools
        </h1>
        <p className="text-sm sm:text-base text-brand-muted font-lexend-r max-w-2xl mx-auto leading-relaxed">
          A modern suite of developer and creator utilities built for speed and efficiency.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-xl mx-auto relative">
        <div className="relative flex items-center">
          <HiOutlineSearch className="w-5 h-5 text-brand-muted absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. 'social', 'qr', 'background')..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-brand-border bg-white text-xs sm:text-sm font-lexend-r outline-none focus:border-brand-dark transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 text-xs font-lexend-b text-brand-muted hover:text-brand-dark"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid Display */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border-2 border-brand-border bg-white hover:border-brand-dark transition-all shadow-xs sm:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-lexend-b text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-100 text-brand-muted border border-brand-border">
                      {tool.category}
                    </span>
                    {tool.hot && (
                      <span className="inline-flex items-center gap-1 font-lexend-b text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
                        <HiFire className="w-3 h-3 text-orange-500" />
                        <span>Hot</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-zinc-100 text-brand-dark shrink-0 group-hover:bg-neon transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-lexend-b text-sm sm:text-base text-brand-dark">
                        {tool.name}
                      </h2>
                      <p className="text-xs text-brand-muted line-clamp-2 mt-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-brand-border/60">
                  <Link
                    href={tool.href}
                    className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 font-lexend-b text-xs text-brand-dark transition-all"
                  >
                    <span>Open Tool</span>
                    <HiOutlineExternalLink className="w-4 h-4 text-brand-muted group-hover:text-brand-dark" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-brand-border rounded-2xl space-y-2">
          <p className="font-lexend-b text-sm sm:text-base text-brand-dark">
            No tools matching &quot;{searchQuery}&quot;
          </p>
          <p className="text-xs text-brand-muted">
            Try searching for another keyword or clear the search field.
          </p>
        </div>
      )}
    </div>
  );
}