'use client';

import { formatFileSize, isValidImageSize, isValidImageType } from '@/lib/image/process';
import { ImageIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
  };

  const handleSend = () => {
    if (selectedFile) {
      onImageSelect(selectedFile);
      handleClear();
    }
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onCancel();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!preview ? (
        // Bouton d'upload
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400 transition-colors hover:border-green-500 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Upload image"
        >
          <ImageIcon className="h-5 w-5" />
        </button>
      ) : (
        // Preview de l'image
        <div className="absolute bottom-full left-0 mb-2 w-64 rounded-md border border-zinc-700 bg-zinc-900 p-2 shadow-xl">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 w-full rounded object-contain"
            />
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

      {error && (
        <div className="absolute bottom-full left-0 mb-2 rounded-md border border-red-500 bg-red-950 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
