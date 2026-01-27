'use client';

import { formatFileSize, isValidImageSize, isValidImageType } from '@/lib/image/process';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onCancel: () => void;
  disabled?: boolean;
  maxSizeBytes?: number;
}

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export function ImageUpload({
  onImageSelect,
  onCancel,
  disabled = false,
  maxSizeBytes = MAX_SIZE,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);

      // Verifier le type
      if (!isValidImageType(file)) {
        setError('Format non supporte. Utilisez JPEG, JPG, PNG ou WebP.');
        return;
      }

      // Verifier la taille
      if (!isValidImageSize(file, maxSizeBytes)) {
        setError(`Fichier trop volumineux. Max: ${formatFileSize(maxSizeBytes)}`);
        return;
      }

      // Creer preview
      const url = URL.createObjectURL(file);
      setPreview(url);
      setSelectedFile(file);
    },
    [maxSizeBytes]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    disabled,
  });

  const handleSend = () => {
    if (selectedFile) {
      onImageSelect(selectedFile);
      handleClear();
    }
  };

  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    onCancel();
  };

  return (
    <div {...getRootProps()} className="relative">
      <input {...getInputProps()} />

      {/* Bouton d'upload */}
      <button
        type="button"
        onClick={open}
        disabled={disabled}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400 transition-colors hover:border-green-500 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Upload image"
      >
        <ImageIcon className="h-5 w-5" />
      </button>

      {/* Preview de l'image */}
      {preview && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-md border border-zinc-700 bg-zinc-900 p-2 shadow-xl">
          <div className="relative">
            <div className="relative h-48 w-full">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="rounded object-contain"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {selectedFile && (
            <p className="mt-2 text-xs text-zinc-400">
              {formatFileSize(selectedFile.size)}
            </p>
          )}

          <button
            type="button"
            onClick={handleSend}
            disabled={disabled}
            className="mt-2 w-full rounded bg-green-600 py-2 text-sm font-bold text-white transition-colors hover:bg-green-500 disabled:opacity-50"
          >
            Envoyer l'image
          </button>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-md border border-red-500 bg-red-950 p-3 shadow-xl">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-red-400">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
