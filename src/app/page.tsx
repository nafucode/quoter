
"use client";
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ElevatorForm from '@/components/ElevatorForm';
import { useQuoteStore } from '@/store/useQuoteStore';
import { translations } from '@/data/translations';
import { generateWordBlob } from '@/utils/generateWord';
import { translateValueToZh } from '@/data/zhValueMap';
import { translateValueToEs } from '@/data/esValueMap';
import { translateValueToFr } from '@/data/frValueMap';
import { translateValueToVi } from '@/data/viValueMap';
import { translateValueToKm } from '@/data/kmValueMap';
import { translateValueToAr } from '@/data/arValueMap';
import { standardFeatures } from '@/data/standardFeatures';
import { translateStandardFeature } from '@/data/standardFeatureTranslations';
import { countryGroups } from '@/data/countryOptions';
import { countryPorts } from '@/data/countryPorts';

const warrantyTextOptions = [
  {
    label: 'Default warranty text',
    value: 'default',
  },
  {
    label: 'Core components 5 years / Complete elevator 2 years',
    value:
      'Core components (Motor, Controller, and Door Operator): 5-year warranty. Complete elevator: 2-year warranty, effective from the date of shipment.',
  },
];

const paymentTermOptions = [
  {
    label: '30% deposit / 70% before delivery',
    value: 'Pay a 30% deposit within 3 days of signing to activate the contract; the 70% balance is due 7 working days before delivery.',
  },
  {
    label: '100% irrevocable L/C at sight',
    value: '100% payment by irrevocable Letter of Credit at sight.',
  },
  {
    label: '50% deposit / 50% irrevocable L/C at sight',
    value: '50% payment by T/T as deposit; the remaining 50% by irrevocable Letter of Credit at sight.',
  },
];

const sortCompanyOptions = (names: string[]) =>
  [...names]
    .filter((name) => typeof name === 'string' && name.trim())
    .sort((a, b) => a.trim().localeCompare(b.trim(), undefined, { sensitivity: 'base', numeric: true }));

const DEFAULT_FREIGHT_PLACEHOLDER = 'e.g., Port of Shanghai';
const EXW_PICKUP_DESTINATION = 'Pickup from factory arranged by the customer. 客户安排工厂自提。';
const NIGERIA_YY_CARGO_DESTINATION = 'To YY cargo Yiwu Warehouse China';

const formatFreightText = (dest: string, freight: (dest: string) => string) =>
  dest.trim().toLowerCase().startsWith('to ')
    ? `Local fee and Freight from factory ${dest} :`
    : freight(dest);

