import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException, BarcodeFormat, DecodeHintType, Result } from '@zxing/library';

export type ScanResult = {
  code_text: string | null;
  error?: string;
};

/**
 * Scan QR code or barcode from an image using MultiFormatReader
 */
export async function scanImage(
  imageSource: File | Blob | string | HTMLImageElement,
  type: 'qr' | 'barcode' | 'both' = 'both'
): Promise<{ code_text: string | null }> {
  try {
    const img = await createImageElement(imageSource);

    // Configure formats based on the requested scan type
    const formats: BarcodeFormat[] = [];

    if (type === 'qr' || type === 'both') {
      formats.push(BarcodeFormat.QR_CODE);
    }

    if (type === 'barcode' || type === 'both') {
      formats.push(
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.CODE_93,
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.ITF,
        BarcodeFormat.CODABAR,
        BarcodeFormat.RSS_14,
        BarcodeFormat.PDF_417
      );
    }

    // Set hints correctly
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    // TRY_HARDER helps the reader scan lower quality or small barcodes
    hints.set(DecodeHintType.TRY_HARDER, true);

    // Initialize the Multi Format Reader instead of the strict QR Reader
    const reader = new BrowserMultiFormatReader(hints);

    const result = await reader.decodeFromImageElement(img);
    if (result && result.getText()) {
      return { code_text: result.getText() };
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

    if (source instanceof File || source instanceof Blob) {
      const url = URL.createObjectURL(source);
      img.src = url;
      img.onload = () => {
        resolve(img);
        URL.revokeObjectURL(url);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    } else if (typeof source === 'string') {
      img.src = source;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
    } else {
      reject(new Error('Unsupported image source type'));
    }
  });
}
