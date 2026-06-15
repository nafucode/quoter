'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import {
  defaultEscalatorConfigRows,
  defaultEscalatorFunctionRows,
  defaultEscalatorPriceRows,
  defaultEscalatorSpecGroups,
  escalatorSpecRows,
  EscalatorConfigRow,
  EscalatorFunctionRow,
  EscalatorPriceRow,
  EscalatorSpecGroup,
} from '@/data/escalatorDefaults';
import { escalatorTranslations } from '@/data/escalatorTranslations';
import { Lang } from '@/data/translations';
import { generateEscalatorWordBlob } from '@/utils/generateEscalatorWord';

type EscalatorQuoteState = {
  customer: string;
  quotationNo: string;
  projectName: string;
  quotationType: string;
  quotationDate: string;
  paymentTerm: string;
  deliveryDays: number;
  validityDays: number;
  warrantyMonths: number;
  exchangeRateBasis: number;
  containerEstimate: string;
  freightDestination: string;
  freightCost: number;
  priceRows: EscalatorPriceRow[];
  specGroups: EscalatorSpecGroup[];
  configRows: EscalatorConfigRow[];
  functionRows: EscalatorFunctionRow[];
  language: Lang;
};

const todayQuotationNo = () => {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `XFJ-ESC${yy}${mm}${dd}01`;
};

const initialState: EscalatorQuoteState = {
  customer: 'PA',
  quotationNo: todayQuotationNo(),
  projectName: 'Escalator Project',
  quotationType: 'FOB',
  quotationDate: new Date().toLocaleDateString('en-CA'),
  paymentTerm: 'Pay a 30% deposit within 3 days of signing to activate the contract; the 70% balance is due 7 working days before delivery.',
  deliveryDays: 35,
  validityDays: 45,
  warrantyMonths: 12,
  exchangeRateBasis: 6.7,
  containerEstimate: '8*40HQ',
  freightDestination: 'SHANGHAI PORT',
  freightCost: 8000,
  priceRows: defaultEscalatorPriceRows,
  specGroups: defaultEscalatorSpecGroups,
  configRows: defaultEscalatorConfigRows,
  functionRows: defaultEscalatorFunctionRows,
  language: 'en',
};

const STORAGE_KEY = 'xinfuji-escalator-quote';
const HISTORY_KEY = 'xinfuji-escalator-history';

