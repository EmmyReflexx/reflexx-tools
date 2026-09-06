"use client";
import { useState } from "react";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { HiDownload, HiOutlineFilm, HiOutlineExclamationCircle } from "react-icons/hi";
import { PageHeading } from "../../components/PageHeading"

type VideoData = {
  title: string;
  author: string;
  platform: string;
  thumbnail: string | null;
  duration: number | null;
  best_filesize_bytes: number | null;
  worst_filesize_bytes: number | null;
  audio_filesize_bytes: number | null;
  video_link: string | null;
  audio_link: string | null;
  images: boolean;
};

const SOCIAL_MEDIA_OPTIONS = [
  { id: "facebook", name: "Facebook", icon: FaFacebook, colorClass: "text-[#1877F2]" },
  { id: "tiktok", name: "Tiktok", icon: FaTiktok, colorClass: "text-black" },
  { id: "instagram", name: "Instagram", icon: FaInstagram, colorClass: "text-[#E4405F]" },
  { id: "x", name: "X", icon: FaXTwitter, colorClass: "text-black" },
];

/**
 * Unified formatting utility
 * @param value Number to convert (bytes or seconds)
 * @param type "bytes" | "duration"
 */
// function formatData(value: number | null | undefined, type: "bytes" | "duration"): string {
//   if (!value) return type === "bytes" ? "MP3" : "0:00";

//   if (type === "duration") {
//     const mins = Math.floor(value / 60);
//     const secs = (value % 60).toFixed(0);
//     return `${mins}:${secs.padStart(2, "0")}`;
//   }

//   const k = 1024;
//   const sizes = ["B", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(value) / Math.log(k));
//   return `${(value / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
// }

