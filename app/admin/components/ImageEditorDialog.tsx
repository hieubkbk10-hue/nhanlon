'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Crop as CropIcon,
  Eraser,
  Loader2,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { Button, cn } from './ui';
import { toast } from 'sonner';
import { startRemoveBg, type RemoveBgHandle } from '@/lib/image/removeBgWorker';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ImageEditorDialogProps = {
  /** URL ảnh gốc đang hiển thị (Convex URL hoặc external) */
  imageUrl: string;
  /** Callback khi user apply ảnh đã chỉnh sửa – trả về File mới */
  onApply: (editedFile: File) => void;
  /** Đóng dialog */
  onClose: () => void;
};

type EditorTab = 'crop' | 'removebg';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Lấy crop pixel chính xác từ ảnh hiển thị → canvas output.
 */
function getCroppedCanvas(
  image: HTMLImageElement,
  crop: PixelCrop,
): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Scale giữa natural size và display size
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.round(crop.width * scaleX);
  canvas.height = Math.round(crop.height * scaleY);

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas;
}

/**
 * Fetch ảnh từ URL → Blob
 */
async function fetchImageAsBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch ảnh thất bại: ${res.status}`);
  return res.blob();
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function ImageEditorDialog({
  imageUrl,
  onApply,
  onClose,
}: ImageEditorDialogProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('crop');

  // Crop state
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Remove BG state
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [removeBgProgress, setRemoveBgProgress] = useState(0);
  const [removeBgStage, setRemoveBgStage] = useState('');
  const [removedBgUrl, setRemovedBgUrl] = useState<string | null>(null);
  const [removedBgBlob, setRemovedBgBlob] = useState<Blob | null>(null);
  const removeBgHandleRef = useRef<RemoveBgHandle | null>(null);

  // Shared
  const [isApplying, setIsApplying] = useState(false);

  // Cleanup blob URL + cancel on unmount
  useEffect(() => {
    return () => {
      if (removedBgUrl) URL.revokeObjectURL(removedBgUrl);
      removeBgHandleRef.current?.cancel();
    };
  }, [removedBgUrl]);

  /* ---- Crop handlers ---- */

  const handleApplyCrop = useCallback(() => {
    if (!completedCrop || !imgRef.current) {
      toast.error('Chưa chọn vùng cắt');
      return;
    }

    setIsApplying(true);
    try {
      const canvas = getCroppedCanvas(imgRef.current, completedCrop);
      if (!canvas) {
        toast.error('Không thể tạo ảnh cắt');
        return;
      }

      canvas.toBlob(
        (blob) => {
          setIsApplying(false);
          if (!blob) {
            toast.error('Không thể tạo ảnh cắt');
            return;
          }
          const file = new File([blob], `logo-cropped-${Date.now()}.png`, {
            type: 'image/png',
          });
          onApply(file);
        },
        'image/png',
        1,
      );
    } catch {
      setIsApplying(false);
      toast.error('Lỗi khi cắt ảnh');
    }
  }, [completedCrop, onApply]);

  /* ---- Remove BG handlers ---- */

  const handleRemoveBg = useCallback(async () => {
    if (isRemovingBg) return;
    setIsRemovingBg(true);
    setRemoveBgProgress(0);
    setRemoveBgStage('Đang tải ảnh...');

    try {
      const imageBlob = await fetchImageAsBlob(imageUrl);

      const handle = startRemoveBg(imageBlob, {
        onProgress: (stage, percent) => {
          setRemoveBgStage(stage);
          setRemoveBgProgress(percent);
        },
        onDone: (blob) => {
          const url = URL.createObjectURL(blob);
          setRemovedBgUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
          setRemovedBgBlob(blob);
          setIsRemovingBg(false);
          setRemoveBgProgress(100);
          removeBgHandleRef.current = null;
          toast.success('Xóa nền thành công!');
        },
        onError: (error) => {
          console.error('[RemoveBG] Error:', error);
          toast.error('Không thể xóa nền ảnh. Vui lòng thử lại.');
          setIsRemovingBg(false);
          setRemoveBgProgress(0);
          removeBgHandleRef.current = null;
        },
      });

      removeBgHandleRef.current = handle;
    } catch (err) {
      console.error('[RemoveBG] Fetch error:', err);
      toast.error('Không thể tải ảnh để xử lý.');
      setIsRemovingBg(false);
      setRemoveBgProgress(0);
    }
  }, [imageUrl, isRemovingBg]);

  const handleCancelRemoveBg = useCallback(() => {
    removeBgHandleRef.current?.cancel();
    removeBgHandleRef.current = null;
    setIsRemovingBg(false);
    setRemoveBgProgress(0);
    setRemoveBgStage('');
  }, []);

  const handleApplyRemovedBg = useCallback(() => {
    if (!removedBgBlob) {
      toast.error('Chưa xóa nền');
      return;
    }

    const file = new File(
      [removedBgBlob],
      `logo-nobg-${Date.now()}.png`,
      { type: 'image/png' },
    );
    onApply(file);
  }, [removedBgBlob, onApply]);

  const handleResetRemoveBg = useCallback(() => {
    if (removedBgUrl) URL.revokeObjectURL(removedBgUrl);
    setRemovedBgUrl(null);
    setRemovedBgBlob(null);
    setRemoveBgProgress(0);
    setRemoveBgStage('');
  }, [removedBgUrl]);

  /* ---- Render ---- */

  const tabs: { key: EditorTab; label: string; icon: React.ReactNode }[] = [
    { key: 'crop', label: 'Cắt ảnh', icon: <CropIcon size={15} /> },
    { key: 'removebg', label: 'Xóa nền', icon: <Eraser size={15} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Chỉnh sửa ảnh
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors',
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-5 py-4">
          {activeTab === 'crop' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Kéo chuột trên ảnh để chọn vùng cần giữ lại.
              </p>
              <div className="flex justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Chỉnh sửa"
                    className="max-h-[50vh] rounded"
                    crossOrigin="anonymous"
                  />
                </ReactCrop>
              </div>
            </div>
          )}

          {activeTab === 'removebg' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                AI sẽ tự động nhận diện và xóa nền ảnh. Lần đầu có thể mất 10-30 giây để tải model.
              </p>

              <div className="flex justify-center bg-[repeating-conic-gradient(#e2e8f0_0%_25%,transparent_0%_50%)] dark:bg-[repeating-conic-gradient(#334155_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] rounded-lg p-3 min-h-[200px] items-center">
                {removedBgUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={removedBgUrl}
                    alt="Ảnh đã xóa nền"
                    className="max-h-[50vh] rounded"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imageUrl}
                    alt="Ảnh gốc"
                    className="max-h-[50vh] rounded"
                    crossOrigin="anonymous"
                  />
                )}
              </div>

              {/* Progress bar khi đang xử lý */}
              {isRemovingBg && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" />
                      {removeBgStage || 'Đang khởi tạo...'}
                    </span>
                    <span className="font-mono">{removeBgProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${removeBgProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelRemoveBg}
                      className="text-xs text-slate-500"
                    >
                      <X size={14} className="mr-1" />
                      Hủy
                    </Button>
                  </div>
                </div>
              )}

              {!removedBgUrl && !isRemovingBg && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleRemoveBg}
                    disabled={isRemovingBg}
                    variant="outline"
                    className="gap-2"
                  >
                    <Eraser size={15} />
                    Xóa nền
                  </Button>
                </div>
              )}

              {removedBgUrl && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetRemoveBg}
                    className="gap-1.5 text-slate-500"
                  >
                    <RotateCcw size={14} />
                    Hoàn tác
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-700">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>

          {activeTab === 'crop' && (
            <Button
              type="button"
              onClick={handleApplyCrop}
              disabled={!completedCrop || isApplying}
              className="gap-1.5"
            >
              {isApplying ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
              Áp dụng cắt
            </Button>
          )}

          {activeTab === 'removebg' && (
            <Button
              type="button"
              onClick={handleApplyRemovedBg}
              disabled={!removedBgBlob}
              className="gap-1.5"
            >
              <Check size={15} />
              Áp dụng xóa nền
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
