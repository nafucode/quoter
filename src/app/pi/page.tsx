"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useQuoteStore } from "@/store/useQuoteStore";

type PiItem = {
  id: number;
  name: string;
  capacity: string;
  speed: string;
  floorsStops: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

type PiForm = {
  sellerTel: string;
  buyerName: string;
  buyerTel: string;
  buyerEmail: string;
  showBuyerEmail: boolean;
  buyerAddress: string;
  buyerTaxNo: string;
  showBuyerTaxNo: boolean;
  contractNo: string;
  issueDate: string;
  currency: string;
  showTargetCurrency: boolean;
  targetCurrency: string;
  targetExchangeRate: number;
  goodsDescription: string;
  deliveryTerms: string;
  leadTime: string;
  paymentTerms: string;
  portOfShipment: string;
  destination: string;
  countryOfOrigin: string;
  bankName: string;
  accountNo: string;
  swiftCode: string;
  bankAddress: string;
  intermediaryBank: string;
  intermediarySwift: string;
  beneficiary: string;
  beneficiaryAddress: string;
  additionalRequirements: string;
  items: PiItem[];
};

type BankPreset = {
  id: string;
  label: string;
  bankName: string;
  accountNo: string;
  swiftCode: string;
  bankAddress: string;
  intermediaryBank: string;
  intermediarySwift: string;
  beneficiary: string;
  beneficiaryAddress: string;
  additionalRequirements?: string;
};

type QuoteElevator = {
  id: number;
  description?: string;
  capacity?: string | number;
  speed?: string | number;
  floorsStops?: string;
  qty?: string | number;
  unitPrice?: string | number;
};

type QuoteSnapshot = {
  companyName?: string;
  quotationNo?: string;
  quotationDate?: string;
  quotationType?: string;
  elevators?: QuoteElevator[];
  freightDestination?: string;
  targetCurrency?: string;
  deliveryDays?: string | number;
  paymentTerm?: string;
};

type QuoteHistoryEntry = {
  id: number;
  quotationNo?: string;
  projectName?: string;
  companyName?: string;
  quotationType?: string;
  quotationDate?: string;
  grandTotal?: number;
  targetCurrency?: string;
  elevatorCount?: number;
  savedAt?: string;
  state?: QuoteSnapshot;
};

type PiHistoryEntry = {
  id: number;
  contractNo: string;
  buyerName: string;
  issueDate: string;
  total: number;
  currency: string;
  savedAt: string;
  form: PiForm;
};

const PI_HISTORY_KEY = "pi_history";
const PI_TO_PACKING_KEY = "pi_to_packing_draft";

const initialForm: PiForm = {
  sellerTel: "+86 18018599919",
  buyerName: "FRANK EGBORO",
  buyerTel: "+234 803 345 4299",
  buyerEmail: "",
  showBuyerEmail: false,
  buyerAddress: "Asaba, Delta state, Nigeria",
  buyerTaxNo: "",
  showBuyerTaxNo: false,
  contractNo: "XFJH26030201P",
  issueDate: "2026.3.2",
  currency: "USD",
  showTargetCurrency: false,
  targetCurrency: "NGN",
  targetExchangeRate: 1460,
  goodsDescription: "1 Unit of Elevator (HS CODE: 8428101090)",
  deliveryTerms: "EXW SUZHOU",
  leadTime: "30 days after deposit.",
  paymentTerms:
    "30% down payment by T/T before production, the balanced 70% to be paid by T/T 10 days before delivery",
  portOfShipment: "Ninbo port, China.",
  destination: "Lagos, Nigeria",
  countryOfOrigin: "China",
  bankName: "Wema bank",
  accountNo: "7949338275",
  swiftCode: "",
  bankAddress: "54 Marina, Lagos Island, Lagos, Lagos, 101241, Nigeria",
  intermediaryBank: "",
  intermediarySwift: "",
  beneficiary: "Suzhou Xinfuji Electromechanical Co., Ltd.",
  beneficiaryAddress:
    "Dade Industrial Zone, Taoyuan Town, Wujiang District, Suzhou, Jiangsu, China.",
  additionalRequirements: "",
  items: [
    {
      id: 1,
      name: "Elevator",
      capacity: "450KG",
      speed: "1.0m/s",
      floorsStops: "3/3",
      quantity: 1,
      unit: "UNIT",
      unitPrice: 10850,
    },
  ],
};

const bankPresets: BankPreset[] = [
  {
    id: "wema",
    label: "Wema bank",
    bankName: "Wema bank",
    accountNo: "7949338275",
    swiftCode: "",
    bankAddress: "54 Marina, Lagos Island, Lagos, Lagos, 101241, Nigeria",
    intermediaryBank: "",
    intermediarySwift: "",
    beneficiary: "Suzhou Xinfuji Electromechanical Co., Ltd.",
    beneficiaryAddress:
      "Dade Industrial Zone, Taoyuan Town, Wujiang District, Suzhou, Jiangsu, China.",
  },
  {
    id: "chouzhou",
    label: "Zhejiang Chouzhou Commercial Bank",
    bankName: "ZHEJIANG CHOUZHOU COMMERCIAL BANK CO.,LTD",
    accountNo: "13601002010090003861",
    swiftCode: "CZCBCN2X",
    bankAddress:
      "No.586 Fenghuang Road, Wuxing District, Huzhou City, Zhejiang Province, China",
    intermediaryBank: "JPMORGAN Chase Bank, New York",
    intermediarySwift: "CHASUS33",
    beneficiary: "Suzhou Xinfuji Electromechanical Co., Ltd.",
    beneficiaryAddress:
      "No.586 Fenghuang Road, Wuxing District, Huzhou City, Zhejiang Province, China",
  },
  {
    id: "icbc",
    label: "ICBC Zhejiang Provincial Branch",
    bankName:
      "INDUSTRIAL & COMMERCIAL BANK OF CHINA (ICBC) Zhejiang Provincial Branch",
    accountNo: "1205240019200409295",
    swiftCode: "ICBKCNBJZJP",
    bankAddress: "No. 150 Zhonghe Middle Road, Hangzhou City, Zhejiang Province, China",
    intermediaryBank: "",
    intermediarySwift: "",
    beneficiary: "SUZHOU XINFUJI ELECTROMECHANICAL CO., LTD",
    beneficiaryAddress: "DADE INDUSTRIAL ZONE, TAOYUAN TOWN, WUJIANG DISTRICT",
  },
  {
    id: "jiangsu-rural",
    label: "Jiangsu Suzhou Rural Commercial Bank",
    bankName: "JIANGSU SUZHOU RURAL COMMERCIAL BANK CO., LTD",
    accountNo: "0706678981420100395359",
    swiftCode: "WJRBCNBWXXX",
    bankAddress: "NO.1777 SOUTH ZHONGSHAN ROAD, SUZHOU, CHINA",
    intermediaryBank: "CITIBANK N.A. NEW YORK",
    intermediarySwift: "CITIUS33XXX",
    beneficiary: "Suzhou Xinfuji Electromechanical Co., Ltd.",
    beneficiaryAddress:
      "Dade Industrial Zone, Taoyuan Town, Wujiang District, Suzhou, Jiangsu 215236, China",
  },
  {
    id: "first-bank-ghana-gip",
    label: "GHS GIP - First Bank Ghana",
    bankName: "FIRST BANK OF NIGERIA, GHANA",
    accountNo: "9990000019924",
    swiftCode: "INCEGHACXXX",
    bankAddress:
      "FIRST BANK GHANA LTD, NO. 16, 678 NEAR GOLDEN TULIP, HOTEL, LIBERA PMB ACCRA NORTH, ACCRA, Ghana",
    intermediaryBank: "",
    intermediarySwift: "",
    beneficiary: "Suzhou Xinfuji Electromechanical Co., Ltd.",
    beneficiaryAddress: "Country/Region: Ghana\nType of Account: Business Account\nBankCode: 300319\nBranchName: RING ROAD CENTRAL",
    additionalRequirements:
      "Hello esteemed customer,\nFor the payment of goods, please make a GIP Payment of:\nAmount: _______\nTo the following account:\nAccount Number: 9990000019924\nAccount Name: Suzhou Xinfuji Electromechanical Co., Ltd.\nBank Name: FIRST BANK OF NIGERIA, GHANA\nBank Address: FIRST BANK GHANA LTD, NO. 16, 678 NEAR GOLDEN TULIP, HOTEL, LIBERA PMB ACCRA NORTH, ACCRA, Ghana\nCountry/Region: Ghana\nType of Account: Business Account\nPayment message: Please include the following memo/message to receiver when making a payment: [Buyer Name] [Invoice/Contract Number] [Product]\nSWIFT/BIC Code: INCEGHACXXX\nBankCode: 300319\nBranchName: RING ROAD CENTRAL\nTips:\n- This collection account only supports the collection of GHS; [SWIFT/international TT is not supported by this account]\n- The following memo/message should be included to the receiver when making a payment:\n- [Buyer Name][Invoice/Contract Number][Product]",
  },
];

const smallNumbers = [
  "ZERO",
  "ONE",
  "TWO",
  "THREE",
  "FOUR",
  "FIVE",
  "SIX",
  "SEVEN",
  "EIGHT",
  "NINE",
  "TEN",
  "ELEVEN",
  "TWELVE",
  "THIRTEEN",
  "FOURTEEN",
  "FIFTEEN",
  "SIXTEEN",
  "SEVENTEEN",
  "EIGHTEEN",
  "NINETEEN",
];

const tens = [
  "",
  "",
  "TWENTY",
  "THIRTY",
  "FORTY",
  "FIFTY",
  "SIXTY",
  "SEVENTY",
  "EIGHTY",
  "NINETY",
];

function integerToWords(value: number): string {
  const n = Math.floor(Math.abs(value));
  if (n < 20) return smallNumbers[n];
  if (n < 100) {
    const rest = n % 10;
    return `${tens[Math.floor(n / 10)]}${rest ? ` ${smallNumbers[rest]}` : ""}`;
  }
  if (n < 1000) {
    const rest = n % 100;
    return `${smallNumbers[Math.floor(n / 100)]} HUNDRED${rest ? ` ${integerToWords(rest)}` : ""}`;
  }
  if (n < 1000000) {
    const rest = n % 1000;
    return `${integerToWords(Math.floor(n / 1000))} THOUSAND${rest ? ` ${integerToWords(rest)}` : ""}`;
  }
  const rest = n % 1000000;
  return `${integerToWords(Math.floor(n / 1000000))} MILLION${rest ? ` ${integerToWords(rest)}` : ""}`;
}

function moneyWords(amount: number, currency: string) {
  const currencyName =
    currency === "USD"
      ? "US DOLLARS"
      : currency === "NGN"
        ? "NIGERIAN NAIRA"
        : currency === "GHS"
          ? "GHANAIAN CEDI"
          : currency === "RMB" || currency === "CNY"
            ? "CHINESE YUAN"
            : currency;
  return `${currencyName} ${integerToWords(amount)} ONLY`;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function withUnit(value: string | number | undefined, unit: string) {
  if (value === undefined || value === null || value === "") return "";
  const text = String(value);
  return text.toLowerCase().includes(unit.toLowerCase()) ? text : `${text}${unit}`;
}

function dateForPi(value: string) {
  return value ? value.replaceAll("-", ".") : "";
}

function piNoFromContract(contractNo: string) {
  const value = contractNo.trim();
  if (!value) return "";
  return value.toUpperCase().endsWith("P") ? value : `${value}P`;
}

function piFromQuote(source: QuoteSnapshot, current: PiForm): PiForm {
  const quoteItems = (source.elevators || []).map((elevator, index) => ({
    id: Number(elevator.id) || index + 1,
    name: elevator.description || "Elevator",
    capacity: withUnit(elevator.capacity, "KG"),
    speed: withUnit(elevator.speed, "m/s"),
    floorsStops: elevator.floorsStops || "",
    quantity: Number(elevator.qty || 0),
    unit: "UNIT",
    unitPrice: Number(elevator.unitPrice || 0),
  }));

  return {
    ...current,
    buyerName: source.companyName || current.buyerName,
    contractNo: source.quotationNo || current.contractNo,
    issueDate: dateForPi(source.quotationDate || "") || current.issueDate,
    currency:
      source.targetCurrency && source.targetCurrency !== "-"
        ? source.targetCurrency
        : current.currency,
    showTargetCurrency: current.showTargetCurrency,
    targetCurrency: current.targetCurrency,
    targetExchangeRate: current.targetExchangeRate,
    destination: source.freightDestination || current.destination,
    deliveryTerms:
      source.quotationType === "EXW"
        ? "EXW SUZHOU"
        : source.quotationType || current.deliveryTerms,
    leadTime: source.deliveryDays
      ? `${source.deliveryDays} days after deposit.`
      : current.leadTime,
    paymentTerms: source.paymentTerm || current.paymentTerms,
    goodsDescription:
      quoteItems.length === 1
        ? `${quoteItems[0].quantity || 1} Unit of Elevator (HS CODE: 8428101090)`
        : quoteItems.length > 1
          ? `${quoteItems.length} Units of Elevator (HS CODE: 8428101090)`
          : current.goodsDescription,
    items: quoteItems.length ? quoteItems : current.items,
  };
}

function normalizePiForm(value: PiForm): PiForm {
  return { ...initialForm, ...value };
}

export default function ProformaInvoicePage() {
  const router = useRouter();
  const [form, setForm] = useState<PiForm>(initialForm);
  const [quoteHistory, setQuoteHistory] = useState<QuoteHistoryEntry[]>([]);
  const [piHistory, setPiHistory] = useState<PiHistoryEntry[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);
  const [activePiHistoryId, setActivePiHistoryId] = useState<number | null>(null);
  const [piSaved, setPiSaved] = useState(false);
  const quote = useQuoteStore();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("quoter_history") || "[]");
      setQuoteHistory(Array.isArray(saved) ? saved : []);
    } catch {
      setQuoteHistory([]);
    }

    try {
      const savedPi = JSON.parse(localStorage.getItem(PI_HISTORY_KEY) || "[]");
      setPiHistory(Array.isArray(savedPi) ? savedPi : []);
    } catch {
      setPiHistory([]);
    }
  }, []);

  const total = useMemo(
    () =>
      form.items.reduce(
        (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
        0,
      ),
    [form.items],
  );

  const targetTotal = useMemo(
    () => total * Number(form.targetExchangeRate || 0),
    [form.targetExchangeRate, total],
  );

  const piNo = useMemo(() => piNoFromContract(form.contractNo), [form.contractNo]);

  const updateField = (field: keyof PiForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateItem = (id: number, field: keyof PiItem, value: string | number) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setForm((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: Date.now(),
          name: "Elevator",
          capacity: "",
          speed: "",
          floorsStops: "",
          quantity: 1,
          unit: "UNIT",
          unitPrice: 0,
        },
      ],
    }));
  };

  const removeItem = (id: number) => {
    setForm((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  };

  const migrateFromQuote = () => {
    setActiveHistoryId(null);
    setActivePiHistoryId(null);
    setForm((current) => piFromQuote(quote, current));
  };

  const makePiFromHistory = (entry: QuoteHistoryEntry) => {
    if (!entry.state) return;
    setActiveHistoryId(entry.id);
    setActivePiHistoryId(null);
    setForm((current) => piFromQuote(entry.state || {}, current));
  };

  const savePiToHistory = () => {
    const entry: PiHistoryEntry = {
      id: Date.now(),
      contractNo: form.contractNo || "Untitled PI",
      buyerName: form.buyerName || "-",
      issueDate: form.issueDate || "-",
      total,
      currency: form.currency,
      savedAt: new Date().toISOString(),
      form: JSON.parse(JSON.stringify(form)),
    };

    setPiHistory((current) => {
      const updated = [entry, ...current].slice(0, 50);
      localStorage.setItem(PI_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
    setActivePiHistoryId(entry.id);
    setActiveHistoryId(null);
    setPiSaved(true);
    setTimeout(() => setPiSaved(false), 1800);
  };

  const loadPiFromHistory = (entry: PiHistoryEntry) => {
    setForm(normalizePiForm(entry.form));
    setActivePiHistoryId(entry.id);
    setActiveHistoryId(null);
  };

  const deletePiFromHistory = (id: number) => {
    setPiHistory((current) => {
      const updated = current.filter((entry) => entry.id !== id);
      localStorage.setItem(PI_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
    if (activePiHistoryId === id) {
      setActivePiHistoryId(null);
    }
  };

  const makePackingListFromPi = () => {
    localStorage.setItem(PI_TO_PACKING_KEY, JSON.stringify(form));
    router.push("/packing-list");
  };

  const applyBankPreset = (presetId: string) => {
    const preset = bankPresets.find((bank) => bank.id === presetId);
    if (!preset) return;
    setForm((current) => ({
      ...current,
      bankName: preset.bankName,
      accountNo: preset.accountNo,
      swiftCode: preset.swiftCode,
      bankAddress: preset.bankAddress,
      intermediaryBank: preset.intermediaryBank,
      intermediarySwift: preset.intermediarySwift,
      beneficiary: preset.beneficiary,
      beneficiaryAddress: preset.beneficiaryAddress,
      additionalRequirements:
        preset.additionalRequirements ?? current.additionalRequirements,
    }));
  };

  const textFields: Array<[keyof PiForm, string, "input" | "textarea"]> = [
    ["sellerTel", "Seller Tel", "input"],
    ["buyerName", "Messrs.", "input"],
    ["buyerTel", "Tel", "input"],
    ["buyerEmail", "Email", "input"],
    ["buyerAddress", "Address", "textarea"],
    ["buyerTaxNo", "Tax No.", "input"],
    ["contractNo", "Contract No.", "input"],
    ["issueDate", "Issue Date", "input"],
    ["goodsDescription", "Description Of Goods", "textarea"],
    ["deliveryTerms", "Delivery Terms", "input"],
    ["leadTime", "Lead Time", "input"],
    ["paymentTerms", "Payment Terms", "textarea"],
    ["portOfShipment", "Port of Shipment", "input"],
    ["destination", "Destination", "input"],
    ["countryOfOrigin", "Country of Origin", "input"],
    ["bankName", "Beneficiary Bank", "input"],
    ["accountNo", "A/C No.", "input"],
    ["swiftCode", "Swift Code", "input"],
    ["bankAddress", "Bank Address", "textarea"],
    ["intermediaryBank", "Intermediary Bank", "input"],
    ["intermediarySwift", "Intermediary Swift BIC", "input"],
    ["beneficiary", "Beneficiary", "input"],
    ["beneficiaryAddress", "Add of Beneficiary", "textarea"],
    ["additionalRequirements", "Additional Requirements", "textarea"],
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="no-print border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-[90vw] items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">PI 制作</h1>
            <p className="text-sm text-slate-500">左侧填写，右侧实时生成 Proforma Invoice。</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={makePackingListFromPi}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              制作箱单
            </button>
            <Link
              href="/"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              返回报价
            </Link>
            <button
              onClick={() => window.print()}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              打印 / PDF
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-[90vw] grid-cols-1 gap-4 py-5 lg:grid-cols-2">
        <section className="no-print max-h-[calc(100vh-120px)] overflow-auto rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">填写内容</h2>
            <div className="flex gap-2">
              <button
                onClick={savePiToHistory}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold text-white ${
                  piSaved ? "bg-green-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {piSaved ? "已保存" : "保存 PI"}
              </button>
              <button
                onClick={migrateFromQuote}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                从报价迁移
              </button>
              <button
                onClick={() => {
                  setForm(initialForm);
                  setActiveHistoryId(null);
                  setActivePiHistoryId(null);
                }}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                恢复表一示例
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Currency</span>
              <input
                value={form.currency}
                onChange={(event) => updateField("currency", event.target.value.toUpperCase())}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.showTargetCurrency}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      showTargetCurrency: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                增加目标货币总价
              </label>
              {form.showTargetCurrency && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">Target Currency</span>
                    <select
                      value={form.targetCurrency}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          targetCurrency: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="NGN">NGN</option>
                      <option value="GHS">GHS</option>
                      <option value="RMB">RMB</option>
                      <option value="CNY">CNY</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">Exchange Rate</span>
                    <input
                      type="number"
                      step="any"
                      inputMode="decimal"
                      value={form.targetExchangeRate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          targetExchangeRate: Number(event.target.value),
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              )}
            </div>

            {textFields.map(([field, label, type]) => (
              <Fragment key={field}>
                {field === "bankName" && (
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Bank Preset</span>
                      <select
                        onChange={(event) => applyBankPreset(event.target.value)}
                        defaultValue=""
                        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                      >
                        <option value="" disabled>
                          选择银行账户
                        </option>
                        {bankPresets.map((bank) => (
                          <option key={bank.id} value={bank.id}>
                            {bank.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}
                <label className="block">
                  <span className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
                    <span>{label}</span>
                    {field === "buyerEmail" && (
                      <span className="flex items-center gap-1 text-xs font-normal text-slate-500">
                        <input
                          type="checkbox"
                          checked={form.showBuyerEmail}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              showBuyerEmail: event.target.checked,
                            }))
                          }
                          className="h-3.5 w-3.5 rounded border-slate-300"
                        />
                        显示
                      </span>
                    )}
                    {field === "buyerTaxNo" && (
                      <span className="flex items-center gap-1 text-xs font-normal text-slate-500">
                        <input
                          type="checkbox"
                          checked={form.showBuyerTaxNo}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              showBuyerTaxNo: event.target.checked,
                            }))
                          }
                          className="h-3.5 w-3.5 rounded border-slate-300"
                        />
                        显示
                      </span>
                    )}
                  </span>
                  {type === "textarea" ? (
                    <textarea
                      value={String(form[field])}
                      onChange={(event) => updateField(field, event.target.value)}
                      rows={field === "paymentTerms" ? 3 : 2}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  ) : (
                    <input
                      value={String(form[field])}
                      onChange={(event) => updateField(field, event.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  )}
                </label>
              </Fragment>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Commodity Description</h3>
              <button
                onClick={addItem}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                添加一行
              </button>
            </div>

            <div className="space-y-4">
              {form.items.map((item, index) => (
                <div key={item.id} className="rounded-md border border-slate-200 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">Item {index + 1}</span>
                    {form.items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        删除
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      ["name", "NAME"],
                      ["capacity", "Capacity"],
                      ["speed", "Speed"],
                      ["floorsStops", "F/S"],
                      ["unit", "Unit"],
                    ] as Array<[keyof PiItem, string]>).map(([field, label]) => (
                      <label key={field} className={field === "name" ? "col-span-2" : ""}>
                        <span className="text-xs font-medium text-slate-600">{label}</span>
                        <input
                          value={String(item[field])}
                          onChange={(event) => updateItem(item.id, field, event.target.value)}
                          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                        />
                      </label>
                    ))}
                    <label>
                      <span className="text-xs font-medium text-slate-600">Quantity</span>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(item.id, "quantity", Number(event.target.value))
                        }
                        className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                      />
                    </label>
                    <label>
                      <span className="text-xs font-medium text-slate-600">Unit Price</span>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(event) =>
                          updateItem(item.id, "unitPrice", Number(event.target.value))
                        }
                        className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden">
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">
                PI 历史
                <span className="ml-2 text-sm font-normal text-slate-400">
                  {piHistory.length} 份
                </span>
              </h3>
              {piHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (!window.confirm("清空全部 PI 历史？")) return;
                    setPiHistory([]);
                    setActivePiHistoryId(null);
                    localStorage.removeItem(PI_HISTORY_KEY);
                  }}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  清空
                </button>
              )}
            </div>

            {piHistory.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
                还没有保存的 PI。填好后点击「保存 PI」，之后可在这里载入。
              </div>
            ) : (
              <div className="space-y-2">
                {piHistory.map((entry) => {
                  const isActive = activePiHistoryId === entry.id;
                  const savedAt = new Date(entry.savedAt).toLocaleDateString("zh-CN", {
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={entry.id}
                      className={`rounded-md border p-3 transition-colors ${
                        isActive
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 bg-white hover:border-green-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900">
                            {entry.contractNo}
                          </div>
                          <div className="mt-1 truncate text-xs text-slate-500">
                            {entry.buyerName} · {entry.issueDate}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            {entry.currency} {formatMoney(entry.total)} · {savedAt}
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => loadPiFromHistory(entry)}
                            className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                              isActive
                                ? "bg-green-700 text-white"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {isActive ? "已载入" : "载入"}
                          </button>
                          <button
                            onClick={() => deletePiFromHistory(entry.id)}
                            className="rounded-md border border-red-200 px-2 py-1.5 text-sm font-medium text-red-500 hover:border-red-400 hover:text-red-600"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">
                历史报价
                <span className="ml-2 text-sm font-normal text-slate-400">
                  {quoteHistory.length} 份
                </span>
              </h3>
              <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                管理报价
              </Link>
            </div>

            {quoteHistory.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
                还没有历史报价。先在报价页保存到报价库后，这里就能直接选择制作 PI。
              </div>
            ) : (
              <div className="space-y-2">
                {quoteHistory.map((entry) => {
                  const isActive = activeHistoryId === entry.id;
                  const total = entry.grandTotal
                    ? `$${Math.round(entry.grandTotal).toLocaleString("en-US")}`
                    : "-";
                  const savedAt = entry.savedAt
                    ? new Date(entry.savedAt).toLocaleDateString("zh-CN", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";

                  return (
                    <div
                      key={entry.id}
                      className={`rounded-md border p-3 transition-colors ${
                        isActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-slate-900">
                              {entry.quotationNo || "未命名报价"}
                            </span>
                            {entry.quotationType && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                                {entry.quotationType}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 truncate text-xs text-slate-500">
                            {entry.companyName || "-"} · {entry.projectName || "-"}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            {entry.quotationDate || "-"} · {entry.elevatorCount || entry.state?.elevators?.length || 0} 台 · {total} · {savedAt}
                          </div>
                        </div>
                        <button
                          onClick={() => makePiFromHistory(entry)}
                          className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold ${
                            isActive
                              ? "bg-blue-700 text-white"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isActive ? "已选择" : "制作 PI"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          </div>
        </section>

        <section className="print-only-full-width overflow-auto rounded-lg bg-white p-4 shadow-sm">
          <div className="mx-auto min-h-[1120px] w-full max-w-[794px] bg-white p-8 text-[11px] leading-tight text-black shadow-sm print:min-h-0 print:w-full print:max-w-none print:p-0 print:text-[12px] print:shadow-none">
            <div className="mb-5">
              <Header />
            </div>
            <div className="text-center">
              <h2 className="text-[18px] font-bold">
                Suzhou Xinfuji Electromechanical Co., Ltd.
              </h2>
              <p className="mt-3">
                Dade Industrial Zone, Taoyuan Town, Wujiang District, Suzhou City, Jiangsu
                Province, China.
              </p>
              <p>
                Tel: {form.sellerTel}&nbsp;&nbsp;&nbsp; Website: www.xinfuji.com&nbsp;&nbsp;&nbsp; E-mail: info@xinfuji.com
              </p>
            </div>

            <h1 className="mt-6 text-center text-[20px] font-bold tracking-wide">
              PROFORMA INVOICE
            </h1>

            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1">
              <PreviewRow label="Messrs.:" value={form.buyerName} />
              <PreviewRow label="Contract No.:" value={form.contractNo} />
              <PreviewRow label="Tel:" value={form.buyerTel} />
              <PreviewRow label="PI No.:" value={piNo} />
              <PreviewRow label="Issue Date:" value={form.issueDate} className="col-start-2" />
              {form.showBuyerEmail && form.buyerEmail && (
                <PreviewRow label="Email:" value={form.buyerEmail} className="col-span-2" />
              )}
              <PreviewRow label="Address:" value={form.buyerAddress} className="col-span-2" />
              {form.showBuyerTaxNo && form.buyerTaxNo && (
                <PreviewRow label="Tax No.:" value={form.buyerTaxNo} className="col-span-2" />
              )}
            </div>

            <table className="mt-6 w-full border-collapse text-center">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-2" rowSpan={2}>
                    No.
                  </th>
                  <th className="border border-black px-2 py-2" colSpan={5}>
                    Commodity Description
                  </th>
                  <th className="border border-black px-2 py-2">Quantity</th>
                  <th className="border border-black px-2 py-2" colSpan={3}>
                    Price ({form.currency})
                  </th>
                </tr>
                <tr>
                  <th className="border border-black px-2 py-2">NAME</th>
                  <th className="border border-black px-2 py-2">Capacity</th>
                  <th className="border border-black px-2 py-2">Speed</th>
                  <th className="border border-black px-2 py-2">F/S</th>
                  <th className="border border-black px-2 py-2">Quantity</th>
                  <th className="border border-black px-2 py-2">Unit</th>
                  <th className="border border-black px-2 py-2">Unit Price</th>
                  <th className="border border-black px-2 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-black px-2 py-2">{index + 1}</td>
                    <td className="border border-black px-2 py-2">{item.name}</td>
                    <td className="border border-black px-2 py-2">{item.capacity}</td>
                    <td className="border border-black px-2 py-2">{item.speed}</td>
                    <td className="border border-black px-2 py-2">{item.floorsStops}</td>
                    <td className="border border-black px-2 py-2">{item.quantity}</td>
                    <td className="border border-black px-2 py-2">{item.unit}</td>
                    <td className="border border-black px-2 py-2 text-right">
                      {formatMoney(Number(item.unitPrice || 0))}
                    </td>
                    <td className="border border-black px-2 py-2 text-right">
                      {formatMoney(Number(item.quantity || 0) * Number(item.unitPrice || 0))}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-black px-2 py-2 text-left font-bold" colSpan={2}>
                    Total:
                  </td>
                  <td className="border border-black px-2 py-2 text-left font-bold" colSpan={5}>
                    {moneyWords(total, form.currency)}
                  </td>
                  <td className="border border-black px-2 py-2 font-bold">{form.currency}</td>
                  <td className="border border-black px-2 py-2 text-right font-bold">
                    {formatMoney(total)}
                  </td>
                </tr>
                {form.showTargetCurrency && (
                  <tr>
                    <td className="border border-black px-2 py-2" colSpan={2} />
                    <td className="border border-black px-2 py-2 text-left font-bold" colSpan={5}>
                      {moneyWords(targetTotal, form.targetCurrency)}
                    </td>
                    <td className="border border-black px-2 py-2 font-bold">
                      {form.targetCurrency}
                    </td>
                    <td className="border border-black px-2 py-2 text-right font-bold">
                      {formatMoney(targetTotal)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-4 space-y-1">
              <PreviewLine label="Description Of Goods:" value={form.goodsDescription} />
              <PreviewLine label="Delivery Terms:" value={form.deliveryTerms} />
              <PreviewLine label="Lead Time:" value={form.leadTime} />
              <PreviewLine label="Payment Terms:" value={form.paymentTerms} />
              <PreviewLine label="Port of Shipment:" value={form.portOfShipment} />
              <PreviewLine label="Destination:" value={form.destination} />
              <PreviewLine label="Country of Origin:" value={form.countryOfOrigin} />
            </div>

            <div className="mt-5">
              <h3 className="font-bold">Bank Information:</h3>
              <div className="mt-1 space-y-1">
                <PreviewLine label="Beneficiary Bank:" value={form.bankName} />
                <PreviewLine label="A/C No:" value={form.accountNo} />
                {form.swiftCode && <PreviewLine label="Swift Code:" value={form.swiftCode} />}
                <PreviewLine label="Bank Address:" value={form.bankAddress} />
                {form.intermediaryBank && (
                  <PreviewLine label="Intermediary Bank:" value={form.intermediaryBank} />
                )}
                {form.intermediarySwift && (
                  <PreviewLine label="Intermediary Swift BIC:" value={form.intermediarySwift} />
                )}
                <PreviewLine label="Beneficiary:" value={form.beneficiary} />
                <PreviewLine label="Add of Beneficiary:" value={form.beneficiaryAddress} />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-12 text-center">
              <div>Buyer (stamp&amp;sign)</div>
              <div>Seller (stamp&amp;sign)</div>
            </div>

            <div className="mt-6">
              <span className="font-bold">Additional Requirements:</span>{" "}
              <span className="whitespace-pre-wrap">{form.additionalRequirements}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="no-print mx-auto grid w-[90vw] grid-cols-1 gap-4 pb-6 lg:grid-cols-2">
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">
              PI 历史
              <span className="ml-2 text-sm font-normal text-slate-400">
                {piHistory.length} 份
              </span>
            </h3>
            {piHistory.length > 0 && (
              <button
                onClick={() => {
                  if (!window.confirm("清空全部 PI 历史？")) return;
                  setPiHistory([]);
                  setActivePiHistoryId(null);
                  localStorage.removeItem(PI_HISTORY_KEY);
                }}
                className="text-sm font-medium text-red-500 hover:text-red-600"
              >
                清空
              </button>
            )}
          </div>

          {piHistory.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
              还没有保存的 PI。填好后点击「保存 PI」，之后可在这里载入。
            </div>
          ) : (
            <div className="space-y-2">
              {piHistory.map((entry) => {
                const isActive = activePiHistoryId === entry.id;
                const savedAt = new Date(entry.savedAt).toLocaleDateString("zh-CN", {
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={entry.id}
                    className={`rounded-md border p-3 transition-colors ${
                      isActive
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 bg-white hover:border-green-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {entry.contractNo}
                        </div>
                        <div className="mt-1 truncate text-xs text-slate-500">
                          {entry.buyerName} · {entry.issueDate}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {entry.currency} {formatMoney(entry.total)} · {savedAt}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => loadPiFromHistory(entry)}
                          className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                            isActive
                              ? "bg-green-700 text-white"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {isActive ? "已载入" : "载入"}
                        </button>
                        <button
                          onClick={() => deletePiFromHistory(entry.id)}
                          className="rounded-md border border-red-200 px-2 py-1.5 text-sm font-medium text-red-500 hover:border-red-400 hover:text-red-600"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">
              历史报价
              <span className="ml-2 text-sm font-normal text-slate-400">
                {quoteHistory.length} 份
              </span>
            </h3>
            <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              管理报价
            </Link>
          </div>

          {quoteHistory.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
              还没有历史报价。先在报价页保存到报价库后，这里就能直接选择制作 PI。
            </div>
          ) : (
            <div className="space-y-2">
              {quoteHistory.map((entry) => {
                const isActive = activeHistoryId === entry.id;
                const total = entry.grandTotal
                  ? `$${Math.round(entry.grandTotal).toLocaleString("en-US")}`
                  : "-";
                const savedAt = entry.savedAt
                  ? new Date(entry.savedAt).toLocaleDateString("zh-CN", {
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <div
                    key={entry.id}
                    className={`rounded-md border p-3 transition-colors ${
                      isActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-slate-900">
                            {entry.quotationNo || "未命名报价"}
                          </span>
                          {entry.quotationType && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                              {entry.quotationType}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 truncate text-xs text-slate-500">
                          {entry.companyName || "-"} · {entry.projectName || "-"}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {entry.quotationDate || "-"} ·{" "}
                          {entry.elevatorCount || entry.state?.elevators?.length || 0} 台 ·{" "}
                          {total} · {savedAt}
                        </div>
                      </div>
                      <button
                        onClick={() => makePiFromHistory(entry)}
                        className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold ${
                          isActive
                            ? "bg-blue-700 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isActive ? "已选择" : "制作 PI"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function PreviewRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-[110px_1fr] gap-2 ${className}`}>
      <span className="font-bold">{label}</span>
      <span className="whitespace-pre-wrap">{value}</span>
    </div>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-2">
      <span className="font-bold">{label}</span>
      <span className="whitespace-pre-wrap">{value}</span>
    </div>
  );
}
