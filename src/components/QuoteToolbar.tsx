'use client';

import { useEffect, useRef, useState } from 'react';
import { Building2, ChevronDown, Check, Download, FileText, FolderOpen, Languages, MoreHorizontal, Package, Plus, RefreshCw, Save, Upload, ArrowUpRight } from 'lucide-react';

interface Props {
  quotationNo: string;
  language: string;
  saved: boolean;
  updateLabel: string;
  checkingUpdate: boolean;
  canUpdate: boolean;
  onLanguage: (value: string) => void;
  onNew: () => void;
  onSave: () => Promise<void>;
  onExport: (kind: 'pdf' | 'word') => void;
  onImport: () => void;
  onBackup: () => void;
  onContract: () => void;
}

const control = 'inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-600';
const item = 'flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-600';
const panel = 'absolute top-full z-30 mt-2 w-56 max-w-[calc(100vw-32px)] rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg';

export default function QuoteToolbar(props: Props) {
  const [menu, setMenu] = useState<'modules' | 'export' | 'more' | null>(null);
  const [saving, setSaving] = useState(false);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!menu) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setMenu(null); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        root.current?.querySelector<HTMLButtonElement>(`[data-menu="${menu}"]`)?.focus();
        setMenu(null);
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [menu]);
  const run = (action: () => void) => { setMenu(null); action(); };

  return <header ref={root} aria-label="报价工具栏" className="sticky top-0 z-20 mb-4 border-b border-gray-200 bg-white px-3 py-2 no-print sm:px-4" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMenu(null);
  }}>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="relative flex min-w-0 flex-1 items-center gap-3 lg:flex-none">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700"><Building2 size={20}/></span>
        <div className="min-w-0">
          <button type="button" data-menu="modules" aria-expanded={menu === 'modules'} aria-controls="quote-modules" className="flex items-center gap-2 rounded text-sm font-semibold text-gray-900 focus-visible:outline-2 focus-visible:outline-blue-600" onClick={() => setMenu(menu === 'modules' ? null : 'modules')}>
            Quoter <span className="font-normal text-gray-500">电梯报价</span><ChevronDown size={14}/>
          </button>
          <div className="mt-0.5 max-w-64 truncate text-xs text-gray-500" title={props.quotationNo || '未命名报价'}>{props.quotationNo || '未命名报价'}<span className="mx-2 text-gray-300">·</span>本机存储</div>
        </div>
        {menu === 'modules' && <nav id="quote-modules" aria-label="业务模块" className={`${panel} left-0`}>
          <a className={item} href="/pi" onClick={() => setMenu(null)}><FileText size={17}/>PI 制作</a>
          <a className={item} href="/packing-list" onClick={() => setMenu(null)}><Package size={17}/>箱单制作</a>
          <a className={item} href="/contract-maker/index.html?from=quote" onClick={() => run(props.onContract)}><FileText size={17}/>合同制作</a>
          <a className={item} href="/escalator" onClick={() => setMenu(null)}><ArrowUpRight size={17}/>扶梯报价</a>
        </nav>}
      </div>
      <div className="flex items-center gap-1 lg:border-l lg:border-gray-200 lg:pl-3">
        <button type="button" title="新建报价" aria-label="新建报价" className={control} onClick={() => run(props.onNew)}><Plus size={18}/><span className="hidden sm:inline">新建</span></button>
        <a title="历史报价库" aria-label="历史报价库" className={control} href="#quote-history" onClick={() => setMenu(null)}><FolderOpen size={18}/><span className="hidden sm:inline">报价库</span></a>
      </div>
      <div className="flex w-full items-center justify-between gap-2 border-t border-gray-100 pt-2 lg:ml-auto lg:w-auto lg:border-0 lg:pt-0">
        <label className="flex min-w-0 items-center gap-2 text-sm text-gray-500 sm:mr-3">
          <Languages size={17} className="hidden shrink-0 sm:block"/>
          <span className="hidden xl:inline">报价语言</span>
          <select aria-label="报价语言" title="报价输出语言" value={props.language} onChange={event => props.onLanguage(event.target.value)} className="h-9 w-full min-w-0 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 sm:w-40">
            {[['en','英语 English'],['zh-en','中英双语'],['zh','中文'],['es','西班牙语 Español'],['pt','葡萄牙语 Português'],['fr','法语 Français'],['vi','越南语 Tiếng Việt'],['km','柬埔寨语 Khmer'],['ar','阿拉伯语 العربية'],['ru','俄语 Русский']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" aria-label="保存到报价库" title="保存到报价库" disabled={saving} className={`${control} border border-gray-300 px-2 sm:px-3 disabled:opacity-50`} onClick={async () => {
            setMenu(null); setSaving(true);
            try { await props.onSave(); } finally { setSaving(false); }
          }}>{props.saved ? <Check size={17} className="text-green-700"/> : <Save size={17}/>}<span>{saving ? '保存中' : props.saved ? '已入库' : '保存'}</span></button>
          <div className="relative flex h-9 rounded-md bg-blue-600 text-white">
            <button type="button" className="flex items-center gap-2 rounded-l-md px-2 text-sm font-semibold hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-900 sm:px-3" onClick={() => run(() => props.onExport('pdf'))}><Download size={17}/><span>PDF</span></button>
            <button type="button" data-menu="export" aria-label="其他导出格式" title="其他导出格式" aria-expanded={menu === 'export'} aria-controls="quote-exports" className="w-8 rounded-r-md border-l border-blue-500 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-900" onClick={() => setMenu(menu === 'export' ? null : 'export')}><ChevronDown size={15} className="mx-auto"/></button>
            {menu === 'export' && <div id="quote-exports" className={`${panel} right-0`}><button type="button" className={item} onClick={() => run(() => props.onExport('word'))}><FileText size={17}/>导出 Word</button></div>}
          </div>
          <div className="relative">
            <button type="button" data-menu="more" title="更多操作" aria-label="更多操作" aria-expanded={menu === 'more'} aria-controls="quote-more" className={`${control} w-9 px-0`} onClick={() => setMenu(menu === 'more' ? null : 'more')}><MoreHorizontal size={20}/></button>
            {menu === 'more' && <div id="quote-more" className={`${panel} right-0`}>
              <button type="button" className={item} onClick={() => run(props.onImport)}><Upload size={17}/>导入草稿</button>
              <button type="button" className={item} onClick={() => run(props.onBackup)}><Download size={17}/>导出草稿备份</button>
              <div className="my-1 border-t border-gray-100"/>
              <button type="button" disabled={props.checkingUpdate || !props.canUpdate} className={`${item} disabled:opacity-50`} onClick={() => window.location.reload()}><RefreshCw size={17} className="shrink-0"/><span className="break-all text-xs">{props.updateLabel}</span></button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  </header>;
}
