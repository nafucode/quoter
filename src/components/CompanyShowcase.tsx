'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Lang } from '@/data/translations';
import { renderCompanyShowcase } from '@/utils/renderCompanyShowcase';

export type CompanyShowcaseHandle = { prepare: () => Promise<void> };

const CompanyShowcase = forwardRef<CompanyShowcaseHandle, { language: Lang }>(function CompanyShowcase({ language }, ref) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [errorLanguage, setErrorLanguage] = useState<Lang | null>(null);
  useEffect(() => {
    let cancelled = false;
    imageRef.current?.removeAttribute('src');
    renderCompanyShowcase(language).then(async src => {
      if (!cancelled && imageRef.current) {
        imageRef.current.src = src;
        await imageRef.current.decode();
        if (!cancelled) setErrorLanguage(null);
      }
    }).catch(() => { if (!cancelled) setErrorLanguage(language); });
    return () => { cancelled = true; };
  }, [language]);
  useImperativeHandle(ref, () => ({
    async prepare() {
      const src = await renderCompanyShowcase(language);
      if (!imageRef.current) throw new Error('Showcase unavailable');
      imageRef.current.src = src;
      await imageRef.current.decode();
    },
  }), [language]);
  return <section className="company-showcase-raster-page">
    {errorLanguage === language && <p className="no-print" role="alert">企业展示图片加载失败，请刷新后重试。</p>}
    {/* This single decoded bitmap is shared by preview and browser PDF export. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img ref={imageRef} alt="XINFUJI company showcase" />
  </section>;
});

export default CompanyShowcase;
