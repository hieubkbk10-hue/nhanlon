import Image, { type ImageProps } from 'next/image';

type AdminImageProps = ImageProps & {
  alt?: string;
  unoptimized?: boolean;
};

export function AdminImage({ alt = '', unoptimized = true, ...props }: AdminImageProps) {
  const { src, ...imageProps } = props;

  if (typeof src === 'string') {
    const normalizedSrc = src.trim();

    if (
      !normalizedSrc
      || (!normalizedSrc.startsWith('/')
        && !normalizedSrc.startsWith('http://')
        && !normalizedSrc.startsWith('https://')
        && !normalizedSrc.startsWith('data:image/'))
    ) {
      return null;
    }

    return <Image alt={alt} unoptimized={unoptimized} src={normalizedSrc} {...imageProps} />;
  }

  if (!src) {
    return null;
  }

  return <Image alt={alt} unoptimized={unoptimized} src={src} {...imageProps} />;
}
