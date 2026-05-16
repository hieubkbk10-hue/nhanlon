'use client';

import React from 'react';
import { AdminImage as Image } from '@/app/admin/components/AdminImage';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '../../../components/ui';
import { SectionHeader } from '../../_shared/components/SectionHeader';
import type { PreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import type { TeamColorTokens } from '../_lib/colors';
import type {
  TeamBrandMode,
  TeamEditorMember,
  TeamMember,
  TeamStyle,
} from '../_types';

type TeamSharedContext = 'preview' | 'site';

type TeamSocialPlatform = 'facebook' | 'linkedin' | 'twitter' | 'email';

interface TeamSectionSharedProps {
  members: Array<TeamMember | TeamEditorMember>;
  style: TeamStyle;
  title: string;
  tokens: TeamColorTokens;
  mode: TeamBrandMode;
  context: TeamSharedContext;
  device?: PreviewDevice;
  carouselId?: string;
  texts?: Record<string, string>;
  skipHeader?: boolean;
  // Header props
  hideHeader?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  headerAlign?: 'left' | 'center' | 'right';
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

interface NormalizedTeamMember {
  key: string;
  name: string;
  role: string;
  avatar: string;
  avatarType?: string;
  avatarIcon?: string;
  bio: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  email: string;
}

const toText = (value: unknown) => {
  if (typeof value === 'string') {return value;}
  if (typeof value === 'number') {return String(value);}
  return '';
};

const toMemberRecord = (raw: unknown): Record<string, unknown> => {
  if (typeof raw === 'object' && raw !== null) {
    return raw as Record<string, unknown>;
  }

  return {};
};

const buildMemberKey = (raw: Record<string, unknown>, member: Omit<NormalizedTeamMember, 'key'>, index: number) => {
  const idCandidate = raw.id ?? raw.key;

  if (typeof idCandidate === 'string' && idCandidate.trim().length > 0) {
    return `id:${idCandidate.trim()}`;
  }

  if (typeof idCandidate === 'number' && Number.isFinite(idCandidate)) {
    return `id:${idCandidate}`;
  }

  const contentKey = `${member.name.trim()}|${member.role.trim()}|${member.email.trim()}`;
  if (contentKey.replaceAll('|', '').length > 0) {
    return `content:${contentKey}`;
  }

  return `idx:${index}`;
};

const normalizeMembers = (input: Array<TeamMember | TeamEditorMember>): NormalizedTeamMember[] => {
  const duplicates = new Map<string, number>();

  return input.map((rawInput, index) => {
    const raw = toMemberRecord(rawInput);
    const member = {
      name: toText(raw.name),
      role: toText(raw.role),
      avatar: toText(raw.avatar),
      bio: toText(raw.bio),
      facebook: toText(raw.facebook),
      linkedin: toText(raw.linkedin),
      twitter: toText(raw.twitter),
      email: toText(raw.email),
    };

    const baseKey = buildMemberKey(raw, member, index);
    const count = duplicates.get(baseKey) ?? 0;
    duplicates.set(baseKey, count + 1);

    return {
      key: count === 0 ? baseKey : `${baseKey}::${count}`,
      name: toText(raw.name),
      role: toText(raw.role),
      avatar: toText(raw.avatar),
      avatarType: toText(raw.avatarType) || 'upload',
      avatarIcon: toText(raw.avatarIcon) || undefined,
      bio: toText(raw.bio),
      facebook: toText(raw.facebook),
      linkedin: toText(raw.linkedin),
      twitter: toText(raw.twitter),
      email: toText(raw.email),
    };
  });
};

const getInitial = (name: string) => {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : 'U';
};

const getSocialHref = (platform: TeamSocialPlatform, rawValue: string) => {
  const value = rawValue.trim();
  if (!value) {return null;}

  if (platform === 'email') {
    if (!value.includes('@')) {return null;}
    return `mailto:${value}`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(value)) {
    return `https://${value}`;
  }

  return null;
};

const renderSocialIcon = (platform: TeamSocialPlatform, size: number) => {
  if (platform === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" className="shrink-0" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }

  if (platform === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" className="shrink-0" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </svg>
    );
  }

  if (platform === 'twitter') {
    return (
      <svg viewBox="0 0 24 24" className="shrink-0" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="shrink-0" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
};

const TeamSocialButton = ({
  platform,
  value,
  context,
  tokens,
  sizeClass = 'w-8 h-8',
  iconSize = 14,
}: {
  platform: TeamSocialPlatform;
  value: string;
  context: TeamSharedContext;
  tokens: TeamColorTokens;
  sizeClass?: string;
  iconSize?: number;
}) => {
  const href = getSocialHref(platform, value);

  if (!href) {
    return null;
  }

  const icon = renderSocialIcon(platform, iconSize);
  const className = cn('inline-flex items-center justify-center rounded-full border transition-transform hover:scale-105', sizeClass);
  const style: React.CSSProperties = {
    backgroundColor: tokens.socialButtonBg,
    borderColor: tokens.socialButtonBorder,
    color: tokens.socialButtonIcon,
  };

  if (context === 'site') {
    const isMail = href.startsWith('mailto:');

    return (
      <a
        href={href}
        className={className}
        style={style}
        target={isMail ? undefined : '_blank'}
        rel={isMail ? undefined : 'noopener noreferrer'}
        aria-label={platform}
      >
        {icon}
      </a>
    );
  }

  return (
    <span className={className} style={style} aria-label={platform}>
      {icon}
    </span>
  );
};

// Social button style cho Layout 1: xám mặc định, hover đổi màu brand
const TeamSocialButtonNeutral = ({
  platform,
  value,
  context,
  brandColor,
}: {
  platform: TeamSocialPlatform;
  value: string;
  context: TeamSharedContext;
  brandColor: string;
}) => {
  const href = getSocialHref(platform, value);
  const [hovered, setHovered] = React.useState(false);

  if (!href) { return null; }

  const icon = renderSocialIcon(platform, 15);
  const style: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    color: hovered ? brandColor : '#9ca3af',
    transition: 'color 0.18s ease',
  };
  const cls = 'inline-flex items-center justify-center w-9 h-9 rounded-full border';

  if (context === 'site') {
    const isMail = href.startsWith('mailto:');
    return (
      <a href={href} className={cls} style={style} aria-label={platform}
        target={isMail ? undefined : '_blank'} rel={isMail ? undefined : 'noopener noreferrer'}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {icon}
      </a>
    );
  }
  return (
    <span className={cls} style={style} aria-label={platform}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {icon}
    </span>
  );
};

const TeamAvatar = ({
  member,
  tokens,
  context,
  className,
  sizes,
}: {
  member: NormalizedTeamMember;
  tokens: TeamColorTokens;
  context: TeamSharedContext;
  className: string;
  sizes: string;
}) => {
  // Icon avatar
  if (member.avatarType === 'icon') {
    const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
      Star: ({ size, style }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={style}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    };
    const LucideIconMap: Record<string, string> = {
      Star: '⭐', Award: '🏆', Crown: '👑', Briefcase: '💼', Building: '🏢',
      Layers: '📚', Lightbulb: '💡', Palette: '🎨', Camera: '📷', Zap: '⚡', Sparkles: '✨',
    };
    void iconMap;
    const emoji = LucideIconMap[member.avatarIcon || 'Star'] || '⭐';
    return (
      <div className="h-full w-full flex items-center justify-center text-3xl"
        style={{ backgroundColor: tokens.avatarFallbackBg }}>
        {emoji}
      </div>
    );
  }

  if (member.avatar.trim().length > 0) {
    // Ảnh local /demo/ không nên cache bởi Next.js Image optimizer
    // vì file có thể bị replace cùng tên → luôn dùng unoptimized
    const isLocalDemo = member.avatar.startsWith('/demo/');
    return (
      <Image
        src={member.avatar}
        alt={member.name || 'Team member'}
        fill
        sizes={sizes}
        className={className}
        unoptimized={context === 'preview' || isLocalDemo}
        draggable={false}
      />
    );
  }

  return (
    <div
      className="h-full w-full flex items-center justify-center text-3xl font-bold"
      style={{
        backgroundColor: tokens.avatarFallbackBg,
        color: tokens.avatarFallbackText,
      }}
    >
      {getInitial(member.name)}
    </div>
  );
};

const getPreviewLimit = (style: TeamStyle, device: PreviewDevice) => {
  if (style === 'carousel') {
    if (device === 'mobile') {return 5;}
    if (device === 'tablet') {return 6;}
    return 8;
  }

  if (style === 'bento') {
    if (device === 'mobile') {return 6;}
    if (device === 'tablet') {return 8;}
    return 9;
  }

  if (device === 'mobile') {return 4;}
  if (device === 'tablet') {return 6;}
  return 8;
};

export function TeamSectionShared({
  members,
  style,
  title,
  tokens,
  mode,
  context,
  device = 'desktop',
  carouselId: _carouselId,
  texts = {},
  skipHeader = false,
  hideHeader = false,
  showTitle = true,
  showSubtitle = true,
  subtitle: subtitleProp,
  headerAlign = 'left',
  titleColorPrimary = false,
  subtitleAboveTitle = false,
  uppercaseText = false,
  showBadge = false,
  badgeText = '',
}: TeamSectionSharedProps) {
  const isPreview = context === 'preview';
  const isMobilePreview = isPreview && device === 'mobile';
  const isTabletPreview = isPreview && device === 'tablet';
  const heading = title.trim() || 'Đội ngũ của chúng tôi';
  // Ưu tiên subtitle từ prop header config, fallback texts.subtitle (legacy)
  const subtitleText = subtitleProp !== undefined ? subtitleProp : (texts.subtitle || '');
  const emptyMessage = texts.emptyMessage || 'Chưa có thành viên nào.';

  const normalizedMembers = React.useMemo(() => normalizeMembers(members), [members]);

  const visibleMembers = React.useMemo(() => {
    if (!isPreview) {
      return normalizedMembers;
    }

    return normalizedMembers.slice(0, getPreviewLimit(style, device));
  }, [normalizedMembers, isPreview, style, device]);

  const _carouselIdSeed = React.useId().replaceAll(':', '');

  const basePadding = isPreview
    ? cn('py-7 md:py-8', isMobilePreview ? 'px-3' : 'px-4 md:px-6')
    : skipHeader
      ? 'pb-12 md:pb-16 px-4 md:px-6'   // header đã render ngoài → bỏ pt
      : 'py-12 md:py-16 px-4 md:px-6';

  const sharedHeader = hideHeader ? null : (
    <SectionHeader
      title={heading}
      subtitle={subtitleText}
      headerAlign={headerAlign}
      titleColorPrimary={titleColorPrimary}
      subtitleAboveTitle={subtitleAboveTitle}
      uppercaseText={uppercaseText}
      showTitle={showTitle}
      showSubtitle={showSubtitle}
      showBadge={showBadge}
      badgeText={badgeText}
      brandColor={tokens.primary}
    />
  );

  if (visibleMembers.length === 0) {
    return (
      <section className={basePadding} data-mode={mode}>
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl border px-6 py-10 text-center"
            style={{
              backgroundColor: tokens.cardBackground,
              borderColor: tokens.cardBorder,
            }}
          >
            <Users className="mx-auto mb-3" size={40} style={{ color: tokens.sectionAccent }} />
            <h3 className="text-xl font-semibold" style={{ color: tokens.heading }}>{heading}</h3>
            <p className="mt-1 text-sm" style={{ color: tokens.mutedText }}>{emptyMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  const renderGrid = () => {
    const sectionBg = `${tokens.primary}0d`;
    // Card width cho từng breakpoint preview
    const cardWidth = isPreview
      ? (isMobilePreview ? 180 : (isTabletPreview ? 220 : 260))
      : 280;

    // Dùng Embla chỉ khi có >= 1 member; luôn 1 hàng ngang
    const GridCarousel = () => {
      const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
      });
      const [canScrollPrev, setCanScrollPrev] = React.useState(false);
      const [canScrollNext, setCanScrollNext] = React.useState(false);

      React.useEffect(() => {
        if (!emblaApi) { return; }
        const update = () => {
          setCanScrollPrev(emblaApi.canScrollPrev());
          setCanScrollNext(emblaApi.canScrollNext());
        };
        update();
        emblaApi.on('select', update);
        emblaApi.on('reInit', update);
        return () => { emblaApi.off('select', update); emblaApi.off('reInit', update); };
      }, [emblaApi]);

      return (
        <section className={basePadding} data-mode={mode} style={{ backgroundColor: sectionBg }}>
          {!skipHeader && (
            <div className="max-w-7xl mx-auto mb-5 flex items-end justify-between gap-3">
              <div className="flex-1 min-w-0">{sharedHeader}</div>
              {(canScrollPrev || canScrollNext) && (
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" aria-label="Trước"
                    disabled={!canScrollPrev}
                    onClick={() => emblaApi?.scrollPrev()}
                    className={cn(
                      'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all',
                      canScrollPrev
                        ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                        : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed',
                    )}>
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" aria-label="Tiếp"
                    disabled={!canScrollNext}
                    onClick={() => emblaApi?.scrollNext()}
                    className={cn(
                      'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all',
                      canScrollNext
                        ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                        : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed',
                    )}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="max-w-7xl mx-auto overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-5">
              {visibleMembers.map((member) => (
                <article
                  key={member.key}
                  className="group shrink-0"
                  style={{ width: cardWidth }}
                >
                  <div
                    className="relative mb-3 overflow-hidden rounded-xl"
                    style={{ aspectRatio: '3/4', backgroundColor: tokens.cardBackground }}
                  >
                    <TeamAvatar
                      member={member}
                      tokens={tokens}
                      context={context}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 50vw, 280px"
                    />
                  </div>
                  <p
                    className={cn('text-xs font-medium mb-0.5 line-clamp-1', uppercaseText && 'uppercase')}
                    style={{ color: tokens.styleAccentByStyle.grid }}
                  >
                    {member.role || 'Chức vụ'}
                  </p>
                  <h3
                    className="font-bold line-clamp-1 mb-2"
                    style={{ color: tokens.neutralText, fontSize: isPreview ? (isMobilePreview ? '0.85rem' : '1rem') : '1.05rem' }}
                  >
                    {member.name || 'Thành viên'}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <TeamSocialButtonNeutral platform="facebook" value={member.facebook} context={context} brandColor={tokens.primary} />
                    <TeamSocialButtonNeutral platform="linkedin" value={member.linkedin} context={context} brandColor={tokens.primary} />
                    <TeamSocialButtonNeutral platform="twitter" value={member.twitter} context={context} brandColor={tokens.primary} />
                    <TeamSocialButtonNeutral platform="email" value={member.email} context={context} brandColor={tokens.primary} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    };

    return <GridCarousel />;
  };

  const renderCards = () => {
    const columns = isPreview
      ? (isMobilePreview ? 'grid-cols-2' : (isTabletPreview ? 'grid-cols-2' : 'grid-cols-3'))
      : 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3';

    const imgSize = isPreview ? (isMobilePreview ? 56 : 68) : 80;
    const fontSize = isPreview ? (isMobilePreview ? '0.78rem' : '0.82rem') : '0.9rem';
    const roleSize = isPreview ? '0.7rem' : '0.78rem';

    // Sub-component để có useState hover
    const MemberCard = ({ member }: { member: typeof visibleMembers[number] }) => {
      const [hovered, setHovered] = React.useState(false);
      const hasSocial = member.facebook || member.linkedin || member.twitter || member.email;
      return (
        <article
          className="rounded-xl border p-3.5 h-full flex flex-col cursor-default transition-all duration-200"
          style={{
            backgroundColor: hovered ? `${tokens.primary}0d` : '#f3f4f6',
            borderColor: hovered ? tokens.primary : 'transparent',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Ảnh + tên/role */}
          <div className="flex items-center gap-3">
            <div
              className="relative shrink-0 overflow-hidden rounded-xl"
              style={{ width: imgSize, height: imgSize }}
            >
              <TeamAvatar
                member={member}
                tokens={tokens}
                context={context}
                className="h-full w-full object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold line-clamp-1 leading-tight"
                style={{ color: tokens.neutralText, fontSize }}
              >
                {member.name || 'Thành viên'}
              </h3>
              <p
                className="line-clamp-1 mt-0.5"
                style={{ color: tokens.styleAccentByStyle.cards, fontSize: roleSize }}
              >
                {member.role || 'Chức vụ'}
              </p>
            </div>
          </div>

          {/* Bio */}
          {member.bio && (
            <p
              className="mt-2 line-clamp-2"
              style={{ color: tokens.mutedText, fontSize: roleSize }}
            >
              {member.bio}
            </p>
          )}

          {/* Social icons — luôn hiện, hover từng icon đổi màu brand */}
          {hasSocial && (
            <div className="mt-2.5 flex items-center gap-1.5">
              <TeamSocialButtonNeutral platform="facebook" value={member.facebook} context={context} brandColor={tokens.primary} />
              <TeamSocialButtonNeutral platform="linkedin" value={member.linkedin} context={context} brandColor={tokens.primary} />
              <TeamSocialButtonNeutral platform="twitter" value={member.twitter} context={context} brandColor={tokens.primary} />
              <TeamSocialButtonNeutral platform="email" value={member.email} context={context} brandColor={tokens.primary} />
            </div>
          )}
        </article>
      );
    };

    return (
      <section className={basePadding} data-mode={mode}>
        {!skipHeader && sharedHeader}
        <div className={cn('max-w-7xl mx-auto grid gap-3 -mt-4', columns)}>
          {visibleMembers.map((member) => (
            <MemberCard key={member.key} member={member} />
          ))}
        </div>
      </section>
    );
  };

  const renderCarousel = () => {
    const cardWidth = isPreview
      ? (isMobilePreview ? 260 : (isTabletPreview ? 280 : 300))
      : 312;

    const EmblaCarousel = () => {
      const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
      });
      const [canScrollPrev, setCanScrollPrev] = React.useState(false);
      const [canScrollNext, setCanScrollNext] = React.useState(false);

      React.useEffect(() => {
        if (!emblaApi) { return; }
        const update = () => {
          setCanScrollPrev(emblaApi.canScrollPrev());
          setCanScrollNext(emblaApi.canScrollNext());
        };
        update();
        emblaApi.on('select', update);
        emblaApi.on('reInit', update);
        return () => { emblaApi.off('select', update); emblaApi.off('reInit', update); };
      }, [emblaApi]);

      const NavButtons = () => (canScrollPrev || canScrollNext) ? (
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" aria-label="Trước"
            disabled={!canScrollPrev}
            onClick={() => emblaApi?.scrollPrev()}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all',
              canScrollPrev
                ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed',
            )}>
            <ChevronLeft size={16} />
          </button>
          <button type="button" aria-label="Tiếp"
            disabled={!canScrollNext}
            onClick={() => emblaApi?.scrollNext()}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all',
              canScrollNext
                ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed',
            )}>
            <ChevronRight size={16} />
          </button>
        </div>
      ) : null;

      return (
        <section className={basePadding} data-mode={mode}>
          <div className="max-w-7xl mx-auto">
            {/* Header + nav — header ẩn khi skipHeader, nav luôn hiện */}
            <div className={cn('flex items-end justify-between gap-3', skipHeader ? 'mb-1' : 'mb-5')}>
              <div className="flex-1 min-w-0">
                {!skipHeader && sharedHeader}
              </div>
              <NavButtons />
            </div>

            {/* Embla viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {visibleMembers.map((member) => (
                  <article
                    key={member.key}
                    className="shrink-0 rounded-2xl border overflow-hidden"
                    style={{
                      width: cardWidth,
                      backgroundColor: tokens.cardBackground,
                      borderColor: tokens.cardBorder,
                      borderBottomColor: tokens.styleAccentByStyle.carousel,
                      borderBottomWidth: 3,
                    }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <TeamAvatar
                        member={member}
                        tokens={tokens}
                        context={context}
                        className="h-full w-full object-cover"
                        sizes="(max-width: 768px) 90vw, 312px"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1" style={{ color: tokens.neutralText }}>{member.name || 'Thành viên'}</h3>
                      <p className="text-sm mt-0.5 line-clamp-1" style={{ color: tokens.roleText }}>{member.role || 'Chức vụ'}</p>
                      {member.bio ? (
                        <p className="text-xs mt-2 line-clamp-2" style={{ color: tokens.mutedText }}>{member.bio}</p>
                      ) : null}
                      <div className="mt-3 pt-3 border-t flex items-center gap-2" style={{ borderColor: tokens.cardBorder }}>
                        <TeamSocialButton platform="facebook" value={member.facebook} context={context} tokens={tokens} sizeClass="w-7 h-7" iconSize={12} />
                        <TeamSocialButton platform="linkedin" value={member.linkedin} context={context} tokens={tokens} sizeClass="w-7 h-7" iconSize={12} />
                        <TeamSocialButton platform="twitter" value={member.twitter} context={context} tokens={tokens} sizeClass="w-7 h-7" iconSize={12} />
                        <TeamSocialButton platform="email" value={member.email} context={context} tokens={tokens} sizeClass="w-7 h-7" iconSize={12} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    };

    return <EmblaCarousel />;
  };

  // const renderBento = () => {
  //   const columns = isPreview
  //     ? (isMobilePreview ? 'grid-cols-2' : (isTabletPreview ? 'grid-cols-3' : 'grid-cols-4'))
  //     : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  //   return (
  //     <section className={basePadding} data-mode={mode}>
  //       {sharedHeader}
  //       <div className={cn('max-w-7xl mx-auto grid gap-x-6 gap-y-20 text-center mt-24', columns)}>
  //         {visibleMembers.map((member) => (
  //           <article key={member.key}>
  //             <div
  //               className="bg-gray-200 relative rounded-sm"
  //               style={{
  //                 backgroundColor: tokens.cardBackground,
  //               }}
  //             >
  //               <div className="w-32 h-32 rounded-full inline-block border border-gray-200 bg-gray-100 -mt-14 overflow-hidden">
  //                 <div className="w-full h-full overflow-hidden rounded-full">
  //                   <TeamAvatar
  //                     member={member}
  //                     tokens={tokens}
  //                     context={context}
  //                     className="w-full h-full object-cover"
  //                     sizes="128px"
  //                   />
  //                 </div>
  //               </div>

  //               <div className="py-4">
  //                 <h4 className="text-base font-semibold" style={{ color: tokens.neutralText }}>
  //                   {member.name || 'Thành viên'}
  //                 </h4>
  //                 <p className="text-[13px] mt-1" style={{ color: tokens.styleAccentByStyle.bento }}>
  //                   {member.role || 'Chức vụ'}
  //                 </p>

  //                 <div className="flex items-center justify-center gap-4 mt-4">
  //                   <TeamSocialButton platform="facebook" value={member.facebook} context={context} tokens={tokens} sizeClass="w-7 h-7" iconSize={12} />
  //                   <TeamSocialButton platform="linkedin" value={member.linkedin} context={context} tokens={tokens} sizeClass="w-7 h-7" iconSize={12} />
  //                   <TeamSocialButton platform="twitter" value={member.twitter} context={context} tokens={tokens} sizeClass="w-7 h-7" iconSize={12} />
  //                   <TeamSocialButton platform="email" value={member.email} context={context} tokens={tokens} sizeClass="w-7 h-7" iconSize={12} />
  //                 </div>
  //               </div>
  //             </div>
  //           </article>
  //         ))}
  //       </div>
  //     </section>
  //   );
  // };

  const renderBento = () => {
    const BentoCarousel = () => {
      // Chiều rộng card để hiển thị đúng số item/viewport
      const cardWidth = isPreview
        ? (isMobilePreview ? 140 : (isTabletPreview ? 160 : 190))
        : 190; // desktop: ~6 item trong 1200px

      const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
      });
      const [canScrollPrev, setCanScrollPrev] = React.useState(false);
      const [canScrollNext, setCanScrollNext] = React.useState(false);

      React.useEffect(() => {
        if (!emblaApi) { return; }
        const update = () => {
          setCanScrollPrev(emblaApi.canScrollPrev());
          setCanScrollNext(emblaApi.canScrollNext());
        };
        update();
        emblaApi.on('select', update);
        emblaApi.on('reInit', update);
        return () => { emblaApi.off('select', update); emblaApi.off('reInit', update); };
      }, [emblaApi]);

      return (
        <section className={basePadding} data-mode={mode}>
          {/* Header + nav — header ẩn khi skipHeader, nav luôn hiện */}
          <div className={cn('max-w-7xl mx-auto flex items-end justify-between gap-3', skipHeader ? 'mb-1' : 'mb-5')}>
            <div className="flex-1 min-w-0">
              {!skipHeader && sharedHeader}
            </div>
            {(canScrollPrev || canScrollNext) && (
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" aria-label="Trước" disabled={!canScrollPrev}
                  onClick={() => emblaApi?.scrollPrev()}
                  className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all',
                    canScrollPrev ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400' : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed')}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" aria-label="Tiếp" disabled={!canScrollNext}
                  onClick={() => emblaApi?.scrollNext()}
                  className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all',
                    canScrollNext ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400' : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed')}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>


          <div className="max-w-7xl mx-auto overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {visibleMembers.map((member) => (
                <article
                  key={member.key}
                  className="group shrink-0 text-center"
                  style={{ width: cardWidth }}
                >
                  {/* Avatar tròn */}
                  <div
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden inline-block transition-transform duration-300 group-hover:scale-[1.04]"
                    style={{ backgroundColor: tokens.avatarFallbackBg }}
                  >
                    <div className="relative w-full h-full">
                      <TeamAvatar
                        member={member}
                        tokens={tokens}
                        context={context}
                        className="h-full w-full object-cover"
                        sizes="112px"
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="pt-3">
                    <h4
                      className="font-semibold line-clamp-1"
                      style={{
                        color: tokens.neutralText,
                        fontSize: isPreview ? (isMobilePreview ? '0.78rem' : '0.85rem') : '0.95rem',
                      }}
                    >
                      {member.name || 'Thành viên'}
                    </h4>
                    <p
                      className="mt-0.5 line-clamp-1"
                      style={{
                        color: tokens.styleAccentByStyle.bento,
                        fontSize: isPreview ? '0.7rem' : '0.78rem',
                      }}
                    >
                      {member.role || 'Chức vụ'}
                    </p>

                    {/* Social icons — xám, hover brand */}
                    <div className="mt-2.5 flex items-center justify-center gap-1.5">
                      <TeamSocialButtonNeutral platform="facebook" value={member.facebook} context={context} brandColor={tokens.primary} />
                      <TeamSocialButtonNeutral platform="linkedin" value={member.linkedin} context={context} brandColor={tokens.primary} />
                      <TeamSocialButtonNeutral platform="twitter" value={member.twitter} context={context} brandColor={tokens.primary} />
                      <TeamSocialButtonNeutral platform="email" value={member.email} context={context} brandColor={tokens.primary} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    };

    return <BentoCarousel />;
  };

  const renderTimeline = () => {
    const cardWidth = isPreview
      ? (isMobilePreview ? 160 : (isTabletPreview ? 200 : 240))
      : 280;

    const TimelineCarousel = () => {
      const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
      });
      const [canScrollPrev, setCanScrollPrev] = React.useState(false);
      const [canScrollNext, setCanScrollNext] = React.useState(false);

      React.useEffect(() => {
        if (!emblaApi) { return; }
        const update = () => {
          setCanScrollPrev(emblaApi.canScrollPrev());
          setCanScrollNext(emblaApi.canScrollNext());
        };
        update();
        emblaApi.on('select', update);
        emblaApi.on('reInit', update);
        return () => { emblaApi.off('select', update); emblaApi.off('reInit', update); };
      }, [emblaApi]);

      const MemberCard = ({ member }: { member: typeof visibleMembers[number] }) => {
        const [hovered, setHovered] = React.useState(false);
        const hasSocial = member.facebook || member.linkedin || member.twitter || member.email;
        return (
          <article
            className="relative shrink-0 rounded-2xl overflow-hidden cursor-default"
            style={{ width: cardWidth }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Ảnh full — portrait 3:4 */}
            <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
              <TeamAvatar
                member={member}
                tokens={tokens}
                context={context}
                className="h-full w-full object-cover"
                sizes="(max-width: 768px) 50vw, 280px"
              />
            </div>

            {/* Social icons — dọc bên phải, hiện khi hover */}
            {hasSocial && (
              <div
                className="absolute right-3 flex flex-col gap-1.5 transition-all duration-200"
                style={{
                  top: '30%',
                  opacity: hovered ? 1 : 0,
                  transform: hovered ? 'translateY(-50%)' : 'translateY(calc(-50% + 6px))',
                }}
              >
                {member.facebook && (
                  <a href={member.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow transition-shadow"
                    style={{ color: '#1877f2' }}>
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow transition-shadow"
                    style={{ color: '#000' }}>
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 1200 1227"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM577.673 685.716L529.98 617.925L150.597 101.995H324.237L623.754 522.653L671.447 590.444L1074.83 1129.87H901.19L577.673 685.716Z" /></svg>
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow transition-shadow"
                    style={{ color: '#0a66c2' }}>
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow transition-shadow"
                    style={{ color: '#ef4444' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </a>
                )}
              </div>
            )}

            {/* Info bar — nền trắng đục, dưới cùng */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
            >
              <h3
                className="font-bold line-clamp-1 leading-snug"
                style={{
                  color: '#111',
                  fontSize: isPreview ? (isMobilePreview ? '0.8rem' : '0.88rem') : '1rem',
                }}
              >
                {member.name || 'Thành viên'}
              </h3>
              <p
                className="line-clamp-1 uppercase"
                style={{
                  color: '#888',
                  fontSize: isPreview ? '0.62rem' : '0.7rem',
                  letterSpacing: '0.06em',
                  marginTop: '2px',
                }}
              >
                {member.role || 'Chức vụ'}
              </p>
            </div>
          </article>
        );
      };

      return (
        <section className={basePadding} data-mode={mode}>
          {/* Header + nav */}
          <div className={cn('max-w-7xl mx-auto flex items-end justify-between gap-3', skipHeader ? 'mb-1' : 'mb-5')}>
            <div className="flex-1 min-w-0">
              {!skipHeader && sharedHeader}
            </div>
            {(canScrollPrev || canScrollNext) && (
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" aria-label="Trước" disabled={!canScrollPrev}
                  onClick={() => emblaApi?.scrollPrev()}
                  className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all',
                    canScrollPrev ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400' : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed')}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" aria-label="Tiếp" disabled={!canScrollNext}
                  onClick={() => emblaApi?.scrollNext()}
                  className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all',
                    canScrollNext ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400' : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed')}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Embla */}
          <div className="max-w-7xl mx-auto overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {visibleMembers.map((member) => (
                <MemberCard key={member.key} member={member} />
              ))}
            </div>
          </div>
        </section>
      );
    };

    return <TimelineCarousel />;
  };

  const renderSpotlight = () => {
    const cardWidth = isPreview
      ? (isMobilePreview ? 170 : (isTabletPreview ? 210 : 260))
      : 300;

    const SpotlightCarousel = () => {
      const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
      });
      const [canScrollPrev, setCanScrollPrev] = React.useState(false);
      const [canScrollNext, setCanScrollNext] = React.useState(false);

      React.useEffect(() => {
        if (!emblaApi) { return; }
        const update = () => {
          setCanScrollPrev(emblaApi.canScrollPrev());
          setCanScrollNext(emblaApi.canScrollNext());
        };
        update();
        emblaApi.on('select', update);
        emblaApi.on('reInit', update);
        return () => { emblaApi.off('select', update); emblaApi.off('reInit', update); };
      }, [emblaApi]);

      const MemberCard = ({ member }: { member: typeof visibleMembers[number] }) => {
        const [hovered, setHovered] = React.useState(false);
        const hasSocial = member.facebook || member.linkedin || member.twitter || member.email;
        const imageWidth = cardWidth * 0.88;

        return (
          <article
            className="shrink-0 flex flex-col items-center cursor-pointer select-none"
            style={{ width: cardWidth }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Rounded image container */}
            <div
              className="relative overflow-hidden"
              style={{
                width: imageWidth,
                aspectRatio: '4 / 5',
                borderRadius: '20px',
                backgroundColor: '#f0f2f5',
                boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
              }}
            >
              <TeamAvatar
                member={member}
                tokens={tokens}
                context={context}
                className="h-full w-full object-cover object-top"
                sizes="(max-width: 768px) 50vw, 300px"
              />

              {/* Social icons — bên trái, hiện khi hover */}
              {hasSocial && (
                <div
                  className="absolute left-2.5 flex flex-col gap-1.5 transition-all duration-200"
                  style={{
                    top: '28%',
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
                  }}
                >
                  {member.facebook && (
                    <a href={member.facebook} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow"
                      style={{ backgroundColor: '#1877F2', color: '#fff' }}>
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow"
                      style={{ backgroundColor: '#000', color: '#fff' }}
                      >
                      <svg width="11" height="11" fill="currentColor" viewBox="0 0 1200 1227"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM577.673 685.716L529.98 617.925L150.597 101.995H324.237L623.754 522.653L671.447 590.444L1074.83 1129.87H901.19L577.673 685.716Z" /></svg>
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow"
                      style={{ backgroundColor: '#0a66c2', color: '#fff' }}
                      >
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`}
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow"
                      style={{ backgroundColor: '#ef4444', color: '#fff' }}
                      >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Info bar — nằm dưới oval */}
            <div
              className="w-full mt-3 flex items-center justify-between gap-2 px-4 py-3 rounded-xl transition-colors duration-200"
              style={{
                backgroundColor: tokens.primary,
                border: 'none',
                boxShadow: `0 4px 16px ${tokens.primary}30`,
              }}
            >
              <div className="min-w-0">
                <h3
                  className="font-bold line-clamp-1 leading-snug"
                  style={{
                    color: '#fff',
                    fontSize: isPreview ? (isMobilePreview ? '0.78rem' : '0.85rem') : '0.95rem',
                  }}
                >
                  {member.name || 'Thành viên'}
                </h3>
                <p
                  className="line-clamp-1 mt-0.5"
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: isPreview ? '0.62rem' : '0.72rem',
                  }}
                >
                  {member.role || 'Chức vụ'}
                </p>
              </div>

              {/* Nút » */}
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.18)',
                  color: '#fff',
                }}
              >
                <ChevronRight size={14} />
              </div>
            </div>
          </article>
        );
      };

      return (
        <section className={basePadding} data-mode={mode}>
          {/* Header + nav */}
          <div className={cn('max-w-7xl mx-auto flex items-end justify-between gap-3', skipHeader ? 'mb-1' : 'mb-5')}>
            <div className="flex-1 min-w-0">
              {!skipHeader && sharedHeader}
            </div>
            {(canScrollPrev || canScrollNext) && (
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" aria-label="Trước" disabled={!canScrollPrev}
                  onClick={() => emblaApi?.scrollPrev()}
                  className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all',
                    canScrollPrev ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400' : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed')}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" aria-label="Tiếp" disabled={!canScrollNext}
                  onClick={() => emblaApi?.scrollNext()}
                  className={cn('inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all',
                    canScrollNext ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400' : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed')}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Embla */}
          <div className="max-w-7xl mx-auto overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6 items-start">
              {visibleMembers.map((member) => (
                <MemberCard key={member.key} member={member} />
              ))}
            </div>
          </div>
        </section>
      );
    };

    return <SpotlightCarousel />;
  };

  switch (style) {
    case 'grid': {
      return renderGrid();
    }
    case 'cards': {
      return renderCards();
    }
    case 'carousel': {
      return renderCarousel();
    }
    case 'bento': {
      return renderBento();
    }
    case 'timeline': {
      return renderTimeline();
    }
    case 'spotlight':
    default: {
      return renderSpotlight();
    }
  }
}