const Quote = () => {
  const {
    companyName,
    country,
    ruc,
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
    warrantyText,
    priceValidityDays,
    quoteRemarks,
    certificationStandard,
    showCertificationStandard,
    exchangeRateBasis,
    shaftFrame,
    temperedGlass,
    showPartList,
    showFunctionList,
    partListTemplate,
    partList,
    language,
    setField,
    addElevator,
    resetToDefaults,
    fetchExchangeRate,
    importState,
    updatePartListItem,
    setPartListTemplate,
  } = useQuoteStore();

  const isPlatformPartList = partListTemplate === 'platform';
  const availableDestinationPorts = countryPorts[country] || [];
  const shouldShowRuc = country === 'Peru' && ruc.trim();
  const exwDeliveryOptions = [
    { value: EXW_PICKUP_DESTINATION, label: EXW_PICKUP_DESTINATION, freightCost: 0 },
    ...(country === 'Nigeria'
      ? [{ value: NIGERIA_YY_CARGO_DESTINATION, label: NIGERIA_YY_CARGO_DESTINATION, freightCost: 500 }]
      : []),
  ];

  const t = translations[language];
  const selectedCertificationStandard = certificationStandard || 'CE Certification';
  const shouldShowCertificationStandard = showCertificationStandard ?? false;

  const [focusedSection, setFocusedSection] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [libSaved, setLibSaved] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState<any[]>([]);
  const [shaftFrameCalc, setShaftFrameCalc] = useState({
    widthMm: 2000,
    depthMm: 2200,
    heightM: 12,
    frameType: 'aluminum' as 'aluminum' | 'steel',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const HISTORY_KEY = 'quoter_history';
  const CURRENT_CONTRACT_QUOTE_KEY = 'quoter_current_contract_quote';
  const COMPANY_OPTIONS_KEY = 'quoter_company_options';

  const [companyOptions, setCompanyOptions] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      setQuoteHistory(saved);
    } catch {}
    try {
      const savedCompanies = JSON.parse(localStorage.getItem(COMPANY_OPTIONS_KEY) || '[]');
      if (Array.isArray(savedCompanies)) {
        setCompanyOptions(sortCompanyOptions(savedCompanies));
      }
    } catch {}
  }, []);

  const historySequenceById = useMemo(() => {
    const sequence = new Map<string, string>();
    [...quoteHistory]
      .sort((a, b) => {
        const aTime = new Date(a.savedAt || 0).getTime();
        const bTime = new Date(b.savedAt || 0).getTime();
        return aTime - bTime;
      })
      .forEach((entry, index) => {
        sequence.set(String(entry.id), String(index + 1).padStart(3, '0'));
      });
    return sequence;
  }, [quoteHistory]);

  const saveToHistory = (entry: any) => {
    setQuoteHistory(prev => {
      const updated = [entry, ...prev].slice(0, 300); // 最多保留300条
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

  const saveCompanyOption = () => {
    const trimmedName = companyName.trim();
    if (!trimmedName) return;
    setCompanyOptions(prev => {
      const updated = sortCompanyOptions([trimmedName, ...prev.filter(name => name !== trimmedName)]).slice(0, 100);
      localStorage.setItem(COMPANY_OPTIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleQuotationTypeChange = (value: string) => {
    setField('quotationType', value);
    const shouldUseDefaultDestination =
      !freightDestination ||
      freightDestination === DEFAULT_FREIGHT_PLACEHOLDER ||
      freightDestination === 'SHANGHAI PORT' ||
      countryPorts[country]?.includes(freightDestination) ||
      quotationType === 'EXW';
    if (value === 'FOB' && shouldUseDefaultDestination) {
      setField('freightDestination', 'SHANGHAI PORT');
    }
    if (value === 'CIF' && shouldUseDefaultDestination && availableDestinationPorts[0]) {
      setField('freightDestination', availableDestinationPorts[0]);
    }
    if (value === 'EXW' && shouldUseDefaultDestination) {
      setField('freightDestination', EXW_PICKUP_DESTINATION);
      setField('freightCost', 0);
    }
  };

  const handleCountryChange = (value: string) => {
    setField('country', value);
    const ports = countryPorts[value] || [];
    const shouldUseDefaultDestination =
      quotationType === 'CIF' &&
      ports[0] &&
      (!freightDestination ||
        freightDestination === DEFAULT_FREIGHT_PLACEHOLDER ||
        freightDestination === 'SHANGHAI PORT' ||
        countryPorts[country]?.includes(freightDestination));
    if (shouldUseDefaultDestination) {
      setField('freightDestination', ports[0]);
    }
    if (quotationType === 'EXW' && value !== 'Nigeria' && freightDestination === NIGERIA_YY_CARGO_DESTINATION) {
      setField('freightDestination', EXW_PICKUP_DESTINATION);
      setField('freightCost', 0);
    }
  };

  const handleExwDeliveryOptionChange = (value: string) => {
    const option = exwDeliveryOptions.find((item) => item.value === value);
    if (!option) return;
    setField('freightDestination', option.value);
    setField('freightCost', option.freightCost);
  };

  const loadFromHistory = (entry: any) => {
    if (!window.confirm(`载入报价 ${entry.quotationNo}？当前草稿将被替换。`)) return;
    importState(entry.state);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildCurrentQuoteEntry = () => {
    const s = useQuoteStore.getState();
    const libraryImage = (value: unknown) =>
      typeof value === 'string' && value.startsWith('/') ? value : '';
    const safeHybrid = (field: any) => {
      if (field?.type === 'text') return { type: 'text', value: field.value || '' };
      if (field?.type === 'image') return { type: 'image', value: libraryImage(field.value) };
      return { type: field?.type || 'text', value: '' };
    };
    const safeElevators = s.elevators.map((e: any) => ({
      ...e,
      cabinEffect: {
        cabinImage: libraryImage(e.cabinEffect?.cabinImage),
        copImage: libraryImage(e.cabinEffect?.copImage),
        lopImage: libraryImage(e.cabinEffect?.lopImage),
        ceiling: safeHybrid(e.cabinEffect?.ceiling),
        button: safeHybrid(e.cabinEffect?.button),
        floor: safeHybrid(e.cabinEffect?.floor),
        landingDoor: safeHybrid(e.cabinEffect?.landingDoor),
        handrail: safeHybrid(e.cabinEffect?.handrail),
        copLogo: safeHybrid(e.cabinEffect?.copLogo),
      },
    }));
    const safeState = {
      companyName: s.companyName, country: s.country, ruc: s.ruc, quotationNo: s.quotationNo, projectName: s.projectName,
      quotationType: s.quotationType, quotationDate: s.quotationDate,
      elevators: safeElevators, freightDestination: s.freightDestination,
      freightCost: s.freightCost, exchangeRate: s.exchangeRate, targetCurrency: s.targetCurrency,
      nextId: s.nextId, deliveryDays: s.deliveryDays, paymentTerm: s.paymentTerm,
      warrantyMonths: s.warrantyMonths, warrantyText: s.warrantyText, priceValidityDays: s.priceValidityDays,
      quoteRemarks: s.quoteRemarks,
      grandTotal,
      certificationStandard: s.certificationStandard || 'CE Certification',
      showCertificationStandard: s.showCertificationStandard ?? false,
      shaftFrame: s.shaftFrame,
      temperedGlass: s.temperedGlass,
      showPartList: s.showPartList, showFunctionList: s.showFunctionList,
      partListTemplate: s.partListTemplate,
      partList: s.partList,
    };
    return {
      id: `current-${Date.now()}`,
      quotationNo: s.quotationNo || 'Current quotation',
      projectName: s.projectName,
      companyName: s.companyName,
      country: s.country,
      ruc: s.ruc,
      quotationType: s.quotationType,
      quotationDate: s.quotationDate,
      grandTotal,
      targetCurrency: s.targetCurrency,
      elevatorCount: s.elevators.length,
      elevatorTypes: s.elevators.map((e: any) => e.type).filter(Boolean),
      savedAt: new Date().toISOString(),
      state: safeState,
      source: 'current-quote',
    };
  };

  const persistCurrentQuoteForContract = () => {
    try {
      localStorage.setItem(CURRENT_CONTRACT_QUOTE_KEY, JSON.stringify(buildCurrentQuoteEntry()));
    } catch (err) {
      console.warn('Failed to prepare contract quote', err);
    }
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
      const historyEntry: any = buildCurrentQuoteEntry();
      historyEntry.id = Date.now();
      delete historyEntry.source;
      const quote = {
        quotationNo: s.quotationNo, projectName: s.projectName,
        companyName: s.companyName, country: s.country, ruc: s.ruc, quotationType: s.quotationType,
        quotationDate: s.quotationDate, grandTotal,
        targetCurrency: s.targetCurrency, elevatorCount: s.elevators.length,
        savedAt: new Date().toISOString(),
        state: historyEntry.state,
      };

      // 如果在 iframe 里（SEO 工作台），通知父窗口保存到报价库
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'SAVE_QUOTE', quote }, '*');
      }

      // 保存到本地历史
      saveToHistory(historyEntry);

      setLibSaved(true);
      setTimeout(() => setLibSaved(false), 2000);
    } catch (err: any) {
      alert('保存失败: ' + err.message);
    }
  };

  const buildQuotationFileTitle = (company: string, project: string) => {
    const sanitize = (s: string) => s.replace(/[/\\?%*:|"<>]/g, '-').trim();
    return `Quotation-${sanitize(company)}-${sanitize(project)}`;
  };

  const handleGeneratePDF = () => {
    // When embedded as iframe in SEO workbench, window.print() is unreliable.
    // Open in a new tab so the user can print from a clean context.
    if (window !== window.top) {
      window.open(window.location.href, '_blank');
      return;
    }
    // Set document.title so the browser uses it as the default PDF filename.
    const pdfTitle = buildQuotationFileTitle(companyName, projectName);
    const prevTitle = document.title;
    document.title = pdfTitle;
    window.print();
    // Restore after a tick (print dialog is synchronous on most browsers)
    setTimeout(() => { document.title = prevTitle; }, 500);
  };

  const handleExportWord = async () => {
    try {
      const s = useQuoteStore.getState();
      const blob = await generateWordBlob({
        companyName: s.companyName,
        country: s.country,
        ruc: s.ruc,
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
        warrantyText: s.warrantyText,
        priceValidityDays: s.priceValidityDays,
        quoteRemarks: s.quoteRemarks,
        certificationStandard: s.certificationStandard || 'CE Certification',
        showCertificationStandard: s.showCertificationStandard ?? false,
        shaftFrame: s.shaftFrame,
        temperedGlass: s.temperedGlass,
        showPartList: s.showPartList,
        showFunctionList: s.showFunctionList,
        partListTemplate: s.partListTemplate,
        partList: s.partList,
        language: s.language,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${buildQuotationFileTitle(s.companyName, s.projectName)}.docx`;
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

  const translateValue = (v: string) => {
    if (language === 'zh') return translateValueToZh(v);
    if (language === 'es') return translateValueToEs(v);
    if (language === 'fr') return translateValueToFr(v);
    if (language === 'vi') return translateValueToVi(v);
    if (language === 'km') return translateValueToKm(v);
    if (language === 'ar') return translateValueToAr(v);
    return v;
  };

  const renderSpec = (label: string, value: any) => {
    const displayValue = translateValue(String(value));
    return (
      <div key={label} className="flex justify-between py-1 px-2 border-b last:border-b-0 hover:bg-gray-50">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-right">{displayValue}</span>
      </div>
    );
  };

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

  const isExw = quotationType === 'EXW';
  const isDefaultExwNoChargeDestination =
    !freightDestination ||
    freightDestination === EXW_PICKUP_DESTINATION ||
    freightDestination === DEFAULT_FREIGHT_PLACEHOLDER ||
    freightDestination === 'SHANGHAI PORT';
  const shouldChargeFreight = !isExw || (!isDefaultExwNoChargeDestination && Number(freightCost) > 0);

  const grandTotal = useMemo(() => {
    const elevatorsTotal = elevators.reduce((total, elevator) => {
      const price = Number(elevator.unitPrice) || 0;
      const quantity = Number(elevator.qty) || 0;
      return total + (price * quantity);
    }, 0);
    const shaftFrameTotal = shaftFrame.enabled ? (Number(shaftFrame.price) || 0) * (Number(shaftFrame.qty) || 0) : 0;
    const temperedGlassTotal = temperedGlass.enabled ? (Number(temperedGlass.price) || 0) * (Number(temperedGlass.qty) || 0) : 0;
    return elevatorsTotal + (shouldChargeFreight ? Number(freightCost) : 0) + shaftFrameTotal + temperedGlassTotal;
  }, [elevators, freightCost, shaftFrame, shouldChargeFreight, temperedGlass]);

  const convertedTotal = useMemo(() => {
    return grandTotal * Number(exchangeRate);
  }, [grandTotal, exchangeRate]);

  const targetRoundingUnit = targetCurrency === 'NGN' ? 1000 : 1;
  const roundedConvertedTotal = useMemo(() => {
    if (!convertedTotal || !Number.isFinite(convertedTotal)) return 0;
    return Math.ceil(convertedTotal / targetRoundingUnit) * targetRoundingUnit;
  }, [convertedTotal, targetRoundingUnit]);

  const formatTargetCurrency = (amount: number) =>
    amount.toLocaleString('en-US', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: targetCurrency === 'NGN' ? 0 : 2,
      maximumFractionDigits: targetCurrency === 'NGN' ? 0 : 2,
    });

  const roundTargetCurrencyTotal = () => {
    if (!grandTotal || targetCurrency === '-' || targetCurrency === 'USD') return;
    const nextConvertedTotal = roundedConvertedTotal || convertedTotal;
    const nextRate = nextConvertedTotal / grandTotal;
    setField('exchangeRate', Number(nextRate.toFixed(8)));
  };

  const shaftFrameEstimate = useMemo(() => {
    const widthM = (Number(shaftFrameCalc.widthMm) || 0) / 1000;
    const depthM = (Number(shaftFrameCalc.depthMm) || 0) / 1000;
    const heightM = Number(shaftFrameCalc.heightM) || 0;
    const chargeHeight = heightM + 1;
    const glassArea = (widthM * 1.5 + depthM * 2) * chargeHeight;
    const glassCostRmb = glassArea * 250;
    const frameRateRmb = shaftFrameCalc.frameType === 'steel' ? 1300 : 1800;
    const frameCostRmb = frameRateRmb * chargeHeight;
    const totalRmb = glassCostRmb + frameCostRmb;
    const usdRate = Number(exchangeRateBasis) || 6.8;
    const glassCostUsd = Math.round(glassCostRmb / usdRate);
    const frameCostUsd = Math.round(frameCostRmb / usdRate);
    const totalUsd = Math.round(totalRmb / usdRate);
    const frameLabel = shaftFrameCalc.frameType === 'steel' ? 'Steel shaft frame' : 'Aluminum shaft frame';

    return {
      chargeHeight,
      glassArea,
      glassCostRmb,
      glassCostUsd,
      frameRateRmb,
      frameCostRmb,
      frameCostUsd,
      totalRmb,
      totalUsd,
      description: `${frameLabel} as Height ${heightM || 0} m`,
    };
  }, [exchangeRateBasis, shaftFrameCalc]);

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
        <div className="sticky top-0 z-20 mb-4 rounded-lg bg-white/95 p-3 shadow-md backdrop-blur no-print">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:flex xl:flex-wrap">
              <button onClick={handleImportClick} className="py-2 px-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all">
                导入草稿
              </button>
              <Link href="/pi" className="py-2 px-3 bg-slate-900 text-white rounded-lg hover:bg-slate-700 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all text-center">
                PI 制作
              </Link>
              <Link href="/packing-list" className="py-2 px-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all text-center">
                箱单制作
              </Link>
              <Link href="/contract-maker/index.html?from=quote" onClick={persistCurrentQuoteForContract} className="py-2 px-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all text-center">
                合同制作
              </Link>
              <Link href="/escalator" className="py-2 px-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all text-center">
                扶梯报价
              </Link>
              <button onClick={handleExport} className="py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all">
                导出草稿
              </button>
              <button onClick={() => window.confirm('确认新建报价？当前草稿将会丢失。') && resetToDefaults()} className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all">
                新建报价
              </button>
              <button onClick={handleSaveToLibrary} className={`py-2 px-3 text-white rounded-lg text-sm font-semibold tracking-wide shadow-sm active:scale-95 transition-all ${libSaved ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'}`}>
                {libSaved ? '✓ 已保存！' : '保存到报价库'}
              </button>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto] gap-2 xl:min-w-[480px] xl:justify-end">
              <button onClick={handleGeneratePDF} className="p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-semibold">
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
                <option value="zh">🇨🇳 中文</option>
                <option value="es">🇪🇸 ES</option>
                <option value="pt">🇧🇷 PT</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="vi">🇻🇳 VI</option>
                <option value="km">🇰🇭 KM</option>
                <option value="ar">🇸🇦 AR</option>
                <option value="ru">🇷🇺 RU</option>
              </select>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".json"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Left Side - Inputs */}
          <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-md no-print">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-xl font-semibold">报价详情</h2>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
                <div className="w-full sm:w-64">
                  <label className="block text-sm font-medium text-gray-700">Country<span className="block text-xs text-gray-500">国家</span></label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm"
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                  >
                    <option value="">选择国家</option>
                    {countryGroups.map((group) => (
                      <optgroup key={group.group} label={group.group}>
                        {group.options.map((option) => (
                          <option key={`${group.group}-${option.value}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                {country === 'Peru' && (
                  <div className="w-full sm:w-48">
                    <label className="block text-sm font-medium text-gray-700">RUC<span className="block text-xs text-gray-500">秘鲁税号</span></label>
                    <input
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
                      value={ruc}
                      onChange={(e) => setField('ruc', e.target.value)}
                      placeholder="RUC"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name<span className="block text-xs text-gray-500">公司名称</span></label>
                <div className="mt-1 flex gap-2">
                  <input
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    value={companyName}
                    onChange={(e) => setField('companyName', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={saveCompanyOption}
                    className="shrink-0 rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600"
                  >
                    保存
                  </button>
                </div>
                {companyOptions.length > 0 && (
                  <select
                    className="mt-2 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm"
                    value=""
                    onChange={(e) => e.target.value && setField('companyName', e.target.value)}
                  >
                    <option value="">选择已保存公司</option>
                    {companyOptions.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation No<span className="block text-xs text-gray-500">报价单号</span></label>
                <div className="mt-1 flex gap-1">
                  <input
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    value={quotationNo}
                    onChange={(e) => setField('quotationNo', e.target.value)}
                  />
                  <button
                    type="button"
                    title="生成单号"
                    onClick={() => {
                      const d = new Date();
                      const yy = String(d.getFullYear()).slice(2);
                      const mm = String(d.getMonth() + 1).padStart(2, '0');
                      const dd = String(d.getDate()).padStart(2, '0');
                      const prefix = `XFJ${yy}${mm}${dd}`;
                      // Find the highest seq used today in history
                      const saved: any[] = (() => { try { return JSON.parse(localStorage.getItem('quoter_history') || '[]'); } catch { return []; } })();
                      const used = saved
                        .map((e: any) => e.quotationNo || '')
                        .filter((n: string) => n.startsWith(prefix))
                        .map((n: string) => parseInt(n.slice(prefix.length), 10) || 0);
                      const next = used.length ? Math.max(...used) + 1 : 1;
                      setField('quotationNo', `${prefix}${String(next).padStart(2, '0')}`);
                    }}
                    className="shrink-0 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-gray-600 whitespace-nowrap"
                  >
                    ↻ 生成
                  </button>
                </div>
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
                  onChange={(e) => handleQuotationTypeChange(e.target.value)}
                >
                  <option>EXW</option>
                  <option>FOB</option>
                  <option>CIF</option>
                  <option>DDP</option>
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
              {isExw ? (
                <>
                  <div className="sm:col-span-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800">
                    {t.exwPickup}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">EXW Delivery Option<span className="block text-xs text-gray-500">EXW 交货选项</span></label>
                    <select
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm"
                      value={exwDeliveryOptions.some((option) => option.value === freightDestination) ? freightDestination : ''}
                      onChange={(e) => e.target.value && handleExwDeliveryOptionChange(e.target.value)}
                    >
                      <option value="">自定义 / Custom</option>
                      {exwDeliveryOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
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
                </>
              ) : (
                <>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Freight Destination<span className="block text-xs text-gray-500">目的地</span></label>
                    <input
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                      value={freightDestination}
                      onChange={(e) => setField('freightDestination', e.target.value)}
                    />
                    {quotationType === 'CIF' && country && availableDestinationPorts.length > 0 && (
                      <select
                        className="mt-2 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm"
                        value={availableDestinationPorts.includes(freightDestination) ? freightDestination : ''}
                        onChange={(e) => e.target.value && setField('freightDestination', e.target.value)}
                      >
                        <option value="">选择{country}主要港口</option>
                        {availableDestinationPorts.map((port) => (
                          <option key={port} value={port}>{port}</option>
                        ))}
                      </select>
                    )}
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
                </>
              )}
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
                {targetCurrency !== 'USD' && targetCurrency !== '-' && (
                  <button
                    type="button"
                    onClick={roundTargetCurrencyTotal}
                    className="mt-2 inline-flex items-center justify-center rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
                  >
                    取整目标货币
                  </button>
                )}
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
                <label className="block text-sm font-medium text-gray-700">Warranty Text<span className="block text-xs text-gray-500">质保条款文字</span></label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                  value=""
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    if (!selectedValue) return;
                    setField(
                      'warrantyText',
                      selectedValue === 'default'
                        ? `${warrantyMonths || 12} months from the date the goods depart from the port of shipment.`
                        : selectedValue
                    );
                  }}
                >
                  <option value="">选择质保模板</option>
                  {warrantyTextOptions.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={warrantyText}
                  onChange={(e) => setField('warrantyText', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Payment Term<span className="block text-xs text-gray-500">付款方式</span></label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) setField('paymentTerm', e.target.value);
                  }}
                >
                  <option value="">选择付款方式模板</option>
                  {paymentTermOptions.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <textarea
                  rows={3}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm resize-y"
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
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Remarks<span className="block text-xs text-gray-500">备注（项目特殊要求）</span></label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm resize-y"
                  value={quoteRemarks}
                  onChange={(e) => setField('quoteRemarks', e.target.value)}
                  placeholder="Special project requirements or notes..."
                />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-gray-700">Compliance Standard<span className="block text-xs text-gray-500">符合标准</span></label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600"
                      checked={shouldShowCertificationStandard}
                      onChange={(e) => setField('showCertificationStandard', e.target.checked)}
                    />
                    Show in quotation / 显示
                  </label>
                </div>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 disabled:text-gray-500"
                  value={selectedCertificationStandard}
                  onChange={(e) => setField('certificationStandard', e.target.value)}
                  disabled={!shouldShowCertificationStandard}
                >
                  <option value="CE Certification">CE Certification</option>
                  <option value="EAC Certification">EAC Certification</option>
                </select>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600">Description<span className="ml-1 text-gray-400">描述</span></label>
                    <input
                      value={shaftFrame.text}
                      onChange={(e) => setField('shaftFrame', { ...shaftFrame, text: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Qty<span className="ml-1 text-gray-400">数量</span></label>
                    <input
                      type="number"
                      value={shaftFrame.qty ?? 1}
                      onChange={(e) => setField('shaftFrame', { ...shaftFrame, qty: Number(e.target.value) })}
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
                  <div className="sm:col-span-3 mt-2 rounded-md border border-blue-100 bg-blue-50/60 p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">Shaft Frame Calculator<span className="ml-1 text-xs font-normal text-gray-500">井道框架计算器</span></h4>
                        <p className="text-xs text-gray-500">Formula: glass area × ¥250/m² + frame height × rate, converted by USD = RMB basis.</p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setField('shaftFrame', {
                            ...shaftFrame,
                            enabled: true,
                            text: shaftFrameEstimate.description,
                            price: shaftFrameEstimate.frameCostUsd,
                          })}
                          className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Apply Frame to Row 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setField('temperedGlass', {
                            ...temperedGlass,
                            enabled: true,
                            text: `10mm Tempered Glass ${shaftFrameEstimate.glassArea.toFixed(1)} m²`,
                            price: shaftFrameEstimate.glassCostUsd,
                          })}
                          className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Apply Glass to Row 2
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                      <label className="text-xs font-medium text-gray-600">
                        Width (mm)<span className="ml-1 text-gray-400">宽</span>
                        <input
                          type="number"
                          value={shaftFrameCalc.widthMm}
                          onChange={(e) => setShaftFrameCalc({ ...shaftFrameCalc, widthMm: Number(e.target.value) })}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
                        />
                      </label>
                      <label className="text-xs font-medium text-gray-600">
                        Depth (mm)<span className="ml-1 text-gray-400">深</span>
                        <input
                          type="number"
                          value={shaftFrameCalc.depthMm}
                          onChange={(e) => setShaftFrameCalc({ ...shaftFrameCalc, depthMm: Number(e.target.value) })}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
                        />
                      </label>
                      <label className="text-xs font-medium text-gray-600">
                        Height (m)<span className="ml-1 text-gray-400">高</span>
                        <input
                          type="number"
                          step="0.1"
                          value={shaftFrameCalc.heightM}
                          onChange={(e) => setShaftFrameCalc({ ...shaftFrameCalc, heightM: Number(e.target.value) })}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
                        />
                      </label>
                      <label className="text-xs font-medium text-gray-600">
                        Frame<span className="ml-1 text-gray-400">框架</span>
                        <select
                          value={shaftFrameCalc.frameType}
                          onChange={(e) => setShaftFrameCalc({ ...shaftFrameCalc, frameType: e.target.value as 'aluminum' | 'steel' })}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
                        >
                          <option value="aluminum">Aluminum ¥1800/m</option>
                          <option value="steel">Steel ¥1300/m</option>
                        </select>
                      </label>
                      <div className="rounded-md bg-white p-2 text-xs text-gray-700 shadow-sm">
                        <div>Charge height: <b>{shaftFrameEstimate.chargeHeight.toFixed(1)} m</b></div>
                        <div>Glass: <b>{shaftFrameEstimate.glassArea.toFixed(2)} m²</b></div>
                        <div>Glass Cost: <b>¥{Math.round(shaftFrameEstimate.glassCostRmb).toLocaleString()}</b> <span className="text-gray-500">/ ${shaftFrameEstimate.glassCostUsd.toLocaleString()}</span></div>
                        <div>Frame Cost: <b>¥{Math.round(shaftFrameEstimate.frameCostRmb).toLocaleString()}</b> <span className="text-gray-500">/ ${shaftFrameEstimate.frameCostUsd.toLocaleString()}</span></div>
                        <div className="mt-1 border-t border-gray-200 pt-1">Total: <b>¥{Math.round(shaftFrameEstimate.totalRmb).toLocaleString()}</b></div>
                        <div>USD: <b>${shaftFrameEstimate.totalUsd.toLocaleString()}</b></div>
                      </div>
                    </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600">Description<span className="ml-1 text-gray-400">描述</span></label>
                    <input
                      value={temperedGlass.text}
                      onChange={(e) => setField('temperedGlass', { ...temperedGlass, text: e.target.value })}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Qty<span className="ml-1 text-gray-400">数量</span></label>
                    <input
                      type="number"
                      value={temperedGlass.qty ?? 1}
                      onChange={(e) => setField('temperedGlass', { ...temperedGlass, qty: Number(e.target.value) })}
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

            {/* Output Options */}
            <h3 className="text-lg font-semibold mt-6 mb-3 border-t pt-4">Print Options<span className="block text-sm font-normal text-gray-500">打印选项</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 border border-gray-200 rounded-md p-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={showPartList}
                  onChange={(e) => setField('showPartList', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                Part List<span className="text-xs font-normal text-gray-500">配件清单</span>
              </label>
              <label className="flex items-center gap-2 border border-gray-200 rounded-md p-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={showFunctionList}
                  onChange={(e) => setField('showFunctionList', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                Function List<span className="text-xs font-normal text-gray-500">功能清单</span>
              </label>
            </div>

            {elevators.map((elevator) => (
              <ElevatorForm key={elevator.id} elevator={elevator} onSectionFocus={(section: string) => setFocusedSection(`${section}-${elevator.id}`)} />
            ))}
            <button onClick={addElevator} className="mt-4 w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600">+ 添加电梯</button>

            {/* Part List Editor */}
            <h3 className="text-lg font-semibold mt-6 mb-3 border-t pt-4">Part List<span className="block text-sm font-normal text-gray-500">零部件清单</span></h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Part List Template<span className="block text-xs text-gray-500">配置表模板</span></label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm"
                value={partListTemplate || 'standard'}
                onChange={(e) => setPartListTemplate(e.target.value as 'standard' | 'platform')}
              >
                <option value="standard">Standard Elevator 标准电梯</option>
                <option value="platform">Platform Lift 平台梯</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  {isPlatformPartList ? (
                    <tr className="bg-gray-100">
                      <th className="text-left p-2 border border-gray-300 w-16">No.</th>
                      <th className="text-left p-2 border border-gray-300">Category / 类别</th>
                      <th className="text-left p-2 border border-gray-300">Component / 名称</th>
                      <th className="text-left p-2 border border-gray-300">Brand / 品牌</th>
                    </tr>
                  ) : (
                    <tr className="bg-gray-100">
                      <th className="text-left p-2 border border-gray-300 w-1/2">Part / 零部件</th>
                      <th className="text-left p-2 border border-gray-300">Brand / 品牌</th>
                      <th className="text-left p-2 border border-gray-300">Origin / 产地</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {partList.map(row =>
                    row.type === 'section' ? (
                      <tr key={row.id} className="bg-gray-50">
                        <td colSpan={isPlatformPartList ? 4 : 3} className="p-2 border border-gray-300 font-semibold text-gray-700">{row.label}</td>
                      </tr>
                    ) : isPlatformPartList ? (
                      <tr key={row.id}>
                        <td className="p-1 border border-gray-300">
                          <input
                            value={row.no || ''}
                            onChange={(e) => updatePartListItem(row.id, 'no', e.target.value)}
                            className="w-full p-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            value={row.category || ''}
                            onChange={(e) => updatePartListItem(row.id, 'category', e.target.value)}
                            className="w-full p-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            value={row.label}
                            onChange={(e) => updatePartListItem(row.id, 'label', e.target.value)}
                            className="w-full p-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
                          />
                        </td>
                        <td className="p-1 border border-gray-300">
                          <input
                            value={row.brand}
                            onChange={(e) => updatePartListItem(row.id, 'brand', e.target.value)}
                            className="w-full p-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
                          />
                        </td>
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
            <div className="w-full p-4 bg-white rounded-lg shadow-md">
              <Header />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">{t.quotation}</h2>
                <div className="space-y-2">
                  <p><span className="font-semibold">{t.company}:</span> {companyName}</p>
                  {shouldShowRuc && <p><span className="font-semibold">RUC:</span> {ruc}</p>}
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
                          <td className="p-2 border border-gray-400 align-top whitespace-pre-wrap">{elevator.description}</td>
                          <td className="p-2 border border-gray-400 align-top">
                            <div>{elevator.type}</div>
                            <div>{elevator.capacity}KG</div>
                            <div>{elevator.speed} M/S</div>
                            <div>{elevator.floorsStops}</div>
                            {elevator.machineRoom && <div>{elevator.machineRoom}</div>}
                          </td>
                          <td className="p-2 border border-gray-400 align-top text-center">{elevator.qty}</td>
                          <td className="p-2 border border-gray-400 align-top text-right">{Number(elevator.unitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                          <td className="p-2 border border-gray-400 align-top text-right">{(Number(elevator.unitPrice) * Number(elevator.qty)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        </tr>
                      ))}
                      {shaftFrame.enabled && (
                        <tr>
                          <td colSpan={2} className="p-2 border border-gray-400">{shaftFrame.text}</td>
                          <td className="p-2 border border-gray-400 text-center">{shaftFrame.qty ?? 1}</td>
                          <td className="p-2 border border-gray-400 text-right">
                            {shaftFrame.price > 0 ? shaftFrame.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'}
                          </td>
                          <td className="p-2 border border-gray-400 text-right">
                            {shaftFrame.price > 0 ? ((Number(shaftFrame.price) || 0) * (Number(shaftFrame.qty) || 0)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'}
                          </td>
                        </tr>
                      )}
                      {temperedGlass.enabled && (
                        <tr>
                          <td colSpan={2} className="p-2 border border-gray-400">{temperedGlass.text}</td>
                          <td className="p-2 border border-gray-400 text-center">{temperedGlass.qty ?? 1}</td>
                          <td className="p-2 border border-gray-400 text-right">
                            {temperedGlass.price > 0 ? temperedGlass.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'}
                          </td>
                          <td className="p-2 border border-gray-400 text-right">
                            {temperedGlass.price > 0 ? ((Number(temperedGlass.price) || 0) * (Number(temperedGlass.qty) || 0)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'}
                          </td>
                        </tr>
                      )}
                      {!shouldChargeFreight ? (
                        <tr>
                          <td colSpan={5} className="p-2 text-right font-semibold">{t.exwPickup}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-2 text-right font-semibold">{formatFreightText(freightDestination, t.freight)}</td>
                          <td className="p-2 text-right">{freightCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        </tr>
                      )}
                      <tr className="font-bold bg-gray-100">
                        <td colSpan={4} className="p-2 text-right">{t.totalAmount}</td>
                        <td className="p-2 text-right">{grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                      {targetCurrency !== 'USD' && targetCurrency !== '-' && (
                        <tr className="font-bold">
                          <td colSpan={4} className="p-2 text-right">=</td>
                          <td className="p-2 text-right">{formatTargetCurrency(convertedTotal)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-4 border-t text-sm space-y-1">
                  <p><span className="font-semibold">{t.delivery}</span> {deliveryDays} {t.deliverySuffix}</p>
                  <p className="whitespace-pre-wrap"><span className="font-semibold">{t.paymentTerm}</span> {paymentTerm}</p>
                  <p><span className="font-semibold">{t.warranty}</span> {warrantyText || `${warrantyMonths} ${t.warrantySuffix}`}</p>
                  <p><span className="font-semibold">{t.priceValidity}</span> {priceValidityDays} {t.days} {validityUntilDate && `(${t.until} ${validityUntilDate})`}, based on 1 USD = {exchangeRateBasis} RMB.</p>
                  {quoteRemarks?.trim() && (
                    <p className="whitespace-pre-wrap"><span className="font-semibold">{t.remarks}</span> {quoteRemarks}</p>
                  )}
                  {shouldShowCertificationStandard && (
                    <p><span className="font-semibold">{t.complianceStandard}</span> {selectedCertificationStandard}</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t break-before-page">
                  <h3 className="text-lg font-semibold mb-2">{t.specificationsTitle}</h3>
                  {elevators.map((elevator, index) => (
                    <div key={elevator.id}>
                      {/* Specifications Section */}
                      <div className={index > 0 ? 'break-before-page' : ''}>
                        <h4 className="text-md font-semibold mt-4 text-gray-700 print-elevator-header">{elevator.title || t.elevatorHeader(elevator.id)}</h4>
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
                            {renderSpec(t.specDoorJambBase, elevator.baseFloorJamb ?? 'Standard Narrow Jamb')}
                            {renderSpec(t.specDoorJambOther, elevator.otherFloorsJamb ?? 'Standard Narrow Jamb')}
                          </div>
                          <div className="break-inside-avoid">
                            <h4 id={`preview-function-spec-${elevator.id}`} className={`text-md font-semibold mt-4 border-b px-2 py-1 ${focusedSection === `function-spec-${elevator.id}` ? 'bg-yellow-200' : 'bg-gray-100'}`}>{t.secFunction}</h4>
                            {renderSpec(t.specCopLop, elevator.copLop)}
                            {elevator.otherFunctions.map((func: any) =>
                              func.checked && renderSpec(translateValue(func.name), t.specIncluded)
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

                {(showPartList || showFunctionList) && (
                  <div className="break-before-page">
                    {showPartList && (
                      <div className="mt-6 pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-3">{t.partListTitle}</h3>
                        <table className="w-full text-sm border-collapse printable-table">
                          <thead className="bg-gray-200">
                            {isPlatformPartList ? (
                              <tr>
                                <th className="p-2 border border-gray-400 text-left">No.</th>
                                <th className="p-2 border border-gray-400 text-left">Category 类别</th>
                                <th className="p-2 border border-gray-400 text-left">Component 名称</th>
                                <th className="p-2 border border-gray-400 text-left">Brand 品牌</th>
                              </tr>
                            ) : (
                              <tr>
                                <th className="p-2 border border-gray-400 text-left">{t.partListColPart}</th>
                                <th className="p-2 border border-gray-400 text-left">{t.partListColBrand}</th>
                                <th className="p-2 border border-gray-400 text-left">{t.partListColOrigin}</th>
                              </tr>
                            )}
                          </thead>
                          <tbody>
                            {partList.map(row =>
                              row.type === 'section' ? (
                                <tr key={row.id} className="bg-gray-100">
                                  <td colSpan={isPlatformPartList ? 4 : 3} className="p-2 border border-gray-400 font-semibold">{row.label}</td>
                                </tr>
                              ) : isPlatformPartList ? (
                                <tr key={row.id}>
                                  <td className="p-2 border border-gray-400">{row.no}</td>
                                  <td className="p-2 border border-gray-400">{row.category}</td>
                                  <td className="p-2 border border-gray-400">{row.label}</td>
                                  <td className="p-2 border border-gray-400">{row.brand}</td>
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
                    )}

                    {showFunctionList && (
                      <div className="mt-6 pt-4 border-t break-before-page">
                        <h3 className="text-lg font-semibold mb-3">{t.standardFeaturesTitle}</h3>
                        <table className="w-full text-sm border-collapse printable-table">
                          <tbody>
                            {standardFeatures.flatMap((group) =>
                              group.rows.map((featureRow, rowIndex) => (
                                <tr key={`${group.category}-${rowIndex}`}>
                                  {rowIndex === 0 && (
                                    <td
                                      rowSpan={group.rows.length}
                                      className="w-[23%] p-2 border border-gray-400 align-middle"
                                    >
                                      {translateStandardFeature(group.category, language)}
                                    </td>
                                  )}
                                  <td className="w-[38.5%] p-2 border border-gray-400">{translateStandardFeature(featureRow[0], language)}</td>
                                  <td className="w-[38.5%] p-2 border border-gray-400">{translateStandardFeature(featureRow[1], language)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
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
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {quoteHistory.map(entry => {
                  const date = new Date(entry.savedAt).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  const total = entry.grandTotal
                    ? '$' + Math.round(entry.grandTotal).toLocaleString()
                    : '—';
                  // Elevator types: from saved field or fall back to state
                  const types: string[] = entry.elevatorTypes?.length
                    ? entry.elevatorTypes
                    : (entry.state?.elevators ?? []).map((e: any) => e.type).filter(Boolean);
                  const typeLabel = types.length
                    ? types.join(' / ')
                    : '—';
                  return (
                    <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group">
                      {/* Sequence — oldest saved quote starts from 001 */}
                      <span className="shrink-0 text-xs font-bold text-gray-500 w-10 text-center tabular-nums">
                        {historySequenceById.get(String(entry.id)) || '---'}
                      </span>
                      {/* Badge */}
                      <span className="shrink-0 text-xs font-bold text-blue-600 w-10 text-center leading-tight">
                        {entry.quotationType}
                      </span>
                      {/* Date */}
                      <span className="shrink-0 text-xs text-gray-400 w-20">{entry.quotationDate}</span>
                      {/* No + Project */}
                      <div className="w-32 shrink-0">
                        <div className="text-sm font-bold text-gray-800 truncate">{entry.quotationNo}</div>
                        <div className="text-xs text-gray-400 truncate">{entry.projectName}</div>
                      </div>
                      {/* Elevator type — placed right after No so there's no big gap */}
                      <div className="w-48 shrink-0 text-xs text-gray-600 truncate font-mono" title={typeLabel}>
                        {typeLabel}
                        {entry.elevatorCount > 1 && <span className="ml-1 text-gray-400">×{entry.elevatorCount}</span>}
                      </div>
                      {/* Company — flex-1 fills the remaining space */}
                      <div className="flex-1 min-w-0 text-xs text-gray-400 truncate">{entry.companyName}</div>
                      {/* Total */}
                      <span className="shrink-0 text-sm font-semibold text-gray-700 w-20 text-right">{total}</span>
                      {/* Saved time */}
                      <span className="shrink-0 text-xs text-gray-400 w-20 text-right">{date}</span>
                      {/* Actions */}
                      <div className="shrink-0 flex gap-1.5">
                        <button
                          onClick={() => loadFromHistory(entry)}
                          className="text-xs bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 transition-colors"
                        >载入</button>
                        <button
                          onClick={() => deleteFromHistory(entry.id)}
                          className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded border border-red-200 hover:border-red-400 transition-colors"
                        >删除</button>
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
