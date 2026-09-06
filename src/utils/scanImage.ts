import { BrowserQRCodeReader } from '@zxing/browser';
import { NotFoundException, BarcodeFormat, DecodeHintType, Result } from '@zxing/library';

export type ScanResult = {
  code_text: string | null;
  error?: string;
};

/**
 * Scan QR code or barcode from an image
 * @param imageSource - Can be: File, Blob, URL string, base64 data URL, or HTMLImageElement
 * @param type - 'qr' for QR codes only, 'barcode' for barcodes only, or 'both' for either
 * @returns { code_text: string | null }
 */
export async function scanImage(
  imageSource: File | Blob | string | HTMLImageElement,
  type: 'qr' | 'barcode' | 'both' = 'both'
): Promise<{ code_text: string | null }> {
  try {
    // Create image element from source
    const img = await createImageElement(imageSource);
    
    let result: Result | null = null;
    
    // QR Code scanning
    if (type === 'qr' || type === 'both') {
      try {
        const qrReader = new BrowserQRCodeReader();
        result = await qrReader.decodeFromImageElement(img);
        if (result && result.getText()) {
          return { code_text: result.getText() };
        }
      } catch (error) {
        // If only QR, rethrow; otherwise try barcode
        if (type === 'qr') {
          if (error instanceof NotFoundException) {
            return { code_text: null };
          }
          throw error;
        }
      }
    }
    
    // Barcode scanning (1D barcodes) - using QR reader with hints
    if (type === 'barcode' || type === 'both') {
      try {
        // Use QR reader for barcodes too with appropriate hints
        const barcodeReader = new BrowserQRCodeReader();
        
        // Set hints for barcode formats
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.CODE_93,
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.ITF,
          BarcodeFormat.CODABAR,
          BarcodeFormat.MAXICODE,
          BarcodeFormat.PDF_417,
          BarcodeFormat.QR_CODE,
          BarcodeFormat.DATA_MATRIX,
          BarcodeFormat.AZTEC,
        ]);
        
        // @ts-ignore - trying to pass hints
        result = await barcodeReader.decodeFromImageElement(img, hints);
        if (result && result.getText()) {
          return { code_text: result.getText() };
        }
      } catch (error) {
        if (type === 'barcode') {
          if (error instanceof NotFoundException) {
            return { code_text: null };
          }
          throw error;
        }
      }
    }
    
    return { code_text: null };
    
  } catch (error) {
    if (error instanceof NotFoundException) {
      return { code_text: null };
    }
    console.error('Scan error:', error);
    return { code_text: null };
  }
}

/**
 * Helper: Convert various input types to HTMLImageElement
 */
function createImageElement(
  source: File | Blob | string | HTMLImageElement
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // If already an image element, resolve immediately
    if (source instanceof HTMLImageElement) {
      if (source.complete) {
        resolve(source);
      } else {
        source.onload = () => resolve(source);
        source.onerror = () => reject(new Error('Failed to load image'));
      }
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    
    if (source instanceof File || source instanceof Blob) {
      // Convert File/Blob to object URL
      const url = URL.createObjectURL(source);
      img.src = url;
      // Clean up after load
      img.onload = () => {
        resolve(img);
        URL.revokeObjectURL(url);
      };
    } else if (typeof source === 'string') {
      // URL or base64 data URL
      img.src = source;
    } else {
      reject(new Error('Unsupported image source type'));
    }
  });
}