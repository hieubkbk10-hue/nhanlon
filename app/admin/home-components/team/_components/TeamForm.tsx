'use client';

import React from 'react';
import { AdminImage as Image } from '@/app/admin/components/AdminImage';
import {
  Award, Briefcase, Building, Camera, ChevronDown, ChevronUp,
  Crown, GripVertical, ImageIcon, Layers, Lightbulb, Loader2,
  Palette, Plus, Sparkles, Star, Trash2, Upload, Users, Zap,
} from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { prepareImageForUpload, validateImageFile } from '@/lib/image/uploadPipeline';
import { resolveNamingContext } from '@/lib/image/uploadNaming';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, cn } from '../../../components/ui';
import { IconPopoverPicker } from '../../_shared/components/IconPopoverPicker';
import type { IconOption } from '../../_shared/components/IconPopoverPicker';
import type { TeamEditorMember, TeamAvatarType } from '../_types';
import { AiDemoTeamImport } from '../../product-list/_components/AiDemoProductsImport';

// Demo avatars — AI-generated, phụ nữ châu Á chuyên nghiệp
const DEMO_AVATARS = [
  '/demo/team-avatars/demo-f1.png',
  '/demo/team-avatars/demo-f2.png',
  '/demo/team-avatars/demo-f3.png',
  '/demo/team-avatars/demo-f4.png',
  '/demo/team-avatars/demo-f5.png',
  '/demo/team-avatars/demo-f6.png',
];

const AVAILABLE_ICONS = [
  'Star', 'Award', 'Crown', 'Briefcase', 'Building', 'Layers',
  'Lightbulb', 'Palette', 'Camera', 'Zap', 'Sparkles',
] as const;

const ICON_COMPONENTS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Star, Award, Crown, Briefcase, Building, Layers, Lightbulb, Palette, Camera, Zap, Sparkles,
};

const getIconCmp = (name: string) => ICON_COMPONENTS[name] ?? Star;

const TEAM_ICON_PICKER_OPTIONS: IconOption[] = AVAILABLE_ICONS.map((name) => ({
  value: name,
  label: name,
  Icon: ICON_COMPONENTS[name] ?? Star,
}));

interface TeamFormProps {
  members: TeamEditorMember[];
  onChange: (next: TeamEditorMember[]) => void;
  secondary: string;
  defaultExpanded?: boolean;
}

const createEmptyMember = (seed: number): TeamEditorMember => ({
  id: seed,
  name: '',
  role: '',
  avatar: '',
  avatarType: 'upload',
  avatarIcon: 'Star',
  bio: '',
  facebook: '',
  linkedin: '',
  twitter: '',
  email: '',
});

function useDragReorder<T extends { id: number }>(items: T[], setItems: (items: T[]) => void) {
  const [draggedId, setDraggedId] = React.useState<number | null>(null);
  const [dragOverId, setDragOverId] = React.useState<number | null>(null);

  const dragProps = (id: number) => ({
    draggable: true,
    onDragEnd: () => { setDraggedId(null); setDragOverId(null); },
    onDragOver: (event: React.DragEvent) => { event.preventDefault(); if (draggedId !== id) { setDragOverId(id); } },
    onDragStart: () => { setDraggedId(id); },
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      if (!draggedId || draggedId === id) { return; }
      const nextItems = [...items];
      const from = items.findIndex((item) => item.id === draggedId);
      const to = items.findIndex((item) => item.id === id);
      if (from < 0 || to < 0) { return; }
      const [moved] = nextItems.splice(from, 1);
      nextItems.splice(to, 0, moved);
      setItems(nextItems);
      setDraggedId(null);
      setDragOverId(null);
    },
  });

  return { draggedId, dragOverId, dragProps };
}

function AvatarUpload({ value, onChange, index }: { value: string; onChange: (url: string) => void; index: number }) {
  const [isUploading, setIsUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveImage = useMutation(api.storage.saveImage);

  const handleFile = React.useCallback(async (file: File) => {
    const err = validateImageFile(file, 10);
    if (err) { toast.error(err); return; }
    setIsUploading(true);
    try {
      const naming = resolveNamingContext(undefined, { entityName: 'team', field: 'avatar', index });
      const prepared = await prepareImageForUpload(file, { quality: 0.85, naming });
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': prepared.mimeType }, body: prepared.file });
      if (!res.ok) { throw new Error('Upload failed'); }
      const { storageId } = await res.json();
      const result = await saveImage({ storageId: storageId as Id<'_storage'>, filename: prepared.filename, folder: 'team-avatars', mimeType: prepared.mimeType, size: prepared.size, width: prepared.width, height: prepared.height });
      onChange(result.url ?? '');
      toast.success('Tải ảnh thành công');
    } catch { toast.error('Lỗi tải ảnh'); } finally { setIsUploading(false); }
  }, [generateUploadUrl, index, onChange, saveImage]);

  return (
    <div className="relative shrink-0">
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) { void handleFile(f); } }} />
      <div
        className={cn('h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-all',
          'border-slate-200 hover:border-slate-300 dark:border-slate-600',
          isUploading && 'pointer-events-none')}
        onClick={() => { if (!isUploading) { inputRef.current?.click(); } }}
      >
        {isUploading ? (
          <div className="h-full w-full flex items-center justify-center bg-slate-100"><Loader2 size={14} className="animate-spin text-blue-500" /></div>
        ) : value ? (
          <Image src={value} alt="" width={40} height={40} className="h-full w-full object-cover" unoptimized />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800"><Upload size={12} className="text-slate-400" /></div>
        )}
      </div>
      {value && (
        <button type="button" className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center"
          onClick={(e) => { e.stopPropagation(); onChange(''); }}>×</button>
      )}
    </div>
  );
}

