
"use client";
import { useState, useMemo, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import ElevatorForm from '@/components/ElevatorForm';
import { useQuoteStore } from '@/store/useQuoteStore';

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
    setField,
    addElevator,
    resetToDefaults,
    fetchExchangeRate,
    importState,
  } = useQuoteStore();

  const [focusedSection, setFocusedSection] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [libSaved, setLibSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Receive a quote from the SEO workbench library and restore it
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'LOAD_QUOTE') {
        if (window.confirm('Load this quote from library? Current draft will be replaced.')) {
          importState(e.data.state);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [importState]);

  const handleSaveToLibrary = async () => {
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

      // 直接 POST 到 Railway 后端（无论在哪里打开都能保存）
      const res = await fetch('https://elevator-seo-production.up.railway.app/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);

      // 如果在 iframe 里，额外通知父窗口刷新报价库
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'QUOTE_SAVED' }, '*');
      }

      setLibSaved(true);
      setTimeout(() => setLibSaved(false), 2000);
    } catch (err: any) {
      alert('保存失败: ' + err.message);
    }
  };

  const handleGeneratePDF = async () => {
    await handleSaveToLibrary();
    window.print();
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

    if (window.confirm('Are you sure you want to import this file? This will overwrite your current draft.')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const newState = JSON.parse(text);
            importState(newState);
            alert('Draft imported successfully!');
          }
        } catch (error) {
          console.error("Failed to parse JSON file:", error);
          alert('Failed to import draft. The file may be corrupted or in the wrong format.');
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

  const componentRef = useRef(null);

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
    const elevatorsTotal = elevators.reduce((total, elevator) => total + (elevator.unitPrice * elevator.qty), 0);
    return elevatorsTotal + Number(freightCost);
  }, [elevators, freightCost]);

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
              <h2 className="text-xl font-semibold">Details<span className="block text-base font-normal text-gray-500">详细信息</span></h2>
              <div className="flex flex-col space-y-2 items-end">
                  <button onClick={() => window.confirm('Are you sure you want to start a new quote? All unsaved changes will be lost.') && resetToDefaults()} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm w-32">
                    Start New Quote
                  </button>
                  <button onClick={handleExport} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm w-32">
                    Export Draft
                  </button>
                  <button onClick={handleImportClick} className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm w-32">
                    Import Draft
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
                  onChange={(e) => setField('freightCost', e.target.value)}
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
                  onChange={(e) => setField('exchangeRate', e.target.value)}
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
                  onChange={(e) => setField('deliveryDays', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Warranty (months)<span className="block text-xs text-gray-500">质保期 (月)</span></label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={warrantyMonths}
                  onChange={(e) => setField('warrantyMonths', e.target.value)}
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
            </div>

            {elevators.map((elevator) => (
              <ElevatorForm key={elevator.id} elevator={elevator} onSectionFocus={(section: string) => setFocusedSection(`${section}-${elevator.id}`)} />
            ))}
            <button onClick={addElevator} className="mt-4 w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Elevator</button>
          </div>

          {/* Right Side - Preview */}
          <div className="w-full md:w-1/2 sticky top-4 h-screen overflow-y-auto print-only-full-width">
            <button onClick={handleGeneratePDF} disabled={libSaved} className={`mb-4 w-full p-2 text-white rounded-lg shadow-md no-print transition-colors ${libSaved ? 'bg-green-600 cursor-default' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {libSaved ? '✓ 已保存，正在生成 PDF...' : '生成 PDF'}
            </button>
            <div ref={componentRef} className="w-full p-4 bg-white rounded-lg shadow-md">
              <Header />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Quotation</h2>
                <div className="space-y-2">
                  <p><span className="font-semibold">Company:</span> {companyName}</p>
                  <p><span className="font-semibold">Quotation No:</span> {quotationNo}</p>
                  <p><span className="font-semibold">Project Name:</span> {projectName}</p>
                  <p><span className="font-semibold">Quotation Type:</span> {quotationType}</p>
                </div>

                <div className="mt-4 pt-4 border-t overflow-x-auto">
                  <h3 className="text-lg font-semibold mb-2">Price - Currency: USD</h3>
                  <table className="w-full text-sm text-left printable-table border-collapse">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 border border-gray-400">Description</th>
                        <th className="p-2 border border-gray-400">Specs</th>
                        <th className="p-2 border border-gray-400 text-center">QTY-sets</th>
                        <th className="p-2 border border-gray-400 text-right">Unit Price</th>
                        <th className="p-2 border border-gray-400 text-right">Total Price</th>
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
                          </td>
                          <td className="p-2 border border-gray-400 align-top text-center">{elevator.qty}</td>
                          <td className="p-2 border border-gray-400 align-top text-right">{elevator.unitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                          <td className="p-2 border border-gray-400 align-top text-right">{(elevator.unitPrice * elevator.qty).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4} className="p-2 text-right font-semibold">Local fee and Freight from factory to {freightDestination} :</td>
                        <td className="p-2 text-right">{freightCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                      <tr className="font-bold bg-gray-100">
                        <td colSpan={4} className="p-2 text-right">Total amount :</td>
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
                  <p><span className="font-semibold">I. Delivery:</span> {deliveryDays} days after receive down payment and confirmed drawing.</p>
                  <p><span className="font-semibold">II. Payment term:</span> {paymentTerm}</p>
                  <p><span className="font-semibold">III. Warranty:</span> {warrantyMonths} months since goods arrival at destination port.</p>
                  <p><span className="font-semibold">IV. Price validity:</span> {priceValidityDays} days {validityUntilDate && `(until ${validityUntilDate})`}</p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                  {elevators.map((elevator, index) => (
                    <div key={elevator.id}>
                      {/* Specifications Section */}
                      <div className={index > 0 ? 'break-before-page' : ''}>
                        <h4 className="text-md font-semibold mt-4 text-gray-700 print-elevator-header">Elevator #L{elevator.id} Specifications</h4>
                        <div className="text-sm">
                          <div className="break-inside-avoid">
                            <h4 id={`preview-basic-spec-${elevator.id}`} className={`text-md font-semibold mt-2 border-b px-2 py-1 ${focusedSection === `basic-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>I. Basic specification</h4>
                            {renderSpec('Description', elevator.description)}
                            {renderSpec('Type', elevator.type)}
                            {renderSpec('Capacity (KG)', elevator.capacity)}
                            {renderSpec('Speed (M/S)', elevator.speed)}
                            {renderSpec('Floors/Stops', elevator.floorsStops)}
                            {renderSpec('Control System', elevator.controlSystem)}
                            {renderSpec('Serving floors (COP display)', elevator.servingFloors)}
                            {renderSpec('Entrances', elevator.entrances)}
                            {renderSpec('Power voltage', elevator.powerVoltage)}
                            {renderSpec('Lighting voltage', elevator.lightingVoltage)}
                            {renderSpec('Frequency', elevator.frequency)}
                            {renderSpec('Drive System', elevator.driveSystem)}
                          </div>
                          <div className="break-inside-avoid">
                            <h4 id={`preview-hoistway-spec-${elevator.id}`} className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === `hoistway-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>II. Hoistway specification</h4>
                            {renderSpec('Shaft construction', elevator.shaftConstruction)}
                            {renderSpec('Travel (mm)', elevator.travel)}
                            {renderSpec('Headroom (mm)', elevator.headroom)}
                            {renderSpec('Pit Depth (mm)', elevator.pitDepth)}
                            {renderSpec('Shaft Size (W x D mm)', elevator.shaftSize)}
                            {renderSpec('Machine Room Size (W x D x H mm)', elevator.machineRoomSize)}
                          </div>
                          <div className="break-inside-avoid">
                            <h4 id={`preview-car-spec-${elevator.id}`} className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === `car-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>III. Car Specification</h4>
                            {renderSpec('COP Plate', elevator.copPlate)}
                            {renderSpec('Car Net Dimension', elevator.carNetDimension)}
                            {renderSpec('Car Ceiling', elevator.carCeiling)}
                            {renderSpec('Car Floor', elevator.carFloor)}
                            {renderSpec('Handrail', elevator.carHandrail)}
                            {renderSpec('Left wall finish', elevator.carWall.left)}
                            {renderSpec('Right wall finish', elevator.carWall.right)}
                            {renderSpec('Rear wall finish', elevator.carWall.rear)}
                          </div>
                          <div className="break-inside-avoid">
                            <h4 id={`preview-door-spec-${elevator.id}`} className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === `door-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>IV. Door specification</h4>
                            {renderSpec('Door Opening Type', elevator.doorOpeningType)}
                            {renderSpec('Door Opening Size (W x H mm)', elevator.doorOpeningSize)}
                            {renderSpec('Door Header Type', elevator.doorHeaderType)}
                            {renderSpec('1st Floor Door Decoration', elevator.firstFloorDoor)}
                            {renderSpec('Other Floors Door Decoration', elevator.otherFloorsDoor)}
                          </div>
                          <div className="break-inside-avoid">
                            <h4 id={`preview-function-spec-${elevator.id}`} className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === `function-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>V. Function</h4>
                            {renderSpec('COP/LOP', elevator.copLop)}
                            {elevator.otherFunctions.map((func: any) => 
                              func.checked && renderSpec(func.name, 'Included')
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cabin Effect Page */}
                      <div className="break-before-page p-4">
                        <h3 className="text-lg font-semibold mb-2 text-center bg-gray-200 p-2">Decoration Effect 效果图</h3>
                        <p className="text-center text-sm text-gray-500 mb-2">(Images are for reference only, subject to the real object)</p>
                        <div className="grid grid-cols-3 border-t border-l border-gray-400">
                          {/* Row 1: Titles */}
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">CABIN</div>
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">COP</div>
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">LOP</div>

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
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">CEILING</div>
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">BUTTON</div>
                          <div className="font-bold text-center border-b border-r border-gray-400 p-1">FLOOR</div>

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
                  <div className="font-bold text-center border-b border-r border-gray-400 p-1">LANDING DOOR</div>
                  <div className="font-bold text-center border-b border-r border-gray-400 p-1">HANDRAIL</div>
                  <div className="font-bold text-center border-b border-r border-gray-400 p-1">COP LOGO</div>

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
                  <p>Quotation Date: {quotationDate}</p>
                </div>
              </div>
              <div className="hidden print:block print-footer">
                www.xinfuji.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quote;
