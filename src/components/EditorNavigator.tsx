"use client";
import { useEffect, useRef, useState } from 'react';

export default function EditorNavigator() {
  const root = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(true);
  useEffect(() => {
    const editor = root.current?.parentElement;
    if (!editor) return;
    const refresh = () => {
      const next = Array.from(editor.querySelectorAll<HTMLElement>('h2, h3, h4'));
      setSections(previous => previous.length === next.length && previous.every((item, i) => item === next[i]) ? previous : next);
    };
    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(editor, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = () => {
      const edge = (root.current?.getBoundingClientRect().bottom ?? 0) + 28;
      let index = 0;
      sections.forEach((section, i) => { if (section.getBoundingClientRect().top <= edge) index = i; });
      setActive(index);
    };
    window.addEventListener('scroll', update, true);
    update();
    return () => window.removeEventListener('scroll', update, true);
  }, [sections]);
  useEffect(() => {
    root.current?.parentElement?.classList.toggle('compact-editor', compact);
  }, [compact]);
  return <div ref={root} className="sticky top-0 z-20 -mx-4 -mt-4 mb-4 flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
    <label className="shrink-0 text-xs text-gray-500" htmlFor="editor-section">当前位置</label>
    <select id="editor-section" className="min-w-0 flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm" value={active} onChange={event => {
      const index = Number(event.target.value);
      sections[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActive(index);
    }}>
      {sections.map((section, index) => <option key={index} value={index}>{section.tagName === 'H2' ? '报价详情' : section.querySelector('span')?.textContent || section.textContent?.slice(0, 55)}</option>)}
    </select>
    <label className="flex shrink-0 items-center gap-1.5 text-xs text-gray-600"><input type="checkbox" checked={compact} onChange={event => setCompact(event.target.checked)} />紧凑</label>
  </div>;
}
