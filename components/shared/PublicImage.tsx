'use client';

import React from 'react';
import { type ImageProps } from 'next/image';

type PublicImageMode = 'hero' | 'primary' | 'thumb' | 'logo' | 'decorative';

type PublicImageProps = ImageProps & {
  alt?: string;
  mode?: PublicImageMode;
  unoptimized?: boolean;
};

export function PublicImage({ alt = '', ...props }: PublicImageProps) {
  const { src, className, style, mode: _mode, unoptimized: _unoptimized, ...imageProps } = props;

  // Trích xuất các props đặc thù của next/image để tránh truyền xuống thẻ <img>
  const {
    width,
    height,
    fill,
    quality: _quality,
    priority: _priority,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    loading: _loading,
    sizes: _sizes,
    ...restProps
  } = imageProps;

  // Giả lập style cho prop `fill` tương tự next/image
  const fillStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }
    : {};

  const combinedStyle = fill
    ? { ...fillStyle, ...style }
    : style;

  if (!src) {
    return null;
  }

  // Resolve src string
  let resolvedSrc = '';
  if (typeof src === 'string') {
    resolvedSrc = normalizeLocalNextImageUrl(src.trim());
  } else if (typeof src === 'object' && 'src' in src) {
    resolvedSrc = (src as any).src;
  } else {
    resolvedSrc = src as any;
  }

  if (!resolvedSrc) {
    return null;
  }

  return (
    <img
      alt={alt}
      src={resolvedSrc}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={combinedStyle}
      {...(restProps as any)}
    />
  );
}

const normalizeLocalNextImageUrl = (value: string) => {
  if (!value.includes('/_next/image?')) {
    return value;
  }

  try {
    const parsed = new URL(value, 'http://localhost');
    if (parsed.hostname !== 'localhost') {
      return value;
    }
    const original = parsed.searchParams.get('url');
    if (!original) {
      return value;
    }
    return decodeURIComponent(original);
  } catch {
    return value;
  }
};
