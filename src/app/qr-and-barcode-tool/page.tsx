"use client";
import { useState } from "react";
import { scanImage } from "@/utils/scanImage";
import { PageHeading } from "@/components/PageHeading";
import { ImageHandler } from "@/components/ImageHandler";
import { ImageResult } from "@/components/ImageResult";

export type ImageDetails = {
  name: string;
  size: number; // in bytes
  type: string;
  width?: number;
  height?: number;
};

export type qrOptionTypes = {
  dataText: string;
  size: string;
  fgColor: string;
  bgColor: string;
};

export type barcodeOptionTypes = {
  dataText: string;
  bgColor: string;
  padding: number;
  format: "png" | "jpg";
  fontSize: number;
};

export default function QrAndBarcodeToolPage() {
  const [activeType, setActiveType] = useState<"qr" | "barcode">("qr");
  const [action, setAction] = useState<"generate" | "scan">("generate");
  const [image, setImage] = useState("");
  const [imageResult, setImageResult] = useState("");
  const [imageDetails, setImageDetails] = useState<ImageDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // QR Code Options State
  const [qrOptions, setQrOptions] = useState<qrOptionTypes>({
    dataText: "",
    size: "256x256",
    fgColor: "#000000",
    bgColor: "#ffffff",
  });

  // Barcode Options State
  const [barcodeOptions, setBarcodeOptions] = useState<barcodeOptionTypes>({
    dataText: "",
    bgColor: "#ffffff",
    padding: 10,
    format: "png",
    fontSize: 20,
  });

  // Dynamically compute disabled state on every render
  const isDisabled =
    isLoading ||
    (action === "scan"
      ? !image.trim()
      : activeType === "qr"
        ? !qrOptions.dataText.trim()
        : !barcodeOptions.dataText.trim());

  // Preload generated image to ensure smooth UI update
  const preloadImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  // Preload scanned image to ensure smooth UI update 
  const preloadScanResult = (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // If text is valid, resolve with it
      if (text && text.trim()) {
        resolve(text);
      } else {
        reject(new Error("No QR code found in the image"));
      }
    });
  };

  // Helper function to check image size
  const getBase64Size = (base64: string): number => {
    const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
    return (base64.length * 3) / 4 - padding;
  };

  async function handleGenerate() {
    let url = "";

    if (activeType === "qr") {
      const textToEncode = qrOptions.dataText.trim();
      if (!textToEncode) {
        throw new Error("Please enter valid text or a URL for the QR code.");
      }

      const fgColor = qrOptions.fgColor.replace("#", "");
      const bgColor = qrOptions.bgColor.replace("#", "");
      const dataText = encodeURIComponent(textToEncode);
      url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrOptions.size}&color=${fgColor}&bgcolor=${bgColor}&data=${dataText}`;
    } else if (activeType === "barcode") {
      const textToEncode = barcodeOptions.dataText.trim();
      if (!textToEncode) {
        throw new Error("Please enter valid text or numbers for the barcode.");
      }

      const bgColor = barcodeOptions.bgColor.replace("#", "");
      const dataText = encodeURIComponent(textToEncode);
      url = `https://barcode.orcascan.com?data=${dataText}&type=code128&background=${bgColor}&padding=${barcodeOptions.padding}&format=${barcodeOptions.format}&fontsize=${barcodeOptions.fontSize}&text=${dataText}`;
    }

    if (url) {
      const isLoaded = await preloadImage(url);
      if (!isLoaded) {
        throw new Error("Failed to generate code image. Please try again.");
      }
      setImageResult(url);
    }
  }

  async function handleScan() {
    // Step 1: Try client-side scan first
    const scanResult = await scanImage(image, activeType === 'qr' ? 'qr' : 'barcode');

    // Step 2: If client scan returns null, try the API
    if (!scanResult.code_text) {
      // Check image size before API call
      const imageSizeBytes = getBase64Size(image);
      const imageSizeMB = imageSizeBytes / (1024 * 1024);

      if (imageSizeMB > 5) {
        throw new Error(`Image too large (${imageSizeMB.toFixed(1)}MB). Please use an image under 5MB.`);
      }

      const formBody = new URLSearchParams();
      formBody.append('image', image);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch('https://social-downloader-api-grt8.onrender.com/scan-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.toString(),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned unexpected response');
        }

        const result = await response.json();

        // If API also returns null, throw error
        if (!result.code_text) {
          throw new Error("Couldn't extract data from the image. Please try a clearer image with better lighting.");
        }

        // Preload scan result from API
        const text = await preloadScanResult(result.code_text);
        setImageResult(text);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Scan request timed out. Please try again.');
        }
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error('Network error: Could not reach scan server. Please check your connection.');
        }
        throw error;
      }
    } else {
      const text = await preloadScanResult(scanResult.code_text);
      setImageResult(text);
    }
  }

  async function handleSubmit() {
    setErrorMessage("");

    if (isDisabled) {
      if (action === "scan" && !image.trim()) {
        setErrorMessage("Please upload or capture an image to scan.");
      } else {
        setErrorMessage("Please enter valid text before generating.");
      }
      return;
    }

    setIsLoading(true);

    try {
      if (action === "generate") {
        await handleGenerate();
      } else {
        if (!image.trim()) {
          throw new Error("Please select or upload a valid image to scan.");
        }
        await handleScan();
      }
    } catch (err: unknown) {
      setImageResult("");
      if (err instanceof Error) {
        // Friendly error message for scan failures
        if (err.message.includes("Couldn't extract data") || err.message.includes("No QR code")) {
          setErrorMessage("Couldn't extract data from the image. Please try a clearer image with better lighting.");
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <PageHeading id="qr-and-barcode-generator" />

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        {/* Mode Toggle Buttons */}
        <div className="flex gap-2 bg-zinc-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveType("qr");
              setErrorMessage("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeType === "qr"
              ? "bg-black text-white shadow-sm"
              : "text-zinc-600 hover:text-black hover:bg-zinc-200/60"
              }`}
          >
            QR Code
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveType("barcode");
              setErrorMessage("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeType === "barcode"
              ? "bg-black text-white shadow-sm"
              : "text-zinc-600 hover:text-black hover:bg-zinc-200/60"
              }`}
          >
            Barcode
          </button>
        </div>

        {/* Action Selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="action-select"
            className="text-xs font-semibold text-zinc-500 uppercase tracking-wider"
          >
            Action
          </label>
          <select
            id="action-select"
            value={action}
            onChange={(e) => {
              setAction(e.target.value as "generate" | "scan");
              setErrorMessage("");
              setImageResult('')
            }}
            className="px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm font-medium text-zinc-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
          >
            <option value="generate">Generate</option>
            <option value="scan">Scan</option>
          </select>
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm animate-fadeIn">
          <svg
            className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-red-400 hover:text-red-600 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Interactive Handler */}
      <ImageHandler
        image={image}
        setImage={setImage}
        imageDetails={imageDetails}
        setImageDetails={setImageDetails}
        action={action}
        activeType={activeType}
        qrOptions={qrOptions}
        setQrOptions={setQrOptions}
        barcodeOptions={barcodeOptions}
        setBarcodeOptions={setBarcodeOptions}
      />

      {/* Primary Action Button */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleSubmit}
        className={`w-full py-3 px-4 font-medium text-sm rounded-xl transition-all shadow-sm capitalize flex items-center justify-center gap-2 ${isDisabled
          ? "bg-gray-700 text-zinc-400 cursor-not-allowed shadow-none"
          : "bg-zinc-900 hover:bg-black text-white active:scale-[0.99] cursor-pointer"
          }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>
              {action === "generate" ? "Generating..." : "Scanning..."}
            </span>
          </>
        ) : action === "generate" ? (
          `Generate ${activeType === "qr" ? "QR Code" : "Barcode"}`
        ) : (
          `Scan ${activeType === "qr" ? "QR Code" : "Barcode"}`
        )}
      </button>

      <ImageResult imageResult={imageResult} action={action} />
    </div>
  );
}