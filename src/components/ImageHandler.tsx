"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { HiOutlineCamera, HiOutlineUpload, HiOutlineX } from "react-icons/hi";
import {
  ImageDetails,
  qrOptionTypes,
  barcodeOptionTypes,
} from "@/app/qr-and-barcode-tool/page";

const QR_SIZE_PRESETS = [
  { label: "Small (128x128)", value: "128x128" },
  { label: "Medium (256x256 - Default)", value: "256x256" },
  { label: "Standard (300x300)", value: "300x300" },
  { label: "Large (512x512)", value: "512x512" },
  { label: "HD (1024x1024)", value: "1024x1024" },
];

interface ImageUploaderProps {
  image: string;
  setImage: (image: string) => void;
  imageDetails: ImageDetails | null;
  setImageDetails: (details: ImageDetails | null) => void;
  action: "generate" | "scan";
  activeType: "qr" | "barcode";
  qrOptions: qrOptionTypes;
  setQrOptions: React.Dispatch<React.SetStateAction<qrOptionTypes>>;
  barcodeOptions: barcodeOptionTypes;
  setBarcodeOptions: React.Dispatch<React.SetStateAction<barcodeOptionTypes>>;
}

export function ImageHandler({
  image,
  setImage,
  imageDetails,
  setImageDetails,
  action,
  activeType,
  qrOptions,
  setQrOptions,
  barcodeOptions,
  setBarcodeOptions,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const processFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        setImage(result);
        if (typeof setImageDetails === "function") {
          setImageDetails({
            name: file.name,
            size: file.size,
            type: file.type,
            width: img.width,
            height: img.height,
          });
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch {
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");

    setImage(dataUrl);

    if (typeof setImageDetails === "function") {
      setImageDetails({
        name: `camera_capture_${Date.now()}.png`,
        size: Math.round((dataUrl.length * 3) / 4),
        type: "image/png",
        width: canvas.width,
        height: canvas.height,
      });
    }

    stopCamera();
  };

  const handleClear = () => {
    setImage("");
    if (typeof setImageDetails === "function") {
      setImageDetails(null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Show Generation Panel ONLY when Generate is selected */}
      {action === "generate" ? (
        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-800 border-b border-zinc-200 pb-2">
            {activeType === "qr"
              ? "QR Code Configuration"
              : "Barcode Configuration"}
          </h2>

          {activeType === "qr" ? (
            <div className="space-y-4 text-xs font-medium text-zinc-700">
              <div>
                <label className="block mb-1">Content / Data Text</label>
                <textarea
                  rows={5}
                  placeholder="Enter text, multiple paragraphs, or URL to encode..."
                  value={qrOptions.dataText}
                  onChange={(e) =>
                    setQrOptions({ ...qrOptions, dataText: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-black resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Preset Size (WxH)</label>
                  <select
                    value={qrOptions.size}
                    onChange={(e) =>
                      setQrOptions({
                        ...qrOptions,
                        size: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                  >
                    {QR_SIZE_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Foreground</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={qrOptions.fgColor}
                        onChange={(e) =>
                          setQrOptions({
                            ...qrOptions,
                            fgColor: e.target.value,
                          })
                        }
                        className="w-8 h-8 rounded border border-zinc-300 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={qrOptions.fgColor}
                        onChange={(e) =>
                          setQrOptions({
                            ...qrOptions,
                            fgColor: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded uppercase text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">Background</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={qrOptions.bgColor}
                        onChange={(e) =>
                          setQrOptions({
                            ...qrOptions,
                            bgColor: e.target.value,
                          })
                        }
                        className="w-8 h-8 rounded border border-zinc-300 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={qrOptions.bgColor}
                        onChange={(e) =>
                          setQrOptions({
                            ...qrOptions,
                            bgColor: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded uppercase text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs font-medium text-zinc-700">
              <div>
                <label className="block mb-1">Content / Data Text</label>
                <textarea
                  rows={5}
                  placeholder="Enter barcode text..."
                  value={barcodeOptions.dataText}
                  onChange={(e) =>
                    setBarcodeOptions({
                      ...barcodeOptions,
                      dataText: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-black resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Format</label>
                  <select
                    value={barcodeOptions.format}
                    onChange={(e) =>
                      setBarcodeOptions({
                        ...barcodeOptions,
                        format: e.target.value as "png" | "jpg",
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg uppercase outline-none focus:ring-2 focus:ring-black cursor-pointer"
                  >
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Padding (px)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={barcodeOptions.padding}
                    onChange={(e) =>
                      setBarcodeOptions({
                        ...barcodeOptions,
                        padding: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block mb-1">Font Size (px)</label>
                  <input
                    type="number"
                    min="8"
                    max="72"
                    value={barcodeOptions.fontSize}
                    onChange={(e) =>
                      setBarcodeOptions({
                        ...barcodeOptions,
                        fontSize: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Show Scan/Upload Layout ONLY when Scan is selected */
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-700">
            Upload {activeType === "qr" ? "QR Code" : "Barcode"} to Scan
          </h3>

          {!image ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center gap-4 bg-zinc-50 ${
                isDragging
                  ? "border-brand-dark bg-zinc-100"
                  : "border-brand-border"
              }`}
            >
              <div className="p-4 rounded-full bg-zinc-200 text-brand-dark">
                <HiOutlineUpload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-lexend-b text-sm text-brand-dark">
                  Drag and drop your image here
                </p>
                <p className="text-xs text-brand-muted">
                  Supports PNG, JPG, WEBP or SVG
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white border border-brand-border font-lexend-b text-xs text-brand-dark hover:bg-zinc-100 transition-all shadow-xs"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files?.[0]) processFile(e.target.files[0]);
                  }}
                />

                <button
                  type="button"
                  onClick={startCamera}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-brand-border font-lexend-b text-xs text-brand-dark hover:bg-zinc-100 transition-all shadow-xs"
                >
                  <HiOutlineCamera className="w-4 h-4 text-brand-muted" />
                  <span>Use Camera</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-2xl border-2 border-brand-border p-4 bg-zinc-50 flex items-center justify-center min-h-[220px]">
                <img
                  src={image}
                  alt={imageDetails?.name || "Uploaded Preview"}
                  className="max-h-52 object-contain rounded-lg"
                />
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 p-2 rounded-full bg-zinc-900/70 hover:bg-zinc-900 text-white transition-all"
                  title="Remove image"
                >
                  <HiOutlineX className="w-4 h-4" />
                </button>
              </div>

              {imageDetails && (
                <div className="p-3 rounded-xl border border-brand-border bg-zinc-50 text-xs space-y-1 font-lexend-r">
                  <div className="flex justify-between font-lexend-b text-brand-dark">
                    <span className="truncate max-w-[200px]">
                      {imageDetails.name}
                    </span>
                    <span>{formatFileSize(imageDetails.size)}</span>
                  </div>
                  <div className="flex justify-between text-brand-muted">
                    <span>Type: {imageDetails.type}</span>
                    {imageDetails.width && imageDetails.height && (
                      <span>
                        Dimensions: {imageDetails.width}x{imageDetails.height}
                        px
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Live Camera Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-md w-full space-y-4 relative">
            <div className="flex items-center justify-between border-b border-brand-border pb-2">
              <h3 className="font-lexend-b text-sm text-brand-dark">
                Take a Photo
              </h3>
              <button
                onClick={stopCamera}
                className="p-1 text-brand-muted hover:text-brand-dark"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl bg-zinc-100 font-lexend-b text-xs text-brand-dark hover:bg-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-4 py-2 rounded-xl bg-brand-dark text-white font-lexend-b text-xs hover:bg-zinc-800"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}