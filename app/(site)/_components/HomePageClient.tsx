'use client';

import { ComponentRenderer } from '@/components/site/ComponentRenderer';
import { HomePageLoading } from '@/components/site/loading/HomePageLoading';
import { api } from '@/convex/_generated/api';
import type { Doc } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import React, { useEffect, useRef, useState } from 'react';

const EMPTY_COMPONENTS_COUNT = 0;
const LOADING_DELAY_MS = 120;
const LOADING_MIN_DISPLAY_MS = 320;

export default function HomePageClient({
  initialComponents,
}: {
  initialComponents?: Doc<'homeComponents'>[];
}): React.ReactElement {
  const components = useQuery(api.homeComponents.listActive);
  const resolvedComponents = components ?? initialComponents;
  const [showLoading, setShowLoading] = useState(false);
  const loadingStartRef = useRef<number | null>(null);
  const delayTimerRef = useRef<number | null>(null);

  const isDataReady = typeof resolvedComponents !== 'undefined';

  useEffect(() => {
    if (!isDataReady) {
      if (!loadingStartRef.current) {
        loadingStartRef.current = Date.now();
      }
      if (showLoading) {
        return;
      }
      if (LOADING_DELAY_MS <= 0) {
        setShowLoading(true);
        return;
      }
      if (delayTimerRef.current === null) {
        delayTimerRef.current = window.setTimeout(() => {
          setShowLoading(true);
          delayTimerRef.current = null;
        }, LOADING_DELAY_MS);
      }
      return;
    }

    if (delayTimerRef.current) {
      window.clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }

    if (!showLoading) {
      setShowLoading(false);
      loadingStartRef.current = null;
      return;
    }

    const startedAt = loadingStartRef.current ?? Date.now();
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, LOADING_MIN_DISPLAY_MS - elapsed);
    if (remaining <= 0) {
      setShowLoading(false);
      loadingStartRef.current = null;
      return;
    }

    const timer = window.setTimeout(() => {
      setShowLoading(false);
      loadingStartRef.current = null;
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [isDataReady, showLoading]);

  if (!isDataReady && !showLoading) {
    return <></>;
  }

  if (!isDataReady || showLoading) {
    return (
      <HomePageLoading />
    );
  }

  if (resolvedComponents.length === EMPTY_COMPONENTS_COUNT) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Chào mừng!</h1>
          <p className="text-slate-500">
            Chưa có nội dung trang chủ. Vui lòng thêm components trong{' '}
            <a href="/admin/home-components" className="text-blue-600 hover:underline">
              Admin Panel
            </a>
          </p>
        </div>
      </div>
    );
  }

  const sortedComponents = [...resolvedComponents]
    .filter((componentItem) => componentItem.type !== 'Footer')
    .sort((firstComponent, secondComponent) => firstComponent.order - secondComponent.order);

  return (
    <>
      {sortedComponents.map((component) => (
        <ComponentRenderer
          key={component._id}
          component={{
            _id: component._id,
            active: component.active,
            config: component.config as Record<string, unknown>,
            order: component.order,
            title: component.title,
            type: component.type,
          }}
        />
      ))}
    </>
  );
}