// Helper function to validate URLs
function isValidUrl(string: string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function SocialMediaDownloaderPage() {
  const [inputLink, setInputLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoData, setVideoData] = useState<null | VideoData>(null);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);

  async function handleGetVideo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Input validation
    if (!inputLink) {
      setError("Please enter a link");
      return;
    }

    if (!isValidUrl(inputLink)) {
      setError("Please enter a valid URL");
      return;
    }

    downloadLinkStore()

    setIsLoading(true);
    setError(null);
    setVideoData(null);
    setThumbnailError(false);

    try {
      const response = await fetch(`/api/extract?url=${encodeURIComponent(inputLink)}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned unexpected response');
      }

      const data = await response.json();

      if (data.error || !data) {
        throw new Error(data.error || 'No data received');
      }

      setInputLink("");
      setVideoData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to fetch video. Please check the link and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function downloadLinkStore() {
    setDownloadLink(JSON.stringify(inputLink))
  }

  async function handleDownload(e: React.MouseEvent<HTMLAnchorElement>, type: string) {
    e.preventDefault();
    if (isDownloading) return;

    setIsDownloading(true);
    setError(null);

    try {
      let link = ``;
      let filename = 'download';

      if (type === "best") {
        link = `/api/download?url=${encodeURIComponent(JSON.parse(downloadLink))}&quality=best`;
        filename = `${videoData?.title || 'video'}-best.mp4`;
      } else if (type === "worst") {
        link = `/api/download?url=${encodeURIComponent(JSON.parse(downloadLink))}&quality=worst`;
        filename = `${videoData?.title || 'video'}-normal.mp4`;
      } else if (type === "mp3") {
        link = videoData?.audio_link;
        if (!link) {
          throw new Error('No audio available for this video');
        }
        filename = `${videoData?.title || 'audio'}.mp3`;
      }

      // For direct audio link, open in new tab
      if (type === "mp3" && link.startsWith('http')) {
        window.open(link, '_blank');
        setIsDownloading(false);
        return;
      }

      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const linkTag = document.createElement('a');
      linkTag.style.display = 'none';
      linkTag.href = url;
      linkTag.download = filename;
      document.body.appendChild(linkTag);
      linkTag.click();
      document.body.removeChild(linkTag);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Page Title and Description */}
      <PageHeading id={'social-downloader'} />
      {/* Available Platforms Grid */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="font-lexend-b text-[10px] sm:text-xs uppercase tracking-wider text-brand-muted text-center">
          Available Platforms
        </h2>

        {/* Display section for available social media platforms*/}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {SOCIAL_MEDIA_OPTIONS.map((platform) => (
            <div
              key={platform.id}
              className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-4 rounded-lg sm:rounded-xl border-2 border-brand-border hover:border-neon bg-white transition-all shadow-xs sm:shadow-sm"
            >
              <platform.icon className={`w-4 h-4 sm:w-6 sm:h-6 shrink-0 ${platform.colorClass}`} />
              <span className="font-lexend-b text-xs sm:text-sm text-brand-dark truncate">
                {platform.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Input Form Section for client links*/}
      <div className="max-w-2xl mx-auto pt-2 sm:pt-4 space-y-3">
        <form onSubmit={(e) => handleGetVideo(e)} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <input
            type="text"
            placeholder="Enter an available social media link..."
            className="w-full flex-1 px-3.5 sm:px-4 py-3.5 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-brand-border bg-white text-brand-dark placeholder:text-brand-muted font-lexend-r text-xs sm:text-sm outline-none focus:ring-2 focus:ring-neon transition-all"
            onChange={(e) => setInputLink(e.target.value)}
            value={inputLink}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-neon text-brand-dark font-lexend-b text-xs sm:text-sm border-2 border-neon hover:bg-neon/90 hover:border-neon/90 transition-all cursor-pointer shrink-0 shadow-xs sm:shadow-sm active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isLoading ? "cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Fetching...</span>
              </>
            ) : (
              "Get video"
            )}
          </button>
        </form>

        {/* Fixed Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border-3 border-red-300 bg-red-50 text-red-600 font-lexend-r text-xs sm:text-sm">
            <HiOutlineExclamationCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Result Display Container */}
      {isLoading ? (
        /* Loading Skeleton Component */
        <div className="max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl border-2 border-brand-border bg-white shadow-xs sm:shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start animate-pulse">
          <div className="aspect-[9/16] w-36 sm:w-44 shrink-0 rounded-xl bg-zinc-200" />
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-2">
              <div className="h-4 bg-zinc-200 rounded w-1/3 mx-auto sm:mx-0" />
              <div className="h-6 bg-zinc-200 rounded w-3/4 mx-auto sm:mx-0" />
            </div>
            <div className="space-y-2.5 pt-2">
              <div className="h-11 bg-zinc-200 rounded-xl w-full" />
              <div className="h-11 bg-zinc-200 rounded-xl w-full" />
              <div className="h-11 bg-zinc-200 rounded-xl w-full" />
            </div>
          </div>
        </div>
      ) : videoData ? (
        /* Result Card Display */
        <div className="max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl border-2 border-brand-border bg-white shadow-xs sm:shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
          {/* Thumbnail & Duration */}
          <div className="relative aspect-[9/16] w-36 sm:w-44 shrink-0 rounded-xl overflow-hidden bg-black/5 border border-brand-border">
            {videoData.thumbnail && !thumbnailError ? (
              <Image
                src={videoData.thumbnail}
                alt={videoData.title}
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-cover"
                onError={() => setThumbnailError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                <HiOutlineFilm className="w-8 h-8" />
              </div>
            )}
            {/* <span className="absolute bottom-2 right-2 bg-black/80 text-white font-lexend-b text-[10px] sm:text-xs px-2 py-0.5 rounded-md z-10">
              {formatData(videoData.duration, "duration")}
            </span> */}
          </div>

          {/* Details & Download Action Links */}
          <div className="flex-1 space-y-4 w-full text-center sm:text-left">
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <p className="font-lexend-b text-xs text-brand-muted">
                  @{videoData.author}
                </p>
                <span className="font-lexend-b text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-brand-dark border border-brand-border">
                  {videoData.platform}
                </span>
              </div>
              <h3 className="font-lexend-eb text-base sm:text-lg text-brand-dark line-clamp-2 mt-1">
                {videoData.title}
              </h3>
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href="#"
                onClick={(e) => handleDownload(e, "worst")}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-brand-border hover:border-neon bg-white transition-all group ${isDownloading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <HiDownload className="w-4 h-4 text-brand-dark" />
                  <span className="font-lexend-b text-xs sm:text-sm text-brand-dark">
                    Normal Quality
                  </span>
                </div>
                {/* <span className="font-lexend-r text-xs text-brand-muted group-hover:text-brand-dark">
                  {formatData(videoData.worst_filesize_bytes, "bytes")}
                </span> */}
              </a>

              <a
                href="#"
                onClick={(e) => handleDownload(e, "best")}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl bg-neon text-brand-dark font-lexend-b text-xs sm:text-sm border-2 border-neon hover:bg-neon/90 transition-all shadow-xs ${isDownloading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <HiDownload className="w-4 h-4 text-brand-dark" />
                  <span>High Quality</span>
                </div>
                {/* <span className="font-lexend-b text-xs text-brand-dark/80">
                  {formatData(videoData.best_filesize_bytes, "bytes")}
                </span> */}
              </a>

              <a
                href="#"
                onClick={(e) => handleDownload(e, "mp3")}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-brand-border hover:border-brand-dark bg-white transition-all group ${isDownloading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <HiDownload className="w-4 h-4 text-brand-dark" />
                  <span className="font-lexend-b text-xs sm:text-sm text-brand-dark">
                    Audio Only (MP3)
                  </span>
                </div>
                {/* <span className="font-lexend-r text-xs text-brand-muted">
                  {formatData(videoData.audio_filesize_bytes, "bytes")}
                </span> */}
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-2xl border-2 border-dashed border-brand-border bg-white text-center flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-zinc-100 text-brand-muted">
            <HiOutlineFilm className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-lexend-b text-sm sm:text-base text-brand-dark">
              Results will appear here
            </p>
            <p className="font-lexend-r text-xs text-brand-muted max-w-sm">
              Paste a link above to preview and download available media options.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}