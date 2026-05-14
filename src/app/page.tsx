
"use client";
import { useState, useMemo, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import ElevatorForm from '@/components/ElevatorForm';
import { useQuoteStore } from '@/store/useQuoteStore';
import { translations } from '@/data/translations';
import { generateWordBlob } from '@/utils/generateWord';

const Quote = () => {
  const {
    companyName,
    quotationNo,
    projectName,
    quotationType,
    quotationDate,
    elevators,
    freightDestination,
    freightCost,
    exchangeRate,
    targetCurrency,
    deliveryDays,
    paymentTerm,
    warrantyMonths,
    priceValidityDays,
    exchangeRateBasis,
    shaftFrame,
    temperedGlass,
    partList,
    language,
    setField,
    addElevator,
    resetToDefaults,
    fetchExchangeRate,
    importState,
    updatePartListItem,
  } = useQuoteStore();

  const t = translations[language];

  const [focusedSection, setFocusedSection] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [libSaved, setLibSaved] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const HISTORY_KEY = 'quoter_history';

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      setQuoteHistory(saved);
    } catch {}
  }, []);

  const saveToHistory = (entry: any) => {
    setQuoteHistory(prev => {
      const updated = [entry, ...prev].slice(0, 50); // 最多保留50条
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteFromHistory = (id: number) => {
    setQuoteHistory(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const loadFromHistory = (entry: any) => {
    if (!window.confirm(`载入报价 ${entry.quotationNo}？当前草稿将被替换。`)) return;
    importState(entry.state);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Receive a quote from the SEO workbench library and restore it
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'LOAD_QUOTE') {
        if (window.confirm(`载入报价 ${e.data.state?.quotationNo || ''}？当前草稿将被替换。`)) {
          importState(e.data.state);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [importState]);

  const handleSaveToLibrary = () => {
    try {
      const s = useQuoteStore.getState();
      const safeElevators = s.elevators.map((e: any) => ({
        ...e,
        cabinEffect: {
          cabinImage: null, copImage: null, lopImage: null,
          ceiling:     { type: e.cabinEffect?.ceiling?.type,     value: e.cabinEffect?.ceiling?.type     === 'text' ? e.cabinEffect?.ceiling?.value     : '' },
          button:      { type: e.cabinEffect?.button?.type,      value: e.cabinEffect?.button?.type      === 'text' ? e.cabinEffect?.button?.value      : '' },
          floor:       { type: e.cabinEffect?.floor?.type,       value: e.cabinEffect?.floor?.type       === 'text' ? e.cabinEffect?.floor?.value       : '' },
          landingDoor: { type: e.cabinEffect?.landingDoor?.type, value: e.cabinEffect?.landingDoor?.type === 'text' ? e.cabinEffect?.landingDoor?.value : '' },
          handrail:    { type: e.cabinEffect?.handrail?.type,    value: e.cabinEffect?.handrail?.type    === 'text' ? e.cabinEffect?.handrail?.value    : '' },
          copLogo:     { type: e.cabinEffect?.copLogo?.type,     value: e.cabinEffect?.copLogo?.type     === 'text' ? e.cabinEffect?.copLogo?.value     : '' },
        },
      }));
      const safeState = {
        companyName: s.companyName, quotationNo: s.quotationNo, projectName: s.projectName,
        quotationType: s.quotationType, quotationDate: s.quotationDate,
        elevators: safeElevators, freightDestination: s.freightDestination,
        freightCost: s.freightCost, exchangeRate: s.exchangeRate, targetCurrency: s.targetCurrency,
        nextId: s.nextId, deliveryDays: s.deliveryDays, paymentTerm: s.paymentTerm,
        warrantyMonths: s.warrantyMonths, priceValidityDays: s.priceValidityDays,
      };
      const quote = {
        quotationNo: s.quotationNo, projectName: s.projectName,
        companyName: s.companyName, quotationType: s.quotationType,
        quotationDate: s.quotationDate, grandTotal,
        targetCurrency: s.targetCurrency, elevatorCount: s.elevators.length,
        savedAt: new Date().toISOString(),
        state: safeState,
      };

      // 如果在 iframe 里（SEO 工作台），通知父窗口保存到报价库
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'SAVE_QUOTE', quote }, '*');
      }

      // 保存到本地历史
      const historyEntry = {
        id: Date.now(),
        quotationNo: s.quotationNo, projectName: s.projectName,
        companyName: s.companyName, quotationType: s.quotationType,
        quotationDate: s.quotationDate, grandTotal,
        targetCurrency: s.targetCurrency, elevatorCount: s.elevators.length,
        savedAt: new Date().toISOString(),
        state: safeState,
      };
      saveToHistory(historyEntry);

      setLibSaved(true);
      setTimeout(() => setLibSaved(false), 2000);
    } catch (err: any) {
      alert('保存失败: ' + err.message);
    }
  };

  const handleGeneratePDF = () => {
    // When embedded as iframe in SEO workbench, window.print() is unreliable.
    // Open in a new tab so the user can print from a clean context.
    if (window !== window.top) {
      window.open(window.location.href, '_blank');
      return;
    }
    window.print();
  };

  const handleExportWord = async () => {
    try {
      const s = useQuoteStore.getState();
      const blob = await generateWordBlob({
        companyName: s.companyName,
        quotationNo: s.quotationNo,
        projectName: s.projectName,
        quotationType: s.quotationType,
        quotationDate: s.quotationDate,
        elevators: s.elevators,
        freightDestination: s.freightDestination,
        freightCost: s.freightCost,
        exchangeRate: s.exchangeRate,
        targetCurrency: s.targetCurrency,
        deliveryDays: s.deliveryDays,
        paymentTerm: s.paymentTerm,
        warrantyMonths: s.warrantyMonths,
        priceValidityDays: s.priceValidityDays,
        shaftFrame: s.shaftFrame,
        temperedGlass: s.temperedGlass,
        partList: s.partList,
        language: s.language,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${s.quotationNo || 'quotation'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Word 导出失败: ' + err.message);
    }
  };

  const handleExport = () => {
    const state = useQuoteStore.getState();
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-draft-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (window.confirm('确认导入此文件？当前草稿将被覆盖。')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const newState = JSON.parse(text);
            importState(newState);
            alert('草稿导入成功！');
          }
        } catch (error) {
          console.error("Failed to parse JSON file:", error);
          alert('导入失败，文件可能已损坏或格式不正确。');
        }
      };
      reader.readAsText(file);
    }
    // Reset file input to allow importing the same file again
    event.target.value = '';
  };

  const renderSpec = (label: string, value: any) => (
    <div key={label} className="flex justify-between py-1 px-2 border-b last:border-b-0 hover:bg-gray-50">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-right">{String(value)}</span>
    </div>
  );

  useEffect(() => {
    if (focusedSection) {
      const element = document.getElementById(`preview-${focusedSection}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedSection]);

  useEffect(() => {
    fetchExchangeRate();
  }, [targetCurrency, fetchExchangeRate]);

  const grandTotal = useMemo(() => {
    const elevatorsTotal = elevators.reduce((total, elevator) => {
      const price = Number(elevator.unitPrice) || 0;
      const quantity = Number(elevator.qty) || 0;
      return total + (price * quantity);
    }, 0);
    const shaftFrameTotal = shaftFrame.enabled ? Number(shaftFrame.price) : 0;
    const temperedGlassTotal = temperedGlass.enabled ? Number(temperedGlass.price) : 0;
    return elevatorsTotal + Number(freightCost) + shaftFrameTotal + temperedGlassTotal;
  }, [elevators, freightCost, shaftFrame, temperedGlass]);

  const convertedTotal = useMemo(() => {
    return grandTotal * Number(exchangeRate);
  }, [grandTotal, exchangeRate]);

  const validityUntilDate = useMemo(() => {
    if (!quotationDate || !priceValidityDays || Number(priceValidityDays) <= 0) {
      return '';
    }
    try {
      const startDate = new Date(quotationDate);
      // Check if startDate is a valid date
      if (isNaN(startDate.getTime())) {
        return '';
      }
      startDate.setDate(startDate.getDate() + Number(priceValidityDays));
      return startDate.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
    } catch (e) {
      return ''; // Return empty string if date is invalid
    }
  }, [quotationDate, priceValidityDays]);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Left Side - Inputs */}
          <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md no-print">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">报价详情</h2>
              <div className="flex gap-2">
                  <button onClick={handleImportClick} className="py-2 px-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all">
                    导入草稿
                  </button>
                  <button onClick={handleExport} className="py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all">
                    导出草稿
                  </button>
                  <button onClick={() => window.confirm('确认新建报价？当前草稿将会丢失。') && resetToDefaults()} className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all">
                    新建报价
                  </button>
                  <button onClick={handleSaveToLibrary} className={`py-2 px-3 text-white rounded-lg text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all ${libSaved ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'}`}>
                    {libSaved ? '✓ 已保存！' : '保存到报价库'}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".json"
                  />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name<span className="block text-xs text-gray-500">公司名称</span></label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={companyName}
                  onChange={(e) => setField('companyName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation No<span className="block text-xs text-gray-500">报价单号</span></label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={quotationNo}
                  onChange={(e) => setField('quotationNo', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Project Name<span className="block text-xs text-gray-500">项目名称</span></label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={projectName}
                  onChange={(e) => setField('projectName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation Type<span className="block text-xs text-gray-500">报价类型</span></label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={quotationType}
                  onChange={(e) => setField('quotationType', e.target.value)}
                >
                  <option>EXW</option>
                  <option>FOB</option>
                  <option>CIF</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation Date<span className="block text-xs text-gray-500">报价日期</span></label>
                <input
                  type="date"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={quotationDate}
                  onChange={(e) => setField('quotationDate', e.target.value)}
                />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-4 border-t pt-4">Freight & Currency<span className="block text-sm font-normal text-gray-500">运费和货币</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Freight Destination<span className="block text-xs text-gray-500">目的地</span></label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={freightDestination}
                  onChange={(e) => setField('freightDestination', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Freight Cost<span className="block text-xs text-gray-500">运费</span></label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={freightCost}
                  onChange={(e) => setField('freightCost', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Currency<span className="block text-xs text-gray-500">目标货币</span></label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={targetCurrency}
                  onChange={(e) => setField('targetCurrency', e.target.value)}
                >
                  <option value="-">-</option>
                  <option>NGN</option>
                  <option>CNY</option>
                  <option>USD</option>
                  <option>AUD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Exchange Rate<span className="block text-xs text-gray-500">汇率</span></label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={exchangeRate}
                  onChange={(e) => setField('exchangeRate', Number(e.target.value))}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4 border-t pt-4">Terms & Validity<span className="block text-sm font-normal text-gray-500">条款与有效期</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery (days)<span className="block text-xs text-gray-500">交货期 (天)</span></label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={deliveryDays}
                  onChange={(e) => setField('deliveryDays', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Warranty (months)<span className="block text-xs text-gray-500">质保期 (月)</span></label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={warrantyMonths}
                  onChange={(e) => setField('warrantyMonths', Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Payment Term<span className="block text-xs text-gray-500">付款方式</span></label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={paymentTerm}
                  onChange={(e) => setField('paymentTerm', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price Validity (days)<span className="block text-xs text-gray-500">价格有效期 (天)</span></label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={priceValidityDays}
                  onChange={(e) => setField('priceValidityDays', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Exchange Rate Basis (vs. RMB)<span className="block text-xs text-gray-500">汇率基准 (对人民币)</span></label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={exchangeRateBasis}
                  onChange={(e) => setField('exchangeRateBasis', e.target.value)}
                />
              </div>
            </div>

            {/* Optional Additional Items — above elevator specs */}
            <h3 className="text-lg font-semibold mt-6 mb-4 border-t pt-4">Additional Items (Optional)<span className="block text-sm font-normal text-gray-500">附加项目（可选）</span></h3>

            {/* Shaft Frame Row */}
            <div className="border border-gray-200 rounded-md p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="shaftFrameEnabled"
                  checked={shaftFrame.enabled}
                  onChange={(e) => setField('shaftFrame', { ...shaftFrame, enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <label htmlFor="shaftFrameEnabled" className="text-sm font-medium text-gray-700">
                  Row 1: Shaft Frame<span className="ml-1 text-xs text-gray-500">井道框架</span>
                </label>
              </div>
              {shaftFrame.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600">Description<span className="ml-1 text-gray-400">描述</span></label>
                    <input
                      value={shaftFrame.text}
                      onChange={(e) => setField('shaftFrame', { ...shaftFrame, text: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Price (USD)<span className="ml-1 text-gray-400">价格</span></label>
                    <input
                      type="number"
                      value={shaftFrame.price}
                      onChange={(e) => setField('shaftFrame', { ...shaftFrame, price: Number(e.target.value) })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tempered Glass Row */}
            <div className="border border-gray-200 rounded-md p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="temperedGlassEnabled"
                  checked={temperedGlass.enabled}
                  onChange={(e) => setField('temperedGlass', { ...temperedGlass, enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <label htmlFor="temperedGlassEnabled" className="text-sm font-medium text-gray-700">
                  Row 2: Tempered Glass<span className="ml-1 text-xs text-gray-500">钢化玻璃</span>
                </label>
              </div>
              {temperedGlass.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600">Description<span className="ml-1 text-gray-400">描述</span></label>
                    <input
                      value={temperedGlass.text}
                      onChange={(e) => setField('temperedGlass', { ...temperedGlass, text: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Price (USD)<span className="ml-1 text-gray-400">价格</span></label>
                    <input
                      type="number"
                      value={temperedGlass.price}
                      onChange={(e) => setField('temperedGlass', { ...temperedGlass, price: Number(e.target.value) })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {elevators.map((elevator) => (
              <ElevatorForm key={elevator.id} elevator={elevator} onSectionFocus={(section: string) => setFocusedSection(`${section}-${elevator.id}`)} />
            ))}
            <button onClick={addElevator} className="mt-4 w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600">+ 添加电梯</button>

            {/* Part List Editor */}
            <h3 className="text-lg font-semibold mt-6 mb-3 border-t pt-4">Part List<span className="block text-sm font-normal text-gray-500">零部件清单</span></h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 border border-gray-300 w-1/2">Part / 零部件</th>
                    <th className="text-left p-2 border border-gray-300">Brand / 品牌</th>
                    <th className="text-left p-2 border border-gray-300">Origin / 产地</th>
                  </tr>
                </thead>
                <tbody>
                  {partList.map(row =>
                    row.type === 'section' ? (
                      <tr key={row.id} className="bg-gray-50">
                        <td colSpan={3} className="p-2 border border-gray-300 font-semibold text-gray-700">{row.label}</td>
                      </tr>
                    ) : (
                      <tr key={row.id}>
                        <td className="p-2 border border-gray-300 text-gray-600">{row.label}</td>
                        <td className="p-1 border border-gray-300">
                          <input
                            value={row.brand}
                            onChange={(e) => updatePartListItem(row.id, 'brand', e.target.value)}
                            className="w-full p-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            value={row.origin}
                            onChange={(e) => updatePartListItem(row.id, 'origin', e.target.value)}
                            className="w-full p-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
                          />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="w-full md:w-1/2 sticky top-4 h-screen overflow-y-auto print-only-full-width">
            <div className="flex gap-2 mb-4 no-print">
              <button onClick={handleGeneratePDF} className="flex-1 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
                {isClient && window !== window.top ? '↗ 新窗口打开并生成 PDF' : '生成 PDF'}
              </button>
              <button
                onClick={handleExportWord}
                className="px-4 p-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 font-semibold tracking-wide"
                title="Export as Word document"
              >
                📄 Word
              </button>
              <select
                value={language}
                onChange={(e) => setField('language', e.target.value)}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 font-semibold text-sm cursor-pointer"
                title="Switch output language"
              >
                <option value="en">🇬🇧 EN</option>
                <option value="es">🇪🇸 ES</option>
                <option value="pt">🇧🇷 PT</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="ru">🇷🇺 RU</option>
              </select>
            </div>
            <div className="w-full p-4 bg-white rounded-lg shadow-md">
              <Header />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">{t.quotation}</h2>
                <div className="space-y-2">
                  <p><span className="font-semibold">{t.company}:</span> {companyName}</p>
                  <p><span className="font-semibold">{t.quotationNo}:</span> {quotationNo}</p>
                  <p><span className="font-semibold">{t.projectName}:</span> {projectName}</p>
                  <p><span className="font-semibold">{t.quotationType}:</span> {quotationType}</p>
                </div>

                <div className="mt-4 pt-4 border-t overflow-x-auto">
                  <h3 className="text-lg font-semibold mb-2">{t.priceTitle}</h3>
                  <table className="w-full text-sm text-left printable-table border-collapse">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 border border-gray-400">{t.colDescription}</th>
                        <th className="p-2 border border-gray-400">{t.colSpecs}</th>
                        <th className="p-2 border border-gray-400 text-center">{t.colQty}</th>
                        <th className="p-2 border border-gray-400 text-right">{t.colUnitPrice}</th>
                        <th className="p-2 border border-gray-400 text-right">{t.colTotalPrice}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {elevators.map(elevator => (
                        <tr key={elevator.id}>
                          <td className="p-2 border border-gray-400 align-top">{elevator.description}</td>
                          <td className="p-2 border border-gray-400 align-top">
                            <div>{elevator.type}</div>
                            <div>{elevator.capacity}KG</div>
                            <div>{elevator.speed} M/S</div>
                            <div>{elevator.floorsStops}</div>
                            {elevator.machineRoom && <div>{elevator.machineRoom}</div>}
                          </td>
                          <td className="p-2 border border-gray-400 align-top text-center">{elevator.qty}</td>
                          <td className="p-2 border border-gray-400 align-top text-right">{elevator.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                          <td className="p-2 border border-gray-400 align-top text-right">{(elevator.unitPrice * elevator.qty).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        </tr>
                      ))}
                      {shaftFrame.enabled && (
                        <tr>
                          <td colSpan={3} className="p-2 border border-gray-400">{shaftFrame.text}</td>
                          <td className="p-2 border border-gray-400 text-right">
                            {shaftFrame.price > 0 ? shaftFrame.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'}
                          </td>
                          <td className="p-2 border border-gray-400 text-right">
                            {shaftFrame.price > 0 ? shaftFrame.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'}
                          </td>
                        </tr>
                      )}
                      {temperedGlass.enabled && (
                        <tr>
                          <td colSpan={3} className="p-2 border border-gray-400">{temperedGlass.text}</td>
                          <td className="p-2 border border-gray-400 text-right">
                            {temperedGlass.price > 0 ? temperedGlass.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'}
                          </td>
                          <td className="p-2 border border-gray-400 text-right">
                            {temperedGlass.price > 0 ? temperedGlass.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={4} className="p-2 text-right font-semibold">{t.freight(freightDestination)}</td>
                        <td className="p-2 text-right">{freightCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                      <tr className="font-bold bg-gray-100">
                        <td colSpan={4} className="p-2 text-right">{t.totalAmount}</td>
                        <td className="p-2 text-right">{grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                      {targetCurrency !== 'USD' && targetCurrency !== '-' && (
                        <tr className="font-bold">
                          <td colSpan={4} className="p-2 text-right">=</td>
                          <td className="p-2 text-right">{convertedTotal.toLocaleString('en-US', { style: 'currency', currency: targetCurrency })}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-4 border-t text-sm space-y-1">
                  <p><span className="font-semibold">{t.delivery}</span> {deliveryDays} {t.deliverySuffix}</p>
                  <p><span className="font-semibold">{t.paymentTerm}</span> {paymentTerm}</p>
                  <p><span className="font-semibold">{t.warranty}</span> {warrantyMonths} {t.warrantySuffix}</p>
                  <p><span className="font-semibold">{t.priceValidity}</span> {priceValidityDays} {t.days} {validityUntilDate && `(${t.until} ${validityUntilDate})`}, based on 1 USD = {exchangeRateBasis} RMB.</p>
                </div>

                <div className="mt-4 pt-4 border-t break-before-page">
                  <h3 className="text-lg font-semibold mb-2">{t.specificationsTitle}</h3>
                  {elevators.map((elevator, index) => (
                    <div key={elevator.id}>
                      {/* Specifications Section */}
                      <div className={index > 0 ? 'break-before-page' : ''}>
                        <h4 className="text-md font-semibold mt-4 text-gray-700 print-elevator-header">{t.elevatorHeader(elevator.id)}</h4>
                        <div className="text-sm">
                          <div className="break-inside-avoid">
                            <h4 id={`preview-basic-spec-${elevator.id}`} className={`text-md font-semibold mt-2 border-b px-2 py-1 ${focusedSection === `basic-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>{t.secBasic}</h4>
                            {renderSpec(t.specDescription, elevator.description)}
                            {renderSpec(t.specType, elevator.type)}
                            {renderSpec(t.specCapacity, elevator.capacity)}
                            {renderSpec(t.specSpeed, elevator.speed)}
                            {renderSpec(t.specFloors, elevator.floorsStops)}
                            {renderSpec(t.specControl, elevator.controlSystem)}
                            {renderSpec(t.specServing, elevator.servingFloors)}
                            {renderSpec(t.specEntrances, elevator.entrances)}
                            {renderSpec(t.specPower, elevator.powerVoltage)}
                            {renderSpec(t.specLighting, elevator.lightingVoltage)}
                            {renderSpec(t.specFrequency, elevator.frequency)}
                            {renderSpec(t.specDrive, elevator.driveSystem)}
                          </div>
                          <div className="break-inside-avoid">
                            <h4 id={`preview-hoistway-spec-${elevator.id}`} className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === `hoistway-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>{t.secHoistway}</h4>
                            {renderSpec(t.specShaftConst, elevator.shaftConstruction)}
                            {renderSpec(t.specTravel, elevator.travel)}
                            {renderSpec(t.specHeadroom, elevator.headroom)}
                            {renderSpec(t.specPit, elevator.pitDepth)}
                            {renderSpec(t.specShaftSize, elevator.shaftSize)}
                            {elevator.machineRoom === 'MR' && renderSpec(t.specMachineRoom, elevator.machineRoomSize)}
                          </div>
                          <div className="break-inside-avoid">
                            <h4 id={`preview-car-spec-${elevator.id}`} className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === `car-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>{t.secCar}</h4>
                            {renderSpec(t.specCopPlate, elevator.copPlate)}
                            {renderSpec(t.specCarDim, elevator.carNetDimension)}
                            {renderSpec(t.specCeiling, elevator.carCeiling)}
                            {renderSpec(t.specCarFloor, elevator.carFloor)}
                            {renderSpec(t.specHandrail, elevator.carHandrail)}
                            {renderSpec(t.specWallLeft, elevator.carWall.left)}
                            {renderSpec(t.specWallRight, elevator.carWall.right)}
                            {renderSpec(t.specWallRear, elevator.carWall.rear)}
                          </div>
                          <div className="break-inside-avoid">
                            <h4 id={`preview-door-spec-${elevator.id}`} className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === `door-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>{t.secDoor}</h4>
                            {renderSpec(t.specDoorType, elevator.doorOpeningType)}
                            {renderSpec(t.specDoorSize, elevator.doorOpeningSize)}
                            {renderSpec(t.specDoorHeader, elevator.doorHeaderType)}
                            {renderSpec(t.specDoor1st, elevator.firstFloorDoor)}
                            {renderSpec(t.specDoorOther, elevator.otherFloorsDoor)}
                          </div>
                          <div className="break-inside-avoid">
                            <h4 id={`preview-function-spec-${elevator.id}`} className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === `function-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>{t.secFunction}</h4>
                            {renderSpec(t.specCopLop, elevator.copLop)}
                            {elevator.otherFunctions.map((func: any) =>
                              func.checked && renderSpec(func.name, t.specIncluded)
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cabin Effect Page */}
                      <div className="break-before-page p-4">
                        <h3 className="text-lg font-semibold mb-2 text-center bg-gray-200 p-2">{t.decorationTitle}</h3>
                        <p className="text-center text-sm text-gray-500 mb-2">{t.decorationNote}</p>
                        <div className="grid grid-cols-3 border-t border-l border-gray-400">
                          {/* Row 1: Titles */}
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">{t.cabin}</div>
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">{t.cop}</div>
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">{t.lop}</div>

                          {/* Row 2: Images */}
                          <div className="border-b border-r border-gray-400 p-2 flex items-center justify-center h-64">
                            {elevator.cabinEffect.cabinImage && <img src={elevator.cabinEffect.cabinImage} alt="Cabin" className="max-h-full max-w-full"/>}
                          </div>
                          <div className="border-b border-r border-gray-400 p-2 flex items-center justify-center h-64">
                            {elevator.cabinEffect.copImage && <img src={elevator.cabinEffect.copImage} alt="COP" className="max-h-full max-w-full"/>}
                          </div>
                          <div className="border-b border-r border-gray-400 p-2 flex items-center justify-center h-64">
                            {elevator.cabinEffect.lopImage && <img src={elevator.cabinEffect.lopImage} alt="LOP" className="max-h-full max-w-full"/>}
                          </div>

                          {/* Row 2: Titles */}
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">{t.cellCeiling}</div>
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">{t.cellButton}</div>
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">{t.cellFloor}</div>

                          {/* Row 3: Descriptions */}
                  <div className="border-b border-r border-gray-400 p-2 flex items-center justify-center h-24 text-center">
                    {elevator.cabinEffect.ceiling.type === 'image' && elevator.cabinEffect.ceiling.value ? <img src={elevator.cabinEffect.ceiling.value} alt="Ceiling" className="max-h-full max-w-full"/> : elevator.cabinEffect.ceiling.type === 'text' ? elevator.cabinEffect.ceiling.value : null}
                  </div>
                  <div className="border-b border-r border-gray-400 p-2 flex items-center justify-center h-24 text-center">
                    {elevator.cabinEffect.button.type === 'image' && elevator.cabinEffect.button.value ? <img src={elevator.cabinEffect.button.value} alt="Button" className="max-h-full max-w-full"/> : elevator.cabinEffect.button.type === 'text' ? elevator.cabinEffect.button.value : null}
                  </div>
                  <div className="border-b border-r border-gray-400 p-2 flex items-center justify-center h-24 text-center">
                    {elevator.cabinEffect.floor.type === 'image' && elevator.cabinEffect.floor.value ? <img src={elevator.cabinEffect.floor.value} alt="Floor" className="max-h-full max-w-full"/> : elevator.cabinEffect.floor.type === 'text' ? elevator.cabinEffect.floor.value : null}
                  </div>

                  {/* Row 4: Titles */}
                  <div className="font-bold text-center border-b border-r border-gray-400 p-1">{t.landingDoor}</div>
                  <div className="font-bold text-center border-b border-r border-gray-400 p-1">{t.handrail}</div>
                  <div className="font-bold text-center border-b border-r border-gray-400 p-1">{t.copLogo}</div>

                  {/* Row 5: Descriptions/Images */}
                  <div className="border-b border-r border-gray-400 p-2 flex items-center justify-center h-48">
                    {elevator.cabinEffect.landingDoor.type === 'image' && elevator.cabinEffect.landingDoor.value ? <img src={elevator.cabinEffect.landingDoor.value} alt="Landing Door" className="max-h-full max-w-full"/> : elevator.cabinEffect.landingDoor.type === 'text' ? elevator.cabinEffect.landingDoor.value : null}
                  </div>
                  <div className="border-b border-r border-gray-400 p-2 flex items-center justify-center h-48 text-center">
                    {elevator.cabinEffect.handrail.type === 'image' && elevator.cabinEffect.handrail.value ? <img src={elevator.cabinEffect.handrail.value} alt="Handrail" className="max-h-full max-w-full"/> : elevator.cabinEffect.handrail.type === 'text' ? elevator.cabinEffect.handrail.value : null}
                  </div>
                  <div className="border-b border-r border-gray-400 p-2 flex items-center justify-center h-48 text-center">
                    {elevator.cabinEffect.copLogo.type === 'image' && elevator.cabinEffect.copLogo.value ? <img src={elevator.cabinEffect.copLogo.value} alt="COP Logo" className="max-h-full max-w-full"/> : elevator.cabinEffect.copLogo.type === 'text' ? elevator.cabinEffect.copLogo.value : null}
                  </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t text-right text-sm text-gray-500">
                  <p>{t.quotationDate}: {quotationDate}</p>
                </div>

                {/* Part List */}
                <div className="mt-6 pt-4 border-t break-before-page">
                  <h3 className="text-lg font-semibold mb-3">{t.partListTitle}</h3>
                  <table className="w-full text-sm border-collapse printable-table">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 border border-gray-400 text-left">{t.partListColPart}</th>
                        <th className="p-2 border border-gray-400 text-left">{t.partListColBrand}</th>
                        <th className="p-2 border border-gray-400 text-left">{t.partListColOrigin}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partList.map(row =>
                        row.type === 'section' ? (
                          <tr key={row.id} className="bg-gray-100">
                            <td colSpan={3} className="p-2 border border-gray-400 font-semibold">{row.label}</td>
                          </tr>
                        ) : (
                          <tr key={row.id}>
                            <td className="p-2 border border-gray-400">{row.label}</td>
                            <td className="p-2 border border-gray-400">{row.brand}</td>
                            <td className="p-2 border border-gray-400">{row.origin}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  <p className="mt-3 text-xs text-gray-500 italic leading-relaxed">{t.partListNote}</p>
                </div>
              </div>
              <div className="hidden print:block print-footer">
                www.xinfuji.com
              </div>
            </div>
          </div>
        </div>

        {/* 历史报价 */}
        {isClient && (
          <div className="mt-6 no-print">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                历史报价
                <span className="ml-2 text-sm font-normal text-gray-400">{quoteHistory.length} 份</span>
              </h2>
              {quoteHistory.length > 0 && (
                <button
                  onClick={() => { if (window.confirm('清空全部历史？')) { setQuoteHistory([]); localStorage.removeItem(HISTORY_KEY); } }}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  清空
                </button>
              )}
            </div>

            {quoteHistory.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center text-gray-400 text-sm border border-dashed border-gray-200">
                还没有保存的报价。填好报价后点击「Save to Library」即可保存。
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {quoteHistory.map(entry => {
                  const date = new Date(entry.savedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  const total = entry.grandTotal
                    ? entry.grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
                    : '—';
                  return (
                    <div key={entry.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                      <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">{entry.quotationType} · {entry.quotationDate}</div>
                      <div className="font-bold text-gray-800 text-sm mb-0.5">{entry.quotationNo}</div>
                      <div className="text-sm text-gray-600 mb-0.5 truncate">{entry.projectName}</div>
                      <div className="text-xs text-gray-400 mb-2 truncate">{entry.companyName}</div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="font-medium text-gray-700">{total}</span>
                        <span>{entry.elevatorCount} 台 · {date}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadFromHistory(entry)}
                          className="flex-1 text-xs bg-blue-500 text-white rounded px-2 py-1.5 hover:bg-blue-600 transition-colors"
                        >
                          载入
                        </button>
                        <button
                          onClick={() => deleteFromHistory(entry.id)}
                          className="text-xs text-red-400 hover:text-red-600 px-2 py-1.5 rounded border border-red-200 hover:border-red-400 transition-colors"
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
    </div>
  );
}

export default Quote;