const SocialIconBtn = ({ type, value, onChange }: { type: 'facebook' | 'linkedin' | 'twitter' | 'email'; value: string; onChange: (next: string) => void; }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const icons: Record<string, React.ReactNode> = {
    email: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    facebook: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
    linkedin: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" /></svg>,
    twitter: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  };
  const placeholders = { email: 'email@...', facebook: 'facebook.com/...', linkedin: 'linkedin.com/in/...', twitter: 'x.com/...' };
  return (
    <div className="relative">
      <button type="button" title={type}
        className={cn('h-7 w-7 rounded-md flex items-center justify-center transition-all',
          value ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 hover:bg-slate-200')}
        onClick={() => setIsOpen((p) => !p)}>
        {icons[type]}
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-10 w-56 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-2">
          <Input value={value} className="h-8 text-xs" autoFocus placeholder={placeholders[type]}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => { setTimeout(() => setIsOpen(false), 150); }} />
        </div>
      )}
    </div>
  );
};

export const TeamForm = ({ members, onChange, secondary, defaultExpanded = true }: TeamFormProps) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [expandedBioId, setExpandedBioId] = React.useState<number | null>(null);

  const { draggedId, dragOverId, dragProps } = useDragReorder(members, onChange);

  const updateMember = (id: number, patch: Partial<TeamEditorMember>) => {
    onChange(members.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const addMember = () => {
    const maxId = members.reduce((max, m) => Math.max(max, m.id), 0);
    onChange([...members, createEmptyMember(maxId + 1)]);
  };

  const removeMember = (id: number) => {
    onChange(members.filter((m) => m.id !== id));
    if (expandedBioId === id) { setExpandedBioId(null); }
  };

  const avatarTypeOptions: Array<{ value: TeamAvatarType; label: string; icon: React.ReactNode }> = [
    { value: 'upload', label: 'Upload', icon: <Upload size={11} /> },
    { value: 'url', label: 'URL', icon: <ImageIcon size={11} /> },
    { value: 'icon', label: 'Icon', icon: <Sparkles size={11} /> },
  ];

  return (
    <Card className="mb-6">
      <CardHeader className={cn('transition-all', expanded ? 'pb-0' : 'py-3')}>
        <div className="flex cursor-pointer items-center justify-between" onClick={() => setExpanded((p) => !p)}>
          <CardTitle className="text-base">Thành viên ({members.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs"
              onClick={(e) => { e.stopPropagation(); addMember(); }}>
              <Plus size={12} /> Thêm
            </Button>
            <div onClick={(e) => e.stopPropagation()}>
              <AiDemoTeamImport onApply={(items) => onChange(items as TeamEditorMember[])} />
            </div>
            <ChevronDown size={16} className={cn('transition-transform duration-200 text-slate-400', expanded ? 'rotate-180' : '')} />
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-2 pt-4">
          {/* Demo avatars */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800/50">
            <span className="text-[11px] text-slate-500 shrink-0">Demo:</span>
            <div className="flex gap-1.5 flex-wrap">
              {DEMO_AVATARS.map((url, i) => (
                <button key={url} type="button" title={`Dùng avatar demo ${i + 1}`}
                  className="h-7 w-7 overflow-hidden rounded-full border-2 border-transparent hover:border-blue-400 transition-all"
                  onClick={() => {
                    if (members[i]) {
                      updateMember(members[i].id, { avatar: url, avatarType: 'url' });
                    } else {
                      const maxId = members.reduce((max, m) => Math.max(max, m.id), 0);
                      onChange([...members, { ...createEmptyMember(maxId + 1), avatar: url, avatarType: 'url', name: `Thành viên ${i + 1}` }]);
                    }
                  }}>
                  <Image src={url} alt="" width={28} height={28} className="h-full w-full object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>

          {members.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-8 text-center dark:border-slate-700">
              <Users size={24} className="mb-2 text-slate-300" style={{ color: secondary }} />
              <p className="text-sm text-slate-500 mb-3">Chưa có thành viên</p>
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addMember}>
                <Plus size={12} /> Thêm thành viên
              </Button>
            </div>
          )}

          {members.map((member) => {
            const avatarType = member.avatarType ?? 'upload';
            const IconCmp = getIconCmp(member.avatarIcon || 'Star');

            return (
              <div key={member.id} {...dragProps(member.id)}
                className={cn('cursor-grab overflow-hidden rounded-lg border transition-all active:cursor-grabbing',
                  draggedId === member.id && 'opacity-50 scale-[0.98]',
                  dragOverId === member.id && 'ring-2 ring-blue-500 ring-offset-1',
                  'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900')}>

                {/* Row chính — 1 dòng */}
                <div className="flex items-center gap-2 px-2.5 py-2">
                  <GripVertical size={14} className="shrink-0 text-slate-300 cursor-grab" />

                  {/* Avatar preview */}
                  <div className="relative shrink-0 h-9 w-9 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100">
                    {avatarType === 'icon' ? (
                      <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: `${secondary}20` }}>
                        <IconCmp size={16} style={{ color: secondary }} />
                      </div>
                    ) : member.avatar ? (
                      <Image src={member.avatar} alt="" width={36} height={36} className="h-full w-full object-cover" unoptimized />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                        <Users size={14} className="text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Tên + Chức vụ */}
                  <Input placeholder="Họ và tên" className="h-8 flex-1 text-xs" value={member.name}
                    onChange={(e) => updateMember(member.id, { name: e.target.value })} />
                  <Input placeholder="Chức vụ" className="h-8 w-28 text-xs shrink-0" value={member.role}
                    onChange={(e) => updateMember(member.id, { role: e.target.value })} />

                  {/* Avatar type toggle */}
                  <div className="flex shrink-0 gap-0.5">
                    {avatarTypeOptions.map((opt) => (
                      <button key={opt.value} type="button"
                        className={cn('flex h-7 items-center gap-1 rounded-md border px-1.5 text-[10px] font-medium transition-colors',
                          avatarType === opt.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900')}
                        onClick={() => updateMember(member.id, { avatarType: opt.value })}>
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Socials */}
                  <div className="flex shrink-0 gap-0.5">
                    <SocialIconBtn type="facebook" value={member.facebook} onChange={(v) => updateMember(member.id, { facebook: v })} />
                    <SocialIconBtn type="linkedin" value={member.linkedin} onChange={(v) => updateMember(member.id, { linkedin: v })} />
                    <SocialIconBtn type="twitter" value={member.twitter} onChange={(v) => updateMember(member.id, { twitter: v })} />
                    <SocialIconBtn type="email" value={member.email} onChange={(v) => updateMember(member.id, { email: v })} />
                  </div>

                  {/* Bio toggle */}
                  <button type="button" className="shrink-0 text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
                    onClick={() => setExpandedBioId((p) => (p === member.id ? null : member.id))}>
                    Bio {expandedBioId === member.id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  </button>

                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-slate-400 hover:text-red-500"
                    onClick={() => removeMember(member.id)}>
                    <Trash2 size={13} />
                  </Button>
                </div>

                {/* Avatar input (URL hoặc Upload) */}
                {avatarType === 'upload' && (
                  <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 px-2.5 py-1.5">
                    <AvatarUpload value={member.avatar} onChange={(url) => updateMember(member.id, { avatar: url })}
                      index={members.findIndex((m) => m.id === member.id) + 1} />
                    {member.avatar && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{member.avatar}</span>
                    )}
                  </div>
                )}

                {avatarType === 'url' && (
                  <div className="border-t border-slate-100 dark:border-slate-800 px-2.5 py-1.5">
                    <Input placeholder="https://example.com/avatar.jpg" className="h-7 text-xs"
                      value={member.avatar}
                      onChange={(e) => updateMember(member.id, { avatar: e.target.value })} />
                  </div>
                )}

                {avatarType === 'icon' && (
                  <div className="border-t border-slate-100 dark:border-slate-800 px-2.5 py-1.5">
                    <IconPopoverPicker
                      value={member.avatarIcon || 'Star'}
                      onChange={(nextIcon) => updateMember(member.id, { avatarIcon: nextIcon })}
                      options={TEAM_ICON_PICKER_OPTIONS}
                      brandColor={secondary}
                    />
                  </div>
                )}

                {/* Bio */}
                {expandedBioId === member.id && (
                  <div className="border-t border-slate-100 dark:border-slate-800 px-2.5 pb-2.5">
                    <textarea placeholder="Giới thiệu ngắn..." value={member.bio}
                      onChange={(e) => updateMember(member.id, { bio: e.target.value })}
                      className="mt-1.5 min-h-[52px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" />
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
};
