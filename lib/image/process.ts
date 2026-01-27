// lib/image/process.ts
// Traitement des images : suppression metadata + compression

export interface ProcessedImage {
  base64: string;
  mimeType: string;
  width: number;
  height: number;
  originalSize: number;
  processedSize: number;
}

export interface ImageProcessOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
}

const DEFAULT_OPTIONS: Required<ImageProcessOptions> = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  maxSizeBytes: 20 * 1024 * 1024, // 20MB
};

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

/**
 * Verifie si le fichier est une image valide
 */
export function isValidImageType(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type) ||
    file.name.toLowerCase().endsWith('.jpg') ||
    file.name.toLowerCase().endsWith('.jpeg') ||
    file.name.toLowerCase().endsWith('.png') ||
    file.name.toLowerCase().endsWith('.webp');
}

/**
 * Verifie si la taille du fichier est acceptable
 */
export function isValidImageSize(file: File, maxSizeBytes: number = DEFAULT_OPTIONS.maxSizeBytes): boolean {
  return file.size <= maxSizeBytes;
}

/**
 * Charge une image depuis un File
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calcule les nouvelles dimensions en respectant le ratio
 */
function calculateDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let newWidth = width;
  let newHeight = height;

  // Redimensionner si necessaire
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    newWidth = Math.round(width * ratio);
    newHeight = Math.round(height * ratio);
  }

  return { width: newWidth, height: newHeight };
}

/**
 * Traite une image : supprime les metadata EXIF et compresse
 * Le fait de redessiner sur un Canvas supprime automatiquement toutes les metadata
 */
export async function processImage(
  file: File,
  options: ImageProcessOptions = {}
): Promise<ProcessedImage> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Verifier le type
  if (!isValidImageType(file)) {
    throw new Error(`Type de fichier non supporte. Types acceptes: JPEG, JPG, PNG, WebP`);
  }

  // Verifier la taille
  if (!isValidImageSize(file, opts.maxSizeBytes)) {
    throw new Error(`Fichier trop volumineux. Taille max: ${opts.maxSizeBytes / 1024 / 1024}MB`);
  }

  // Charger l'image
  const img = await loadImage(file);

  // Calculer les nouvelles dimensions
  const { width, height } = calculateDimensions(
    img.width,
    img.height,
    opts.maxWidth,
    opts.maxHeight
  );

  // Creer le canvas et redessiner (supprime les metadata EXIF)
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Dessiner l'image (cela supprime toutes les metadata)
  ctx.drawImage(img, 0, 0, width, height);

  // Determiner le type de sortie
  let outputType = 'image/jpeg';
  if (file.type === 'image/png') {
    outputType = 'image/png';
  } else if (file.type === 'image/webp') {
    outputType = 'image/webp';
  }

  // Convertir en base64
  const base64 = canvas.toDataURL(outputType, opts.quality);

  // Calculer la taille du base64 (approximatif)
  const processedSize = Math.round((base64.length * 3) / 4);

  return {
    base64,
    mimeType: outputType,
    width,
    height,
    originalSize: file.size,
    processedSize,
  };
}

/**
 * Extrait les donnees base64 pures (sans le prefixe data:image/...)
 */
export function extractBase64Data(dataUrl: string): string {
  const parts = dataUrl.split(',');
  return parts[1] || '';
}

/**
 * Reconstruit une data URL a partir du base64 pur
 */
export function buildDataUrl(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Formate la taille en KB/MB lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
