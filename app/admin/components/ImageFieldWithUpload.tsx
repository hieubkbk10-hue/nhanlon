'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminImage as Image } from '@/app/admin/components/AdminImage';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { ClipboardPaste, Link2, Loader2, Pencil, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input, Label, cn } from './ui';
import { prepareImageForUpload, validateImageFile } from '@/lib/image/uploadPipeline';
import { resolveNamingContext, type ImageNamingContext } from '@/lib/image/uploadNaming';
import { ImageEditorDialog } from './ImageEditorDialog';

type InputMode = 'upload' | 'url';

interface ImageFieldWithUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onStorageIdChange?: (storageId: string | undefined) => void;
  folder?: string;
  naming?: ImageNamingContext;
  label?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  quality?: number;
  placeholder?: string;
}

export function ImageFieldWithUpload({
  value,
  onChange,
  onStorageIdChange,
  folder = 'home-components',
  naming,
  label = 'Hình ảnh',
  className,
  aspectRatio = 'video',
  quality = 0.85,
  placeholder = 'https://example.com/image.jpg',
}: ImageFieldWithUploadProps) {
  const [mode, setMode] = useState<InputMode>(value?.startsWith('http') && !value?.includes('convex') ? 'url' : 'upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState(value ?? '');
  const [preview, setPreview] = useState<string | undefined>(value);
  const [currentStorageId, setCurrentStorageId] = useState<string | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveImage = useMutation(api.storage.saveImage);
  const deleteImage = useMutation(api.storage.deleteImage);

  // Sync preview with value prop
  useEffect(() => {
    setPreview(value);
    if (value && !value.includes('convex')) {
      setUrlInput(value);
    }
  }, [value]);

  const handleFileSelect = useCallback(async (file: File) => {
    const validationError = validateImageFile(file, 10);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploading(true);

    try {
      const resolvedNaming = resolveNamingContext(naming, { entityName: folder, field: 'image', index: 1 });
      const prepared = await prepareImageForUpload(file, { quality, naming: resolvedNaming });
      const uploadUrl = await generateUploadUrl();

      const response = await fetch(uploadUrl, {
        body: prepared.file,
        headers: { 'Content-Type': prepared.mimeType },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await response.json();

      const result = await saveImage({
        filename: prepared.filename,
        folder,
        height: prepared.height,
        mimeType: prepared.mimeType,
        size: prepared.size,
        storageId: storageId as Id<"_storage">,
        width: prepared.width,
      });

      const imageUrl = result.url ?? '';
      setPreview(imageUrl);
      setCurrentStorageId(storageId);
      onChange(imageUrl);
      onStorageIdChange?.(storageId);

      const savedKB = Math.round((prepared.originalSize - prepared.size) / 1024);
      if (savedKB > 0) {
        toast.success(`Tải ảnh lên thành công (tiết kiệm ${savedKB}KB)`);
      } else {
        toast.success('Tải ảnh lên thành công');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  }, [generateUploadUrl, saveImage, folder, quality, onChange, onStorageIdChange, naming]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setMode('upload');
      void handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {void handleFileSelect(file);}
  }, [handleFileSelect]);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
  }, []);

  const handleUrlApply = useCallback(() => {
    if (urlInput.trim()) {
      setPreview(urlInput.trim());
      onChange(urlInput.trim());
      setCurrentStorageId(undefined);
      onStorageIdChange?.(undefined);
    }
  }, [urlInput, onChange, onStorageIdChange]);

  // Đọc ảnh từ clipboard
  const handleClipboardPaste = useCallback(async () => {
    if (isUploading) return;
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find(t => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const ext = imageType.split('/')[1] || 'png';
          const file = new File([blob], `clipboard-${Date.now()}.${ext}`, { type: imageType });
          void handleFileSelect(file);
          return;
        }
      }
      toast.error('Clipboard không có ảnh. Hãy copy ảnh trước.');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        toast.error('Trình duyệt chặn quyền đọc clipboard.');
      } else {
        toast.error('Không đọc được clipboard. Hãy copy ảnh trước.');
      }
    }
  }, [isUploading, handleFileSelect]);

  const handleRemove = useCallback(async () => {
    // Only delete from storage if it's an uploaded image
    if (currentStorageId) {
      try {
        await deleteImage({ storageId: currentStorageId as Id<"_storage"> });
        toast.success('Đã xóa ảnh');
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    setPreview(undefined);
    setUrlInput('');
    setCurrentStorageId(undefined);
    onChange('');
    onStorageIdChange?.(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [currentStorageId, deleteImage, onChange, onStorageIdChange]);

  const aspectClasses = {
    auto: 'min-h-[180px]',
    banner: 'aspect-[21/9]',
    square: 'aspect-square',
    video: 'aspect-video',
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label + Mode Toggle */}
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex items-center gap-1.5">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() =>{  setMode('upload'); }}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
                mode === 'upload' 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Upload size={12} /> Upload
            </button>
            <button
              type="button"
              onClick={() =>{  setMode('url'); }}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
                mode === 'url' 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Link2 size={12} /> URL
            </button>
          </div>
          <button
            type="button"
            onClick={handleClipboardPaste}
            disabled={isUploading}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 disabled:opacity-50"
            title="Copy ảnh rồi click vào đây"
          >
            <ClipboardPaste size={12} /> Dán
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* URL Mode */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <Input 
            value={urlInput}
            onChange={handleUrlChange}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleUrlApply}
            disabled={!urlInput.trim()}
          >
            Áp dụng
          </Button>
        </div>
      )}

      {/* Upload Mode / Preview */}
      {preview ? (
        <div className={cn('relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700', aspectClasses[aspectRatio])}>
          <Image
            src={preview}
            alt="Preview"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex gap-2">
              {mode === 'upload' && (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => inputRef.current?.click()}
                  className="h-10 w-10"
                  title="Đổi ảnh"
                >
                  <Upload size={18} />
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => setIsEditorOpen(true)}
                className="h-10 w-10"
                title="Cắt / Xoá nền"
              >
                <Pencil size={18} />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                className="h-10 w-10"
                title="Xóa ảnh"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex flex-col items-center justify-center">
              <Loader2 size={24} className="animate-spin text-blue-500 mb-2" />
              <span className="text-sm text-slate-600">Đang nén và tải lên...</span>
            </div>
          )}
          
        </div>
      ) : (mode === 'upload' ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all',
            aspectClasses[aspectRatio],
            isDragOver 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
            isUploading && 'pointer-events-none'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
              <span className="text-sm text-slate-600">Đang nén WebP 85%...</span>
            </>
          ) : (
            <>
              <Upload size={32} className={cn("mb-2", isDragOver ? "text-blue-500" : "text-slate-400")} />
              <span className="text-sm text-slate-600 font-medium">
                {isDragOver ? 'Thả ảnh vào đây' : 'Kéo thả hoặc click để tải lên'}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                PNG, JPG, WebP tối đa 10MB • Tự động nén WebP 85%
              </span>
            </>
          )}
        </div>
      ) : null)}

      {/* Image Editor Dialog (Crop + Remove BG) */}
      {isEditorOpen && preview && (
        <ImageEditorDialog
          imageUrl={preview}
          onClose={() => setIsEditorOpen(false)}
          onApply={(editedFile) => {
            setIsEditorOpen(false);
            void handleFileSelect(editedFile);
          }}
        />
      )}
    </div>
  );
}

