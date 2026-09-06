"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOLS } from "../utils/tools"

export default function Header() {
  const pathname = usePathname();

  function getCurrentPageToolName() {
    if (pathname === "/") return "Home";
    if (pathname === "/legal/termsofservice") return "Terms of Service";
    if (pathname === "/legal/privacypolicy") return "Privacy Policy";
    const matchedTool = TOOLS.find((tool) => tool.href === pathname);
    return matchedTool ? matchedTool.name : "404";
  }

  const pageToolName = getCurrentPageToolName();

  return (
    <header className="fixed top-0 left-0 z-50 bg-white border-b border-brand-border px-4 sm:px-6 py-3.5 sm:py-4 w-full">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-6">
        <Link href={"/"}>
          {/* Left Branding & Tool Name */}
          <div className="flex flex-col gap-1 shrink-0">
            <h1 className="font-lexend-eb text-xl sm:text-3xl tracking-tight text-brand-dark">
              Reflexx<span className="text-neon bg-brand-dark px-1.5 py-0.5 ml-1 rounded">Tools</span>
            </h1>
            <span className="font-lexend-b text-[10px] sm:text-xs tracking-wide uppercase text-brand-dark bg-neon px-2 sm:px-2.5 py-0.5 rounded w-fit">
              {pageToolName}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