const money = (value: number) =>
  Number(value || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const sanitizeFilePart = (value: string) => value.replace(/[/\\?%*:|"<>]/g, '-').trim();
const buildFileTitle = (state: EscalatorQuoteState) =>
  `Xinfuji-Escalator_${sanitizeFilePart(state.quotationNo || state.projectName || 'quotation')}`;
const isPriceExtraRow = (row: EscalatorPriceRow) => !row.speed && !row.inclination;

export default function EscalatorQuotePage() {
  const [state, setState] = useState<EscalatorQuoteState>(initialState);
  const [saved, setSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setState({ ...initialState, ...JSON.parse(raw) });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    try {
      setQuoteHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
    } catch {
      setQuoteHistory([]);
    }
  }, []);

  const priceSubtotal = useMemo(
    () => state.priceRows.reduce((sum, row) => sum + Number(row.quantity || 0) * Number(row.unitPrice || 0), 0),
    [state.priceRows],
  );
  const isExw = state.quotationType === 'EXW';
  const grandTotal = priceSubtotal + (isExw ? 0 : Number(state.freightCost || 0));
  const et = escalatorTranslations[state.language] || escalatorTranslations.en;

  const setField = <K extends keyof EscalatorQuoteState>(field: K, value: EscalatorQuoteState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const updatePriceRow = <K extends keyof EscalatorPriceRow>(id: number, field: K, value: EscalatorPriceRow[K]) => {
    setState((prev) => ({
      ...prev,
      priceRows: prev.priceRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    }));
  };

  const updateSpecGroup = <K extends keyof EscalatorSpecGroup>(id: number, field: K, value: EscalatorSpecGroup[K]) => {
    setState((prev) => ({
      ...prev,
      specGroups: prev.specGroups.map((group) => (group.id === id ? { ...group, [field]: value } : group)),
    }));
  };

  const updateConfigRow = <K extends keyof EscalatorConfigRow>(id: string, field: K, value: EscalatorConfigRow[K]) => {
    setState((prev) => ({
      ...prev,
      configRows: prev.configRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    }));
  };

  const updateFunctionRow = <K extends keyof EscalatorFunctionRow>(id: string, field: K, value: EscalatorFunctionRow[K]) => {
    setState((prev) => ({
      ...prev,
      functionRows: prev.functionRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    }));
  };

  const addPriceRow = () => {
    setState((prev) => ({
      ...prev,
      priceRows: [
        ...prev.priceRows,
        {
          id: Math.max(0, ...prev.priceRows.map((row) => row.id)) + 1,
          liftNo: String(prev.priceRows.length + 1),
          description: '304 stainless steel exterior cladding material 1.0mm ____ m²',
          speed: '',
          inclination: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  };

  const addSpecGroup = () => {
    setState((prev) => ({
      ...prev,
      specGroups: [
        ...prev.specGroups,
        {
          ...prev.specGroups[prev.specGroups.length - 1],
          id: Math.max(0, ...prev.specGroups.map((group) => group.id)) + 1,
          no: `E${prev.specGroups.length + 1}`,
          qty: '1',
        },
      ],
    }));
  };

  const saveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const historyEntry = {
      id: `${Date.now()}`,
      quotationNo: state.quotationNo,
      projectName: state.projectName,
      customer: state.customer,
      quotationType: state.quotationType,
      quotationDate: state.quotationDate,
      escalatorCount: state.priceRows.reduce((sum, row) => sum + Number(row.quantity || 0), 0),
      grandTotal,
      savedAt: new Date().toISOString(),
      state,
    };
    const updated = [historyEntry, ...quoteHistory.filter((entry) => entry.quotationNo !== state.quotationNo)].slice(0, 200);
    setQuoteHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const loadFromHistory = (entry: any) => {
    if (!window.confirm(`载入扶梯报价 ${entry.quotationNo || ''}？当前草稿将被替换。`)) return;
    const nextState = { ...initialState, ...entry.state };
    setState(nextState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  };

  const deleteFromHistory = (id: string) => {
    const updated = quoteHistory.filter((entry) => entry.id !== id);
    setQuoteHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const resetDraft = () => {
    if (!window.confirm('重置扶梯报价草稿？')) return;
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  };

  const handleGeneratePDF = () => {
    if (window !== window.top) {
      window.open(window.location.href, '_blank');
      return;
    }
    const prevTitle = document.title;
    document.title = buildFileTitle(state);
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 500);
  };

  const handleExportWord = async () => {
    try {
      const blob = await generateEscalatorWordBlob(state);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${buildFileTitle(state)}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('扶梯 Word 导出失败: ' + err.message);
    }
  };

  const inputClass = 'mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none';
  const sectionClass = 'rounded-lg bg-white p-4 shadow-sm';
  const previewTable = 'w-full border-collapse text-[11px] leading-tight';
  const thClass = 'border border-gray-400 bg-gray-100 p-1.5 text-center font-bold';
  const tdClass = 'border border-gray-400 p-1.5 align-middle';

  return (
    <main>
      <div className="bg-gray-100 p-4">
        <div className="sticky top-0 z-20 mb-4 rounded-lg bg-white/95 p-3 shadow-md backdrop-blur no-print">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:flex xl:flex-wrap">
              <Link href="/" className="py-2 px-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all text-center">
                电梯报价
              </Link>
              <Link href="/pi" className="py-2 px-3 bg-slate-900 text-white rounded-lg hover:bg-slate-700 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all text-center">
                PI 制作
              </Link>
              <Link href="/packing-list" className="py-2 px-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all text-center">
                箱单制作
              </Link>
              <Link href="/contract-maker/index.html?from=quote" className="py-2 px-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all text-center">
                合同制作
              </Link>
              <Link href="/escalator" className="py-2 px-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all text-center">
                扶梯报价
              </Link>
              <button onClick={resetDraft} className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all">
                新建报价
              </button>
              <button onClick={saveDraft} className={`py-2 px-3 text-white rounded-lg text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all ${saved ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'}`}>
                {saved ? '已保存' : '保存到报价库'}
              </button>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto] gap-2 xl:min-w-[480px] xl:justify-end">
              <button onClick={handleGeneratePDF} className="p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-semibold">
                {isClient && window !== window.top ? '新窗口打开并生成 PDF' : '生成 PDF'}
              </button>
              <button onClick={handleExportWord} className="px-4 p-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 font-semibold tracking-wide">
                📄 Word
              </button>
              <select
                value={state.language}
                onChange={(e) => setField('language', e.target.value as Lang)}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 font-semibold text-sm cursor-pointer"
                title="Switch output language"
              >
                <option value="en">🇬🇧 EN</option>
                <option value="zh">🇨🇳 中文</option>
                <option value="es">🇪🇸 ES</option>
                <option value="pt">🇧🇷 PT</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="vi">🇻🇳 VI</option>
                <option value="ru">🇷🇺 RU</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
        <section className="no-print w-full space-y-4 md:w-1/2">
          <div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">扶梯报价</h1>
              <p className="text-sm text-gray-500">Escalator quotation</p>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="mb-3 text-lg font-semibold">基本信息</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                ['customer', 'Customer'],
                ['quotationNo', 'Quotation No.'],
                ['projectName', 'Project Name'],
                ['quotationDate', 'Quotation Date'],
                ['paymentTerm', 'Payment Term'],
                ['containerEstimate', 'Container Estimate'],
              ].map(([field, label]) => (
                <label key={field} className="text-sm font-medium text-gray-700">
                  {label}
                  <input
                    type={field === 'quotationDate' ? 'date' : 'text'}
                    value={String(state[field as keyof EscalatorQuoteState])}
                    onChange={(e) => setField(field as keyof EscalatorQuoteState, e.target.value as never)}
                    className={inputClass}
                  />
                </label>
              ))}
              <label className="text-sm font-medium text-gray-700">
                Term
                <select
                  value={state.quotationType}
                  onChange={(e) => setField('quotationType', e.target.value)}
                  className={inputClass}
                >
                  <option>EXW</option>
                  <option>FOB</option>
                  <option>CIF</option>
                  <option>DDP</option>
                </select>
              </label>
              {!isExw && (
                <label className="text-sm font-medium text-gray-700">
                  Freight Destination
                  <input
                    type="text"
                    value={state.freightDestination}
                    onChange={(e) => setField('freightDestination', e.target.value)}
                    className={inputClass}
                  />
                </label>
              )}
              {[
                ['deliveryDays', 'Delivery Days'],
                ['validityDays', 'Validity Days'],
                ['warrantyMonths', 'Warranty Months'],
                ['exchangeRateBasis', 'USD = RMB'],
                ...(!isExw ? [['freightCost', 'Freight Cost']] : []),
              ].map(([field, label]) => (
                <label key={field} className="text-sm font-medium text-gray-700">
                  {label}
                  <input
                    type="number"
                    value={Number(state[field as keyof EscalatorQuoteState])}
                    onChange={(e) => setField(field as keyof EscalatorQuoteState, Number(e.target.value) as never)}
                    className={inputClass}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className={sectionClass}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Product & Price</h2>
              <button onClick={addPriceRow} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">添加行</button>
            </div>
            <div className="overflow-auto">
              <table className="min-w-[860px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    {['Lift NO.', 'Description', 'Speed', 'Inclination', 'Qty', 'Unit Price', ''].map((h) => (
                      <th key={h} className="border p-2 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.priceRows.map((row) => (
                    isPriceExtraRow(row) ? (
                      <tr key={row.id}>
                        <td className="border p-1"><input className={inputClass} value={row.liftNo} onChange={(e) => updatePriceRow(row.id, 'liftNo', e.target.value)} /></td>
                        <td className="border p-1" colSpan={3}><input className={inputClass} value={row.description} onChange={(e) => updatePriceRow(row.id, 'description', e.target.value)} /></td>
                        <td className="border p-1"><input className={inputClass} type="number" value={row.quantity} onChange={(e) => updatePriceRow(row.id, 'quantity', Number(e.target.value))} /></td>
                        <td className="border p-1"><input className={inputClass} type="number" value={row.unitPrice} onChange={(e) => updatePriceRow(row.id, 'unitPrice', Number(e.target.value))} /></td>
                        <td className="border p-1 text-center">
                          <button
                            onClick={() => setState((prev) => ({ ...prev, priceRows: prev.priceRows.filter((item) => item.id !== row.id) }))}
                            className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={row.id}>
                        <td className="border p-1"><input className={inputClass} value={row.liftNo} onChange={(e) => updatePriceRow(row.id, 'liftNo', e.target.value)} /></td>
                        <td className="border p-1"><input className={inputClass} value={row.description} onChange={(e) => updatePriceRow(row.id, 'description', e.target.value)} /></td>
                        <td className="border p-1"><input className={inputClass} value={row.speed} onChange={(e) => updatePriceRow(row.id, 'speed', e.target.value)} /></td>
                        <td className="border p-1"><input className={inputClass} value={row.inclination} onChange={(e) => updatePriceRow(row.id, 'inclination', e.target.value)} /></td>
                        <td className="border p-1"><input className={inputClass} type="number" value={row.quantity} onChange={(e) => updatePriceRow(row.id, 'quantity', Number(e.target.value))} /></td>
                        <td className="border p-1"><input className={inputClass} type="number" value={row.unitPrice} onChange={(e) => updatePriceRow(row.id, 'unitPrice', Number(e.target.value))} /></td>
                        <td className="border p-1 text-center">
                          <button
                            onClick={() => setState((prev) => ({ ...prev, priceRows: prev.priceRows.filter((item) => item.id !== row.id) }))}
                            className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={sectionClass}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Specification</h2>
              <button onClick={addSpecGroup} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">添加规格列</button>
            </div>
            <div className="space-y-4">
              {state.specGroups.map((group) => (
                <div key={group.id} className="rounded-md border border-gray-200 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <input className="rounded border border-gray-300 px-2 py-1 font-semibold" value={group.no} onChange={(e) => updateSpecGroup(group.id, 'no', e.target.value)} />
                    <button
                      onClick={() => setState((prev) => ({ ...prev, specGroups: prev.specGroups.filter((item) => item.id !== group.id) }))}
                      className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                    >
                      删除列
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {escalatorSpecRows.slice(1).map((row) => (
                      <label key={`${group.id}-${row.key}`} className="text-xs font-medium text-gray-600">
                        {row.label}
                        <input
                          className={inputClass}
                          value={String(group[row.key] ?? '')}
                          onChange={(e) => updateSpecGroup(group.id, row.key, e.target.value as never)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="mb-3 text-lg font-semibold">主要配置表</h2>
            <div className="max-h-[520px] overflow-auto">
              <table className="min-w-[760px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    {['NO.', 'Name', 'Brand', 'Remarks'].map((h) => <th key={h} className="border p-2 text-left">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {state.configRows.map((row) => (
                    <tr key={row.id} className={row.section ? 'bg-gray-50 font-semibold' : ''}>
                      <td className="border p-1"><input className={inputClass} value={row.no} onChange={(e) => updateConfigRow(row.id, 'no', e.target.value)} /></td>
                      <td className="border p-1"><input className={inputClass} value={row.name} onChange={(e) => updateConfigRow(row.id, 'name', e.target.value)} /></td>
                      <td className="border p-1"><input className={inputClass} value={row.brand} onChange={(e) => updateConfigRow(row.id, 'brand', e.target.value)} /></td>
                      <td className="border p-1"><input className={inputClass} value={row.remarks} onChange={(e) => updateConfigRow(row.id, 'remarks', e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="mb-3 text-lg font-semibold">Main Function Description</h2>
            <div className="max-h-[480px] overflow-auto">
              <table className="min-w-[820px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    {['No.', 'Function Name', 'Function Description'].map((h) => <th key={h} className="border p-2 text-left">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {state.functionRows.map((row) => (
                    <tr key={row.id}>
                      <td className="border p-1"><input className={inputClass} value={row.no} onChange={(e) => updateFunctionRow(row.id, 'no', e.target.value)} /></td>
                      <td className="border p-1"><input className={inputClass} value={row.name} onChange={(e) => updateFunctionRow(row.id, 'name', e.target.value)} /></td>
                      <td className="border p-1"><input className={inputClass} value={row.description} onChange={(e) => updateFunctionRow(row.id, 'description', e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </section>

        <section className="print-only-full-width sticky top-4 h-screen w-full overflow-y-auto md:w-1/2">
          <div className="w-full rounded-lg bg-white p-4 text-[12px] leading-snug text-black shadow-sm print:p-0 print:shadow-none">
            <Header />
            <div className="p-4">
            <h2 className="mb-4 border-b pb-2 text-3xl font-bold">{et.quotation}</h2>
            <p className="mb-4">
              {et.intro}
            </p>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <p><b>{et.customer}:</b> {state.customer}</p>
              <p><b>{et.term}:</b> {state.quotationType}</p>
              <p><b>{et.quotationNo}:</b> {state.quotationNo}</p>
              <p><b>{et.project}:</b> {state.projectName}</p>
              <p><b>{et.date}:</b> {state.quotationDate}</p>
            </div>

            <h3 className="mb-2 mt-4 text-base font-bold">{et.productPrice}</h3>
            <table className={previewTable}>
              <thead>
                <tr>
                  {[et.liftNo, et.description, et.speed, et.inclination, et.quantity, et.unitPrice, et.totalPrice].map((h) => (
                    <th key={h} className={thClass}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.priceRows.map((row) => (
                  isPriceExtraRow(row) ? (
                    <tr key={row.id}>
                      <td className={`${tdClass} text-center`}>{row.liftNo}</td>
                      <td className={tdClass} colSpan={3}>{row.description}</td>
                      <td className={`${tdClass} text-center`}>{row.quantity}</td>
                      <td className={`${tdClass} text-right`}>{money(row.unitPrice)}</td>
                      <td className={`${tdClass} text-right`}>{money(Number(row.quantity || 0) * Number(row.unitPrice || 0))}</td>
                    </tr>
                  ) : (
                    <tr key={row.id}>
                      <td className={`${tdClass} text-center`}>{row.liftNo}</td>
                      <td className={tdClass}>{row.description}</td>
                      <td className={`${tdClass} text-center`}>{row.speed}</td>
                      <td className={`${tdClass} text-center`}>{row.inclination}</td>
                      <td className={`${tdClass} text-center`}>{row.quantity}</td>
                      <td className={`${tdClass} text-right`}>{money(row.unitPrice)}</td>
                      <td className={`${tdClass} text-right`}>{money(Number(row.quantity || 0) * Number(row.unitPrice || 0))}</td>
                    </tr>
                  )
                ))}
                {!isExw && (
                  <tr>
                    <td className={`${tdClass} text-right`} colSpan={6}>{et.freight(state.freightDestination)}</td>
                    <td className={`${tdClass} text-right`}>{money(state.freightCost)}</td>
                  </tr>
                )}
                <tr className="bg-yellow-100 font-bold">
                  <td className={`${tdClass} text-right`} colSpan={6}>{et.total(state.quotationType, !isExw ? state.freightDestination : '')}</td>
                  <td className={`${tdClass} text-right`}>{money(grandTotal)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 space-y-1">
              <p>{et.exchangeNote(state.exchangeRateBasis)}</p>
              <p>{et.installNote}</p>
              <p>{et.validityNote(state.validityDays)}</p>
              <p>{et.containersNote(state.containerEstimate)}</p>
              <p><b>{et.paymentTerm}</b></p>
              <p>{state.paymentTerm}</p>
              <p><b>{et.deliveryDate}</b></p>
              <p>{et.deliveryText(state.deliveryDays)}</p>
              <p><b>{et.warrantyPeriod}</b></p>
              <p>{et.warrantyText(state.warrantyMonths)}</p>
            </div>

            <h3 className="mb-2 mt-6 text-center text-lg font-bold break-before-page">{et.specification}</h3>
            <table className={previewTable}>
              <thead>
                <tr>
                  <th className={thClass}>{et.specificationHeader}</th>
                  {state.specGroups.map((group) => <th key={group.id} className={thClass}>{group.no}</th>)}
                </tr>
              </thead>
              <tbody>
                {escalatorSpecRows.map((row) => (
                  <tr key={row.key}>
                    <td className={`${tdClass} font-medium`}>{row.label}</td>
                    {state.specGroups.map((group) => <td key={`${group.id}-${row.key}`} className={`${tdClass} text-center`}>{String(group[row.key] ?? '')}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="mb-2 mt-6 text-center text-lg font-bold break-before-page">{et.configuration}</h3>
            <table className={previewTable}>
              <thead>
                <tr>
                  {[et.configNo, et.configName, et.configBrand, et.configRemarks].map((h) => <th key={h} className={thClass}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {state.configRows.map((row) => (
                  <tr key={row.id} className={row.section ? 'bg-gray-100 font-bold' : ''}>
                    <td className={`${tdClass} text-center`}>{row.no}</td>
                    <td className={tdClass}>{row.name}</td>
                    <td className={`${tdClass} text-center`}>{row.brand}</td>
                    <td className={tdClass}>{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="mb-2 mt-6 text-center text-lg font-bold break-before-page">{et.functionDescription}</h3>
            <table className={previewTable}>
              <thead>
                <tr>
                  {[et.functionNo, et.functionName, et.functionText].map((h) => <th key={h} className={thClass}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {state.functionRows.map((row) => (
                  <tr key={row.id}>
                    <td className={`${tdClass} text-center`}>{row.no}</td>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-5 text-[11px]">
              {et.finalNote}
            </p>
            </div>
          </div>
        </section>
        </div>

        {isClient && (
          <div className="mt-6 no-print">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">
                扶梯历史报价
                <span className="ml-2 text-sm font-normal text-gray-400">{quoteHistory.length} 份</span>
              </h2>
              {quoteHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('清空全部扶梯历史？')) {
                      setQuoteHistory([]);
                      localStorage.removeItem(HISTORY_KEY);
                    }
                  }}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  清空
                </button>
              )}
            </div>

            {quoteHistory.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-400">
                还没有保存的扶梯报价。填好后点击顶部「保存草稿」即可保存到历史。
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
                {quoteHistory.map((entry) => {
                  const savedAt = new Date(entry.savedAt).toLocaleDateString('zh-CN', {
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const total = entry.grandTotal ? `$${Math.round(entry.grandTotal).toLocaleString()}` : '—';
                  return (
                    <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-orange-50">
                      <span className="w-12 shrink-0 text-center text-xs font-bold text-orange-600">{entry.quotationType}</span>
                      <span className="w-24 shrink-0 text-xs text-gray-400">{entry.quotationDate}</span>
                      <div className="w-40 shrink-0">
                        <div className="truncate text-sm font-bold text-gray-800">{entry.quotationNo}</div>
                        <div className="truncate text-xs text-gray-400">{entry.projectName}</div>
                      </div>
                      <div className="min-w-0 flex-1 truncate text-xs text-gray-500">{entry.customer}</div>
                      <span className="w-20 shrink-0 text-right text-xs text-gray-500">{entry.escalatorCount || 0} 台</span>
                      <span className="w-24 shrink-0 text-right text-sm font-semibold text-gray-700">{total}</span>
                      <span className="w-20 shrink-0 text-right text-xs text-gray-400">{savedAt}</span>
                      <div className="flex shrink-0 gap-1.5">
                        <button
                          onClick={() => loadFromHistory(entry)}
                          className="rounded bg-blue-500 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-600"
                        >
                          载入
                        </button>
                        <button
                          onClick={() => deleteFromHistory(entry.id)}
                          className="rounded border border-red-200 px-2 py-1 text-xs text-red-400 transition-colors hover:border-red-400 hover:text-red-600"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
