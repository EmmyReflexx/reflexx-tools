"use client";

import { useState } from "react";
import { HiOutlineDocumentText, HiOutlinePhotograph, HiOutlineClipboardCopy } from "react-icons/hi";

interface ImageResultProps {
  imageResult: string | null;
  action: "generate" | "scan";
}

export function ImageResult({ imageResult, action }: ImageResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    if (imageResult) {
      navigator.clipboard.writeText(imageResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = imageResult!;
    link.download = 'code-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
        <h3 className="text-sm font-semibold text-zinc-800">
          {action === "generate" ? "Generated Output" : "Scanned Result"}
        </h3>

        {/* Copy Button for Text/Scan Results */}
        {action === "scan" && imageResult && (
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-1 text-xs text-zinc-600 hover:text-black font-medium transition-colors cursor-pointer"
          >
            <HiOutlineClipboardCopy className="w-4 h-4" />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        )}
      </div>

      <div className="min-h-[200px] flex items-center justify-center rounded-xl bg-white border border-zinc-200 p-4">
        {!imageResult ? (
          /* Default Placeholder State */
          <div className="text-center space-y-2 text-zinc-400">
            {action === "generate" ? (
              <HiOutlinePhotograph className="w-8 h-8 mx-auto stroke-1" />
            ) : (
              <HiOutlineDocumentText className="w-8 h-8 mx-auto stroke-1" />
            )}
            <p className="text-xs font-medium">Default result will be displayed here.</p>
          </div>
        ) : action === "generate" ? (
          /* Render Output Image for Generation */
          <div className="flex flex-col items-center gap-3">
            <img
              src={imageResult}
              alt="Generated result"
              className="max-h-56 object-contain rounded-lg"
            />
            <a
              href={imageResult}
              onClick={handleDownload}
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-medium rounded-lg transition-all shadow-xs cursor-pointer"
            >
              Download Code
            </a>
          </div>
        ) : (
          /* Render Scanned Text Data */
          <div className="w-full text-left space-y-2">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Extracted Content:
            </p>
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-sm text-zinc-800 font-mono break-all max-h-48 overflow-y-auto">
              {imageResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
